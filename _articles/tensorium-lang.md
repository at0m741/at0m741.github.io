---
layout: default
title: "Tensorium_lang: compiler-visible tensor calculus for numerical relativity"
description: "A web version of the Tensorium_lang paper: an experimental MLIR-based DSL for preserving tensor structure through compiler lowering and generated numerical kernels."
date: 2026-06-19
language: EN
lang: en
parent: Articles
nav_order: 1
math: true
tags:
  - Tensorium_lang
  - MLIR
  - DSL
  - numerical relativity
  - compiler infrastructure
---

<div class="paper-callout">
  <div>
    <div class="paper-eyebrow">Full paper</div>
    <strong>Read the complete Tensorium_lang draft as a PDF.</strong>
    <p>This page is a condensed web version. The PDF keeps the longer compiler notes, appendix, and reference details.</p>
  </div>
  <a class="paper-button" href="{{ '/assets/papers/tensorium-lang.pdf' | relative_url }}">Open PDF</a>
</div>

`Tensorium_lang` is an experimental DSL for making tensorial structure visible
to the compiler. The goal is not to replace a numerical-relativity framework.
The goal is narrower: keep geometric meaning alive from source notation through
typing, IR construction, MLIR lowering, generated kernels, and the host ABI.

Most numerical kernels eventually become loops over arrays. That is necessary
for performance, but it also hides useful information from the compiler. A
field named `gamma` may represent a spatial metric $\gamma_{ij}$, but once it
is just a buffer, the compiler no longer knows its variance, index structure,
metric role, or contraction rules.

Tensorium_lang tries to move that information into the program itself.

## Core idea

The compiler should understand objects such as:

- covariant and contravariant tensor fields
- spacetime metrics and $3+1$ decompositions
- Einstein summation over indexed expressions
- geometric quantities derived from a metric
- generated kernel interfaces and buffer roles

The intended lowering path is:

```tensorium
Tensorium source
  -> parsed AST
  -> semantic tensor typing
  -> Tensorium IR
  -> Tensorium MLIR dialect
  -> grid and metric lowering passes
  -> LLVM-compatible kernels
  -> generated C host ABI
```

This is a compiler experiment first. It is not a complete symbolic
differential-geometry system yet, and it is not a production solver. The current
prototype focuses on whether enough tensor information can survive the lowering
pipeline to make generated numerical kernels safer and easier to inspect.

## Why tensor structure should be compiler-visible

In a normal C or C++ kernel, a tensor contraction is usually encoded as nested
loops and indexing conventions. The mathematical expression

$$
C_{ij} = A_{ik} B^k{}_j
$$

is eventually flattened into buffer access. Once that happens, the compiler can
optimize memory traffic and arithmetic, but it cannot tell whether the
contraction is geometrically valid.

Tensorium_lang keeps the indexed expression explicit long enough for the
compiler to classify the indices:

```tensorium
field cov_tensor2 A[i,k]
field mixed_tensor2 B[k,j]
field cov_tensor2 C[i,j]

C[i,j] = A[i,k] * B[k,j]
```

The index `k` is contracted. The free indices are `i,j`. The result is expected
to be covariant rank two. This gives the compiler a place to reject invalid
expressions before they become loops.

## Tensor typing

Tensorium uses a simple variance model. A tensor type can be described by the
number of upper and lower indices:

$$
\operatorname{type}(T) = (n_{\operatorname{up}}, n_{\operatorname{down}})
$$

For example:

| Source type | Tensor role | Variance |
| --- | --- | --- |
| `scalar` | scalar field | $(0,0)$ |
| `vector` | contravariant vector | $(1,0)$ |
| `covector` | covariant vector | $(0,1)$ |
| `cov_tensor2` | covariant rank-2 tensor | $(0,2)$ |
| `con_tensor2` | contravariant rank-2 tensor | $(2,0)$ |

The source language is intentionally close to the notation used in relativity
notes, but the compiler stores the result as typed IR rather than as text.

```tensorium
field scalar alpha
field vector beta[i]
field cov_tensor2 gamma[i,j]
field con_tensor2 gammaU[i,j]
field cov_tensor2 K[i,j]
```

This matters because expressions involving $\gamma_{ij}$ and
$\gamma^{ij}$ are not just array operations. They encode metric lowering,
raising, contractions, and consistency constraints.

## Metric-derived geometry

The prototype includes a metric-derived geometry path. Given a spatial metric
$\gamma_{ij}$ and inverse metric $\gamma^{ij}$, the compiler can construct
Christoffel symbols using the Levi-Civita expression:

$$
\Gamma^i{}_{jk}
= \frac{1}{2}\gamma^{i\ell}
\left(
\partial_j\gamma_{\ell k}
+ \partial_k\gamma_{\ell j}
- \partial_\ell\gamma_{jk}
\right).
$$

The spatial Ricci tensor can then be represented through the standard
Christoffel contraction:

$$
R_{ij}
= \partial_k \Gamma^k{}_{ij}
- \partial_j \Gamma^k{}_{ik}
+ \Gamma^k{}_{ij}\Gamma^\ell{}_{k\ell}
- \Gamma^\ell{}_{ik}\Gamma^k{}_{j\ell}.
$$

This is the important boundary: the metric is not only input data. It becomes a
source of further compiler-visible geometric objects.

## MLIR lowering

MLIR is useful here because the compiler does not need to jump directly from
Tensorium source to low-level loops. It can lower in stages:

```tensorium
tensorium.metric4
tensorium.decompose3p1_from_metric
tensorium.einsum
tensorium.contract
tensorium.deriv
tensorium.dt_assign
```

The higher-level operations keep intent visible. Later passes can lower them
into grid loops, buffer descriptors, and LLVM-compatible kernels.

An example `einsum` operation should still carry enough metadata to explain
which indices are free and which are contracted:

```tensorium
tensorium.einsum
  lhs = "C[i,j]"
  rhs = "A[i,k] * B[k,j]"
  free = ["i", "j"]
  contracted = ["k"]
```

That information is useful for diagnostics, lowering, and later optimization.

## Schwarzschild reference fixture

The current regression path uses a Schwarzschild spatial metric on a
time-symmetric slice:

$$
\gamma_{ij}
= \operatorname{diag}
\left(
f^{-1}, r^2, r^2\sin^2\theta
\right),
\qquad
f = 1 - \frac{2M}{r}.
$$

For the corresponding $3+1$ fields, the expected lapse and shift are:

$$
\alpha = \sqrt{f},
\qquad
\beta^i = 0.
$$

The fixture checks that the compiler can preserve the metric and derived
fields through the lowering path, generate kernels, and expose them through the
host interface.

```tensorium
Tensorium_cc \
  --tensorium-metric-lower \
  --tensorium-init-std-lower \
  --tensorium-init-grid-affine-lower \
  --tensorium-rhs-grid-affine-lower \
  --tensorium-stencil-lower \
  --emit-llvm tensorium_schwarzschild_bssn_constraints.ll \
  --emit-host-header tensorium_schwarzschild_bssn_constraints_host.h \
  tests/fixtures/gr/schwarzschild_bssn_constraints_analytic_3d.tn
```

The generated module exposes callable kernels such as:

```tensorium
tensorium_init_grid_affine
tensorium_rhs_grid_affine
```

## BSSN constraint surface

The analytic fixture also exercises part of a BSSN-style constraint surface.
For reference, the Hamiltonian and momentum constraints can be written as:

$$
\mathcal{H}
= R + K^2 - K_{ij}K^{ij},
$$

$$
\mathcal{M}_i
= D_j \left(K^j{}_i - \delta^j{}_i K\right).
$$

On the static Schwarzschild slice used by the fixture:

$$
K = 0,
\qquad
\tilde{A}_{ij}=0,
\qquad
D_iD_j\alpha = \alpha R_{ij}.
$$

The regression does not claim that Tensorium automatically derives the full
BSSN system from first principles. It validates an encoded analytic surface and
the compiler infrastructure around it.

## Generated ABI

The compiler emits a host interface so external C or C++ code can bind buffers
to generated kernels. The long-term direction is to make this ABI descriptive
enough that a runtime can understand:

- tensor component counts
- field roles
- coordinate metadata
- grid buffer layout
- RHS update targets
- generated kernel signatures

This is important for connecting a DSL-level formulation to real HPC execution.
The solver still needs time stepping, boundary conditions, distributed memory,
AMR integration, and I/O. Tensorium currently owns the geometric kernel path,
not the full runtime.

## Current limits

The prototype is still incomplete in several important ways:

- it is not a full symbolic differential-geometry engine
- it does not automatically derive complete formulations
- simplification is still limited
- scalar functions such as $f(r)$ are not yet first-class symbolic objects
- host-side runtime generation is still partial
- AMR integration is future work

Those limits are intentional at this stage. The point of the prototype is to
make the compiler boundary precise before building a larger numerical runtime
around it.

## Direction

The next useful steps are:

- stronger symbolic simplification for metric-derived quantities
- formulation-level checks for larger relativistic systems
- better lowering from indexed notation to vectorized kernels
- generated host glue for block-structured execution
- integration experiments with an AMR runtime such as AMReX

The broader direction is to connect theoretical tensor notation to
high-performance kernels without erasing the geometry too early.

## References

- R. Arnowitt, S. Deser, and C. W. Misner. *The dynamics of general relativity*. 1962.
- M. Alcubierre. *Introduction to 3+1 Numerical Relativity*. Oxford University Press, 2008.
- T. W. Baumgarte and S. L. Shapiro. *Numerical Relativity: Solving Einstein's Equations on the Computer*. Cambridge University Press, 2010.
- C. Lattner et al. *MLIR: Scaling compiler infrastructure for domain specific computation*. CGO 2021.
- W. Zhang et al. *AMReX: A framework for block-structured adaptive mesh refinement*. JOSS 2019.

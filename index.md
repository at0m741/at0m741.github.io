---
layout: default
title: Home
nav_order: 1
description: "Personal technical blog for low-level systems, compiler infrastructure, numerical relativity, and high-performance C++."
---

<section class="home-hero">
  <div class="home-copy">
    <div class="home-kicker">Louis Touzalin / at0m741</div>
    <h1 class="home-title">Systems notes at the edge of compilers, numerical kernels, and computational physics.</h1>
    <p class="home-lede">
      I write about low-level programming, C/C++ systems work, compiler tooling, Tensorium_lib, MLIR experiments, and numerical relativity workflows that connect tensor calculus with high-performance computation.
    </p>
    <div class="home-actions">
      <a class="btn btn-primary" href="{{ '/articles/' | relative_url }}">Read articles</a>
      <a class="btn" href="{{ '/projects/' | relative_url }}">View projects</a>
      <a class="btn" href="https://github.com/at0m741">GitHub</a>
    </div>
  </div>
  <div class="home-lab" aria-label="Technical focus map">
    <img src="{{ '/assets/img/systems-map.svg' | relative_url }}" alt="Systems map connecting C++, MLIR, Tensorium, HPC, and numerical relativity">
    <div class="lab-readout">
      <span>stack: C / C++ / MLIR</span>
      <span>runtime: SIMD / OpenMP / MPI</span>
      <span>domain: GR / tensors / kernels</span>
    </div>
  </div>
</section>

## Current focus

<div class="section-row">
  <div class="focus-card">
    <div class="project-meta">Systems</div>
    <h3>C/C++ systems programming</h3>
    <p>Notes around memory layout, runtime behavior, low-level performance constraints, and code that stays close to the hardware boundary.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">Compilers</div>
    <h3>MLIR, DSLs, tensor code generation</h3>
    <p>Experiments around compiler infrastructure for tensor calculus, lowering pipelines, vectorization, and backend design.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">HPC</div>
    <h3>Tensorium_lib and numerical kernels</h3>
    <p>High-performance C++ tensor and linear algebra work with SIMD, OpenMP/MPI-oriented design, and computational physics constraints.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">Physics</div>
    <h3>Numerical relativity from first principles</h3>
    <p>Notes on tensor calculus, general relativity, black hole simulations, elliptic systems, and spectral methods.</p>
  </div>
</div>

## Article queue

<div class="article-list">
{% assign listed_articles = site.articles | where_exp: "article", "article.index_page != true" %}
{% assign article_queue = listed_articles | sort: "date" | reverse %}
{% for article in article_queue limit: 4 %}
  <article class="article-item">
    <div class="meta-line">{{ article.date | date: "%Y-%m-%d" }} · {{ article.language }}{% if article.status == "planned" %} · planned{% endif %}</div>
    <h3><a href="{{ article.url | relative_url }}">{{ article.title }}</a></h3>
    <p>{{ article.description }}</p>
    <div class="tag-list">
      {% for tag in article.tags limit: 5 %}
        <span>{{ tag }}</span>
      {% endfor %}
    </div>
  </article>
{% endfor %}
</div>

## Project index

<div class="project-list">
{% for project in site.data.projects limit: 4 %}
  <article class="project-item">
    <div class="project-meta">{{ project.status }}</div>
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
  </article>
{% endfor %}
</div>

---
layout: default
title: Home
nav_order: 1
description: "Personal technical blog for low-level systems, compiler infrastructure, numerical relativity, and high-performance C++."
---

<section class="home-hero">
  <div class="home-copy">
    <div class="home-kicker">Louis Touzalin</div>
    <h1 class="home-title">Compiler infrastructure and numerical software for tensor-based computation.</h1>
    <p class="home-lede">
      I am the creator of the open-source TensoriumCore foundation. My work focuses on Tensorium_lib, Tensorium_lang, MLIR-based compiler infrastructure, high-performance C++ kernels, and numerical relativity workflows for BSSN/Z4-style systems.
    </p>
    <div class="home-actions">
      <a class="btn btn-primary" href="{{ '/articles/' | relative_url }}">Read articles</a>
      <a class="btn" href="{{ '/projects/' | relative_url }}">View projects</a>
      <a class="btn" href="https://github.com/TensoriumCore">TensoriumCore</a>
      <a class="btn" href="https://github.com/at0m741">GitHub</a>
    </div>
  </div>
</section>

## Current focus

<div class="section-row">
  <div class="focus-card">
    <div class="project-meta">Numerical relativity</div>
    <h3>BSSN/Z4 formulations and relativistic systems</h3>
    <p>Work on tensor-calculus tooling, constraint systems, BSSN/Z4-style formulations, elliptic problems, and numerical infrastructure for general relativity.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">HPC</div>
    <h3>Tensorium_lib and numerical kernels</h3>
    <p>TensoriumCore development around tensor and linear-algebra kernels, SIMD-aware layouts, and C++ abstractions for high-performance scientific computing.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">Compilers</div>
    <h3>MLIR, DSLs, tensor code generation</h3>
    <p>Compiler infrastructure for preserving tensor structure through semantic analysis, MLIR dialects, lowering passes, generated kernels, and host ABIs.</p>
  </div>
  <div class="focus-card">
    <div class="project-meta">Systems</div>
    <h3>C/C++ systems programming</h3>
    <p>Low-level implementation work around memory layout, ABI boundaries, runtime behavior, and performance constraints close to the hardware.</p>
  </div>
</div>

## Latest articles

<div class="article-list">
{% assign listed_articles = site.articles | where_exp: "article", "article.index_page != true" %}
{% assign published_articles = listed_articles | sort: "date" | reverse %}
{% for article in published_articles limit: 4 %}
  <article class="article-item">
    <div class="meta-line">{{ article.date | date: "%Y-%m-%d" }} · {{ article.language }}</div>
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

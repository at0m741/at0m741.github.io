---
layout: default
title: "Home"
description: "Personal technical blog and portfolio for low-level systems, compiler infrastructure, numerical relativity, and high-performance C++."
---
<section class="home-shell">
  <div class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Louis Touzalin / at0m741</p>
      <h1>Technical notes from systems, compilers, and computational physics.</h1>
      <p class="hero-tagline">Low-level systems, compiler infrastructure, numerical relativity, and high-performance C++.</p>
      <p class="hero-intro">I work on low-level programming, C/C++ systems code, compiler tooling, Tensorium_lib, MLIR experiments, and numerical relativity workflows that connect tensor calculus with high-performance computation.</p>
      <div class="cta-row" aria-label="Primary actions">
        <a class="button primary" href="{{ '/articles/' | relative_url }}">Read articles</a>
        <a class="button" href="{{ '/projects/' | relative_url }}">View projects</a>
        <a class="button" href="https://github.com/at0m741">GitHub</a>
      </div>
    </div>
    <aside class="hero-visual" aria-label="Profile summary">
      <div class="avatar-frame">
        <img src="{{ '/assets/img/avatar.svg' | relative_url }}" alt="at0m741 technical avatar">
      </div>
      <div class="signal-panel">
        <div><span>focus</span><span>systems / compilers</span></div>
        <div><span>stack</span><span>C++ / MLIR / SIMD</span></div>
        <div><span>domain</span><span>numerical relativity</span></div>
      </div>
    </aside>
  </div>

  <section class="section" aria-labelledby="latest-articles">
    <div class="section-header">
      <h2 id="latest-articles">Latest Articles</h2>
      <a href="{{ '/articles/' | relative_url }}">All articles</a>
    </div>
    <div class="grid">
      {% assign latest_articles = site.articles | where_exp: "article", "article.status != 'planned'" | sort: "date" | reverse %}
      {% for article in latest_articles limit: 3 %}
        <a class="card" href="{{ article.url | relative_url }}">
          <div class="card-meta">
            <span>{{ article.date | date: "%Y-%m-%d" }}</span>
            <span>{{ article.language | upcase }}</span>
          </div>
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
          <div class="tag-list">
            {% for tag in article.tags limit: 4 %}
              <span>{{ tag }}</span>
            {% endfor %}
          </div>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="section" aria-labelledby="research-projects">
    <div class="section-header">
      <h2 id="research-projects">Research / Projects</h2>
      <a href="{{ '/projects/' | relative_url }}">Project index</a>
    </div>
    <div class="grid two">
      {% for project in site.data.projects limit: 4 %}
        <article class="project-card">
          <div class="project-status">{{ project.status }}</div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="tag-list">
            {% for tag in project.tags limit: 4 %}
              <span>{{ tag }}</span>
            {% endfor %}
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <section class="section" aria-labelledby="links">
    <div class="section-header">
      <h2 id="links">Links</h2>
      <a href="{{ '/links/' | relative_url }}">Full list</a>
    </div>
    <div class="grid">
      <a class="link-card" href="https://github.com/at0m741">
        <span class="link-label">GitHub</span>
        <h3>at0m741</h3>
        <p>Repositories, experiments, and public code.</p>
      </a>
      <a class="link-card" href="{{ '/articles/' | relative_url }}">
        <span class="link-label">Notes</span>
        <h3>Technical articles</h3>
        <p>Low-level iOS security archives and future compiler/HPC writing.</p>
      </a>
      <a class="link-card" href="{{ '/about/' | relative_url }}">
        <span class="link-label">Profile</span>
        <h3>About</h3>
        <p>Background, current technical interests, and research direction.</p>
      </a>
    </div>
  </section>
</section>

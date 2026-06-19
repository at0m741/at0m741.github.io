---
layout: default
title: Projects
nav_order: 3
permalink: /projects/
description: "Research and engineering work around high-performance C++, compiler infrastructure, low-level systems, and numerical relativity."
---

# Projects

<div class="index-readout">
  <span>axis: systems -> compilers -> HPC</span>
  <span>language: C / C++ / MLIR</span>
  <span>domain: tensor calculus and numerical relativity</span>
</div>

<div class="project-list">
{% for project in site.data.projects %}
  <article class="project-item">
    <div class="project-meta">{{ project.status }}</div>
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <div class="tag-list">
      {% for tag in project.tags %}
        <span>{{ tag }}</span>
      {% endfor %}
    </div>
    {% if project.url %}
      {% if project.url contains "://" %}
        <p><a href="{{ project.url }}">Open</a></p>
      {% else %}
        <p><a href="{{ project.url | relative_url }}">Open</a></p>
      {% endif %}
    {% endif %}
  </article>
{% endfor %}
</div>

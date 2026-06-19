---
layout: page
title: "Projects"
description: "Research and engineering work around high-performance C++, compiler infrastructure, low-level systems, and numerical relativity."
---
<div class="grid two">
  {% for project in site.data.projects %}
    <article class="project-card">
      <div class="project-status">{{ project.status }}</div>
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <div class="tag-list">
        {% for tag in project.tags %}
          <span>{{ tag }}</span>
        {% endfor %}
      </div>
      {% if project.url %}
        {% if project.url contains "://" %}
          <a href="{{ project.url }}">Open</a>
        {% else %}
          <a href="{{ project.url | relative_url }}">Open</a>
        {% endif %}
      {% endif %}
    </article>
  {% endfor %}
</div>

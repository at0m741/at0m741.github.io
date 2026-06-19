---
layout: default
title: Articles
nav_order: 2
has_children: true
permalink: /articles/
index_page: true
description: "Technical notes and research logs."
---

# Articles

Existing French iBoot/iOS articles are preserved here as normal articles. English translations can be added later without changing the site structure.

<div class="index-readout">
  <span>archive: iBoot / low-level iOS</span>
  <span>incoming: Tensorium / MLIR / numerical relativity</span>
  <span>format: notes, experiments, implementation logs</span>
</div>

<div class="article-list">
{% assign articles = site.articles | where_exp: "article", "article.index_page != true" | sort: "date" | reverse %}
{% for article in articles %}
  <article class="article-item">
    <div class="meta-line">
      {{ article.date | date: "%Y-%m-%d" }} · {{ article.language }}{% if article.status == "planned" %} · planned{% endif %}
    </div>
    <h3><a href="{{ article.url | relative_url }}">{{ article.title }}</a></h3>
    <p>{{ article.description }}</p>
    <div class="tag-list">
      {% for tag in article.tags %}
        <span>{{ tag }}</span>
      {% endfor %}
    </div>
  </article>
{% endfor %}
</div>

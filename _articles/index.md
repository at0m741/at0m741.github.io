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

Technical notes and implementation logs currently available on the site.

<div class="article-list">
{% assign articles = site.articles | where_exp: "article", "article.index_page != true" | sort: "nav_order" %}
{% for article in articles %}
  <article class="article-item">
    <div class="meta-line">
      {{ article.date | date: "%Y-%m-%d" }} · {{ article.language }}
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

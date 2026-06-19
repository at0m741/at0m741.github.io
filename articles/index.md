---
layout: page
title: "Articles"
description: "Technical notes and research logs. Existing French iBoot/iOS articles are preserved here while future English translations are prepared."
---
<div class="grid">
  {% assign articles = site.articles | sort: "date" | reverse %}
  {% for article in articles %}
    <a class="card status-{{ article.status | default: 'published' }}" href="{{ article.url | relative_url }}">
      <div class="card-meta">
        <span>{{ article.date | date: "%Y-%m-%d" }}</span>
        <span>{{ article.language | upcase }}</span>
      </div>
      <h3>{{ article.title }}</h3>
      <p>{{ article.description }}</p>
      <div class="tag-list">
        {% for tag in article.tags %}
          <span>{{ tag }}</span>
        {% endfor %}
      </div>
    </a>
  {% endfor %}
</div>

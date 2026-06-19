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

| Date | Language | Article | Tags |
| --- | --- | --- | --- |
{% assign articles = site.articles | where_exp: "article", "article.index_page != true" | sort: "date" | reverse %}
{% for article in articles %}
| {{ article.date | date: "%Y-%m-%d" }} | {{ article.language }} | [{{ article.title }}]({{ article.url | relative_url }})<br>{{ article.description }} | {{ article.tags | join: ", " }}{% if article.status == "planned" %}<br>_Planned_{% endif %} |
{% endfor %}

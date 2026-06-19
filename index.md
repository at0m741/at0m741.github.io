---
layout: default
title: Home
nav_order: 1
description: "Personal technical blog for low-level systems, compiler infrastructure, numerical relativity, and high-performance C++."
---

# Louis Touzalin / at0m741

Low-level systems, compiler infrastructure, numerical relativity, and high-performance C++.

I work on low-level programming, C/C++ systems code, compiler tooling, Tensorium_lib, MLIR experiments, and numerical relativity workflows that connect tensor calculus with high-performance computation.

[Read articles]({{ '/articles/' | relative_url }}){: .btn .btn-primary }
[View projects]({{ '/projects/' | relative_url }}){: .btn }
[GitHub](https://github.com/at0m741){: .btn }

## Latest articles

{% assign listed_articles = site.articles | where_exp: "article", "article.index_page != true" %}
{% assign latest_articles = listed_articles | where_exp: "article", "article.status != 'planned'" | sort: "date" | reverse %}
{% for article in latest_articles limit: 4 %}
- [{{ article.title }}]({{ article.url | relative_url }})
  {{ article.date | date: "%Y-%m-%d" }} · {{ article.language }} · {{ article.description }}
{% endfor %}

## Research / projects

- **Tensorium_lib**: high-performance C++ tensor, linear algebra, and numerical relativity library.
- **Tensorium compiler / DSL**: compiler infrastructure for tensor calculus and numerical relativity workflows.
- **MLIR experiments**: dialects, lowering pipelines, vectorization, and backend experiments.
- **iBoot / iOS low-level security notes**: archived notes around Apple bootchain internals.

## Site contents

- [Articles]({{ '/articles/' | relative_url }})
- [Projects]({{ '/projects/' | relative_url }})
- [Links]({{ '/links/' | relative_url }})
- [About]({{ '/about/' | relative_url }})

---
layout: default
title: Projects
nav_order: 3
permalink: /projects/
description: "Research and engineering work around high-performance C++, compiler infrastructure, low-level systems, and numerical relativity."
---

# Projects

{% for project in site.data.projects %}
## {{ project.title }}

**Status:** {{ project.status }}<br>
**Tags:** {{ project.tags | join: ", " }}

{{ project.description }}

{% if project.url %}
{% if project.url contains "://" %}
[Open]({{ project.url }}){: .btn .btn-outline }
{% else %}
[Open]({{ project.url | relative_url }}){: .btn .btn-outline }
{% endif %}
{% endif %}

{% endfor %}

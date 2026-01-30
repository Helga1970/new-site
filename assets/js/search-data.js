---
layout: none
---
window.store = {
  {% for post in site.recipes %}
    "recipe-{{ forloop.index }}": {
      "type": "recipe",
      "title": {{ post.title | jsonify }},
      "url": "{{ post.url | relative_url }}",
      "featured_image": "{{ post.featured_image | relative_url }}",
      "content": {{ post.content | strip_html | strip_newlines | truncatewords: 20 | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

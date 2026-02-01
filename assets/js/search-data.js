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
      "categories": {{ post.categories | jsonify }},
      "tags": {{ post.tags | jsonify }},
      "book": {
        "title": {{ post.book.title | jsonify }},
        "slug": {{ post.book.title_slug | jsonify }},
        "cover": "{{ post.book.cover | relative_url }}",
        "link": "{{ post.book.link | jsonify }}"
      },
      "content": {{ post.content | strip_html | strip_newlines | truncatewords: 100 | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

---
layout: none
---
window.store = {
  {% for post in site.recipes %}
    "recipe-{{ forloop.index }}": {
      "title": {{ post.title | jsonify }},
      "url": "{{ post.url | relative_url }}",
      "featured_image": "{{ post.featured_image | relative_url }}",
      "categories": {{ post.categories | jsonify }},
      "tags": {{ post.tags | jsonify }},
      "book_title": {{ post.book.title | jsonify }},
      "book_slug": {{ post.book.title_slug | jsonify }},
      "book_cover": "{{ post.book.cover | relative_url }}",
      "book_link": "{{ post.book.link }}"
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

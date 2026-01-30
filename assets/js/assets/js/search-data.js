---
layout: none
---
window.store = {
  {% comment %} 1. Сначала индексируем все рецепты {% endcomment %}
  {% for post in site.recipes %}
    "recipe-{{ forloop.index }}": {
      "type": "recipe",
      "title": {{ post.title | jsonify }},
      "category": {{ post.categories | join: ', ' | jsonify }},
      "content": {{ post.content | strip_html | strip_newlines | truncatewords: 50 | jsonify }},
      "url": "{{ post.url | relative_url }}",
      "featured_image": "{{ post.featured_image | relative_url }}",
      "book_title": {{ post.book.title | jsonify }},
      "content_preview": {{ post.content | strip_html | truncatewords: 15 | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% if forloop.last and site.books.size > 0 %},{% endif %}
  {% endfor %}

  {% comment %} 2. Затем индексируем книги (если у вас есть коллекция _books) {% endcomment %}
  {% for book in site.books %}
    "book-{{ forloop.index }}": {
      "type": "book",
      "title": {{ book.title | jsonify }},
      "cover": "{{ book.cover | relative_url }}",
      "url": "{{ book.url | relative_url }}",
      "content": {{ book.description | strip_html | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

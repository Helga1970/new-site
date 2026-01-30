---
layout: none
---
window.store = {
  {% assign all_items = site.recipes | concat: site.books %}
  {% for item in all_items %}
    "item-{{ forloop.index }}": {
      "type": "{% if item.layout == 'recipe' or item.recipe %}recipe{% else %}book{% endif %}",
      "title": {{ item.title | jsonify }},
      "category": {{ item.categories | join: ', ' | jsonify }},
      "url": "{{ item.url | relative_url }}",
      "featured_image": "{{ item.featured_image | relative_url }}",
      "cover": "{{ item.cover | relative_url }}",
      "book_title": {{ item.book.title | jsonify }},
      "content": {{ item.content | strip_html | strip_newlines | truncatewords: 50 | jsonify }},
      "content_preview": {{ item.content | strip_html | truncatewords: 15 | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

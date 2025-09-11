<!DOCTYPE html>
<html lang="en">

{% include head.html %}

<body>
  {% include header.html %}

  <div class="container">
    <div class="row mt-5">
      <div class="col-lg-8 offset-lg-2">
        <!-- Название рецепта -->
        <h1>{{ page.title }}</h1>

        <!-- Название книги -->
        {% if page.book_source %}
        <p class="font-secondary mb-3 font-extra-small">Рецепт из книги: {{ page.book_source | capitalize }}</p>
        {% endif %}

        <!-- Основное изображение -->
        {% if page.featured_image %}
        <img src="{{ page.featured_image | relative_url }}" alt="{{ page.title }}" class="img-fluid mb-4">
        {% endif %}

        <!-- Ингредиенты -->
        {% if page.recipe.ingredients_markdown %}
        <div class="recipe-ingredients mb-4">
          {{ page.recipe.ingredients_markdown | markdownify }}
        </div>
        {% endif %}

        <!-- Приготовление -->
        {% if page.recipe.directions_markdown %}
        <div class="recipe-directions mb-4">
          {{ page.recipe.directions_markdown | markdownify }}
        </div>
        {% endif %}

        <!-- Контент поста -->
        <div class="post-content mb-4">
          {{ page.content }}
        </div>
      </div>
    </div>
  </div>

  <script src="{{ site.baseurl }}/assets/plugins/jQuery/jquery.min.js"></script>
  <script src="{{ site.baseurl }}/assets/plugins/bootstrap/bootstrap.min.js"></script>
  <script src="{{ site.baseurl }}/assets/plugins/slick/slick.min.js"></script>
  <script src="{{ site.baseurl }}/assets/plugins/imagesloaded/imagesloaded.pkgd.js"></script>
  <script src="{{ site.baseurl }}/assets/plugins/masonry/masonry.js"></script>
  <script src="{{ site.baseurl }}/assets/plugins/smooth-scroll/smooth-scroll.js"></script>
  <script src="{{ site.baseurl }}/assets/js/script.js"></script>
</body>

</html>

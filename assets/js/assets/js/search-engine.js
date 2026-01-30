(function() {
  const ITEMS_PER_PAGE = 20; // Сколько рецептов показывать за раз
  let currentVisibleItems = ITEMS_PER_PAGE;
  let allResults = [];
  let filteredResults = [];

  function displayResults() {
    const recipesContainer = document.getElementById('search-results');
    const booksContainer = document.getElementById('books-container');
    const booksSection = document.getElementById('books-section');
    const loadMoreBtn = document.getElementById('load-more');

    // Очистка перед отрисовкой
    recipesContainer.innerHTML = '';
    booksContainer.innerHTML = '';

    // 1. Сначала выводим Книги (без пагинации, все найденные)
    const foundBooks = allResults.filter(item => item.type === 'book');
    if (foundBooks.length > 0) {
      booksSection.classList.remove('d-none');
      document.getElementById('books-count').innerText = `Книги (${foundBooks.length})`;
      foundBooks.forEach(book => {
        booksContainer.innerHTML += `
          <div class="book-card" style="min-width: 150px; text-align: center;">
            <a href="${book.url}">
              <img src="${book.cover}" alt="${book.title}" style="width: 120px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <p class="mt-2 small" style="color: #333; line-height: 1.2;">${book.title}</p>
            </a>
          </div>`;
      });
    }

    // 2. Выводим Рецепты с учетом пагинации
    const recipes = filteredResults.filter(item => item.type === 'recipe');
    document.getElementById('recipes-count').innerText = `Рецепты (${recipes.length})`;

    const itemsToDisplay = recipes.slice(0, currentVisibleItems);
    itemsToDisplay.forEach(item => {
      recipesContainer.innerHTML += `
        <div class="col-lg-3 col-sm-6 mb-5 masonry-item">
          <div class="card p-0 border-0 rounded-0 hover-shadow">
            <a href="${item.url}">
              <img class="img-fluid" src="${item.featured_image}" alt="${item.title}">
              <div class="card-body">
                <p class="small text-muted mb-1">Рецепт из книги: <span style="color: #fa8569;">${item.book_title}</span></p>
                <h4>${item.title}</h4>
                <p>${item.content_preview}</p>
                <a href="${item.url}" class="text-uppercase font-weight-bold" style="color: #fa8569; font-size: 0.8rem;">Открыть рецепт</a>
              </div>
            </a>
          </div>
        </div>`;
    });

    // Управление кнопкой "Показать еще"
    if (recipes.length > currentVisibleItems) {
      loadMoreBtn.classList.remove('d-none');
    } else {
      loadMoreBtn.classList.add('d-none');
    }

    // Инициализация Masonry (если есть изображения)
    imagesLoaded(recipesContainer, function() {
      new Masonry(recipesContainer, { itemSelector: '.masonry-item', percentPosition: true });
    });
  }

  // Логика кнопки "Показать еще"
  document.getElementById('load-more').addEventListener('click', function() {
    currentVisibleItems += ITEMS_PER_PAGE;
    displayResults();
  });

  // Получение запроса из URL и запуск Lunr
  const searchTerm = new URLSearchParams(window.location.search).get('query');
  if (searchTerm && window.store) {
    document.getElementById('search-box').value = searchTerm;

    const idx = lunr(function () {
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');
      this.ref('id');

      Object.keys(window.store).forEach(key => this.add({ id: key, ...window.store[key] }));
    });

    const results = idx.search(searchTerm);
    allResults = results.map(r => window.store[r.ref]);
    filteredResults = [...allResults]; // Изначально фильтры не применены
    
    displayResults();
  }
})();

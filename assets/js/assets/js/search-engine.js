(function() {
  const ITEMS_PER_PAGE = 20;
  let currentVisibleItems = ITEMS_PER_PAGE;
  let allResults = [];
  let filteredResults = [];
  let currentFilter = 'Все';

  function displayResults() {
    const recipesContainer = document.getElementById('search-results');
    const booksContainer = document.getElementById('books-container');
    const booksSection = document.getElementById('books-section');
    const loadMoreBtn = document.getElementById('load-more');

    if (!recipesContainer) return;

    recipesContainer.innerHTML = '';
    booksContainer.innerHTML = '';

    // 1. Вывод Книг
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
    } else {
      booksSection.classList.add('d-none');
    }

    // 2. Вывод Рецептов
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
                <p class="small text-muted mb-1">Рецепт из книги: <span style="color: #fa8569;">${item.book_title || '—'}</span></p>
                <h4>${item.title}</h4>
                <p>${item.content_preview || ''}</p>
                <span class="text-uppercase font-weight-bold" style="color: #fa8569; font-size: 0.8rem;">Открыть рецепт</span>
              </div>
            </a>
          </div>
        </div>`;
    });

    if (recipes.length > currentVisibleItems) {
      loadMoreBtn.classList.remove('d-none');
    } else {
      loadMoreBtn.classList.add('d-none');
    }

    refreshMasonry();
  }

  function renderFilters(results) {
    const filterContainer = document.getElementById('dynamic-filters');
    if (!filterContainer) return;
    
    const recipesOnly = results.filter(item => item.type === 'recipe');
    const categories = [...new Set(recipesOnly.flatMap(r => r.category ? r.category.split(', ') : []))];
    
    if (categories.length > 0) {
      filterContainer.innerHTML = `<button class="filter-btn active" onclick="applyFilter('Все')">Все</button>`;
      filterContainer.innerHTML += categories.map(cat => `
        <button class="filter-btn" onclick="applyFilter('${cat}')">${cat}</button>
      `).join('');
    } else {
      filterContainer.innerHTML = '';
    }
  }

  window.applyFilter = function(category) {
    currentFilter = category;
    currentVisibleItems = ITEMS_PER_PAGE;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerText === category);
    });

    if (category === 'Все') {
      filteredResults = [...allResults];
    } else {
      filteredResults = allResults.filter(item => 
        item.type === 'book' || (item.category && item.category.includes(category))
      );
    }
    displayResults();
  };

  function refreshMasonry() {
    const container = document.querySelector('#search-results');
    if (container && typeof imagesLoaded !== 'undefined' && typeof Masonry !== 'undefined') {
      imagesLoaded(container, function() {
        new Masonry(container, {
          itemSelector: '.masonry-item',
          percentPosition: true
        });
      });
    }
  }

  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      currentVisibleItems += ITEMS_PER_PAGE;
      displayResults();
    });
  }

  // Запуск поиска
  const rawQuery = new URLSearchParams(window.location.search).get('q');
  if (rawQuery && window.store) {
    const searchTerm = rawQuery.toLowerCase().trim();
    document.getElementById('search-box').value = searchTerm;

    const idx = lunr(function () {
      // Отключаем стандартный стеммер, чтобы не портить русские окончания
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);

      this.field('title');
      this.field('category');
      this.field('content');
      this.ref('id');

      Object.keys(window.store).forEach(key => {
        const item = window.store[key];
        this.add({
          id: key,
          title: (item.title || "").toLowerCase(),
          category: (item.category || "").toLowerCase(),
          content: (item.content || "").toLowerCase()
        });
      });
    });

    // Поиск по слову + поиск по части слова (для гибкости)
    const results = idx.search(`${searchTerm} ${searchTerm}*`);
    allResults = results.map(r => window.store[r.ref]);
    filteredResults = [...allResults];
    
    renderFilters(allResults);
    displayResults();
  }
})();

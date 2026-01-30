(function() {
  const ITEMS_PER_PAGE = 20;
  let allResults = [];
  let filteredResults = [];

  function displayResults() {
    const recipesContainer = document.getElementById('search-results');
    const recipesCount = document.getElementById('recipes-count');
    if (!recipesContainer) return;

    recipesContainer.innerHTML = '';

    const recipes = filteredResults.filter(item => item.type === 'recipe');
    if (recipesCount) recipesCount.innerText = `Рецепты (${recipes.length})`;

    if (recipes.length === 0) {
      recipesContainer.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
      return;
    }

    recipes.forEach(item => {
      // Здесь мы используем именно те поля, которые есть в твоем файле
      recipesContainer.innerHTML += `
        <div class="col-lg-3 col-sm-6 mb-5 masonry-item">
          <div class="card p-0 border-0 rounded-0 hover-shadow">
            <a href="${item.url}">
              <img class="img-fluid" src="${item.featured_image}" alt="${item.title}">
              <div class="card-body">
                <p class="small text-muted mb-1">Категория: <span style="color: #fa8569;">${item.category || 'Общее'}</span></p>
                <h4>${item.title}</h4>
                <p>${item.content.substring(0, 100)}...</p> 
                <span class="text-uppercase font-weight-bold" style="color: #fa8569; font-size: 0.8rem;">Открыть рецепт</span>
              </div>
            </a>
          </div>
        </div>`;
    });
  }

  // Запуск поиска
  const rawQuery = new URLSearchParams(window.location.search).get('q');
  if (rawQuery && window.store) {
    const searchTerm = decodeURIComponent(rawQuery).toLowerCase().trim();
    const searchBox = document.getElementById('search-box');
    if (searchBox) searchBox.value = searchTerm;

    const idx = lunr(function () {
      // ОЧЕНЬ ВАЖНО: Отключаем английские правила для русского языка
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);

      this.field('title');
      this.field('content');
      this.ref('id');

      Object.keys(window.store).forEach(key => {
        const item = window.store[key];
        this.add({
          id: key,
          title: (item.title || "").toLowerCase(),
          content: (item.content || "").toLowerCase()
        });
      });
    });

    // Ищем точное слово и слово с любым окончанием (звездочка *)
    const results = idx.search(`${searchTerm} ${searchTerm}*`);
    allResults = results.map(r => window.store[r.ref]);
    filteredResults = [...allResults];
    
    displayResults();
  }
})();

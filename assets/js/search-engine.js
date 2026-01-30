(function() {
  function displayResults(results) {
    const container = document.getElementById('search-results');
    const recipesCount = document.getElementById('recipes-count');
    if (!container) return;

    container.innerHTML = '';
    if (recipesCount) {
      recipesCount.innerText = "Рецепты (" + results.length + ")";
    }

    if (results.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
      return;
    }

    // Создаем обертку-сетку, чтобы карточки не были на весь экран
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    grid.style.gap = '20px';
    grid.style.width = '100%';

    results.forEach(item => {
      const imageUrl = item.featured_image || '';
      const card = document.createElement('div');
      card.className = 'recipe-card'; // Используем твой рабочий класс
      
      // Верстка в точности как на скрине с категориями
      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit; display: block;">
          <div class="recipe-image-wrapper" style="width: 100%; padding-top: 120%; position: relative; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="${imageUrl}" alt="${item.title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 95%; object-fit: cover;">
          </div>
          <div class="recipe-title-box" style="padding: 15px; text-align: center;">
            <h2 class="recipe-title" style="font-size: 1.1em; margin: 0; color: #333; font-weight: normal;">${item.title}</h2>
          </div>
        </a>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function startSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (!query || !window.store) return;

    const searchTerm = decodeURIComponent(query).toLowerCase().trim();
    const allItems = Object.keys(window.store).map(k => window.store[k]);

    const results = allItems.filter(item => {
      const title = (item.title || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      return title.includes(searchTerm) || content.includes(searchTerm);
    });

    displayResults(results);
  }

  // Задержка для гарантии загрузки window.store
  setTimeout(startSearch, 300);
})();

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
      container.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px;"><h3>Ничего не найдено</h3></div>';
      return;
    }

    // Твоя идеальная сетка: от 1 до 5 карточек в ряд, всегда по центру
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'; 
    grid.style.gap = '25px';
    grid.style.justifyContent = 'center'; 
    grid.style.width = '100%';
    grid.style.maxWidth = '1200px'; 
    grid.style.margin = '0 auto'; 
    grid.style.padding = '20px 0';

    results.forEach(item => {
      const card = document.createElement('div');
      card.style.background = '#fff';
      card.style.border = '1px solid #eee';
      card.style.overflow = 'hidden';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.transition = 'transform 0.2s';
      card.className = 'hover-shadow'; 

      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
          <div style="width: 100%; padding-top: 100%; position: relative;">
            <img src="${item.featured_image}" alt="${item.title}" 
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
            <div>
              <h4 style="font-size: 1rem; margin: 10px 0 10px 0; line-height: 1.3; color: #333;">${item.title}</h4>
            </div>
            <span style="font-size: 0.8rem; font-weight: bold; color: #fa8569; text-transform: uppercase; margin-top: 10px;">ОТКРЫТЬ РЕЦЕПТ</span>
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

    // Подготовка поискового запроса
    const searchTerm = decodeURIComponent(query).toLowerCase().trim();
    const allItems = Object.keys(window.store).map(k => window.store[k]);

    const results = allItems.filter(item => {
      // Прямой поиск по названию (Title) — теперь это приоритет №1
      const title = (item.title || "").toLowerCase();
      // Поиск по описанию/контенту
      const content = (item.content || "").toLowerCase();

      // Скрипт выдаст результат, если слово есть В НАЗВАНИИ или В ОПИСАНИИ
      return title.indexOf(searchTerm) !== -1 || content.indexOf(searchTerm) !== -1;
    });

    displayResults(results);
  }

  // Запуск
  setTimeout(startSearch, 300);
})();

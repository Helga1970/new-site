(function() {
  function displayResults(results) {
    var container = document.getElementById('search-results');
    var recipesCount = document.getElementById('recipes-count');
    if (!container) return;

    container.innerHTML = '';
    if (recipesCount) {
      recipesCount.innerText = "Рецепты (" + results.length + ")";
    }

    if (results.length === 0) {
      container.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px;"><h3>Ничего не найдено</h3></div>';
      return;
    }

    // Создаем контейнер-сетку
    var grid = document.createElement('div');
    grid.style.display = 'grid';
    // ЖЕСТКО: 5 колонок на широком экране, авто-подстройка на маленьком
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(210px, 1fr))';
    grid.style.gap = '20px';
    grid.style.width = '100%';
    grid.style.maxWidth = '1200px'; // Ширина твоего контента
    grid.style.margin = '0 auto'; // Магия центровки: одинаковые отступы слева и справа
    grid.style.justifyContent = 'center';

    results.forEach(function(item) {
      var card = document.createElement('div');
      card.className = 'hover-shadow';
      card.style.background = '#fff';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.width = '100%';

      card.innerHTML = 
        '<a href="' + item.url + '" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">' +
          '<div style="width: 100%; padding-top: 100%; position: relative; overflow: hidden;">' +
            '<img src="' + item.featured_image + '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">' +
          '</div>' +
          '<div style="padding: 15px; flex-grow: 1; display: flex; align-items: center; justify-content: center; text-align: center; min-height: 70px;">' +
            '<h4 style="font-size: 0.95rem; margin: 0; line-height: 1.3; color: #333; font-weight: normal;">' + item.title + '</h4>' +
          '</div>' +
        '</a>';
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function startSearch() {
    var urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get('q');
    
    if (!query || !window.store) return;

    var searchTerm = decodeURIComponent(query).toLowerCase().trim();
    var keys = Object.keys(window.store);
    var results = [];

    for (var i = 0; i < keys.length; i++) {
      var item = window.store[keys[i]];
      var title = (item.title || "").toLowerCase();
      var content = (item.content || "").toLowerCase();
      // Ищем везде
      if (title.indexOf(searchTerm) !== -1 || content.indexOf(searchTerm) !== -1) {
        results.push(item);
      }
    }

    displayResults(results);
  }

  setTimeout(startSearch, 300);
})();

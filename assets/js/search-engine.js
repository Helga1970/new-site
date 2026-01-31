(function() {
  function normalizeText(text) {
    if (!text) return "";
    const map = {'a':'а', 'o':'о', 'c':'с', 'e':'е', 'p':'р', 'x':'х', 'y':'у', 'k':'к', 'm':'м'};
    let fixed = text.toLowerCase().split('').map(char => map[char] || char).join('');
    return fixed.replace(/[^а-яёa-z0-9\s]/g, "").trim(); // Оставил латиницу a-z для слова cookies
  }

  function getStem(word) {
    if (word.length < 4) return word;
    return word.replace(/(а|я|ом|ем|у|ю|и|ы|е|ом|ями|ам|ях|ию|ия|ь|ми|ыми)$/g, "");
  }

  function displayResults(results) {
    const container = document.getElementById('search-results');
    const recipesCount = document.getElementById('recipes-count');
    if (!container) return;
    container.innerHTML = '';
    if (recipesCount) { recipesCount.innerText = "Рецепты (" + results.length + ")"; }
    
    if (results.length === 0) {
      container.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px;"><h3>Ничего не найдено</h3></div>';
      return;
    }

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
      card.className = 'hover-shadow';
      card.style.background = '#fff';
      card.style.border = '1px solid #eee';
      card.style.overflow = 'hidden';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
          <div style="width: 100%; padding-top: 100%; position: relative;">
            <img src="${item.featured_image}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
            <h4 style="font-size: 1rem; margin: 10px 0; line-height: 1.3; color: #333;">${item.title}</h4>
            <span style="font-size: 0.8rem; font-weight: bold; color: #fa8569; text-transform: uppercase;">ОТКРЫТЬ РЕЦЕПТ</span>
          </div>
        </a>`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  function startSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (!query || !window.store) return;

    const searchTerm = normalizeText(decodeURIComponent(query));
    // Теперь мы игнорируем слова короче 2 символов (как "с"), чтобы они не ломали поиск
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length >= 2);
    
    if (searchWords.length === 0) return;

    const allItems = Object.keys(window.store).map(k => window.store[k]);

    const results = allItems.filter(item => {
      const title = normalizeText(item.title);
      const cats = item.categories ? item.categories.map(c => normalizeText(c)).join(" ") : "";
      const tags = item.tags ? item.tags.map(t => normalizeText(t)).join(" ") : "";
      
      const searchHaystack = title + " " + cats + " " + tags;

      // Ключевое исправление: проверяем каждое значимое слово
      return searchWords.every(word => {
        const stem = getStem(word);
        return searchHaystack.includes(stem);
      });
    });

    displayResults(results);
  }

  setTimeout(startSearch, 300);
})();

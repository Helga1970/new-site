(function() {
  function normalizeText(text) {
    if (!text) return "";
    const map = {'a':'а', 'o':'о', 'c':'с', 'e':'е', 'p':'р', 'x':'х', 'y':'у', 'k':'к', 'm':'м'};
    let fixed = text.toLowerCase().split('').map(char => map[char] || char).join('');
    return fixed.replace(/[^а-яё0-9\s]/g, "").trim();
  }

  function getStem(word) {
    if (word.length < 4) return word;
    return word.replace(/(а|я|ом|ем|у|ю|и|ы|е|ом|ями|ам|ях|ию|ия|ь)$/g, "");
  }

  function displayResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;
    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px;"><h3>Ничего не найдено</h3></div>';
      return;
    }

    // --- БЛОК 1: КНИГИ (Горизонтально) ---
    const uniqueBooks = {};
    results.forEach(item => {
      if (item.book && item.book.slug) {
        uniqueBooks[item.book.slug] = item.book;
      }
    });

    const booksArray = Object.values(uniqueBooks);
    if (booksArray.length > 0) {
      const booksSection = document.createElement('div');
      booksSection.style.marginBottom = '40px';
      
      let booksHtml = '<h2 style="font-size: 1.2rem; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Книги</h2>';
      booksHtml += '<div style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin;">';
      
      booksArray.forEach(book => {
        booksHtml += `
          <div style="flex: 0 0 150px; text-align: center;">
            <a href="${book.link}" target="_blank" style="text-decoration: none; color: inherit;">
              <div style="width: 150px; height: 210px; margin-bottom: 10px; overflow: hidden; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <img src="${book.cover}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="font-size: 0.9rem; font-weight: bold; line-height: 1.2; color: #333;">${book.title}</div>
            </a>
          </div>`;
      });
      
      booksHtml += '</div>';
      booksSection.innerHTML = booksHtml;
      container.appendChild(booksSection);
    }

    // --- БЛОК 2: РЕЦЕПТЫ (Сетка) ---
    const recipesCount = results.length;
    const recipesHeader = document.createElement('h2');
    recipesHeader.innerHTML = `Рецепты <span style="color: #999; font-weight: normal;">(${recipesCount})</span>`;
    recipesHeader.style.fontSize = '1.2rem';
    recipesHeader.style.borderBottom = '2px solid #eee';
    recipesHeader.style.paddingBottom = '10px';
    recipesHeader.style.marginBottom = '20px';
    container.appendChild(recipesHeader);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'; 
    grid.style.gap = '25px';
    grid.style.width = '100%';

    results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'hover-shadow';
      card.style.background = '#fff';
      card.style.border = '1px solid #eee';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
          <div style="width: 100%; padding-top: 100%; position: relative;">
            <img src="${item.featured_image}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 15px; flex-grow: 1; text-align: center;">
            <h4 style="font-size: 1rem; margin: 10px 0; color: #333;">${item.title}</h4>
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

    const rawSearch = decodeURIComponent(query);
    const searchTerm = normalizeText(rawSearch);
    
    const searchWords = searchTerm.includes("без") 
      ? [searchTerm] 
      : searchTerm.split(/\s+/).filter(word => word.length > 2);
    
    if (searchWords.length === 0) return;

    const allItems = Object.keys(window.store).map(k => window.store[k]);

    const results = allItems.filter(item => {
      const title = normalizeText(item.title);
      const cats = Array.isArray(item.categories) ? item.categories.join(" ") : (item.categories || "");
      const tags = Array.isArray(item.tags) ? item.tags.join(" ") : (item.tags || "");
      const bookTitle = item.book && item.book.title ? normalizeText(item.book.title) : "";
      
      // Ищем в названии, категориях, тегах и названии книги
      const combinedData = title + " " + cats + " " + tags + " " + bookTitle;

      return searchWords.every(word => {
        const queryPart = word.includes("без") ? word : getStem(word);
        return combinedData.includes(queryPart);
      });
    });
    displayResults(results);
  }

  setTimeout(startSearch, 300);
})();

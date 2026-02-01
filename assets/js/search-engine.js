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

    // 1. Собираем уникальные книги
    const uniqueBooks = {};
    results.forEach(item => {
      if (item.book_slug) {
        uniqueBooks[item.book_slug] = {
          title: item.book_title,
          cover: item.book_cover,
          link: item.book_link
        };
      }
    });

    const booksArray = Object.values(uniqueBooks);
    
    // Вывод книг
    if (booksArray.length > 0) {
      const booksSection = document.createElement('div');
      booksSection.style.marginBottom = '30px';
      let booksHtml = '<h2 style="font-size: 1.2rem; border-bottom: 1px solid #eee; padding-bottom: 10px;">Книги</h2>';
      booksHtml += '<div style="display: flex; gap: 20px; overflow-x: auto; padding: 10px 0;">';
      booksArray.forEach(book => {
        booksHtml += `
          <div style="flex: 0 0 140px; text-align: center;">
            <a href="${book.link}" target="_blank" style="text-decoration: none; color: inherit;">
              <img src="${book.cover}" style="width: 140px; height: 190px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 0.9rem; font-weight: bold; margin-top: 5px;">${book.title}</div>
            </a>
          </div>`;
      });
      booksHtml += '</div>';
      booksSection.innerHTML = booksHtml;
      container.appendChild(booksSection);
    }

    // 2. Вывод рецептов
    const recipesHeader = document.createElement('h2');
    recipesHeader.innerText = `Рецепты (${results.length})`;
    recipesHeader.style.fontSize = '1.2rem';
    container.appendChild(recipesHeader);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    grid.style.gap = '25px';
    grid.style.marginTop = '20px';

    results.forEach(item => {
      const card = document.createElement('div');
      card.style.border = '1px solid #eee';
      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit;">
          <img src="${item.featured_image}" style="width: 100%; height: 200px; object-fit: cover;">
          <div style="padding: 15px; text-align: center;">
            <h4 style="margin: 0; font-size: 1rem;">${item.title}</h4>
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
    const searchWords = searchTerm.includes("без") 
      ? [searchTerm] 
      : searchTerm.split(/\s+/).filter(word => word.length > 2);

    const allItems = Object.values(window.store);

    const results = allItems.filter(item => {
      const title = normalizeText(item.title);
      const cats = Array.isArray(item.categories) ? item.categories.join(" ") : "";
      const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
      const bookT = normalizeText(item.book_title || "");
      
      const combinedData = title + " " + cats + " " + tags + " " + bookT;

      return searchWords.every(word => {
        const queryPart = word.includes("без") ? word : getStem(word);
        return combinedData.includes(queryPart);
      });
    });

    displayResults(results);
  }

  setTimeout(startSearch, 300);
})();

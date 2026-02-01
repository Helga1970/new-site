function displayResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;
    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<div style="text-align: center; padding: 50px;"><h3>Ничего не найдено</h3></div>';
      return;
    }

    // --- БЛОК 1: ВЫВОД КНИГ (ГОРИЗОНТАЛЬНО) ---
    // Собираем уникальные книги по их slug
    const uniqueBooks = [];
    const bookSlugs = new Set();

    results.forEach(item => {
      if (item.book && item.book.slug && !bookSlugs.has(item.book.slug)) {
        bookSlugs.add(item.book.slug);
        uniqueBooks.push(item.book);
      }
    });

    if (uniqueBooks.length > 0) {
      const booksSection = document.createElement('div');
      booksSection.style.marginBottom = '40px';
      
      let booksHtml = '<h2 style="font-size: 1.2rem; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Книги</h2>';
      booksHtml += '<div style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px;">';
      
      uniqueBooks.forEach(book => {
        booksHtml += `
          <div style="flex: 0 0 140px; text-align: center;">
            <a href="${book.link}" target="_blank" style="text-decoration: none; color: inherit;">
              <img src="${book.cover}" style="width: 140px; height: 190px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 8px;">
              <div style="font-size: 0.9rem; font-weight: bold; line-height: 1.2;">${book.title}</div>
            </a>
          </div>`;
      });
      
      booksHtml += '</div>';
      booksSection.innerHTML = booksHtml;
      container.appendChild(booksSection);
    }

    // --- БЛОК 2: ВЫВОД РЕЦЕПТОВ (СЕТКА) ---
    const recipesHeader = document.createElement('h2');
    recipesHeader.innerText = `Рецепты (${results.length})`;
    recipesHeader.style.fontSize = '1.2rem';
    recipesHeader.style.marginBottom = '15px';
    recipesHeader.style.border-bottom = '1px solid #eee';
    recipesHeader.style.paddingBottom = '10px';
    container.appendChild(recipesHeader);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    grid.style.gap = '25px';

    results.forEach(item => {
      const card = document.createElement('div');
      card.style.background = '#fff';
      card.style.border = '1px solid #eee';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit;">
          <div style="width: 100%; padding-top: 100%; position: relative;">
            <img src="${item.featured_image}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 15px; text-align: center;">
            <h4 style="font-size: 1rem; margin: 10px 0;">${item.title}</h4>
            <span style="font-size: 0.8rem; font-weight: bold; color: #fa8569;">ОТКРЫТЬ РЕЦЕПТ</span>
          </div>
        </a>`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

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

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    grid.style.gap = '30px';
    grid.style.justifyContent = 'center';
    grid.style.width = '100%';
    grid.style.maxWidth = '1200px';
    grid.style.margin = '0 auto';

    results.forEach(item => {
      const card = document.createElement('div');
      card.style.background = '#fff';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.className = 'hover-shadow'; // Твоя тень из CSS

      card.innerHTML = `
        <a href="${item.url}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
          <div style="width: 100%; padding-top: 100%; position: relative; overflow: hidden;">
            <img src="${item.featured_image}" alt="${item.title}" 
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </div>
          
          <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column; text-align: center;">
            
            <p style="font-size: 0.75rem; color: #fa8569; text-transform: uppercase; margin: 0 0 15px 0; font-weight: bold; letter-spacing: 1px;">
              РЕЦЕПТ
            </p>
            
            <h4 style="font-size: 1.1rem; margin: 0 0 20px 0; line-height: 1.4; color: #333; font-weight: normal; flex-grow: 1;">
              ${item.title}
            </h4>
            
            <span style="font-size: 0.85rem; font-weight: bold; color: #fa8569; text-transform: uppercase; letter-spacing: 1px; margin-top: auto; padding-top: 10px;">
              ОТКРЫТЬ
            </span>
          </div>
        </a>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

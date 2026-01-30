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

  // Создаем обертку для Masonry, как в твоем HTML
  const row = document.createElement('div');
  row.className = 'row masonry-container';

  results.forEach(item => {
    const itemDiv = document.createElement('div');
    // Используем твои родные классы для плитки
    itemDiv.className = 'col-lg-3 col-sm-6 mb-5 masonry-item';
    
    // Верстка карточки один-в-один из твоего файла
    itemDiv.innerHTML = `
      <div class="card p-0 border-0 rounded-0 hover-shadow">
        <a href="${item.url}">
          <img class="img-fluid rounded-top rounded-0" src="${item.featured_image}" alt="feature-image">
          <div class="card-body" style="position: relative; padding-bottom: 60px;">
            <p class="font-secondary mb-3 mt-1 font-extra-small">
              Рецепт из книги: <span style="color: #fa8569; font-weight: bold;">${item.book_title || ''}</span>
            </p>
            <h4 class="mb-3">${item.title}</h4>
            <p class="font-secondary mb-4">${item.content ? item.content.substring(0, 100) + '...' : ''}</p>
            <span class="text-uppercase font-primary font-extra-small" style="color: #fa8569; font-weight: bold; position: absolute; bottom: 15px; left: 0; right: 0; text-align: center;">
              Открыть рецепт
            </span>
          </div>
        </a>
      </div>
    `;
    row.appendChild(itemDiv);
  });

  container.appendChild(row);

  // Инициализация Masonry (если библиотека загружена на странице)
  if (typeof imagesLoaded !== 'undefined' && typeof Masonry !== 'undefined') {
    imagesLoaded(row, function() {
      new Masonry(row, {
        itemSelector: '.masonry-item',
        percentPosition: true,
        gutter: 0 // В Bootstrap сетке отступы через col- классы
      });
    });
  }
}

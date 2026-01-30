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

    // Создаем строку-контейнер для сетки Bootstrap
    let htmlContent = '<div class="row pt-5">';

    results.forEach(item => {
      // Верстка в точности по твоему образцу
      htmlContent += `
        <div class="col-lg-3 col-sm-6 mb-5">
          <div class="card p-0 border-0 rounded-0 hover-shadow" style="height: 100%; min-height: 450px;">
            <a href="${item.url}">
              <img class="img-fluid rounded-top rounded-0" src="${item.featured_image}" alt="${item.title}" style="width: 100%; height: 250px; object-fit: cover;">
              <div class="card-body" style="position: relative; padding-bottom: 60px;">
                <p class="font-secondary mb-3 mt-1 font-extra-small">
                  Рецепт из книги: <span style="color: #fa8569; font-weight: bold;">${item.book_title || 'Книга'}</span>
                </p>
                <h4 class="mb-3" style="color: #333;">${item.title}</h4>
                <p class="font-secondary mb-4" style="color: #666;">${item.content ? item.content.substring(0, 80) + '...' : ''}</p>
                <span class="text-uppercase font-primary font-extra-small" style="color: #fa8569; font-weight: bold; position: absolute; bottom: 15px; left: 0; right: 0; text-align: center;">
                  Открыть рецепт
                </span>
              </div>
            </a>
          </div>
        </div>`;
    });

    htmlContent += '</div>';
    container.innerHTML = htmlContent;
  }

  function startSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (!query || !window.store) {
      console.log("Ожидание данных или запроса...");
      return;
    }

    const searchTerm = decodeURIComponent(query).toLowerCase().trim();
    const allItems = Object.keys(window.store).map(k => window.store[k]);

    const results = allItems.filter(item => {
      const title = (item.title || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      return title.includes(searchTerm) || content.includes(searchTerm);
    });

    displayResults(results);
  }

  // Запуск через короткую паузу
  setTimeout(startSearch, 200);
})();

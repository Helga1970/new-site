(function() {
  let allResults = [];

  function displayResults(results) {
    const container = document.getElementById('search-results');
    if (!container) {
        console.error("Ошибка: Не найден контейнер 'search-results' на странице!");
        return;
    }

    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
      return;
    }

    results.forEach(item => {
      container.innerHTML += `
        <div class="col-lg-3 col-sm-6 mb-5">
          <div class="card p-0 border-0 rounded-0">
            <a href="${item.url}">
              <img class="img-fluid" src="${item.featured_image}" alt="${item.title}">
              <div class="card-body">
                <p class="small text-muted mb-1">${item.category || ''}</p>
                <h4>${item.title}</h4>
                <p>${item.content ? item.content.substring(0, 80) : ''}...</p>
              </div>
            </a>
          </div>
        </div>`;
    });
  }

  const rawQuery = new URLSearchParams(window.location.search).get('q');
  if (rawQuery && window.store) {
    const searchTerm = decodeURIComponent(rawQuery).toLowerCase().trim();
    
    // Инициализация Lunr
    const idx = lunr(function () {
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);
      this.field('title');
      this.field('content');
      this.ref('id');

      Object.keys(window.store).forEach(key => {
        this.add({
          id: key,
          title: (window.store[key].title || "").toLowerCase(),
          content: (window.store[key].content || "").toLowerCase()
        });
      });
    });

    const results = idx.search(`${searchTerm} ${searchTerm}*`);
    allResults = results.map(r => window.store[r.ref]);
    
    console.log("Найдено совпадений:", allResults.length);
    displayResults(allResults);
  }
})();

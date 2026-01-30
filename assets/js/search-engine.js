(function() {
  var container = document.getElementById('search-results');
  var recipesCount = document.getElementById('recipes-count');
  
  function startSearch() {
    var urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get('q');
    
    // Если слова нет или данные не загрузились — выходим
    if (!query || !window.store) {
      console.log("Данные еще не готовы или нет запроса");
      return;
    }

    var searchTerm = decodeURIComponent(query).toLowerCase().trim();
    var allItems = Object.keys(window.store).map(function(k) { return window.store[k]; });

    // Простой фильтр, как в твоих категориях
    var results = allItems.filter(function(item) {
      var title = (item.title || "").toLowerCase();
      var content = (item.content || "").toLowerCase();
      return title.indexOf(searchTerm) !== -1 || content.indexOf(searchTerm) !== -1;
    });

    // Вывод на экран
    if (recipesCount) { recipesCount.innerText = "Рецепты (" + results.length + ")"; }
    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
      return;
    }

    results.forEach(function(item) {
      container.innerHTML += 
        '<div class="col-lg-3 col-sm-6 mb-5">' +
          '<div class="card p-0 border-0 rounded-0 shadow-sm">' +
            '<a href="' + item.url + '">' +
              '<img class="img-fluid" src="' + (item.featured_image || "") + '" alt="' + item.title + '">' +
              '<div class="card-body">' +
                '<h4>' + item.title + '</h4>' +
                '<span style="color: #fa8569; font-weight: bold;">ОТКРЫТЬ</span>' +
              '</div>' +
            '</a>' +
          '</div>' +
        '</div>';
    });
  }

  // Ждем 500мс, чтобы файл search-data.js точно успел загрузиться в память
  setTimeout(startSearch, 500);
})();

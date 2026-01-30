(function() {
  function displayResults(results) {
    var container = document.getElementById('search-results');
    var recipesCount = document.getElementById('recipes-count');
    if (!container) return;

    container.innerHTML = '';
    if (recipesCount) { recipesCount.innerText = "Рецепты (" + results.length + ")"; }

    if (results.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
      return;
    }

    for (var i = 0; i < results.length; i++) {
      var item = results[i];
      var preview = item.content ? item.content.substring(0, 100) : "";
      container.innerHTML += 
        '<div class="col-lg-3 col-sm-6 mb-5">' +
          '<div class="card p-0 border-0 rounded-0 shadow-sm">' +
            '<a href="' + item.url + '">' +
              '<img class="img-fluid" src="' + item.featured_image + '" alt="' + item.title + '">' +
              '<div class="card-body">' +
                '<p class="small text-muted mb-1">' + (item.category || "") + '</p>' +
                '<h4 style="color: #333;">' + item.title + '</h4>' +
                '<p class="small text-muted">' + preview + '...</p>' +
                '<span style="color: #fa8569; font-weight: bold; font-size: 0.8rem;">ОТКРЫТЬ</span>' +
              '</div>' +
            '</a>' +
          '</div>' +
        '</div>';
    }
  }

  var query = new URLSearchParams(window.location.search).get('q');
  if (query && window.store) {
    var searchTerm = decodeURIComponent(query).toLowerCase().trim();
    var idx = lunr(function () {
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);
      this.field('title');
      this.field('content');
      this.ref('id');
      Object.keys(window.store).forEach(function(key) {
        this.add({
          id: key,
          title: (window.store[key].title || "").toLowerCase(),
          content: (window.store[key].content || "").toLowerCase()
        });
      }, this);
    });

    var results = idx.search(searchTerm + " " + searchTerm + "*");
    var foundItems = results.map(function(r) { return window.store[r.ref]; });
    displayResults(foundItems);
  }
})();

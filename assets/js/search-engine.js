(function() {
    const container = document.getElementById('search-results');
    const recipesCount = document.getElementById('recipes-count');
    
    // 1. Берем запрос из адреса
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (!query || !container) return;

    const searchTerm = decodeURIComponent(query).toLowerCase().trim();

    // 2. Идем за данными ТАК ЖЕ, как это делает твоя рабочая страница
    // Мы берем общий файл со всеми рецептами
    fetch('/assets/js/search-data.js')
        .then(response => response.text())
        .then(text => {
            // Превращаем текст файла в объект данных
            // (Так как search-data.js обычно начинается с window.store =)
            const jsonData = text.replace('window.store = ', '').replace(/;$/, '');
            const store = JSON.parse(jsonData);

            // 3. Фильтруем данные вручную (без Lunr, чтобы не было ошибок)
            const results = Object.keys(store).map(key => store[key]).filter(item => {
                return item.title.toLowerCase().includes(searchTerm) || 
                       (item.content && item.content.toLowerCase().includes(searchTerm));
            });

            // 4. Отрисовываем результат в твоем дизайне
            render(results);
        })
        .catch(err => console.error("Ошибка загрузки данных поиска:", err));

    function render(results) {
        container.innerHTML = '';
        if (recipesCount) recipesCount.innerText = `Рецепты (${results.length})`;

        if (results.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><h3>Ничего не найдено</h3></div>';
            return;
        }

        results.forEach(item => {
            container.innerHTML += `
                <div class="col-lg-3 col-sm-6 mb-5">
                    <div class="card p-0 border-0 rounded-0 shadow-sm">
                        <a href="${item.url}">
                            <img class="img-fluid" src="${item.featured_image}" alt="${item.title}">
                            <div class="card-body">
                                <h4 style="color: #333;">${item.title}</h4>
                                <span style="color: #fa8569; font-weight: bold; font-size: 0.8rem;">ЧИТАТЬ</span>
                            </div>
                        </a>
                    </div>
                </div>`;
        });
    }
})();

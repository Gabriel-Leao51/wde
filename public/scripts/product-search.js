(function () {
  const input = document.getElementById('product-search');
  const resultsList = document.getElementById('product-search-results');

  if (!input || !resultsList) {
    return;
  }

  const MIN_QUERY_LENGTH = 2;
  const DEBOUNCE_MS = 250;
  let debounceTimer;

  function clearResults() {
    resultsList.innerHTML = '';
    resultsList.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  }

  function renderResults(products) {
    resultsList.innerHTML = '';

    if (!products || products.length === 0) {
      clearResults();
      return;
    }

    for (const product of products) {
      const item = document.createElement('li');
      item.setAttribute('role', 'option');

      const link = document.createElement('a');
      link.href = `/products/${product.id}`;
      link.textContent = `${product.title} - $${product.price.toFixed(2)}`;

      item.appendChild(link);
      resultsList.appendChild(item);
    }

    resultsList.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      clearResults();
      return;
    }

    debounceTimer = setTimeout(function () {
      fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          renderResults(data.results);
        })
        .catch(function () {
          clearResults();
        });
    }, DEBOUNCE_MS);
  });

  document.addEventListener('click', function (event) {
    if (event.target !== input && !resultsList.contains(event.target)) {
      clearResults();
    }
  });
})();

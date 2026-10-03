const ordersTable = document.getElementById('orders-table');

if (ordersTable) {
  const tbody = ordersTable.querySelector('tbody');
  const sortableHeaders = ordersTable.querySelectorAll('th[data-sort]');
  const ascendingByColumn = {};

  function compareValues(valueA, valueB, type) {
    if (type === 'number') {
      return parseFloat(valueA) - parseFloat(valueB);
    }
    if (type === 'date') {
      return new Date(valueA) - new Date(valueB);
    }
    return valueA.localeCompare(valueB);
  }

  function sortByColumn(column, type) {
    const ascending = !ascendingByColumn[column];
    ascendingByColumn[column] = ascending;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort(function (rowA, rowB) {
      const result = compareValues(rowA.dataset[column], rowB.dataset[column], type);
      return ascending ? result : -result;
    });

    for (const row of rows) {
      tbody.appendChild(row);
    }

    return ascending;
  }

  for (const header of sortableHeaders) {
    header.addEventListener('click', function () {
      const column = header.dataset.sort;
      const type = header.dataset.sortType;
      const ascending = sortByColumn(column, type);

      for (const otherHeader of sortableHeaders) {
        otherHeader.setAttribute('aria-sort', 'none');
      }
      header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    });
  }
}

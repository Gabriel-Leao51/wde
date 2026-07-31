const launchDateInput = document.getElementById('launchDate');

if (launchDateInput) {
  flatpickr(launchDateInput, {
    dateFormat: 'Y-m-d',
    allowInput: true,
  });
}

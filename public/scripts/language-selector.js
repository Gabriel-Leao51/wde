// nav-items.ejs is rendered twice (desktop nav + mobile menu), so this
// targets every instance by class rather than relying on a single id.
const langSelects = document.querySelectorAll('.lang-select');

langSelects.forEach(function (select) {
  select.addEventListener('change', function () {
    location.href = '/lang/' + select.value;
  });
});

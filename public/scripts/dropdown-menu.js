// Every `.dropdown` in the header (language, account, theme) gets its own open/close state.
document.querySelectorAll('.dropdown').forEach(function (dropdown) {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  const menu = dropdown.querySelector('.dropdown-menu');

  function closeMenu() {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  trigger.addEventListener('click', function (event) {
    event.stopPropagation();
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });

  dropdown.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      trigger.focus();
    }
  });
});

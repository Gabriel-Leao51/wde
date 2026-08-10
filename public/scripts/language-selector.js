// nav-items.ejs is rendered twice (desktop nav + mobile menu), so every
// instance gets its own independent open/close state.
const langSwitchers = document.querySelectorAll('.lang-switcher');

langSwitchers.forEach(function (switcher) {
  const trigger = switcher.querySelector('.lang-trigger');
  const menu = switcher.querySelector('.lang-menu');

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
    if (!switcher.contains(event.target)) {
      closeMenu();
    }
  });

  switcher.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      trigger.focus();
    }
  });
});

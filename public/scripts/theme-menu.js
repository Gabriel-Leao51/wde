// The choice lives in a plain `theme` cookie (read by middlewares/theme.js so the first paint is
// already right), never the server session. "System" removes both the cookie and the attribute.
(function () {
  const buttons = document.querySelectorAll('[data-theme-choice]');
  const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

  function applyTheme(choice) {
    if (choice === 'system') {
      document.documentElement.removeAttribute('data-theme');
      document.cookie = 'theme=; path=/; max-age=0; SameSite=Lax';
    } else {
      document.documentElement.setAttribute('data-theme', choice);
      document.cookie = `theme=${choice}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
    }

    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(button.dataset.themeChoice);

      const menu = button.closest('.dropdown-menu');
      menu.hidden = true;
      menu.parentElement.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
  });
})();

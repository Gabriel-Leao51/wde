const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const siteNavElement = document.getElementById('site-nav');

function setMobileMenu(isOpen) {
  siteNavElement.classList.toggle('open', isOpen);
  mobileMenuBtnElement.setAttribute('aria-expanded', String(isOpen));
}

function isMobileMenuOpen() {
  return siteNavElement.classList.contains('open');
}

mobileMenuBtnElement.addEventListener('click', () => setMobileMenu(!isMobileMenuOpen()));

// Escape closes the panel and hands focus back to the button that opened it.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !event.defaultPrevented && isMobileMenuOpen()) {
    setMobileMenu(false);
    mobileMenuBtnElement.focus();
  }
});

// A tap anywhere outside the panel and its button closes it, as on most phone sites. This listens
// for pointerdown, not click: iOS Safari fires no click for a tap on a non-interactive element.
document.addEventListener('pointerdown', (event) => {
  if (
    isMobileMenuOpen() &&
    !siteNavElement.contains(event.target) &&
    !mobileMenuBtnElement.contains(event.target)
  ) {
    setMobileMenu(false);
  }
});

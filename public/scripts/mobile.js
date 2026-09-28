const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const siteNavElement = document.getElementById('site-nav');

function toggleMobileMenu() {
  const isOpen = siteNavElement.classList.toggle('open');
  mobileMenuBtnElement.setAttribute('aria-expanded', String(isOpen));
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);

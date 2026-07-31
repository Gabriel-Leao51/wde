const TOAST_DURATION_MS = 4000;
const TOAST_FADE_MS = 250;

const toastContainer = document.getElementById('toast-container');

// Exposed globally (not a module) so every other page script can call it
// without an import step - matches the plain <script defer> setup used
// throughout this app, no bundler.
window.showToast = function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' toast-' + type : '');
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Force a style flush so the transition below actually animates in,
  // instead of the class being applied before the initial state paints.
  void toast.offsetWidth;
  toast.classList.add('toast-visible');

  setTimeout(function () {
    toast.classList.remove('toast-visible');
    // A second fixed timeout instead of listening for `transitionend`:
    // that event doesn't reliably fire when the tab isn't actively
    // compositing (backgrounded/inactive tabs, some automated browser
    // contexts), which would leave the toast stuck in the DOM forever.
    setTimeout(function () {
      toast.remove();
    }, TOAST_FADE_MS);
  }, TOAST_DURATION_MS);
};

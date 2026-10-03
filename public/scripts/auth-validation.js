// Inline validation for the login, signup and OTP forms. The browser's own constraint checks
// (required, type=email, minlength, pattern) still block the submit; this only swaps its popup
// bubbles for messages under each field, linked with aria-describedby and aria-invalid.
(function () {
  const form = document.querySelector('form[data-validate]');
  const messages = document.getElementById('validation-messages');
  if (!form || !messages) return;

  const text = messages.dataset;

  function messageFor(input) {
    const state = input.validity;
    if (state.valueMissing) return text.required;
    if (state.typeMismatch) return text.email;
    if (state.customError) return text.emailMismatch;
    if (state.tooShort) return input.name === 'postal' ? text.postalLength : text.passwordLength;
    if (state.patternMismatch) return text.code;
    return input.validationMessage;
  }

  function show(input) {
    const error = document.getElementById(`${input.id}-error`);
    error.textContent = messageFor(input);
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', error.id);
  }

  function clear(input) {
    const error = document.getElementById(`${input.id}-error`);
    error.hidden = true;
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function check(input) {
    const other = input.dataset.match && form.elements[input.dataset.match];
    if (other) {
      input.setCustomValidity(input.value && input.value !== other.value ? text.emailMismatch : '');
    }
    if (input.checkValidity()) {
      clear(input);
    } else {
      show(input);
    }
  }

  const fields = Array.from(form.querySelectorAll('input[id]:not([type="hidden"])'));

  fields.forEach((input) => {
    // Suppress the browser bubble; the form still refuses to submit.
    input.addEventListener('invalid', (event) => {
      event.preventDefault();
      show(input);
      if (fields.find((f) => !f.checkValidity()) === input) input.focus();
    });
    input.addEventListener('blur', () => {
      if (input.value) check(input);
    });
    input.addEventListener('input', () => {
      if (input.hasAttribute('aria-invalid')) check(input);
      const confirmation = fields.find((f) => f.dataset.match === input.id);
      if (confirmation && confirmation.value) check(confirmation);
    });
  });

  // The browser validates before any submit event, so refresh the match rule on the click itself.
  form.querySelector('button').addEventListener('click', () => {
    form.querySelectorAll('[data-match]').forEach(check);
  });
})();

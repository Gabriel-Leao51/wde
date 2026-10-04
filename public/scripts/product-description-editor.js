const descriptionEditorElement = document.getElementById('description-editor');
const descriptionInput = document.getElementById('description');

if (descriptionEditorElement && descriptionInput) {
  const quill = new Quill(descriptionEditorElement, {
    theme: 'snow',
    modules: {
      toolbar: ['bold', 'italic', 'underline', 'strike', { list: 'ordered' }, { list: 'bullet' }, 'blockquote', 'link', 'clean'],
    },
  });

  // Quill's toolbar buttons are icon-only and its editable area has no name, so give both one.
  const toolbarLabels = JSON.parse(descriptionEditorElement.dataset.toolbarLabels || '{}');
  quill.getModule('toolbar').container.querySelectorAll('button').forEach(function (button) {
    const format = Array.from(button.classList)
      .find(function (name) { return name.startsWith('ql-'); })
      .slice(3);
    const key = button.value ? format + ':' + button.value : format;
    if (toolbarLabels[key]) {
      button.setAttribute('aria-label', toolbarLabels[key]);
    }
  });
  quill.root.setAttribute('role', 'textbox');
  quill.root.setAttribute('aria-multiline', 'true');
  quill.root.setAttribute('aria-label', descriptionEditorElement.dataset.label);

  quill.on('text-change', function () {
    descriptionInput.value = quill.root.innerHTML;
  });

  descriptionInput.closest('form').addEventListener('submit', function () {
    descriptionInput.value = quill.root.innerHTML;
  });
}

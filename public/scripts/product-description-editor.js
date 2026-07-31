const descriptionEditorElement = document.getElementById('description-editor');
const descriptionInput = document.getElementById('description');

if (descriptionEditorElement && descriptionInput) {
  const quill = new Quill(descriptionEditorElement, {
    theme: 'snow',
    modules: {
      toolbar: ['bold', 'italic', 'underline', 'strike', { list: 'ordered' }, { list: 'bullet' }, 'blockquote', 'link', 'clean'],
    },
  });

  quill.on('text-change', function () {
    descriptionInput.value = quill.root.innerHTML;
  });

  descriptionInput.closest('form').addEventListener('submit', function () {
    descriptionInput.value = quill.root.innerHTML;
  });
}

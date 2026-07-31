const dropzoneElement = document.querySelector('#image-upload-control');
const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);

dropzoneElement.addEventListener('dragover', function(event) {
  event.preventDefault();
  dropzoneElement.classList.add('dragover');
});

dropzoneElement.addEventListener('dragleave', function() {
  dropzoneElement.classList.remove('dragover');
});

dropzoneElement.addEventListener('drop', function(event) {
  event.preventDefault();
  dropzoneElement.classList.remove('dragover');

  const droppedFiles = event.dataTransfer.files;

  if (!droppedFiles || droppedFiles.length === 0) {
    return;
  }

  imagePickerElement.files = droppedFiles;
  updateImagePreview();
});
const deleteProductButtonElements = document.querySelectorAll('.product-item button');
const deleteDialog = document.getElementById('delete-confirm-dialog');
const deleteDialogProductName = document.getElementById('delete-confirm-product-name');
const deleteDialogConfirmButton = document.getElementById('delete-confirm-button');
const deleteDialogCancelButton = document.getElementById('delete-cancel-button');

let pendingDelete = null;

function openDeleteDialog(event) {
  const buttonElement = event.target;
  const productItem = buttonElement.closest('.product-item');
  const productName = productItem.querySelector('h2').textContent;

  pendingDelete = {
    buttonElement: buttonElement,
    productId: buttonElement.dataset.productid,
    csrfToken: buttonElement.dataset.csrf,
  };

  deleteDialogProductName.textContent = productName;
  // showModal() (not show()) is what makes the rest of the page genuinely
  // inert - background buttons stop being clickable/tabbable natively,
  // no hand-rolled focus trap needed.
  deleteDialog.showModal();
}

function cancelDelete() {
  pendingDelete = null;
  deleteDialog.close();
}

async function confirmDelete() {
  if (!pendingDelete) {
    return;
  }

  const { buttonElement, productId, csrfToken } = pendingDelete;
  pendingDelete = null;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE',
  });

  deleteDialog.close();

  if (!response.ok) {
    showToast('Something went wrong!', 'error');
    return;
  }

  buttonElement.closest('li').remove();
  showToast('Product deleted!', 'success');
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', openDeleteDialog);
}

deleteDialogCancelButton.addEventListener('click', cancelDelete);
deleteDialogConfirmButton.addEventListener('click', confirmDelete);

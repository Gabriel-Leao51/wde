const cartItemManagementElements = document.querySelectorAll(
  '.cart-item-management'
);
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function changeQuantity(managementElement, newQuantity) {
  const productId = managementElement.dataset.productid;
  const csrfToken = managementElement.dataset.csrf;

  const decreaseButton = managementElement.querySelector('.quantity-decrease');
  const increaseButton = managementElement.querySelector('.quantity-increase');
  const removeButton = managementElement.querySelector('.remove-item-btn');
  decreaseButton.disabled = true;
  increaseButton.disabled = true;
  removeButton.disabled = true;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: newQuantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    showToast('Something went wrong!', 'error');
    decreaseButton.disabled = false;
    increaseButton.disabled = false;
    removeButton.disabled = false;
    return;
  }

  if (!response.ok) {
    showToast('Something went wrong!', 'error');
    decreaseButton.disabled = false;
    increaseButton.disabled = false;
    removeButton.disabled = false;
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    managementElement.closest('li').remove();
  } else {
    const cartItem = managementElement.closest('.cart-item');
    cartItem.querySelector('.cart-item-price').textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);

    const quantityLabel = managementElement.querySelector('.quantity-label');
    quantityLabel.textContent = newQuantity;
    quantityLabel.dataset.quantity = newQuantity;

    const isNowSingle = newQuantity === 1;
    decreaseButton.classList.toggle('quantity-remove', isNowSingle);
    decreaseButton.setAttribute(
      'aria-label',
      isNowSingle ? decreaseButton.dataset.removeLabel : decreaseButton.dataset.decreaseLabel
    );
    decreaseButton.innerHTML = isNowSingle ? '&#128465;' : '&minus;';
    // innerHTML replaces the element's text, but not the dataset attributes
    // read above - they stay intact on the same <button> element.

    // At quantity 1 the decrease button already doubles as remove, so the
    // standalone remove button only needs to show once there's more than
    // one to save a click on (otherwise there'd be two ways to remove the
    // same item at once, which reads as redundant rather than helpful).
    removeButton.hidden = isNowSingle;

    decreaseButton.disabled = false;
    increaseButton.disabled = false;
    removeButton.disabled = false;
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent =
      responseData.updatedCartData.newTotalQuantity;
  }
}

for (const managementElement of cartItemManagementElements) {
  const decreaseButton = managementElement.querySelector('.quantity-decrease');
  const increaseButton = managementElement.querySelector('.quantity-increase');
  const removeButton = managementElement.querySelector('.remove-item-btn');

  decreaseButton.addEventListener('click', function () {
    const currentQuantity = Number(
      managementElement.querySelector('.quantity-label').dataset.quantity
    );
    changeQuantity(managementElement, currentQuantity - 1);
  });

  increaseButton.addEventListener('click', function () {
    const currentQuantity = Number(
      managementElement.querySelector('.quantity-label').dataset.quantity
    );
    changeQuantity(managementElement, currentQuantity + 1);
  });

  removeButton.addEventListener('click', function () {
    changeQuantity(managementElement, 0);
  });
}

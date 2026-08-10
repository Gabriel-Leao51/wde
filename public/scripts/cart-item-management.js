const cartItemManagementElements = document.querySelectorAll(
  '.cart-item-management'
);
const removeButtons = document.querySelectorAll('.remove-item-btn');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

const REMOVED_MESSAGE_DURATION_MS = 2000;

async function changeQuantity(cartItem, productId, csrfToken, newQuantity) {
  const managementElement = cartItem.querySelector('.cart-item-management');
  const decreaseButton = managementElement.querySelector('.quantity-decrease');
  const increaseButton = managementElement.querySelector('.quantity-increase');
  const removeButton = cartItem.querySelector('.remove-item-btn');

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
    const listItem = cartItem.closest('li');
    const removedMessage = removeButton.dataset.removedMessage;

    cartItem.classList.add('removed');
    cartItem.innerHTML =
      '<p class="cart-item-removed-message">' + removedMessage + '</p>';

    setTimeout(function () {
      listItem.remove();
    }, REMOVED_MESSAGE_DURATION_MS);
  } else {
    cartItem.querySelector('.cart-item-price').textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);

    const quantityLabel = managementElement.querySelector('.quantity-label');
    quantityLabel.textContent = newQuantity;
    quantityLabel.dataset.quantity = newQuantity;

    // Removing is exclusively the standalone button's job now - the stepper
    // only ever moves within the valid 1+ range, so decrease just disables
    // at the floor instead of turning into a second remove control.
    decreaseButton.disabled = newQuantity === 1;
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
  const cartItem = managementElement.closest('.cart-item');
  const decreaseButton = managementElement.querySelector('.quantity-decrease');
  const increaseButton = managementElement.querySelector('.quantity-increase');

  decreaseButton.addEventListener('click', function () {
    const currentQuantity = Number(
      managementElement.querySelector('.quantity-label').dataset.quantity
    );
    changeQuantity(
      cartItem,
      managementElement.dataset.productid,
      managementElement.dataset.csrf,
      currentQuantity - 1
    );
  });

  increaseButton.addEventListener('click', function () {
    const currentQuantity = Number(
      managementElement.querySelector('.quantity-label').dataset.quantity
    );
    changeQuantity(
      cartItem,
      managementElement.dataset.productid,
      managementElement.dataset.csrf,
      currentQuantity + 1
    );
  });
}

for (const removeButton of removeButtons) {
  const cartItem = removeButton.closest('.cart-item');

  removeButton.addEventListener('click', function () {
    changeQuantity(
      cartItem,
      removeButton.dataset.productid,
      removeButton.dataset.csrf,
      0
    );
  });
}

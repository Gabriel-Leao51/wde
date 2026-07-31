const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
  } catch (error) {
    showToast('Something went wrong!', 'error');
    return;
  }

  if (!response.ok) {
    showToast('Something went wrong!', 'error');
    return;
  }

  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }

  showToast('Added to cart!', 'success');
}

addToCartButtonElement.addEventListener('click', addToCart);
let cart = [];

function loadCart() {
  cart = storageGetCart();
}

function saveCart() {
  storageSetCart(cart);
}


function getCart() {
  return [...cart];
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}


function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  let action;

  if (existing) {
    existing.quantity += 1;
    action = 'incremented';
  } else {
    cart.push({
      id:       product.id,
      title:    product.title,
      price:    product.price,
      image:    product.image,
      category: product.category,
      quantity: 1,
    });
    action = 'added';
  }

  saveCart();
  return action;
}

function incrementItem(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += 1;
    saveCart();
  }
}

function decrementItem(productId) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(productId);
    return;
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
}

function clearCart() {
  cart = [];
  storageClearCart();
}
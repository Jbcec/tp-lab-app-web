const cartSidebar   = document.getElementById('cartSidebar');
const cartOverlay   = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const cartEmpty     = document.getElementById('cartEmpty');
const cartFooter    = document.getElementById('cartFooter');
const cartBadge     = document.getElementById('cartBadge');
const cartTotalEl   = document.getElementById('cartTotal');
const cartToggleBtn = document.getElementById('cartToggleBtn');


function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('visible');
  cartSidebar.setAttribute('aria-hidden', 'false');
  cartToggleBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  renderCartSidebar();
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('visible');
  cartSidebar.setAttribute('aria-hidden', 'true');
  cartToggleBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}


function renderCartSidebar() {
  const items = getCart();

  if (items.length === 0) {
    cartItemsList.innerHTML = '';
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'block';

  cartItemsList.innerHTML = items.map(item => `
    <article class="cart-item" data-id="${item.id}" aria-label="${item.title}">

      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
      </div>

      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <div class="cart-qty-controls" role="group" aria-label="Cantidad de ${item.title}">
          <button
            class="qty-btn qty-decrement"
            data-id="${item.id}"
            ${item.quantity <= 1 ? 'disabled' : ''}
            aria-label="Disminuir cantidad"
          >−</button>
          <span class="qty-value" aria-live="polite">${item.quantity}</span>
          <button
            class="qty-btn qty-increment"
            data-id="${item.id}"
            aria-label="Aumentar cantidad"
          >+</button>
        </div>
      </div>

      <button
        class="cart-item-remove"
        data-id="${item.id}"
        aria-label="Eliminar ${item.title} del carrito"
        title="Eliminar"
      >
        <i class="bi bi-trash3" aria-hidden="true"></i>
      </button>

    </article>
  `).join('');

  cartTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;

  cartItemsList.querySelectorAll('.qty-increment').forEach(btn => {
    btn.addEventListener('click', () => {
      incrementItem(Number(btn.dataset.id));
      updateCartBadge();
      renderCartSidebar();
    });
  });

  cartItemsList.querySelectorAll('.qty-decrement').forEach(btn => {
    btn.addEventListener('click', () => {
      decrementItem(Number(btn.dataset.id));
      updateCartBadge();
      renderCartSidebar();
    });
  });

  cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.id));
      updateCartBadge();
      renderCartSidebar();
      showToast('Producto eliminado del carrito.', 'info');
    });
  });
}

function updateCartBadge() {
  const count = getCartCount();
  cartBadge.textContent = count;
  cartBadge.classList.remove('bump');
  void cartBadge.offsetWidth;
  cartBadge.classList.add('bump');
  setTimeout(() => cartBadge.classList.remove('bump'), 300);
}


let currentModalProduct = null;

function openProductModal(product) {
  currentModalProduct = product;

  document.getElementById('modalProductImg').src              = product.image;
  document.getElementById('modalProductImg').alt              = product.title;
  document.getElementById('modalProductCategory').textContent = product.category;
  document.getElementById('modalProductName').textContent     = product.title;
  document.getElementById('modalProductPrice').textContent    = `$${product.price.toFixed(2)}`;
  document.getElementById('modalProductDesc').textContent     = product.description;

  const rating = product.rating?.rate ?? 0;
  const count  = product.rating?.count ?? 0;
  document.getElementById('modalProductRating').innerHTML =
    `${renderStars(rating)} <span>${rating.toFixed(1)} (${count} reseñas)</span>`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).show();
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return [
    ...Array(full).fill('<i class="bi bi-star-fill" aria-hidden="true"></i>'),
    ...Array(half).fill('<i class="bi bi-star-half" aria-hidden="true"></i>'),
    ...Array(empty).fill('<i class="bi bi-star" aria-hidden="true"></i>'),
  ].join('');
}

function showToast(message, icon = 'success') {
  Swal.fire({
    toast: true,
    position: 'bottom-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    background: '#161616',
    color: '#e8e2d9',
    iconColor: icon === 'success' ? '#c9a84c' : undefined,
  });
}

async function showConfirm(title, text) {
  const result = await Swal.fire({
    title, text, icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    background: '#161616',
    color: '#e8e2d9',
    confirmButtonColor: '#c9a84c',
    cancelButtonColor: '#2a2a2a',
    iconColor: '#c9a84c',
  });
  return result.isConfirmed;
}

async function showCheckoutSuccess() {
  await Swal.fire({
    title: '¡Gracias por tu compra!',
    text: 'Tu pedido fue registrado exitosamente. Te contactaremos pronto.',
    icon: 'success',
    confirmButtonText: 'Seguir comprando',
    background: '#161616',
    color: '#e8e2d9',
    confirmButtonColor: '#c9a84c',
    iconColor: '#c9a84c',
  });
}
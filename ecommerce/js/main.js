document.addEventListener('DOMContentLoaded', async () => {

  if (!storageIsLoggedIn()) {
    window.location.replace('login.html');
    return;
  }

  document.getElementById('footerYear').textContent = new Date().getFullYear();

  renderUserMenu();
  loadCart();
  updateCartBadge();
  initNavbarScroll();
  await initApp();
  bindGlobalEvents();
});

async function initApp() {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    allProducts = products;

    renderFilterButtons(categories);

    initCategoriesSwiper(categories);

    renderProductGrid();

  } catch (error) {
    console.error('Error al cargar datos:', error);
    showToast('No se pudieron cargar los productos. Intentá de nuevo más tarde.', 'error');
  } finally {
    loader.style.display = 'none';
  }
}

function bindGlobalEvents() {
  document.getElementById('cartToggleBtn').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
      closeCart();
    }
  });

  document.getElementById('clearCartBtn').addEventListener('click', async () => {
    if (getCartCount() === 0) return;
    const confirmed = await showConfirm(
      '¿Vaciar carrito?',
      'Se eliminarán todos los productos del carrito.'
    );
    if (confirmed) {
      clearCart();
      updateCartBadge();
      renderCartSidebar();
      showToast('Carrito vaciado.', 'info');
    }
  });

  document.getElementById('checkoutBtn').addEventListener('click', async () => {
    if (getCartCount() === 0) return;
    closeCart();
    await showCheckoutSuccess();
    clearCart();
    updateCartBadge();
  });

  document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct);
    updateCartBadge();
    showToast(`"${truncate(currentModalProduct.title, 40)}" agregado al carrito.`, 'success');
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', e => {
    filterBySearch(e.target.value);
  });

  document.getElementById('clearSearchBtn').addEventListener('click', () => {
    searchInput.value = '';
    filterBySearch('');
  });
}

function renderUserMenu() {
  const session = storageGetSession();
  if (!session) return;

  const cartBtn = document.getElementById('cartToggleBtn');

  const wrapper = document.createElement('div');
  wrapper.className = 'luxe-user-menu ms-3';
  wrapper.innerHTML = `
    <span class="user-greeting" aria-label="Usuario activo: ${session.name}">
      <i class="bi bi-person-circle me-1" aria-hidden="true"></i>${session.name}
    </span>
    <button class="logout-btn" id="logoutBtn" aria-label="Cerrar sesión">
      <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
    </button>
  `;

  cartBtn.insertAdjacentElement('afterend', wrapper);

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

async function handleLogout() {
  const confirmed = await showConfirm(
    '¿Cerrar sesión?',
    'Vas a salir de tu cuenta. El carrito se mantendrá guardado.'
  );
  if (!confirmed) return;

  storageClearSession();
  window.location.href = 'login.html';
}

function initNavbarScroll() {
  const navbar = document.querySelector('.luxe-navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
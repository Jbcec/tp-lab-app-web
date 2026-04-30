document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  initNavbarScroll();
  await initApp();
  bindSearchEvents();
});

async function initApp() {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';
  try {
    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
    allProducts = products;
    renderFilterButtons(categories);
    renderProductGrid();
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    loader.style.display = 'none';
  }
}

function bindSearchEvents() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => filterBySearch(e.target.value));
  }
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterBySearch('');
    });
  }
}

function initNavbarScroll() {
  const navbar = document.querySelector('.luxe-navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}
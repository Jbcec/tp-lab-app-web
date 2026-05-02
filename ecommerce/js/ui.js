let currentModalProduct = null;function openProductModal(product) {
  currentModalProduct = product;

  document.getElementById('modalProductImg').src        = product.image;
  document.getElementById('modalProductImg').alt        = product.title;
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
    ...Array(full).fill('<i class="bi bi-star-fill"></i>'),
    ...Array(half).fill('<i class="bi bi-star-half"></i>'),
    ...Array(empty).fill('<i class="bi bi-star"></i>'),
  ].join('');
}

function showToast(message, icon = 'success') {
  Swal.fire({
    toast: true, position: 'bottom-end', icon, title: message,
    showConfirmButton: false, timer: 2800, timerProgressBar: true,
    background: '#161616', color: '#e8e2d9',
    iconColor: icon === 'success' ? '#c9a84c' : undefined,
  });
}

async function showConfirm(title, text) {
  const result = await Swal.fire({
    title, text, icon: 'question', showCancelButton: true,
    confirmButtonText: 'Confirmar', cancelButtonText: 'Cancelar',
    background: '#161616', color: '#e8e2d9',
    confirmButtonColor: '#c9a84c', cancelButtonColor: '#2a2a2a', iconColor: '#c9a84c',
  });
  return result.isConfirmed;
}
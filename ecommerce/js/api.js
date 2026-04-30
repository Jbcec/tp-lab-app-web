const API_BASE = 'https://fakestoreapi.com';

async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error(`Error al obtener productos: ${response.status}`);
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/products/categories`);
  if (!response.ok) throw new Error(`Error al obtener categorías: ${response.status}`);
  return response.json();
}
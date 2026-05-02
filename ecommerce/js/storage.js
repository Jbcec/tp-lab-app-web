const STORAGE_KEYS = {
  CART:    'luxe_cart',
  SESSION: 'luxe_session',
};

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storage] No se pudo guardar "${key}":`, e);
  }
}

function storageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn(`[storage] No se pudo leer "${key}":`, e);
    return null;
  }
}

function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[storage] No se pudo eliminar "${key}":`, e);
  }
}

function storageGetCart() {
  return storageGet(STORAGE_KEYS.CART) ?? [];
}

function storageSetCart(cartItems) {
  storageSet(STORAGE_KEYS.CART, cartItems);
}

function storageClearCart() {
  storageRemove(STORAGE_KEYS.CART);
}

function storageGetSession() {
  return storageGet(STORAGE_KEYS.SESSION);
}

function storageSetSession(userData) {
  storageSet(STORAGE_KEYS.SESSION, userData);
}

function storageClearSession() {
  storageRemove(STORAGE_KEYS.SESSION);
}

function storageIsLoggedIn() {
  return storageGetSession() !== null;
}
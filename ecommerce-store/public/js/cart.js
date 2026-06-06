// ===== LOAD CART FROM localStorage =====
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// ===== SAVE CART TO localStorage =====
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// ===== UPDATE CART COUNT IN NAVBAR =====
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = total;
}

// ===== ADD ITEM TO CART =====
function addToCart(productId) {
  // Check login first
  if (!isLoggedIn()) {
    requireLogin('Please login to add items to your cart!');
    return;
  }

  const product = sampleProducts.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showToast(`✅ ${product.name} added to cart!`);
}

// ===== SHOW TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// ===== RUN ON PAGE LOAD =====
updateCartCount();

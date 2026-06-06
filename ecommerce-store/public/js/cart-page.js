// ===== RENDER CART PAGE =====
let discountApplied = false;

function renderCartPage() {
  const cart = getCart();
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');
  const cartItemsList = document.getElementById('cartItemsList');

  // Show empty or full cart
  if (cart.length === 0) {
    emptyCart.style.display = 'flex';
    cartContent.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartContent.style.display = 'grid';
  cartItemsList.innerHTML = '';

  // Render each cart item
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-product-info">
        <img src="${item.image}"
             alt="${item.name}"
             onerror="this.src='https://via.placeholder.com/75?text=No+Img'"/>
        <div>
          <h4>${item.name}</h4>
          <span>${item.category}</span>
        </div>
      </div>
      <div class="cart-price">$${item.price.toFixed(2)}</div>
      <div class="cart-qty-control">
        <button onclick="updateQty(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <div class="cart-subtotal">$${subtotal.toFixed(2)}</div>
      <button class="btn-remove-item" onclick="removeItem(${item.id})" title="Remove">
        <i class="fas fa-times"></i>
      </button>
    `;
    cartItemsList.appendChild(row);
  });

  updateSummary();
}

// ===== UPDATE QUANTITY =====
function updateQty(productId, change) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeItem(productId);
    return;
  }

  saveCart(cart);
  renderCartPage();
}

// ===== REMOVE ITEM =====
function removeItem(productId) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
  if (item) showToast(`🗑️ ${item.name} removed from cart`);
  renderCartPage();
}

// ===== CLEAR CART =====
function clearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;
  localStorage.removeItem('cart');
  updateCartCount();
  showToast('🗑️ Cart cleared!');
  renderCartPage();
}

// ===== UPDATE ORDER SUMMARY =====
function updateSummary() {
  const cart = getCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  let discount = 0;
  if (discountApplied) discount = subtotal * 0.1;

  const total = subtotal - discount + shipping + tax;

  document.getElementById('summarySubtotal').textContent =
    '$' + subtotal.toFixed(2);
  document.getElementById('summaryShipping').textContent =
    shipping === 0 ? '🎉 Free' : '$' + shipping.toFixed(2);
  document.getElementById('summaryTax').textContent = '$' + tax.toFixed(2);
  document.getElementById('summaryTotal').textContent = '$' + total.toFixed(2);
}

// ===== APPLY COUPON =====
function applyCoupon() {
  const code = document
    .getElementById('couponInput')
    .value.trim()
    .toUpperCase();

  if (code === 'SAVE10') {
    if (discountApplied) {
      showToast('✅ Coupon already applied!');
      return;
    }
    discountApplied = true;
    updateSummary();
    showToast('🎉 Coupon applied! 10% discount added!');
  } else {
    showToast('❌ Invalid coupon code. Try SAVE10');
  }
}

// ===== RUN ON PAGE LOAD =====
renderCartPage();
updateCartCount();

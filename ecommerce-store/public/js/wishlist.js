// ===== GET WISHLIST FROM localStorage =====
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

// ===== SAVE WISHLIST =====
function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishCount();
}

// ===== UPDATE WISH COUNT IN NAVBAR =====
function updateWishCount() {
  const wishlist = getWishlist();
  const countEl = document.getElementById('wishCount');
  if (countEl) countEl.textContent = wishlist.length;
}

// ===== ADD / REMOVE FROM WISHLIST (TOGGLE) =====
// ===== ADD / REMOVE FROM WISHLIST (TOGGLE) =====
function toggleWishlist(productId) {
  // Check login first
  if (!isLoggedIn()) {
    requireLogin('Please login to add items to your wishlist!');
    return;
  }

  const product = sampleProducts.find((p) => p.id === productId);
  if (!product) return;

  let wishlist = getWishlist();
  const exists = wishlist.find((p) => p.id === productId);

  if (exists) {
    wishlist = wishlist.filter((p) => p.id !== productId);
    saveWishlist(wishlist);
    showToast(`💔 ${product.name} removed from wishlist`);
  } else {
    wishlist.push(product);
    saveWishlist(wishlist);
    showToast(`❤️ ${product.name} added to wishlist!`);
  }

  if (document.getElementById('wishlistGrid')) {
    renderWishlist();
  }

  updateHeartIcons();
}

// ===== CHECK IF PRODUCT IS IN WISHLIST =====
function isWishlisted(productId) {
  const wishlist = getWishlist();
  return wishlist.some((p) => p.id === productId);
}

// ===== UPDATE HEART ICONS ON PRODUCT CARDS =====
function updateHeartIcons() {
  document.querySelectorAll('.btn-wish-icon').forEach((btn) => {
    const id = parseInt(btn.getAttribute('data-id'));
    if (isWishlisted(id)) {
      btn.classList.add('wishlisted');
      btn.style.color = '#8b1a2f';
    } else {
      btn.classList.remove('wishlisted');
      btn.style.color = '#ccc';
    }
  });
}

// ===== RENDER WISHLIST PAGE =====
function renderWishlist() {
  const wishlist = getWishlist();
  const grid = document.getElementById('wishlistGrid');
  const emptyEl = document.getElementById('emptyWishlist');
  const footerEl = document.getElementById('wishFooter');
  const countEl = document.getElementById('wishlistCount');

  if (!grid) return;

  // Update count badge
  if (countEl)
    countEl.textContent =
      wishlist.length + (wishlist.length === 1 ? ' item' : ' items');

  if (wishlist.length === 0) {
    emptyEl.style.display = 'flex';
    grid.style.display = 'none';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  grid.style.display = 'grid';
  footerEl.style.display = 'flex';

  grid.innerHTML = '';

  wishlist.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      ${product.discount ? `<span class="wish-badge">${product.discount}</span>` : ''}

      <button class="btn-remove-wish" onclick="toggleWishlist(${product.id})" title="Remove from wishlist">
        <i class="fas fa-times"></i>
      </button>

      <img src="${product.image}" alt="${product.name}"
           onerror="this.src='https://via.placeholder.com/400x220?text=No+Image'"
           onclick="viewProduct(${product.id})"/>

      <div class="wish-card-info">
        <div class="stars">${getStars(product.rating)}</div>
        <p class="wish-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="wish-price-row">
          <span class="price">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="wish-btn-row">
          <button class="btn-wish-cart" onclick="addToCart(${product.id})">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="btn-wish-view" onclick="viewProduct(${product.id})">
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== VIEW PRODUCT DETAIL =====
function viewProduct(productId) {
  const product = sampleProducts.find((p) => p.id === productId);
  if (!product) return;
  localStorage.setItem('selectedProduct', JSON.stringify(product));
  window.location.href = 'product-detail.html';
}

// ===== CLEAR WISHLIST =====
function clearWishlist() {
  if (!confirm('Are you sure you want to clear your wishlist?')) return;
  localStorage.removeItem('wishlist');
  updateWishCount();
  showToast('💔 Wishlist cleared!');
  renderWishlist();
}

// ===== RUN ON PAGE LOAD =====
updateWishCount();
updateCartCount();

if (document.getElementById('wishlistGrid')) {
  renderWishlist();
}

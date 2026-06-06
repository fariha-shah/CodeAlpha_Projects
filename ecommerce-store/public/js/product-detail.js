// ===== LOAD PRODUCT FROM localStorage =====
let currentProduct = null;
let currentQty = 1;

function loadProductDetail() {
  const data = localStorage.getItem('selectedProduct');

  if (!data) {
    window.location.href = 'index.html';
    return;
  }

  currentProduct = JSON.parse(data);

  // Set page title
  document.title = currentProduct.name + ' - ShopEasy';

  // Breadcrumb
  document.getElementById('breadcrumbName').textContent = currentProduct.name;

  // Main image
  document.getElementById('mainImage').src = currentProduct.image;

  // Badge
  const badge = document.getElementById('detailBadge');
  if (currentProduct.discount) {
    badge.textContent = currentProduct.discount;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }

  // Thumbnails (show same image 3 times as demo)
  const thumbRow = document.getElementById('thumbRow');
  thumbRow.innerHTML = '';
  const thumbImages = [
    currentProduct.image,
    currentProduct.image,
    currentProduct.image,
  ];
  thumbImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'thumb-img' + (index === 0 ? ' active' : '');
    img.alt = 'Thumb ' + (index + 1);
    img.onclick = () => {
      document.getElementById('mainImage').src = src;
      document
        .querySelectorAll('.thumb-img')
        .forEach((t) => t.classList.remove('active'));
      img.classList.add('active');
    };
    thumbRow.appendChild(img);
  });

  // Category
  document.getElementById('detailCategory').textContent =
    currentProduct.category.toUpperCase();

  // Name
  document.getElementById('detailName').textContent = currentProduct.name;

  // Stars
  const stars =
    '★'.repeat(currentProduct.rating || 5) +
    '☆'.repeat(5 - (currentProduct.rating || 5));
  document.getElementById('detailStars').textContent =
    stars + ` (${Math.floor(Math.random() * 100) + 20} reviews)`;

  // Price
  document.getElementById('detailPrice').textContent =
    '$' + currentProduct.price.toFixed(2);

  // Old Price
  const oldPriceEl = document.getElementById('detailOldPrice');
  if (currentProduct.oldPrice) {
    oldPriceEl.textContent = '$' + currentProduct.oldPrice.toFixed(2);
  }

  // Discount badge
  const discountEl = document.getElementById('detailDiscount');
  if (currentProduct.discount) {
    discountEl.textContent = currentProduct.discount;
  }

  // Description
  document.getElementById('detailDescription').textContent =
    currentProduct.description;

  // Load related products
  // Load related products
  loadRelated();

  // Update wishlist button state
  updateWishBtn();
}

// ===== QUANTITY CONTROLS =====
function changeQty(change) {
  currentQty = Math.max(1, currentQty + change);
  document.getElementById('qtyDisplay').textContent = currentQty;
}

// ===== ADD TO CART FROM DETAIL PAGE =====
// ===== ADD TO CART FROM DETAIL PAGE =====
function addToCartDetail() {
  // Check login first
  if (!isLoggedIn()) {
    requireLogin('Please login to add items to your cart!');
    return;
  }

  if (!currentProduct) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === currentProduct.id);

  if (existing) {
    existing.quantity += currentQty;
  } else {
    cart.push({ ...currentProduct, quantity: currentQty });
  }

  saveCart(cart);
  showToast(`✅ ${currentQty}x ${currentProduct.name} added to cart!`);
}
// ===== LOAD RELATED PRODUCTS =====
function loadRelated() {
  const related = sampleProducts
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id
    )
    .slice(0, 4);

  const grid = document.getElementById('relatedGrid');
  grid.innerHTML = '';

  if (related.length === 0) {
    grid.innerHTML =
      '<p style="color:#bbb;text-align:center;grid-column:1/-1;">No related products found.</p>';
    return;
  }

  related.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${product.discount ? `<span class="badge">${product.discount}</span>` : ''}
      <img src="${product.image}" alt="${product.name}"
           onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"/>
      <div class="product-info">
        <div class="stars">${'★'.repeat(product.rating || 5)}</div>
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      window.scrollTo(0, 0);
      loadProductDetail();
    });

    grid.appendChild(card);
  });
}

// ===== RUN ON PAGE LOAD =====
// ===== TOGGLE WISHLIST FROM DETAIL PAGE =====
function toggleWishlistDetail() {
  if (!currentProduct) return;
  toggleWishlist(currentProduct.id);
  updateWishBtn();
}

// ===== UPDATE WISH BUTTON APPEARANCE =====
function updateWishBtn() {
  const btn = document.getElementById('wishBtn');
  if (!btn) return;

  if (isWishlisted(currentProduct.id)) {
    btn.style.background = '#8b1a2f';
    btn.style.color = 'white';
    btn.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
  } else {
    btn.style.background = 'white';
    btn.style.color = '#8b1a2f';
    btn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
  }
}

// ===== RUN ON PAGE LOAD =====
loadProductDetail();
updateCartCount();
updateWishCount();

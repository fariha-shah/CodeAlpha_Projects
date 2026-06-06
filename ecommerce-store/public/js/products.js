const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'electronics',
    price: 59.99,
    oldPrice: 79.99,
    discount: '25% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'High quality wireless headphones with noise cancellation.',
  },
  {
    id: 2,
    name: 'Running Shoes',
    category: 'clothing',
    price: 89.99,
    oldPrice: 119.99,
    discount: '25% OFF',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    description: 'Comfortable running shoes for all terrains.',
  },
  {
    id: 3,
    name: 'JavaScript Book',
    category: 'books',
    price: 29.99,
    oldPrice: 39.99,
    discount: '25% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    description: 'Learn JavaScript from scratch with this comprehensive guide.',
  },
  {
    id: 4,
    name: 'Smart Watch',
    category: 'electronics',
    price: 199.99,
    oldPrice: 249.99,
    discount: '20% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Feature-packed smartwatch with health tracking.',
  },
  {
    id: 5,
    name: 'Coffee Maker',
    category: 'home',
    price: 49.99,
    oldPrice: 69.99,
    discount: '28% OFF',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    description: 'Brew the perfect cup of coffee every morning.',
  },
  {
    id: 6,
    name: 'Denim Jacket',
    category: 'clothing',
    price: 69.99,
    oldPrice: 99.99,
    discount: '30% OFF',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400',
    description: 'Classic denim jacket for all seasons.',
  },
  {
    id: 7,
    name: 'Bluetooth Speaker',
    category: 'electronics',
    price: 39.99,
    oldPrice: 54.99,
    discount: '27% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    description: 'Portable speaker with amazing bass and 12hr battery.',
  },
  {
    id: 8,
    name: 'Python Book',
    category: 'books',
    price: 34.99,
    oldPrice: 44.99,
    discount: '22% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    description: 'Master Python programming with real-world projects.',
  },
  {
    id: 9,
    name: 'Face Serum',
    category: 'beauty',
    price: 44.99,
    oldPrice: 59.99,
    discount: '25% OFF',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    description: 'Premium face serum for glowing skin.',
  },
];

// ===== STAR RATINGS =====
function getStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// ===== DISPLAY PRODUCTS =====
function displayProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center;color:#bbb;grid-column:1/-1;padding:40px;">No products found.</p>';
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${product.discount ? `<span class="badge">${product.discount}</span>` : ''}
      <img src="${product.image}" alt="${product.name}"
           onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"/>
      <div class="product-info">
        <div class="stars">${getStars(product.rating)}</div>
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>
       <div class="card-btn-row">
  <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
    <i class="fas fa-cart-plus"></i> Add to Cart
  </button>
  <button class="btn-wish-icon" data-id="${product.id}"
    onclick="event.stopPropagation(); toggleWishlist(${product.id})"
    title="Add to Wishlist">
    <i class="fas fa-heart"></i>
  </button>
</div>
    `;

    card.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      window.location.href = 'product-detail.html';
    });

    grid.appendChild(card);
  });

  // Update heart icons to show wishlisted state
  if (typeof updateHeartIcons === 'function') {
    updateHeartIcons();
  }
}

// ===== FILTER PRODUCTS =====
function filterProducts() {
  const searchInput = document.getElementById('searchInput');
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = sampleProducts.filter((product) => {
    return product.name.toLowerCase().includes(searchText);
  });

  displayProducts(filtered);
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(cat) {
  const filtered =
    cat === 'all'
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === cat);
  displayProducts(filtered);

  // Update active link in cat-nav
  document.querySelectorAll('.cat-nav a').forEach((a) => {
    a.classList.remove('active');
  });
}

// ===== TAB SWITCHER =====
function switchTab(btn, type) {
  document
    .querySelectorAll('.tab-btn')
    .forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  displayProducts(sampleProducts);
}

// ===== SAFE EVENT LISTENERS =====
// These only run if the element exists on the current page
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', filterProducts);
}

// ===== LOAD PRODUCTS ON PAGE LOAD =====
if (document.getElementById('productsGrid')) {
  displayProducts(sampleProducts);
}

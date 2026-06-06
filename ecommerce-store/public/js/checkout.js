// ===== PROTECT CHECKOUT - LOGIN REQUIRED =====
if (!isLoggedIn()) {
  requireLogin('Please login to proceed with checkout!');
} // ===== STATE =====
let selectedPayment = 'card';
let shippingData = {};

// ===== LOAD ORDER SUMMARY ON PAGE LOAD =====
function loadCheckoutSummary() {
  const cart = getCart();
  const itemsContainer = document.getElementById('checkoutItems');
  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'checkout-item-row';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/50?text=No+Img'"/>
      <div class="checkout-item-info">
        <h4>${item.name}</h4>
        <span>Qty: ${item.quantity}</span>
      </div>
      <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    itemsContainer.appendChild(row);
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  document.getElementById('coSubtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('coShipping').textContent =
    shipping === 0 ? '🎉 Free' : '$' + shipping.toFixed(2);
  document.getElementById('coTax').textContent = '$' + tax.toFixed(2);
  document.getElementById('coTotal').textContent = '$' + total.toFixed(2);
}

// ===== SELECT PAYMENT METHOD =====
function selectPayment(el, type) {
  selectedPayment = type;
  document
    .querySelectorAll('.payment-option')
    .forEach((o) => o.classList.remove('active'));
  el.classList.add('active');

  document.getElementById('cardDetails').style.display =
    type === 'card' ? 'block' : 'none';
  document.getElementById('codDetails').style.display =
    type === 'cod' ? 'block' : 'none';
  document.getElementById('paypalDetails').style.display =
    type === 'paypal' ? 'block' : 'none';
}

// ===== FORMAT CARD NUMBER =====
function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

// ===== FORMAT EXPIRY =====
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 2) val = val.substring(0, 2) + ' / ' + val.substring(2);
  input.value = val;
}

// ===== STEP 1 → STEP 2: GO TO PAYMENT =====
function goToPayment() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('checkEmail').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const postal = document.getElementById('postal').value.trim();
  const country = document.getElementById('country').value;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !postal
  ) {
    showToast('⚠️ Please fill in all shipping fields!');
    return;
  }

  // Save shipping data
  shippingData = {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    postal,
    country,
  };

  // Show step 2
  document.getElementById('shippingForm').style.display = 'none';
  document.getElementById('paymentForm').style.display = 'block';

  // Update progress
  document
    .querySelector('.progress-step:nth-child(1)')
    .classList.remove('active');
  document.querySelector('.progress-step:nth-child(1)').classList.add('done');
  document.querySelector('.progress-line:nth-child(2)').classList.add('done');
  document.getElementById('step2').classList.add('active');

  window.scrollTo(0, 0);
}

// ===== STEP 2 → STEP 3: GO TO CONFIRM =====
function goToConfirm() {
  if (selectedPayment === 'card') {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCvv = document.getElementById('cardCvv').value.trim();

    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      showToast('⚠️ Please fill in all card details!');
      return;
    }
  }

  // Fill confirm section
  document.getElementById('confirmAddress').textContent =
    `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.postal}, ${shippingData.country} | 📞 ${shippingData.phone}`;

  const paymentLabels = {
    card: '💳 Credit / Debit Card',
    cod: '💵 Cash on Delivery',
    paypal: '🅿️ PayPal',
  };
  document.getElementById('confirmPayment').textContent =
    paymentLabels[selectedPayment];

  // Show confirm items
  const cart = getCart();
  const confirmItems = document.getElementById('confirmItems');
  confirmItems.innerHTML = '';
  cart.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'confirm-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/50?text=No+Img'"/>
      <div class="confirm-item-info">
        <h4>${item.name}</h4>
        <span>Qty: ${item.quantity}</span>
      </div>
      <div class="confirm-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    confirmItems.appendChild(div);
  });

  // Show step 3
  document.getElementById('paymentForm').style.display = 'none';
  document.getElementById('confirmForm').style.display = 'block';

  // Update progress
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step2').classList.add('done');
  document.querySelector('.progress-line:last-of-type').classList.add('done');
  document.getElementById('step3').classList.add('active');

  window.scrollTo(0, 0);
}

// ===== GO BACK =====
function goBack(showFormId, stepNum) {
  document.getElementById('shippingForm').style.display = 'none';
  document.getElementById('paymentForm').style.display = 'none';
  document.getElementById('confirmForm').style.display = 'none';
  document.getElementById(showFormId).style.display = 'block';

  document.querySelectorAll('.progress-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < stepNum) s.classList.add('done');
    if (i + 1 === stepNum) s.classList.add('active');
  });

  document.querySelectorAll('.progress-line').forEach((l, i) => {
    l.classList.toggle('done', i < stepNum - 1);
  });

  window.scrollTo(0, 0);
}

// ===== PLACE ORDER =====
async function placeOrder() {
  const cart = getCart();
  const token = localStorage.getItem('token');

  if (!token) {
    showToast('⚠️ Please login first to place an order!');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }

  // Show loader
  document.getElementById('orderBtnText').style.display = 'none';
  document.getElementById('orderBtnLoader').style.display = 'flex';

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const fullAddress = `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.postal}, ${shippingData.country}`;

  const orderData = {
    items: cart.map((item) => ({
      product: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    totalPrice: parseFloat(total.toFixed(2)),
    address: fullAddress,
    paymentMethod: selectedPayment,
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (res.ok) {
      // Clear cart
      localStorage.removeItem('cart');
      updateCartCount();

      // Show success modal
      document.getElementById('modalOrderId').textContent =
        data.orderId || data._id || 'ORD-' + Date.now();
      document.getElementById('successModal').style.display = 'flex';
    } else {
      const errEl = document.getElementById('orderError');
      errEl.textContent =
        '❌ ' + (data.message || 'Order failed. Please try again.');
      errEl.style.display = 'block';
    }
  } catch (err) {
    const errEl = document.getElementById('orderError');
    errEl.textContent = '❌ Server error. Make sure your server is running.';
    errEl.style.display = 'block';
  }

  document.getElementById('orderBtnText').style.display = 'flex';
  document.getElementById('orderBtnLoader').style.display = 'none';
}

// ===== RUN ON PAGE LOAD =====
loadCheckoutSummary();
updateCartCount();

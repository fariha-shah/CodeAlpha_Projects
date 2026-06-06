// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ===== PASSWORD STRENGTH CHECKER =====
const regPassword = document.getElementById('regPassword');
if (regPassword) {
  regPassword.addEventListener('input', function () {
    const val = this.value;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    let strength = 0;

    if (val.length >= 6) strength++;
    if (val.match(/[A-Z]/)) strength++;
    if (val.match(/[0-9]/)) strength++;
    if (val.match(/[^a-zA-Z0-9]/)) strength++;

    const levels = [
      { width: '0%', color: '#eee', label: '' },
      { width: '25%', color: '#e74c3c', label: '🔴 Weak' },
      { width: '50%', color: '#f39c12', label: '🟡 Fair' },
      { width: '75%', color: '#3498db', label: '🔵 Good' },
      { width: '100%', color: '#27ae60', label: '🟢 Strong' },
    ];

    fill.style.width = levels[strength].width;
    fill.style.background = levels[strength].color;
    text.textContent = levels[strength].label;
  });
}

// ===== SHOW ALERT =====
function showAlert(type, message) {
  const el = document.getElementById(type + 'Alert');
  if (!el) return;
  el.textContent = message;
  el.style.display = 'flex';
  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

// ===== REGISTER USER =====
async function registerUser() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const agreed = document.getElementById('agreeTerms').checked;

  // Frontend Validation
  if (!name || !email || !password || !confirm) {
    showAlert('error', '⚠️ Please fill in all fields.');
    return;
  }
  if (password !== confirm) {
    showAlert('error', '⚠️ Passwords do not match!');
    return;
  }
  if (password.length < 6) {
    showAlert('error', '⚠️ Password must be at least 6 characters.');
    return;
  }
  if (!agreed) {
    showAlert('error', '⚠️ Please agree to the Terms & Conditions.');
    return;
  }

  // Show loader
  document.getElementById('registerBtnText').style.display = 'none';
  document.getElementById('registerBtnLoader').style.display = 'flex';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      showAlert('success', '✅ Account created! Redirecting to login...');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      showAlert('error', '❌ ' + (data.message || 'Registration failed.'));
    }
  } catch (err) {
    showAlert('error', '❌ Server error. Make sure your server is running.');
  }

  // Hide loader
  document.getElementById('registerBtnText').style.display = 'flex';
  document.getElementById('registerBtnLoader').style.display = 'none';
}

// ===== LOGIN USER =====
async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAlert('error', '⚠️ Please enter your email and password.');
    return;
  }

  // Show loader
  document.getElementById('loginBtnText').style.display = 'none';
  document.getElementById('loginBtnLoader').style.display = 'flex';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      showAlert('success', '✅ Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showAlert('error', '❌ ' + (data.message || 'Login failed.'));
    }
  } catch (err) {
    showAlert('error', '❌ Server error. Make sure your server is running.');
  }

  // Hide loader
  document.getElementById('loginBtnText').style.display = 'flex';
  document.getElementById('loginBtnLoader').style.display = 'none';
}

// ===== CHECK IF ALREADY LOGGED IN =====
const user = localStorage.getItem('user');
if (
  user &&
  (window.location.href.includes('login') ||
    window.location.href.includes('register'))
) {
  window.location.href = 'index.html';
}

// ===== CART COUNT =====
updateCartCount();

// ===== SHOW MESSAGE IF REDIRECTED FROM CART/WISHLIST =====
const loginMsg = localStorage.getItem('loginMessage');
if (loginMsg) {
  const errorEl = document.getElementById('errorAlert');
  if (errorEl) {
    errorEl.textContent = '⚠️ ' + loginMsg;
    errorEl.style.display = 'flex';
    errorEl.style.background = '#fff8e1';
    errorEl.style.color = '#e67e22';
    errorEl.style.border = '1px solid #f5d9a0';
  }
  localStorage.removeItem('loginMessage');
}

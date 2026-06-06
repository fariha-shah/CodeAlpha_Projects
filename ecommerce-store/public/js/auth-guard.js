// ===== AUTH GUARD - MUST LOAD FIRST ON EVERY PAGE =====

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Redirect to login with a message
function requireLogin(message) {
  localStorage.setItem('loginMessage', message);
  window.location.href = 'login.html';
}

// Show logged in user name in navbar
function updateNavUser() {
  const loggedUser = localStorage.getItem('user');
  const navBtn = document.getElementById('navLoginBtn');
  if (!navBtn) return;

  if (loggedUser) {
    const user = JSON.parse(loggedUser);
    navBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.name.split(' ')[0]}`;
    navBtn.style.color = '#8b1a2f';
    navBtn.style.fontWeight = '600';
    navBtn.style.fontSize = '13px';
    navBtn.title = 'Logged in as ' + user.name;
    navBtn.href = '#';
    navBtn.onclick = function () {
      if (confirm('Do you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
      }
    };
  }
}

// Run on every page
updateNavUser();

// ===== SIDEBAR TOGGLE (mobile) =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('-translate-x-full');
}

// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
    localStorage.setItem('theme', 'light');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

themeToggleBtn?.addEventListener('click', toggleTheme);

// ===== PROFILE FORM =====
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profile')) || {
    username: 'playerone',
    email: 'playerone@example.com',
    bio: '',
    role: 'Pro Gamer'
  };

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const bioInput = document.getElementById('bio');
  const displayName = document.getElementById('displayName');
  const displayRole = document.getElementById('displayRole');

  if (usernameInput) usernameInput.value = profile.username;
  if (emailInput) emailInput.value = profile.email;
  if (bioInput) bioInput.value = profile.bio;
  if (displayName) displayName.textContent = profile.username;
  if (displayRole) displayRole.textContent = profile.role;
}

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const bio = document.getElementById('bio').value.trim();

    if (!username || !email) {
      alert('Please fill in username and email.');
      return;
    }

    const profile = {
      username,
      email,
      bio,
      role: 'Pro Gamer'
    };

    localStorage.setItem('profile', JSON.stringify(profile));

    // Update display
    document.getElementById('displayName').textContent = username;
    document.getElementById('displayRole').textContent = profile.role;

    alert('Profile saved successfully!');
  });
}

// ===== LOGOUT PAGE HANDLER =====
if (window.location.pathname.includes('logout.html')) {
  localStorage.clear(); // clear login, theme, profile data
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'player' && password === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid login!');
    }
  });
}

// ===== INIT ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  // Load theme
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Load profile if on profile page
  if (document.getElementById('profileForm') || document.getElementById('displayName')) {
    loadProfile();
  }
});

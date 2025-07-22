// ==================== SIDEBAR TOGGLE (Mobile) ====================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('-translate-x-full');
}

// ==================== THEME TOGGLE ====================
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

// ==================== PROFILE PAGE ====================
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profile')) || {
    username: 'playerone',
    email: 'playerone@example.com',
    bio: '',
    role: 'Pro Gamer',
  };

  document.getElementById('username')?.value = profile.username;
  document.getElementById('email')?.value = profile.email;
  document.getElementById('bio')?.value = profile.bio;
  document.getElementById('displayName')?.textContent = profile.username;
  document.getElementById('displayRole')?.textContent = profile.role;
}

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const bio = document.getElementById('bio')?.value.trim();

    if (!username || !email) {
      alert('Please fill in username and email.');
      return;
    }

    const profile = { username, email, bio, role: 'Pro Gamer' };
    localStorage.setItem('profile', JSON.stringify(profile));
    document.getElementById('displayName')?.textContent = username;
    document.getElementById('displayRole')?.textContent = profile.role;
    alert('Profile saved successfully!');
  });

  loadProfile();
}

// ==================== LOGOUT HANDLER ====================
if (window.location.pathname.includes('logout.html')) {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('profile');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// ==================== MAIN LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
  // Apply Theme
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Page Protection
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage) && localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }

  // Tabs
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Tab Toggle Functions
  function showLogin() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    loginTab.classList.add('bg-yellow-400', 'text-gray-900');
    loginTab.classList.remove('bg-gray-700', 'text-white');
    registerTab.classList.remove('bg-yellow-400', 'text-gray-900');
    registerTab.classList.add('bg-gray-700', 'text-white');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }

  function showRegister() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    registerTab.classList.add('bg-yellow-400', 'text-gray-900');
    registerTab.classList.remove('bg-gray-700', 'text-white');
    loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
    loginTab.classList.add('bg-gray-700', 'text-white');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }

  // Show login tab by default
  showLogin();
  loginTab?.addEventListener('click', showLogin);
  registerTab?.addEventListener('click', showRegister);

  // Dummy user (can be removed later)
  const demoUser = { username: 'player', password: '1234' };

  // ===== LOGIN FORM HANDLER =====
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = loginForm.username?.value.trim();
    const password = loginForm.password?.value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const isValid =
      (username === demoUser.username && password === demoUser.password) ||
      users.some(user => user.username === username && user.password === password);

    if (isValid) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('profile', JSON.stringify({ username, role: 'Pro Gamer' }));
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid username or password.');
    }
  });

  // ===== REGISTER FORM HANDLER =====
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullname = registerForm.fullname?.value.trim();
    const username = registerForm.username?.value.trim();
    const email = registerForm.email?.value.trim();
    const password = registerForm.password?.value.trim();

    if (!fullname || !username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
      alert('Username already exists.');
      return;
    }

    users.push({ fullname, username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    registerForm.reset();
    showLogin();
  });
});

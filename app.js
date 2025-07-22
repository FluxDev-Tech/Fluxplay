// ======== GLOBAL VARIABLES =========
const demoUser = { username: 'player', password: '1234' };

// ======== FUNCTIONS ================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('-translate-x-full');
}

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

// Load profile info to profile form or display elements
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profile')) || {
    username: 'playerone',
    email: 'playerone@example.com',
    bio: '',
    role: 'Pro Gamer',
  };

  document.getElementById('username')?.value = profile.username || '';
  document.getElementById('email')?.value = profile.email || '';
  document.getElementById('bio')?.value = profile.bio || '';
  document.getElementById('displayName')?.textContent = profile.username || '';
  document.getElementById('displayRole')?.textContent = profile.role || '';
}

// Protect pages from unauthenticated access
function protectPages() {
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage) && localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}

// Handle logout page: clear session and redirect
function handleLogout() {
  if (window.location.pathname.includes('logout.html')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profile');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}

// ======== DOM CONTENT LOADED =========
document.addEventListener('DOMContentLoaded', () => {
  // THEME INIT
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // SIDEBAR TOGGLE BUTTON (if exists)
  window.toggleSidebar = toggleSidebar;

  // LOGOUT HANDLER
  handleLogout();

  // PROTECT PAGES
  protectPages();

  // LOGIN / REGISTER PAGE LOGIC
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // If login/register tabs exist (on login page)
  if (loginTab && registerTab && loginForm && registerForm) {
    // Tab toggling functions
    function showLogin() {
      loginTab.classList.add('bg-yellow-400', 'text-gray-900');
      loginTab.classList.remove('bg-gray-700', 'text-white');
      registerTab.classList.remove('bg-yellow-400', 'text-gray-900');
      registerTab.classList.add('bg-gray-700', 'text-white');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    }

    function showRegister() {
      registerTab.classList.add('bg-yellow-400', 'text-gray-900');
      registerTab.classList.remove('bg-gray-700', 'text-white');
      loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
      loginTab.classList.add('bg-gray-700', 'text-white');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }

    // Show login tab by default
    showLogin();

    // Attach tab events
    loginTab.addEventListener('click', showLogin);
    registerTab.addEventListener('click', showRegister);

    // LOGIN FORM SUBMISSION
    loginForm.addEventListener('submit', (e) => {
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

    // REGISTER FORM SUBMISSION
    registerForm.addEventListener('submit', (e) => {
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
  }

  // PROFILE PAGE LOGIC
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    loadProfile();

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
  }
});

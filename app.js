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
    role: 'Pro Gamer',
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

    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const bio = document.getElementById('bio')?.value.trim();

    if (!username || !email) {
      alert('Please fill in username and email.');
      return;
    }

    const profile = {
      username,
      email,
      bio,
      role: 'Pro Gamer',
    };

    localStorage.setItem('profile', JSON.stringify(profile));

    // Update display
    const displayName = document.getElementById('displayName');
    const displayRole = document.getElementById('displayRole');
    if (displayName) displayName.textContent = username;
    if (displayRole) displayRole.textContent = profile.role;

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

// ===== MAIN APP LOGIC (LOGIN, REGISTER, THEME, PROFILE) =====
document.addEventListener('DOMContentLoaded', () => {
  // Load theme from storage or system preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Load profile info if on profile page
  if (document.getElementById('profileForm') || document.getElementById('displayName')) {
    loadProfile();
  }

  // Tabs and Forms Elements
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Functions to toggle forms and tab styles
  function showLogin() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    loginTab.classList.add('bg-yellow-400', 'text-gray-900', 'shadow-lg');
    loginTab.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-white');
    registerTab.classList.remove('bg-yellow-400', 'text-gray-900', 'shadow-lg');
    registerTab.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-white');

    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }

  function showRegister() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    registerTab.classList.add('bg-yellow-400', 'text-gray-900', 'shadow-lg');
    registerTab.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-white');
    loginTab.classList.remove('bg-yellow-400', 'text-gray-900', 'shadow-lg');
    loginTab.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-white');

    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }

  // Default to show login form
  showLogin();

  // Add tab event listeners
  loginTab?.addEventListener('click', showLogin);
  registerTab?.addEventListener('click', showRegister);

  // Demo user for login
  const demoUser = { username: 'player', password: '1234' };

  // LOGIN FORM SUBMISSION
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = loginForm.username?.value.trim();
    const password = loginForm.password?.value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user matches demo or registered users
    const userFound =
      (username === demoUser.username && password === demoUser.password) ||
      storedUsers.some(user => user.username === username && user.password === password);

    if (userFound) {
      alert(`Welcome back, ${username}!`);
      loginForm.reset();
      // Uncomment below to redirect after login
      // window.location.href = 'dashboard.html';
    } else {
      alert('Invalid username or password.');
    }
  });

  // REGISTER FORM SUBMISSION
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
      alert('Please enter a valid email address.');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(user => user.username === username)) {
      alert('Username already taken. Please choose another one.');
      return;
    }

    users.push({ fullname, username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! You can now log in.');

    registerForm.reset();
    showLogin();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // ===== LOGIN CHECK FOR PROTECTED PAGES =====
  const protectedPages = ['dashboard.html', 'profile.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage)) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ===== SIDEBAR TOGGLE (mobile) =====
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function toggleSidebar() {
    sidebar?.classList.toggle('open');
  }
  sidebarToggleBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', () => sidebar?.classList.remove('open'));

  document.addEventListener('click', (e) => {
    if (
      sidebar &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !sidebarToggleBtn.contains(e.target)
    ) {
      sidebar.classList.remove('open');
    }
  });

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
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }
  themeToggleBtn?.addEventListener('click', toggleTheme);

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

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
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const bio = document.getElementById('bio').value.trim();

      if (!username || !email) {
        alert('Please fill in username and email.');
        return;
      }

      const profile = { username, email, bio, role: 'Pro Gamer' };
      localStorage.setItem('profile', JSON.stringify(profile));

      const displayName = document.getElementById('displayName');
      const displayRole = document.getElementById('displayRole');
      if (displayName) displayName.textContent = username;
      if (displayRole) displayRole.textContent = profile.role;

      alert('Profile saved successfully!');
    });

    loadProfile();
  }

  // ===== LOGOUT PAGE HANDLER =====
  if (window.location.pathname.includes('logout.html')) {
    localStorage.clear();
    setTimeout(() => window.location.href = 'login.html', 1000);
  }

  // ===== LOGIN FORM =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();

      if (username === 'player' && password === '1234') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid login!');
      }
    });
  }

  // ===== BUY BUTTON FUNCTIONALITY =====
  const buyButtons = document.querySelectorAll('.btn-primary');
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const game = button.getAttribute('data-game');
      const price = button.getAttribute('data-price');
      alert(`You bought "${game}" for $${price}. Thank you!`);
    });
  });
});

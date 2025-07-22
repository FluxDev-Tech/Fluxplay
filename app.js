document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  // ===== LOGIN CHECK FOR PROTECTED PAGES =====
  const protectedPages = ['dashboard.html', 'profile.html'];
  if (protectedPages.includes(currentPage)) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ===== REGISTER FORM HANDLER (register.html) =====
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = registerForm.username.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();
      const confirmPassword = registerForm.confirmPassword.value.trim();

      if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];

      if (users.some(u => u.username === username)) {
        alert('Username already taken.');
        return;
      }
      if (users.some(u => u.email === email)) {
        alert('Email already registered.');
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    });
  }

  // ===== LOGIN FORM HANDLER (login.html) =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify({ username: user.username, email: user.email }));
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }

  // ===== DASHBOARD PROFILE LOADING (dashboard.html) =====
  if (currentPage === 'dashboard.html') {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      const profile = JSON.parse(localStorage.getItem('profile')) || {};
      const displayName = document.getElementById('displayName');
      if (displayName && profile.username) {
        displayName.textContent = profile.username;
      }
    }
  }

  // ===== LOGOUT PAGE HANDLER (logout.html) =====
  if (currentPage === 'logout.html') {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }

  // ===== SIDEBAR TOGGLE (dashboard.html) =====
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function toggleSidebar() {
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', toggleSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (
      sidebar &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      sidebarToggleBtn &&
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
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
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
        

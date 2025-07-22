document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // ==== LOGIN CHECK FOR PROTECTED PAGES ====
  const protectedPages = ['dashboard.html', 'profile.html'];
  if (protectedPages.includes(page)) {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ==== TAB SWITCHING (Login/Register) ====
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      loginTab.classList.add('bg-yellow-400', 'text-gray-900');
      registerTab.classList.remove('bg-yellow-400', 'text-gray-900');
    });

    registerTab.addEventListener('click', () => {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      registerTab.classList.add('bg-yellow-400', 'text-gray-900');
      loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
    });
  }

  // ==== REGISTER FORM FUNCTIONALITY ====
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = registerForm.regUsername.value.trim();
      const email = registerForm.regEmail.value.trim();
      const password = registerForm.regPassword.value.trim();

      if (!username || !email || !password) {
        alert('Please fill all fields.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find((u) => u.username === username)) {
        alert('Username already exists.');
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! Please log in.');
      loginTab.click();
    });
  }

  // ==== LOGIN FORM FUNCTIONALITY ====
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid login credentials.');
      }
    });
  }

  // ==== DASHBOARD PROFILE LOADING ====
  if (page === 'dashboard.html') {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const displayName = document.getElementById('displayName');
    if (displayName && profile?.username) {
      displayName.textContent = profile.username;
    }
  }

  // ==== LOGOUT FUNCTIONALITY ====
  if (page === 'logout.html') {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }

  // ==== SIDEBAR TOGGLE ====
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function toggleSidebar() {
    sidebar?.classList.toggle('open');
  }

  sidebarToggleBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
  });

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

  // ==== THEME TOGGLE ====
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

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // ===== PROTECTED PAGES CHECK =====
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  if (protectedPages.includes(page)) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ===== DEFAULT ACCOUNT (admin/player1) IF NONE EXIST =====
  // This is optional now, since login is fixed below, but kept for register feature
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      { username: 'admin', email: 'admin@fluxplay.com', password: 'player1' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // ===== LOGIN & REGISTER FORM TOGGLER =====
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

  // ===== REGISTER FUNCTION =====
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

      if (!username || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const exists = users.some(u => u.username === username || u.email === email);

      if (exists) {
        alert('Username or email already exists.');
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful. Please login.');
      loginTab?.click();
    });
  }

  // ===== LOGIN FUNCTION (FIXED admin/player1) =====
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (username === 'admin' && password === 'player1') {
        alert('Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(
          'profile',
          JSON.stringify({ username: 'admin', email: 'admin@fluxplay.com' })
        );
        window.location.href = 'dashboard.html';
      } else {
        alert('Incorrect username or password.');
      }
    });
  }

  // ===== PROFILE NAME ON DASHBOARD/STATS =====
  if (['dashboard.html', 'stats.html'].includes(page)) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const displayName = document.getElementById('displayName');
    if (displayName && profile?.username) {
      displayName.textContent = profile.username;
    }
  }

  // ===== LOGOUT HANDLER =====
  if (page === 'logout.html') {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  }

  // ===== SIDEBAR TOGGLE =====
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

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // ===== STATS PAGE DUMMY DATA =====
  if (page === 'stats.html') {
    const stats = {
      gamesPlayed: 120,
      wins: 85,
      winRate: '70.8%',
      avgGameTime: '23 mins',
      globalRank: '#432',
      tier: 'Diamond',
      tournaments: 4,
      activeSince: 'Mar 2023'
    };

    const map = {
      gamesPlayed: 'gamesPlayed',
      wins: 'wins',
      winRate: 'winRate',
      avgGameTime: 'avgGameTime',
      globalRank: 'globalRank',
      tier: 'tier',
      tournaments: 'tournaments',
      activeSince: 'activeSince'
    };

    for (const [key, id] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.textContent = stats[key];
    }
  }
});

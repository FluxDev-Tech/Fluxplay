document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // ==== PROTECTED PAGES ====
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  if (protectedPages.includes(page)) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ==== LOGIN / REGISTER FORM TOGGLER ====
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

  // ==== Default Account (admin / player1) ====
  const defaultUsers = [
    { username: 'admin', email: 'admin@example.com', password: 'player1' }
  ];

  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  if (!existingUsers.some(u => u.username === 'admin')) {
    localStorage.setItem('users', JSON.stringify([...defaultUsers, ...existingUsers]));
  }

  // ==== REGISTER FORM SUBMIT ====
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword')?.value.trim();

      if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(user => user.username === username || user.email === email);

      if (userExists) {
        alert('Username or email already registered.');
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! You can now login.');
      loginTab?.click();
    });
  }

  // ==== LOGIN FORM SUBMIT ====
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }

  // ==== DASHBOARD: SHOW PROFILE NAME ====
  if (page === 'dashboard.html' || page === 'stats.html') {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const displayName = document.getElementById('displayName');
    if (displayName && profile?.username) {
      displayName.textContent = profile.username;
    }
  }

  // ==== LOGOUT HANDLER ====
  if (page === 'logout.html') {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
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

  // ==== STATS PAGE FILLER ====
  if (page === 'stats.html') {
    const stats = {
      gamesPlayed: 120,
      wins: 85,
      winRate: '70.8%',
      avgGameTime: '23 mins',
      rank: '#432',
      tier: 'Diamond',
      tournaments: 4,
      activeSince: 'Mar 2023'
    };

    const map = {
      gamesPlayed: 'gamesPlayed',
      wins: 'wins',
      winRate: 'winRate',
      avgGameTime: 'avgGameTime',
      rank: 'globalRank',
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

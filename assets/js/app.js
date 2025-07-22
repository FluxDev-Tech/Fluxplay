document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // — Protected pages
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  if (protectedPages.includes(page) && localStorage.getItem('isLoggedIn') !== 'true') {
    return window.location.href = 'login.html';
  }

  // — Tabs & forms
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginTab && registerTab) {
    loginTab.onclick = () => {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      loginTab.classList.add('bg-yellow-400');
      registerTab.classList.remove('bg-yellow-400');
    };
    registerTab.onclick = () => {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      registerTab.classList.add('bg-yellow-400');
      loginTab.classList.remove('bg-yellow-400');
    };
  }

  // — Default admin player1 account
  const initUsers = JSON.parse(localStorage.getItem('users')) || [];
  if (!initUsers.some(u => u.username === 'admin')) {
    initUsers.unshift({ username: 'admin', email: 'admin@example.com', password: 'player1' });
    localStorage.setItem('users', JSON.stringify(initUsers));
  }

  // — Registration
  if (registerForm) {
    registerForm.onsubmit = e => {
      e.preventDefault();
      const u = document.getElementById('regUsername').value.trim();
      const eMail = document.getElementById('regEmail').value.trim();
      const pw = document.getElementById('regPassword').value.trim();
      const cp = document.getElementById('regConfirmPassword').value.trim();

      if (!u || !eMail || !pw || !cp) return alert('Fill all fields!');
      if (pw !== cp) return alert('Passwords do not match!');

      const users = JSON.parse(localStorage.getItem('users'));
      if (users.some(x => x.username === u || x.email === eMail))
        return alert('Username or email already registered.');

      users.push({ username: u, email: eMail, password: pw });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registered successfully! Please log in.');
      loginTab.click();
    };
  }

  // — Login
  if (loginForm) {
    loginForm.onsubmit = e => {
      e.preventDefault();
      const u = loginForm.username.value.trim();
      const pw = loginForm.password.value.trim();
      const users = JSON.parse(localStorage.getItem('users'));
      const user = users.find(x => x.username === u && x.password === pw);
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify(user));
        return window.location.href = 'dashboard.html';
      }
      alert('Invalid username or password!');
    };
  }

  // — Show username
  if (['dashboard.html','stats.html'].includes(page)) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const nameSpan = document.getElementById('displayName');
    if (profile?.username && nameSpan) nameSpan.textContent = profile.username;
  }

  // — Logout action
  if (page === 'logout.html') {
    localStorage.clear();
    setTimeout(() => window.location.href = 'login.html', 500);
  }

  // — Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const btnOpen = document.getElementById('sidebarToggleBtn');
  const btnClose = document.getElementById('sidebarCloseBtn');
  if (btnOpen) btnOpen.onclick = () => sidebar.classList.toggle('open');
  if (btnClose) btnClose.onclick = () => sidebar.classList.remove('open');
  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !btnOpen.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // — Theme toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  const sun = document.getElementById('sunIcon');
  const moon = document.getElementById('moonIcon');
  const applyTheme = t => {
    document.documentElement.classList.toggle('dark', t === 'dark');
    sun.classList.toggle('hidden', t === 'dark');
    moon.classList.toggle('hidden', t !== 'dark');
    localStorage.setItem('theme', t);
  };
  if (themeBtn) themeBtn.onclick = () => applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));

  // — Stats page data
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
    Object.entries(stats).forEach(([key, val]) => {
      const el = document.getElementById(key);
      if (el) el.textContent = val;
    });
  }
});

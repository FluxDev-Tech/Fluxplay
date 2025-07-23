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

  // ===== LOGOUT PAGE HANDLER =====
  if (page === 'logout.html') {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profile');
    window.location.href = 'login.html'; // Immediate redirect on logout page
    return;
  }

  // ===== DEFAULT ACCOUNT =====
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      { fullname: 'Admin User', username: 'admin', email: 'admin@fluxplay.com', password: 'player1' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // ===== LOGIN & REGISTER TAB TOGGLING =====
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

  // ===== REGISTER FUNCTION WITH AUTO-LOGIN =====
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const fullname = document.getElementById('regFullName').value.trim();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      if (!fullname || !username || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const exists = users.some(u =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        alert('Username or email already exists.');
        return;
      }

      users.push({ fullname, username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('profile', JSON.stringify({ fullname, username, email }));

      alert('Registration successful! Redirecting to dashboard...');
      window.location.href = 'dashboard.html';
    });
  }

  // ===== LOGIN FUNCTION =====
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

      if (user) {
        alert('Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify({ fullname: user.fullname, username: user.username, email: user.email }));
        window.location.href = 'dashboard.html';
      } else {
        alert('Incorrect username or password.');
      }
    });
  }

  // ===== SHOW PROFILE USERNAME (profile.html) =====
  if (['dashboard.html', 'profile.html', 'stats.html'].includes(page)) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const displayName = document.getElementById('displayName');
    if (displayName && profile?.username) {
      displayName.textContent = profile.username;
    }
  }

  // ===== LOGOUT BUTTON =====
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }

  // ===== SIDEBAR TOGGLE =====
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    sidebar?.classList.remove('-translate-x-full');
    sidebar?.classList.add('translate-x-0');
  }

  function closeSidebar() {
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
  }

  sidebarToggleBtn?.addEventListener('click', openSidebar);
  sidebarCloseBtn?.addEventListener('click', closeSidebar);

  document.addEventListener('click', e => {
    if (
      sidebar?.classList.contains('translate-x-0') &&
      !sidebar.contains(e.target) &&
      !sidebarToggleBtn.contains(e.target)
    ) {
      closeSidebar();
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
      activeSince: 'Jul 25, 2025'
    };

    for (const [key, value] of Object.entries(stats)) {
      const el = document.getElementById(key);
      if (el) el.textContent = value;
    }
  }

  // ===== SHOP MODAL FUNCTIONALITY =====
  const purchaseModal = document.getElementById('purchaseModal');
  const gameTitle = document.getElementById('gameTitle');
  const gamePrice = document.getElementById('gamePrice');
  const confirmBtn = document.getElementById('confirmPurchaseBtn');
  const cancelBtn = document.getElementById('cancelPurchaseBtn');

  window.buyGame = (title, price) => {
    if (purchaseModal && gameTitle && gamePrice) {
      purchaseModal.classList.remove('hidden');
      gameTitle.textContent = title;
      gamePrice.textContent = `Price: ${price}`;
    }
  };

  window.confirmPurchase = () => {
    alert("🎉 Thank you for purchasing!");
    purchaseModal?.classList.add('hidden');
  };

  window.closeModal = () => {
    purchaseModal?.classList.add('hidden');
  };

  confirmBtn?.addEventListener('click', window.confirmPurchase);
  cancelBtn?.addEventListener('click', window.closeModal);
});
        

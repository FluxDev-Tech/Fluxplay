document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // ===== DEFAULT ACCOUNT SETUP =====
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      { fullname: 'Admin User', username: 'admin', email: 'admin@fluxplay.com', password: 'player1' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // ===== AUTH GUARD =====
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  if (protectedPages.includes(page)) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }

  // ===== LOGOUT HANDLER =====
  if (page === 'logout.html') {
    const logoutMessage = document.querySelector('p');
    if (logoutMessage) logoutMessage.textContent = 'Logging you out...';

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profile');
    localStorage.removeItem('avatar');
    localStorage.removeItem('bio');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500); // Delay to show logout message

    return;
  }

  // ===== LOGIN/REGISTER TOGGLE =====
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
        localStorage.setItem('profile', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        alert('Incorrect username or password.');
      }
    });
  }

  // ===== SIDEBAR TOGGLE =====
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  sidebarToggleBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('-translate-x-full');
    sidebar?.classList.add('translate-x-0');
  });

  sidebarCloseBtn?.addEventListener('click', () => {
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
  });

  document.addEventListener('click', e => {
    if (
      sidebar?.classList.contains('translate-x-0') &&
      !sidebar.contains(e.target) &&
      !sidebarToggleBtn.contains(e.target)
    ) {
      sidebar?.classList.add('-translate-x-full');
      sidebar?.classList.remove('translate-x-0');
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

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  // ===== STATS PAGE =====
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

  // ===== SHOP MODAL =====
  const purchaseModal = document.getElementById('purchaseModal');
  const gameTitle = document.getElementById('gameTitle');
  const gamePrice = document.getElementById('gamePrice');
  const confirmBtn = document.getElementById('confirmPurchaseBtn');
  const cancelBtn = document.getElementById('cancelPurchaseBtn');

  window.buyGame = (title, price) => {
    purchaseModal?.classList.remove('hidden');
    gameTitle.textContent = title;
    gamePrice.textContent = `Price: ${price}`;
  };

  window.confirmPurchase = () => {
    alert('🎉 Thank you for purchasing!');
    purchaseModal?.classList.add('hidden');
  };

  window.closeModal = () => {
    purchaseModal?.classList.add('hidden');
  };

  confirmBtn?.addEventListener('click', window.confirmPurchase);
  cancelBtn?.addEventListener('click', window.closeModal);

  // ===== DASHBOARD AVATAR DISPLAY =====
  if (page === 'dashboard.html') {
    const avatarImg = document.querySelector('img[alt="Dashboard Avatar"]');
    const savedAvatar = localStorage.getItem('avatar');
    if (avatarImg && savedAvatar) {
      avatarImg.src = savedAvatar;
    }
  }
  
  // ===== PROFILE PAGE =====
  if (page === 'profile.html') {
    const profileForm = document.getElementById('profileForm');
    const displayName = document.getElementById('displayName');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const bioInput = document.getElementById('bio');
    const avatarImg = document.querySelector('img[alt="Avatar"]');

    const savedProfile = JSON.parse(localStorage.getItem('profile')) || {};
    const savedBio = localStorage.getItem('bio');
    const savedAvatar = localStorage.getItem('avatar');

    // Pre-fill existing data
    if (savedProfile.username) {
      displayName.textContent = savedProfile.username;
      usernameInput.value = savedProfile.username;
    }
    if (savedProfile.email) emailInput.value = savedProfile.email;
    if (savedBio) bioInput.value = savedBio;
    if (savedAvatar) avatarImg.src = savedAvatar;

    // Save Profile Data
    profileForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUsername = usernameInput.value.trim();
      const newEmail = emailInput.value.trim();
      const newBio = bioInput.value.trim();

      if (!newUsername || !newEmail) {
        alert('⚠ Username and email are required.');
        return;
      }

      // Save to localStorage
      const updatedProfile = {
        username: newUsername,
        email: newEmail,
      };

      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      localStorage.setItem('bio', newBio);
      displayName.textContent = newUsername;

      alert('✅ Profile updated!');
    });

    // Handle avatar change
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.display = 'none';

    avatarImg.style.cursor = 'pointer';
    avatarImg.title = 'Click to change avatar';
    avatarImg.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          avatarImg.src = reader.result;
          localStorage.setItem('avatar', reader.result);
          alert('✅ Avatar updated!');
        };
        reader.readAsDataURL(file);
      }
    });

    document.body.appendChild(imageInput);
  }

  // ===== DASHBOARD PAGE =====
  if (page === 'dashboard.html') {
    const avatar = document.getElementById('dashboardAvatar');
    const nameDisplay = document.getElementById('dashboardName');

    const storedAvatar = localStorage.getItem('avatar');
    const storedProfile = JSON.parse(localStorage.getItem('profile'));

    if (avatar && storedAvatar) {
      avatar.src = storedAvatar;
    }

    if (nameDisplay && storedProfile?.username) {
      nameDisplay.textContent = storedProfile.username;
    }
  }
});
  

// app.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const profileForm = document.getElementById('profileForm');

  // --- UTILS ---
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('-translate-x-full');
  }
  window.toggleSidebar = toggleSidebar; // Make global for inline onclicks

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

  // --- THEME INIT ---
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // --- LOGIN & REGISTER TABS ---
  function showLogin() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;
    loginTab.classList.add('bg-yellow-400', 'text-gray-900');
    loginTab.classList.remove('bg-gray-700', 'text-white');
    registerTab.classList.remove('bg-yellow-400', 'text-gray-900');
    registerTab.classList.add('bg-gray-700', 'text-white');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }
  function showRegister() {
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;
    registerTab.classList.add('bg-yellow-400', 'text-gray-900');
    registerTab.classList.remove('bg-gray-700', 'text-white');
    loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
    loginTab.classList.add('bg-gray-700', 'text-white');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
  if (loginTab && registerTab) {
    loginTab.addEventListener('click', showLogin);
    registerTab.addEventListener('click', showRegister);
  }

  // --- USER SESSION MANAGEMENT ---
  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // --- PAGE PROTECTION ---
  const protectedPages = ['dashboard.html', 'profile.html', 'stats.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }

  // --- LOGIN FORM HANDLER ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();

      // Fetch registered users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Allow demo user login
      const demoUser = { username: 'player', password: '1234' };

      const validUser =
        (username === demoUser.username && password === demoUser.password) ||
        users.some(user => user.username === username && user.password === password);

      if (validUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('profile', JSON.stringify({ username, role: 'Pro Gamer' }));
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid username or password.');
      }
    });
  }

  // --- REGISTER FORM HANDLER ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = registerForm.fullname.value.trim();
      const username = registerForm.username.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      if (!fullname || !username || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Invalid email format.');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users') || '[]');
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

  // --- PROFILE PAGE LOGIC ---
  if (profileForm) {
    function loadProfile() {
      const profile = JSON.parse(localStorage.getItem('profile')) || {
        username: '',
        email: '',
        bio: '',
        role: 'Pro Gamer',
      };
      profileForm.username.value = profile.username || '';
      profileForm.email.value = profile.email || '';
      profileForm.bio.value = profile.bio || '';
      document.getElementById('displayName')?.textContent = profile.username || '';
      document.getElementById('displayRole')?.textContent = profile.role || '';
    }

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = profileForm.username.value.trim();
      const email = profileForm.email.value.trim();
      const bio = profileForm.bio.value.trim();

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

    loadProfile();
  }

  // --- LOGOUT HANDLER ---
  if (currentPage === 'logout.html') {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profile');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }

  // --- STATS PAGE CHARTS ---
  if (currentPage === 'stats.html') {
    // Chart.js must be loaded in the HTML page
    const ctx1 = document.getElementById('gamesPlayedChart')?.getContext('2d');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Games Played',
            data: [12, 19, 8, 24, 32, 28, 40],
            fill: true,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.3)',
            tension: 0.3,
            pointBackgroundColor: '#7c3aed'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { labels: { color: document.body.classList.contains('dark') ? 'white' : 'black' } }
          }
        }
      });
    }

    const ctx2 = document.getElementById('trophiesChart')?.getContext('2d');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Cyber Arena', 'Dragon Valley', 'Mecha Storm'],
          datasets: [{
            label: 'Trophies',
            data: [15, 10, 7],
            backgroundColor: ['#db2777', '#f97316', '#facc15']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    const ctx3 = document.getElementById('onlineHoursChart')?.getContext('2d');
    if (ctx3) {
      new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['Cyber Arena', 'Dragon Valley', 'Mecha Storm'],
          datasets: [{
            label: 'Online Hours',
            data: [250, 300, 162],
            backgroundColor: ['#eab308', '#f97316', '#7c3aed']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'right' } }
        }
      });
    }
  }
});
            

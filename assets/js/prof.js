document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  if (page !== 'profile.html') return;

  const profileForm = document.getElementById('profileForm');
  const displayName = document.getElementById('displayName');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const bioInput = document.getElementById('bio');
  const avatarImg = document.querySelector('img[alt="Avatar"]');

  // Load saved profile data
  const savedProfile = JSON.parse(localStorage.getItem('profile')) || {};
  const savedBio = localStorage.getItem('bio');
  const savedAvatar = localStorage.getItem('avatar');

  if (savedProfile.username) {
    displayName.textContent = savedProfile.username;
    usernameInput.value = savedProfile.username;
  }

  if (savedProfile.email) {
    emailInput.value = savedProfile.email;
  }

  if (savedBio) {
    bioInput.value = savedBio;
  }

  if (savedAvatar) {
    avatarImg.src = savedAvatar;
  }

  // ===== SHOW PROFILE USERNAME (profile.html) =====
  if (['dashboard.html', 'profile.html', 'stats.html'].includes(page)) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const displayName = document.getElementById('displayName');
    if (displayName && profile?.username) {
      displayName.textContent = profile.username;
    }
  }
  
  // Handle form submission
  profileForm.addEventListener('submit', e => {
    e.preventDefault();

    const newUsername = usernameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const newBio = bioInput.value.trim();

    if (!newUsername || !newEmail) {
      alert('Username and email are required.');
      return;
    }

    localStorage.setItem('profile', JSON.stringify({
      ...savedProfile,
      username: newUsername,
      email: newEmail,
    }));

    localStorage.setItem('bio', newBio);
    displayName.textContent = newUsername;

    alert('✅ Profile updated!');
  });

  // Avatar upload
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
      };
      reader.readAsDataURL(file);
    }
  });

  document.body.appendChild(imageInput);
});

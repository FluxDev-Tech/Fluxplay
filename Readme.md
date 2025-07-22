<h1 align="center">
  🎮 FluxPlay Gaming Website
</h1>

<p align="center">
  A high-quality, responsive full-stack gaming website built with
  <strong>HTML</strong>, <strong>Tailwind CSS</strong>, and <strong>JavaScript</strong>.
  Includes real-time stats, profile editing, registration/login system, and dark mode UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20With-Tailwind%20CSS-blue?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript" />
</p>

---

## 🌟 Features

* 🎨 Sleek, gamer-themed UI with Tailwind CSS
* 🌗 Dark/Light Mode toggle
* 🔐 Login / Logout / Registration system using `localStorage`
* 🧠 Profile management with live update
* 📊 Stats page with sample player data
* 📱 Fully responsive design
* 🧹 Clean sidebar navigation

---

## 📸 Screenshots

### Home Page

![Home Screenshot](assets/screenshots/home.png)

### Dashboard

![Dashboard Screenshot](assets/screenshots/dashboard.png)

### Stats Page

![Stats Screenshot](assets/screenshots/stats.png)

### Profile Editor

![Profile Screenshot](assets/screenshots/profile.png)

---

## 🧪 Tech Stack

| Technology           | Usage                              |
| -------------------- | ---------------------------------- |
| **HTML5**            | Page structure                     |
| **Tailwind CSS**     | Styling & layout                   |
| **JavaScript (ES6)** | UI interaction, auth, theme toggle |
| **LocalStorage**     | Data persistence (auth + profile)  |

---

## 🛍️ Pages

* `index.html` → Home Page
* `login.html` → Login form
* `register.html` → Register account
* `dashboard.html` → User dashboard (requires login)
* `stats.html` → Gaming stats overview
* `profile.html` → Profile editor
* `logout.html` → Clears session and redirects

---

## 📂 Folder Structure

```
fluxplay/
├── index.html               # Home Page
├── login.html               # Login Page
├── register.html            # Register Page
├── dashboard.html           # Main User Dashboard
├── stats.html               # Player Stats
├── profile.html             # User Profile Editor
├── logout.html              # Clears session & redirects
├── app.js                   # Global JavaScript logic
├── assets/
│   ├── img/
│   │   └── avatar.png       # Profile avatar
│   └── screenshots/
│       ├── home.png
│       ├── dashboard.png
│       ├── stats.png
│       └── profile.png
```

---

## 🧠 How It Works

1. Users register using `register.html`
2. Authenticated users are redirected to `dashboard.html`
3. Protected pages like `dashboard`, `stats`, and `profile` are locked without login
4. All profile and user data is stored in `localStorage`
5. Theme preference is also stored locally for persistence

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR-USERNAME/fluxplay.git
cd fluxplay
open index.html
```

---

## 💬 Contact

Got questions or ideas?

* 🔗 GitHub: [@fluxdev-tech](https://github.com/fluxdev-tech)
* 📧 Email: [yourname@example.com](mailto:yourname@example.com)

---

## 🕹️ Live Preview

> Want to host this online?
> Use **GitHub Pages**, **Netlify**, or **Vercel** for free deployment.

---

## 📌 License

This project is licensed under the **MIT License**.
Use and modify freely for personal or portfolio purposes.

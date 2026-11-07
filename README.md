# 🌴 Kerala Fitness — Authentic Kerala Diet Planner & Fitness Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?style=for-the-badge&logo=netlify)](https://kerala-fitness-main-site.netlify.app/login.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Turso%20%2F%20LibSQL-00E599?style=for-the-badge&logo=sqlite&logoColor=black)](https://turso.tech)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> A modern, full-stack fitness and nutrition platform uniquely tailored to the authentic Kerala diet. Calculate BMI, receive scientifically balanced traditional meal plans, track wellness milestones, and manage user progression with a dedicated administrative dashboard.

🔗 **Live Production Site:** [https://kerala-fitness-main-site.netlify.app/login.html](https://kerala-fitness-main-site.netlify.app/login.html)

---

## 📌 Table of Contents
- [Overview & Problem Statement](#-overview--problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Security & Production Hardening](#-security--production-hardening)
- [Project Structure](#-project-structure)
- [Local Development Setup](#-local-development-setup)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🎯 Overview & Problem Statement

Most mainstream health and fitness applications focus exclusively on Western dietary paradigms (oats, salads, grilled chicken breasts), completely overlooking regional Indian cuisines. 

In Kerala, staples like **Matta (Red Rice)**, **Puttu**, **Appam**, **Kadala Curry**, **Avial**, **Thoran**, and fresh fish preparations are central to everyday life. Individuals looking to lose weight or build muscle often struggle to translate their cultural diet into calorie- and macro-accurate goals.

**Kerala Fitness** solves this problem by providing:
1. Calorie-counted Kerala food databases (Breakfast, Lunch, Dinner, Snacks).
2. Automated macro-balanced meal plan generation tailored to user goals (Weight Loss, Muscle Gain, Maintenance).
3. Longitudinal progress tracking with BMI categorization.
4. An interactive administrative portal for wellness monitoring and user management.

---

## ✨ Key Features

### 🥗 Authentic Kerala Diet Planner
- Dynamic meal recommendations featuring traditional vegetarian and non-vegetarian Kerala dishes (e.g., *Puttu with Kadala Curry*, *Appam with Veg Stew*, *Fish Curry with Matta Rice*, *Avial*, *Thoran*).
- Customizable recommendations adapted to specific caloric targets and fitness ambitions.

### 📊 Real-time BMI & Wellness Tracking
- Instant Body Mass Index (BMI) computation based on height, weight, and target milestones.
- Historical log recording date-stamped weight and BMI trends over time.

### 🔐 Secure Authentication & Session Management
- Multi-mode sign-up and login workflow.
- Passwords hashed using industry-standard **bcrypt** (10 salt rounds).
- Granular role-based redirection (Standard User ➡️ Dashboard | Administrator ➡️ Admin Panel).

### 🛠️ Dedicated Administrator Dashboard (`admin-site`)
- User management interface allowing administrators to view, audit, and update accounts.
- Deep-dive member progression history logs.
- Dynamic modal dialogues for administrative actions.

### 🌟 Interactive & Immersive UI
- 3D interactive ambient globe background powered by **Three.js** and **Vanta.js**.
- Glassmorphic, mobile-responsive layout designed with modern CSS3.
- Integrated community feedback and review submission system.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│                                                             │
│   [ Main User App ]                [ Admin Dashboard ]      │
│  • HTML5 / CSS3 / Vanilla JS      • User / Audit Controls   │
│  • Three.js / Vanta.js 3D         • History Inspection      │
│  • Session Storage                • Role Verification       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Serverless API Layer (Netlify)                  │
│                                                             │
│                [ Express.js App Handler ]                   │
│   • Auth Router (Bcrypt Salt / Hash)                        │
│   • User Profile & Progress Router                          │
│   • Cloudinary Media Upload Stream Buffer                   │
│   • Admin Action Endpoints                                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│   Turso Cloud Database       │ │   Cloudinary Media Store    │
│   (Distributed LibSQL)       │ │   (Profile Assets & Media)  │
│  • users                     │ └─────────────────────────────┘
│  • history                   │
│  • reviews                   │
└──────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Modern ES6+ JavaScript | Semantic, zero-dependency lightweight client |
| **3D Graphics** | Three.js & Vanta.js | Immersive interactive 3D visual canvas |
| **Backend** | Node.js, Express.js | RESTful API architecture |
| **Serverless** | `serverless-http`, Netlify Functions | High-availability cloud runtime |
| **Database** | Turso (LibSQL / SQLite cloud) | Edge-distributed serverless database |
| **Security** | Bcrypt.js, Parameterized SQL | Cryptographic hashing & SQL injection protection |
| **Media** | Cloudinary & Multer | In-memory buffer uploads directly to CDN |
| **Hosting** | Netlify | Continuous deployment with CDN caching |

---

## 🔒 Security & Production Hardening

This repository strictly adheres to production cybersecurity standards:

- **Decoupled Secrets**: All sensitive credentials (database URLs, authentication tokens, API keys) are strictly loaded via runtime environment variables (`process.env`).
- **No Insecure Storage**: File uploads utilize Multer in-memory buffers (`multer.memoryStorage()`) streaming directly to Cloudinary without persisting unencrypted temporary files to disk.
- **SQL Injection Defense**: Every database interaction uses parameterized prepared statements (`args: [params]`), preventing SQL injection attacks.
- **Cryptographic Protection**: Passwords are never stored in plaintext; salted and hashed with `bcryptjs`.
- **Zero-Leak Version Control**: Pre-configured `.gitignore` prevents exposure of `.env` files, `.netlify` state caches, local `.db` snapshots, and dependencies.

---

## 📁 Project Structure

```
kerala-fitness/
├── admin-site/                   # Dedicated administrative dashboard
│   ├── admin.html                # Admin user management & audit interface
│   ├── admin.js                  # User listing, history querying, edit modals
│   ├── background-init.js        # Vanta.js 3D background initialization
│   ├── netlify.toml              # Routing & redirect rules for admin panel
│   └── style.css                 # Dedicated dashboard styles
│
├── main-site/                    # Primary user-facing web application
│   ├── netlify/
│   │   └── functions/
│   │       └── api.js            # Serverless Express API & Turso handlers
│   ├── .env.example              # Environment variable template
│   ├── background-init.js        # 3D canvas initializer
│   ├── database.js               # LibSQL/Turso database client & auto-migration
│   ├── index.html                # Diet planner, BMI calculator & tracker
│   ├── login.html                # Authentication portal (Sign up / Login)
│   ├── login.js                  # Client auth logic & validation
│   ├── netlify.toml              # Netlify build configuration & API redirects
│   ├── package.json              # Backend dependencies & metadata
│   ├── script.js                 # Diet calculation & Kerala food database logic
│   ├── server.js                 # Local Express server runner
│   └── style.css                 # Responsive UI layout & animations
│
├── .gitignore                    # Comprehensive repository protection rules
├── package.json                  # Root workspace script runner
└── README.md                     # Project documentation
```

---

## 🚀 Local Development Setup

Follow these steps to run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/VishnuVelayudhan/kerala-fitness.git
cd kerala-fitness
```

### 2. Configure Environment Variables
Navigate to `main-site/` and create a `.env` file based on `.env.example`:
```bash
cd main-site
cp .env.example .env
```
Fill in your credentials:
```env
LIBSQL_URL=libsql://your-database.turso.io
LIBSQL_AUTH_TOKEN=your_turso_auth_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=8888
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application
```bash
npm start
```
The server will start at:
- **Application Portal:** `http://localhost:8888/login.html`
- **Main Diet Planner:** `http://localhost:8888/index.html`
- **API Health:** `http://localhost:8888/api/reviews`

---

## 📡 API Reference

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/signup` | `POST` | Public | Registers a new user with bcrypt password hashing |
| `/api/login` | `POST` | Public | Validates credentials and returns session user payload |
| `/api/history` | `POST` | User | Saves user BMI, weight, and diet goal record |
| `/api/history?userId={id}` | `GET` | User | Retrieves user historical progression |
| `/api/reviews` | `POST` | User | Submits a public user testimonial/review |
| `/api/reviews` | `GET` | Public | Fetches recent community feedback |
| `/api/upload` | `POST` | User | Uploads an image directly to Cloudinary via buffer |
| `/api/admin/users` | `GET` | Admin | Fetches list of registered users |
| `/api/admin/users/:id` | `PUT` | Admin | Updates user credentials or details |
| `/api/admin/history/:userId` | `GET` | Admin | Retrieves progression log for specific member |

---

## 🌐 Deployment

The application is deployed as a serverless platform on **Netlify**:
- Frontend static assets are served from Netlify's high-performance edge CDN.
- Backend API routes are routed via `netlify.toml` rewrites to serverless Lambda functions (`/.netlify/functions/api`).
- Database persistence is managed globally via **Turso** edge instances.

---

## 👨‍💻 Author

**Vishnu Velayudhan**
- GitHub: [@VishnuVelayudhan](https://github.com/VishnuVelayudhan)
- Live Site: [Kerala Fitness Platform](https://kerala-fitness-main-site.netlify.app/login.html)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

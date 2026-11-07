# 🌴 Kerala Fitness — Authentic Kerala Diet Planner & Fitness Tracker

[![Try It Out](https://img.shields.io/badge/Try%20It%20Out-Live%20Site-brightgreen?style=for-the-badge&logo=netlify)](https://kerala-fitness-main-site.netlify.app/login.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Turso%20%2F%20LibSQL-00E599?style=for-the-badge&logo=sqlite&logoColor=black)](https://turso.tech)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> A modern, full-stack fitness and nutrition web application tailored specifically to the authentic Kerala diet. Calculate BMI, receive scientifically balanced traditional meal plans, log personal progress, and interact with an immersive 3D wellness experience.

---

### 🚀 **Try the Live Application:**
👉 **[https://kerala-fitness-main-site.netlify.app/login.html](https://kerala-fitness-main-site.netlify.app/login.html)**

---

## 📌 Table of Contents
- [Overview & Value Proposition](#-overview--value-proposition)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Security & Privacy Standards](#-security--privacy-standards)
- [Project Structure](#-project-structure)
- [Local Setup & Development](#-local-setup--development)
- [API Reference](#-api-reference)
- [Author & License](#-author--license)

---

## 🎯 Overview & Value Proposition

Traditional Kerala cuisine—rich in staples such as **Matta (Red Rice)**, **Puttu**, **Appam**, **Kadala Curry**, **Avial**, **Thoran**, and fresh coastal fish—is rarely represented in mainstream, Western-oriented calorie-tracking apps.

**Kerala Fitness** bridges this gap by offering:
1. **Accurate Regional Food Profiles**: Calorie-counted database of authentic South Indian and Kerala dishes.
2. **Personalized Meal Generator**: Intelligent daily diet suggestions tailored to individual goals (Weight Loss, Muscle Building, Maintenance).
3. **Health Trend Logging**: Real-time BMI feedback and historical progress records.
4. **Community Feedback**: Rating and review system for users to share wellness journeys.

---

## ✨ Key Features

### 🥗 Authentic Kerala Diet Planner
- Curated food options across Breakfast, Lunch, Dinner, and Healthy Snacks.
- Balances complex carbohydrates, healthy fats (coconut/mustard oil), and lean protein (fish, eggs, pulses).

### 📊 Real-Time BMI & Health Metrics
- Instant Body Mass Index (BMI) computation with category indicators (Underweight, Normal, Overweight, Obese).
- Milestone history logging to visually monitor fitness transformations over time.

### 🔐 Secure User Authentication
- Fast, streamlined sign-up and login workflow.
- Passwords securely hashed with **bcrypt** (10 salt rounds) before database storage.

### 🌟 3D Glassmorphic Interface
- Interactive 3D ambient globe background built with **Three.js** and **Vanta.js**.
- Fully responsive, mobile-first design styled with modern CSS3.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│                                                             │
│   [ Kerala Fitness Web Application ]                        │
│   • HTML5 / CSS3 / Vanilla ES6+ JavaScript                 │
│   • Three.js / Vanta.js 3D Interactive Canvas               │
│   • Responsive Glassmorphic Layout                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Serverless API Layer (Netlify)                  │
│                                                             │
│                [ Express.js REST API ]                      │
│   • User Authentication & Bcrypt Hashing                    │
│   • Personal Fitness History Logging                        │
│   • Community Reviews API with XSS Sanitization             │
│   • In-Memory Stream Buffer Media Uploads                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│   Turso Cloud Database       │ │   Cloudinary Media Storage  │
│   (Distributed LibSQL)       │ │   (User Profile & Media)    │
│  • users                     │ └─────────────────────────────┘
│  • history                   │
│  • reviews                   │
└──────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Modern ES6+ JavaScript | Semantic, lightweight, and responsive client |
| **3D Graphics** | Three.js & Vanta.js | Immersive 3D background animation |
| **Backend** | Node.js, Express.js | RESTful backend architecture |
| **Serverless** | `serverless-http`, Netlify Functions | Distributed cloud serverless execution |
| **Database** | Turso (Distributed LibSQL / SQLite) | Edge-replicated cloud database |
| **Security** | Bcrypt.js, Parameterized SQL | Cryptographic hashing & SQL injection protection |
| **Media** | Cloudinary & Multer | In-memory buffer uploads directly to CDN |
| **Deployment** | Netlify | Global CDN hosting with serverless functions |

---

## 🔒 Security & Privacy Standards

This project follows robust production security best practices:

- **Strict Environment Decoupling**: Database URLs, tokens, and storage keys are never hardcoded. All credentials are read from environment variables.
- **Zero-Storage Media Ingestion**: Image uploads are processed via in-memory stream buffers (`multer.memoryStorage()`) directly to Cloudinary, ensuring no temporary unencrypted files remain on disk.
- **SQL Injection Defense**: All database queries use parameterized prepared statements (`args: [params]`), preventing SQL injection.
- **XSS Protection**: User-submitted content (reviews and usernames) is escaped before rendering to prevent Cross-Site Scripting.
- **Data Protection**: Local database binaries (`*.db`), deployment caches (`.netlify/`), and secrets (`.env*`) are permanently excluded from version control.

---

## 📁 Project Structure

```
kerala-fitness/
├── main-site/                    # User application & serverless backend
│   ├── netlify/
│   │   └── functions/
│   │       └── api.js            # Serverless Express API & Turso integration
│   ├── .env.example              # Environment variables template
│   ├── background-init.js        # 3D canvas initializer
│   ├── database.js               # LibSQL client & database schema initializer
│   ├── index.html                # Diet planner, BMI calculator & tracker
│   ├── login.html                # Authentication portal (Sign up / Login)
│   ├── login.js                  # Frontend auth handling & validation
│   ├── netlify.toml              # Build settings & API redirect rules
│   ├── package.json              # Backend dependencies & metadata
│   ├── script.js                 # Diet calculation & Kerala food database logic
│   ├── server.js                 # Local Express server runner
│   └── style.css                 # Responsive UI layout & animations
│
├── .gitignore                    # Version control exclusion rules
├── LICENSE                       # MIT License
├── package.json                  # Root project scripts
└── README.md                     # Documentation
```

---

## 🚀 Local Setup & Development

### 1. Clone the Repository
```bash
git clone https://github.com/VishnuVelayudhan/kerala-fitness.git
cd kerala-fitness
```

### 2. Configure Environment Variables
Navigate to `main-site/` and create your local `.env` using the template:
```bash
cd main-site
cp .env.example .env
```

Add your credentials to `.env`:
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
The application will be accessible at:
- **Login / Sign Up**: `http://localhost:8888/login.html`
- **Diet Planner**: `http://localhost:8888/index.html`

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/signup` | `POST` | Registers a new user with bcrypt password hashing |
| `/api/login` | `POST` | Validates credentials and returns session user payload |
| `/api/history` | `POST` | Saves user BMI, weight, and fitness goal |
| `/api/history?userId={id}` | `GET` | Retrieves recorded progression history for a member |
| `/api/reviews` | `POST` | Submits a user testimonial |
| `/api/reviews` | `GET` | Fetches community feedback |
| `/api/upload` | `POST` | Uploads an image directly to Cloudinary via buffer |

---

## 👨‍💻 Author

**Vishnu Velayudhan**
- GitHub: [@VishnuVelayudhan](https://github.com/VishnuVelayudhan)
- Live Application: [Kerala Fitness](https://kerala-fitness-main-site.netlify.app/login.html)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

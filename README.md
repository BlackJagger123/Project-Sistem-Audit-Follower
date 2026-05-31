<div align="center">

# 🔍 InsPector API

### Sistem Cerdas Pendeteksi Pengikut Palsu Berbasis AI untuk Audit Kelayakan Influencer UMKM

[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://supabase.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**Production API** → [https://inspector-api-five.vercel.app](https://inspector-api-five.vercel.app)  
**Frontend** → [https://capstone-project-taupe-one.vercel.app](https://capstone-project-taupe-one.vercel.app)

</div>

---

## 📋 Tentang Proyek

**InsPector** adalah platform audit influencer berbasis AI yang membantu pelaku UMKM di Indonesia mengidentifikasi dan menghindari influencer dengan pengikut palsu (bot) sebelum berinvestasi anggaran promosi. Pengguna cukup memasukkan username Instagram, dan sistem akan menganalisis serta menghasilkan skor kepalsuan beserta rekomendasi.

### Latar Belakang Masalah

- **Sulit memverifikasi kualitas audiens** influencer secara manual sebelum berinvestasi promosi
- **Tidak ada standar audit** yang terjangkau dan mudah diakses untuk UMKM
- **Tingginya risiko ROI rendah** akibat kerjasama dengan influencer berbot tinggi
- **Proses validasi lambat** jika dilakukan secara manual tanpa alat bantu AI

### Solusi yang Ditawarkan

- 🤖 Deteksi bot otomatis menggunakan AI dengan analisis persentase pengikut palsu
- 📊 Risk scoring dengan label: **Low**, **Medium**, **High**
- 📜 Riwayat audit tersimpan dan dapat diakses kapan saja
- 🔐 Autentikasi aman via Google OAuth 2.0 + JWT

---

## 👥 Tim

| Nama | Role | Track |
|------|------|-------|
| Bagus Kurniawan | Frontend Developer | Frontend Development |
| Anas Shohibunnuril Mufida | Backend Developer | Backend Development |

---

## 🚀 Fitur Utama

- **Google OAuth 2.0** — Login tanpa password, autentikasi aman via akun Google
- **Analisis Akun Instagram** — Deteksi bot dengan AI, menghasilkan persentase bot, persentase asli, total sampel, dan rekomendasi
- **Risk Label** — Klasifikasi otomatis: Low (< 20%), Medium (20–30%), High (> 30%)
- **Riwayat Audit** — Semua hasil audit tersimpan dan bisa diakses kapan saja
- **Manajemen Profil** — Update nama tampilan, sinkronasi data dari Google

---

## 📡 API Endpoints

Base URL Production: `https://inspector-api-five.vercel.app/api`  
Base URL Development: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/auth/google` | Public | Mulai Google OAuth flow |
| GET | `/auth/google/callback` | Public | Callback Google → return JWT |
| GET | `/auth/me` | JWT | Data user yang sedang login |
| PUT | `/auth/refresh` | Public | Perbarui access token |
| DELETE | `/auth/logout` | Public | Hapus refresh token |

### Audits

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/audits` | JWT | Buat dan jalankan audit baru |
| GET | `/audits` | JWT | Semua riwayat audit user |
| GET | `/audits/:id` | JWT | Detail satu audit |

### Profile

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/profile` | JWT | Data profil + statistik penggunaan |
| PUT | `/profile` | JWT | Update nama tampilan |

> Semua endpoint JWT wajib menyertakan header: `Authorization: Bearer <accessToken>`

---

## 🗄️ Database Schema

```
users
├── id (UUID, PK)
├── email (UNIQUE)
├── name
├── avatar_url
├── provider
├── provider_id (UNIQUE)
├── created_at
└── updated_at

authentications
├── id (UUID, PK)
├── token (UNIQUE)
├── user_id (FK → users.id)
└── created_at

audits
├── id (UUID, PK)
├── user_id (FK → users.id)
├── ig_username
├── status (pending | processing | completed | failed)
├── total_sample
├── bot_percentage
├── real_percentage
├── risk_label (low | medium | high)
├── recommendation
├── raw_ai_response (JSON)
├── error_message
├── created_at
└── updated_at
```

---

## 🔒 Keamanan

- JWT dengan expiry **15 menit** (access token) dan **7 hari** (refresh token)
- CORS whitelist hanya domain frontend yang terdaftar
- Input sanitization via Joi validation di setiap endpoint
- Row-level security — setiap user hanya bisa akses data miliknya sendiri
- Environment variables tidak pernah di-commit ke repository

---

---

# 🖥️ Backend

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js v20 |
| Framework | Express.js v5 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Authentication | Google OAuth 2.0 + Passport.js |
| Token | JSON Web Token (JWT) |
| Validasi Input | Joi |
| Module System | CommonJS (CJS) |
| Deployment | Vercel Serverless Functions |
| Environment | dotenv, cross-env |

## 📁 Struktur Proyek

```
inspector-api/
├── api/
│   └── index.js                    # Serverless entry point Vercel
├── prisma/
│   ├── schema.prisma               # Database schema & relations
│   └── migrations/                 # Migration history
├── src/
│   ├── exceptions/                 # Custom error classes
│   ├── middlewares/
│   │   ├── auth.js                 # JWT verification middleware
│   │   └── error.js                # Global error handler
│   ├── routes/
│   │   └── index.js                # Route aggregator
│   ├── security/
│   │   ├── passport.js             # Google OAuth strategy
│   │   └── token-manager.js        # JWT generate & verify
│   ├── server/
│   │   └── index.js                # Express app factory
│   ├── services/
│   │   ├── authentications/        # controller, repositories, routes, validator
│   │   ├── audits/                 # controller, repositories, routes, validator
│   │   ├── profile/                # controller, repositories, routes, validator
│   │   └── users/
│   │       └── repositories/
│   └── utils/
│       ├── ai-service.js           # AI service integration
│       ├── prisma.js               # Prisma client singleton
│       ├── response.js             # Response formatter
│       └── server.js               # Local dev entry point
├── .env
├── vercel.json
└── package.json
```

## ⚙️ Instalasi & Menjalankan Lokal

### Prerequisites

Pastikan sudah terinstall di sistem:

- [Node.js v20+](https://nodejs.org)
- npm (sudah termasuk bersama Node.js)
- Akun [Supabase](https://supabase.com) untuk database
- Akun [Google Cloud Console](https://console.cloud.google.com) untuk OAuth credentials

### 1. Clone Repository

```bash
git clone https://github.com/username/inspector-api.git
cd inspector-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
# Database — ambil dari Supabase Dashboard > Project Settings > Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# JWT — isi dengan string random yang panjang
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Google OAuth — ambil dari Google Cloud Console > Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://capstone-project-taupe-one.vercel.app

# AI Service
AI_SERVICE_URL=http://your-ai-service-url

PORT=3000
NODE_ENV=development
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Jalankan Migrasi Database

```bash
npx prisma migrate dev
```

### 6. Jalankan Development Server

```bash
npm run start:dev
```

Server berjalan di `http://localhost:3000`

### 7. Verifikasi

```bash
curl http://localhost:3000/api/health
# Output: {"status":"ok"}
```

## 🚢 Deployment ke Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

Set semua variabel `.env` di **Vercel Dashboard → Settings → Environment Variables**, lalu update `GOOGLE_CALLBACK_URL` ke URL production dan daftarkan di Google Cloud Console → Authorized Redirect URIs.

## 📋 Alur Pengerjaan Backend

1. Diskusi kebutuhan sistem bersama tim frontend
2. Menyusun Product Requirements Document (PRD) — fitur, user roles, use case, tech stack
3. Merancang Entity Relationship Diagram (ERD) — tabel users, authentications, audits beserta relasinya
4. Menyusun API Contract — endpoint, request body, response sukses, response error, auth requirements
5. Membuat Postman Collection sebagai referensi testing untuk tim frontend
6. Inisialisasi project Node.js dengan arsitektur modular (controller, repository, validator, middleware, routes)
7. Install dependencies — Express, Prisma, Passport, JWT, Joi, CORS, dotenv
8. Konfigurasi environment variables di file .env serta setup CORS multi-origin untuk mendukung frontend development dan production
9. Setup Supabase — buat project, ambil connection string pooling (port 6543) dan direct (port 5432)
10. Inisialisasi Prisma ORM — prisma init, tulis schema (User, Authentication, Audit, enum)
11. Jalankan migrasi database ke Supabase — prisma migrate dev
12. Implementasi custom error classes — AuthenticationError, AuthorizationError, NotFoundError, InvariantError, ServerError serta error middleware dengan pesan berbeda per status code
13. Implementasi TokenManager — generate dan verify access token & refresh token berbasis JWT
14. Implementasi Google OAuth 2.0 dengan Passport.js — strategy, upsert user ke DB, serta perbaikan bug preserve nama user saat re-login
15. Implementasi auth middleware — verifikasi JWT dari Authorization header
16. Implementasi semua endpoint Authentication, Audit, dan Profile beserta controller, repository, validator, dan routes masing-masing
17. Implementasi AI Service helper — hit AI eksternal, parse response, derive risk label, handle status restricted (403) & error
18. Testing manual semua endpoint via Postman Collection dan integrasi dengan AI service
19. Implementasi halaman landing page pada root endpoint sebagai dokumentasi visual API serta health check endpoint untuk monitoring
20. Konfigurasi deployment Vercel — vercel.json, serverless entry point, postinstall prisma generate
21. Migrasi codebase dari ESM ke CJS — resolve konflik ERR_INTERNAL_ASSERTION di Node 20
22. Set environment variables di Vercel Dashboard, update Google Cloud Console callback URL, deploy ke Vercel dan verifikasi API live di production

---

---

# 🌐 Frontend

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Routing | React Router |
| HTTP Client | Fetch API |
| State Management | React Context (AuthContext) |
| Deployment | Vercel |

## 📁 Struktur Proyek

```
capstone-project/
├── public/                         # Static assets
├── src/
│   ├── api/                        # API functions (auth, data handling)
│   ├── assets/                     # Images & static resources
│   ├── components/
│   │   └── ui/                     # shadcn/ui components (Button, Card, Input, Avatar, Badge)
│   ├── context/
│   │   └── AuthContext.jsx         # State autentikasi global
│   ├── layouts/                    # Page layout templates
│   ├── lib/
│   │   └── utils.js                # cn function untuk class merging
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CallbackPage.jsx        # Tangkap token dari OAuth redirect
│   │   ├── DashboardPage.jsx       # Form audit + sidebar riwayat
│   │   └── ProfilePage.jsx
│   ├── App.jsx                     # Root component & route definitions
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Tailwind styles
├── .env
├── index.html
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## ⚙️ Instalasi & Menjalankan Lokal

### Prerequisites

Pastikan sudah terinstall di sistem:

- [Node.js v18+](https://nodejs.org)
- npm (sudah termasuk bersama Node.js)

### 1. Clone Repository

```bash
git clone https://github.com/Bk1784/capstone_project.git
cd fakradar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ORIGIN=http://localhost:3000
```

Untuk production ganti dengan:

```env
VITE_API_BASE_URL=https://inspector-api-five.vercel.app/api
VITE_API_ORIGIN=https://inspector-api-five.vercel.app
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

### 5. Build untuk Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 🚢 Deployment ke Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

## 📋 Alur Pengerjaan Frontend

1. Diskusi kebutuhan sistem bersama tim backend
2. Menyusun Product Requirements Document (PRD) — fitur, user roles, use case, tech stack
3. Desain UI/UX menggunakan Figma — Landing Page, Login, Dashboard, Profile
4. Inisialisasi project React 18 + Vite + Tailwind CSS + shadcn/ui
5. Setup routing dengan React Router dan struktur folder (pages, components, context, utils)
6. Implementasi AuthContext untuk state autentikasi global
7. Implementasi Google OAuth flow — redirect ke `/auth/google`, tangkap token di `/auth/callback`
8. Implementasi CallbackPage — baca query params token, hit `/auth/me`, simpan ke localStorage
9. Implementasi Dashboard — sidebar riwayat audit (GET /audits), form input username, tampilkan hasil analisis AI
10. Implementasi detail audit — klik sidebar → GET /audits/:id → tampilkan detail lengkap
11. Implementasi ProfilePage — tampilkan data user, update nama via PUT /profile, refetch /auth/me
12. Implementasi protected routes — redirect ke login jika belum autentikasi
13. Testing manual semua fitur — login, analisis akun valid/private/@, riwayat, edit profil, logout
14. Deploy ke Vercel dan verifikasi aplikasi live di production

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

Dibuat dengan ❤️ untuk mendukung UMKM Indonesia

**InsPector** — AI Fake Follower Detector · MVP v1.0

</div>

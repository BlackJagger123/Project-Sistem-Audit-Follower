# 🚀 InsPector: Fake Followers Detection API

## 📌 Deskripsi Singkat Proyek
**InsPector** adalah sistem *backend* berbasis RESTful API yang berfungsi untuk mengaudit kualitas pengikut (*followers*) suatu akun Instagram secara dinamis. Sistem ini memadukan teknologi *Real-time Web Scraping* menggunakan Apify dengan algoritma **Deep Learning** untuk mendeteksi persentase akun bot/spam. Proyek ini bertujuan untuk membantu *brand*, agensi digital, atau pemasar mencegah pemborosan anggaran (*budget waste*) akibat berkolaborasi dengan *influencer* yang memiliki audiens palsu.

---

## ✨ Fitur Utama
* **Real-time Account Audit:** Menarik sampel 50 pengikut terbaru dari akun target dan membedah metrik profilnya secara langsung (tanpa data usang).
* **Deep Learning Detection:** Memanfaatkan arsitektur *Neural Network* dengan akurasi 96.45% untuk mendeteksi bot berdasarkan 11 fitur matriks perilaku akun.
* **Multi-Token Fallback System:** Sistem pertahanan cerdas yang secara otomatis merotasi token API *scraper* (hingga 7 token cadangan) jika terjadi *limit* harian atau pemblokiran IP, sehingga API tetap tangguh (*robust*) tanpa *error 500*.
* **Second Account (Sec Acc) Saver:** Algoritma penyaring khusus (*Manual Override*) untuk menyelamatkan akun sekunder milik manusia asli agar tidak salah divonis sebagai bot.
* **Smart Decision Logic:** Menerjemahkan hasil kalkulasi AI ke dalam 4 kategori rekomendasi bisnis: Sangat Berkualitas, Wajar, Waspada, dan Perlu Tinjauan Lanjut.

---

## 🛠️ Tech Stack AI
* **Bahasa Pemrograman:** Python 3.11
* **Framework Backend:** FastAPI, Uvicorn, Pydantic
* **Machine Learning:** TensorFlow (Keras), Scikit-Learn (Joblib), Pandas, NumPy
* **Data Extraction:** Apify Client SDK
* **Deployment (Opsional):** Hugging Face Spaces (Docker)

---

## 🛠️ Tech Stack FULLSTACK
* **Package Manager:** npm
* **Teknologi Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui
* **Teknologi Backend:** Node.js, Express, PostgreSQL, JWT, Google Oauth
* **Deployment:** Vercel

---

## 🛠️ Tech Stack DATA SCIENCE
* **Bahasa Pemrograman:** Python 3.11
* **Framework Backend:** FastAPI, Uvicorn, Pydantic
* **Machine Learning:** TensorFlow (Keras), Scikit-Learn (Joblib), Pandas, NumPy
* **Data Extraction:** Apify Client SDK
* **Deployment (Opsional):** Hugging Face Spaces (Docker)

---
##  📋 Pengerjaan Frontend
1. Diskusi kebutuhan sistem bersama tim backend
2. Menyusun Product Requirements Document (PRD) — fitur, user roles, use case, tech stack
3. Desain UI/UX menggunakan Figma — Landing Page, Login, Dashboard, Profile
4. Inisialisasi project React 18 + Vite + Tailwind CSS + shadcn/ui
5. Setup routing dengan React Router dan struktur folder (pages, components, context, utils)
6. Implementasi AuthContext untuk state autentikasi global
7. Implementasi Google OAuth flow — redirect ke /auth/google, tangkap token di /auth/callback
8. Implementasi CallbackPage — baca query params token, hit /auth/me, simpan ke localStorage
9. Implementasi Dashboard — sidebar riwayat audit (GET /audits), form input username, tampilkan hasil analisis AI
10. Implementasi detail audit — klik sidebar → GET /audits/:id → tampilkan detail lengkap
11. Implementasi ProfilePage — tampilkan data user, update nama via PUT /profile, refetch /auth/me
12. Implementasi protected routes — redirect ke login jika belum autentikasi
13. Testing manual semua fitur — login, analisis akun valid/private/@, riwayat, edit profil, logout
14. Deploy ke Vercel dan verifikasi aplikasi live di production

##  📋 Pengerjaan Backend
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

## 🧠 Penjelasan Model Deep Learning
Proyek ini mengimplementasikan arsitektur **Deep Learning** jenis *Multi-Layer Perceptron* (MLP) untuk mengklasifikasikan akun menjadi Manusia Asli (0) atau Bot (1).

* **Input Features:** Model menerima 11 metrik numerik hasil ekstraksi *scraper*, antara lain: keberadaan foto profil kustom, rasio angka pada *username* dan *fullname*, panjang bio, keberadaan *external link*, status *private*, serta jumlah *posts*, *followers*, dan *following*.
* **Arsitektur Deep Learning:** Dibangun dari nol menggunakan TensorFlow/Keras dengan struktur lapisan yang dalam (*deep*):
  * **Input Layer:** 11 *nodes* (menyesuaikan jumlah input fitur).
  * **Deep Hidden Layers:** * Lapis 1: 64 *nodes* (Aktivasi ReLU) dilengkapi dengan *Dropout (0.1)* untuk mencegah penghafalan data (*overfitting*).
    * Lapis 2: 32 *nodes* (Aktivasi ReLU).
    * Lapis 3: 16 *nodes* (Aktivasi ReLU).
  * **Output Layer:** 1 *node* (Aktivasi Sigmoid) untuk menghasilkan probabilitas akhir antara 0.0 hingga 1.0.
* **Custom Loss Function:** Model ini menggunakan fungsi `BinaryCrossentropy` kustom dengan penambahan nilai *epsilon* (`1e-7`) untuk mencegah *error log(0)* selama proses pelatihan dan perbaikan bobot.
* **Hasil Evaluasi:** Model mencapai **Akurasi Ujian (Test Accuracy) sebesar 96.45%** pada *dataset* pengujian.

---

## ⚙️ Penjelasan Cara Kerja Backend & Scraper (Apify)
Sistem *backend* bekerja melalui alur sekuensial berikut setiap kali menerima *request*:

1. **Fase 0 - Validasi Target:** Scraper memvalidasi profil akun target. Jika akun berstatus *Private*, API akan memotong proses dan mengembalikan status HTTP `403 Forbidden` untuk menjaga privasi.
2. **Fase 1 - Ekstraksi Followers:** Scraper tanpa-*cookies* menarik daftar 50 *username* pengikut terbaru akun target.
3. **Fase 2 - Ekstraksi Profil:** Mengirimkan ke-50 *username* tersebut kembali ke Apify untuk dibedah metrik profilnya secara detail (menghasilkan data JSON).
4. **Fase 3 - Feature Engineering:** Memproses data JSON menjadi 11 matriks angka, lalu melakukan standarisasi data menggunakan `scaler.pkl`.
5. **Fase 4 - AI Inference & Sec Acc Saver:** Mengirim matriks ke model `.keras`. Akun yang mendapat skor probabilitas > 0.5 diinterogasi ulang. Jika akun memiliki *following* sewajarnya, memiliki *postingan*, atau berfoto, vonis bot dibatalkan.

---

## 🔗 Tautan & Cara Load Model ML

Berdasarkan persyaratan proyek capstone, model Machine Learning yang digunakan untuk deteksi ini telah diunggah ke penyimpanan *cloud* pribadi.

**Tautan Unduhan Model:**
👉 **[[Klik di sini untuk mengakses folder Google Drive Model AI](https://drive.google.com/drive/folders/1T8LtyPmcPHuAdEaM8YbgpPMQ1f7XVCVm?usp=sharing)]**

Folder tersebut berisi dua file krusial:
1. `fake_followers_model.keras`: Arsitektur dan bobot *Neural Network*.
2. `scaler.pkl`: Parameter standarisasi data numerik.

**Cara Memuat (Load) Model ke dalam Sistem:**
Letakkan kedua file tersebut dalam folder direktori utama proyek. Sistem FastAPI memuat model pada saat *server startup* menggunakan `joblib` dan `tensorflow`. Argumen `compile=False` digunakan karena model hanya dipakai untuk proses *inference*, membuat komputasi *server* menjadi jauh lebih ringan.

```python
import tensorflow as tf
import joblib

# Load Scaler
scaler = joblib.load('scaler.pkl')

# Load Model
model = tf.keras.models.load_model('fake_followers_model.keras', compile=False)
````
## 💻 Petunjuk Setup Environment FS
**Frontend**
### 1. Kloning Repositori
```bash
Git clone https://github.com/Bk1784/capstone_project
cd fakradar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development
```bash
npm run dev
```

### 4. Akses Browser
```bash
http://localhost:5173
```

## Backend
Pastikan sudah terinstall di sistem:

- [Node.js v20+](https://nodejs.org)
- npm (sudah termasuk bersama Node.js)
- Akun [Supabase](https://supabase.com) untuk database
- Akun [Google Cloud Console](https://console.cloud.google.com) untuk OAuth credentials

### 1. Clone Repository

bash
git clone https://github.com/username/inspector-api.git
cd inspector-api


### 2. Install Dependencies

bash
npm install


### 3. Setup Environment Variables

Buat file .env di root project:

env
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


### 4. Generate Prisma Client

bash
npx prisma generate


### 5. Jalankan Migrasi Database

bash
npx prisma migrate dev


### 6. Jalankan Development Server

bash
npm run start:dev


Server berjalan di http://localhost:3000

### 7. Verifikasi

bash
curl http://localhost:3000/api/health
# Output: {"status":"ok"}


## 🚢 Deployment ke Vercel

bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod


Set semua variabel .env di *Vercel Dashboard → Settings → Environment Variables*, lalu update GOOGLE_CALLBACK_URL ke URL production dan daftarkan di Google Cloud Console → Authorized Redirect URIs.

## 💻 Petunjuk Setup Environment AI

### 1. Kloning Repositori
```bash
git clone https://github.com/BlackJagger123/Project-Sistem-Audit-Follower.git
cd InsPector-API
````
### 2. Buat dan Aktifkan Virtual Environment
Sangat disarankan menggunakan virtual environment agar library tidak bentrok.

untuk Windows :
```bash
python -m venv venv
venv\Scripts\activate
````
untuk Mac/Linux :
````bash
python3 -m venv venv
source venv/bin/activate
````

## 3. Instalasi Dependencies
````Bash
pip install -r requirements.txt
````
## 4. Konfigurasi Environment Variables (.env)
Buat file bernama .env di direktori utama (root) dan masukkan token Apify kamu. Sistem mendukung banyak token (fallback) untuk menghindari Daily Run Limit. Wajib menggunakan awalan APIFY_TOKEN_.

````Cuplikan kode
APIFY_TOKEN_1=apify_api_token_pertama_kamu
APIFY_TOKEN_2=apify_api_token_kedua_kamu
APIFY_TOKEN_3=apify_api_token_ketiga_kamu
````
## 🚀 Cara Menjalankan Aplikasi
### A. Menjalankan Server (Localhost)
Pastikan virtual environment sudah aktif, lalu jalankan server menggunakan Uvicorn:

````Bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
````
Aplikasi akan berjalan di http://localhost:8000. Untuk melihat antarmuka dokumentasi interaktif dan mencoba API secara langsung, buka http://localhost:8000/docs (Swagger UI).

### B. Penggunaan API Request (Testing)
Kirimkan HTTP POST ke endpoint /api/cek-bot dengan body JSON seperti berikut:

````JSON
{
  "username": "nama_akun_target_tanpa_simbol_at"
}
````
### Contoh Respons Berhasil (HTTP 200 OK):

```JSON
{
  "status": "success",
  "target_akun": "@nama_akun_target",
  "total_sampel_diperiksa": 50,
  "metrik_kualitas": {
    "persentase_bot": 24.0,
    "persentase_asli": 76.0,
    "timestamp": "2026-05-30T14:15:00.000000+07:00"
  },
  "rekomendasi": "Wajar. Terdeteksi 24.0% pengikut dengan pola tidak aktif/bot..."
}

````


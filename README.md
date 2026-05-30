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
* **Bahasa Pemrograman:** Python 3.11
* **Framework Backend:** FastAPI, Uvicorn, Pydantic
* **Machine Learning:** TensorFlow (Keras), Scikit-Learn (Joblib), Pandas, NumPy
* **Data Extraction:** Apify Client SDK
* **Deployment (Opsional):** Hugging Face Spaces (Docker)

---

## 🛠️ Tech Stack DATA SCIENCE
* **Bahasa Pemrograman:** Python 3.11
* **Framework Backend:** FastAPI, Uvicorn, Pydantic
* **Machine Learning:** TensorFlow (Keras), Scikit-Learn (Joblib), Pandas, NumPy
* **Data Extraction:** Apify Client SDK
* **Deployment (Opsional):** Hugging Face Spaces (Docker)

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

## 💻 Petunjuk Setup Environment

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


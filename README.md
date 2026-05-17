## Deteksi Pengikut Palsu (Fake Follower)
Repositori ini berisi Model AI yang secara khusus dibuat untuk membedakan antara akun Instagram manusia asli (organik) dan akun bot (palsu).

## Tujuan Utama
Dalam dunia influencer marketing, metrik jumlah followers yang besar sering kali menipu karena banyaknya peredaran akun bot/palsu.
Tujuan utama model AI ini adalah untuk menjadi standar yang menjaga kualitas. Model ini diciptakan untuk melindungi UMKM dan Brand agar anggaran marketing mereka tidak terbuang sia-sia ke target audiens palsu yang tidak memiliki daya beli.

## Apa Fungsi Model Ini?
Model ini berfungsi layaknya seorang analis data super cepat. Tugasnya meliputi:
- Memindai Karakteristik Akun: Menerima 11 metrik dasar dari profil Instagram (seperti: apakah akun memiliki foto profil, panjang bio, perbandingan jumlah pengikut vs yang diikuti, dan komposisi angka pada username).
- Menganalisis Pola: Mencocokkan data tersebut dengan pola jaringan bot yang sudah dipelajari oleh AI sebelumnya.
- Mengeluarkan Vonis (Scoring): Menghasilkan skor probabilitas dari 0% hingga 100% untuk menentukan apakah akun tersebut adalah Manusia Asli atau Bot.

## Cara Kerja di Ekosistem Fluensy
File utama dalam repositori ini (fake_followers_model.keras) adalah model final yang sudah selesai dilatih dan sudah sangat pintar.
Sistem ini dirancang berkonsep Plug & Play. Model ini siap ditanamkan ke dalam API utama, di mana ia akan bekerja berdampingan dengan skrip penarik data (Scraper) untuk mengaudit kualitas pengikut seorang influencer secara massal dan otomatis.

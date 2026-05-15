import pandas as pd

def eksplorasi_dataset():
    print("🔍 Memulai Pengecekan Dataset...")
    
    # 1. Memuat Data
    # Pastikan file train.csv berada di folder yang sama
    try:
        df = pd.read_csv('master_dataset_cleaned.csv')
        print("✅ File csv berhasil dimuat!")
    except FileNotFoundError:
        print("❌ Error: File csv tidak ditemukan di folder ini.")
        return

    # 2. Melihat Dimensi Data
    print("\n📊 --- Informasi Dasar ---")
    print(f"Total Baris (Jumlah Akun): {df.shape[0]}")
    print(f"Total Kolom (Fitur + Target): {df.shape[1]}")

    # 3. Mengecek Missing Values (Data Kosong)
    # AI (TensorFlow) sangat membenci data kosong, jadi kita harus memastikannya bersih
    print("\n🧹 --- Pengecekan Data Kosong (Missing Values) ---")
    missing_data = df.isnull().sum()
    if missing_data.sum() == 0:
        print("Luar biasa! Dataset sangat bersih, tidak ada data yang kosong.")
    else:
        print("Ditemukan data kosong pada kolom berikut:")
        print(missing_data[missing_data > 0])

    # 4. Mengecek Keseimbangan Kelas Target
    # Target kita ada di kolom 'fake' (0 = Asli, 1 = Bot)
    print("\n⚖️ --- Distribusi Kelas Target ('fake') ---")
    distribusi = df['fake'].value_counts()
    
    # Menampilkan hasilnya
    print(f"Akun Organik/Asli (0) : {distribusi[0]} sampel")
    print(f"Akun Bot/Palsu (1)    : {distribusi[1]} sampel")
    
    # Cek Persentase
    persentase_bot = (distribusi[1] / df.shape[0]) * 100
    print(f"Persentase Bot dalam dataset: {persentase_bot:.1f}%")

if __name__ == "__main__":
    eksplorasi_dataset()
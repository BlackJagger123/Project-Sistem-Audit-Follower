import streamlit as st
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import time

st.set_page_config(page_title="Fluensy - Deteksi Bot", page_icon="🕵️", layout="centered")

st.title("🕵️ Cek Kualitas Akun Instagram")
st.write("Sistem kecerdasan buatan untuk menganalisis apakah sebuah akun adalah Bot atau Manusia.")
st.markdown("---")

@tf.keras.utils.register_keras_serializable()
class CustomBinaryCrossEntropy(tf.keras.losses.Loss):
    def __init__(self, name="custom_bce", **kwargs):
        super().__init__(name=name, **kwargs)
        
    def call(self, y_true, y_pred):
        y_true = tf.reshape(y_true, tf.shape(y_pred))
        epsilon = 1e-7
        y_pred = tf.clip_by_value(y_pred, epsilon, 1. - epsilon)
        loss = - (y_true * tf.math.log(y_pred) + (1 - y_true) * tf.math.log(1 - y_pred))
        return tf.reduce_mean(loss)

@st.cache_resource
def load_ai_components():
    model = tf.keras.models.load_model(
        'fake_followers_model.keras', 
        custom_objects={'CustomBinaryCrossEntropy': CustomBinaryCrossEntropy}
    )
    scaler = joblib.load('scaler.pkl')
    return model, scaler

try:
    model, scaler = load_ai_components()
except Exception as e:
    st.error(f"Gagal memuat sistem AI. Pastikan file .keras dan .pkl ada di folder yang sama. Error: {e}")
    st.stop()

st.subheader("📊 Masukkan Data Profil")

col1, col2 = st.columns(2)

with col1:
    profile_pic = st.selectbox("Punya Foto Profil?", ["Ya", "Tidak"])
    private_acc = st.selectbox("Akun Private?", ["Tidak", "Ya"])
    name_equals_username = st.selectbox("Nama = Username?", ["Tidak", "Ya"])
    external_url = st.selectbox("Punya Link di Bio (External URL)?", ["Tidak", "Ya"])
    fullname_words = st.number_input("Jumlah Kata pada Nama Lengkap", min_value=0, max_value=10, value=2)
    desc_length = st.number_input("Panjang Karakter Bio (Description)", min_value=0, max_value=500, value=50)

with col2:
    followers = st.number_input("Jumlah Followers", min_value=0, value=150)
    follows = st.number_input("Jumlah Following", min_value=0, value=200)
    posts = st.number_input("Jumlah Postingan", min_value=0, value=15)
    ratio_num_username = st.slider("Rasio Angka di Username (0.0 - 1.0)", 0.0, 1.0, 0.0)
    ratio_num_fullname = st.slider("Rasio Angka di Nama Lengkap (0.0 - 1.0)", 0.0, 1.0, 0.0)

if st.button("🔍 Analisis Akun", use_container_width=True):
    with st.spinner('AI sedang memindai pola akun...'):
        time.sleep(1) 

        p_pic = 1 if profile_pic == "Ya" else 0
        p_priv = 1 if private_acc == "Ya" else 0
        p_name_user = 1 if name_equals_username == "Ya" else 0
        p_url = 1 if external_url == "Ya" else 0
        
        input_data = np.array([[
            p_pic, ratio_num_username, fullname_words, ratio_num_fullname, 
            p_name_user, desc_length, p_url, p_priv, posts, followers, follows
        ]])
        
        input_scaled = scaler.transform(input_data).astype('float32')
        
        prediction_prob = model.predict(input_scaled, verbose=0)[0][0]
        
        st.markdown("---")
        st.subheader("💡 Hasil Analisis")
        
        prob_persen = prediction_prob * 100
        is_bot = prediction_prob > 0.5
        
        insights = []
        
        if is_bot:
            st.error(f"⚠️ **TERDETEKSI SEBAGAI BOT (FAKE)**")
            st.write(f"Tingkat Keyakinan AI: **{prob_persen:.2f}%**")
            st.progress(float(prediction_prob))
            
            if p_pic == 0:
                insights.append("- **Ketiadaan Foto Profil:** Ini adalah indikator terkuat dari akun pasif atau akun ternakan.")
            if desc_length == 0:
                insights.append("- **Bio Kosong:** Akun tidak memiliki identitas deskriptif sama sekali.")
            if follows > (followers * 5) and follows > 500:
                insights.append(f"- **Rasio Interaksi Ekstrem:** Mengikuti terlalu banyak orang ({follows}) dibandingkan jumlah pengikutnya ({followers}), indikasi aktivitas *mass-following*.")
            if posts < 5:
                insights.append("- **Jejak Konten Minim:** Akun memiliki sangat sedikit postingan, menandakan kurangnya aktivitas organik.")
            if p_name_user == 1:
                insights.append("- **Kesamaan Nama:** Penggunaan nama profil yang sama persis dengan *username* sering digunakan oleh *script* pembuat bot otomatis.")
            if ratio_num_username > 0.3:
                insights.append("- **Username Tidak Natural:** Terdapat terlalu banyak elemen angka pada *username*.")
                
            if not insights:
                insights.append("- Meskipun beberapa metrik terlihat normal, kombinasi perilaku akun ini secara keseluruhan terdeteksi identik dengan pola jaringan bot dalam *database* kami.")

        else:
            prob_asli = (1 - prediction_prob) * 100
            st.success(f"✅ **AKUN MANUSIA ASLI (REAL)**")
            st.write(f"Tingkat Keyakinan AI: **{prob_asli:.2f}%**")
            st.progress(float(1 - prediction_prob))
            
            if p_pic == 1:
                insights.append("- **Identitas Visual:** Memiliki foto profil yang valid.")
            if desc_length > 10:
                insights.append("- **Bio Terstruktur:** Memiliki deskripsi profil yang menunjukkan identitas/keterangan personal.")
            if posts > 20:
                insights.append(f"- **Aktivitas Konten Aktif:** Memiliki rekam jejak {posts} postingan yang menunjukkan penggunaan jangka panjang.")
            if 0 < follows <= (followers * 3):
                insights.append("- **Rasio Sosial Organik:** Perbandingan antara jumlah *followers* dan *following* berada dalam batas wajar interaksi manusia.")
        
        st.markdown("**Alasan Analisis:**")
        for point in insights:
            st.markdown(point)
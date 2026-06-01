import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BASE_URL = "https://inspector-api-five.vercel.app/api";

export default function ProfilePage() {
  const { user, updateUsername, logout, getToken } = useAuth();
  const [username, setUsername] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: username.trim() }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const meData = await meRes.json();
        if (meData.status === "success") updateUsername(meData.data.name);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(data.message || "Gagal menyimpan perubahan.");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col p-4 gap-3" style={{ background: "#e8eeff" }}>

      {/* ── HEADER — identik dengan Dashboard ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Tombol kembali */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#5b8dee" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: "#5b8dee" }}>Inspector</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
          >
            Keluar
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-gray-500">{user?.name || ""}</span>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.picture} />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div style={{ maxWidth: 480, margin: "0 auto" }}>

          <h1 className="text-xl font-bold text-gray-800 mb-4">Pengaturan Profil</h1>

          {/* Profile info card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 mb-3">
            <img
              src={user?.picture}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid #5b8dee" }}
            />
            <div>
              <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Foto diambil dari akun Google</p>
            </div>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-5"
          >
            {/* Nama */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest font-medium block mb-2">
                Nama Tampilan
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan nama kamu"
                minLength={2}
                maxLength={100}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1.5">Min. 2 karakter, maks. 100 karakter.</p>
            </div>

            {/* Email (disabled) */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest font-medium block mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 outline-none cursor-not-allowed opacity-70"
              />
              <p className="text-xs text-gray-400 mt-1.5">Email tidak dapat diubah.</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!username.trim() || username.trim().length < 2 || loading}
              className="w-full py-3 rounded-lg font-bold text-sm text-white border-0 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: saved ? "#10b981" : "#5b8dee" }}
            >
              {loading ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
            </button>
          </form>

        </div>
      </div>
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 28px 24px",
              width: "100%", maxWidth: 360,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column", gap: 8,
            }}
          >
            {/* Icon */}
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </div>

            <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Keluar dari Inspector?</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Kamu akan keluar dari akun <strong style={{ color: "#1e293b" }}>{user?.name}</strong>. Kamu perlu login kembali untuk menggunakan Inspector.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #e5e7eb",
                  background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "background .15s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#f3f4f6"}
                onMouseOut={e => e.currentTarget.style.background = "#f9fafb"}
              >
                Batal
              </button>
              <button
                onClick={() => { logout(); navigate("/"); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                  background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "background .15s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#dc2626"}
                onMouseOut={e => e.currentTarget.style.background = "#ef4444"}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "https://inspector-api-five.vercel.app/api";

export default function CallbackPage() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("token");
        const refreshToken = params.get("refresh");

        if (!accessToken || !refreshToken) {
          setError("Login gagal, silakan coba lagi.");
          return;
        }

        const res = await fetch(`${BASE_URL}/auth/me?t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();

        if (data.status === "success") {
          handleOAuthCallback(accessToken, refreshToken, data.data);
          navigate("/dashboard", { replace: true });
        } else {
          setError("Login gagal, silakan coba lagi.");
        }
      } catch {
        setError("Terjadi kesalahan saat proses login.");
      }
    };

    processCallback();
  }, []);

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-3" style={{ background: "#e8eeff" }}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-6 flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <p className="text-sm text-gray-600 text-center">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold cursor-pointer border-0 bg-transparent transition-opacity hover:opacity-70"
            style={{ color: "#5b8dee" }}
          >
            ← Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-3" style={{ background: "#e8eeff" }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-6 flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-blue-400 animate-spin" style={{ borderTopColor: "#5b8dee" }} />
        <p className="text-sm text-gray-500">Memproses login...</p>
      </div>
    </div>
  );
}
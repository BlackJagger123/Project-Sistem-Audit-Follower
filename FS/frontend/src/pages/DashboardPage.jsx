import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const BASE_URL = "https://inspector-api-five.vercel.app/api";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function riskConfig(label) {
  if (label === "high") return { text: "Risiko Bot", color: "text-red-500", badgeBg: "bg-red-50 text-red-500 border-red-200" };
  if (label === "medium") return { text: "Risiko Sedang", color: "text-orange-400", badgeBg: "bg-orange-50 text-orange-400 border-orange-200" };
  return { text: "Risiko Aman", color: "text-emerald-500", badgeBg: "bg-emerald-50 text-emerald-500 border-emerald-200" };
}

export default function DashboardPage() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState("search");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loadingHistoryId, setLoadingHistoryId] = useState(null);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false); // default tutup di mobile
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/audits?page=1&limit=20`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (data.status === "success") setHistory(data.data.data);
      } catch {}
      finally { setHistoryLoading(false); }
    };
    fetchHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const username = searchInput.replace("@", "").trim();
    if (!username) return;
    setSearching(true); setSearchError(null);
    try {
      const res = await fetch(`${BASE_URL}/audits`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ig_username: username }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSelectedItem(data.data); setView("result");
        setSearchInput("");
        setHistory((prev) => [data.data, ...prev]);
        if (isMobile) setSidebarOpen(false);
      } else { setSearchError(data.message || "Gagal memproses audit."); }
    } catch { setSearchError("Terjadi kesalahan, coba lagi."); }
    finally { setSearching(false); }
  };

  const handleSelectHistory = async (item) => {
    if (loadingHistoryId) return;
    setLoadingHistoryId(item.id);
    try {
      const res = await fetch(`${BASE_URL}/audits/${item.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setSelectedItem(data.data);
        setView("result");
        if (isMobile) setSidebarOpen(false); // tutup sidebar setelah pilih di mobile
      }
    } catch {}
    finally { setLoadingHistoryId(null); }
  };

  const handleCariKembali = () => {
    setView("search"); setSelectedItem(null); setSearchError(null);
    if (isMobile) setSidebarOpen(false);
  };

  const risk = selectedItem ? riskConfig(selectedItem.risk_label) : null;

  return (
    <div className="h-screen w-screen flex flex-col p-2 gap-2 md:p-4 md:gap-3" style={{ background: "#e8eeff" }}>

      {/* HEADER */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#5b8dee" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: "#5b8dee" }}>Inspector</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-sm text-gray-500 hidden sm:block">{user?.name || ""}</span>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.picture} />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </button>
      </header>

      {/* BODY */}
      <div className="flex-1 flex gap-3 min-h-0 relative">

        {/* OVERLAY untuk mobile — klik untuk tutup sidebar */}
        {isMobile && sidebarOpen && (
          <div
            className="absolute inset-0 z-10 rounded-xl"
            style={{ backdropFilter: "blur(2px)", background: "rgba(232, 238, 255, 0.6)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300
            ${isMobile
              ? `absolute top-0 left-0 h-full z-20 ${sidebarOpen ? "w-72" : "w-0"}`
              : `relative flex-shrink-0 ${sidebarOpen ? "w-72" : "w-0"}`
            }
          `}
        >
          {/* Search button */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button
              onClick={handleCariKembali}
              className="w-full flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2.5 transition-colors border border-gray-200 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="text-sm text-gray-400">search</span>
            </button>
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto py-2">
            {historyLoading ? (
              <div className="flex flex-col gap-1 px-4 py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 py-2.5">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <p className="text-gray-400 text-sm px-4 py-3">Belum ada riwayat.</p>
            ) : (
              history.map((item) => {
                const r = riskConfig(item.risk_label);
                const isActive = selectedItem?.id === item.id && view === "result";
                const isLoadingThis = loadingHistoryId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectHistory(item)}
                    disabled={!!loadingHistoryId}
                    className={`w-full text-left px-4 py-3 transition-colors border-0 bg-transparent flex items-center gap-2
                      ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}
                      ${loadingHistoryId && !isLoadingThis ? "opacity-40" : ""}
                      ${isLoadingThis ? "cursor-wait" : "cursor-pointer"}
                    `}
                  >
                    {isLoadingThis ? (
                      <>
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-4 w-16 rounded" />
                      </>
                    ) : (
                      <>
                        <span className={`text-sm font-semibold ${r.color}`}>@{item.ig_username}</span>
                        <span className="text-gray-300 text-sm">-</span>
                        <span className={`text-sm ${r.color}`}>{r.text}</span>
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">

          {/* SEARCH VIEW */}
          {view === "search" && (
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-md text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#5b8dee" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h2 className="text-base md:text-lg font-bold mb-1">Analisis Akun Instagram</h2>
                <p className="text-gray-400 text-sm mb-4">Masukkan username tanpa @</p>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="username_instagram"
                    disabled={searching}
                    className="flex-1 border-gray-200 focus:border-blue-400 text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={searching || !searchInput.trim()}
                    style={{ background: "#5b8dee" }}
                    className="hover:opacity-90 transition-opacity text-white border-0 flex-shrink-0"
                  >
                    {searching
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : "Analisis"
                    }
                  </Button>
                </form>
                {searching && <p className="text-gray-400 text-xs mt-3 animate-pulse">Sedang menganalisis, mohon tunggu beberapa menit...</p>}
                {searchError && <p className="text-red-500 text-sm mt-3">{searchError}</p>}
              </div>
            </main>
          )}

          {/* RESULT VIEW */}
          {view === "result" && selectedItem && (
            <main className="flex-1 p-3 md:p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <h2 className="text-lg md:text-xl font-bold" style={{ color: "#5b8dee" }}>@{selectedItem.ig_username}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${risk.badgeBg}`}>
                      {risk.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="rounded-xl md:rounded-2xl p-2 md:p-5 text-center" style={{ background: "#fff0f0" }}>
                      <p className="text-xl md:text-3xl font-bold" style={{ color: "#f87171" }}>{parseFloat(selectedItem.bot_percentage).toFixed(0)}%</p>
                      <p className="text-xs mt-1" style={{ color: "#fca5a5" }}>Bot</p>
                    </div>
                    <div className="rounded-xl md:rounded-2xl p-3 md:p-5 text-center" style={{ background: "#f0fdf4" }}>
                      <p className="text-2xl md:text-3xl font-bold" style={{ color: "#34d399" }}>{parseFloat(selectedItem.real_percentage).toFixed(0)}%</p>
                      <p className="text-xs mt-1" style={{ color: "#6ee7b7" }}>Asli</p>
                    </div>
                    <div className="rounded-xl md:rounded-2xl p-3 md:p-5 text-center bg-gray-50 border border-gray-100">
                      <p className="text-2xl md:text-3xl font-bold text-gray-700">{selectedItem.total_sample}</p>
                      <p className="text-xs text-gray-400 mt-1">Sampel</p>
                    </div>
                  </div>

                  <div className="rounded-xl md:rounded-2xl p-4 md:p-5 bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">Rekomendasi</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedItem.recommendation}</p>
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
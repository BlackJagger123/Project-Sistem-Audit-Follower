import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#e8eeff" }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#5b8dee" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: "#5b8dee" }}>InsPector</span>
          </div>
          <Button
            size="sm"
            style={{ background: "#5b8dee" }}
            className="text-white border-0 hover:opacity-90"
            onClick={() => navigate("/login")}
          >
            Masuk
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-3 pt-10 pb-14 sm:px-4 sm:pt-16 sm:pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4 sm:mb-5 border text-xs" style={{ background: "#fff0f0", color: "#f87171", borderColor: "#fecaca" }}>
            Deteksi Akun Instagram Palsu
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-4 sm:mb-5">
            Tahu mana<br />
            yang <span style={{ color: "#5b8dee" }}>asli</span>,{" "}
            mana yang <span style={{ color: "#f87171" }}>palsu</span>?
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed">
            Masukkan username Instagram. InsPector menganalisis dan memberikan skor kepalsuan akun secara instan.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            style={{ background: "#5b8dee" }}
            className="text-white border-0 hover:opacity-90 shadow-md w-full sm:w-auto"
          >
            Mulai Masuk →
          </Button>
        </div>

        {/* Preview card */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-md p-4 sm:p-6">
            <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400 font-mono hidden sm:block">inspector.app/dashboard</span>
            </div>
            <div className="flex gap-3 sm:gap-4">
              {/* Mini sidebar - hidden di mobile sangat kecil */}
              <div className="hidden sm:block w-36 border-r border-gray-100 pr-4 flex-shrink-0">
                <div className="text-xs text-gray-400 mb-3 font-medium">Riwayat</div>
                {[
                  { name: "@your_account", risk: "Risiko Sedang", color: "text-orange-400" },
                  { name: "@influencer_x", risk: "Risiko Aman", color: "text-emerald-500" },
                  { name: "@brand.id", risk: "Risiko Bot", color: "text-red-500" },
                ].map((item) => (
                  <div key={item.name} className="mb-3">
                    <p className={`text-xs font-semibold ${item.color}`}>{item.name}</p>
                    <p className={`text-xs ${item.color} opacity-70`}>{item.risk}</p>
                  </div>
                ))}
              </div>
              {/* Mini result */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: "#5b8dee" }}>@your_account</span>
                  <span className="text-xs bg-orange-50 text-orange-400 border border-orange-200 px-2 py-0.5 rounded-full font-medium">Risiko Sedang</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-xl p-2 sm:p-3 text-center" style={{ background: "#fff0f0" }}>
                    <p className="text-base sm:text-lg font-bold" style={{ color: "#f87171" }}>20%</p>
                    <p className="text-xs" style={{ color: "#fca5a5" }}>Bot</p>
                  </div>
                  <div className="rounded-xl p-2 sm:p-3 text-center" style={{ background: "#f0fdf4" }}>
                    <p className="text-base sm:text-lg font-bold" style={{ color: "#34d399" }}>80%</p>
                    <p className="text-xs" style={{ color: "#6ee7b7" }}>Asli</p>
                  </div>
                  <div className="rounded-xl p-2 sm:p-3 text-center bg-gray-50 border border-gray-100">
                    <p className="text-base sm:text-lg font-bold text-gray-700">50</p>
                    <p className="text-xs text-gray-400">Sampel</p>
                  </div>
                </div>
                <div className="rounded-xl p-2 sm:p-3 bg-gray-100 border border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">Wajar. Terdeteksi sekitar 20% pengikut bot, masih dalam batas normal industri...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-3 py-12 sm:px-4 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8 sm:mb-10 text-center">Cara Kerja</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { num: "01", title: "Masukkan Username", desc: "Ketik username Instagram, pakai @ atau tidak sama-sama bisa.", numColor: "text-red-400" },
              { num: "02", title: "AI Menganalisis", desc: "Sistem menganalisis follower ratio, pola posting, engagement rate, dan 15+ sinyal lainnya.", numColor: "text-orange-400" },
              { num: "03", title: "Dapatkan Hasilnya", desc: "Skor kepalsuan beserta rekomendasi detail. Jelas, langsung, tidak berbelit.", numColor: "text-emerald-500" },
            ].map((s) => (
              <Card key={s.num} className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="py-5 px-5 sm:py-6">
                  <span className={`text-2xl sm:text-3xl font-black ${s.numColor} opacity-60`}>{s.num}</span>
                  <h3 className="font-semibold text-sm mt-2 sm:mt-3 mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="px-3 py-12 sm:px-4 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8 sm:mb-10 text-center">Cocok Untuk</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { title: "Tim Marketing", desc: "Verifikasi influencer sebelum kolaborasi. Hindari bayar ke akun bot.", color: "text-blue-400" },
              { title: "HR & Rekrutmen", desc: "Cek profil kandidat yang mencurigakan sebelum proses selanjutnya.", color: "text-purple-400" },
              { title: "Brand Safety", desc: "Pastikan mitra dan follower brand kamu adalah akun nyata.", color: "text-emerald-400" },
              { title: "Peneliti Digital", desc: "Data sinyal lengkap untuk analisis ekosistem media sosial.", color: "text-orange-400" },
            ].map((c) => (
              <Card key={c.title} className="bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="py-4 px-5 sm:py-5">
                  <h4 className={`font-semibold text-sm mb-1 ${c.color}`}>{c.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-3 py-12 sm:px-4 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl border border-blue-200 shadow-sm px-6 py-10 sm:px-8 sm:py-14 text-center relative overflow-hidden"
            style={{ background: "#5b8dee" }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white relative">Coba sekarang.</h2>
            <p className="text-blue-100 text-sm mb-6 relative">Gratis. Tidak perlu kartu kredit.</p>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="relative shadow-lg bg-white hover:bg-gray-50 border-0 w-full sm:w-auto"
              style={{ color: "#5b8dee" }}
            >
              Masuk Dengan Google →
            </Button>
          </div>
        </div>
      </section>

      <footer className="text-center py-4 text-gray-400 text-xs">
        © 2026 InsPector — Capstone Project.
      </footer>
    </div>
  );
}
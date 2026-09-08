import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased">

      {/* NAVBAR */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight text-[#3b3c95]">🎌 DaijiNihongo</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-800 font-medium transition">Masuk</Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition shadow-sm">
              Mulai Gratis →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2d2e8f] via-[#3b3c95] to-[#4f46e5] text-white py-28 md:py-36 px-6">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 backdrop-blur">
              ⭐️ Platform Persiapan JLPT N5 - N1 untuk Pelajar Indonesia
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Kuasai Bahasa Jepang<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                dengan Disiplin & Terarah
              </span>
            </h1>
            <p className="text-base md:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              DaijiNihongo adalah pendamping belajar yang dirancang khusus untuk pelajar Indonesia yang ingin menaklukkan ujian JLPT, meraih beasiswa, hingga karir di Jepang.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/login" className="bg-white text-indigo-700 font-bold rounded-xl px-8 py-3.5 text-sm hover:bg-indigo-50 transition shadow-lg">
                Mulai Perjalanan Gratis ➔
              </Link>
              <Link href="/login" className="bg-white/10 border border-white/20 text-white font-medium rounded-xl px-8 py-3.5 text-sm hover:bg-white/20 transition backdrop-blur">
                Lihat Demo
              </Link>
            </div>

            {/* Statistik */}
            <div className="flex justify-center gap-4 pt-8 flex-wrap">
              {[
                { label: "Semua Level", value: "N5 - N1" },
                { label: "Bank Soal", value: "2.400+" },
                { label: "Kanji Card", value: "500+" },
                { label: "Pelajar Aktif", value: "1.200+" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[90px]">
                  <div className="text-sm font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-indigo-300 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JALUR BELAJAR */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">Pilih Jalur Impianmu</h2>
              <p className="text-slate-500 text-sm mt-2">Materi dipersonalisasi sesuai target masa depanmu.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "🎓",
                  title: "Jalur Pendidikan & Sekolah",
                  desc: "Untuk usia 13–18 tahun yang ingin mengejar beasiswa Monbukagakusho, kuliah di Jepang, atau memahami anime dan budaya Jepang.",
                  color: "from-blue-50 to-indigo-50",
                  border: "border-indigo-100",
                },
                {
                  icon: "💼",
                  title: "Jalur Karir & Kerja (Tokutei Ginou)",
                  desc: "Untuk usia 18–25 tahun yang ingin lulus JLPT N4/N3, sertifikasi JFT-Basic, dan siap kerja di perusahaan Jepang.",
                  color: "from-purple-50 to-pink-50",
                  border: "border-purple-100",
                },
              ].map((item) => (
                <div key={item.title} className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-7 hover:shadow-md transition-shadow`}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FITUR UNGGULAN */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">Mengapa DaijiNihongo?</h2>
              <p className="text-slate-500 text-sm mt-2">Sistem pembelajaran terstruktur seperti bimbingan belajar langsung di Jepang.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "📖", title: "Kurikulum Komprehensif", desc: "Materi N5–N1 mencakup kosakata, kanji, tata bahasa, dan membaca dalam satu platform." },
                { icon: "🧩", title: "Latihan Terfokus", desc: "Kuis interaktif bergaya Shin Kanzen Master dengan pembahasan detail setiap soal." },
                { icon: "🤖", title: "Analisis AI Claude", desc: "Bedah artikel bahasa Jepang apapun menggunakan AI dan dapatkan breakdown lengkap." },
                { icon: "📈", title: "Pelacakan Progres", desc: "Visualisasi kemajuan belajar untuk menjaga motivasi dan konsistensi harian." },
                { icon: "🏅", title: "Leaderboard Kompetitif", desc: "Bersaing dengan pelajar lain dan jadilah yang teratas di papan peringkat." },
                { icon: "⚡", title: "Flash Quiz Instan", desc: "Uji pemahaman cepat di setiap akhir materi dengan mini kuis dua pilihan." },
              ].map((f) => (
                <div key={f.title} className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg mb-3 group-hover:bg-indigo-100 transition">
                    {f.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">Harga Transparan & Terjangkau</h2>
              <p className="text-slate-500 text-sm mt-2">Mulai gratis, upgrade kapan saja.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: "Free", price: "Rp 0", period: "selamanya", features: ["20.000 Token AI", "Akses N5 Grammar", "5 Soal / Sesi"], cta: "Mulai Gratis", highlight: false },
                { name: "Pro", price: "Rp 49.000", period: "/ bulan", features: ["500.000 Token AI", "Akses N5 - N2 Penuh", "Soal Tak Terbatas", "Shin Kanzen Analysis"], cta: "Pilih Pro", highlight: true },
                { name: "N1 Elite", price: "Rp 129.000", period: "/ bulan", features: ["2.000.000 Token AI", "Akses N5 - N1 Penuh", "Analisis Tanpa Batas", "Email Kuitansi"], cta: "Pilih Elite", highlight: false },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl overflow-hidden border ${p.highlight ? "border-indigo-500 shadow-lg shadow-indigo-100" : "border-slate-200 bg-white"}`}>
                  {p.highlight && <div className="bg-indigo-600 text-white text-[10px] font-bold text-center py-1.5 tracking-widest">PALING POPULER</div>}
                  <div className={`p-6 ${p.highlight ? "bg-white" : ""}`}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.name}</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{p.price}<span className="text-xs font-normal text-slate-400 ml-1">{p.period}</span></p>
                    <div className="mt-4 space-y-2">
                      {p.features.map((f) => (
                        <p key={f} className="text-xs text-slate-600 flex gap-2"><span className="text-indigo-500">✓</span>{f}</p>
                      ))}
                    </div>
                    <Link href="/login" className={`block mt-5 text-center py-2.5 rounded-xl text-sm font-semibold transition ${p.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
          <div className="container mx-auto max-w-2xl space-y-5">
            <h2 className="text-2xl md:text-3xl font-black">Siap Mulai Perjalanan Belajarmu?</h2>
            <p className="text-indigo-200 text-sm">Bergabung dengan ribuan pelajar yang sudah mempercayai DaijiNihongo.</p>
            <Link href="/login" className="inline-block bg-white text-indigo-700 font-bold rounded-xl px-8 py-3.5 text-sm hover:bg-indigo-50 transition shadow-lg">
              Daftar Sekarang — Gratis! ➔
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-400">
        <p>© 2026 DaijiNihongo. Platform Belajar Bahasa Jepang Terpercaya untuk Pelajar Indonesia.</p>
        <div className="mt-4 flex justify-center gap-4 text-[11px] text-slate-400">
          <a href="/dashboard/terms" className="hover:text-white underline">Syarat & Ketentuan</a>
          <a href="/dashboard/terms" className="hover:text-white underline">Kebijakan Refund</a>
          <a href="/dashboard/terms" className="hover:text-white underline">FAQ & Kontak</a>
        </div>

      </footer>
    </div>
  )
}

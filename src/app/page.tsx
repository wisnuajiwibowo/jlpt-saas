import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. HEADER NAVIGASI */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[#3b3c95]">🎌 Nihongo Juku</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-slate-600">Masuk</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#4f46e5] text-white text-sm rounded-xl px-5 shadow-sm hover:bg-[#3b3c95]">Mulai Belajar</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. HERO SECTION (Sesuai Layout Gambar - Ungu Gradient) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#3b3c95] to-[#4f46e5] text-white py-24 md:py-32 text-center px-6">
          <div className="absolute inset-0 bg-[url('https://unsplash.com')] bg-cover bg-center mix-blend-overlay opacity-15"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10">
              ⭐️ Persiapan JLPT N5 - N1 & Kerja / Sekolah ke Jepang
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight md:leading-none">
              Kuasai Bahasa Jepang dengan<br />Disiplin dan Terarah
            </h1>
            <p className="text-base md:text-lg text-indigo-100 max-w-2xl mx-auto font-normal leading-relaxed">
              Nihongo Juku adalah pendamping belajar yang dirancang khusus untuk pelajar Indonesia yang ingin menaklukkan ujian JLPT, meraih beasiswa sekolah, hingga persiapan karir industri di Jepang.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-[#4f46e5] font-bold rounded-xl shadow-lg hover:bg-indigo-50 px-8 text-sm">
                  Mulai Perjalanan Anda ➔
                </Button>
              </Link>
            </div>

            {/* Statistik Ringkas Mini Bawah (Sesuai Gambar) */}
            <div className="flex justify-center items-center gap-6 pt-10 text-white/90">
              <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                <div className="text-xs font-bold text-indigo-200">N5 - N1</div>
                <div className="text-[10px] text-indigo-300">Semua Level</div>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                <div className="text-xs font-bold text-indigo-200">2.400+</div>
                <div className="text-[10px] text-indigo-300">Bank Soal</div>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                <div className="text-xs font-bold text-indigo-200">500+</div>
                <div className="text-[10px] text-indigo-300">Kanji Card</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TARGET PATHWAYS SECTION (Diferensiasi Sekolah vs Kerja) */}
        <section className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Pilih Jalur Impianmu</h2>
            <p className="text-slate-500 text-sm">Materi interaktif yang dipersonalisasi sesuai dengan target masa depanmu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-100 shadow-sm rounded-2xl bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Jalur Pendidikan & Sekolah</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dirancang khusus untuk usia **13–18 tahun** yang ingin mengejar beasiswa Monbukagakusho, kuliah di universitas Jepang, atau memahami anime dan budaya Jepang tanpa kendala bahasa.
              </p>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-2xl bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Jalur Karir & Kerja (Tokutei Ginou)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fokus akselerasi untuk usia **18–25 tahun** guna lulus ujian JLPT N4/N3, sertifikasi JFT-Basic, serta penguasaan percakapan bisnis (*Keigo*) siap kerja di perusahaan Jepang.
              </p>
            </Card>
          </div>
        </section>

        {/* 4. WHY US SECTION (Sesuai Gambar) */}
        <section className="bg-white border-y border-slate-100 py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Mengapa Nihongo Juku?</h2>
              <p className="text-slate-500 text-sm">Sistem pembelajaran terstruktur seperti bimbingan belajar langsung di Jepang, disesuaikan untuk ritme Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-none text-center space-y-2 bg-transparent p-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeeffc] text-[#4f46e5] flex items-center justify-center font-bold mx-auto text-lg">📖</div>
                <h4 className="text-sm font-bold text-slate-800 pt-2">Kurikulum Komprehensif</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Materi dari N5 hingga N1 meliputi kosakata, kanji, tata bahasa, dan latihan membaca dalam satu platform terpadu.</p>
              </Card>

              <Card className="border-none shadow-none text-center space-y-2 bg-transparent p-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeeffc] text-[#4f46e5] flex items-center justify-center font-bold mx-auto text-lg">🧩</div>
                <h4 className="text-sm font-bold text-slate-800 pt-2">Latihan Terfokus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Kuis interaktif dengan pembahasan detail bergaya metodologi tingkat tinggi untuk memperkuat pemahaman Anda setiap hari.</p>
              </Card>

              <Card className="border-none shadow-none text-center space-y-2 bg-transparent p-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeeffc] text-[#4f46e5] flex items-center justify-center font-bold mx-auto text-lg">📈</div>
                <h4 className="text-sm font-bold text-slate-800 pt-2">Pelacakan Progres</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Visualisasi perkembangan tingkat kemahiran belajar Anda secara berkala untuk menjaga motivasi dan kedisiplinan belajar.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-400 font-medium">
        <div className="container mx-auto px-6">
          <p>© 2026 Nihongo Juku. Platform Belajar Bahasa Jepang Terpercaya.</p>
        </div>
      </footer>
    </div>
  )
}

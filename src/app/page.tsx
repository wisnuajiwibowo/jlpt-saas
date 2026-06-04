import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Header / Navigation */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-primary">🎌 JLPT Master</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/login">
              <Button>Mulai Belajar</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            ⚡ Ditenagai oleh Claude 3.5 Sonnet & Shin Kanzen Master Methodology
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Kuasai Bahasa Jepang & Lulus Ujian JLPT Lebih Cepat dengan AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analisis teks Jepang secara instan, bedah tata bahasa rumit, petakan kosakata sesuai level target N5 hingga N1, dan nikmati pembelajaran pintar berbasis komputer.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="px-8 font-semibold text-base shadow-lg">
                Dapatkan 20.000 Token Gratis
              </Button>
            </Link>
          </div>
        </section>

        {/* 3. Core Features Section (Representasi Fase 5 & 7) */}
        <section className="bg-muted/50 border-y py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Fitur Utama Unggulan</h2>
              <p className="text-muted-foreground">Arsitektur canggih berperforma tinggi untuk kenyamanan belajar Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">🤖</div>
                  <CardTitle>AI Text Analyzer</CardTitle>
                  <CardDescription>Berdasar Analisis Mendalam</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Tempel teks Jepang apa saja. AI akan mendeteksi level kesulitan, mengekstrak pola tata bahasa (Grammar), Kosakata (Vocabulary), hingga pola jebakan soal JLPT secara instan.
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">⚡</div>
                  <CardTitle>Ultra-Fast Performance</CardTitle>
                  <CardDescription>Ditenagai Upstash Redis</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Dengan sistem penyimpanan memori pintar (caching), hasil analisis teks yang sama dimuat dalam hitungan milidetik tanpa membuang kuota token berharga Anda.
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">🔒</div>
                  <CardTitle>Secure Infrastructure</CardTitle>
                  <CardDescription>Google OAuth & Supabase</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Login aman sekali klik menggunakan akun Google Anda. Seluruh progres belajar, riwayat analisis, dan data pribadi terlindungi ketat di enkripsi cloud tingkat tinggi.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Pricing Section (Representasi Paket Stripe Fase 4) */}
        <section className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Pilih Paket Belajar Kamu</h2>
            <p className="text-muted-foreground">Mulai dari gratis hingga akses elit tanpa batas untuk kelulusan ujian JLPT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan Free */}
            <Card className="flex flex-col justify-between border-muted border-2 relative">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Free Plan</CardTitle>
                <CardDescription>Untuk memulai perjalanan belajar</CardDescription>
                <div className="text-3xl font-extrabold pt-2">¥0 <span className="text-sm font-normal text-muted-foreground">/ selamanya</span></div>
              </CardHeader>
              <CardContent className="flex-1 text-sm space-y-3 pt-4 border-t border-muted/50">
                <div className="flex items-center gap-2">✓ <span>🎁 20.000 Token AI Awal</span></div>
                <div className="flex items-center gap-2">✓ <span>Analisis Level Teks Jepang</span></div>
                <div className="flex items-center gap-2 text-muted-foreground/50">✗ <span>Akses Premium N1 Elite Module</span></div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Mulai Gratis</Button>
                </Link>
              </div>
            </Card>

            {/* Plan Pro */}
            <Card className="flex flex-col justify-between border-primary ring-2 ring-primary/20 relative shadow-xl scale-105 bg-card">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">Paling Populer</div>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Pro Plan</CardTitle>
                <CardDescription>Untuk akselerasi pemahaman</CardDescription>
                <div className="text-3xl font-extrabold pt-2">¥1,980 <span className="text-sm font-normal text-muted-foreground">/ bulan</span></div>
              </CardHeader>
              <CardContent className="flex-1 text-sm space-y-3 pt-4 border-t border-muted/50">
                <div className="flex items-center gap-2 text-primary font-medium">✓ <span>🔥 500.000 Token AI / Bulan</span></div>
                <div className="flex items-center gap-2">✓ <span>Ekstraksi Komponen Kamus Cepat</span></div>
                <div className="flex items-center gap-2">✓ <span>Bedah Pola Jebakan Ujian</span></div>
                <div className="flex items-center gap-2">✓ <span>Dukungan Email Prioritas</span></div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/login" className="w-full">
                  <Button className="w-full shadow-md shadow-primary/20">Upgrade ke Pro</Button>
                </Link>
              </div>
            </Card>

            {/* Plan Elite */}
            <Card className="flex flex-col justify-between border-muted border-2 relative">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">N1 Elite Plan</CardTitle>
                <CardDescription>Untuk target kelulusan mutlak</CardDescription>
                <div className="text-3xl font-extrabold pt-2">¥4,980 <span className="text-sm font-normal text-muted-foreground">/ bulan</span></div>
              </CardHeader>
              <CardContent className="flex-1 text-sm space-y-3 pt-4 border-t border-muted/50">
                <div className="flex items-center gap-2 text-indigo-500 font-medium">✓ <span>💎 2.000.000 Token AI / Bulan</span></div>
                <div className="flex items-center gap-2">✓ <span>Semua Fitur Pro Tanpa Batas</span></div>
                <div className="flex items-center gap-2">✓ <span>Metodologi Eksklusif N1 Pass</span></div>
                <div className="flex items-center gap-2">✓ <span>Notifikasi Kuitansi via Resend</span></div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Pilih Elite</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="border-t bg-muted/30 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>© 2026 JLPT Master. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>
    </div>
  )
}

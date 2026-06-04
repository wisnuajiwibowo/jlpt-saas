import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("*, subscriptions(*)")
    .eq("id", user.id)
    .single()

  const tokenPct = Math.round(((profile?.ai_tokens_used || 0) / (profile?.ai_tokens_quota || 20000)) * 100)

  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"]
  const modules = [
    { id: "grammar", name: "Grammar (文法)", icon: "✍️", desc: "Struktur & partikel" },
    { id: "kanji", name: "Kanji (漢字)", icon: "⛩️", desc: "Cara baca & makna" },
    { id: "vocab", name: "Vocabulary (語彙)", icon: "📖", desc: "Kosakata esensial" },
    { id: "reading", name: "Reading (読解)", icon: "🔍", desc: "Pemahaman wacana" },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground flex font-sans">
      {/* 1. SIDEBAR KIRI (Gaya Eksklusif Nihongo Juku) */}
      <aside className="w-64 border-r border-slate-100 bg-white hidden md:flex flex-col justify-between sticky top-0 h-screen p-5">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 px-2 py-1">
            <span className="text-xl font-bold tracking-tight text-[#3b3c95]">🎌 Nihongo Juku</span>
          </div>
          
          {/* Menu Navigasi Sesuai Gambar */}
          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start font-medium text-sm bg-[#eeeffc] text-[#4f46e5] hover:bg-[#eeeffc]">
              <span className="mr-3 text-base">🎛️</span> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">📖</span> Belajar
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">🧩</span> Latihan
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">🤖</span> Analisis AI
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">📈</span> Progres
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">🏅</span> Papan Peringkat
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
              <span className="mr-3 text-base">💳</span> Berlangganan
            </Button>
            <Link href="/admin" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50">
                <span className="mr-3 text-base">⚙️</span> Pengaturan Admin
              </Button>
            </Link>
          </nav>
        </div>

        {/* Profil Bawah (Indikator Tag Pelajar Sesuai Gambar) */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#eeeffc] flex items-center justify-center font-bold text-[#4f46e5] text-sm shadow-inner">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "AJ"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate leading-none mb-1">
                {profile?.full_name || "Pelajar Juku"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">JLPT</span>
                <span className="text-[9px] font-extrabold bg-[#4f46e5] text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {profile?.subscriptions?.?.plan_tier || "FREE"}
                </span>
              </div>
            </div>
          </div>
          <Link href="/logout" className="block">
            <Button variant="ghost" className="w-full justify-start text-xs text-rose-500 hover:bg-rose-50 h-8 font-medium">
              <span className="mr-3 text-sm">🚪</span> Keluar
            </Button>
          </Link>
        </div>
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Banner Motivasi Atas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              Konnichiwa, {profile?.full_name || "Pelajar"}! 🎌
            </h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Mari lanjutkan progres belajarmu hari ini. Pilih tingkat kompetensi targetmu di bawah untuk memulai sesi kuis acak.
            </p>
          </div>
          {/* Progress AI Token Mini */}
          <div className="w-full md:w-48 space-y-1 bg-[#fafafa] p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Kuota AI Token</span>
              <span>{tokenPct}%</span>
            </div>
            <Progress value={tokenPct} className="h-1 bg-slate-200" />
            <div className="text-[10px] text-slate-400 text-right">
              {(profile?.ai_tokens_used || 0).toLocaleString()} token terpakai
            </div>
          </div>
        </div>

        {/* DAFTAR PROGRAM BELAJAR (N5 - N1) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">🎯 Program Belajar: Bank Soal Acak</h2>
            <p className="text-slate-500 text-xs mt-0.5">Sistem akan menyusun dan mengacak 10 soal secara acak berdasarkan kategori pilihan Anda.</p>
          </div>

          <div className="space-y-6">
            {jlptLevels.map((level) => (
              <div key={level} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold bg-[#4f46e5] text-white px-3 py-1 rounded-lg shadow-sm">
                    {level}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">Paket Materi Kompetensi JLPT {level}</h3>
                </div>

                {/* Grid Modul Belajar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {modules.map((mod) => (
                    <Card key={mod.id} className="flex flex-col justify-between border border-slate-100 hover:border-[#4f46e5]/40 transition-all duration-200 bg-white group shadow-none rounded-xl">
                      <CardHeader className="p-4 pb-1">
                        <div className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">{mod.icon}</div>
                        <CardTitle className="text-sm font-bold text-slate-800">{mod.name}</CardTitle>
                        <CardDescription className="text-[11px] text-slate-400 leading-tight mt-0.5">{mod.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <Link href={`/dashboard/quiz?level=${level}&type=${mod.id}`}>
                          <Button variant="outline" className="w-full h-8 text-[11px] font-medium border-slate-200 text-slate-600 group-hover:bg-[#4f46e5] group-hover:text-white group-hover:border-[#4f46e5] transition-all rounded-lg">
                            Mulai Kuis
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

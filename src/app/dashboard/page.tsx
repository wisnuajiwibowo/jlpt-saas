import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const currentPlan = profile?.subscriptions?.[0]?.plan_tier || "FREE"

  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"]
  const modules = [
    { id: "grammar", name: "Grammar (文法)", icon: "✍️", desc: "Struktur & partikel" },
    { id: "kanji", name: "Kanji (漢字)", icon: "⛩️", desc: "Cara baca & makna" },
    { id: "vocab", name: "Vocabulary (語彙)", icon: "📖", desc: "Kosakata esensial" },
    { id: "reading", name: "Reading (読解)", icon: "🔍", desc: "Pemahaman wacana" },
  ]

  const navItems = [
    { href: "/dashboard", icon: "🎛️", label: "Dashboard" },
    { href: "/dashboard/learn", icon: "📖", label: "Belajar" },
    { href: "/dashboard/quiz?level=N5&type=grammar", icon: "🧩", label: "Latihan" },
    { href: "/dashboard/analyzer", icon: "🤖", label: "Analisis AI" },
    { href: "/dashboard/progress", icon: "📈", label: "Progres" },
    { href: "/dashboard/leaderboard", icon: "🏅", label: "Papan Peringkat" },
    { href: "/dashboard/billing", icon: "💳", label: "Berlangganan" },
    { href: "/admin", icon: "⚙️", label: "Pengaturan Admin" },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground flex font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-100 bg-white hidden md:flex flex-col justify-between sticky top-0 h-screen p-5">
        <div className="space-y-8">
          <div className="px-2 py-1">
            <span className="text-xl font-bold tracking-tight text-[#3b3c95]">🎌 DaijiNihongo</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-700">
                  <span className="mr-3 text-base">{item.icon}</span> {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#eeeffc] flex items-center justify-center font-bold text-[#4f46e5] text-sm">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "AJ"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">{profile?.full_name || "Pelajar Juku"}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">JLPT</span>
                <span className="text-[9px] font-bold bg-[#4f46e5] text-white px-1.5 py-0.5 rounded uppercase">{currentPlan}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl mx-auto">

        {/* Banner Sambutan */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              Konnichiwa, {profile?.full_name?.split(" ")[0] || "Pelajar"}! 🎌
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Selamat datang di DaijiNihongo. Pilih kategori kuis di bawah atau buka ruang belajar di sidebar.
            </p>
          </div>

          {/* Token AI */}
          <div className="w-full md:w-52 bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Kuota AI Token</span>
              <span className="font-bold text-indigo-600">{tokenPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${tokenPct}%` }} />
            </div>
            <div className="text-[10px] text-slate-400 text-right">
              {(profile?.ai_tokens_used || 0).toLocaleString()} token terpakai
            </div>
          </div>
        </div>

        {/* Program Belajar */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">🎯 Program Belajar: Bank Soal Acak</h2>
            <p className="text-slate-500 text-xs mt-0.5">Sistem akan mengacak 10 soal berdasarkan kategori pilihan kamu.</p>
          </div>

          <div className="space-y-5">
            {jlptLevels.map((level) => (
              <div key={level} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg">{level}</span>
                  <h3 className="text-sm font-bold text-slate-800">Paket Materi Kompetensi JLPT {level}</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {modules.map((mod) => (
                    <Link key={mod.id} href={`/dashboard/quiz?level=${level}&type=${mod.id}`}>
                      <div className="group border border-slate-100 hover:border-indigo-300 hover:shadow-sm rounded-xl p-4 transition-all cursor-pointer bg-white">
                        <div className="text-xl mb-2 group-hover:scale-110 transition-transform">{mod.icon}</div>
                        <p className="text-xs font-bold text-slate-800">{mod.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{mod.desc}</p>
                        <div className="mt-3 w-full py-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white text-[10px] font-semibold text-center transition-all">
                          Mulai Kuis
                        </div>
                      </div>
                    </Link>
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

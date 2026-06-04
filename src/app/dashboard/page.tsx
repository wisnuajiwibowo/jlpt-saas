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

  // Data Pilihan Tingkatan JLPT dan Modul Belajar
  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"]
  const modules = [
    { id: "grammar", name: "Grammar (文法)", icon: "✍️", desc: "Analisis struktur & partikel" },
    { id: "kanji", name: "Kanji (漢字)", icon: "⛩️", desc: "Cara baca & makna karakter" },
    { id: "vocab", name: "Vocabulary (語彙)", icon: "📖", desc: "Kosakata esensial ujian" },
    { id: "reading", name: "Reading (読解)", icon: "🔍", desc: "Pemahaman teks & wacana" },
  ]

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {profile?.full_name || "User"}! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Siapkan diri Anda untuk menaklukkan ujian JLPT dengan latihan cerdas.</p>
        </div>
      </div>

      {/* Statistik Baris Atas (Representasi Kuota & Status Paket) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sisa Kuota AI Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(profile?.ai_tokens_used || 0).toLocaleString()} / {(profile?.ai_tokens_quota || 20000).toLocaleString()}
            </div>
            <Progress value={tokenPct} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">Digunakan untuk fitur AI Text Analyzer</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status Paket Anda</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[84px]">
            <div className="text-3xl font-bold capitalize text-primary">
              {profile?.subscriptions?.[0]?.plan_tier || "Free"} Account
            </div>
            <p className="text-xs text-muted-foreground">Terhubung dengan sistem penagihan otomatis Stripe</p>
          </CardContent>
        </Card>
      </div>

      {/* SEKSI UTAMA: Modul Bank Soal JLPT Acak (Metodologi Shin Kanzen) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">🎯 Modul Bank Soal Acak (10 Tahun Terakhir)</h2>
          <p className="text-muted-foreground text-sm">Pilih tingkatan level JLPT dan jenis latihan. Sistem akan mengacak soal secara otomatis.</p>
        </div>

        {/* Render untuk Setiap Level JLPT */}
        <div className="space-y-8">
          {jlptLevels.map((level) => (
            <div key={level} className="border rounded-xl p-6 bg-card/40 space-y-4 shadow-inner">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold bg-primary text-primary-foreground px-4 py-1.5 rounded-lg shadow-sm">
                  {level}
                </span>
                <h3 className="text-lg font-semibold text-foreground">Paket Soal Latihan JLPT {level}</h3>
              </div>

              {/* Grid Pilihan Modul Kuis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {modules.map((mod) => (
                  <Card key={mod.id} className="flex flex-col justify-between hover:border-primary/50 transition-all duration-200 bg-card group">
                    <CardHeader className="p-4 pb-2">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">{mod.icon}</div>
                      <CardTitle className="text-base font-semibold">{mod.name}</CardTitle>
                      <CardDescription className="text-xs leading-normal">{mod.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      {/* Link mengarah ke rute kuis membawa query parameter level & type */}
                      <Link href={`/dashboard/quiz?level=${level}&type=${mod.id}`}>
                        <Button variant="outline" className="w-full text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          Mulai Kuis Acak
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
    </div>
  )
}

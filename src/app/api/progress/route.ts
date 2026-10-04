import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 1. Ambil data agregat riwayat kuis dari tabel quiz_results
    const { data: quizResults, error: quizError } = await supabaseAdmin
      .from("quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 })

    // 2. Ambil data statistik harian dari tabel user_streaks
    const { data: streakData } = await supabaseAdmin
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // 3. Kalkulasi metrik rata-rata akurasi untuk dasbor kemajuan siswa
    const totalKuis = quizResults?.length || 0
    let totalAccuracy = 0
    let totalBenar = 0
    let totalSoal = 0

    quizResults?.forEach((q) => {
      totalAccuracy += Number(q.accuracy || 0)
      totalBenar += q.score || 0
      totalSoal += q.total_questions || 0
    })

    const rataRataAkurasi = totalKuis > 0 ? Math.round(totalAccuracy / totalKuis) : 0

    return NextResponse.json({
      current_streak: streakData?.current_streak || 0,
      longest_streak: streakData?.longest_streak || 0,
      total_sessions: streakData?.total_sessions || 0,
      total_quizzes: totalKuis,
      average_accuracy: rataRataAkurasi,
      total_correct: totalBenar,
      total_questions: totalSoal,
      history: quizResults?.slice(0, 10) || [] // Ambil 10 riwayat kuis terakhir saja untuk performa ringan
    })
  } catch (error: any) {
    console.error("PROGRESS_ROUTE_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal sistem progres" }, { status: 500 })
  }
}

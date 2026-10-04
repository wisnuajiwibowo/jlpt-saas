import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET: Ambil riwayat hasil kuis user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("quiz_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: Simpan hasil kuis selesai
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { jlpt_level, module_type, score, total_questions } = body
    
    // Menghitung akurasi nilai dengan aman
    const accuracy = Math.round((score / (total_questions || 10)) * 100 * 100) / 100

    // Simpan hasil kuis ke dalam tabel quiz_results
    const { error: quizError } = await supabaseAdmin
      .from("quiz_results")
      .insert({ user_id: user.id, jlpt_level, module_type, score, total_questions, accuracy })

    if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 })

    // OPTIMASI: Menghitung tanggal hari ini berdasarkan zona waktu lokal Asia/Jakarta (WIB)
    // agar hitungan hari belajar siswa tidak bergeser keliru akibat standar UTC Vercel
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta", // Ubah ke Asia/Tokyo jika target pasar utama Anda murni di Jepang
      year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date())

    // Update streak belajar harian siswa
    const { data: streak } = await supabaseAdmin
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!streak) {
      await supabaseAdmin.from("user_streaks").insert({
        user_id: user.id, current_streak: 1, longest_streak: 1,
        last_activity_date: today, total_sessions: 1
      })
    } else {
      const lastDateString = streak.last_activity_date || today
      
      // Jika siswa mengerjakan kuis kedua kali di hari yang sama, jangan reset atau tambah streak (abaikan)
      if (lastDateString === today) {
        await supabaseAdmin.from("user_streaks").update({
          total_sessions: (streak.total_sessions || 0) + 1,
          updated_at: new Date().toISOString()
        }).eq("user_id", user.id) // PERBAIKAN: Mengunci kecocokan menggunakan user_id bukan id
        
        return NextResponse.json({ success: true, current_streak: streak.current_streak })
      }

      const last = new Date(lastDateString)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = streak.current_streak || 0
      if (diffDays === 1) {
        // Jika selisih tepat 1 hari dari aktivitas terakhir, naikkan streak harian siswa
        newStreak += 1
      } else if (diffDays > 1) {
        // Jika bolos belajar lebih dari 1 hari, reset hitungan streak kembali ke angka 1
        newStreak = 1
      }

      // Perbarui lembar saldo total kuota siswa di database
      await supabaseAdmin.from("user_streaks").update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak || 0),
        last_activity_date: today,
        total_sessions: (streak.total_sessions || 0) + 1,
        updated_at: new Date().toISOString()
      }).eq("user_id", user.id) // PERBAIKAN: Mengunci ke user_id agar pencarian baris database valid
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("QUIZ_RESULTS_ROUTE_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal pada pencatatan skor" }, { status: 500 })
  }
}

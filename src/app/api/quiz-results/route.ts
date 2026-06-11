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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { jlpt_level, module_type, score, total_questions } = body
  const accuracy = Math.round((score / total_questions) * 100 * 100) / 100

  // Simpan hasil kuis
  const { error: quizError } = await supabaseAdmin
    .from("quiz_results")
    .insert({ user_id: user.id, jlpt_level, module_type, score, total_questions, accuracy })

  if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 })

  // Update streak
  const today = new Date().toISOString().split("T")[0]
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
    const last = new Date(streak.last_activity_date)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

    let newStreak = streak.current_streak
    if (diffDays === 1) newStreak += 1
    else if (diffDays > 1) newStreak = 1

    await supabaseAdmin.from("user_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_activity_date: today,
      total_sessions: streak.total_sessions + 1,
      updated_at: new Date().toISOString()
    }).eq("user_id", user.id)
  }

  return NextResponse.json({ success: true })
}

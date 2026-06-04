import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const supabase = await createClient()
  
  // Validasi login pengguna
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Ambil parameter filter dari URL (Contoh: ?level=N3&type=grammar)
  const { searchParams } = new URL(req.url)
  const level = searchParams.get("level")
  const type = searchParams.get("type")

  if (!level || !type) {
    return NextResponse.json({ error: "Parameter level dan type wajib diisi" }, { status: 400 })
  }

  // Ambil soal dari Supabase berdasarkan filter
  const { data: questions, error } = await supabase
    .from("jlpt_question_bank")
    .select("*")
    .eq("jlpt_level", level)
    .eq("module_type", type)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "Belum ada soal untuk kategori ini" }, { status: 404 })
  }

  // Logika Mengacak Soal (Shuffle Array otomatis)
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

  // Ambil maksimal 10 soal acak untuk sesi kuis saat ini
  const limitedQuestions = shuffledQuestions.slice(0, 10)

  return NextResponse.json(limitedQuestions)
}

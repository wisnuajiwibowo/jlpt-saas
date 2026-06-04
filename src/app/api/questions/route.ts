import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// PAKSA ROUTE AGAR DYNAMIC: Mencegah Next.js mengunci cache statis saat proses build
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const level = searchParams.get("level")
  const type = searchParams.get("type")

  if (!level || !type) {
    return NextResponse.json({ error: "Parameter level dan type wajib diisi" }, { status: 400 })
  }

  const { data: questions, error } = await supabase
    .from("jlpt_question_bank")
    .select("*")
    .eq("jlpt_level", level)
    .eq("module_type", type)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "Belum ada soal untuk kategori ini" }, { status: 404 })
  }

  const shuffledQuestions = questions.sort(() => Math.random() - 0.5)
  const limitedQuestions = shuffledQuestions.slice(0, 10)

  return NextResponse.json(limitedQuestions)
}

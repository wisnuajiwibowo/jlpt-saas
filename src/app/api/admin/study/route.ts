import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// 1. GET: Mengambil seluruh daftar materi belajar
export async function GET() {
  const { data: studyModules, error } = await supabaseAdmin
    .from("jlpt_study_modules")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(studyModules)
}

// 2. POST: Menambahkan materi belajar baru secara manual
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin
      .from("jlpt_study_modules")
      .insert({
        jlpt_level: body.jlpt_level,
        module_type: body.module_type,
        title: body.title,
        content_body: body.content_body,
        example_sentence: body.example_sentence,
        quiz_question: body.quiz_question,
        quiz_opt_a: body.quiz_opt_a,
        quiz_opt_b: body.quiz_opt_b,
        quiz_correct: body.quiz_correct,
        quiz_explanation: body.quiz_explanation
      })
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Gagal memproses payload data" }, { status: 400 })
  }
}

// 3. DELETE: Menghapus materi belajar berdasarkan ID
export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "ID materi wajib dicantumkan" }, { status: 400 })

  const { error } = await supabaseAdmin
    .from("jlpt_study_modules")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, message: "Materi berhasil dihapus" })
}

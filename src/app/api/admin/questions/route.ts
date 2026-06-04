import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// 1. GET: Mengambil seluruh daftar soal untuk ditampilkan di halaman admin
export async function GET() {
  const { data: questions, error } = await supabaseAdmin
    .from("jlpt_question_bank")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(questions)
}

// 2. POST: Menambahkan soal baru dari formulir manual admin
export async function POST(req: Request) {
  // Pengaman Dasar: Pastikan orang yang menambah soal adalah user yang sah/login
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin
      .from("jlpt_question_bank")
      .insert({
        jlpt_level: body.jlpt_level,
        module_type: body.module_type,
        question_text: body.question_text,
        option_a: body.option_a,
        option_b: body.option_b,
        option_c: body.option_c,
        option_d: body.option_d,
        correct_option: body.correct_option,
        explanation: body.explanation
      })
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data[0])
  } catch {
    return NextResponse.json({ error: "Gagal memproses payload data" }, { status: 400 })
  }
}

// 3. DELETE: Menghapus soal berdasarkan ID unik
export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "ID soal wajib dicantumkan" }, { status: 400 })

  const { error } = await supabaseAdmin
    .from("jlpt_question_bank")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, message: "Soal berhasil dihapus dari database" })
}

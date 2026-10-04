import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// PAKSA ROUTE AGAR DYNAMIC: Mencegah Next.js mengunci cache statis saat proses build
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Amankan otentikasi user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Ambil parameter URL (Contoh URL: /api/questions/dokkai?level=N3)
    const { searchParams } = new URL(req.url)
    const level = searchParams.get("level")

    if (!level) {
      return NextResponse.json({ error: "Parameter level wajib diisi" }, { status: 400 })
    }

    // 3. Eksekusi fungsi RPC pintarget_random_dokkai_quiz yang baru kita buat di Supabase
    // Mengambil 2 teks wacana bacaan acak, lengkap dengan seluruh pertanyaan di dalamnya
    const { data: quizData, error } = await supabase
      .rpc("get_random_dokkai_quiz", {
        target_level: level,
        passage_limit: 2
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!quizData || quizData.length === 0) {
      return NextResponse.json({ error: "Belum ada materi soal Dokkai untuk kategori ini" }, { status: 404 })
    }

    // 4. TRANSFORMAST DATA: Mengelompokkan hasil flat join database menjadi struktur pohon (Tree Object)
    // Supaya di frontend Next.js lebih mudah dirender (Satu bacaan membungkus array pertanyaan)
    const formattedPassages: any[] = []
    
    quizData.forEach((row: any) => {
      // Cari apakah wacana ini sudah dimasukkan ke dalam array hasil atau belum
      let passage = formattedPassages.find(p => p.id === row.passage_id)
      
      if (!passage) {
        passage = {
          id: row.passage_id,
          title: row.title,
          passage_text: row.passage_text,
          questions: []
        }
        formattedPassages.push(passage)
      }
      
      // Masukkan butir pertanyaan pilihan gandanya ke dalam wacana yang cocok
      passage.questions.push({
        id: row.question_id,
        question_text: row.question_text,
        option_a: row.option_a,
        option_b: row.option_b,
        option_c: row.option_c,
        option_d: row.option_d,
        correct_option: row.correct_option,
        explanation: row.explanation
      })
    })

    // Mengembalikan array wacana bacaan beserta daftar pertanyaannya yang super rapi
    return NextResponse.json(formattedPassages)
  } catch (error: any) {
    console.error("DOKKAI_ROUTE_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal backend dokkai" }, { status: 500 })
  }
}

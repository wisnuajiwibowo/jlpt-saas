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

    // 2. Ambil parameter URL
    const { searchParams } = new URL(req.url)
    const level = searchParams.get("level")
    const type = searchParams.get("type")

    if (!level || !type) {
      return NextResponse.json({ error: "Parameter level dan type wajib diisi" }, { status: 400 })
    }

    // 3. OPTIMASI UTAMA: Menggunakan fungsi RPC PostgreSQL untuk mengacak dan membatasi data langsung di database
    // Ini menghemat memori server secara drastis karena database hanya mengirimkan 10 soal matang yang sudah teracak.
    const { data: questions, error } = await supabase
      .rpc("get_random_jlpt_questions", {
        target_level: level,
        target_type: type,
        limit_count: 10
      })

    // Fallback otomatis jika Anda belum sempat membuat fungsi RPC di dashboard Supabase
    if (error) {
      console.warn("RPC Gagal, beralih ke kueri standard (Kurang efisien):", error.message)
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("jlpt_question_bank")
        .select("*")
        .eq("jlpt_level", level)
        .eq("module_type", type)
        // Batasi penarikan maksimal 50 soal saja di level fallback untuk mengamankan RAM server
        .limit(50)

      if (fallbackError) return NextResponse.json({ error: fallbackError.message }, { status: 500 })
      if (!fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ error: "Belum ada soal untuk kategori ini" }, { status: 404 })
      }

      // Pengacakan menggunakan algoritma Fisher-Yates (Anti-Bias, Jauh lebih acak dari Math.random() - 0.5)
      const shuffled = [...fallbackData]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      
      return NextResponse.json(shuffled.slice(0, 10))
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Belum ada soal untuk kategori ini" }, { status: 404 })
    }

    return NextResponse.json(questions)
  } catch (error: any) {
    console.error("QUESTIONS_ROUTE_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal backend" }, { status: 500 })
  }
}

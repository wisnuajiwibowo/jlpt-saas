import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const realQuestions = [
    // === LEVEL N5 ===
    {
      jlpt_level: "N5",
      module_type: "grammar",
      question_text: "わたしは まいにch ７じ＿＿＿ おきます。",
      context_text: null,
      option_a: "に",
      option_b: "を",
      option_c: "で",
      option_d: "へ",
      correct_option: "A",
      explanation: "🎌 Analisis Partikel N5:\nOpsi yang benar adalah A (に). Partikel に digunakan untuk menunjukkan titik waktu yang spesifik ketika suatu tindakan dilakukan (7じに おきます).\n\n⚠️ Analisis Jebakan:\n- Partikel を (B) untuk objek penderita.\n- Partikel で (C) untuk tempat aktivitas atau alat.\n- Partikel へ (D) untuk arah tujuan pergerakan."
    },
    // === LEVEL N4 ===
    {
      jlpt_level: "N4",
      module_type: "grammar",
      question_text: "あした テストが ある＿＿＿、今晩は よく 勉強します。",
      context_text: null,
      option_a: "から",
      option_b: "ので",
      option_c: "けれど",
      option_d: "ながら",
      correct_option: "A",
      explanation: "🎌 Analisis Struktur Kalimat N4:\nOpsi yang benar adalah A (から). Digunakan untuk menyatakan alasan atau sebab yang bersifat subjektif. \n\n⚠️ Analisis Jebakan:\n- Opsi B (ので) juga berarti sebab/alasan namun lebih formal/objektif dan kurang cocok dipadukan dengan keputusan tegas di kalimat belakang.\n- Opsi C (けれど) berarti 'tetapi'.\n- Opsi D (ながら) berarti 'sambil'."
    },
    // === LEVEL N3 ===
    {
      jlpt_level: "N3",
      module_type: "grammar",
      question_text: "日本の生活に慣れる＿＿＿、日本語が上手になってきた。",
      context_text: null,
      option_a: "ことに",
      option_b: "につれて",
      option_c: "がちで",
      option_d: "かわりに",
      correct_option: "B",
      explanation: "🎌 Analisis Pola Tata Bahasa N3:\nOpsi yang benar adalah B (〜につれて). Pola ini menyatakan seiring berjalannya waktu atau perubahan bertahap pada kondisi pertama (A), maka kondisi kedua (B) juga ikut berubah secara bertahap.\n\n⚠️ Analisis Jebakan:\n- Opsi A (ことに) berarti 'sangat' untuk ekspresi emosi.\n- Opsi C (がちで) berarti 'cenderung sering' untuk hal negatif.\n- Opsi D (かわりに) berarti 'sebagai pengganti'."
    },
    // === LEVEL N2 ===
    {
      jlpt_level: "N2",
      module_type: "grammar",
      question_text: "プロの歌手＿＿＿、彼の歌い方は素晴らしい。",
      context_text: null,
      option_a: "として",
      option_b: "からいうと",
      option_c: "だけに",
      option_d: "ならではの",
      correct_option: "C",
      explanation: "🎌 Analisis Pola Tata Bahasa N2:\nOpsi yang benar adalah C (〜だけに). Pola ini memiliki nuansa 'karena alasan yang wajar... maka hasilnya pun luar biasa/sepadan'.\n\n⚠️ Analisis Jebakan:\n- Opsi A (として) hanya menyatakan status/sebagai.\n- Opsi D (ならではの) berarti 'hanya khas milik...', namun membutuhkan kata benda langsung di belakangnya."
    },
    // === LEVEL N1 ===
    {
      jlpt_level: "N1",
      module_type: "grammar",
      question_text: "社長の命令＿＿＿、部下としては従わざるを得ない。",
      context_text: null,
      option_a: "ともなると",
      option_b: "とあって",
      option_c: "とあれば",
      option_d: "ならではの",
      correct_option: "C",
      explanation: "🎌 Analisis Struktur Tingkat Tinggi N1:\nOpsi yang benar adalah C (〜とあれば). Pola ini berarti 'jika dalam situasi/kondisi khusus seperti... maka hal tersebut harus dilakukan'. Menunjukkan keharusan bersyarat tingkat tinggi.\n\n⚠️ Analisis Jebakan:\n- Opsi A (ともなると) berarti 'jika sudah mencapai tahap/status...'.\n- Opsi B (とあって) berarti 'karena situasi khusus...' (kondisi sebab-akibat yang sudah terjadi)."
    }
  ]

  // Bersihkan data lama terlebih dahulu agar database rapi
  await supabaseAdmin.from("jlpt_question_bank").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Suntikkan kumpulan soal multi-level ke Supabase
  const { data, error } = await supabaseAdmin
    .from("jlpt_question_bank")
    .insert(realQuestions)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    message: "Berhasil menyuntikkan bank soal komplit (N5-N1) ke Supabase!",
    inserted_count: data?.length
  })
}

import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Contoh butir soal buatan orisinal dengan gaya analisis Shin Kanzen Master (Anti-Copyright)
  const dummyQuestions = [
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
      explanation: "🎌 Analisis Pola Tata Bahasa:\nOpsi yang benar adalah B (〜につれて). Pola ini digunakan untuk menyatakan bahwa seiring berjalannya waktu atau perubahan pada kondisi pertama (A), maka kondisi kedua (B) juga ikut berubah secara bertahap.\n\n⚠️ Analisis Jebakan (Distraktor):\n- Opsi A (ことに) berarti 'sangat/luar biasa' untuk mengekspresikan perasaan.\n- Opsi C (がちで) berarti 'sering kali/cenderung' untuk hal yang negatif.\n- Opsi D (かわりに) berarti 'sebagai pengganti'.\n\nMetode Shin Kanzen: Fokus pada hubungan sebab-akibat perubahan bertahap (慣れる -> 上手になる)."
    },
    {
      jlpt_level: "N3",
      module_type: "grammar",
      question_text: "雨が降らないうちに、早く買い物に＿＿＿。",
      context_text: null,
      option_a: "行くべきだ",
      option_b: "行ってしまおう",
      option_c: "行こう",
      option_d: "行ったほうがいい",
      correct_option: "C",
      explanation: "🎌 Analisis Pola Tata Bahasa:\nOpsi yang benar adalah C (行こう - bentuk maksud/volitional).\nStruktur '〜ないうちに' berarti 'selagi belum/sebelum terjadi...'. Nuansa dari pola ini adalah melakukan tindakan atas kemauan sendiri sebelum situasi berubah menjadi sulit (dalam hal ini, sebelum hujan turun).\n\n⚠️ Analisis Jebakan (Distraktor):\n- Opsi A (べきだ) terlalu kaku/berupa kewajiban moral.\n- Opsi D (ほうがいい) berbentuk saran untuk orang lain, kurang natural untuk keputusan spontan diri sendiri."
    },
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
      explanation: "🎌 Analisis Pola Tata Bahasa:\nOpsi yang benar adalah C (〜だけに). Pola ini berarti 'karena alasan yang wajar/memang sudah sewajarnya... maka hasilnya pun luar biasa'.\n\n⚠️ Analisis Jebakan (Distraktor):\n- Opsi A (として) berarti 'sebagai/status', tidak mengekspresikan kekaguman atas hasil.\n- Opsi D (ならではの) berarti 'hanya khas milik...', membutuhkan struktur kata benda di belakangnya."
    }
  ]

  // Bersihkan data soal lama terlebih dahulu agar tidak duplikat
  await supabaseAdmin.from("jlpt_question_bank").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Suntikkan data soal baru ke Supabase
  const { data, error } = await supabaseAdmin
    .from("jlpt_question_bank")
    .insert(dummyQuestions)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    message: "Berhasil menyuntikkan bank soal contoh ke Supabase!",
    inserted_count: data?.length
  })
}

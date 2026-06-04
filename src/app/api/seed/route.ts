import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const megaQuestions = [
    // === N5 GRAMMAR ===
    {
      jlpt_level: "N5",
      module_type: "grammar",
      question_text: "わたしは まいにち ７じ＿＿＿ おきます。",
      context_text: null,
      option_a: "に", option_b: "を", option_c: "で", option_d: "へ",
      correct_option: "A",
      explanation: "Partikel に untuk waktu spesifik."
    },
    // === N5 KANJI ===
    {
      jlpt_level: "N5",
      module_type: "kanji",
      question_text: "「水」の よみかたは どれですか。",
      context_text: null,
      option_a: "みず", option_b: "き", option_c: "ひ", option_d: "つち",
      correct_option: "A",
      explanation: "Kanji 水 dibaca みず (air)."
    },
    // === N4 VOCAB ===
    {
      jlpt_level: "N4",
      module_type: "vocab",
      question_text: "へやの 電気を ＿＿＿＿ ください。",
      context_text: null,
      option_a: "つけて", option_b: "あけて", option_c: "しめて", option_d: "かけて",
      correct_option: "A",
      explanation: "電気をつけて (nyalakan lampu)."
    },
    // === N3 GRAMMAR ===
    {
      jlpt_level: "N3",
      module_type: "grammar",
      question_text: "日本の生活に慣れる＿＿＿、日本語が上手になってきた。",
      context_text: null,
      option_a: "ことに", option_b: "につれて", option_c: "がちで", option_d: "かわりに",
      correct_option: "B",
      explanation: "〜につれて menyatakan perubahan bertahap seiring waktu."
    },
    // === N2 READING ===
    {
      jlpt_level: "N2",
      module_type: "reading",
      question_text: "筆者が一番言いたいことは何ですか。",
      context_text: "最近、スマートフォンの使いすぎが社会問題になっています。時間を決めて使うことが大切です。",
      option_a: "スマホは便利だ", option_b: "時間を決めて使うべきだ", option_c: "スマホを買うな", option_d: "問題はない",
      correct_option: "B",
      explanation: "Sesuai kalimat terakhir wacana."
    },
    // === N1 GRAMMAR ===
    {
      jlpt_level: "N1",
      module_type: "grammar",
      question_text: "社長の命令＿＿＿、部下としては従わざるを得ない。",
      context_text: null,
      option_a: "ともなると", option_b: "とあって", option_c: "とあれば", option_d: "ならではの",
      correct_option: "C",
      explanation: "〜とあれば berarti 'jika dalam kondisi khusus seperti...'."
    }
  ]

  await supabaseAdmin.from("jlpt_question_bank").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const { data, error } = await supabaseAdmin
    .from("jlpt_question_bank")
    .insert(megaQuestions)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    message: "Berhasil menyuntikkan bank soal super komplit (Multi-Modul)!",
    inserted_count: data?.length
  })
}

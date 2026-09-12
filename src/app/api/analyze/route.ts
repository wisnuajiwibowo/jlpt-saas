import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { redis } from "@/lib/upstash/redis"
import Anthropic from "@anthropic-ai/sdk"
import { createHash } from "crypto"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const claude = new Anthropic()

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { text, targetLevel } = await req.json()
  if (!text || text.length > 2000) {
    return NextResponse.json({ error: "Teks tidak valid" }, { status: 400 })
  }

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("ai_tokens_used, ai_tokens_quota")
    .eq("id", user.id)
    .single()
  
  if (!profile || (profile.ai_tokens_used + 1000) > profile.ai_tokens_quota) {
    return NextResponse.json({ error: "Token quota habis" }, { status: 403 })
  }

  const cacheKey = `jlpt:v1:${createHash("sha256").update(text + targetLevel).digest("hex")}`
  const cached = await redis.get(cacheKey)
  if (cached) return NextResponse.json(cached)

  const response = await claude.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: "Kamu adalah ahli kompetensi bahasa Jepang profesional. Tugasmu adalah menganalisis materi input teks secara mendalam untuk persiapan ujian kelulusan resmi. Lakukan pembedahan komprehensif pada struktur tata bahasa, partikel, nuansa penggunaan kalimat, dan kosakata esensial. Buat juga analisis mengenai pola distraktor atau jebakan umum yang sering mengecoh siswa pada tipe teks seperti ini di ujian asli.\n\nKembalikan HANYA JSON valid dengan struktur persis seperti ini:\n{\n  \"jlpt_level\": \"N3\",\n  \"cefr_level\": \"B1\",\n  \"difficulty_score\": 65,\n  \"grammar_points\": [{\"pattern\": \"〜ている\", \"level\": \"N4\", \"explanation\": \"Penjelasan detail mengenai fungsi, makna, dan nuansa penggunaannya secara mendalam\"}],\n  \"vocabulary\": [{\"word\": \"言葉\", \"reading\": \"ことば\", \"meaning\": \"kata\", \"level\": \"N4\"}],\n  \"trap_patterns\": [\"Analisis pola distraktor atau jebakan umum yang sering mengecoh siswa di ujian asli\"],\n  \"adapted_text\": \"Teks orisinal buatanmu sendiri yang disesuaikan agar pas dengan targetLevel pengguna.\"\n}",
    messages: [
      { 
        role: "user", 
        content: [
          {
            type: "text",
            text: `Level target: ${targetLevel}\nTeks: ${text}`
          }
        ]
      }
    ],
  })

  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens
  
  // Format pembacaan data blok teks yang aman dan sesuai standar Anthropic SDK terbaru
  const firstBlock = response.content[0]
  const rawText = firstBlock && firstBlock.type === "text" ? firstBlock.text : "{}"
  
  let result
  try {
    result = JSON.parse(rawText.replace(/```json|```/g, "").trim())
  } catch {
    return NextResponse.json({ error: "AI gagal memproses format teks" }, { status: 500 })
  }

  await Promise.all([
    redis.set(cacheKey, result, { ex: 60 * 60 * 24 * 7 }),
    supabaseAdmin.from("ai_analysis_history").insert({
      user_id: user.id,
      input_text: text,
      detected_level: result.jlpt_level,
      grammar_points: result.grammar_points,
      vocabulary_list: result.vocabulary,
      tokens_consumed: tokensUsed,
      cache_key: cacheKey,
    }),
    supabaseAdmin.from("users").update({
      ai_tokens_used: (profile?.ai_tokens_used || 0) + tokensUsed,
    }).eq("id", user.id),
  ])

  return NextResponse.json(result)
}

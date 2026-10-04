import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { redis } from "@/lib/upstash/redis"
import Anthropic from "@anthropic-ai/sdk"
import { createHash } from "crypto"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    // 1. Validasi Autentikasi Pengguna
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Validasi Input Body
    const { text, targetLevel } = await req.json()
    if (!text || text.length > 2000) {
      return NextResponse.json({ error: "Teks tidak valid" }, { status: 400 })
    }

    // 3. Cek Cache Upstash Redis
    const cacheKey = `jlpt:v1:${createHash("sha256").update(text + targetLevel).digest("hex")}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      // TIPS OPTIMASI SAAS: Di sini Anda bisa memotong kuota kecil (misal: 50 token) 
      // agar user tidak bisa melakukan spam teks yang sama secara gratisan.
      return NextResponse.json(cached)
    }

    // 4. Cek Sisa Kuota Token di Supabase
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("ai_tokens_used, ai_tokens_quota")
      .eq("id", user.id)
      .single()
    
    // PERBAIKAN: Hanya blokir jika kuota benar-benar sudah habis terlampaui
    if (!profile || profile.ai_tokens_used >= profile.ai_tokens_quota) {
      return NextResponse.json({ error: "Token quota habis" }, { status: 403 })
    }

    // 5. Eksekusi API Anthropic Claude
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      system: "Kamu adalah ahli kompetensi bahasa Jepang profesional. Tugasmu adalah menganalisis materi input teks secara mendalam untuk persiapan ujian kelulusan resmi. Lakukan pembedahan komprehensif pada struktur tata bahasa, partikel, nuansa penggunaan kalimat, dan kosakata esensial. Buat juga analisis mengenai pola distraktor atau jebakan umum yang sering mengecoh siswa pada tipe teks seperti ini di ujian asli.\n\nKembalikan HANYA JSON valid dengan struktur persis seperti ini:\n{\n  \"jlpt_level\": \"N3\",\n  \"cefr_level\": \"B1\",\n  \"difficulty_score\": 65,\n  \"grammar_points\": [{\"pattern\": \"〜ている\", \"level\": \"N4\", \"explanation\": \"Penjelasan detail\"}],\n  \"vocabulary\": [{\"word\": \"言葉\", \"reading\": \"ことば\", \"meaning\": \"kata\", \"level\": \"N4\"}],\n  \"trap_patterns\": [\"Jebakan umum\"],\n  \"adapted_text\": \"Teks diadaptasi\"\n}",
      messages: [
        { 
          role: "user", 
          content: `Level target: ${targetLevel}\nTeks: ${text}`
        }
      ],
    })

    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens
    
    // 6. Pengambilan Data & Pembersihan JSON Berlapis (Anti-Crash)
    const contentBlock = response.content[0]
    const rawText = contentBlock && contentBlock.type === "text" ? contentBlock.text : "{}"
    
    let result
    try {
      // PERBAIKAN: Memotong teks di luar kurung kurawal {}, berjaga-jaga jika Claude 
      // menyertakan teks basa-basi di luar format JSON.
      const jsonStart = rawText.indexOf("{")
      const jsonEnd = rawText.lastIndexOf("}")
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("Format JSON tidak ditemukan")
      
      const cleanJsonText = rawText.substring(jsonStart, jsonEnd + 1).trim()
      result = JSON.parse(cleanJsonText)
    } catch {
      return NextResponse.json({ error: "AI gagal memproses format penulisan JSON" }, { status: 500 })
    }

    // 7. Simpan Data Secara Paralel (Atomic Update via RPC)
    await Promise.all([
      redis.set(cacheKey, result, { ex: 60 * 60 * 24 * 7 }), // Cache 7 hari
      
      supabaseAdmin.from("ai_analysis_history").insert({
        user_id: user.id,
        input_text: text,
        detected_level: result.jlpt_level,
        grammar_points: result.grammar_points,
        vocabulary_list: result.vocabulary,
        tokens_consumed: tokensUsed,
        cache_key: cacheKey,
      }),
      
      // PERBAIKAN: Menggunakan RPC database agar penambahan saldo token langsung dijumlahkan 
      // di server PostgreSQL demi menghindari tabrakan data (race condition).
      supabaseAdmin.rpc("increment_ai_tokens", { 
        target_user_id: user.id, 
        tokens_to_add: tokensUsed 
      }).then(({ error }) => {
        if (error) {
          // Fallback jika fungsi RPC belum terpasang di dashboard Supabase Anda
          return supabaseAdmin
            .from("users")
            .update({ ai_tokens_used: (profile.ai_tokens_used || 0) + tokensUsed })
            .eq("id", user.id)
        }
      })
    ])

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("ANALYSIS_ROUTE_CRASH:", error)
    return NextResponse.json({ error: error?.message || "Terjadi kesalahan sistem internal backend" }, { status: 500 })
  }
}

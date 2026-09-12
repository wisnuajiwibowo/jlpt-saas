import { supabaseAdmin } from "@/lib/supabase/admin"
import { createHash } from "crypto"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // 1. Ambil data notifikasi mentah dari formulir iPaymu
    const formData = await req.formData()
    const status = formData.get("status")?.toString()
    const referenceId = formData.get("reference_id")?.toString() // Contoh: INV-PRO-171740000
    const buyerEmail = formData.get("email")?.toString()
    
    // Ambil data kiriman parameter keamanan iPaymu untuk verifikasi tanda tangan
    const incomingSignature = formData.get("sign")?.toString()

    if (!status || !referenceId || !buyerEmail || !incomingSignature) {
      return NextResponse.json({ error: "Data kiriman tidak lengkap" }, { status: 400 })
    }

    // 2. PROTEKSI AMAN: Lakukan verifikasi ulang tanda tangan digital dari iPaymu
    const IPAYMU_VA = process.env.IPAYMU_VA!
    const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY!
    
    // Rumus verifikasi signature iPaymu: sha256(reference_id + status + api_key)
    const localStringToSign = `${referenceId}${status}${IPAYMU_API_KEY}`
    const localSignature = createHash("sha256").update(localStringToSign).digest("hex")

    // Jika tanda tangannya tidak cocok, tandanya ada peretas yang mencoba memalsukan data!
    if (incomingSignature !== localSignature) {
      console.error("IPAYMU_WEBHOOK_WARN: Indikasi pemalsuan data notifikasi terdeteksi!")
      return NextResponse.json({ error: "Tanda tangan keamanan tidak valid" }, { status: 401 })
    }

    // 3. PROSES DATA JIKA STATUS TRANSAKSI BENAR-BENAR BERHASIL
    if (status === "berhasil") {
      // Pecah invoice untuk mendeteksi tipe paket langganan secara akurat
      const parts = referenceId.split("-")
      const planTier = parts[1] || "PRO" // Mengambil teks 'PRO' atau 'ELITE' pada potongan kedua array

      // Definisikan bonus token digital dasar
      let tokenBonus = 500000 // Paket Pro dapat 500.000 token
      if (planTier === "ELITE") {
        tokenBonus = 2000000 // Paket Elite dapat 2.000.000 token
      }

      // Jalankan penyuntikan kuota baru secara aman ke database Supabase Admin
      const { data: userProfile } = await supabaseAdmin
        .from("users")
        .select("ai_tokens_quota")
        .eq("email", buyerEmail)
        .single()

      const quotaLama = userProfile?.ai_tokens_quota || 20000
      const quotaBaru = quotaLama + tokenBonus

      // Perbarui lembar saldo total kuota siswa di database
      await supabaseAdmin
        .from("users")
        .update({
          ai_tokens_quota: quotaBaru,
        })
        .eq("email", buyerEmail)

      console.log(`IPAYMU_WEBHOOK_SUCCESS: Sukses menambahkan ${tokenBonus} token ke ${buyerEmail}`)
    }

    // Selalu kembalikan respon berstatus 'ok' agar server iPaymu berhenti mengirimkan data berulang kali
    return NextResponse.json({ status: "ok" })
  } catch (error: any) {
    console.error("IPAYMU_WEBHOOK_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal webhook" }, { status: 500 })
  }
}

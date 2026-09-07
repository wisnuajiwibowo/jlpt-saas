import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // iPaymu mengirim data notifikasi dalam bentuk FormData
    const formData = await req.formData()
    const status = formData.get("status")
    const referenceId = formData.get("reference_id")?.toString() // Contoh: INV-PRO-171740000

    // Pastikan status pembayaran dari iPaymu adalah "berhasil"
    if (status === "berhasil" && referenceId) {
      // Kita pecah ID transaksi untuk mengetahui paket apa yang dia beli (PRO atau ELITE)

      const planTier = referenceId.split("-")[1] // Mengambil potongan kata kedua secara langsung (PRO atau ELITE)

      // Tentukan berapa kuota token tambahan yang didapat murid
      let tokenBonus = 500000 // Paket Pro default dapat 500rb token
      if (planTier === "ELITE") {
        tokenBonus = 2000000 // Paket Elite dapat 2 juta token
      }

      // Ambil data email pembeli dari data laporan iPaymu
      const buyerEmail = formData.get("email")?.toString()

      if (buyerEmail) {
        // 1. Ambil data user saat ini di Supabase untuk mengetahui kuota lamanya
        const { data: userProfile } = await supabaseAdmin
          .from("users")
          .select("ai_tokens_quota")
          .eq("email", buyerEmail)
          .single()

        const quotaLama = userProfile?.ai_tokens_quota || 20000
        const quotaBaru = quotaLama + tokenBonus

        // 2. Suntikkan otomatis kuota token baru ke dalam database Supabase!
        await supabaseAdmin
          .from("users")
          .update({
            ai_tokens_quota: quotaBaru,
          })
          .eq("email", buyerEmail)
      }
    }

    // Beri tahu iPaymu kalau laporan mereka sudah sukses kita terima dengan baik
    return NextResponse.json({ status: "ok" })
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 })
  }
}

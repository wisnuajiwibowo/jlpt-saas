import { supabaseAdmin } from "@/lib/supabase/admin"
import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export const dynamic = "force-dynamic"

// Inisialisasi API Key resmi Resend dari environment variable Vercel Anda
const resend = new Resend(process.env.RESEND_API_KEY || "")

export async function POST(req: Request) {
  try {
    // 1. Ambil data notifikasi resmi dari iPaymu
    const formData = await req.formData()
    const status = formData.get("status")?.toString()
    const referenceId = formData.get("reference_id")?.toString() // Format: INV-PLAN-USERID-TIMESTAMP
    const incomingSignature = formData.get("sign")?.toString()
    const trxId = formData.get("trx_id")?.toString() // ID Transaksi unik dari iPaymu
    const totalBayar = formData.get("total") ? Number(formData.get("total")) : 0

    if (!status || !referenceId || !incomingSignature || !trxId) {
      return NextResponse.json({ error: "Data kiriman tidak lengkap" }, { status: 400 })
    }

    // 2. VERIFIKASI KEAMANAN: Cek Signature iPaymu (Anti-Hacker)
    const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY!
    const localStringToSign = `${referenceId}${status}${IPAYMU_API_KEY}`
    const localSignature = createHash("sha256").update(localStringToSign).digest("hex")

    if (incomingSignature !== localSignature) {
      console.error("IPAYMU_WEBHOOK_WARN: Indikasi pemalsuan signature terdeteksi!")
      return NextResponse.json({ error: "Tanda tangan keamanan tidak valid" }, { status: 401 })
    }

    // 3. PROSES DATA JIKA STATUS TRANSAKSI BENAR-BENAR 'berhasil'
    if (status === "berhasil") {
      // Pecah referenceId untuk mengambil tipe paket dan userId
      const parts = referenceId.split("-")
      const planTier = parts[1] || "PRO"
      const userId = parts[2]

      if (!userId) {
        console.error("IPAYMU_WEBHOOK_ERROR: User ID tidak ditemukan dalam reference_id")
        return NextResponse.json({ error: "Format Reference ID cacat" }, { status: 400 })
      }

      // ANTI-REPLAY ATTACK: Cek apakah ID Transaksi ini sudah pernah diproses sebelumnya
      const { data: existingTx } = await supabaseAdmin
        .from("payments_history")
        .select("id")
        .eq("transaction_id", trxId)
        .single()

      if (existingTx) {
        console.log(`IPAYMU_WEBHOOK_INFO: Transaksi ${trxId} sudah pernah diproses. Mengabaikan duplikasi.`)
        return NextResponse.json({ status: "ok" })
      }

      // Tentukan jumlah bonus kuota token berdasarkan tingkat keanggotaan
      let tokenBonus = 500000 
      if (planTier === "ELITE") {
        tokenBonus = 2000000 
      }

      // Tarik alamat email dan nama lengkap siswa dari database untuk pengiriman nota
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("email, full_name")
        .eq("id", userId)
        .single()

      const buyerEmail = userData?.email
      const buyerName = userData?.full_name || "Pelajar Juku"
      // Jalankan operasi penambahan data dan pengiriman email secara paralel
      await Promise.all([
        // A. Catat transaksi ke tabel history agar tidak bisa diserang replay attack
        supabaseAdmin.from("payments_history").insert({
          transaction_id: trxId,
          reference_id: referenceId,
          user_id: userId,
          amount: totalBayar,
          status: "SUCCESS"
        }),

        // B. Update kuota token langsung dijumlahkan di database via RPC untuk menghindari race condition
        supabaseAdmin.rpc("add_user_quota", { 
          target_user_id: userId, 
          quota_to_add: tokenBonus 
        }),

        // C. INTEGRASI RESEND: Kirim nota kuitansi digital otomatis ke kotak masuk email siswa
        buyerEmail ? resend.emails.send({
          from: "Juku Premium <billing@://jukujlpt.com>", // Ganti dengan domain terverifikasi Anda nanti di Resend
          to: [buyerEmail],
          subject: `🧾 Kuitansi Pembayaran Paket ${planTier} - Juku JLPT`,
          html: `
            <div style="font-family: sans-serif; max-w: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; rounded-xl: 16px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 30px;">🎌</span>
                <h2 style="color: #3b3c95; margin-top: 10px;">Terima Kasih atas Pembayaranmu!</h2>
                <p style="font-size: 12px; color: #666;">Transaksi Anda telah berhasil diproses secara aman via iPaymu.</p>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <table style="width: 100%; font-size: 12px; color: #444; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Nama Pembeli:</td>
                    <td style="padding: 5px 0; text-align: right;">${buyerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Nomor Invoice:</td>
                    <td style="padding: 5px 0; text-align: right; color: #4f46e5;">${referenceId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">ID Transaksi iPaymu:</td>
                    <td style="padding: 5px 0; text-align: right;">${trxId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Paket Langganan:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #4f46e5;">${planTier} Membership</td>
                  </tr>
                  <tr style="border-top: 1px dashed #ddd;">
                    <td style="padding: 10px 0 5px 0; font-weight: bold; font-size: 14px; color: #111;">Total Bayar:</td>
                    <td style="padding: 10px 0 5px 0; text-align: right; font-weight: black; font-size: 14px; color: #111;">Rp ${totalBayar.toLocaleString("id-ID")}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #eeeffc; padding: 12px; border-radius: 10px; text-align: center; font-size: 11px; color: #3b3c95; font-weight: bold; margin-bottom: 20px;">
                ⚡ Bonus +${tokenBonus.toLocaleString("id-ID")} Kuota Token AI telah dimasukkan ke akunmu!
              </div>

              <p style="font-size: 11px; color: #999; text-align: center; line-height: normal;">
                Sekarang kamu bisa menggunakan fitur analisis mendalam Claude AI tanpa batas. Jika ada kendala, hubungi tim bantuan Juku melalui dashboard belajar.
              </p>
            </div>
          `
        }).catch(err => console.error("RESEND_DELIVERY_FAILED:", err)) : Promise.resolve(null)
      ])

      console.log(`IPAYMU_WEBHOOK_SUCCESS: Sukses menambah ${tokenBonus} token & mengirim nota ke ${buyerEmail}`)
    }

    // Selalu kembalikan respon berstatus 'ok' agar server iPaymu berhenti mengirimkan data berulang kali
    return NextResponse.json({ status: "ok" })
  } catch (error: any) {
    console.error("IPAYMU_WEBHOOK_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal webhook" }, { status: 500 })
  }
}

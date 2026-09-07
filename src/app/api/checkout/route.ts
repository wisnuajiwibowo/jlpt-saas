import { createClient } from "@/lib/supabase/server"
import { createIpaymuInvoice } from "@/lib/ipaymu"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Menerima data nominal harga dan jenis paket dari halaman web depan
  const { amount, planTier } = await req.json()
  
  // Membuat Nomor Invoice unik otomatis menggunakan penanda waktu (timestamp)
  const idOrder = `INV-${planTier}-${Date.now()}`

  try {
    // Meminta invoice resmi langsung ke server iPaymu asli
    const ipaymuRes = await createIpaymuInvoice({
      idOrder,
      amount,
      buyerName: user.user_metadata?.full_name || "Pelajar",
      buyerEmail: user.email!,
    })

    if (ipaymuRes.status === 200) {
      // Mengirimkan tautan pembayaran iPaymu kembali ke halaman web depan siswa
      return NextResponse.json({ url: ipaymuRes.data.Url })
    } else {
      return NextResponse.json({ error: ipaymuRes.message || "Gagal membuat invoice" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan sistem pembayaran" }, { status: 500 })
  }
}

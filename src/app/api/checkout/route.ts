import { createClient } from "@/lib/supabase/server"
import { createIpaymuInvoice } from "@/lib/ipaymu"
import { NextResponse } from "next/server"

// PERBAIKAN: Kunci daftar harga resmi paket langganan secara statis di sisi server (Anti-Hacker)
const PRICE_LIST: Record<string, number> = {
  PRO: 149000,   // Rp 149.000
  ELITE: 299000, // Rp 299.000
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Sisi client hanya diperbolehkan mengirimkan jenis paket yang ingin dibeli
    const { planTier } = await req.json()
    
    // Validasi apakah paket yang dipilih terdaftar di sistem harga resmi server
    const fixedAmount = PRICE_LIST[planTier?.toUpperCase()]
    if (!fixedAmount) {
      return NextResponse.json({ error: "Jenis paket langganan tidak valid" }, { status: 400 })
    }

    // PERBAIKAN: Selipkan user.id asli dari Supabase ke dalam nomor invoice 
    // agar sistem webhook iPaymu Anda nanti tahu persis akun siapa yang harus di-upgrade
    const idOrder = `INV-${planTier.toUpperCase()}-${user.id}-${Date.now()}`

    // Meminta pembuatan tautan pembayaran resmi langsung ke API iPaymu
    const ipaymuRes = await createIpaymuInvoice({
      idOrder,
      amount: fixedAmount, // Menggunakan harga resmi server, bukan kiriman client
      buyerName: user.user_metadata?.full_name || "Pelajar Juku",
      buyerEmail: user.email!,
    })

    if (ipaymuRes.status === 200 && ipaymuRes.data?.Url) {
      return NextResponse.json({ url: ipaymuRes.data.Url })
    } else {
      return NextResponse.json({ error: ipaymuRes.message || "Gagal berkomunikasi dengan gateway pembayaran" }, { status: 400 })
    }
  } catch (error) {
    console.error("CHECKOUT_ROUTE_CRASH:", error)
    return NextResponse.json({ error: "Terjadi kesalahan sistem pembayaran" }, { status: 500 })
  }
}

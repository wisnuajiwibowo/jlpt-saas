import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  // Mengambil parameter halaman tujuan awal jika ada (misal: /dashboard/quiz)
  const next = searchParams.get("next") || "/dashboard"
  
  // Mengunci alamat domain dasar resmi aplikasi Anda untuk menghindari Open Redirect Vulnerability
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vercel.app"

  if (code) {
    try {
      const supabase = await createClient()
      
      // Proses penukaran code menjadi session aktif di server
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("AUTH_CALLBACK_SESSION_ERROR:", error.message)
        // Jika token gagal ditukar (expired/invalid), kembalikan ke login dengan pesan error
        return NextResponse.redirect(new URL("/login?error=auth_failed", baseUrl))
      }
    } catch (error) {
      console.error("AUTH_CALLBACK_CRASH:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  } else {
    // Jika user membatalkan login di halaman Google atau parameter code kosong
    return NextResponse.redirect(new URL("/login?error=canceled", baseUrl))
  }

  // Pengalihan yang aman karena domain tujuan dikunci ke baseUrl resmi Anda
  return NextResponse.redirect(new URL(next, baseUrl))
}

"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const supabase = createClient()

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Mengarahkan ke rute callback auth setelah berhasil memvalidasi akun Google
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-sm border border-slate-100 shadow-xl rounded-2xl bg-white p-4 transition-all duration-300">
        <CardHeader className="text-center space-y-2">
          {/* Visual Anchor Bendera Jepang */}
          <div className="text-3xl mb-1 select-none animate-bounce duration-1000">🎌</div>
          <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">
            Selamat Datang di Juku!
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 leading-relaxed">
            Satu akun untuk kuasai JLPT, persiapan sekolah, dan karir impianmu di Jepang.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          <Button 
            onClick={handleGoogleLogin}
            type="button"
            // PERBAIKAN: Mengubah warna tombol ke putih bersih dengan border agar logo multi-warna Google terlihat kontras dan premium
            className="w-full h-11 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            {/* PERBAIKAN: Menggunakan SVG Multi-Color Resmi Google */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Masuk Cepat dengan Akun Google
          </Button>
        </CardContent>

        <div className="text-center text-[10px] text-slate-400 mt-3 px-4 leading-normal select-none">
          Dengan masuk, kamu menyetujui rencana belajar terarah Juku untuk masa depanmu.
        </div>
      </Card>
    </div>
  )
}

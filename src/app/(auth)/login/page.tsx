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
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-sm border border-slate-100 shadow-md rounded-2xl bg-white p-4">
        <CardHeader className="text-center space-y-1">
          <div className="text-2xl mb-1 select-none">🎌</div>
          <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">Selamat Datang di Juku!</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Satu akun untuk kuasai JLPT, persiapan sekolah, dan karir impianmu di Jepang.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          <Button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full h-10 bg-[#4f46e5] text-white hover:bg-[#3b3c95] font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.183 15.465 1 12.24 1M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z"/>
            </svg>
            Masuk Cepat dengan Akun Google
          </Button>
        </CardContent>

        <div className="text-center text-[10px] text-slate-400 mt-2 px-4 leading-normal">
          Dengan masuk, kamu menyetujui rencana belajar terarah Nihongo Juku untuk masa depanmu.
        </div>
      </Card>
    </div>
  )
}

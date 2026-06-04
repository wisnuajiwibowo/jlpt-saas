import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">💳 Opsi Keanggotaan & Berlangganan</h1>
        <p className="text-slate-500 text-xs mt-0.5">Kelola paket langganan Anda secara fleksibel menggunakan integrasi Stripe otomatis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Pro Plan Card */}
        <Card className="border border-slate-100 shadow-sm rounded-xl bg-white flex flex-col justify-between">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold text-slate-800">Pro Membership</CardTitle>
            <CardDescription className="text-[11px]">Sempurna untuk tingkat akselerasi menengah</CardDescription>
            <div className="text-2xl font-extrabold text-primary mt-2">¥1,980 <span className="text-xs font-normal text-slate-400">/ bulan</span></div>
          </CardHeader>
          <CardContent className="p-5 pt-3 border-t border-slate-50 text-[11px] text-slate-500 space-y-2">
            <div>✓ 🔥 500.000 Token AI / Bulan</div>
            <div>✓ Bedah Pola Jebakan Shin Kanzen</div>
            <div>✓ Akses Soal Acak Komplit N5 - N2</div>
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Button className="w-full text-xs bg-[#4f46e5] text-white h-8.5 rounded-lg">Upgrade via Stripe</Button>
          </CardFooter>
        </Card>

        {/* Elite Plan Card */}
        <Card className="border-2 border-[#4f46e5] shadow-md rounded-xl bg-white flex flex-col justify-between relative">
          <div className="absolute -top-2.5 right-4 bg-[#4f46e5] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">REKOMENDASI</div>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold text-slate-800">N1 Elite Membership</CardTitle>
            <CardDescription className="text-[11px]">Target kelulusan mutlak tingkat mahir</CardDescription>
            <div className="text-2xl font-extrabold text-primary mt-2">¥4,980 <span className="text-xs font-normal text-slate-400">/ bulan</span></div>
          </CardHeader>
          <CardContent className="p-5 pt-3 border-t border-slate-50 text-[11px] text-slate-500 space-y-2">
            <div>✓ 💎 2.000.000 Token AI / Bulan</div>
            <div>✓ Seluruh Fitur Analisis Tanpa Batas</div>
            <div>✓ Notifikasi Kuitansi Instan Resend</div>
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Button className="w-full text-xs bg-[#4f46e5] text-white h-8.5 rounded-lg">Pilih Paket Elite</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

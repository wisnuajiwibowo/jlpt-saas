export default function BillingPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-lg font-bold text-slate-800">💳 Opsi Keanggotaan & Berlangganan</h1>
          <p className="text-slate-500 text-xs mt-1">Pilih paket yang sesuai dengan target belajar Anda. Bayar mudah via Stripe.</p>
        </div>

        {/* Kartu Paket */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pro Membership</p>
              <h2 className="text-2xl font-black text-slate-800">Rp 49.000<span className="text-sm font-normal text-slate-400"> / bulan</span></h2>
              <p className="text-xs text-slate-500 mt-1">Sempurna untuk akselerasi tingkat menengah</p>
            </div>
            <div className="p-6 space-y-3 flex-1">
              {[
                "🔥 500.000 Token AI / Bulan",
                "✅ Bedah Pola Jebakan Shin Kanzen",
                "✅ Akses Soal Acak Komplit N5 - N2",
                "✅ Ruang Belajar Mandiri Penuh",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition">
                Upgrade via Stripe
              </button>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg overflow-hidden flex flex-col relative">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              REKOMENDASI
            </div>
            <div className="p-6 border-b border-white/10">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">N1 Elite Membership</p>
              <h2 className="text-2xl font-black text-white">Rp 129.000<span className="text-sm font-normal text-indigo-200"> / bulan</span></h2>
              <p className="text-xs text-indigo-200 mt-1">Target kelulusan mutlak tingkat mahir</p>
            </div>
            <div className="p-6 space-y-3 flex-1">
              {[
                "💎 2.000.000 Token AI / Bulan",
                "✅ Seluruh Fitur Analisis Tanpa Batas",
                "✅ Akses Soal N5 - N1 Penuh",
                "✅ Notifikasi Kuitansi Instan Resend",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button className="w-full py-3 rounded-xl bg-white text-indigo-700 text-sm font-bold hover:bg-indigo-50 transition">
                Pilih Paket Elite ✨
              </button>
            </div>
          </div>
        </div>

        {/* Info tambahan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-xs text-slate-500">🔒 Pembayaran aman via <strong>Stripe</strong>. Batalkan kapan saja. Tidak ada biaya tersembunyi.</p>
        </div>
      </div>
    </div>
  )
}

export default function TermsAndInfoPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER UTAMA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <span className="text-3xl">⚖️</span>
          <h1 className="text-xl font-bold text-slate-800 mt-2">Pusat Informasi, Legalitas & Layanan Pelanggan</h1>
          <p className="text-slate-500 text-xs mt-1">Halaman resmi pemenuhan syarat Merchant Pembayaran iPaymu untuk DaijiNihongo.</p>
        </div>

        {/* 1. SYARAT & KETENTUAN */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
          <h2 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            📄 1. Syarat & Ketentuan (Terms of Service)
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>Selamat datang di DaijiNihongo. Dengan mengakses dan menggunakan platform kami, Anda menyetujui aturan berikut:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Layanan ini menyediakan fitur pembelajaran bahasa Jepang berbantuan Kecerdasan Buatan (AI).</li>
              <li>Setiap pengguna dilarang keras menyalahgunakan token AI untuk tindakan spamming atau peretasan sistem.</li>
              <li>Akun dan kuota token AI bersifat personal dan tidak boleh diperjualbelikan kepada pihak ketiga.</li>
              <li>Kami berhak menangguhkan akun secara sepihak jika ditemukan indikasi kecurangan materi atau transaksi ilegal.</li>
            </ul>
          </div>
        </div>

        {/* 2. KEBIJAKAN REFUND */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
          <h2 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            💰 2. Kebijakan Refund & Pengembalian Dana
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>Kami sangat menjaga transparansi dan kualitas layanan bagi seluruh murid. Berikut aturan refund kami:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pembelian Bersifat Final:</strong> Karena produk yang kami jual berbentuk token digital instan langsung pakai, seluruh transaksi paket PRO dan ELITE yang sudah berhasil diproses iPaymu bersifat mutlak dan tidak dapat dibatalkan atau direfund.</li>
              <li><strong>Kegagalan Sistem:</strong> Jika uang Anda sudah terpotong namun kuota token AI tidak bertambah akibat kendala Webhook otomatis, silakan kirimkan bukti bayar ke kontak kami. Tim kami akan menyuntikkan kuota Anda secara manual dalam kurun waktu 1x24 jam tanpa biaya tambahan.</li>
            </ul>
          </div>
        </div>

        {/* 3. FAQ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            ❓ 3. Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-700 mb-1">Q: Apa itu kuota Token AI di DaijiNihongo?</p>
              <p className="text-slate-600">A: Token digunakan untuk membayar biaya komputasi saat Anda menggunakan fitur Analisis AI Claude untuk membedah teks bahasa Jepang.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-700 mb-1">Q: Apakah metode pembayaran aman?</p>
              <p className="text-slate-600">A: Sangat aman. Seluruh transaksi dienkripsi dan diproses langsung oleh sistem Payment Gateway resmi iPaymu Indonesia.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-700 mb-1">Q: Bagaimana jika kuota token saya habis di tengah bulan?</p>
              <p className="text-slate-600">A: Anda bisa masuk ke halaman Berlangganan kapan saja untuk membeli kembali paket kuota tambahan sesuai kebutuhan target ujian JLPT Anda.</p>
            </div>
          </div>
        </div>

        {/* 4. KONTAK & ALAMAT USAHA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
          <h2 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            📞 4. Informasi Kontak & Alamat Usaha (Wajib Sesuai KTP iPaymu)
          </h2>
          <div className="text-xs text-slate-600 leading-relaxed space-y-3">
            <p>Jika Anda memerlukan bantuan teknis, kendala transaksi, atau kerjasama kemitraan bimbingan belajar, silakan hubungi operasional kami:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-50">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Nama Pemilik Usaha</p>
                <p className="font-semibold text-slate-700">Wisnu Aji Wibowo</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Email Dukungan Pelanggan</p>
                <p className="font-semibold text-slate-700">daijinihongo@gmail.com</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">+81 80 6134 0863/WhatsApp</p>
                <p className="font-semibold text-slate-700">+81 80 6134 0863</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Jl. Raya Sambiroto, Pucanganom, Wedomartani, Kec. Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55584, Indonesia</p>
                <p className="font-semibold text-slate-700 text-[11px]">Perum Sambiroto Asri C, No.26, Sambiroto, Purwomartani, Kalasan, Sleman, Daerah Istimewa Yogyakarta 55571</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

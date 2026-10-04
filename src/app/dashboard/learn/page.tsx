"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

interface StudyItem {
  id: string
  title: string
  content_body: string
  example_sentence: string
  quiz_question: string
  quiz_opt_a: string
  quiz_opt_b: string
  quiz_correct: string
  quiz_explanation: string
}

function LearnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const level = searchParams.get("level") || "N3"
  const type = searchParams.get("type") || "grammar"

  const [materi, setMateri] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAns, setSelectedAns] = useState<{ [key: string]: string }>({})
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({})
  
  // Status paket langganan pengguna (FREE, PRO, atau ELITE)
  const [currentPlan, setCurrentPlan] = useState<string>("FREE")

  useEffect(() => {
    async function loadMateriDanProfil() {
      try {
        const [resMateri, resProfil] = await Promise.all([
          fetch(`/api/study?level=${level}&type=${type}`),
          fetch("/api/progress") 
        ])
        
        if (resMateri.ok) {
          const dataMateri = await resMateri.json()
          setMateri(dataMateri)
        }
        
        if (resProfil.ok) {
          const dataProfil = await resProfil.json()
          setCurrentPlan(dataProfil.plan_tier || "FREE")
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data proteksi materi:", err)
      } finally {
        setLoading(false)
      }
    }
    loadMateriDanProfil()
  }, [level, type])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm animate-pulse">Memuat hak akses modul belajar...</p>
    </div>
  )

  if (materi.length === 0) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-100 max-w-sm shadow-sm select-none">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-600 font-medium text-sm">Materi Belum Tersedia</p>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Tim pengajar belum mengisi materi kompetensi untuk kategori {level} - {type.toUpperCase()}.
        </p>
      </div>
    </div>
  )

  const isLocked = currentPlan === "FREE" && ["N3", "N2", "N1"].includes(level)

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Ruang Belajar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{level}</span>
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{type.toUpperCase()}</span>
              {isLocked && (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  🔒 Premium Only
                </span>
              )}
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-3">📖 Ruang Belajar Mandiri</h1>
          <p className="text-slate-500 text-xs mt-1">
            Pelajari konsep pola kalimat secara bertahap, lalu uji pemahaman kilatmu via Flash Quiz di setiap akhir modul.
          </p>
        </div>
        {/* Daftar Loop Pengulangan Materi Belajar */}
        {materi.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">

            {/* Judul Bab Modul */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 select-none">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-sm font-bold text-slate-800">{item.title}</h2>
                </div>
                {isLocked && <span className="text-sm">🔒</span>}
              </div>
            </div>

            {/* AREA ISI TEORI DAN KUIS (AKAN TER-BLUR JIKA TERKUNCI) */}
            <div className={`p-6 space-y-5 transition-all duration-300 ${isLocked ? "blur-md select-none pointer-events-none max-h-72 overflow-hidden" : ""}`}>
              
              {/* Isi Teori */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {item.content_body}
              </div>

              {/* Kalimat Contoh (例文) */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-bold text-indigo-600 mb-2 select-none">💬 Kalimat Contoh (例文):</p>
                <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {item.example_sentence}
                </p>
              </div>

              {/* Flash Quiz Mandiri */}
              <div className="border-t border-dashed border-slate-200 pt-5 space-y-4">
                <div className="flex items-center gap-2 select-none">
                  <span className="text-amber-500 text-base">⚡</span>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Flash Quiz Pemahaman</p>
                </div>

                <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {item.quiz_question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "A", text: item.quiz_opt_a },
                    { key: "B", text: item.quiz_opt_b },
                  ].map((opt) => {
                    const isSelected = selectedAns[item.id] === opt.key
                    const isDone = checked[item.id]
                    const isCorrect = opt.key === item.quiz_correct

                    let style = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                    let keyStyle = "bg-slate-100 text-slate-600"

                    if (!isDone && isSelected) {
                      style = "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                      keyStyle = "bg-indigo-500 text-white"
                    }
                    if (isDone && isCorrect) {
                      style = "border-emerald-400 bg-emerald-50 text-emerald-700"
                      keyStyle = "bg-emerald-500 text-white"
                    }
                    if (isDone && isSelected && !isCorrect) {
                      style = "border-red-400 bg-red-50 text-red-600"
                      keyStyle = "bg-red-400 text-white"
                    }
                    if (isDone && !isCorrect && !isSelected) {
                      style = "border-slate-200 bg-white opacity-50 cursor-default"
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isDone}
                        onClick={() => !isDone && setSelectedAns(prev => ({ ...prev, [item.id]: opt.key }))}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${style} ${!isDone ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${keyStyle}`}>
                          {opt.key}
                        </span>
                        <span className="text-sm font-medium leading-normal">{opt.text}</span>
                        {isDone && isCorrect && <span className="ml-auto text-emerald-500 text-base select-none">✓</span>}
                        {isDone && isSelected && !isCorrect && <span className="ml-auto text-red-400 text-base select-none">✗</span>}
                      </button>
                    )
                  })}
                </div>

                {!checked[item.id] ? (
                  <button
                    disabled={!selectedAns[item.id]}
                    onClick={() => setChecked(prev => ({ ...prev, [item.id]: true }))}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedAns[item.id]
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Kunci Jawaban
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border animate-fade-in ${
                    selectedAns[item.id] === item.quiz_correct
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <p className={`text-xs font-bold mb-1 select-none ${
                      selectedAns[item.id] === item.quiz_correct ? "text-emerald-700" : "text-red-600"
                    }`}>
                      {selectedAns[item.id] === item.quiz_correct ? "✅ Jawaban Benar!" : `❌ Salah! Kunci Jawaban: Opsi ${item.quiz_correct}`}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {item.quiz_explanation || "Tidak ada analisis pembahasan untuk modul ini."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* LAYER PAYWALL INTERAKTIF: MUNCUL HANYA JIKA MATERI TERKUNCI (INDEX PERTAMA SAJA AGAR RAPI) */}
            {isLocked && index === 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center p-6 pt-16">
                <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="text-3xl select-none">🥷 💡</div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">Buka Modul Tingkat Lanjut {level}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Materi tingkat menengah dan mahir (N3 - N1) serta jutaan Token AI Claude eksklusif hanya dapat diakses oleh anggota premium.
                    </p>
                  </div>
                  <Link href="/dashboard/billing" className="block">
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:opacity-95 transition active:scale-[0.98] cursor-pointer">
                      Buka Akses Premium Sekarang 🚀
                    </button>
                  </Link>
                  <p className="text-[9px] text-slate-400">Mulai dari Rp 49.000 via QRIS / VA iPaymu. Aktivasi instan.</p>
                </div>
              </div>
            )}

            {/* LAYER PENUTUP CADANGAN JIKA BUKAN INDEX PERTAMA AGAR USER TIDAK BISA MENYALIN TEKS */}
            {isLocked && index > 0 && (
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center" />
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

// EKSPOR UTAMA: Dilengkapi pembungkus Suspense agar Next.js 16 tidak crash saat production build di Vercel
export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LearnContent />
    </Suspense>
  )
}

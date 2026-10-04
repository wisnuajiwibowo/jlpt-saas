"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

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
  const level = searchParams.get("level") || "N3"
  const type = searchParams.get("type") || "grammar"

  const [materi, setMateri] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAns, setSelectedAns] = useState<{ [key: string]: string }>({})
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({})

  // Mengambil data modul belajar mandiri dari database
  useEffect(() => {
    async function loadMateri() {
      try {
        const res = await fetch(`/api/study?level=${level}&type=${type}`)
        const data = await res.json()
        if (res.ok) setMateri(data)
      } catch (err) {
        console.error("Gagal memuat modul belajar:", err)
      } finally {
        setLoading(false)
      }
    }
    loadMateri()
  }, [level, type])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm animate-pulse">Memuat modul belajar JLPT...</p>
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Ruang Belajar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{level}</span>
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{type.toUpperCase()}</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-3">📖 Ruang Belajar Mandiri</h1>
          <p className="text-slate-500 text-xs mt-1">
            Pelajari konsep pola kalimat secara bertahap, lalu uji pemahaman kilatmu via Flash Quiz di setiap akhir modul.
          </p>
        </div>

        {/* Daftar Loop Pengulangan Materi Belajar */}
        {materi.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Judul Bab Modul */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 select-none">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-sm font-bold text-slate-800">{item.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* OPTIMASI: Menggunakan whitespace-pre-wrap agar enter kalimat tata bahasa Jepang tampil rapi dan presisi */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {item.content_body}
              </div>

              {/* Kalimat Contoh Contoh (例文) */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-bold text-indigo-600 mb-2 select-none">💬 Kalimat Contoh (例文):</p>
                {/* OPTIMASI: whitespace-pre-wrap mandiri kebal dari bug tabulasi double slash */}
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

                {/* OPTIMASI: Menggunakan whitespace-pre-wrap asli untuk keandalan enter kalimat Jepang */}
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
                        // OPTIMASI: Menggunakan functional state update agar render klik tombol kuis super kilat tanpa lag
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

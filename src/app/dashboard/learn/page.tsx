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

  useEffect(() => {
    async function loadMateri() {
      try {
        const res = await fetch(`/api/study?level=${level}&type=${type}`)
        const data = await res.json()
        if (res.ok) setMateri(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadMateri()
  }, [level, type])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm animate-pulse">Memuat modul belajar...</p>
    </div>
  )

  if (materi.length === 0) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center p-8 bg-slate-50 rounded-2xl border max-w-sm">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-600 font-medium text-sm">Materi belum tersedia</p>
        <p className="text-slate-400 text-xs mt-1">Admin belum mengisi materi untuk kategori {level} - {type.toUpperCase()}.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{level}</span>
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{type.toUpperCase()}</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-3">📖 Ruang Belajar Mandiri</h1>
          <p className="text-slate-500 text-xs mt-1">Pelajari konsep secara bertahap, lalu uji pemahaman via Flash Quiz di setiap modul.</p>
        </div>

        {/* Daftar Materi */}
        {materi.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Judul */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-sm font-bold text-slate-800">{item.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Isi Teori */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed text-slate-700">
                {item.content_body.split("\\n").map((line, i) => (
                  <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
                ))}
              </div>

              {/* Kalimat Contoh */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-bold text-indigo-600 mb-2">💬 Kalimat Contoh (例文):</p>
                {item.example_sentence.split("\\n").map((line, i) => (
                  <p key={i} className={`text-sm font-medium text-slate-800 ${line === "" ? "h-2" : ""}`}>{line}</p>
                ))}
              </div>

              {/* Flash Quiz */}
              <div className="border-t border-dashed border-slate-200 pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-base">⚡</span>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Flash Quiz Pemahaman</p>
                </div>

                <p className="text-sm font-medium text-slate-800">
                  {item.quiz_question.split("\\n").map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
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
                      style = "border-indigo-500 bg-indigo-50"
                      keyStyle = "bg-indigo-500 text-white"
                    }
                    if (isDone && isCorrect) {
                      style = "border-emerald-400 bg-emerald-50"
                      keyStyle = "bg-emerald-500 text-white"
                    }
                    if (isDone && isSelected && !isCorrect) {
                      style = "border-red-400 bg-red-50"
                      keyStyle = "bg-red-400 text-white"
                    }
                    if (isDone && !isCorrect && !isSelected) {
                      style = "border-slate-200 bg-white opacity-50"
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isDone}
                        onClick={() => !isDone && setSelectedAns({ ...selectedAns, [item.id]: opt.key })}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${style} ${!isDone ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${keyStyle}`}>
                          {opt.key}
                        </span>
                        <span className="text-sm text-slate-700">{opt.text}</span>
                        {isDone && isCorrect && <span className="ml-auto text-emerald-500">✓</span>}
                        {isDone && isSelected && !isCorrect && <span className="ml-auto text-red-400">✗</span>}
                      </button>
                    )
                  })}
                </div>

                {!checked[item.id] ? (
                  <button
                    disabled={!selectedAns[item.id]}
                    onClick={() => setChecked({ ...checked, [item.id]: true })}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedAns[item.id]
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Kunci Jawaban
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    selectedAns[item.id] === item.quiz_correct
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <p className={`text-xs font-bold mb-1 ${
                      selectedAns[item.id] === item.quiz_correct ? "text-emerald-700" : "text-red-600"
                    }`}>
                      {selectedAns[item.id] === item.quiz_correct ? "✅ Jawaban Benar!" : `❌ Salah! Kunci: Opsi ${item.quiz_correct}`}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.quiz_explanation || "Tidak ada penjelasan."}
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

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LearnContent />
    </Suspense>
  )
}

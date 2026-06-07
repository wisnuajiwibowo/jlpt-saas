"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

interface Question {
  id: string
  question_text: string
  context_text: string | null
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  explanation: string
}

function QuizContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const level = searchParams.get("level") || "N3"
  const type = searchParams.get("type") || "grammar"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/questions?level=${level}&type=${type}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Gagal memuat soal")
        setQuestions(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [level, type])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm animate-pulse">Memuat bank soal acak JLPT...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-500 font-medium">⚠️ {error}</p>
      </div>
    </div>
  )

  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-slate-50 rounded-2xl border">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-600 font-medium">Belum ada soal untuk kategori ini.</p>
        <p className="text-slate-400 text-sm mt-1">Silakan tambah soal melalui panel admin.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )

  // HALAMAN SKOR AKHIR
  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"
    const msg = pct >= 80 ? "Luar biasa! Penguasaan sangat baik." : pct >= 60 ? "Bagus! Terus berlatih." : "Jangan menyerah! Ulangi lagi."
    const color = pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-indigo-600" : "text-orange-500"

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
            <div className="text-6xl mb-3">{emoji}</div>
            <h2 className="text-2xl font-bold">Kuis Selesai!</h2>
            <p className="text-indigo-200 text-sm mt-1">JLPT {level} · {type.toUpperCase()}</p>
          </div>
          <div className="p-8 text-center space-y-6">
            <div>
              <div className={`text-6xl font-black ${color}`}>{score}<span className="text-2xl text-slate-400">/{questions.length}</span></div>
              <div className="mt-2 text-slate-500 text-sm">Jawaban Benar</div>
            </div>

            {/* Progress lingkaran sederhana */}
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={pct >= 80 ? "#10b981" : pct >= 60 ? "#6366f1" : "#f97316"}
                    strokeWidth="10"
                    strokeDasharray={`${pct * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${color}`}>{pct}%</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-sm font-medium">{msg}</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Coba Lagi 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const options = [
    { key: "A", text: currentQuestion.option_a },
    { key: "B", text: currentQuestion.option_b },
    { key: "C", text: currentQuestion.option_c },
    { key: "D", text: currentQuestion.option_d },
  ]
  const progressValue = Math.round(((currentIdx + 1) / questions.length) * 100)

  function handleOptionClick(optionKey: string) {
    if (isAnswered) return
    setSelectedOption(optionKey)
  }

  function handleCheckAnswer() {
    if (!selectedOption || isAnswered) return
    setIsAnswered(true)
    if (selectedOption === currentQuestion.correct_option) {
      setScore((prev) => prev + 1)
    }
  }

  function handleNext() {
    setIsAnswered(false)
    setSelectedOption(null)
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  function getOptionStyle(key: string) {
    if (!isAnswered) {
      if (key === selectedOption) return "border-indigo-500 bg-indigo-50 text-indigo-700"
      return "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
    }
    if (key === currentQuestion.correct_option) return "border-emerald-500 bg-emerald-50 text-emerald-700"
    if (key === selectedOption) return "border-red-400 bg-red-50 text-red-600"
    return "border-slate-200 bg-white opacity-50"
  }

  function getKeyStyle(key: string) {
    if (!isAnswered) {
      if (key === selectedOption) return "bg-indigo-500 text-white"
      return "bg-slate-100 text-slate-600"
    }
    if (key === currentQuestion.correct_option) return "bg-emerald-500 text-white"
    if (key === selectedOption) return "bg-red-400 text-white"
    return "bg-slate-100 text-slate-400"
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6 pt-10">
      <div className="w-full max-w-2xl space-y-5">

        {/* Header info soal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{level}</span>
            <span className="bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{type.toUpperCase()}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Soal {currentIdx + 1} dari {questions.length}</div>
            <div className="text-xs font-semibold text-indigo-600">{score} Benar ✓</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressValue}%` }}
          />
        </div>

        {/* Kartu soal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Context text jika ada */}
          {currentQuestion.context_text && (
            <div className="px-6 pt-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm leading-relaxed text-slate-700">
                <span className="text-xs font-bold text-amber-600 block mb-1">📄 Teks Bacaan:</span>
                {currentQuestion.context_text}
              </div>
            </div>
          )}

          {/* Pertanyaan */}
          <div className="px-6 py-6">
            <p className="text-slate-800 font-medium text-base leading-relaxed whitespace-pre-line">
              {currentQuestion.question_text}
            </p>
          </div>

          {/* Pilihan jawaban */}
          <div className="px-6 pb-6 space-y-3">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleOptionClick(opt.key)}
                disabled={isAnswered}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionStyle(opt.key)} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${getKeyStyle(opt.key)}`}>
                  {opt.key}
                </span>
                <span className="text-sm font-medium">{opt.text}</span>
                {isAnswered && opt.key === currentQuestion.correct_option && (
                  <span className="ml-auto text-emerald-500 text-lg">✓</span>
                )}
                {isAnswered && opt.key === selectedOption && opt.key !== currentQuestion.correct_option && (
                  <span className="ml-auto text-red-400 text-lg">✗</span>
                )}
              </button>
            ))}
          </div>

          {/* Footer aksi */}
          <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-5">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedOption
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Periksa Jawaban
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${
                  selectedOption === currentQuestion.correct_option
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {selectedOption === currentQuestion.correct_option ? "✅" : "❌"}
                    </span>
                    <span className={`text-xs font-bold ${
                      selectedOption === currentQuestion.correct_option ? "text-emerald-700" : "text-red-600"
                    }`}>
                      {selectedOption === currentQuestion.correct_option ? "Jawaban Benar!" : `Salah! Kunci: Opsi ${currentQuestion.correct_option}`}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                    {currentQuestion.explanation || "Tidak ada penjelasan untuk soal ini."}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-200"
                >
                  {currentIdx + 1 === questions.length ? "Lihat Hasil Akhir 🏆" : "Soal Berikutnya →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}

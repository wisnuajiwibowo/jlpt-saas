"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  explanation: string
}

interface Passage {
  id: number
  title: string
  passage_text: string
  questions: Question[]
}

function QuizDokkaiContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const level = searchParams.get("level") || "N3"

  const [passages, setPassages] = useState<Passage[]>([])
  const [currentPassageIdx, setCurrentPassageIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [saving, setSaving] = useState(false)

  // ANTI-DUPLIKASI: Mengunci agar request penyimpanan hasil ke database hanya terkirim 1 kali saja
  const hasSaved = useRef(false)

  // Mengambil paket wacana bacaan beserta daftar soalnya dari API backend
  useEffect(() => {
    async function fetchDokkaiQuiz() {
      try {
        const res = await fetch(`/api/questions/dokkai?level=${level}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Gagal memuat materi kuis membaca")
        
        setPassages(data)
        
        // Hitung total keseluruhan butir pertanyaan dari semua wacana yang ditarik
        let totalCount = 0
        data.forEach((p: Passage) => {
          totalCount += p.questions.length
        })
        setTotalQuestionsCount(totalCount)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDokkaiQuiz()
  }, [level])

  // Otomatis mencatat skor kelulusan kuis membaca ke database Supabase saat kuis rampung
  useEffect(() => {
    if (isFinished && totalQuestionsCount > 0 && !hasSaved.current) {
      hasSaved.current = true // Kunci status pengiriman data
      setSaving(true)
      fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jlpt_level: level,
          module_type: "reading", // Dikunci khusus untuk kategori modul kompetensi reading (Dokkai)
          score,
          total_questions: totalQuestionsCount
        })
      }).finally(() => setSaving(false))
    }
  }, [isFinished, totalQuestionsCount, level, score])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm animate-pulse">Memuat lembar wacana bacaan Dokkai JLPT...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200 max-w-md">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-500 font-medium text-sm leading-relaxed">{error}</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 px-5 py-2 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 transition cursor-pointer">
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )

  if (passages.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-100 max-w-sm shadow-sm">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-600 font-medium text-sm">Belum ada bank soal membaca untuk level ini.</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition cursor-pointer">
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )

  // MONITOR LAYAR RINGKASAN SKOR AKHIR UJIAN MEMBACA
  if (isFinished) {
    const pct = Math.round((score / totalQuestionsCount) * 100)
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"
    const msg = pct >= 80 ? "Luar biasa! Analisis bacaanmu sangat tajam." : pct >= 60 ? "Bagus! Pertahankan tingkat pemahaman teksmu." : "Jangan patah semangat! Perbanyak hafalan kosakata dan ulangi kuis."
    const color = pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-indigo-600" : "text-orange-500"

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white select-none">
            <div className="text-6xl mb-3">{emoji}</div>
            <h2 className="text-2xl font-bold">Kuis Dokkai Selesai!</h2>
            <p className="text-indigo-200 text-sm mt-1">Ujian Evaluasi Membaca JLPT {level}</p>
            {saving && <p className="text-indigo-300 text-xs mt-2 animate-pulse">Menyimpan data evaluasi harian...</p>}
          </div>
          <div className="p-8 text-center space-y-6">
            <div>
              <div className={`text-6xl font-black ${color}`}>
                {score}<span className="text-2xl text-slate-400">/{totalQuestionsCount}</span>
              </div>
              <div className="mt-2 text-slate-500 text-sm">Total Jawaban Benar</div>
            </div>

            <div className="flex items-center justify-center select-none">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none"
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

            <p className="text-slate-600 text-sm font-medium leading-relaxed px-2">{msg}</p>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push("/dashboard/progress")}
                className="py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition cursor-pointer">
                Lihat Progres
              </button>
              <button onClick={() => window.location.reload()}
                className="py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition cursor-pointer">
                Ulangi Kuis 🔄
              </button>
            </div>
            <button onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 rounded-xl text-slate-500 text-xs hover:text-slate-700 transition cursor-pointer">
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }
  const currentPassage = passages[currentPassageIdx]
  const currentQuestion = currentPassage.questions[currentQuestionIdx]
  
  const options = [
    { key: "A", text: currentQuestion.option_a },
    { key: "B", text: currentQuestion.option_b },
    { key: "C", text: currentQuestion.option_c },
    { key: "D", text: currentQuestion.option_d },
  ]

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

    // Kembalikan posisi gulir kolom pertanyaan ke paling atas secara halus
    if (typeof window !== "undefined") {
      const element = document.getElementById("questions-container")
      if (element) element.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Jika masih ada pertanyaan di wacana yang sama, geser indeks pertanyaan
    if (currentQuestionIdx + 1 < currentPassage.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1)
    } 
    // Jika pertanyaan di wacana ini habis, tapi masih ada wacana berikutnya
    else if (currentPassageIdx + 1 < passages.length) {
      setCurrentPassageIdx((prev) => prev + 1)
      setCurrentQuestionIdx(0) // Reset indeks pertanyaan untuk wacana baru
    } 
    // Jika semua wacana dan semua soal sudah dikerjakan
    else {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER ATAS */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{level}</span>
          <span className="bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">DOKKAI (読解)</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium">Wacana {currentPassageIdx + 1} dari {passages.length}</div>
          <div className="text-xs font-bold text-indigo-600 mt-0.5">{score} Benar ✓</div>
        </div>
      </header>

      {/* BODY UTAMA: SPLIT-SCREEN LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* BILAH KIRI: WACANA BACAAN UTUH (STICKY / SCROLLABLE MANDIRI) */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col gap-4">
          <div className="pb-2 border-b border-slate-100 select-none">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">Teks Bacaan Resmi</span>
            <h2 className="text-base font-bold text-slate-800 mt-2">{currentPassage.title}</h2>
          </div>
          {/* Menggunakan whitespace-pre-wrap agar struktur paragraf kalimat Jepang tegak lurus rapi */}
          <p className="text-slate-800 font-medium text-base leading-relaxed whitespace-pre-wrap tracking-wide bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            {currentPassage.passage_text}
          </p>
        </div>

        {/* BILAH KANAN: BUTIR PERTANYAAN & INPUT JAWABAN */}
        <div id="questions-container" className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col gap-5 bg-slate-50/40">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            
            {/* Judul Soal */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 select-none">Pertanyaan Ke-{currentQuestionIdx + 1}:</span>
              <p className="text-slate-800 font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Opsi Pilihan Ganda (A, B, C, D) */}
            <div className="space-y-3">
              {options.map((opt) => (
                <button key={opt.key} onClick={() => handleOptionClick(opt.key)} disabled={isAnswered}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionStyle(opt.key)} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${getKeyStyle(opt.key)}`}>
                    {opt.key
                  </span>
                  <span className="text-xs font-medium leading-normal">{opt.text}</span>
                  {isAnswered && opt.key === currentQuestion.correct_option && <span className="ml-auto text-emerald-500 text-lg select-none">✓</span>}
                  {isAnswered && opt.key === selectedOption && opt.key !== currentQuestion.correct_option && <span className="ml-auto text-red-400 text-lg select-none">✗</span>}
                </button>
              ))}
            </div>

            {/* Blok Aksi Evaluasi / Pembahasan */}
            <div className="border-t border-slate-100 pt-5">
              {!isAnswered ? (
                <button onClick={handleCheckAnswer} disabled={!selectedOption}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    selectedOption ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}>
                  Periksa Jawaban
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${selectedOption === currentQuestion.correct_option ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="text-lg">{selectedOption === currentQuestion.correct_option ? "✅" : "❌"}</span>
                      <span className={`text-xs font-bold ${selectedOption === currentQuestion.correct_option ? "text-emerald-700" : "text-red-600"}`}>
                        {selectedOption === currentQuestion.correct_option ? "Jawaban Benar!" : `Salah! Kunci Jawaban: Opsi ${currentQuestion.correct_option}`}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {currentQuestion.explanation || "Tidak ada analisis pembahasan untuk soal ini."}
                    </p>
                  </div>
                  <button onClick={handleNext}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-200 cursor-pointer">
                    {currentPassageIdx + 1 === passages.length && currentQuestionIdx + 1 === currentPassage.questions.length 
                      ? "Lihat Hasil Akhir Kuis 🏆" 
                      : "Soal Selanjutnya →"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

// EKSPOR UTAMA: Wajib dibungkus dengan Suspense agar Next.js App Router tidak crash saat compile production build
export default function QuizDokkaiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <QuizDokkaiContent />
    </Suspense>
  )
}

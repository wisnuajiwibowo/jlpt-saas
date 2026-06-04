"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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

export default function QuizPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Ambil parameter filter dari URL, default ke N3 Grammar jika kosong
  const level = searchParams.get("level") || "N3"
  const type = searchParams.get("type") || "grammar"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data soal acak dari API Route yang sudah kita buat
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

  if (loading) return <div className="p-6 text-center">Memuat bank soal acak JLPT...</div>
  if (error) return <div className="p-6 text-center text-destructive">Eror: {error}</div>
  if (questions.length === 0) return <div className="p-6 text-center">Tidak ada soal ditemukan.</div>

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
      // Sesi Kuis Selesai
      setCurrentIdx(questions.length) // Memicu layar skor akhir
    }
  }

  // Tampilan Skor Akhir Sesi Kuis
  if (currentIdx >= questions.length) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Kuis Selesai! 🎉</CardTitle>
            <CardDescription>Hasil latihan acak JLPT {level} - {type.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-extrabold text-primary">
              {score} / {questions.length}
            </div>
            <p className="text-muted-foreground">
              Skor akurasi Anda adalah {Math.round((score / questions.length) * 100)}%. Pertahankan kerja bagus Anda!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => router.push("/dashboard")}>Kembali ke Dashboard</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>Coba Lagi</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Indikator Progress */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Soal {currentIdx + 1} dari {questions.length}</span>
        <span>Akurasi Nilai: {score} Benar</span>
      </div>
      <Progress value={progressValue} className="h-2" />

      <Card className="shadow-md border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium leading-relaxed whitespace-pre-line">
            {currentQuestion.context_text && (
              <div className="mb-4 p-4 bg-muted/40 rounded-lg text-base border font-normal">
                {currentQuestion.context_text}
              </div>
            )}
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-3">
          {options.map((opt) => {
            // Logika Pewarnaan Opsi Jawaban (Hijau jika benar, Merah jika salah)
            let variant: "outline" | "default" | "destructive" = "outline"
            if (isAnswered) {
              if (opt.key === currentQuestion.correct_option) variant = "default" // Warna hijau bawaan shadcn
              else if (opt.key === selectedOption) variant = "destructive"
            } else if (opt.key === selectedOption) {
              variant = "default" // Highlight pilihan sementara
            }

            return (
              <Button
                key={opt.key}
                variant={variant}
                className="justify-start h-auto py-4 px-6 text-left font-normal transition-all"
                onClick={() => handleOptionClick(opt.key)}
                disabled={isAnswered}
              >
                <span className="font-bold mr-4 bg-muted w-6 h-6 flex items-center justify-center rounded-full text-xs text-foreground">
                  {opt.key}
                </span>
                {opt.text}
              </Button>
            )
          })}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4 border-t pt-6 bg-muted/10">
          {!isAnswered ? (
            <Button 
              className="w-full font-semibold" 
              onClick={handleCheckAnswer} 
              disabled={!selectedOption}
            >
              Periksa Jawaban
            </Button>
          ) : (
            <div className="space-y-4 w-full">
              {/* Box Analisis Metodologi Shin Kanzen Master */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                  🎌 Analisis Jawaban & Jebakan Soal:
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {currentQuestion.explanation || "Tidak ada penjelasan khusus untuk soal ini."}
                </p>
              </div>
              <Button className="w-full font-semibold" onClick={handleNext}>
                {currentIdx + 1 === questions.length ? "Lihat Hasil Akhir" : "Soal Berikutnya →"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

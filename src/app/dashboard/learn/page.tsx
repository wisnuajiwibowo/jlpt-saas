"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

  if (loading) return <div className="p-6 text-center text-xs text-muted-foreground">Memuat modul belajar interaktif...</div>
  if (materi.length === 0) return <div className="p-6 text-center text-xs text-muted-foreground">Materi belajar untuk kategori ini belum diisi oleh Admin.</div>

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans p-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">📖 Ruang Belajar Mandiri ({level} - {type.toUpperCase()})</h1>
        <p className="text-slate-500 text-xs mt-0.5">Pelajari konsep dasar esensial secara bertahap, lalu uji pemahaman instan Anda via Flash Quiz.</p>
      </div>

      <div className="space-y-8">
        {materi.map((item, index) => (
          <Card key={item.id} className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            {/* Bagian Teori */}
            <CardHeader className="p-5 bg-slate-50/50 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 flex gap-2">
                <span className="text-[#4f46e5]">0{index + 1}.</span> {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="whitespace-pre-line bg-white border border-slate-100 p-4 rounded-xl shadow-inner">
                {item.content_body}
              </div>
              <div className="p-3 bg-[#eeeffc]/30 rounded-xl border border-[#4f46e5]/10">
                <strong className="text-[#4f46e5] block mb-1">💬 Kalimat Contoh (例文):</strong>
                <p className="font-medium text-slate-800 text-sm whitespace-pre-line">{item.example_sentence}</p>
              </div>

              {/* Bagian Flash Quiz */}
              <div className="border-t border-dashed pt-5 mt-4 space-y-3">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-amber-600">
                  ⚡ Flash Quiz Pemahaman:
                </h4>
                <p className="font-medium text-slate-800">{item.quiz_question}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: "A", text: item.quiz_opt_a },
                    { key: "B", text: item.quiz_opt_b }
                  ].map((opt) => {
                    let btnVar: "outline" | "default" | "destructive" = "outline"
                    const isAns = selectedAns[item.id] === opt.key
                    const isDone = checked[item.id]

                    if (isDone) {
                      if (opt.key === item.quiz_correct) btnVar = "default"
                      else if (isAns) btnVar = "destructive"
                    } else if (isAns) {
                      btnVar = "default"
                    }

                    return (
                      <Button
                        key={opt.key}
                        variant={btnVar}
                        className="justify-start text-xs h-10 px-4 text-left font-normal rounded-xl transition-all"
                        onClick={() => !isDone && setSelectedAns({ ...selectedAns, [item.id]: opt.key })}
                        disabled={isDone}
                      >
                        <span className="font-bold mr-2">{opt.key}.</span> {opt.text}
                      </Button>
                    )
                  })}
                </div>

                {!checked[item.id] ? (
                  <Button
                    className="w-full text-[11px] h-8.5 bg-slate-800 text-white rounded-lg mt-2 font-medium"
                    disabled={!selectedAns[item.id]}
                    onClick={() => setChecked({ ...checked, [item.id]: true })}
                  >
                    Kunci Jawaban
                  </Button>
                ) : (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-[11px] text-slate-600 whitespace-pre-line mt-2">
                    <strong className="text-emerald-700 block mb-0.5">🎌 Hasil Analisis Jawaban:</strong>
                    {item.quiz_explanation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-muted-foreground">Menyiapkan Ruang Belajar...</div>}>
      <LearnContent />
    </Suspense>
  )
}

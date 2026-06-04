"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AnalyzerPage() {
  const [text, setText] = useState("")
  const [level, setLevel] = useState("N3")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLevel: level }),
      })
      const data = await res.json()
      if (res.ok) setResult(data)
      else alert(data.error || "Gagal memproses analisis")
    } catch {
      alert("Terjadi kesalahan koneksi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">🤖 AI Text Analyzer</h1>
        <p className="text-slate-500 text-xs mt-0.5">Bedah struktur bahasa Jepang, kosakata esensial, dan pola jebakan menggunakan AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* KOLOM KIRI: INPUT FORM */}
        <Card className="md:col-span-1 border-slate-100 shadow-sm rounded-xl bg-white">
          <CardHeader className="p-4"><CardTitle className="text-sm font-bold">Input Materi</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Level Target</Label>
                <select className="w-full p-2 rounded-lg border text-xs bg-white text-slate-800" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="N5">N5 (Dasar)</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3 (Menengah)</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1 (Mahir)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Teks Bahasa Jepang</Label>
                <textarea className="w-full p-2 rounded-lg border text-xs h-32 bg-white text-slate-800" placeholder="Tempel artikel/kalimat di sini..." value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} />
              </div>
              <Button type="submit" className="w-full bg-[#4f46e5] text-white text-xs h-9 rounded-lg" disabled={loading}>
                {loading ? "Menganalisis..." : "Mulai Bedah Teks"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* KOLOM KANAN: HASIL ANALISIS */}
        <Card className="md:col-span-2 border-slate-100 shadow-sm rounded-xl bg-white min-h-[250px]">
          <CardHeader className="p-4 border-b border-slate-50"><CardTitle className="text-sm font-bold">Hasil Analisis Gaya Shin Kanzen Master</CardTitle></CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            {!result ? (
              <div className="text-center text-slate-400 py-12">Masukkan teks di sebelah kiri untuk melihat keajaiban analisis AI.</div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="bg-[#eeeffc] text-[#4f46e5] font-bold px-2 py-0.5 rounded">Level Deteksi: {result.jlpt_level}</span>
                  <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Skor Kesulitan: {result.difficulty_score}</span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">📌 Pola Tata Bahasa (Grammar):</h4>
                  <div className="border rounded-lg p-2 bg-slate-50 space-y-1 text-[11px]">
                    {result.grammar_points?.map((g: any, i: number) => (
                      <div key={i}><strong>{g.pattern}</strong> ({g.level}): {g.explanation}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">📌 Kosakata Penting (Vocabulary):</h4>
                  <div className="border rounded-lg p-2 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    {result.vocabulary?.map((v: any, i: number) => (
                      <div key={i}>• <strong>{v.word}</strong> ({q => v.reading}): {v.meaning}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

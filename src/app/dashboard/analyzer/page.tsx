"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GrammarPoint {
  pattern: string
  level: string
  explanation: string
}

interface VocabularyItem {
  word: string
  reading: string
  meaning: string
  level: string
}

interface AnalysisResult {
  jlpt_level: string
  cefr_level: string
  difficulty_score: number
  grammar_points: GrammarPoint[]
  vocabulary: VocabularyItem[]
  trap_patterns: string[]
  adapted_text: string
}

export default function AnalyzerPage() {
  const [text, setText] = useState("")
  const [targetLevel, setTargetLevel] = useState("N3")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openGrammarIdx, setOpenGrammarIdx] = useState<number | null>(null)

  async function handleAnalyze() {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLevel }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menganalisis teks")
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 select-none">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">🤖 Ruang Bedah & Analisis AI Claude</h1>
          <p className="text-slate-500 text-xs mt-1">
            Masukkan teks bacaan bahasa Jepang (berita, potongan cerita, dll). Claude AI akan membedah partikel, struktur tata bahasa, kosakata esensial, serta pola jebakan ujian untukmu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PANEL KIRI: INPUT PENGGUNA */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="pb-3 select-none">
                <CardTitle className="text-sm font-bold text-slate-700">Teks Orisinal Bahasa Jepang</CardTitle>
                <CardDescription className="text-[11px]">Maksimal 2.000 karakter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ketik atau tempel kalimat bahasa Jepang di sini..."
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-slate-50/50 leading-relaxed font-sans placeholder:text-slate-400"
                />
                
                <div className="flex gap-2 items-center select-none">
                  <label className="text-xs font-bold text-slate-500 shrink-0">Target Level:</label>
                  <div className="flex gap-1 w-full">
                    {["N5", "N4", "N3", "N2", "N1"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setTargetLevel(lvl)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          targetLevel === lvl
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menganalisis Teks via Claude...
                    </>
                  ) : (
                    "Mulai Bedah Kalimat ✨"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Kotak Galat / Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-xs text-red-600 font-medium">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}
          </div>
          {/* PANEL KANAN: HASIL BEDAHAN AI */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !loading && (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 select-none">
                <p className="text-4xl mb-3">🤖</p>
                <p className="text-xs font-medium">Belum ada data analisis. Masukkan teks di panel kiri dan klik tombol untuk memulai belajar.</p>
              </div>
            )}

            {loading && !result && (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 space-y-3 select-none">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-500 animate-pulse">Claude AI sedang membaca struktur partikel teks Anda...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                
                {/* 1. Metrik Nilai Kesulitan */}
                <div className="grid grid-cols-3 gap-3 select-none">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Level JLPT</span>
                    <span className="text-lg font-black text-indigo-600 mt-0.5 block">{result.jlpt_level}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Level CEFR</span>
                    <span className="text-lg font-black text-purple-600 mt-0.5 block">{result.cefr_level}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Skor Kesulitan</span>
                    <span className="text-lg font-black text-orange-500 mt-0.5 block">{result.difficulty_score}/100</span>
                  </div>
                </div>

                {/* 2. Teks Adaptif */}
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                  <CardHeader className="pb-2 select-none">
                    <CardTitle className="text-xs font-bold text-indigo-600">📄 Teks Adaptif (Rekomendasi Claude untuk Level {targetLevel}):</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-800 font-medium text-base leading-relaxed whitespace-pre-wrap font-sans">
                      {result.adapted_text}
                    </p>
                  </CardContent>
                </Card>

                {/* 3. Pola Jebakan Ujian */}
                {result.trap_patterns && result.trap_patterns.length > 0 && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5 animate-pulse">
                    <span className="text-xs font-bold text-amber-700 block select-none">🚨 Analisis Jebakan & Pola Distraktor Ujian Asli:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed">
                      {result.trap_patterns.map((trap, i) => (
                        <li key={i}>{trap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Pembedahan Grammar Akordeon */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide select-none">🎯 Bedah Tata Bahasa (Grammar Points)</h3>
                  <div className="space-y-1.5">
                    {result.grammar_points.map((gram, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOpenGrammarIdx(openGrammarIdx === i ? null : i)}
                          className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{gram.level}</span>
                            <span className="text-sm font-bold text-slate-800">{gram.pattern}</span>
                          </div>
                          <span className="text-slate-400 text-xs select-none">{openGrammarIdx === i ? "▲" : "▼"}</span>
                        </button>
                        {openGrammarIdx === i && (
                          <div className="px-4 pb-4 text-xs leading-relaxed text-slate-600 border-t border-slate-50 pt-3 bg-slate-50/30 whitespace-pre-wrap font-sans">
                            {gram.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Tabel Kosakata Masif */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide select-none">📖 Kosakata Esensial (Vocabulary List)</h3>
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase select-none">
                          <th className="p-3">Kata (Kanji)</th>
                          <th className="p-3">Furigana</th>
                          <th className="p-3">Arti Indonesia</th>
                          <th className="p-3 text-center">Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {result.vocabulary.map((vocab, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 text-slate-700 font-medium">
                            <td className="p-3 font-bold text-slate-900 text-sm">{vocab.word}</td>
                            <td className="p-3 text-slate-500">{vocab.reading}</td>
                            <td className="p-3 text-slate-600">{vocab.meaning}</td>
                            <td className="p-3 text-center select-none">
                              <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-1.5 py-0.5 rounded">{vocab.level}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

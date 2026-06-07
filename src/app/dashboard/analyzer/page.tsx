"use client"

import { useState } from "react"

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-lg font-bold text-slate-800">🤖 AI Text Analyzer</h1>
          <p className="text-slate-500 text-xs mt-1">Bedah struktur bahasa Jepang, kosakata esensial, dan pola jebakan menggunakan AI Claude.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Form Input */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700">Input Materi</h2>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Level Target</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="N5">N5 (Dasar)</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3 (Menengah)</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1 (Mahir)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Teks Bahasa Jepang</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm h-40 bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Tempel artikel atau kalimat Jepang di sini..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={2000}
                />
                <p className="text-[10px] text-slate-400 text-right mt-1">{text.length}/2000</p>
              </div>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  loading || !text.trim()
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menganalisis...
                  </span>
                ) : "Mulai Bedah Teks 🔍"}
              </button>
            </form>
          </div>

          {/* Hasil Analisis */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-sm font-bold text-slate-800">Hasil Analisis Gaya Shin Kanzen Master</h2>
            </div>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <span className="text-5xl mb-4">🔬</span>
                <p className="text-slate-500 text-sm font-medium">Masukkan teks di sebelah kiri</p>
                <p className="text-slate-400 text-xs mt-1">AI akan membedah struktur, kosakata, dan pola jebakan JLPT</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 text-sm animate-pulse">AI sedang menganalisis teks...</p>
              </div>
            )}

            {result && (
              <div className="p-6 space-y-5 text-sm">

                {/* Badge Level & Skor */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    🎯 Level Deteksi: {result.jlpt_level}
                  </span>
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                    CEFR: {result.cefr_level}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                    Skor Kesulitan: {result.difficulty_score}/100
                  </span>
                </div>

                {/* Grammar Points */}
                {result.grammar_points?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">📌 Pola Tata Bahasa</h3>
                    <div className="space-y-2">
                      {result.grammar_points.map((g: any, i: number) => (
                        <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-indigo-700 text-sm">{g.pattern}</span>
                            <span className="bg-indigo-200 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded">{g.level}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{g.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary */}
                {result.vocabulary?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">📖 Kosakata Penting</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.vocabulary.map((v: any, i: number) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2">
                          <div>
                            <span className="font-bold text-slate-800">{v.word}</span>
                            <span className="text-slate-400 text-xs ml-1">({v.reading})</span>
                            <p className="text-xs text-slate-500 mt-0.5">{v.meaning}</p>
                          </div>
                          <span className="ml-auto bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">{v.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trap Patterns */}
                {result.trap_patterns?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">⚠️ Pola Jebakan</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
                      {result.trap_patterns.map((t: string, i: number) => (
                        <p key={i} className="text-xs text-slate-600 flex gap-2">
                          <span className="text-amber-500 shrink-0">•</span>{t}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adapted Text */}
                {result.adapted_text && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">✏️ Teks Adaptasi Level {level}</h3>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{result.adapted_text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

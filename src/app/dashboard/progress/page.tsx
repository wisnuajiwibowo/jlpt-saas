"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface QuizResult {
  id: string
  jlpt_level: string
  module_type: string
  score: number
  total_questions: number
  accuracy: number
  created_at: string
}

interface Streak {
  current_streak: number
  longest_streak: number
  total_sessions: number
  last_activity_date: string
}

export default function ProgressPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [rq, rs] = await Promise.all([
          fetch("/api/quiz-results"),
          fetch("/api/quiz-results/streak")
        ])
        if (rq.ok) setResults(await rq.json())
        if (rs.ok) setStreak(await rs.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Hitung statistik
  const totalSessions = results.length
  const avgAccuracy = totalSessions > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalSessions)
    : 0
  const bestScore = totalSessions > 0
    ? Math.max(...results.map(r => r.accuracy))
    : 0

  // Hitung per level
  const levelStats = ["N5", "N4", "N3", "N2", "N1"].map(level => {
    const levelResults = results.filter(r => r.jlpt_level === level)
    const avg = levelResults.length > 0
      ? Math.round(levelResults.reduce((sum, r) => sum + r.accuracy, 0) / levelResults.length)
      : 0
    return { level, sessions: levelResults.length, avg }
  }).filter(l => l.sessions > 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-lg font-bold text-slate-800">📈 Progres Belajar</h1>
          <p className="text-slate-500 text-xs mt-1">Pantau perkembangan dan konsistensi belajar kamu.</p>
        </div>

        {/* Streak & Statistik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Streak Sekarang", value: `${streak?.current_streak || 0} hari`, icon: "🔥", color: "from-orange-50 to-red-50", border: "border-orange-100", text: "text-orange-600" },
            { label: "Streak Terpanjang", value: `${streak?.longest_streak || 0} hari`, icon: "⭐", color: "from-yellow-50 to-amber-50", border: "border-yellow-100", text: "text-yellow-600" },
            { label: "Total Sesi", value: totalSessions, icon: "🎯", color: "from-indigo-50 to-blue-50", border: "border-indigo-100", text: "text-indigo-600" },
            { label: "Rata-rata Akurasi", value: `${avgAccuracy}%`, icon: "📊", color: "from-emerald-50 to-green-50", border: "border-emerald-100", text: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 text-center`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-black ${stat.text}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Akurasi per Level */}
        {levelStats.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700">Akurasi per Level JLPT</h2>
            <div className="space-y-3">
              {levelStats.map((ls) => (
                <div key={ls.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{ls.level} <span className="text-slate-400 font-normal">({ls.sessions} sesi)</span></span>
                    <span className={`font-bold ${ls.avg >= 80 ? "text-emerald-600" : ls.avg >= 60 ? "text-indigo-600" : "text-orange-500"}`}>{ls.avg}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${ls.avg >= 80 ? "bg-emerald-500" : ls.avg >= 60 ? "bg-indigo-500" : "bg-orange-400"}`}
                      style={{ width: `${ls.avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riwayat Kuis */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">Riwayat Kuis Terakhir</h2>
          </div>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-500 text-sm">Belum ada riwayat kuis.</p>
              <Link href="/dashboard" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white text-xs rounded-xl hover:bg-indigo-700 transition">
                Mulai Kuis Sekarang
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {results.slice(0, 15).map((r) => (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white ${
                      r.accuracy >= 80 ? "bg-emerald-500" : r.accuracy >= 60 ? "bg-indigo-500" : "bg-orange-400"
                    }`}>
                      {r.accuracy >= 80 ? "A" : r.accuracy >= 60 ? "B" : "C"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {r.jlpt_level} · {r.module_type.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800">{r.score}/{r.total_questions}</p>
                    <p className={`text-xs font-bold ${r.accuracy >= 80 ? "text-emerald-600" : r.accuracy >= 60 ? "text-indigo-600" : "text-orange-500"}`}>
                      {r.accuracy}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"

interface LeaderboardEntry {
  user_id: string
  full_name: string
  total_sessions: number
  total_score: number
  avg_accuracy: number
  last_active: string
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  const medals = ["🏆", "🥈", "🥉"]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-lg font-bold text-slate-800">🏅 Papan Peringkat</h1>
          <p className="text-slate-500 text-xs mt-1">Ranking berdasarkan total skor akumulasi kuis.</p>
        </div>

        {/* Top 3 Podium */}
        {!loading && data.length >= 3 && (
          <div className="grid grid-cols-3 gap-3">
            {[1, 0, 2].map((idx) => {
              const u = data[idx]
              const isFirst = idx === 0
              return (
                <div key={u.user_id} className={`flex flex-col items-center gap-2 ${idx === 1 ? "pt-0" : idx === 0 ? "pt-4" : "pt-8"}`}>
                  <div className="text-2xl">{medals[idx]}</div>
                  <div className={`rounded-full flex items-center justify-center font-bold text-sm ${
                    isFirst ? "w-14 h-14 bg-yellow-100 border-2 border-yellow-400 text-yellow-700"
                    : idx === 1 ? "w-12 h-12 bg-slate-200 text-slate-600"
                    : "w-11 h-11 bg-orange-100 text-orange-600"
                  }`}>
                    {u.full_name?.substring(0, 2).toUpperCase() || "??"}
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 text-center truncate w-full">{u.full_name || "Anonim"}</p>
                  <p className="text-[10px] text-indigo-600 font-bold">{u.total_score || 0} pts</p>
                  <div className={`w-full rounded-t-xl ${
                    isFirst ? "bg-yellow-400 h-20"
                    : idx === 1 ? "bg-slate-300 h-14"
                    : "bg-orange-300 h-10"
                  }`} />
                </div>
              )
            })}
          </div>
        )}

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-indigo-50 px-5 py-3 text-xs font-bold text-indigo-600">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Pelajar</div>
            <div className="col-span-2 text-center">Sesi</div>
            <div className="col-span-2 text-center">Akurasi</div>
            <div className="col-span-2 text-right">Skor</div>
          </div>
          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse text-sm">Memuat data...</div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-slate-400 text-sm">Belum ada data. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {data.map((u, i) => (
                <div key={u.user_id} className={`grid grid-cols-12 px-5 py-3.5 items-center text-xs hover:bg-slate-50 transition ${i === 0 ? "bg-yellow-50/50" : ""}`}>
                  <div className="col-span-1 text-center font-bold text-slate-600">
                    {i < 3 ? <span className="text-base">{medals[i]}</span> : <span className="text-slate-400">#{i + 1}</span>}
                  </div>
                  <div className="col-span-5 font-semibold text-slate-800 truncate">{u.full_name || "Anonim"}</div>
                  <div className="col-span-2 text-center text-slate-500">{u.total_sessions || 0}</div>
                  <div className="col-span-2 text-center">
                    <span className={`font-bold ${Number(u.avg_accuracy) >= 80 ? "text-emerald-600" : Number(u.avg_accuracy) >= 60 ? "text-indigo-600" : "text-orange-500"}`}>
                      {u.avg_accuracy || 0}%
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-black text-indigo-600">{u.total_score || 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

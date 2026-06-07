export default function LeaderboardPage() {
  const mockLeaderboard = [
    { rank: 1, name: "Kenji Tanaka", points: "14,250", badge: "🏆", level: "N1" },
    { rank: 2, name: "Aji Syafiq", points: "12,900", badge: "🥈", level: "N2" },
    { rank: 3, name: "Yuki Sakura", points: "11,400", badge: "🥉", level: "N2" },
    { rank: 4, name: "Budi Santoso", points: "9,850", badge: "", level: "N3" },
    { rank: 5, name: "Siti Aminah", points: "8,200", badge: "", level: "N3" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-lg font-bold text-slate-800">🏅 Papan Peringkat</h1>
          <p className="text-slate-500 text-xs mt-1">Bersainglah dengan pelajar lainnya di DaijiNihongo.</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4">
          {/* Rank 2 */}
          <div className="flex flex-col items-center justify-end gap-2 pt-6">
            <div className="text-2xl">🥈</div>
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
              {mockLeaderboard[1].name.substring(0, 2)}
            </div>
            <p className="text-xs font-bold text-slate-700 text-center truncate w-full text-center">{mockLeaderboard[1].name}</p>
            <p className="text-xs text-slate-500">{mockLeaderboard[1].points} pts</p>
            <div className="w-full bg-slate-300 rounded-t-xl h-16" />
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center justify-end gap-2">
            <div className="text-3xl">🏆</div>
            <div className="w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-yellow-700">
              {mockLeaderboard[0].name.substring(0, 2)}
            </div>
            <p className="text-xs font-bold text-slate-700 text-center truncate w-full text-center">{mockLeaderboard[0].name}</p>
            <p className="text-xs text-indigo-600 font-bold">{mockLeaderboard[0].points} pts</p>
            <div className="w-full bg-yellow-400 rounded-t-xl h-24" />
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center justify-end gap-2 pt-10">
            <div className="text-2xl">🥉</div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
              {mockLeaderboard[2].name.substring(0, 2)}
            </div>
            <p className="text-xs font-bold text-slate-700 text-center truncate w-full text-center">{mockLeaderboard[2].name}</p>
            <p className="text-xs text-slate-500">{mockLeaderboard[2].points} pts</p>
            <div className="w-full bg-orange-300 rounded-t-xl h-12" />
          </div>
        </div>

        {/* Tabel Peringkat */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-indigo-50 px-5 py-3 text-xs font-bold text-indigo-600">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Nama Pelajar</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-right">Skor</div>
          </div>
          <div className="divide-y divide-slate-50">
            {mockLeaderboard.map((u) => (
              <div
                key={u.rank}
                className={`grid grid-cols-12 px-5 py-4 items-center text-xs transition-colors hover:bg-slate-50 ${u.rank === 1 ? "bg-yellow-50/50" : ""}`}
              >
                <div className="col-span-2 text-center font-bold text-slate-700">
                  {u.badge ? <span className="text-base">{u.badge}</span> : <span className="text-slate-400">#{u.rank}</span>}
                </div>
                <div className="col-span-6 font-semibold text-slate-800">{u.name}</div>
                <div className="col-span-2 text-center">
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{u.level}</span>
                </div>
                <div className="col-span-2 text-right font-bold text-indigo-600">{u.points}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">* Data leaderboard akan terhubung ke database real segera.</p>
      </div>
    </div>
  )
}

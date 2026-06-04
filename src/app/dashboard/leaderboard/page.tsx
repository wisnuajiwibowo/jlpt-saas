export default function LeaderboardPage() {
  const mockLeaderboard = [
    { rank: 1, name: "Kenji Tanaka", points: "14,250", badge: "🏆" },
    { rank: 2, name: "Aji Syafiq", points: "12,900", badge: "🥈" },
    { rank: 3, name: "Yuki Sakura", points: "11,400", badge: "🥉" },
    { rank: 4, name: "Budi Santoso", points: "9,850", badge: "" },
    { rank: 5, name: "Siti Aminah", points: "8,200", badge: "" },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">🏅 Papan Peringkat (Leaderboard)</h1>
        <p className="text-slate-500 text-xs mt-0.5">Asah kemampuanmu dan bersainglah dengan pembelajar tangguh lainnya di Nihongo Juku.</p>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 bg-[#eeeffc] p-3 text-xs font-bold text-[#4f46e5]">
          <div className="col-span-2 text-center">Peringkat</div>
          <div className="col-span-7">Nama Pelajar</div>
          <div className="col-span-3 text-right">Skor Akumulasi</div>
        </div>
        <div className="divide-y text-xs text-slate-700">
          {mockLeaderboard.map((u) => (
            <div key={u.rank} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition-colors">
              <div className="col-span-2 text-center font-bold text-slate-800 flex items-center justify-center gap-1">
                {u.badge && <span>{u.badge}</span>}
                <span>{u.rank}</span>
              </div>
              <div className="col-span-7 font-medium text-slate-800">{u.name}</div>
              <div className="col-span-3 text-right font-bold text-primary">{u.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

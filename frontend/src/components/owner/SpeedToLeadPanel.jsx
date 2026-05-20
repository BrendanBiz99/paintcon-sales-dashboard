export default function SpeedToLeadPanel({ leaderboard }) {
  if (!leaderboard?.length) return null;

  const sorted = [...leaderboard].sort((a, b) => a.speedToLead - b.speedToLead);
  const avg = (leaderboard.reduce((s, r) => s + r.speedToLead, 0) / leaderboard.length).toFixed(1);
  const max = Math.max(...leaderboard.map((r) => r.speedToLead));

  function barColor(spd) {
    if (spd < 5) return 'bg-emerald-500';
    if (spd < 8) return 'bg-amber-500';
    return 'bg-red-500';
  }
  function textColor(spd) {
    if (spd < 5) return 'text-emerald-400';
    if (spd < 8) return 'text-amber-400';
    return 'text-red-400';
  }

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold">Speed to Lead</h3>
          <p className="text-slate-500 text-sm">Avg time to first contact</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{avg}<span className="text-lg text-slate-400 font-normal"> min</span></p>
          <p className="text-slate-500 text-xs">team average</p>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((rep) => (
          <div key={rep.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {rep.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 text-sm font-medium truncate">{rep.name}</span>
                <span className={`text-xs font-bold ml-2 flex-shrink-0 ${textColor(rep.speedToLead)}`}>{rep.speedToLead} min</span>
              </div>
              <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(rep.speedToLead)}`}
                  style={{ width: `${(rep.speedToLead / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-2 border-t border-white/10">
        {[
          { color: 'bg-emerald-500', label: '< 5 min (Excellent)' },
          { color: 'bg-amber-500', label: '5–8 min (Good)' },
          { color: 'bg-red-500', label: '> 8 min (Needs work)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

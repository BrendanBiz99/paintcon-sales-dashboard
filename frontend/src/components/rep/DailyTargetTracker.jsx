import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function DailyTargetTracker({ kpis }) {
  if (!kpis) return null;
  const { dailyProgress, dailyTarget, thisWeek } = kpis;

  const pct = Math.min((dailyProgress / dailyTarget) * 100, 100);
  const remaining = Math.max(dailyTarget - dailyProgress, 0);

  const color = pct >= 100 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  const statusText = pct >= 100 ? "Target hit! 🎉" : pct >= 60 ? "Almost there" : "Keep dialing";
  const statusClass = pct >= 100 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400';

  const radialData = [
    { name: 'Progress', value: pct, fill: color },
  ];

  const weekPct = Math.min((thisWeek.closes / (dailyTarget * 5)) * 100, 100);

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col gap-4">
      <div>
        <h3 className="text-white font-semibold">Daily Target</h3>
        <p className="text-slate-500 text-sm">Today's close goal</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Radial gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              data={radialData}
              startAngle={210}
              endAngle={-30}
            >
              <RadialBar
                background={{ fill: '#0f172a' }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{dailyProgress}</span>
            <span className="text-xs text-slate-500">/ {dailyTarget}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div>
            <p className={`text-sm font-semibold ${statusClass}`}>{statusText}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              {remaining > 0 ? `${remaining} more close${remaining !== 1 ? 's' : ''} to hit goal` : 'Daily goal complete!'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>This week</span>
              <span className="text-slate-300 font-medium">{thisWeek.closes} / {dailyTarget * 5}</span>
            </div>
            <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${weekPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">{weekPct.toFixed(0)}% of weekly target</p>
          </div>
        </div>
      </div>
    </div>
  );
}

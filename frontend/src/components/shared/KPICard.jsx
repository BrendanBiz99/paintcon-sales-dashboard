function TrendIcon({ direction }) {
  if (direction === 'up') return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
  if (direction === 'down') return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
  return null;
}

export default function KPICard({ title, value, subtitle, icon, accentColor = 'from-indigo-500 to-violet-600', trend, trendValue }) {
  const trendClass = trend === 'up'
    ? 'text-emerald-400'
    : trend === 'down'
    ? 'text-red-400'
    : 'text-slate-400';

  return (
    <div className="relative bg-[#1e293b] rounded-xl p-6 shadow-lg border border-white/5 overflow-hidden flex flex-col gap-3">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentColor}`} />
      <div className="flex items-start justify-between">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accentColor} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <div className="flex items-center gap-2 min-h-[20px]">
        {trendValue !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendClass}`}>
            <TrendIcon direction={trend} />
            {trendValue}
          </span>
        )}
        {subtitle && <span className="text-slate-500 text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

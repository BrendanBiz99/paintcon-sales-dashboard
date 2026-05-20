import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-slate-400 text-xs mb-1">{formatDate(label)}</p>
      <p className="text-white font-semibold">{payload[0].value} ticket{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

export default function PersonalSalesTrend({ trend, repName }) {
  if (!trend?.length) return null;

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
      <div className="mb-5">
        <h3 className="text-white font-semibold">My Sales Trend</h3>
        <p className="text-slate-500 text-sm">Last 30 days — {repName}</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={6}
            tickFormatter={formatDate}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="tickets"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#trendGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-slate-400 mb-2 text-xs font-medium">
        {mode === 'daily' ? formatDate(label) : `Week ${label}`}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SalesTrendChart({ trend }) {
  const [mode, setMode] = useState('weekly');
  if (!trend) return null;

  const data = mode === 'daily'
    ? trend.daily.map((d) => ({ ...d, label: d.date }))
    : trend.weekly.map((w) => ({ ...w, label: w.week, date: w.startDate }));

  const xKey = mode === 'daily' ? 'date' : 'week';
  const tickInterval = mode === 'daily' ? Math.floor(data.length / 8) : 0;

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-white font-semibold">Ticket Sales Over Time</h3>
          <p className="text-slate-500 text-sm">Daily ticket closes &amp; cumulative total</p>
        </div>
        <div className="flex gap-1.5">
          {['daily', 'weekly'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                mode === m
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
            tickFormatter={mode === 'daily' ? formatDate : (v) => `W${v}`}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip mode={mode} />} />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="tickets"
            name="Tickets"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1' }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulative"
            name="Cumulative"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4, fill: '#a78bfa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

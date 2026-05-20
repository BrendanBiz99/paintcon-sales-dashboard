import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

const ACTIVE_STAGES = ['Prospecting', 'Contacted', 'Conversation', 'Proposal', 'Negotiation'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-0.5">{payload[0].payload.stage}</p>
      <p className="text-slate-300">{payload[0].value} prospects</p>
    </div>
  );
}

export default function PipelineChart({ pipeline }) {
  if (!pipeline?.length) return null;

  const active = pipeline.filter((p) => ACTIVE_STAGES.includes(p.stage));
  const closedWon = pipeline.find((p) => p.stage === 'Closed Won');
  const closedLost = pipeline.find((p) => p.stage === 'Closed Lost');

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
      <div className="mb-5">
        <h3 className="text-white font-semibold">Pipeline Breakdown</h3>
        <p className="text-slate-500 text-sm">Active prospects by stage</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={active} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="stage"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {active.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Closed Won / Lost summary */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
        {closedWon && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
            <p className="text-emerald-400 text-xs font-medium mb-0.5">Closed Won</p>
            <p className="text-white font-bold text-xl">{closedWon.count.toLocaleString()}</p>
          </div>
        )}
        {closedLost && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <p className="text-red-400 text-xs font-medium mb-0.5">Closed Lost</p>
            <p className="text-white font-bold text-xl">{closedLost.count.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

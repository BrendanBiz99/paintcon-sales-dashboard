import { useState } from 'react';

const SORT_OPTIONS = [
  { key: 'closes', label: 'Closes' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'dials', label: 'Dials' },
  { key: 'closeRate', label: 'Close %' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export default function RepLeaderboard({ leaderboard }) {
  const [sortKey, setSortKey] = useState('closes');

  if (!leaderboard?.length) return null;

  const sorted = [...leaderboard].sort((a, b) => parseFloat(b[sortKey]) - parseFloat(a[sortKey]));

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-white font-semibold">Rep Leaderboard</h3>
          <p className="text-slate-500 text-sm">Campaign to date</p>
        </div>
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortKey === opt.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['#', 'Rep', 'Dials', 'Contacts', 'Convos', 'Closes', 'Revenue', 'Close %', 'Speed'].map((h) => (
                <th key={h} className="text-left text-slate-500 text-xs font-medium py-2 pr-4 last:pr-0 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((rep, i) => (
              <tr
                key={rep.id}
                className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i < 3 ? 'hover:bg-indigo-500/5' : ''}`}
              >
                <td className="py-3 pr-4 text-base w-8">
                  {i < 3 ? MEDALS[i] : <span className="text-slate-600 font-mono text-xs">{i + 1}</span>}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {rep.initials}
                    </div>
                    <div>
                      <p className="text-white font-medium leading-tight">{rep.name}</p>
                      <p className="text-slate-600 text-xs">{rep.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-slate-300 tabular-nums">{rep.dials.toLocaleString()}</td>
                <td className="py-3 pr-4 text-slate-300 tabular-nums">{rep.contacts.toLocaleString()}</td>
                <td className="py-3 pr-4 text-slate-300 tabular-nums">{rep.conversations.toLocaleString()}</td>
                <td className="py-3 pr-4 font-semibold text-white tabular-nums">{rep.closes.toLocaleString()}</td>
                <td className="py-3 pr-4 text-emerald-400 font-semibold tabular-nums">${rep.revenue.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-medium">{rep.closeRate}%</span>
                </td>
                <td className="py-3 text-slate-300 tabular-nums whitespace-nowrap">{rep.speedToLead} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

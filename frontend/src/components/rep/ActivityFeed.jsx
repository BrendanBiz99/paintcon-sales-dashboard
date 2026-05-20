const TYPE_CONFIG = {
  close: {
    icon: '🏆',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    label: 'Close',
    labelColor: 'text-emerald-400',
  },
  conversation: {
    icon: '💬',
    bg: 'bg-indigo-500/15',
    border: 'border-indigo-500/30',
    label: 'Conversation',
    labelColor: 'text-indigo-400',
  },
  contact: {
    icon: '📞',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    label: 'Contact',
    labelColor: 'text-blue-400',
  },
  meeting: {
    icon: '📅',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    label: 'Meeting',
    labelColor: 'text-violet-400',
  },
};

function formatRelativeTime(timestamp) {
  const MOCK_NOW = new Date('2026-05-20T17:00:00Z').getTime();
  const diff = MOCK_NOW - new Date(timestamp).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  const h = hours % 24;
  const timeStr = new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (days === 1) return `Yesterday at ${timeStr}`;
  return `${days}d ago`;
}

export default function ActivityFeed({ activities }) {
  if (!activities?.length) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <p className="text-slate-500 text-sm">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Recent Activity</h3>
        <p className="text-slate-500 text-sm">Your latest actions</p>
      </div>
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {activities.map((act) => {
          const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.contact;
          return (
            <div
              key={act.id}
              className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border} hover:brightness-110 transition-all`}
            >
              <div className="text-xl leading-none mt-0.5 flex-shrink-0">{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-semibold ${cfg.labelColor}`}>{cfg.label}</span>
                  <span className="text-slate-600 text-xs">{formatRelativeTime(act.timestamp)}</span>
                </div>
                <p className="text-slate-300 text-sm leading-snug">{act.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

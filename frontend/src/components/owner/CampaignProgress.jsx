export default function CampaignProgress({ data }) {
  if (!data) return null;
  const { ticketsSold, goal, campaignStartDate, campaignEndDate, totalRevenue, daysRemaining, percentComplete } = data;
  const revenueGoal = goal * 149;
  const pct = Math.min(parseFloat(percentComplete), 100);

  return (
    <div className="relative bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-white font-semibold text-lg">Campaign Progress</h2>
          <p className="text-slate-500 text-sm">6-Month Ticket Sales Campaign</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
            {daysRemaining} days remaining
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">{ticketsSold.toLocaleString()} sold</span>
          <span className="text-slate-500">Goal: {goal.toLocaleString()}</span>
        </div>
        <div className="h-4 bg-[#0f172a] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        {[
          { label: 'Campaign Start', value: new Date(campaignStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          { label: 'Tickets Sold', value: ticketsSold.toLocaleString(), highlight: true },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, highlight: true },
          { label: 'Campaign End', value: new Date(campaignEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
        ].map((item) => (
          <div key={item.label} className="bg-[#0f172a] rounded-lg px-4 py-3 border border-white/5">
            <p className="text-slate-500 text-xs mb-1">{item.label}</p>
            <p className={`font-bold text-base ${item.highlight ? 'text-white' : 'text-slate-300'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/shared/Navbar';
import PersonalKPICards from '../components/rep/PersonalKPICards';
import DailyTargetTracker from '../components/rep/DailyTargetTracker';
import PersonalSalesTrend from '../components/rep/PersonalSalesTrend';
import ActivityFeed from '../components/rep/ActivityFeed';

function Spinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SpeedBadge({ value }) {
  const color = value < 5 ? 'from-emerald-500 to-green-500 shadow-emerald-500/20'
    : value < 8 ? 'from-amber-500 to-orange-500 shadow-amber-500/20'
    : 'from-red-500 to-rose-500 shadow-red-500/20';

  return (
    <div className={`bg-[#1e293b] rounded-xl p-6 border border-white/5 shadow-lg`}>
      <p className="text-slate-500 text-sm mb-3">Speed to Lead</p>
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</span>
        <span className="text-slate-400 text-lg mb-1">min avg</span>
      </div>
      <p className="text-slate-600 text-xs mt-2">Average time from lead to first contact</p>
    </div>
  );
}

export default function RepDashboard() {
  const { repId, user } = useAuth();
  const id = repId || 'rep1';

  const [kpis, setKpis] = useState(null);
  const [trend, setTrend] = useState(null);
  const [activities, setActivities] = useState(null);
  const [repName, setRepName] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/reps/${id}/kpis`).then(setKpis);
    api.get(`/reps/${id}/sales-trend`).then(setTrend);
    api.get(`/reps/${id}/activities`).then(setActivities);
    // Get rep name from leaderboard or derive from email
    api.get('/reps').then((reps) => {
      const rep = reps.find((r) => r.id === id);
      if (rep) setRepName(rep.name);
    });
  }, [id]);

  const displayName = repName || user?.email?.split('@')[0] || 'Rep';

  return (
    <div className="min-h-screen bg-[#080f1e]">
      <Navbar title={`${displayName}'s Dashboard`} />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent rounded-xl px-6 py-4 border border-indigo-500/20">
          <p className="text-slate-400 text-sm">Welcome back,</p>
          <h2 className="text-white font-bold text-xl">{displayName}</h2>
        </div>

        {/* KPI cards */}
        {kpis ? <PersonalKPICards kpis={kpis} /> : <Spinner />}

        {/* Target + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            {kpis ? <DailyTargetTracker kpis={kpis} /> : <Spinner />}
          </div>
          <div className="lg:col-span-3">
            {trend ? <PersonalSalesTrend trend={trend} repName={displayName} /> : <Spinner />}
          </div>
        </div>

        {/* Speed to lead + Activity feed */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            {kpis ? <SpeedBadge value={kpis.speedToLead} /> : <Spinner />}
          </div>
          <div className="lg:col-span-3">
            {activities ? <ActivityFeed activities={activities} /> : <Spinner />}
          </div>
        </div>
      </main>
    </div>
  );
}

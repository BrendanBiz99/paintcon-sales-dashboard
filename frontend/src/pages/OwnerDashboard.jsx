import { useEffect, useState } from 'react';
import { api } from '../apiClient';
import Navbar from '../components/shared/Navbar';
import CampaignProgress from '../components/owner/CampaignProgress';
import TeamKPICards from '../components/owner/TeamKPICards';
import SpeedToLeadPanel from '../components/owner/SpeedToLeadPanel';
import RepLeaderboard from '../components/owner/RepLeaderboard';
import SalesTrendChart from '../components/owner/SalesTrendChart';
import PipelineChart from '../components/owner/PipelineChart';

function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    api.get(path)
      .then(setData)
      .catch(setError);
  }, [path]);
  return { data, error };
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function OwnerDashboard() {
  const { data: overview } = useFetch('/team');
  const { data: kpis } = useFetch('/team/kpis');
  const { data: leaderboard } = useFetch('/team/leaderboard');
  const { data: trend } = useFetch('/team/sales-trend');
  const { data: pipeline } = useFetch('/team/pipeline');

  return (
    <div className="min-h-screen bg-[#080f1e]">
      <Navbar title="Owner Dashboard" />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Campaign progress */}
        {overview ? <CampaignProgress data={overview} /> : <Spinner />}

        {/* Team KPIs */}
        {kpis ? <TeamKPICards kpis={kpis} /> : <Spinner />}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {trend ? <SalesTrendChart trend={trend} /> : <Spinner />}
          </div>
          <div className="lg:col-span-2">
            {pipeline ? <PipelineChart pipeline={pipeline} /> : <Spinner />}
          </div>
        </div>

        {/* Speed to lead + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            {leaderboard ? <SpeedToLeadPanel leaderboard={leaderboard} /> : <Spinner />}
          </div>
          <div className="lg:col-span-3">
            {leaderboard ? <RepLeaderboard leaderboard={leaderboard} /> : <Spinner />}
          </div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { Activity, Layers, Target, TrendingUp } from 'lucide-react';
import { Stats } from '../types';

interface StatsOverviewProps {
  stats: Stats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Layers size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Monitored Libraries</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalMonitored}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Active Ads</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalAds.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
          <Target size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Top Niche</p>
          <h3 className="text-xl font-bold text-slate-900 truncate max-w-[150px]" title={stats.topNiche}>
            {stats.topNiche || '—'}
          </h3>
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Status</p>
          <h3 className="text-lg font-bold text-slate-900">Active</h3>
        </div>
      </div>
    </div>
  );
};

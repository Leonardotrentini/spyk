import React, { useEffect, useState } from 'react';
import { X, Calendar, ArrowUp, ArrowDown, Users, Clock, MousePointer, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTrafficAnalytics } from '../services/geminiService';
import { TrafficStats } from '../types';

interface TrafficAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  url: string;
  initialEstimate?: string;
  libraryEntryId?: string;
}

export const TrafficAnalyticsModal: React.FC<TrafficAnalyticsModalProps> = ({ 
  isOpen, onClose, brandName, url, initialEstimate, libraryEntryId 
}) => {
  const [data, setData] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M'>('6M');

  useEffect(() => {
    if (isOpen && brandName) {
      setLoading(true);
      getTrafficAnalytics(brandName, url, libraryEntryId).then(result => {
        setData(result);
        setLoading(false);
      });
    }
  }, [isOpen, brandName, url, libraryEntryId]);

  if (!isOpen) return null;

  // Filter history based on timeRange (mock filter for now as we usually request 6M)
  const chartData = data?.history ? data.history.slice(timeRange === '1M' ? -2 : timeRange === '3M' ? -3 : 0) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
             <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <Activity className="text-blue-600" size={20} />
               Traffic Analytics
             </h2>
             <p className="text-sm text-slate-500">Insights for <span className="font-semibold text-slate-700">{brandName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="relative mb-4">
               <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
               <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
             </div>
             <p className="text-slate-800 font-medium">Gathering traffic intelligence...</p>
             <p className="text-slate-500 text-sm mt-1">Analyzing Similarweb & search signals</p>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                     <Users size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Total Visits</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{data.totalVisits}</p>
               </div>
               <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                     <MousePointer size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Bounce Rate</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{data.bounceRate}</p>
               </div>
               <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                     <Clock size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Avg Duration</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{data.avgDuration}</p>
               </div>
               <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                     <Activity size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Pages / Visit</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{data.pagesPerVisit}</p>
               </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Traffic Trend</h3>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                     {(['1M', '3M', '6M'] as const).map(range => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            timeRange === range ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {range}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="h-64 w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#64748b', fontSize: 12}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#64748b', fontSize: 12}}
                          tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                        />
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorVisits)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic">
                      No historical data available for this range.
                    </div>
                  )}
               </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center">
               Data estimated via AI search analysis. Actual values may vary.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
             Failed to load traffic data. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

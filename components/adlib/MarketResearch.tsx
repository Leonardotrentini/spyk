import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, HelpCircle, Lightbulb, ArrowRight, Loader2, BarChart2, Zap, BarChart, Globe, MapPin } from 'lucide-react';
import { analyzeMarketTrends, getCountryTrends, MarketTrendReport } from '../services/geminiService';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Peru' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

export const MarketResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [report, setReport] = useState<MarketTrendReport | null>(null);
  const [countryTrends, setCountryTrends] = useState<{topic: string, category: string}[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setReport(null);
    
    // Pass the query (niche) AND country to the deep analysis function
    const countryName = COUNTRIES.find(c => c.code === selectedCountry)?.name || 'United States';
    const result = await analyzeMarketTrends(query, countryName);
    
    setReport(result);
    setIsAnalyzing(false);
  };

  const loadCountryTrends = async (countryName: string) => {
    setIsLoadingTrends(true);
    const trends = await getCountryTrends(countryName);
    setCountryTrends(trends);
    setIsLoadingTrends(false);
  };

  // Initial load or when country changes
  React.useEffect(() => {
    const countryName = COUNTRIES.find(c => c.code === selectedCountry)?.name || 'United States';
    loadCountryTrends(countryName);
  }, [selectedCountry]);

  const handleTrendClick = (topic: string) => {
    setQuery(topic);
    // Directly trigger analysis
    setIsAnalyzing(true);
    setReport(null);
    
    const countryName = COUNTRIES.find(c => c.code === selectedCountry)?.name || 'United States';
    
    analyzeMarketTrends(topic, countryName).then(result => {
      setReport(result);
      setIsAnalyzing(false);
      // Smooth scroll to report
      document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Market Intelligence</h2>
        <p className="text-slate-500">
          Analyze Google Search trends by country to discover high-volume keywords, consumer pain points, and profitable product opportunities.
        </p>
      </div>

      {/* Controls Area */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto mb-10 flex flex-col md:flex-row items-center gap-3 shadow-blue-100 relative z-20">
        
        {/* Country Selector */}
        <div className="flex items-center gap-2 pl-3 pr-2 border-b md:border-b-0 md:border-r border-slate-100 w-full md:w-auto py-2 md:py-0">
           <MapPin size={18} className="text-slate-400" />
           <select 
             value={selectedCountry}
             onChange={(e) => setSelectedCountry(e.target.value)}
             className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer text-sm py-1"
           >
             {COUNTRIES.map(c => (
               <option key={c.code} value={c.code}>{c.name}</option>
             ))}
           </select>
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center w-full">
          <div className="p-3 text-slate-400">
            <Search size={24} />
          </div>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search trending topics in ${selectedCountry}...`}
              className="flex-1 outline-none text-lg text-slate-800 placeholder-slate-400 bg-transparent min-w-0"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> <span className="hidden sm:inline">Thinking...</span>
                </>
              ) : (
                <>
                  Analyze <Sparkles size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Top 10 Trends Grid */}
      {!report && !isAnalyzing && (
        <div className="mb-12">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <TrendingUp size={20} className="text-blue-500" />
             Top 10 Trends in {COUNTRIES.find(c => c.code === selectedCountry)?.name}
           </h3>
           
           {isLoadingTrends ? (
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
               ))}
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {countryTrends.map((trend, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleTrendClick(trend.topic)}
                   className="flex flex-col items-start justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group h-full"
                 >
                   <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{trend.category}</span>
                   <span className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                     {trend.topic}
                   </span>
                   <div className="mt-3 w-full flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 text-slate-300 group-hover:text-blue-500 transition-colors">
                        <ArrowRight size={14} />
                      </div>
                   </div>
                 </button>
               ))}
             </div>
           )}
        </div>
      )}

      {/* Results Area */}
      {report && (
        <div id="report-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 relative">
          
          {/* Main Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
             
             <div className="flex-1 text-center md:text-left z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Niche Viability in {selectedCountry}</h3>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 capitalize">{report.topic}</h2>
                <p className="text-slate-600 text-lg">{report.nicheVerdict}</p>
             </div>

             <div className="flex flex-col items-center justify-center z-10">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                  report.nicheScore >= 70 ? 'border-emerald-100 text-emerald-600' : 
                  report.nicheScore >= 50 ? 'border-blue-100 text-blue-600' : 'border-amber-100 text-amber-600'
                }`}>
                   <div className="text-center">
                     <span className="text-4xl font-black">{report.nicheScore}</span>
                     <span className="block text-xs font-semibold text-slate-400 uppercase">/ 100</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Product Idea "Balãozinho" (Floating Bubble) */}
          <div className="md:absolute md:-right-4 md:top-36 z-30 max-w-xs w-full animate-in zoom-in duration-500 delay-300">
             <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-100 rounded-2xl shadow-xl p-5 relative">
                {/* Arrow pointing to content (visual only) */}
                <div className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-50 border-t-2 border-l-2 border-orange-100 rotate-45 transform"></div>
                
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                      <Lightbulb size={18} fill="currentColor" />
                   </div>
                   <span className="font-bold text-orange-800 text-sm uppercase tracking-wide">Top Product Idea</span>
                </div>
                <h4 className="font-bold text-slate-900 leading-tight mb-2">
                  {report.productOpportunities[0]?.title || "Niche Opportunity"}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {report.productOpportunities[0]?.description}
                </p>
                <div className="flex items-center justify-between border-t border-orange-200/50 pt-2">
                   <span className="text-xs font-semibold text-orange-700">Est. Revenue:</span>
                   <span className="text-xs font-bold text-slate-800">{report.productOpportunities[0]?.potentialRevenue}</span>
                </div>
             </div>
          </div>

          {/* Keyword Intelligence Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                   <BarChart size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 text-lg">Keyword Opportunities</h3>
                   <p className="text-xs text-slate-500">Related terms and sub-niches analyzed for potential</p>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Search Term</th>
                     <th className="px-6 py-4">Volume</th>
                     <th className="px-6 py-4">Competition</th>
                     <th className="px-6 py-4">Opportunity Score</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {report.keywordAnalysis?.map((kw, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-900">{kw.term}</td>
                       <td className="px-6 py-4 text-slate-600">{kw.volume}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                           kw.competition === 'Low' ? 'bg-green-100 text-green-700' :
                           kw.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                           'bg-red-100 text-red-700'
                         }`}>
                           {kw.competition}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[80px]">
                                <div 
                                  className={`h-full rounded-full ${
                                    kw.score >= 8 ? 'bg-emerald-500' : 
                                    kw.score >= 5 ? 'bg-blue-500' : 'bg-slate-400'
                                  }`} 
                                  style={{width: `${kw.score * 10}%`}}
                                ></div>
                             </div>
                             <span className="text-sm font-bold text-slate-700">{kw.score}</span>
                          </div>
                       </td>
                     </tr>
                   ))}
                   {(!report.keywordAnalysis || report.keywordAnalysis.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                          No keyword data found for this topic.
                        </td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trends */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Trending Now</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.trendingKeywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium text-sm flex items-center gap-1">
                     <Zap size={12} className="text-amber-500 fill-amber-500" /> {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Pain Points */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <HelpCircle size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Consumer Questions</h3>
              </div>
              <ul className="space-y-3">
                {report.commonQuestions.map((question, idx) => (
                  <li key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-amber-50/50 border border-amber-100/50">
                    <span className="text-amber-500 font-bold text-lg leading-none">?</span>
                    <span className="text-slate-700 text-sm font-medium pt-0.5">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* More Opportunities (Others) */}
          <div className="mt-4">
             <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Lightbulb size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-xl">Other Opportunities</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.productOpportunities.slice(1).map((opp, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        opp.difficulty === 'Low' ? 'bg-green-100 text-green-700 border-green-200' :
                        opp.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {opp.difficulty} Difficulty
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-lg mb-2 relative z-10 leading-tight">{opp.title}</h4>
                    <p className="text-sm text-slate-600 mb-4 flex-1 relative z-10">{opp.description}</p>
                    
                    <div className="pt-4 border-t border-slate-100 relative z-10">
                       <p className="text-xs text-slate-500 font-medium uppercase mb-1">Potential Revenue</p>
                       <p className="text-sm font-semibold text-slate-800">{opp.potentialRevenue}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

        </div>
      )}
    </div>
  );
};
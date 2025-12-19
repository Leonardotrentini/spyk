import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, LayoutGrid, List as ListIcon, 
  BarChart3, RefreshCw, XCircle, SlidersHorizontal,
  Layout, Heart, Kanban as KanbanIcon, Folder, Home, ChevronRight,
  Globe2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { LibraryEntry, NicheOption, SortOption, Stats, Board, KanbanTask } from './types';
import { LibraryCard } from './components/LibraryCard';
import { AddLibraryModal } from './components/AddLibraryModal';
import { TrafficAnalyticsModal } from './components/TrafficAnalyticsModal';
import { StatsOverview } from './components/StatsOverview';
import { KanbanBoard } from './components/KanbanBoard';
import { MarketResearch } from './components/MarketResearch';
import { suggestNiches, analyzeLibraryUrl } from './services/geminiService';
import { supabase } from './lib/supabase/client';
import * as adlibService from './lib/adlibService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

const DEFAULT_NICHES: NicheOption[] = [
  { id: '1', label: 'E-commerce', color: 'bg-blue-100 text-blue-800' },
  { id: '2', label: 'SaaS', color: 'bg-indigo-100 text-indigo-800' },
  { id: '3', label: 'Health & Wellness', color: 'bg-emerald-100 text-emerald-800' },
  { id: '4', label: 'Crypto', color: 'bg-amber-100 text-amber-800' },
  { id: '5', label: 'Real Estate', color: 'bg-purple-100 text-purple-800' },
];

const DEFAULT_BOARDS: Board[] = [
  { id: 'all', name: 'All Libraries', type: 'system' },
  { id: 'favorites', name: 'Favorites', type: 'system' },
];

const App: React.FC = () => {
  // --- State ---
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [niches, setNiches] = useState<NicheOption[]>(DEFAULT_NICHES);
  const [boards, setBoards] = useState<Board[]>(DEFAULT_BOARDS);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState<string>('all');
  const [view, setView] = useState<'library' | 'kanban' | 'research'>('library');
  
  // Traffic Analytics Modal State
  const [trafficEntryId, setTrafficEntryId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicheFilter, setSelectedNicheFilter] = useState('ALL');
  const [filterMinAds, setFilterMinAds] = useState<number | ''>('');
  const [filterMaxAds, setFilterMaxAds] = useState<number | ''>('');
  const [filterMinDays, setFilterMinDays] = useState<number | ''>('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NEWEST);
  
  // --- Effects - Load data from Supabase ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Criar dados padrão se necessário
        try {
          await fetch('/api/setup/defaults', { method: 'POST' });
        } catch (e) {
          // Ignorar erro se já existir
        }
        
        const [librariesData, nichesData, boardsData, tasksData] = await Promise.all([
          adlibService.fetchLibraries(),
          adlibService.fetchNiches(),
          adlibService.fetchBoards(),
          adlibService.fetchKanbanTasks(),
        ]);
        
        setEntries(librariesData);
        setNiches(nichesData.length > 0 ? nichesData : DEFAULT_NICHES);
        // Adicionar boards padrão (virtuais) + boards do banco
        const allBoards = [...DEFAULT_BOARDS, ...boardsData.filter(b => b.type === 'custom')];
        setBoards(allBoards);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- Handlers ---
  const handleAddEntry = async (entryData: Omit<LibraryEntry, 'id' | 'createdAt' | 'lastChecked'>) => {
    try {
      const newEntry = await adlibService.createLibrary(entryData);
      setEntries([newEntry, ...entries]);
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Failed to add library. Please try again.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this library monitor?')) {
      try {
        await adlibService.deleteLibrary(id);
        setEntries(entries.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete library. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    const newStatus = entry.status === 'monitoring' ? 'paused' : 'monitoring';
    try {
      const updated = await adlibService.updateLibrary(id, { status: newStatus });
      setEntries(entries.map(e => e.id === id ? updated : e));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    try {
      const updated = await adlibService.updateLibrary(id, { isFavorite: !entry.isFavorite });
      setEntries(entries.map(e => e.id === id ? updated : e));
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleToggleBoard = async (entryId: string, boardId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    
    const currentBoards = entry.boardIds || [];
    const newBoardIds = currentBoards.includes(boardId)
      ? currentBoards.filter(b => b !== boardId)
      : [...currentBoards, boardId];
    
    try {
      const updated = await adlibService.updateLibrary(entryId, { boardIds: newBoardIds });
      setEntries(entries.map(e => e.id === entryId ? updated : e));
    } catch (error) {
      console.error('Error updating boards:', error);
    }
  };

  // Open traffic modal
  const handleOpenTrafficAnalysis = (id: string) => {
    setTrafficEntryId(id);
  };

  const handleCreateBoard = async () => {
    const name = prompt("Enter new board name:");
    if (name) {
      try {
        const newBoard = await adlibService.createBoard(name, 'custom');
        setBoards([...boards, newBoard]);
      } catch (error) {
        console.error('Error creating board:', error);
        alert('Failed to create board. Please try again.');
      }
    }
  };

  const handleCreateNiche = async (label: string) => {
    const exists = niches.some(n => n.label.toLowerCase() === label.toLowerCase());
    if (exists) return;
    
    const colors = ['bg-pink-100 text-pink-800', 'bg-cyan-100 text-cyan-800', 'bg-orange-100 text-orange-800'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    try {
      const newNiche = await adlibService.createNiche(label, randomColor);
      setNiches([...niches, newNiche]);
    } catch (error) {
      console.error('Error creating niche:', error);
    }
  };

  const suggestNewNiches = async () => {
      const suggestions = await suggestNiches(entries.slice(0, 10).map(e => ({ brandName: e.brandName, notes: e.niche })));
      suggestions.forEach(s => handleCreateNiche(s));
  }
  
  // Kanban Handlers
  const handleAddTask = async (content: string, status: KanbanTask['status']) => {
    try {
      const newTask = await adlibService.createKanbanTask(content, status);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: KanbanTask['status']) => {
    try {
      const updated = await adlibService.updateKanbanTask(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? updated : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await adlibService.deleteKanbanTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedNicheFilter('ALL');
    setFilterMinAds('');
    setFilterMaxAds('');
    setFilterMinDays('');
  };
  
  const activeFilterCount = [
    searchTerm, 
    selectedNicheFilter !== 'ALL', 
    filterMinAds !== '', 
    filterMaxAds !== '', 
    filterMinDays !== ''
  ].filter(Boolean).length;

  // --- Computed ---
  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        // Board Filter
        if (activeBoardId === 'favorites' && !entry.isFavorite) return false;
        if (activeBoardId !== 'all' && activeBoardId !== 'favorites' && !entry.boardIds?.includes(activeBoardId)) return false;

        // Text Search
        const matchesSearch = entry.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             entry.niche.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Niche Filter
        const matchesNiche = selectedNicheFilter === 'ALL' || entry.niche === selectedNicheFilter;
        
        // Active Ads Count Filter
        const adsCount = entry.activeAdsCount;
        const matchesMinAds = filterMinAds === '' || adsCount >= filterMinAds;
        const matchesMaxAds = filterMaxAds === '' || adsCount <= filterMaxAds;
        
        // Active Days Filter
        const daysActive = Math.floor((Date.now() - entry.createdAt) / (1000 * 60 * 60 * 24));
        const matchesMinDays = filterMinDays === '' || daysActive >= filterMinDays;

        return matchesSearch && matchesNiche && matchesMinAds && matchesMaxAds && matchesMinDays;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case SortOption.NEWEST: return b.createdAt - a.createdAt;
          case SortOption.ADS_HIGH_TO_LOW: return b.activeAdsCount - a.activeAdsCount;
          case SortOption.ADS_LOW_TO_HIGH: return a.activeAdsCount - b.activeAdsCount;
          case SortOption.ALPHABETICAL: return a.brandName.localeCompare(b.brandName);
          default: return 0;
        }
      });
  }, [entries, activeBoardId, searchTerm, selectedNicheFilter, filterMinAds, filterMaxAds, filterMinDays, sortOption]);

  const stats: Stats = useMemo(() => {
    const totalMonitored = entries.filter(e => e.status === 'monitoring').length;
    const totalAds = entries.reduce((acc, curr) => acc + curr.activeAdsCount, 0);
    const nicheCounts: Record<string, number> = {};
    entries.forEach(e => { nicheCounts[e.niche] = (nicheCounts[e.niche] || 0) + 1 });
    const topNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    return { totalMonitored, totalAds, topNiche };
  }, [entries]);

  const chartData = useMemo(() => {
     const data: Record<string, number> = {};
     entries.forEach(e => {
       data[e.niche] = (data[e.niche] || 0) + e.activeAdsCount;
     });
     return Object.entries(data).map(([name, ads]) => ({ name, ads })).sort((a,b) => b.ads - a.ads).slice(0, 8);
  }, [entries]);

  const getPageTitle = () => {
    if (view === 'kanban') return 'Kanban Tasks';
    if (view === 'research') return 'Market Research';
    return boards.find(b => b.id === activeBoardId)?.name || 'Dashboard';
  }

  // Find the selected entry for the traffic modal
  const activeTrafficEntry = entries.find(e => e.id === trafficEntryId);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
         <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BarChart3 size={20} />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">AdLib Monitor</span>
         </div>

         <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
            {/* Main Navigation */}
            <div>
               <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dashboards</p>
               <nav className="space-y-1">
                 <button 
                   onClick={() => { setActiveBoardId('all'); setView('library'); }}
                   className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeBoardId === 'all' && view === 'library' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <Home size={18} /> All Libraries
                 </button>
                 <button 
                   onClick={() => { setActiveBoardId('favorites'); setView('library'); }}
                   className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeBoardId === 'favorites' && view === 'library' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <Heart size={18} className={activeBoardId === 'favorites' ? 'text-red-500 fill-red-500' : ''}/> Favorites
                 </button>
               </nav>
            </div>

            {/* Custom Boards */}
            <div>
               <div className="flex items-center justify-between px-3 mb-2">
                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Boards</p>
                 <button onClick={handleCreateBoard} className="text-slate-400 hover:text-blue-600 transition-colors" title="Create Board">
                   <Plus size={16} />
                 </button>
               </div>
               <nav className="space-y-1">
                 {boards.filter(b => b.type === 'custom').map(board => (
                    <button 
                      key={board.id}
                      onClick={() => { setActiveBoardId(board.id); setView('library'); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${activeBoardId === board.id && view === 'library' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Folder size={18} className="text-slate-400 group-hover:text-slate-500" /> 
                      <span className="truncate">{board.name}</span>
                    </button>
                 ))}
                 {boards.filter(b => b.type === 'custom').length === 0 && (
                   <p className="px-3 text-xs text-slate-400 italic">No custom boards.</p>
                 )}
               </nav>
            </div>

            {/* Workflow */}
            <div>
               <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workflow & Tools</p>
               <nav className="space-y-1">
                 <button 
                   onClick={() => setView('kanban')}
                   className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'kanban' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <KanbanIcon size={18} /> Kanban Tasks
                 </button>
                 <button 
                   onClick={() => setView('research')}
                   className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'research' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <Globe2 size={18} /> Market Research
                 </button>
               </nav>
            </div>
         </div>
         
         {/* Sidebar Footer */}
         <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    ME
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">My Workspace</p>
                    <p className="text-xs text-slate-500 truncate">{entries.length} tracked items</p>
                 </div>
             </div>
             <button
               onClick={async () => {
                 await supabase.auth.signOut();
               }}
               className="w-full text-xs text-slate-500 hover:text-red-600 text-left transition-colors"
             >
               Sair
             </button>
         </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>{view === 'library' ? 'Dashboards' : 'Workflow'}</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-slate-900">
                {getPageTitle()}
              </span>
           </div>
           
           {view === 'library' && (
             <div className="flex items-center gap-3">
                <button 
                  onClick={suggestNewNiches}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                >
                  <RefreshCw size={16} /> <span className="hidden sm:inline">Suggestions</span>
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-blue-200 transition-all hover:translate-y-[-1px]"
                >
                  <Plus size={18} /> Add Library
                </button>
             </div>
           )}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
           {loading ? (
             <div className="flex items-center justify-center h-full">
               <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <p className="text-slate-600">Loading...</p>
               </div>
             </div>
           ) : (
             <>
           {/* VIEW: LIBRARY */}
           {view === 'library' && (
             <div className="max-w-7xl mx-auto">
                <StatsOverview stats={stats} />

                {/* Filters & Toolbar */}
                <div className="flex flex-col gap-4 mb-6 sticky top-0 z-10 bg-slate-50 pt-2 pb-4">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search brands..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                        />
                      </div>
                      
                      <button
                          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors w-full md:w-auto justify-center ${
                            isFilterPanelOpen || activeFilterCount > 0 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <SlidersHorizontal size={18} />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                            {activeFilterCount}
                          </span>
                        )}
                      </button>

                      {(activeFilterCount > 0) && (
                        <button 
                          onClick={resetFilters}
                          className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                          <XCircle size={14} /> Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button 
                          onClick={() => setSortOption(SortOption.NEWEST)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${sortOption === SortOption.NEWEST ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Newest
                        </button>
                        <button 
                          onClick={() => setSortOption(SortOption.ADS_HIGH_TO_LOW)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${sortOption === SortOption.ADS_HIGH_TO_LOW ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Most Ads
                        </button>
                    </div>
                  </div>
                  
                  {/* Advanced Filters Panel */}
                  {isFilterPanelOpen && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Filter by Niche</label>
                          <select 
                            value={selectedNicheFilter}
                            onChange={(e) => setSelectedNicheFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="ALL">All Niches</option>
                            {niches.map(n => (
                              <option key={n.id} value={n.label}>{n.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Active Ads Count</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="Min" 
                              value={filterMinAds}
                              onChange={(e) => setFilterMinAds(e.target.value ? parseInt(e.target.value) : '')}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-slate-400">-</span>
                            <input 
                              type="number" 
                              placeholder="Max" 
                              value={filterMaxAds}
                              onChange={(e) => setFilterMaxAds(e.target.value ? parseInt(e.target.value) : '')}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Days Monitored</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="Min Days" 
                              value={filterMinDays}
                              onChange={(e) => setFilterMinDays(e.target.value ? parseInt(e.target.value) : '')}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-sm text-slate-500">days or more</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {filteredEntries.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LayoutGrid className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No libraries found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
                      {activeFilterCount > 0 ? 'Try adjusting your filters.' : 'Start monitoring your competitors by adding their ad library URL.'}
                    </p>
                    {activeFilterCount > 0 && (
                        <button onClick={resetFilters} className="text-blue-600 font-medium hover:underline">Clear all filters</button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredEntries.map(entry => (
                      <LibraryCard 
                        key={entry.id} 
                        entry={entry} 
                        niches={niches}
                        boards={boards}
                        onDelete={handleDeleteEntry}
                        onToggleStatus={handleToggleStatus}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleBoard={handleToggleBoard}
                        onOpenTrafficAnalysis={handleOpenTrafficAnalysis}
                      />
                    ))}
                  </div>
                )}
                
                {/* Analytics Section */}
                {entries.length > 0 && (
                  <div className="mt-8 pb-10">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Ads Distribution by Niche</h2>
                    <div className="h-64 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="ads" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
             </div>
           )}

           {/* VIEW: KANBAN */}
           {view === 'kanban' && (
             <div className="h-full">
               <KanbanBoard 
                 tasks={tasks}
                 onAddTask={handleAddTask}
                 onUpdateTaskStatus={handleUpdateTaskStatus}
                 onDeleteTask={handleDeleteTask}
               />
             </div>
           )}

           {/* VIEW: MARKET RESEARCH */}
           {view === 'research' && (
             <MarketResearch />
           )}
           </>
           )}

        </div>
      </main>

      <AddLibraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddEntry}
        existingNiches={niches}
        onCreateNiche={handleCreateNiche}
      />

      <TrafficAnalyticsModal 
        isOpen={!!trafficEntryId}
        onClose={() => setTrafficEntryId(null)}
        brandName={activeTrafficEntry?.brandName || ''}
        url={activeTrafficEntry?.url || ''}
        initialEstimate={activeTrafficEntry?.trafficEstimate}
        libraryEntryId={activeTrafficEntry?.id}
      />
    </div>
  );
};

export default App;

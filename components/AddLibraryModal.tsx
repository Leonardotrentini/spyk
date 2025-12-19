import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Globe, Link as LinkIcon, Hash, BarChart2 } from 'lucide-react';
import { analyzeLibraryUrl, UrlAnalysisResult } from '../services/geminiService';
import { LibraryEntry, NicheOption } from '../types';

interface AddLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'lastChecked'>) => void;
  existingNiches: NicheOption[];
  onCreateNiche: (nicheLabel: string) => void;
}

export const AddLibraryModal: React.FC<AddLibraryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingNiches,
  onCreateNiche,
}) => {
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [activeAdsCount, setActiveAdsCount] = useState<number>(0);
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [newNicheInput, setNewNicheInput] = useState('');
  const [trafficEstimate, setTrafficEstimate] = useState('');
  const [status, setStatus] = useState<'monitoring' | 'paused'>('monitoring');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzeExpanded, setIsAnalyzeExpanded] = useState(true);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setBrandName('');
      setActiveAdsCount(0);
      setLandingPageUrl('');
      setSelectedNiche('');
      setNewNicheInput('');
      setTrafficEstimate('');
      setStatus('monitoring');
      setIsAnalyzeExpanded(true);
    }
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!url) {
      alert('Por favor, insira uma URL primeiro');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result: UrlAnalysisResult | null = await analyzeLibraryUrl(url);
      
      if (result) {
        // Preencher todos os campos automaticamente
        setBrandName(result.brandName || '');
        setLandingPageUrl(result.landingPageUrl || '');
        setActiveAdsCount(result.estimatedAdsCount || 0);
        setTrafficEstimate(result.trafficEstimate || '');
        
        // Try to match existing niche or set partial
        if (result.niche) {
          const match = existingNiches.find(n => n.label.toLowerCase() === result.niche.toLowerCase());
          if (match) {
            setSelectedNiche(match.label);
          } else {
            // Auto-create logic - pre-fill the "create new" input
            setNewNicheInput(result.niche);
            setSelectedNiche('__NEW__');
          }
        }
        
        // Feedback visual de sucesso
        console.log('✅ Análise concluída com sucesso!', result);
      } else {
        alert('Não foi possível analisar a URL. Verifique se as Edge Functions estão deployadas e se você está autenticado.');
        console.error('Resultado vazio da análise');
      }
    } catch (error: any) {
      console.error('Erro ao analisar URL:', error);
      alert(`Erro ao analisar: ${error.message || 'Verifique se o backend está configurado (Edge Functions deployadas)'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    let finalNiche = selectedNiche;
    
    if (selectedNiche === '__NEW__') {
      if (!newNicheInput.trim()) return; // Validation
      onCreateNiche(newNicheInput);
      finalNiche = newNicheInput;
    }

    if (!brandName || !url) return; // Basic validation

    onSave({
      url,
      brandName,
      activeAdsCount,
      landingPageUrl,
      niche: finalNiche,
      status: status === 'paused' ? 'paused' : 'monitoring', // Normalize
      notes: '',
      trafficEstimate,
      isFavorite: false,
      boardIds: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Track New Library</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* URL Input & AI Analyze */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Library / Page URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://facebook.com/ads/library/..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Traffic'}
              </button>
            </div>
            <p className="text-xs text-slate-500">Paste an Ad Library URL to auto-detect details.</p>
          </div>

          <div className="h-px bg-slate-100 my-2"></div>

          {/* Manual / Auto-filled Fields */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Brand & Ads Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Active Ads</label>
                <input
                  type="number"
                  value={activeAdsCount}
                  onChange={(e) => setActiveAdsCount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Landing Page */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Globe size={14} className="text-slate-400"/> Landing Page
              </label>
              <input
                type="text"
                value={landingPageUrl}
                onChange={(e) => setLandingPageUrl(e.target.value)}
                placeholder="https://example.com/offer"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Traffic Estimate */}
             <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <BarChart2 size={14} className="text-slate-400"/> Traffic Estimate
              </label>
              <input
                type="text"
                value={trafficEstimate}
                onChange={(e) => setTrafficEstimate(e.target.value)}
                placeholder="e.g. 50k/mo"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Niche Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Hash size={14} className="text-slate-400"/> Niche
              </label>
              <div className="flex flex-col gap-2">
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select a niche...</option>
                  {existingNiches.map(n => (
                    <option key={n.id} value={n.label}>{n.label}</option>
                  ))}
                  <option value="__NEW__">+ Create New Niche</option>
                </select>
                
                {selectedNiche === '__NEW__' && (
                  <input
                    type="text"
                    value={newNicheInput}
                    onChange={(e) => setNewNicheInput(e.target.value)}
                    placeholder="Enter new niche name..."
                    autoFocus
                    className="w-full rounded-lg border border-indigo-300 bg-indigo-50/50 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-700 placeholder-indigo-300"
                  />
                )}
              </div>
            </div>

             {/* Status */}
             <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Initial Status</label>
              <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="monitoring"
                      checked={status === 'monitoring'}
                      onChange={() => setStatus('monitoring')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Monitoring
                 </label>
                 <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="paused"
                      checked={status === 'paused'}
                      onChange={() => setStatus('paused')}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    Paused
                 </label>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all hover:translate-y-[-1px]"
          >
            Save Library
          </button>
        </div>
      </div>
    </div>
  );
};
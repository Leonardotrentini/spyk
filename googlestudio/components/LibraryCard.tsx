import React, { useState } from 'react';
import { ExternalLink, MoreHorizontal, PauseCircle, PlayCircle, Trash2, Globe, FileText, Clock, Heart, FolderPlus, BarChart2, Loader2 } from 'lucide-react';
import { Board, LibraryEntry, NicheOption } from '../types';

interface LibraryCardProps {
  entry: LibraryEntry;
  niches: NicheOption[];
  boards: Board[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleBoard: (entryId: string, boardId: string) => void;
  onOpenTrafficAnalysis: (entryId: string) => void;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ 
  entry, niches, boards, onDelete, onToggleStatus, onToggleFavorite, onToggleBoard, onOpenTrafficAnalysis
}) => {
  const nicheColor = niches.find(n => n.label === entry.niche)?.color || 'bg-slate-100 text-slate-600';
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  
  // Calculate days active
  const daysActive = Math.floor((Date.now() - entry.createdAt) / (1000 * 60 * 60 * 24));

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full relative">
      <div className="p-5 flex-1">
        
        {/* Header: Brand & Actions */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg uppercase border border-slate-200">
               {entry.brandName.substring(0, 2)}
             </div>
             <div>
               <h3 className="font-bold text-slate-900 leading-tight">{entry.brandName}</h3>
               <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${nicheColor}`}>
                 {entry.niche}
               </span>
             </div>
          </div>
          
          <div className="flex items-center gap-1">
             <button 
                onClick={() => onToggleFavorite(entry.id)}
                className={`p-1.5 rounded-md transition-all ${entry.isFavorite ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'}`}
                title="Toggle Favorite"
             >
               <Heart size={18} fill={entry.isFavorite ? "currentColor" : "none"} />
             </button>
             
             {/* Board Menu Trigger */}
             <div className="relative">
                <button
                  onClick={() => setShowBoardMenu(!showBoardMenu)}
                  className="p-1.5 rounded-md text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Add to Board"
                >
                  <FolderPlus size={18} />
                </button>
                {showBoardMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10 py-1">
                     <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Add to Board</p>
                     {boards.filter(b => b.type === 'custom').length === 0 ? (
                       <p className="px-3 py-2 text-xs text-slate-500 italic">No custom boards created.</p>
                     ) : (
                       boards.filter(b => b.type === 'custom').map(board => (
                         <button
                           key={board.id}
                           onClick={() => {
                             onToggleBoard(entry.id, board.id);
                             setShowBoardMenu(false);
                           }}
                           className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                         >
                           <span className={`w-3 h-3 rounded-full border ${entry.boardIds?.includes(board.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}></span>
                           {board.name}
                         </button>
                       ))
                     )}
                     <div className="border-t border-slate-100 my-1"></div>
                     <button onClick={() => setShowBoardMenu(false)} className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:bg-slate-50">Close</button>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-4">
           <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Active Ads</p>
              <p className="text-lg font-bold text-slate-900">{entry.activeAdsCount}</p>
           </div>
           <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Monitored</p>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {daysActive} {daysActive === 1 ? 'day' : 'days'}
                </span>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex gap-2">
         <div className="flex-1 flex gap-2">
            <a 
              href={entry.url} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <FileText size={14} /> Library
            </a>
            {entry.landingPageUrl && (
                <a 
                  href={entry.landingPageUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Globe size={14} /> LP
                </a>
            )}
            <button
               onClick={() => onOpenTrafficAnalysis(entry.id)}
               className="flex-1 flex items-center justify-center gap-2 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 py-2 rounded-lg hover:bg-blue-100 transition-colors"
               title="View Traffic Analytics"
            >
               <BarChart2 size={14} />
               <span className="truncate max-w-[60px]">Traffic</span>
            </button>
         </div>
         
         <div className="flex items-center border-l border-slate-200 pl-2 ml-1">
             <button 
                onClick={() => onToggleStatus(entry.id)}
                className={`p-2 rounded-md transition-colors ${entry.status === 'monitoring' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                title={entry.status === 'monitoring' ? 'Pause' : 'Resume'}
             >
               {entry.status === 'monitoring' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
             </button>
             <button 
                onClick={() => onDelete(entry.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
             >
               <Trash2 size={18} />
             </button>
         </div>
      </div>
    </div>
  );
};

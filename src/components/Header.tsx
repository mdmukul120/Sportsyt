import React from 'react';
import { RefreshCw, Github, Plus } from 'lucide-react';

interface HeaderProps {
  activeSport: string;
  onSelectSport: (sport: string) => void;
  activeSource: 'ALL' | 'FANCODE' | 'WILLOW';
  onSelectSource: (source: 'ALL' | 'FANCODE' | 'WILLOW') => void;
  onOpenCustomStream: () => void;
  onOpenDeployGuide: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  totalMatchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSport,
  onSelectSport,
  activeSource,
  onSelectSource,
  onOpenCustomStream,
  onOpenDeployGuide,
  onRefreshData,
  isLoading,
  totalMatchesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark with FanCode orange identity */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectSport('All');
                onSelectSource('ALL');
              }}
              className="group flex items-center gap-2.5 text-decoration-none"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-sm group-hover:bg-orange-500 transition-colors">
                FC
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors uppercase font-display leading-none">
                  FanCode <span className="text-orange-600">& Willow</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                  Live Sports Hub
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onSelectSport('All')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-orange-600 ${
                activeSport === 'All' ? 'text-orange-600 border-b-2 border-orange-600 py-1' : ''
              }`}
            >
              All Matches ({totalMatchesCount})
            </button>

            <button
              onClick={() => onSelectSport('Cricket')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-orange-600 ${
                activeSport === 'Cricket' ? 'text-orange-600 border-b-2 border-orange-600 py-1' : ''
              }`}
            >
              Cricket
            </button>

            <button
              onClick={() => onSelectSport('Football')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-orange-600 ${
                activeSport === 'Football' ? 'text-orange-600 border-b-2 border-orange-600 py-1' : ''
              }`}
            >
              Football
            </button>

            <button
              onClick={() => onSelectSport('Tennis')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-orange-600 ${
                activeSport === 'Tennis' ? 'text-orange-600 border-b-2 border-orange-600 py-1' : ''
              }`}
            >
              Tennis
            </button>

            <button
              onClick={() => onSelectSport('Golf')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-orange-600 ${
                activeSport === 'Golf' ? 'text-orange-600 border-b-2 border-orange-600 py-1' : ''
              }`}
            >
              Golf
            </button>
          </nav>

          {/* Zone 3: Primary action button & utilities */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefreshData}
              title="Refresh API Data"
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-600' : ''}`} />
            </button>

            <button
              onClick={onOpenDeployGuide}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap shrink-0"
              title="Vercel & GitHub Deploy Guide"
            >
              <Github className="w-3.5 h-3.5 text-slate-900" />
              <span>Vercel Deploy</span>
            </button>

            <button
              onClick={onOpenCustomStream}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom M3U8</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

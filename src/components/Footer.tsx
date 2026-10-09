import React from 'react';
import { ExternalLink, Github, Radio } from 'lucide-react';

interface FooterProps {
  onSelectSport: (sport: string) => void;
  onOpenDeployGuide: () => void;
  lastUpdated?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectSport,
  onOpenDeployGuide,
  lastUpdated,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-lg">
              FC
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight uppercase">
                FanCode <span className="text-orange-600">Live</span>
              </span>
              <p className="text-xs text-slate-500">
                Live Sports Streaming & Realtime Matches Scorecard
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => onSelectSport('Cricket')}
              className="hover:text-orange-600 transition-colors"
            >
              Cricket Matches
            </button>
            <button
              onClick={() => onSelectSport('Football')}
              className="hover:text-orange-600 transition-colors"
            >
              Football
            </button>
            <button
              onClick={() => onSelectSport('Tennis')}
              className="hover:text-orange-600 transition-colors"
            >
              Tennis
            </button>
            <button
              onClick={() => onSelectSport('Golf')}
              className="hover:text-orange-600 transition-colors"
            >
              Golf
            </button>
            <button
              onClick={onOpenDeployGuide}
              className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 font-bold"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub & Vercel Guide
            </button>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Data sourced from{' '}
            <a
              href="https://raw.githubusercontent.com/Jitendra-unatti/fancode/refs/heads/main/data/fancode.json"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-orange-600 underline font-medium inline-flex items-center gap-0.5"
            >
              Jitendra-unatti/fancode <ExternalLink className="w-3 h-3" />
            </a>{' '}
            · Last sync: {lastUpdated || 'Live'}
          </div>

          <div>
            Built with React, Vite & Tailwind CSS · Ready for GitHub & Vercel
          </div>
        </div>
      </div>
    </footer>
  );
};

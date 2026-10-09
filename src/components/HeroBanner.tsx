import React from 'react';
import { Play, Radio, Calendar, Trophy, Layers } from 'lucide-react';
import { Match } from '../types/fancode';

interface HeroBannerProps {
  liveMatch: Match | undefined;
  totalMatches: number;
  liveCount: number;
  onWatchLive: (match: Match) => void;
  lastUpdated?: string;
  isLiveSource: boolean;
  activeSource: 'ALL' | 'FANCODE' | 'WILLOW';
  onSelectSource: (source: 'ALL' | 'FANCODE' | 'WILLOW') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  liveMatch,
  totalMatches,
  liveCount,
  onWatchLive,
  lastUpdated,
  isLiveSource,
  activeSource,
  onSelectSource,
}) => {
  return (
    <div className="relative bg-white border-b border-orange-100 overflow-hidden">
      {/* Background soft orange warmth */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50/70 via-orange-50/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                <Radio className="w-3.5 h-3.5 animate-pulse text-orange-600" />
                Live Sports Feeds
              </span>
              <span>·</span>
              <span>FanCode & Willow Integration</span>
              <span>·</span>
              <span className="text-slate-400">Sync: {lastUpdated || 'Realtime'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                Real-Time <span className="text-orange-600">Sports & Cricket</span> Live Match Portal
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                সরাসরি ফ্যানকোড এবং উইলো ইভেন্ট থেকে প্রাপ্ত লাইভ ম্যাচ, প্রকৃত রান ও বলের হিসাব এবং লাইভ স্ট্রিমিং লিঙ্ক।
              </p>
            </div>

            {/* Source Switcher Badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 mr-1">উৎস ফিল্টার:</span>
              <button
                onClick={() => onSelectSource('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSource === 'ALL'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সকল ম্যাচ ({totalMatches})
              </button>
              <button
                onClick={() => onSelectSource('FANCODE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSource === 'FANCODE'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                FanCode (40)
              </button>
              <button
                onClick={() => onSelectSource('WILLOW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSource === 'WILLOW'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Willow Events (20)
              </button>
            </div>

            {/* Quick Live Match Spotlight CTA if available */}
            {liveMatch && (
              <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200/80 hover:border-orange-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping inline-block" />
                      লাইভ সম্প্রচার
                      <span className="text-slate-400 font-normal">· {liveMatch.tournament}</span>
                    </div>
                    <div className="text-base font-bold text-slate-900">
                      {liveMatch.title}
                    </div>
                    {liveMatch.team?.[0]?.cricketScore?.[0] && (
                      <div className="text-xs text-slate-600 tabular-nums">
                        {liveMatch.team[0].shortName}: {liveMatch.team[0].cricketScore[0].runs}/{liveMatch.team[0].cricketScore[0].wickets} ({liveMatch.team[0].cricketScore[0].overs} ওভার, {liveMatch.team[0].cricketScore[0].balls} বল)
                        {liveMatch.team?.[1]?.cricketScore?.[0] && (
                          <span className="ml-2 font-medium text-slate-800">
                            বনাম {liveMatch.team[1].shortName}: {liveMatch.team[1].cricketScore[0].runs}/{liveMatch.team[1].cricketScore[0].wickets} ({liveMatch.team[1].cricketScore[0].overs} ওভার, {liveMatch.team[1].cricketScore[0].balls} বল)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onWatchLive(liveMatch)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white font-bold text-sm shadow-md hover:bg-orange-700 active:scale-95 transition-all whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    ম্যাচ দেখুন
                  </button>
                </div>
              </div>
            )}

            {/* Key Real Platform Stats */}
            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-100 max-w-lg">
              <div>
                <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
                  {totalMatches}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  সর্বমোট ম্যাচ
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-orange-600 font-display tabular-nums">
                  {liveCount}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  লাইভ ম্যাচ
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-slate-900 font-display tabular-nums">
                  ২ টি API
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  FanCode + Willow
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Requested Official FanCode Hero Image & Card Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-none group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-orange-200/60 bg-white">
                <img
                  src="https://www.fancode.com/skillup-uploads/fc-web/home-page-new-arc/hero-image/v1/hero-image-dweb-v4.png"
                  alt="FanCode Official Sports Broadcast Banner"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.fancode.com/aig/match/v1/141449_CASACARDS_PARTNER_16_9_1920_1080.png';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-orange-400">
                      Official FanCode Live Hub
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      Seamless Streaming & Live Scores
                    </h3>
                  </div>
                </div>
              </div>

              {/* Source Verification Tag */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>উৎস: FanCode & Willow Sports</span>
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  {isLiveSource ? 'Realtime GitHub APIs' : 'Local Bundled Data'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

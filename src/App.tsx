import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { LivePlayer } from './components/LivePlayer';
import { Scorecard } from './components/Scorecard';
import { MatchTabs } from './components/MatchTabs';
import { MatchCard } from './components/MatchCard';
import { CustomStreamModal } from './components/CustomStreamModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { Footer } from './components/Footer';
import { fetchFanCodeData, fetchWillowData, convertWillowMatch } from './services/api';
import { Match, FanCodeApiResponse, WillowApiResponse } from './types/fancode';
import { Search, Trophy, Layers } from 'lucide-react';

export default function App() {
  const [fancodeData, setFancodeData] = useState<FanCodeApiResponse | null>(null);
  const [willowData, setWillowData] = useState<WillowApiResponse | null>(null);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [isLiveSource, setIsLiveSource] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [activeSource, setActiveSource] = useState<'ALL' | 'FANCODE' | 'WILLOW'>('ALL');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Streaming Match
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Player State
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);

  // Load data on startup
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fcRes, wilRes] = await Promise.allSettled([
        fetchFanCodeData(),
        fetchWillowData(),
      ]);

      const merged: Match[] = [];
      let isFcLive = false;
      let isWilLive = false;

      if (fcRes.status === 'fulfilled') {
        setFancodeData(fcRes.value.data);
        isFcLive = fcRes.value.isLiveSource;
        if (fcRes.value.data.matches) {
          merged.push(...fcRes.value.data.matches);
        }
      }

      if (wilRes.status === 'fulfilled') {
        setWillowData(wilRes.value.data);
        isWilLive = wilRes.value.isLiveSource;
        if (wilRes.value.data.Matches) {
          const converted = wilRes.value.data.Matches.map(convertWillowMatch);
          merged.push(...converted);
        }
      }

      setAllMatches(merged);
      setIsLiveSource(isFcLive || isWilLive);

      // Default selected match: pick first LIVE match if available
      if (merged.length > 0) {
        const live = merged.find((m) => m.status === 'LIVE');
        setSelectedMatch(live || merged[0]);
      }
    } catch (err: any) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return allMatches.filter((m) => {
      // Source filter
      if (activeSource === 'FANCODE' && m.source !== 'fancode') return false;
      if (activeSource === 'WILLOW' && m.source !== 'willow') return false;

      // Category filter
      if (selectedSport !== 'All' && m.category.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'LIVE' && m.status !== 'LIVE') return false;
      if (selectedStatus === 'UPCOMING' && m.status !== 'NOT_STARTED' && m.status !== 'UPCOMING') return false;
      if (selectedStatus === 'COMPLETED' && m.status !== 'COMPLETED') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = m.title.toLowerCase().includes(q);
        const tourMatch = m.tournament.toLowerCase().includes(q);
        const teamMatch = m.team?.some(
          (t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q)
        );
        if (!titleMatch && !tourMatch && !teamMatch) return false;
      }

      return true;
    });
  }, [allMatches, activeSource, selectedSport, selectedStatus, searchQuery]);

  // Statistics
  const liveMatches = useMemo(() => {
    return allMatches.filter((m) => m.status === 'LIVE');
  }, [allMatches]);

  const sportsCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allMatches.length };
    allMatches.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [allMatches]);

  // Scroll to player smoothly when a card is selected
  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    const playerEl = document.getElementById('live-broadcast-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Custom stream playback handler
  const handlePlayCustomUrl = (url: string, label: string) => {
    if (!selectedMatch) return;
    const modifiedMatch: Match = {
      ...selectedMatch,
      title: `${label} (Custom M3U8)`,
      STREAMING_CDN: {
        ...selectedMatch.STREAMING_CDN,
        Primary_Playback_URL: url,
        fancode_cdn: url,
      },
      stream_url_alpha: url,
    };
    setSelectedMatch(modifiedMatch);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header with FanCode orange identity */}
      <Header
        activeSport={selectedSport}
        onSelectSport={(sport) => {
          setSelectedSport(sport);
          setSearchQuery('');
        }}
        activeSource={activeSource}
        onSelectSource={setActiveSource}
        onOpenCustomStream={() => setIsCustomModalOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onRefreshData={loadData}
        isLoading={isLoading}
        totalMatchesCount={allMatches.length}
      />

      {/* 2. Hero Banner with Official FanCode Asset */}
      <HeroBanner
        liveMatch={liveMatches[0]}
        totalMatches={allMatches.length}
        liveCount={liveMatches.length}
        onWatchLive={handleSelectMatch}
        lastUpdated={fancodeData?.last_updated || willowData?.HeaderInfo?.LastUpdate}
        isLiveSource={isLiveSource}
        activeSource={activeSource}
        onSelectSource={setActiveSource}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        
        {/* 3. Featured Broadcast & Live Video Section */}
        {selectedMatch && (
          <section id="live-broadcast-player" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
                  <span className="text-orange-600 font-bold uppercase tracking-wider">
                    {selectedMatch.source === 'willow' ? 'Willow Event' : 'FanCode'} · {selectedMatch.category}
                  </span>
                  <span>·</span>
                  <span>ID #{selectedMatch.match_id}</span>
                  {selectedMatch.status === 'LIVE' && (
                    <>
                      <span>·</span>
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        Live Now
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                  {selectedMatch.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {selectedMatch.tournament}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    isTheaterMode
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isTheaterMode ? 'Exit Cinema' : 'Cinema Mode'}</span>
                </button>
              </div>
            </div>

            {/* Video Player & Adjacent Scorecard */}
            <div className={`grid gap-6 ${isTheaterMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
              {/* Player Container */}
              <div className={isTheaterMode ? 'w-full' : 'lg:col-span-8'}>
                <LivePlayer
                  match={selectedMatch}
                  isTheaterMode={isTheaterMode}
                  onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                  onOpenCustomModal={() => setIsCustomModalOpen(true)}
                />
              </div>

              {/* Side Scorecard & Real Match Status */}
              <div className={isTheaterMode ? 'w-full' : 'lg:col-span-4'}>
                <Scorecard match={selectedMatch} />
              </div>
            </div>

            {/* Raw JSON, Balls Count & Stream Inspector */}
            <div className="pt-2">
              <MatchTabs
                match={selectedMatch}
                onSelectStreamUrl={(url, label) => {
                  setSelectedMatch({
                    ...selectedMatch,
                    STREAMING_CDN: {
                      ...selectedMatch.STREAMING_CDN,
                      Primary_Playback_URL: url,
                    },
                    stream_url_alpha: url,
                  });
                }}
              />
            </div>
          </section>
        )}

        {/* 4. Match Discovery, Filters & Search Section */}
        <section className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                ম্যাচ তালিকা ও সময়সূচী (Match Schedule)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                FanCode (৪০টি ম্যাচ) এবং Willow Events (২০টি ম্যাচ) থেকে সংগৃহীত মোট {allMatches.length}টি স্পোর্টস ইভেন্ট
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ম্যাচ বা টুর্নামেন্ট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
              />
            </div>
          </div>

          {/* Interactive Sport & Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Sport Categories */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
              {['All', 'Cricket', 'Football', 'Tennis', 'Golf'].map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedSport.toLowerCase() === sport.toLowerCase()
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {sport} {sportsCounts[sport] !== undefined && `(${sportsCounts[sport]})`}
                </button>
              ))}
            </div>

            {/* Source and Status filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs text-xs">
                <button
                  onClick={() => setSelectedStatus('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedStatus === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({allMatches.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('LIVE')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    selectedStatus === 'LIVE'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live ({liveMatches.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('UPCOMING')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedStatus === 'UPCOMING'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upcoming
                </button>
              </div>
            </div>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMatches.map((m) => (
                <MatchCard
                  key={`${m.source}-${m.match_id}`}
                  match={m}
                  isSelected={selectedMatch?.match_id === m.match_id && selectedMatch?.source === m.source}
                  onSelect={handleSelectMatch}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">কোনো ম্যাচ পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                আপনার দেওয়া ফিল্টারে কোনো ম্যাচ মেলেনি। ফিল্টার রিসেট করতে নিচের বাটনে ক্লিক করুন।
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSport('All');
                  setSelectedStatus('ALL');
                  setActiveSource('ALL');
                }}
                className="px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
              >
                রিসেট ফিল্টার
              </button>
            </div>
          )}
        </section>

      </main>

      {/* 5. Clean Footer */}
      <Footer
        onSelectSport={(sport) => {
          setSelectedSport(sport);
          setSearchQuery('');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        lastUpdated={fancodeData?.last_updated || willowData?.HeaderInfo?.LastUpdate}
      />

      {/* Custom Stream URL Modal */}
      <CustomStreamModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onPlayUrl={handlePlayCustomUrl}
      />

      {/* Vercel & GitHub Deployment Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}

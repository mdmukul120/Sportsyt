import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Tv,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Radio,
} from 'lucide-react';
import { Match, StreamResolutionOption } from '../types/fancode';
import { extractResolutionsFromAutoStream } from '../services/api';

interface LivePlayerProps {
  match: Match;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  onOpenCustomModal: () => void;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  match,
  isTheaterMode,
  onToggleTheater,
  onOpenCustomModal,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOverlayScore, setShowOverlayScore] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  // Available stream choices directly from the JSON
  const primaryUrl = match.STREAMING_CDN?.Primary_Playback_URL || match.STREAMING_CDN?.fancode_cdn || '';
  const bdUrl = match.STREAMING_CDN?.fancode_bd_cdn || '';
  const autoPlaylist = match.auto_streams?.[0]?.auto || '';
  const parsedResolutions: StreamResolutionOption[] = extractResolutionsFromAutoStream(autoPlaylist);

  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(primaryUrl);
  const [streamSourceLabel, setStreamSourceLabel] = useState<string>(
    primaryUrl ? 'FanCode Primary HLS' : 'No Stream URL in API'
  );

  const controlsTimeoutRef = useRef<number | null>(null);

  // Load new stream when match changes
  useEffect(() => {
    const newPrimary =
      match.STREAMING_CDN?.Primary_Playback_URL ||
      match.STREAMING_CDN?.fancode_cdn ||
      match.stream_url_alpha ||
      '';

    setCurrentStreamUrl(newPrimary);
    if (newPrimary) {
      setStreamSourceLabel(match.source === 'willow' ? 'Willow Live Stream' : 'FanCode Master HLS');
      setErrorMessage(null);
    } else {
      setStreamSourceLabel('No Live Stream Link in API');
      setErrorMessage(
        match.source === 'willow'
          ? 'এই ম্যাচের জন্য সরাসরি স্ট্রিম ইউআরএল API তে দেওয়া হয়নি (অফিসিয়াল ব্রডকাস্টার আমাজন প্রাইম/উইলো)।'
          : 'এই ম্যাচের স্ট্রিম লিঙ্ক এখনও শুরু হয়নি।'
      );
    }
  }, [match.match_id, match.source]);

  // Load and play HLS stream
  const loadStream = useCallback((url: string) => {
    const video = videoRef.current;
    if (!video) return;

    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('HLS error:', data.type, data.details);
          setIsLoading(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage(
                'স্ট্রিমটি লোড করা যায়নি (CDN Token Expired or CORS Policy)। আপনার কাছে লাইভ লিঙ্ক থাকলে "Custom M3U8" দিন।'
              );
              hls.destroy();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS support
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setErrorMessage('ভিডিও প্লেয়ারে স্ট্রিম এরর ঘটেছে।');
        setIsLoading(false);
      });
    } else {
      setErrorMessage('আপনার ব্রাউজারে HLS স্ট্রিমিং সাপোর্ট নেই।');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentStreamUrl) {
      loadStream(currentStreamUrl);
    } else {
      setIsLoading(false);
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentStreamUrl, loadStream]);

  // Video event handlers
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      video.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error', e);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
      }
    }, 3500);
  };

  const team1 = match.team?.[0];
  const team2 = match.team?.[1];
  const score1 = team1?.cricketScore?.[0];
  const score2 = team2?.cricketScore?.[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl select-none group transition-all duration-300 ${
        isTheaterMode ? 'aspect-[21/9] max-h-[82vh]' : 'aspect-video'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handlePlayPause}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] pointer-events-none z-10">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-xs font-bold mt-3 tracking-wider uppercase">
            Loading Stream...
          </span>
        </div>
      )}

      {/* Real Status / Technical Error Notice */}
      {errorMessage && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-slate-900/90 text-slate-200 border border-slate-700 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {match.match_url && (
              <a
                href={match.match_url}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold inline-flex items-center gap-1"
              >
                <span>অফিসিয়াল পেজ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onOpenCustomModal}
              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-[11px]"
            >
              Custom M3U8 দিন
            </button>
          </div>
        </div>
      )}

      {/* Floating Real Cricket Scorecard Overlay directly from JSON */}
      {showOverlayScore && (score1 || score2) && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block">
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-white shadow-xl min-w-[210px]">
            <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-orange-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Broadcast
              </span>
              <span className="truncate max-w-[100px]">{match.tournament}</span>
            </div>

            <div className="space-y-1 text-xs">
              {team1 && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {team1.flag?.src && (
                      <img
                        src={team1.flag.src}
                        alt={team1.shortName}
                        className="w-4 h-3 object-cover rounded-xs"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="font-bold text-white">{team1.shortName}</span>
                    {team1.status?.cricket?.isBatting && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <div className="font-extrabold text-white tabular-nums">
                    {score1 ? `${score1.runs}/${score1.wickets} (${score1.overs} ov)` : '-'}
                  </div>
                </div>
              )}

              {team2 && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {team2.flag?.src && (
                      <img
                        src={team2.flag.src}
                        alt={team2.shortName}
                        className="w-4 h-3 object-cover rounded-xs"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="font-bold text-slate-300">{team2.shortName}</span>
                    {team2.status?.cricket?.isBatting && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <div className="font-extrabold text-white tabular-nums">
                    {score2 ? `${score2.runs}/${score2.wickets} (${score2.overs} ov)` : 'Yet to Bat'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stream Source Label */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          {streamSourceLabel}
        </span>
      </div>

      {/* Center Big Play Button if paused */}
      {!isPlaying && !isLoading && currentStreamUrl && (
        <div
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center pl-1 shadow-2xl hover:scale-110 hover:bg-orange-600 transition-all">
            <Play className="w-8 h-8 fill-white" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left: Play/Pause, Live status, Mute/Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="p-1.5 hover:text-orange-400 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-black uppercase tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </div>

            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-orange-400 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-orange-500 bg-slate-700 rounded-lg cursor-pointer hidden sm:block"
              />
            </div>

            <span className="hidden md:inline-block text-xs text-slate-300 font-medium truncate max-w-[200px]">
              {match.title}
            </span>
          </div>

          {/* Right: Score toggle, Quality & Source Switcher, Theater, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Scorecard Overlay Toggle */}
            {(score1 || score2) && (
              <button
                onClick={() => setShowOverlayScore(!showOverlayScore)}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors text-xs font-semibold ${
                  showOverlayScore ? 'text-orange-400' : 'text-slate-400'
                }`}
                title="Toggle Score Overlay"
              >
                Score
              </button>
            )}

            {/* Stream Settings / Source Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-semibold ${
                  showSettingsMenu ? 'text-orange-400 bg-white/10' : 'text-slate-200'
                }`}
                title="Stream Settings"
              >
                <Settings className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-2 z-40 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                    Real Stream Endpoints (API)
                  </div>

                  <div className="py-1 space-y-0.5">
                    {primaryUrl && (
                      <button
                        onClick={() => {
                          setCurrentStreamUrl(primaryUrl);
                          setStreamSourceLabel('Primary Playback URL');
                          setShowSettingsMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                          currentStreamUrl === primaryUrl
                            ? 'bg-orange-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>Master Playback URL</span>
                        <span className="text-[10px] opacity-80">HLS</span>
                      </button>
                    )}

                    {bdUrl && bdUrl !== primaryUrl && (
                      <button
                        onClick={() => {
                          setCurrentStreamUrl(bdUrl);
                          setStreamSourceLabel('FanCode BD Server');
                          setShowSettingsMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                          currentStreamUrl === bdUrl
                            ? 'bg-orange-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>FanCode BD Server</span>
                        <span className="text-[10px] opacity-80">Alternate</span>
                      </button>
                    )}

                    {/* Auto stream resolutions parsed from auto_streams */}
                    {parsedResolutions.map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentStreamUrl(res.url);
                          setStreamSourceLabel(res.label);
                          setShowSettingsMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                          currentStreamUrl === res.url
                            ? 'bg-orange-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{res.label}</span>
                        <span className="text-[10px] opacity-80">API</span>
                      </button>
                    ))}

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onOpenCustomModal();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-orange-400 hover:bg-orange-500/10 font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      কাস্টম M3U8 লিঙ্ক দিন
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PiP button */}
            <button
              onClick={togglePiP}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              title="Picture in Picture"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={onToggleTheater}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                isTheaterMode ? 'text-orange-400 bg-white/10' : 'text-slate-300 hover:text-white'
              }`}
              title={isTheaterMode ? 'Exit Cinema' : 'Cinema Mode'}
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

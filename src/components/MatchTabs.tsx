import React, { useState } from 'react';
import { Match, StreamResolutionOption } from '../types/fancode';
import { extractResolutionsFromAutoStream } from '../services/api';
import { Database, Code, Copy, Check, ExternalLink, Radio, ShieldCheck } from 'lucide-react';

interface MatchTabsProps {
  match: Match;
  onSelectStreamUrl: (url: string, label: string) => void;
}

export const MatchTabs: React.FC<MatchTabsProps> = ({ match, onSelectStreamUrl }) => {
  const [activeTab, setActiveTab] = useState<'score_data' | 'cdn' | 'info' | 'raw_json'>('score_data');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const team1 = match.team?.[0];
  const team2 = match.team?.[1];
  const score1 = team1?.cricketScore?.[0];
  const score2 = team2?.cricketScore?.[0];

  const autoPlaylist = match.auto_streams?.[0]?.auto || '';
  const parsedResolutions: StreamResolutionOption[] = extractResolutionsFromAutoStream(autoPlaylist);
  const primaryUrl = match.STREAMING_CDN?.Primary_Playback_URL || match.STREAMING_CDN?.fancode_cdn || match.stream_url_alpha;
  const bdUrl = match.STREAMING_CDN?.fancode_bd_cdn;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tabs navigation bar */}
      <div className="flex items-center gap-1 p-1.5 bg-slate-100 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('score_data')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'score_data'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          রিয়েল স্কোর ও বল বিশ্লেষণ
        </button>

        <button
          onClick={() => setActiveTab('cdn')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'cdn'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          CDN ও স্ট্রিম লিঙ্ক ({parsedResolutions.length > 0 ? parsedResolutions.length : (primaryUrl ? 1 : 0)})
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'info'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          ম্যাচ ইনফরমেশন
        </button>

        <button
          onClick={() => setActiveTab('raw_json')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'raw_json'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          API Raw JSON (প্রমাণ)
        </button>
      </div>

      {/* Tab 1: Real Score & Ball Analysis */}
      {activeTab === 'score_data' && (
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
            <div>
              <h4 className="font-bold text-slate-900">
                API থেকে প্রাপ্ত প্রকৃত স্কোর ও বলের হিসাব
              </h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                কোনো ডেমো বা কাল্পনিক ডেটা নেই — সরাসরি API পে-লোড থেকে প্রদর্শিত
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              উৎস: {match.source === 'willow' ? 'Willow Live Sports JSON' : 'FanCode Live API'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team 1 Score Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">{team1?.name}</span>
                <span className="font-mono text-xs font-semibold text-slate-600">{team1?.shortName}</span>
              </div>

              {score1 ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">মোট রান (Runs)</span>
                    <strong className="text-slate-900 text-base font-display">{score1.runs}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">উইকেট (Wickets)</span>
                    <strong className="text-slate-900 text-base font-display">{score1.wickets}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ওভার (Overs)</span>
                    <strong className="text-slate-900 text-base font-display">{score1.overs}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">বল সংখ্যা (Balls)</span>
                    <strong className="text-orange-600 text-base font-display">{score1.balls ?? 'N/A'}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">
                  এই দলের জন্য API তে কোনো cricketScore অবজেক্ট নেই
                </div>
              )}
            </div>

            {/* Team 2 Score Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">{team2?.name}</span>
                <span className="font-mono text-xs font-semibold text-slate-600">{team2?.shortName}</span>
              </div>

              {score2 ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">মোট রান (Runs)</span>
                    <strong className="text-slate-900 text-base font-display">{score2.runs}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">উইকেট (Wickets)</span>
                    <strong className="text-slate-900 text-base font-display">{score2.wickets}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ওভার (Overs)</span>
                    <strong className="text-slate-900 text-base font-display">{score2.overs}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">বল সংখ্যা (Balls)</span>
                    <strong className="text-orange-600 text-base font-display">{score2.balls ?? 'N/A'}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">
                  এই দলের জন্য API তে কোনো cricketScore অবজেক্ট নেই
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CDN Streaming Links */}
      {activeTab === 'cdn' && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900">API তে থাকা স্ট্রিমিং লিঙ্ক</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                সরাসরি STREAMING_CDN এবং auto_streams থেকে এক্সট্র্যাক্ট করা লিঙ্ক
              </p>
            </div>
            {match.auto_streams?.[0]?.expire_date && (
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                টোকেন মেয়াদ: {match.auto_streams[0].expire_date}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {primaryUrl ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Primary Playback URL (Master HLS)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectStreamUrl(primaryUrl, 'Primary HLS')}
                      className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px]"
                    >
                      প্লে করুন
                    </button>
                    <button
                      onClick={() => copyToClipboard(primaryUrl, 100)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                      title="Copy URL"
                    >
                      {copiedIndex === 100 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-200 text-[11px] font-mono break-all select-all">
                  {primaryUrl}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                এই ম্যাচের জন্য API তে সরাসরি কোনো লাইভ স্ট্রিমিং ইউআরএল দেওয়া নেই।
              </div>
            )}

            {bdUrl && bdUrl !== primaryUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">FanCode BD Server (Regional CDN)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectStreamUrl(bdUrl, 'FanCode BD CDN')}
                      className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px]"
                    >
                      প্লে করুন
                    </button>
                    <button
                      onClick={() => copyToClipboard(bdUrl, 101)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                    >
                      {copiedIndex === 101 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-200 text-[11px] font-mono break-all select-all">
                  {bdUrl}
                </div>
              </div>
            )}

            {/* Individual Resolution Streams from auto_streams */}
            {parsedResolutions.length > 0 && (
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-slate-800">
                  স্বতন্ত্র রেজোলিউশন লিঙ্ক (auto_streams থেকে পার্স করা)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedResolutions.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{res.label}</span>
                        {res.bandwidth && (
                          <div className="text-[10px] text-slate-500 tabular-nums">
                            Bitrate: {Math.round(res.bandwidth / 1000)} kbps
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectStreamUrl(res.url, res.label)}
                          className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px]"
                        >
                          প্লে
                        </button>
                        <button
                          onClick={() => copyToClipboard(res.url, idx)}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Match Info */}
      {activeTab === 'info' && (
        <div className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">টুর্নামেন্ট / সিরিজ</span>
              <p className="font-bold text-slate-900 text-sm">{match.tournament}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">ম্যাচ আইডি (Match ID)</span>
              <p className="font-bold text-slate-900 text-sm">{match.match_id}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">নির্ধারিত সময় (Scheduled Time)</span>
              <p className="font-bold text-slate-900 text-sm">{match.startTime}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">উৎস API</span>
              <p className="font-bold text-slate-900 text-sm uppercase">
                {match.source === 'willow' ? 'Willow Events' : 'FanCode Live'}
              </p>
            </div>
            {match.match_url && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                <span className="text-slate-500 font-medium">অফিসিয়াল ব্রডকাস্ট লিঙ্ক</span>
                <p>
                  <a
                    href={match.match_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 font-semibold underline inline-flex items-center gap-1 break-all"
                  >
                    <span>{match.match_url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Raw JSON Proof */}
      {activeTab === 'raw_json' && (
        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-bold text-slate-800">
              API থেকে সরাসরি আসা অবজেক্ট (Raw JSON View):
            </span>
            <button
              onClick={() => copyToClipboard(JSON.stringify(match, null, 2), 999)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1"
            >
              {copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy JSON</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] max-h-72 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(match, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Match } from '../types/fancode';
import { Clock, Calendar, Database, Activity } from 'lucide-react';

interface ScorecardProps {
  match: Match;
}

export const Scorecard: React.FC<ScorecardProps> = ({ match }) => {
  const team1 = match.team?.[0];
  const team2 = match.team?.[1];

  const score1 = team1?.cricketScore?.[0];
  const score2 = team2?.cricketScore?.[0];

  const isCricket = match.category === 'Cricket';
  const isLive = match.status === 'LIVE';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="font-bold text-orange-600 uppercase tracking-wider">
            {match.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate max-w-[200px] sm:max-w-[280px] text-slate-700 font-semibold">
            {match.tournament}
          </span>
          <span aria-hidden="true">·</span>
          <span>ID #{match.match_id}</span>
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {match.status}
            </span>
          )}
        </div>
      </div>

      {/* Main Teams Matchup Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Team 1 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            team1?.status?.cricket?.isBatting && isLive
              ? 'bg-orange-50/60 border-orange-200'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {team1?.flag?.src ? (
                <img
                  src={team1.flag.src}
                  alt={team1.name}
                  className="w-10 h-7 object-cover rounded shadow-xs border border-slate-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-10 h-7 rounded flex items-center justify-center font-bold text-xs text-white uppercase shadow-xs"
                  style={{ backgroundColor: team1?.color || '#ea580c' }}
                >
                  {team1?.shortName?.slice(0, 3) || 'T1'}
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                  {team1?.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="font-semibold text-slate-700">{team1?.shortName}</span>
                  {team1?.status?.cricket?.isBatting && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-orange-600 font-bold">Batting Now</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Real Score 1 from JSON */}
            <div className="text-right">
              {score1 ? (
                <div>
                  <div className="text-2xl font-black text-slate-900 font-display tabular-nums leading-none">
                    {score1.runs}
                    <span className="text-slate-400 font-normal text-lg">/{score1.wickets}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium tabular-nums mt-1">
                    {score1.overs} Overs
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No score data in API</span>
              )}
            </div>
          </div>

          {/* Exact Real Balls & Status from JSON */}
          {score1 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 tabular-nums">
              <span>বল (Balls): <strong className="text-slate-900 font-bold">{score1.balls ?? 'N/A'}</strong></span>
              <span>স্ট্যাটাস: <strong className="text-slate-800">{score1.status || 'Active'}</strong></span>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            team2?.status?.cricket?.isBatting && isLive
              ? 'bg-orange-50/60 border-orange-200'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {team2?.flag?.src ? (
                <img
                  src={team2.flag.src}
                  alt={team2.name}
                  className="w-10 h-7 object-cover rounded shadow-xs border border-slate-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-10 h-7 rounded flex items-center justify-center font-bold text-xs text-white uppercase shadow-xs"
                  style={{ backgroundColor: team2?.color || '#3b82f6' }}
                >
                  {team2?.shortName?.slice(0, 3) || 'T2'}
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                  {team2?.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="font-semibold text-slate-700">{team2?.shortName}</span>
                  {team2?.status?.cricket?.isBatting && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-orange-600 font-bold">Batting Now</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Real Score 2 from JSON */}
            <div className="text-right">
              {score2 ? (
                <div>
                  <div className="text-2xl font-black text-slate-900 font-display tabular-nums leading-none">
                    {score2.runs}
                    <span className="text-slate-400 font-normal text-lg">/{score2.wickets}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium tabular-nums mt-1">
                    {score2.overs} Overs
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No score data in API</span>
              )}
            </div>
          </div>

          {/* Exact Real Balls & Status from JSON */}
          {score2 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 tabular-nums">
              <span>বল (Balls): <strong className="text-slate-900 font-bold">{score2.balls ?? 'N/A'}</strong></span>
              <span>স্ট্যাটাস: <strong className="text-slate-800">{score2.status || 'Active'}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Target & Real Score Explanation */}
      {isCricket && score1 && score2 && (
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-bold text-orange-950">
            {team2?.name} needs {Math.max(0, (score1.runs || 0) + 1 - (score2.runs || 0))} runs to win
          </div>
          <div className="flex items-center gap-4 text-slate-700 font-semibold tabular-nums">
            <span>লক্ষ্য (Target): <strong className="text-orange-700">{(score1.runs || 0) + 1}</strong></span>
            <span>খেলা বল: <strong className="text-slate-900">{score2.balls} টি বল</strong></span>
          </div>
        </div>
      )}

      {/* Real Source Attribution Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>উৎস: <strong className="text-slate-700 font-medium">{match.source === 'willow' ? 'Willow Sports API' : 'FanCode API cricketScore'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>সময়: <strong className="text-slate-700 font-medium">{match.startTime}</strong></span>
        </div>
      </div>
    </div>
  );
};

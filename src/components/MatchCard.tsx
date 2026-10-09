import React from 'react';
import { Match } from '../types/fancode';
import { Play, Clock, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  isSelected: boolean;
  onSelect: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isSelected, onSelect }) => {
  const isLive = match.status === 'LIVE';
  const team1 = match.team?.[0];
  const team2 = match.team?.[1];
  const score1 = team1?.cricketScore?.[0];
  const score2 = team2?.cricketScore?.[0];

  const cardImage =
    match.image ||
    match.image_cdn?.TATAPLAY ||
    match.image_cdn?.CLOUDFARE ||
    match.image_cdn?.APP;

  return (
    <div
      onClick={() => onSelect(match)}
      className={`group cursor-pointer rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col hover:shadow-md ${
        isSelected
          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
          : 'border-slate-200 hover:border-orange-300'
      }`}
    >
      {/* Top Banner / Image Area */}
      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
        {cardImage ? (
          <img
            src={cardImage}
            alt={match.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 flex items-center justify-center p-4">
            <Trophy className="w-12 h-12 text-orange-400/40" />
          </div>
        )}

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Status indicator top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3 text-slate-300" />
              {match.status}
            </span>
          )}

          <span className="bg-black/60 backdrop-blur-md text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded">
            {match.source === 'willow' ? 'Willow' : 'FanCode'}
          </span>
        </div>

        {/* Play Icon hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center pl-0.5 shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Bottom image text kicker */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <p className="text-[11px] font-medium text-slate-300 truncate">
            {match.tournament}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {match.title}
          </h3>

          {/* Teams and scores row */}
          <div className="mt-2.5 space-y-1.5">
            {/* Team 1 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                {team1?.flag?.src && (
                  <img
                    src={team1.flag.src}
                    alt={team1.shortName}
                    className="w-4 h-3 object-cover rounded-xs border border-slate-200"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-bold text-slate-800 truncate">
                  {team1?.name || 'Team 1'}
                </span>
                {team1?.status?.cricket?.isBatting && isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
                )}
              </div>
              <div className="font-black text-slate-900 tabular-nums shrink-0">
                {score1 ? (
                  <span>
                    {score1.runs}/{score1.wickets}
                    {score1.balls && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({score1.balls}b)
                      </span>
                    )}
                  </span>
                ) : (
                  '-'
                )}
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                {team2?.flag?.src && (
                  <img
                    src={team2.flag.src}
                    alt={team2.shortName}
                    className="w-4 h-3 object-cover rounded-xs border border-slate-200"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-bold text-slate-800 truncate">
                  {team2?.name || 'Team 2'}
                </span>
                {team2?.status?.cricket?.isBatting && isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
                )}
              </div>
              <div className="font-black text-slate-900 tabular-nums shrink-0">
                {score2 ? (
                  <span>
                    {score2.runs}/{score2.wickets}
                    {score2.balls && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({score2.balls}b)
                      </span>
                    )}
                  </span>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[170px]">{match.startTime}</span>
          <span className="font-bold text-orange-600 group-hover:underline">
            {isLive ? 'Watch Live →' : 'Details →'}
          </span>
        </div>
      </div>
    </div>
  );
};

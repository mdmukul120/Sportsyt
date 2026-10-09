export interface TeamScore {
  runs?: number;
  overs?: string | number;
  balls?: string | number;
  status?: string;
  wickets?: number;
}

export interface Team {
  name: string;
  shortName: string;
  flag?: {
    src?: string;
  };
  isWinner?: boolean | null;
  color?: string;
  cricketScore?: TeamScore[] | null;
  footballScore?: any;
  basketBallScore?: any;
  hockeyScore?: any;
  kabaddiScore?: any;
  status?: {
    cricket?: {
      isBatting?: boolean;
    };
  };
}

export interface StreamingCDN {
  Primary_Playback_URL?: string | null;
  fancode_cdn?: string | null;
  fancode_bd_cdn?: string | null;
  dai_google_cdn?: string | null;
  cloudfront_cdn?: string | null;
  sony_cdn?: string | null;
  language?: string;
}

export interface AutoStream {
  auto?: string;
  cookie?: string;
  cookie_valid?: string;
  expire_date?: string;
  create_date?: string;
  language?: string;
}

export interface ImageCDN {
  TATAPLAY?: string;
  APP?: string;
  PLAYBACK?: string;
  LOGO?: string;
  SPORTS?: string;
  BG_IMAGE?: string;
  SPORT_BY_IMAGE?: string;
  CLOUDFARE?: string;
}

export interface Match {
  source?: 'fancode' | 'willow';
  category: 'Cricket' | 'Football' | 'Tennis' | 'Golf' | string;
  title: string;
  tournament: string;
  match_id: number | string;
  status: 'LIVE' | 'NOT_STARTED' | 'UPCOMING' | 'COMPLETED' | string;
  streamingStatus?: 'STARTED' | 'NOT_STARTED' | string;
  startTime: string;
  startDate?: string;
  image?: string;
  image_cdn?: ImageCDN;
  team: Team[];
  language?: string;
  STREAMING_CDN?: StreamingCDN;
  auto_streams?: AutoStream[] | null;
  // Willow specific
  synopsis?: string;
  match_url?: string;
  is_free?: boolean;
  stream_url_alpha?: string;
  drm_key?: string;
}

export interface StreamResolutionOption {
  label: string;
  resolution: string;
  bandwidth?: number;
  url: string;
}

export interface FanCodeApiResponse {
  Author: string;
  name: string;
  last_updated: string;
  headers?: Record<string, string>;
  total_matches: number;
  live_matches: number;
  upcoming_matches: number;
  matches: Match[];
}

export interface WillowApiResponse {
  HeaderInfo: {
    PlaylistName: string;
    LastUpdate: string;
    Telegram: string;
    Owner: string;
  };
  Stats: {
    LiveCount: number;
    UpcomingCount: number;
  };
  Matches: {
    match_id: string;
    title: string;
    synopsis: string;
    status: 'LIVE' | 'UPCOMING' | string;
    time: string;
    cover_image: string;
    match_url: string;
    is_free: boolean;
    stream_url_alpha: string;
    drm_key: string;
  }[];
}

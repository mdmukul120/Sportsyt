import { FanCodeApiResponse, WillowApiResponse, Match, StreamResolutionOption } from '../types/fancode';
import fancodeFallback from '../fancode_data.json';
import willowFallback from '../willow_data.json';

const FANCODE_API_URL = 'https://raw.githubusercontent.com/Jitendra-unatti/fancode/refs/heads/main/data/fancode.json';
const WILLOW_API_URL = 'https://raw.githubusercontent.com/srhady/willow-event/refs/heads/main/live_sports.json';

export async function fetchFanCodeData(): Promise<{ data: FanCodeApiResponse; isLiveSource: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(FANCODE_API_URL, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache',
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = (await response.json()) as FanCodeApiResponse;
    if (json && Array.isArray(json.matches)) {
      // Mark source
      json.matches.forEach((m) => {
        m.source = 'fancode';
      });
      return { data: json, isLiveSource: true };
    }
    throw new Error('Invalid FanCode structure');
  } catch (err) {
    console.warn('Falling back to local FanCode file:', err);
    const fb = fancodeFallback as unknown as FanCodeApiResponse;
    fb.matches.forEach((m) => {
      m.source = 'fancode';
    });
    return { data: fb, isLiveSource: false };
  }
}

export async function fetchWillowData(): Promise<{ data: WillowApiResponse; isLiveSource: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(WILLOW_API_URL, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache',
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = (await response.json()) as WillowApiResponse;
    if (json && Array.isArray(json.Matches)) {
      return { data: json, isLiveSource: true };
    }
    throw new Error('Invalid Willow structure');
  } catch (err) {
    console.warn('Falling back to local Willow file:', err);
    return { data: willowFallback as unknown as WillowApiResponse, isLiveSource: false };
  }
}

/**
 * Convert Willow match format to unified Match format
 */
export function convertWillowMatch(w: WillowApiResponse['Matches'][0]): Match {
  // Try extracting team names from title e.g. "Australia Champions vs Pakistan Champions"
  let team1Name = 'Team 1';
  let team2Name = 'Team 2';

  const vsIndex = w.title.lastIndexOf(' - ');
  const matchupPart = vsIndex !== -1 ? w.title.substring(vsIndex + 3) : w.title;
  const vsParts = matchupPart.split(/\s+(?:vs|Vs|VS)\s+/);

  if (vsParts.length === 2) {
    team1Name = vsParts[0].trim();
    team2Name = vsParts[1].trim();
  }

  const team1Short = team1Name.split(' ').map((w) => w[0]).join('').substring(0, 4).toUpperCase();
  const team2Short = team2Name.split(' ').map((w) => w[0]).join('').substring(0, 4).toUpperCase();

  return {
    source: 'willow',
    category: 'Cricket',
    title: w.title,
    tournament: w.synopsis || 'Willow Cricket Live',
    match_id: w.match_id,
    status: w.status === 'LIVE' ? 'LIVE' : 'UPCOMING',
    streamingStatus: w.status === 'LIVE' ? 'STARTED' : 'NOT_STARTED',
    startTime: w.time,
    image: w.cover_image,
    team: [
      {
        name: team1Name,
        shortName: team1Short || 'T1',
        cricketScore: null,
      },
      {
        name: team2Name,
        shortName: team2Short || 'T2',
        cricketScore: null,
      },
    ],
    match_url: w.match_url,
    is_free: w.is_free,
    stream_url_alpha: w.stream_url_alpha,
    drm_key: w.drm_key,
    STREAMING_CDN: w.stream_url_alpha
      ? {
          Primary_Playback_URL: w.stream_url_alpha,
        }
      : undefined,
  };
}

/**
 * Parse resolution stream links from auto_streams playlist
 */
export function extractResolutionsFromAutoStream(autoPlaylist?: string): StreamResolutionOption[] {
  if (!autoPlaylist) return [];

  const resolutions: StreamResolutionOption[] = [];
  const lines = autoPlaylist.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXT-X-STREAM-INF:')) {
      const resMatch = line.match(/RESOLUTION=(\d+x\d+)/);
      const bandMatch = line.match(/BANDWIDTH=(\d+)/);
      const nextLine = lines[i + 1]?.trim();

      if (nextLine && nextLine.startsWith('http')) {
        const resStr = resMatch ? resMatch[1] : 'Auto';
        const height = resStr.split('x')[1] || 'Auto';
        const label = height !== 'Auto' ? `${height}p` : 'Auto';

        resolutions.push({
          label: `${label} (${resStr})`,
          resolution: resStr,
          bandwidth: bandMatch ? parseInt(bandMatch[1], 10) : undefined,
          url: nextLine,
        });
      }
    }
  }

  return resolutions;
}

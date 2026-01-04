import type {
  StravaActivityRaw,
  StravaAthleteStats,
  StravaTokenResponse,
  RunningActivity,
  RunningStats,
} from '@/types/strava';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
export const STRAVA_ATHLETE_ID = '73173630';

// Cache the access token during build
let cachedAccessToken: string | null = null;

/**
 * Refresh the Strava access token using the refresh token
 */
async function refreshAccessToken(): Promise<{ accessToken: string } | null> {
  const clientId = import.meta.env.STRAVA_CLIENT_ID;
  const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
  const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[Strava] Missing API credentials');
    return null;
  }

  try {
    const response = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data: StravaTokenResponse = await response.json();
    return {
      accessToken: data.access_token,
    };
  } catch (error) {
    console.error('[Strava] Token refresh error:', error);
    return null;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 */
async function getAccessToken(): Promise<{ accessToken: string } | null> {
  if (cachedAccessToken) {
    return { accessToken: cachedAccessToken };
  }

  const result = await refreshAccessToken();
  if (result) {
    cachedAccessToken = result.accessToken;
  }
  return result;
}

/**
 * Convert meters per second to min/km pace string
 */
function speedToPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return '--:--';
  const minutesPerKm = 1000 / 60 / metersPerSecond;
  const minutes = Math.floor(minutesPerKm);
  const seconds = Math.round((minutesPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Transform raw Strava activity to display format
 */
function transformActivity(raw: StravaActivityRaw): RunningActivity {
  return {
    id: raw.id,
    name: raw.name,
    date: new Date(raw.start_date_local),
    distanceKm: Math.round((raw.distance / 1000) * 100) / 100,
    durationMinutes: Math.round(raw.moving_time / 60),
    paceMinPerKm: speedToPace(raw.average_speed),
    elevationGain: Math.round(raw.total_elevation_gain),
    averageHeartRate: raw.average_heartrate ? Math.round(raw.average_heartrate) : undefined,
    routePolyline: raw.map?.summary_polyline || undefined,
    stravaUrl: `https://www.strava.com/activities/${raw.id}`,
    kudos: raw.kudos_count,
  };
}

/**
 * Fetch recent running activities from Strava
 */
export async function getRunningActivities(limit: number = 6): Promise<RunningActivity[]> {
  const auth = await getAccessToken();
  if (!auth) return [];

  try {
    const response = await fetch(`${STRAVA_API_BASE}/athlete/activities?per_page=${limit * 2}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Activities fetch failed: ${response.status}`);
    }

    const activities: StravaActivityRaw[] = await response.json();

    // Filter for running activities only
    const runningActivities = activities
      .filter((activity) => activity.type === 'Run' || activity.sport_type === 'Run')
      .slice(0, limit)
      .map(transformActivity);

    return runningActivities;
  } catch (error) {
    console.error('[Strava] Activities fetch error:', error);
    return [];
  }
}

/**
 * Fetch athlete stats from Strava
 */
export async function getAthleteStats(): Promise<RunningStats | null> {
  const auth = await getAccessToken();
  if (!auth) return null;

  try {
    const response = await fetch(`${STRAVA_API_BASE}/athletes/${STRAVA_ATHLETE_ID}/stats`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.status}`);
    }

    const stats: StravaAthleteStats = await response.json();

    return {
      allTimeDistanceKm: Math.round(stats.all_run_totals.distance / 1000),
      allTimeRuns: stats.all_run_totals.count,
      yearDistanceKm: Math.round(stats.ytd_run_totals.distance / 1000),
      yearRuns: stats.ytd_run_totals.count,
      recentDistanceKm: Math.round(stats.recent_run_totals.distance / 1000),
      recentRuns: stats.recent_run_totals.count,
    };
  } catch (error) {
    console.error('[Strava] Stats fetch error:', error);
    return null;
  }
}

// Raw Strava API response types
export interface StravaActivityRaw {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  start_date: string; // ISO 8601
  start_date_local: string; // ISO 8601
  timezone: string;
  map: {
    id: string;
    summary_polyline: string; // Encoded polyline for route preview
    resource_state: number;
  };
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  kudos_count: number;
  athlete_count: number;
}

export interface StravaAthleteStats {
  all_run_totals: StravaTotals;
  recent_run_totals: StravaTotals;
  ytd_run_totals: StravaTotals;
}

export interface StravaTotals {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
}

export interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  athlete?: {
    id: number;
  };
}

// Transformed types for display
export interface RunningActivity {
  id: number;
  name: string;
  date: Date;
  distanceKm: number;
  durationMinutes: number;
  paceMinPerKm: string; // e.g., "5:30"
  elevationGain: number; // meters
  averageHeartRate?: number; // bpm
  routePolyline?: string;
  stravaUrl: string;
  kudos: number;
}

export interface RunningStats {
  allTimeDistanceKm: number;
  allTimeRuns: number;
  yearDistanceKm: number;
  yearRuns: number;
  recentDistanceKm: number; // Last 4 weeks
  recentRuns: number;
}

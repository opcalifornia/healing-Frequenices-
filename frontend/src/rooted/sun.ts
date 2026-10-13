/**
 * Where the sun is, worked out on the device from the date and a place.
 * Simplified NOAA / Astronomical Almanac formulas: good to about a degree,
 * plenty for "is it morning light yet". Nothing is sent anywhere.
 */
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export interface Place {
  lat: number;
  lon: number;
  /** "device" = from the location button, "zone" = a rough guess from the time zone. */
  source: "device" | "zone";
}

export interface SunPos {
  /** Degrees above the horizon (negative = below). */
  altitude: number;
  /** Degrees clockwise from north. */
  azimuth: number;
  /** The point on Earth where the sun is straight overhead. */
  subLat: number;
  subLon: number;
}

export function sunPosition(date: Date, lat: number, lon: number): SunPos {
  const n = date.getTime() / 86400000 + 2440587.5 - 2451545;
  const L = mod(280.46 + 0.9856474 * n, 360);
  const g = mod(357.528 + 0.9856003 * n, 360) * RAD;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const eps = (23.439 - 0.0000004 * n) * RAD;
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const gmst = mod(18.697374558 + 24.06570982441908 * n, 24) * 15; // degrees
  const ha = mod(gmst + lon - ra * DEG + 180, 360) - 180; // hour angle, -180..180
  const phi = lat * RAD;
  const h = ha * RAD;
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(h));
  const az = mod(Math.atan2(Math.sin(h), Math.cos(h) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) * DEG + 180, 360);
  return { altitude: alt * DEG, azimuth: az, subLat: dec * DEG, subLon: mod(ra * DEG - gmst + 180, 360) - 180 };
}

const SUNRISE_ALT = -0.833;

export interface DayTimes {
  /** Previous and next, as timestamps (ms), or undefined near the poles when the sun doesn't cross. */
  prevRise?: number;
  nextRise?: number;
  prevSet?: number;
  nextSet?: number;
}

/** Sunrises and sunsets within a day either side of `now`, found by stepping through time. */
export function dayTimes(now: Date, lat: number, lon: number): DayTimes {
  const step = 5 * 60000;
  const t0 = now.getTime() - 36 * 3600000;
  const out: DayTimes = {};
  let prev = sunPosition(new Date(t0), lat, lon).altitude;
  for (let t = t0 + step; t <= now.getTime() + 36 * 3600000; t += step) {
    const a = sunPosition(new Date(t), lat, lon).altitude;
    const crossing = prev < SUNRISE_ALT !== a < SUNRISE_ALT;
    if (crossing) {
      const rising = a > prev;
      const at = t - step * ((a - SUNRISE_ALT) / (a - prev));
      const before = at <= now.getTime();
      if (rising) { if (before) out.prevRise = at; else out.nextRise ??= at; }
      else if (before) out.prevSet = at;
      else out.nextSet ??= at;
    }
    prev = a;
  }
  return out;
}

export type Phase = "night" | "dawn" | "morning" | "midday" | "afternoon" | "golden" | "dusk" | "polar-day" | "polar-night";

export interface SunNow {
  pos: SunPos;
  times: DayTimes;
  phase: Phase;
  /** True while the sun is above the horizon. */
  up: boolean;
  /** 0 (dark) to 1 (full day), for the sky brightness. */
  light: number;
  /** Is it a good moment for morning light? */
  morningWindow: boolean;
}

export function sunNow(now: Date, place: Pick<Place, "lat" | "lon">): SunNow {
  const pos = sunPosition(now, place.lat, place.lon);
  const times = dayTimes(now, place.lat, place.lon);
  const alt = pos.altitude;
  const t = now.getTime();
  const rising = sunPosition(new Date(t + 10 * 60000), place.lat, place.lon).altitude > alt;
  const sinceRise = times.prevRise !== undefined ? t - times.prevRise : Infinity;
  let phase: Phase;
  if (!times.prevRise && !times.nextRise && !times.prevSet && !times.nextSet) phase = alt > 0 ? "polar-day" : "polar-night";
  else if (alt < -6) phase = "night";
  else if (alt < SUNRISE_ALT) phase = rising ? "dawn" : "dusk";
  else if (alt < 10) phase = rising ? "morning" : "golden";
  else if (rising && sinceRise <= 3 * 3600000) phase = "morning";
  else phase = rising || alt > 45 ? "midday" : "afternoon";
  const up = alt > SUNRISE_ALT;
  const light = Math.max(0, Math.min(1, (alt + 8) / 38));
  // Daylight from first light until about three hours after sunrise.
  const morningWindow = up && rising && sinceRise <= 3 * 3600000;
  return { pos, times, phase, up, light, morningWindow };
}

/** A rough place from the time zone, for when the person hasn't shared their location. */
export function guessPlace(now = new Date()): Place {
  const lon = Math.max(-180, Math.min(180, -now.getTimezoneOffset() / 4)); // 15 degrees per hour
  const zone = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""; } catch { return ""; } })();
  const lat = zone.startsWith("Australia") || zone.startsWith("Pacific/Auckland") || zone.includes("Sao_Paulo") || zone.includes("Johannesburg") ? -30 : zone.startsWith("Africa") || zone.startsWith("Asia/Singapore") ? 5 : 40;
  return { lat, lon, source: "zone" };
}

export const PHASE_COPY: Record<Phase, { title: string; body: string }> = {
  night: { title: "It's dark outside", body: "A good time for dim, warm light and sleep. Bright light now tells your body it's daytime." },
  dawn: { title: "First light is coming", body: "The sky is brightening. In a little while, outdoor light will be your best body-clock signal of the day." },
  morning: { title: "Now is a good time to go outside", body: "Morning light is the strongest cue for your body clock. Get outside for 5 to 10 minutes (longer if it's overcast) within an hour or so of waking. Skip the sunglasses for that short time, and never look straight at the sun." },
  midday: { title: "The sun is high", body: "Strong light, strong UV. If you're staying out, think shade, a hat or sunscreen. Daylight at any hour helps your alertness." },
  afternoon: { title: "The sun is on its way down", body: "A walk now still gives you daylight. Keep caffeine early enough that it doesn't get in the way of sleep." },
  golden: { title: "Golden hour", body: "Soft, low light. Lovely for a walk, and a gentle start to winding down. Evening light is the cue to begin dimming screens and lamps soon." },
  dusk: { title: "The sun has set", body: "Time to start dimming. Warm, low light in the evening helps your body make melatonin on schedule." },
  "polar-day": { title: "The sun doesn't set here right now", body: "With light all day, keep a rhythm anyway: bright mornings outside, dim evenings, blackout curtains for sleep." },
  "polar-night": { title: "The sun doesn't rise here right now", body: "In polar winter, a light box in the morning can stand in for sunrise. See Light tools, and talk to a clinician if your mood dips." },
};

const PLACE_KEY = "rooted.sun.place";

/** The place the person shared from this device in Follow the sun, if any. Kept on the device only. */
export function readPlace(): Place | null {
  try {
    const p = JSON.parse(localStorage.getItem(PLACE_KEY) ?? "null") as Place | null;
    return p && Number.isFinite(p.lat) && Number.isFinite(p.lon) ? { lat: p.lat, lon: p.lon, source: "device" } : null;
  } catch { return null; }
}

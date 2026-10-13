import { useEffect, useMemo, useRef, useState } from "react";
import { guessPlace, PHASE_COPY, readPlace, sunNow, sunPosition, type Place } from "./sun";
import "./SunTracker.css";

const KEY = "rooted.sun.place";
const RAD = Math.PI / 180;

const fmt = (t?: number) => (t === undefined ? "none" : new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));

/** Mix two RGB colours. */
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

function skyColors(light: number, warm: number) {
  const night = [[7, 10, 28], [18, 22, 50]];
  const day = [[70, 140, 215], [168, 213, 240]];
  const glow = [[236, 120, 70], [255, 190, 110]];
  const top = mix(mix(night[0], day[0], light), glow[0], warm * 0.55);
  const bottom = mix(mix(night[1], day[1], light), glow[1], warm * 0.85);
  return { top: `rgb(${top})`, bottom: `rgb(${bottom})` };
}

/** Earth seen from above the person's place, with the day side lit. */
function Globe({ place, sun, size = 240 }: { place: Place; sun: { subLat: number; subLon: number }; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const N = 120; // render small, scale up in CSS: soft and quick
    c.width = c.height = N;
    const img = ctx.createImageData(N, N);
    const lat0 = place.lat * RAD, lon0 = place.lon * RAD;
    const sl = sun.subLat * RAD, so = sun.subLon * RAD;
    const sv = [Math.cos(sl) * Math.cos(so), Math.cos(sl) * Math.sin(so), Math.sin(sl)];
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = (i + 0.5) / N * 2 - 1, y = 1 - (j + 0.5) / N * 2;
      const r2 = x * x + y * y, k = (j * N + i) * 4;
      if (r2 > 1) { img.data[k + 3] = 0; continue; }
      const z = Math.sqrt(1 - r2);
      // Inverse orthographic projection, centred on the person's place.
      const lat = Math.asin(z * Math.sin(lat0) + y * Math.cos(lat0));
      const lon = lon0 + Math.atan2(x, z * Math.cos(lat0) - y * Math.sin(lat0));
      const dot = Math.cos(lat) * Math.cos(lon) * sv[0] + Math.cos(lat) * Math.sin(lon) * sv[1] + Math.sin(lat) * sv[2];
      const lit = Math.max(0, Math.min(1, (dot + 0.08) / 0.3));
      const base = mix([10, 16, 34], [58, 124, 178], lit);
      const edge = 1 - Math.pow(1 - z, 2) * 0.55; // limb darkening
      img.data[k] = base[0] * edge; img.data[k + 1] = base[1] * edge; img.data[k + 2] = base[2] * edge; img.data[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // Lat / long grid, so you can see the globe turn.
    ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 0.6;
    const proj = (la: number, lo: number) => {
      const dl = lo - lon0;
      const cz = Math.sin(lat0) * Math.sin(la) + Math.cos(lat0) * Math.cos(la) * Math.cos(dl);
      return { x: (Math.cos(la) * Math.sin(dl) + 1) / 2 * N, y: (1 - (Math.cos(lat0) * Math.sin(la) - Math.sin(lat0) * Math.cos(la) * Math.cos(dl))) / 2 * N, v: cz > 0 };
    };
    const line = (pts: Array<[number, number]>) => {
      ctx.beginPath(); let pen = false;
      for (const [la, lo] of pts) { const p = proj(la * RAD, lo * RAD); if (p.v) { pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); pen = true; } else pen = false; }
      ctx.stroke();
    };
    for (let la = -60; la <= 60; la += 30) line(Array.from({ length: 73 }, (_, i) => [la, i * 5 - 180] as [number, number]));
    for (let lo = -180; lo < 180; lo += 30) line(Array.from({ length: 37 }, (_, i) => [i * 5 - 90, lo] as [number, number]));
    const sp = proj(sl, so);
    if (sp.v) { ctx.fillStyle = "#fff4b8"; ctx.shadowColor = "#ffd54f"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(sp.x, sp.y, 3.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
  }, [place.lat, place.lon, sun.subLat, sun.subLon]);
  return (
    <div className="sunglobe" style={{ width: size, height: size }}>
      <canvas ref={ref} aria-hidden="true" />
      <span className="sunglobe__pin" aria-hidden="true"><i /></span>
    </div>
  );
}

export function SunTracker() {
  const [place, setPlace] = useState<Place>(() => readPlace() ?? guessPlace());
  const [offset, setOffset] = useState(0); // minutes from now
  const [tick, setTick] = useState(() => Date.now());
  const [playing, setPlaying] = useState(false);
  const [geoMsg, setGeoMsg] = useState("");

  useEffect(() => { const id = setInterval(() => setTick(Date.now()), 30000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setOffset((o) => (o >= 720 ? (setPlaying(false), 720) : o + (reduce ? 30 : 10))), 60);
    return () => clearInterval(id);
  }, [playing]);

  const when = useMemo(() => new Date(tick + offset * 60000), [tick, offset]);
  const sun = useMemo(() => sunNow(when, place), [when, place]);
  const real = offset === 0;

  // Today's path across the sky, from east to west, as seen facing the equator.
  const path = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    const start = new Date(tick); start.setHours(0, 0, 0, 0);
    for (let m = 0; m <= 1440; m += 10) {
      const p = sunPosition(new Date(start.getTime() + m * 60000), place.lat, place.lon);
      if (p.altitude > -2) pts.push(skyXY(p.azimuth, p.altitude, place.lat));
    }
    return pts;
  }, [tick, place]);

  const warm = sun.up ? Math.max(0, 1 - Math.abs(sun.pos.altitude - 2) / 14) : sun.pos.altitude > -8 ? 0.7 : 0;
  const sky = skyColors(sun.light, warm);
  const me = skyXY(sun.pos.azimuth, sun.pos.altitude, place.lat);
  const copy = PHASE_COPY[sun.phase];
  const title = sun.morningWindow ? PHASE_COPY.morning.title : copy.title;

  const locate = () => {
    if (!navigator.geolocation) return setGeoMsg("This browser can't share a location. Showing a guess from your time zone.");
    setGeoMsg("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Rounded to about a mile: more than enough for the sun.
        const next: Place = { lat: Math.round(pos.coords.latitude * 100) / 100, lon: Math.round(pos.coords.longitude * 100) / 100, source: "device" };
        setPlace(next); setGeoMsg("");
        try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
      },
      () => setGeoMsg("Couldn't get your location. Showing a guess from your time zone."),
      { timeout: 10000, maximumAge: 600000 },
    );
  };

  return (
    <div className="suntrack r-card">
      <div className="suntrack__sky" style={{ background: `linear-gradient(180deg, ${sky.top}, ${sky.bottom})`, "--sunlight": sun.light } as React.CSSProperties} role="img" aria-label={`The sun is ${Math.round(Math.abs(sun.pos.altitude))} degrees ${sun.pos.altitude >= 0 ? "above" : "below"} the horizon`}>
        {sun.light < 0.5 && <div className="suntrack__stars" style={{ opacity: 1 - sun.light * 2 }} aria-hidden="true" />}
        <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <defs>
            <radialGradient id="sunGlow"><stop offset="0" stopColor="#fff6c8" stopOpacity="0.95" /><stop offset="1" stopColor="#ffcf4d" stopOpacity="0" /></radialGradient>
          </defs>
          {path.length > 1 && <polyline points={path.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeDasharray="3 5" />}
          {sun.pos.altitude > -12 && (
            <g className="suntrack__sun" style={{ transform: `translate(${me.x}px, ${me.y}px)` }}>
              <circle r="38" fill="url(#sunGlow)" opacity={sun.up ? 1 : 0.4} />
              <circle r="9" fill={sun.up ? "#fff1a8" : "#c9c3a0"} />
            </g>
          )}
          <path d="M0 150 Q 70 138 140 148 T 280 146 T 400 150 V190 H0Z" fill="#10200f" opacity="0.92" />
          <path d="M0 162 Q 90 150 190 160 T 400 158 V190 H0Z" fill="#0b160b" />
          <g fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" textAnchor="middle"><text x="22" y="178">E</text><text x="200" y="178">S</text><text x="378" y="178">W</text></g>
        </svg>
        <div className="suntrack__time">
          <strong>{when.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</strong>
          <span>{real ? "Now" : offset > 0 ? `In ${Math.round(offset / 60)} h` : `${Math.round(-offset / 60)} h ago`}</span>
        </div>
      </div>

      <div className="suntrack__body">
        <Globe place={place} sun={sun.pos} />
        <div className="suntrack__info">
          <h3>{title}</h3>
          <p>{sun.morningWindow ? PHASE_COPY.morning.body : copy.body}</p>
          <dl className="suntrack__facts">
            <div><dt>Sun height</dt><dd>{Math.round(sun.pos.altitude)}°</dd></div>
            <div><dt>Sunrise</dt><dd>{fmt(sun.times.nextRise ?? sun.times.prevRise)}</dd></div>
            <div><dt>Sunset</dt><dd>{fmt(sun.times.nextSet ?? sun.times.prevSet)}</dd></div>
          </dl>
        </div>
      </div>

      <div className="suntrack__controls">
        <label>
          <span>Slide the day</span>
          <input type="range" min={-720} max={720} step={10} value={offset} onChange={(e) => { setPlaying(false); setOffset(Number(e.target.value)); }} aria-valuetext={when.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} />
        </label>
        <div className="suntrack__btns">
          <button className="btn btn--small btn--secondary" onClick={() => { setOffset(-720); setPlaying(true); }}>Play the day</button>
          <button className="btn btn--small btn--secondary" onClick={() => { setPlaying(false); setOffset(0); }} disabled={real}>Now</button>
          <button className="btn btn--small btn--primary" onClick={locate}>{place.source === "device" ? "Update my location" : "Use my location"}</button>
        </div>
        <p className="suntrack__note">
          {place.source === "device" ? "Using your location, rounded and kept on this device only." : "Showing a rough guess from your time zone. Tap “Use my location” for your real sky."} {geoMsg}
        </p>
      </div>
    </div>
  );
}

/** Map a sun direction to a spot in the 400 by 190 sky, facing the equator. */
function skyXY(az: number, alt: number, lat: number) {
  const a = lat >= 0 ? az : (az + 180) % 360; // southern hemisphere faces north
  const rel = ((a - 180 + 540) % 360) - 180; // -180..180 around "south"
  const x = 200 + Math.max(-95, Math.min(95, rel)) * (180 / 95);
  const y = 150 - Math.max(-12, alt) * (130 / 80);
  return { x: Math.max(8, Math.min(392, x)), y };
}

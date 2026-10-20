import { useCallback, useEffect, useRef, useState } from "react";
import { geoCentroid, geoContains, geoDistance, geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countriesTopo from "world-atlas/countries-110m.json";
import { Icon } from "../components/Icon";

/**
 * A spinning Earth you can drag, pinch and zoom, drawn on a canvas so it stays small and works offline. Countries with
 * dishes glow and carry a pin; tap one (or pick it from the list) to open its recipes. The ocean, land, atmosphere and
 * sunlit edge are painted to feel like the familiar satellite views of Earth.
 */
export interface GlobePin {
  id: string;
  name: string;
  iso: number;
}

interface Country {
  iso: number;
  name: string;
  geo: GeoPermissibleObjects & { type: string };
}

const topo = countriesTopo as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const COUNTRIES: Country[] = (feature(topo, topo.objects.countries) as unknown as { features: Array<{ id: string; properties: { name: string }; geometry: unknown }> }).features.map((f) => ({
  iso: Number(f.id),
  name: f.properties.name,
  geo: f as unknown as Country["geo"],
}));

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Land colour by latitude: ice at the poles, deserts and savanna warm, forest and fields green. */
function landColor(lat: number): string {
  const a = Math.abs(lat);
  if (a > 70) return "#e9f0f2";
  if (a > 58) return "#8aa37a";
  if (a > 40) return "#5d8a4f";
  if (a > 28) return "#a8a066";
  if (a > 14) return "#7d9a52";
  return "#3f7d45";
}

export function Globe({ pins, selected, onPick, label = "Interactive globe. Drag to spin, pinch or scroll to zoom, tap a glowing country to see its dishes." }: { pins: GlobePin[]; selected?: string | null; onPick(id: string): void; label?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ lon: -20, lat: -22, zoom: 1, vx: 0, vy: 0, auto: !reduced(), dragging: false, w: 320, last: 0, anim: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(0);
  const [hint, setHint] = useState<string | null>(null);
  const pinIso = useRef(new Map(pins.map((p) => [p.iso, p])));
  pinIso.current = new Map(pins.map((p) => [p.iso, p]));
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const centroids = useRef(new Map<number, [number, number]>());
  if (centroids.current.size === 0) for (const c of COUNTRIES) centroids.current.set(c.iso, geoCentroid(c.geo as never) as [number, number]);

  const draw = useCallback((t: number) => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const s = state.current;
    const w = s.w;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(w * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, w);
    const R = (w / 2) * 0.82 * s.zoom;
    const cx = w / 2;
    const projection = geoOrthographic().translate([cx, cx]).scale(R).rotate([-s.lon, -s.lat]).clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);

    // Stars
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, w, w);
    for (let i = 0; i < 60; i++) {
      const x = ((i * 9301 + 49297) % 233280) / 233280;
      const y = ((i * 4973 + 12345) % 233280) / 233280;
      ctx.globalAlpha = 0.25 + ((i * 37) % 10) / 20;
      ctx.fillStyle = "#cfe0ff";
      ctx.fillRect(x * w, y * w, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;

    // Atmosphere glow
    const glow = ctx.createRadialGradient(cx, cx, R * 0.98, cx, cx, R * 1.16);
    glow.addColorStop(0, "rgba(110,170,255,0.55)");
    glow.addColorStop(1, "rgba(110,170,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cx, R * 1.16, 0, Math.PI * 2);
    ctx.fill();

    // Ocean
    const ocean = ctx.createRadialGradient(cx - R * 0.35, cx - R * 0.35, R * 0.1, cx, cx, R);
    ocean.addColorStop(0, "#2d7fd1");
    ocean.addColorStop(0.6, "#12498f");
    ocean.addColorStop(1, "#08254f");
    ctx.fillStyle = ocean;
    ctx.beginPath();
    path({ type: "Sphere" } as never);
    ctx.fill();

    // Graticule
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    path(geoGraticule10());
    ctx.stroke();

    // Land
    for (const c of COUNTRIES) {
      const lat = centroids.current.get(c.iso)?.[1] ?? 0;
      const pin = pinIso.current.get(c.iso);
      const isSel = pin && pin.id === selectedRef.current;
      ctx.beginPath();
      path(c.geo as never);
      ctx.fillStyle = pin ? (isSel ? "#ffd66b" : "#f2b94d") : landColor(lat);
      ctx.fill();
      ctx.strokeStyle = pin ? "rgba(255,255,255,0.85)" : "rgba(10,25,15,0.35)";
      ctx.lineWidth = pin ? 1.2 : 0.5;
      ctx.stroke();
    }

    // Sunlight and shadow across the sphere
    const light = ctx.createRadialGradient(cx - R * 0.45, cx - R * 0.45, R * 0.05, cx, cx, R * 1.02);
    light.addColorStop(0, "rgba(255,255,255,0.22)");
    light.addColorStop(0.45, "rgba(255,255,255,0)");
    light.addColorStop(1, "rgba(0,8,24,0.62)");
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(cx, cx, R, 0, Math.PI * 2);
    ctx.fill();

    // Pins and labels for countries on the visible side
    const center: [number, number] = [s.lon, s.lat];
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    const placed: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
    const visible = [...pinIso.current.values()]
      .map((p) => ({ p, c: centroids.current.get(p.iso) }))
      .filter((v): v is { p: GlobePin; c: [number, number] } => !!v.c && geoDistance(v.c, center) <= 1.35)
      .sort((a, b) => Number(b.p.id === selectedRef.current) - Number(a.p.id === selectedRef.current) || geoDistance(a.c, center) - geoDistance(b.c, center));
    for (const { p, c } of visible) {
      const xy = projection(c);
      if (!xy) continue;
      const pulse = reduced() ? 0 : (Math.sin(t / 500 + p.iso) + 1) / 2;
      const isSel = p.id === selectedRef.current;
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], 5 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.55 - pulse * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], isSel ? 5 : 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      // Names only where they fit: a crowded region shows its names as you zoom in.
      const tw = ctx.measureText(p.name).width;
      const box = { x0: xy[0] - tw / 2 - 3, x1: xy[0] + tw / 2 + 3, y0: xy[1] - 26, y1: xy[1] - 6 };
      if (!isSel && placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) continue;
      placed.push(box);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0,0,0,0.65)";
      ctx.strokeText(p.name, xy[0], xy[1] - 12);
      ctx.fillStyle = "#fff";
      ctx.fillText(p.name, xy[0], xy[1] - 12);
    }
  }, []);

  // Animation loop: gentle auto-spin, drag inertia and zoom smoothing.
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const s = state.current;
      const dt = s.last ? Math.min(50, t - s.last) : 16;
      s.last = t;
      if (!s.dragging) {
        if (Math.abs(s.vx) > 0.005 || Math.abs(s.vy) > 0.005) {
          s.lon += s.vx;
          s.lat = clamp(s.lat + s.vy, -75, 75);
          s.vx *= 0.94;
          s.vy *= 0.94;
        } else if (s.auto && !selectedRef.current) s.lon += 0.012 * dt;
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Keep the canvas square and as wide as its container.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      state.current.w = Math.max(240, Math.min(640, el.clientWidth));
    });
    ro.observe(el);
    state.current.w = Math.max(240, Math.min(640, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const rotateTo = useCallback((lon: number, lat: number, zoom = 1.6) => {
    const s = state.current;
    cancelAnimationFrame(s.anim);
    s.auto = false;
    s.vx = s.vy = 0;
    if (reduced()) {
      s.lon = lon;
      s.lat = clamp(lat, -75, 75);
      s.zoom = zoom;
      return;
    }
    const from = { lon: s.lon, lat: s.lat, zoom: s.zoom };
    // Take the short way round.
    let dLon = ((lon - from.lon + 540) % 360) - 180;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      s.lon = from.lon + dLon * e;
      s.lat = from.lat + (clamp(lat, -75, 75) - from.lat) * e;
      s.zoom = from.zoom + (zoom - from.zoom) * e;
      if (k < 1) s.anim = requestAnimationFrame(step);
    };
    dLon = dLon || 0;
    s.anim = requestAnimationFrame(step);
  }, []);

  // Spin to a country when it's chosen from the list or tapped.
  useEffect(() => {
    if (!selected) return;
    const p = pins.find((x) => x.id === selected);
    const c = p && centroids.current.get(p.iso);
    if (c) rotateTo(c[0], c[1] - 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const pick = (px: number, py: number) => {
    const s = state.current;
    const R = (s.w / 2) * 0.82 * s.zoom;
    const projection = geoOrthographic().translate([s.w / 2, s.w / 2]).scale(R).rotate([-s.lon, -s.lat]).clipAngle(90);
    const ll = projection.invert?.([px, py]);
    if (!ll || Number.isNaN(ll[0])) return;
    const hit = COUNTRIES.find((c) => geoContains(c.geo as never, ll));
    if (!hit) return setHint(null);
    const pin = pinIso.current.get(hit.iso);
    if (pin) {
      setHint(null);
      onPick(pin.id);
    } else setHint(`${hit.name}: dishes coming soon`);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const s = state.current;
    s.dragging = true;
    s.auto = false;
    s.vx = s.vy = 0;
    cancelAnimationFrame(s.anim);
    moved.current = 0;
  };
  const onMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const s = state.current;
    const next = { x: e.clientX, y: e.clientY };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const before = Math.hypot(a.x - b.x, a.y - b.y);
      pointers.current.set(e.pointerId, next);
      const [c, d] = [...pointers.current.values()];
      const after = Math.hypot(c.x - d.x, c.y - d.y);
      if (before > 0) s.zoom = clamp(s.zoom * (after / before), 0.8, 3.2);
      moved.current += 10;
      return;
    }
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    const k = 0.45 / s.zoom;
    s.lon -= dx * k;
    s.lat = clamp(s.lat + dy * k, -75, 75);
    s.vx = -dx * k * 0.6;
    s.vy = dy * k * 0.6;
    pointers.current.set(e.pointerId, next);
  };
  const onUp = (e: React.PointerEvent) => {
    const wasOne = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    const s = state.current;
    if (pointers.current.size === 0) s.dragging = false;
    if (wasOne && moved.current < 6) {
      const r = canvas.current!.getBoundingClientRect();
      s.vx = s.vy = 0;
      pick(((e.clientX - r.left) / r.width) * s.w, ((e.clientY - r.top) / r.height) * s.w);
    }
  };
  const onWheel = (e: React.WheelEvent) => {
    const s = state.current;
    s.zoom = clamp(s.zoom * (e.deltaY < 0 ? 1.1 : 0.91), 0.8, 3.2);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const s = state.current;
    s.auto = false;
    if (e.key === "ArrowLeft") s.lon -= 8;
    else if (e.key === "ArrowRight") s.lon += 8;
    else if (e.key === "ArrowUp") s.lat = clamp(s.lat + 6, -75, 75);
    else if (e.key === "ArrowDown") s.lat = clamp(s.lat - 6, -75, 75);
    else if (e.key === "+" || e.key === "=") s.zoom = clamp(s.zoom * 1.15, 0.8, 3.2);
    else if (e.key === "-") s.zoom = clamp(s.zoom / 1.15, 0.8, 3.2);
    else return;
    e.preventDefault();
  };
  const reset = () => {
    const s = state.current;
    rotateTo(-20, -22, 1);
    s.auto = !reduced();
  };
  const zoomBy = (f: number) => (state.current.zoom = clamp(state.current.zoom * f, 0.8, 3.2));

  return (
    <div className="globe" ref={wrap}>
      <canvas
        ref={canvas}
        className="globe__canvas"
        role="application"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        onKeyDown={onKey}
        onDoubleClick={reset}
        style={{ width: "100%", aspectRatio: "1 / 1", touchAction: "none" }}
      />
      <div className="globe__controls" role="group" aria-label="Globe controls">
        <button onClick={() => zoomBy(1.25)} aria-label="Zoom in"><Icon name="plus" size={18} /></button>
        <button onClick={() => zoomBy(0.8)} aria-label="Zoom out"><span aria-hidden="true">−</span></button>
        <button onClick={reset} aria-label="Reset the globe"><Icon name="replay" size={18} /></button>
      </div>
      <p className="globe__hint" role="status">{hint ?? "Drag to spin · pinch or scroll to zoom · tap a glowing country"}</p>
    </div>
  );
}

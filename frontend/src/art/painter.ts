import type { ArtShape, Title } from "../types";

/** Deterministic PRNG so every title always gets the same artwork. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pattern = Title["art"]["pattern"];

export interface ArtSpec {
  seed: string;
  hue: number;
  pattern: Pattern;
  /** Beat frequency; drives waveform density. */
  beat?: number;
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** Cymatic-style scalar field in [0,1], evaluated at normalised coords. */
function makeField(pattern: Pattern, rnd: () => number, aspect: number) {
  const n = 1 + Math.floor(rnd() * 6);
  let m = 1 + Math.floor(rnd() * 6);
  if (m === n) m = n + 1;
  const freq = 10 + rnd() * 22;
  const cx = (rnd() - 0.5) * 0.6;
  const cy = (rnd() - 0.5) * 0.4;
  const petals = 3 + Math.floor(rnd() * 7);
  const sep = 0.25 + rnd() * 0.5;
  const sharp = 5 + rnd() * 6;

  switch (pattern) {
    case "chladni":
      return (x: number, y: number) => {
        const X = x * Math.PI * 1.1;
        const Y = y * Math.PI * 1.1;
        const v = Math.cos(n * X) * Math.cos(m * Y) - Math.cos(m * X) * Math.cos(n * Y);
        return Math.exp(-Math.abs(v) * sharp);
      };
    case "rings":
      return (x: number, y: number) => {
        const r1 = Math.hypot(x - cx, y - cy);
        const r2 = Math.hypot(x + cx * 0.6, y + cy * 0.6 + 0.2);
        const v = Math.sin(r1 * freq) + 0.6 * Math.sin(r2 * freq * 0.8);
        return Math.pow(Math.max(0, v / 1.6), 3) * Math.exp(-r1 * 0.9);
      };
    case "rosette":
      return (x: number, y: number) => {
        const dx = x - cx * 0.5;
        const dy = y - cy * 0.5;
        const r = Math.hypot(dx, dy);
        const th = Math.atan2(dy, dx);
        const v = Math.sin(r * freq + 2.2 * Math.cos(petals * th));
        return Math.exp(-Math.abs(v) * sharp * 0.6) * Math.exp(-r * 0.8);
      };
    case "interference":
      // Two point sources, one per ear: the binaural idea drawn as ripples.
      return (x: number, y: number) => {
        const d1 = Math.hypot(x + sep * aspect * 0.5, y);
        const d2 = Math.hypot(x - sep * aspect * 0.5, y);
        const v = Math.sin(d1 * freq) + Math.sin(d2 * freq);
        return Math.pow(Math.max(0, v / 2), 2.5) * Math.exp(-(d1 + d2) * 0.35);
      };
    case "wave":
    default: {
      // Stacked waveforms; line count, spacing, tilt and detune vary per title.
      const lines = 2 + Math.floor(rnd() * 5);
      const spacing = 0.12 + rnd() * 0.16;
      const tilt = (rnd() - 0.5) * 0.5;
      const detune = 0.6 + rnd() * 1.6;
      const amp = 0.06 + rnd() * 0.14;
      const width = 25 + rnd() * 40;
      return (x: number, y: number) => {
        let acc = 0;
        for (let i = 0; i < lines; i++) {
          const yy = y - (i - (lines - 1) / 2) * spacing - x * tilt;
          const curve = Math.sin(x * (freq * 0.18 + i * detune) + i * 1.7) * amp * (1 + 0.4 * Math.sin(x * 2 + i));
          acc += Math.exp(-Math.abs(yy - curve) * width);
        }
        return Math.min(1, acc);
      };
    }
  }
}

export function paintArt(canvas: HTMLCanvasElement, spec: ArtSpec, shape: ArtShape | "hero", width: number) {
  const aspect = shape === "poster" ? 2 / 3 : 16 / 9;
  const height = Math.round(width / aspect);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const rnd = mulberry32(hashString(spec.seed));
  const h = spec.hue;
  const h2 = h + 25 + rnd() * 60;

  // 1. Base gradient and a soft off-centre glow.
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, `hsl(${h} 65% 16%)`);
  bg.addColorStop(1, `hsl(${h2} 70% 6%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const gx = width * (0.45 + rnd() * 0.45);
  const gy = height * (0.2 + rnd() * 0.5);
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.75);
  glow.addColorStop(0, `hsla(${h + rnd() * 30} 90% 58% / 0.55)`);
  glow.addColorStop(0.5, `hsla(${h2} 85% 40% / 0.18)`);
  glow.addColorStop(1, "hsla(0 0% 0% / 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 2. Cymatic field, rendered at quarter resolution and scaled up for glow.
  const fw = Math.max(64, Math.round(width / 4));
  const fh = Math.max(36, Math.round(height / 4));
  const field = makeField(spec.pattern, rnd, aspect);
  const small = document.createElement("canvas");
  small.width = fw;
  small.height = fh;
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(fw, fh);
  const [r1, g1, b1] = hsl(h + 10, 95, 78);
  const [r2, g2, b2] = hsl(h2, 90, 62);
  const scale = 1 / Math.min(fw, fh);
  const ox = shape === "poster" ? 0 : 0.18;
  const oy = shape === "poster" ? -0.12 : 0;
  for (let j = 0; j < fh; j++) {
    for (let i = 0; i < fw; i++) {
      const x = (i - fw / 2) * scale * 2 - ox;
      const y = (j - fh / 2) * scale * 2 - oy;
      const v = Math.min(1, Math.max(0, field(x, y)));
      const t = j / fh;
      const k = (j * fw + i) * 4;
      img.data[k] = r1 + (r2 - r1) * t;
      img.data[k + 1] = g1 + (g2 - g1) * t;
      img.data[k + 2] = b1 + (b2 - b1) * t;
      img.data[k + 3] = v * 235;
    }
  }
  sctx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.globalCompositeOperation = "screen";
  ctx.filter = `blur(${Math.max(2, Math.round(width / 220))}px)`;
  ctx.drawImage(small, 0, 0, width, height);
  ctx.filter = "none";
  ctx.globalAlpha = 0.85;
  ctx.drawImage(small, 0, 0, width, height);
  ctx.globalAlpha = 1;

  // 3. A waveform trace whose density follows the beat frequency.
  const beat = spec.beat ?? 6;
  const cycles = 2 + Math.min(10, Math.log2(beat + 1) * 2.2);
  const baseY = height * (shape === "poster" ? 0.62 : 0.7);
  ctx.lineWidth = Math.max(1.2, width / 420);
  for (let layer = 0; layer < 2; layer++) {
    ctx.beginPath();
    const amp = height * (0.05 + rnd() * 0.05) * (layer ? 0.6 : 1);
    const phase = rnd() * Math.PI * 2;
    for (let x = 0; x <= width; x += 3) {
      const t = x / width;
      const env = Math.sin(Math.PI * t);
      const y = baseY + Math.sin(t * cycles * Math.PI * 2 + phase) * amp * env;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = layer ? `hsla(${h2} 90% 75% / 0.35)` : `hsla(${h} 95% 85% / 0.55)`;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";

  // 4. Vignette and a floor gradient so overlaid titles stay legible.
  const vig = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
  const floor = ctx.createLinearGradient(0, height * 0.45, 0, height);
  floor.addColorStop(0, "rgba(0,0,0,0)");
  floor.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, width, height);
}

export function specForTitle(t: Pick<Title, "id" | "art" | "beat">): ArtSpec {
  return { seed: t.id, hue: t.art.hue, pattern: t.art.pattern, beat: t.beat };
}

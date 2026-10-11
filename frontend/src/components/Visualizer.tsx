import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePlayer } from "../store/player";

/**
 * Pulses at the binaural beat rate. To stay photosensitivity-friendly it moves
 * shape, not brightness, and the pulse depth shrinks as the beat gets faster.
 * Reduced motion or "calm visuals" freezes it.
 */
export function Visualizer({ hue = 262 }: { hue?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const calm = usePlayer((s) => s.calmVisuals);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d")!;
    let raf = 0;
    let phase = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      el.width = el.clientWidth * dpr;
      el.height = el.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const draw = (now: number) => {
      const { beat, carrier, status } = usePlayer.getState();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const still = reduce || calm;
      if (status === "playing" || status === "ending") phase += dt * beat * Math.PI * 2;
      const pulse = still ? 0 : Math.sin(phase);
      const depth = beat <= 4 ? 0.09 : beat <= 13 ? 0.05 : beat <= 30 ? 0.03 : 0.018;

      const w = el.width;
      const h = el.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
      glow.addColorStop(0, `hsla(${hue} 90% 60% / 0.35)`);
      glow.addColorStop(1, "hsla(0 0% 0% / 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Concentric rings breathe outward at the beat rate.
      ctx.lineWidth = Math.max(1, w / 500);
      for (let i = 0; i < 9; i++) {
        const k = i / 8;
        const r = R * (0.25 + k * 0.85) * (1 + pulse * depth * (1 - k * 0.5));
        ctx.beginPath();
        // A gentle cymatic wobble: lobes depend on the carrier.
        const lobes = 3 + Math.round((carrier % 60) / 10) + (i % 3);
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 90) {
          const wob = 1 + 0.025 * Math.sin(lobes * a + i + (still ? 0 : phase * 0.02));
          const x = cx + Math.cos(a) * r * wob;
          const y = cy + Math.sin(a) * r * wob;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue + k * 70} 90% ${70 - k * 15}% / ${0.75 - k * 0.5})`;
        ctx.stroke();
      }

      // The beat envelope as a waveform under the rings.
      ctx.beginPath();
      const baseY = cy + R * 1.25;
      for (let x = 0; x <= w; x += 2) {
        const t = x / w;
        const env = Math.cos(Math.PI * t * 4 - (still ? 0 : phase * 0.25));
        const y = baseY + Math.sin(t * Math.PI * 80) * env * h * 0.025;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${hue + 60} 90% 70% / 0.45)`;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [hue, reduce, calm]);

  return <canvas ref={canvas} className="viz" aria-hidden="true" />;
}

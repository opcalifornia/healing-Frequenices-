import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { hashString, mulberry32 } from "../art/painter";

interface Props {
  seed: string;
  hue: number;
  beat?: number;
  /** Vertical position of the wave centre line, 0..1 of the height. */
  baseline?: number;
  className?: string;
}

/**
 * Slowly drifting waveform lines drawn over hero artwork. The motion is
 * deliberately slow (one wavelength every ~25 s) and stops when the tab is
 * hidden or the user prefers reduced motion.
 */
export function LiveWaves({ seed, hue, beat = 6, baseline = 0.7, className = "live-waves" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const rnd = mulberry32(hashString(`${seed}:waves`));
    const h2 = hue + 25 + rnd() * 60;
    const cycles = 2 + Math.min(10, Math.log2(beat + 1) * 2.2);
    const layers = [0, 1, 2].map((i) => ({
      amp: (0.05 + rnd() * 0.05) * (i ? 0.65 - i * 0.15 : 1),
      phase: rnd() * Math.PI * 2,
      speed: (0.18 + rnd() * 0.12) * (i % 2 ? -1 : 1), // radians per second
      color: i === 0 ? `hsla(${hue} 95% 85% / 0.55)` : i === 1 ? `hsla(${h2} 90% 75% / 0.35)` : `hsla(${hue + 40} 90% 80% / 0.2)`,
      cyc: cycles * (1 + i * 0.18),
    }));

    let w = 0;
    let hgt = 0;
    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      hgt = canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, hgt);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = Math.max(1.2, w / 700);
      const base = hgt * baseline;
      // A very slow "breath" in amplitude, about one every 20 s.
      const breath = 1 + 0.18 * Math.sin(t * Math.PI * 0.1);
      for (const l of layers) {
        ctx.beginPath();
        const amp = hgt * l.amp * breath;
        const ph = l.phase + t * l.speed;
        for (let x = 0; x <= w; x += 4) {
          const u = x / w;
          const env = Math.sin(Math.PI * u);
          const y = base + Math.sin(u * l.cyc * Math.PI * 2 + ph) * amp * env;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = l.color;
        ctx.stroke();
      }
    };

    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return; // ~30 fps is plenty for slow motion
      last = now;
      draw(now);
    };
    if (reduce) draw(start);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [seed, hue, beat, baseline, reduce]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

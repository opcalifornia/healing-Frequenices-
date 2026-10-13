import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Depth: cards that tilt toward the pointer with a moving glare.      */
/* ------------------------------------------------------------------ */

interface TiltProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation in degrees. */
  max?: number;
  /** When set, the card is a link that zooms open into its section. */
  to?: string;
  onClick?: () => void;
  label?: string;
}

export function TiltCard({ children, className = "", style, max = 7, to, onClick, label }: TiltProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 18 });
  const sy = useSpring(py, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 55%)`;
  const navigate = useNavigate();

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const inner = (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      style={{ ...style, rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileHover={reduce ? undefined : { scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      {children}
      <motion.span className="tilt__glare" style={{ background: glare }} aria-hidden="true" />
    </motion.div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="tilt-link"
        aria-label={label}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          setZoomOrigin(ref.current!.getBoundingClientRect());
          navigate(to);
        }}
      >
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className="tilt-link" onClick={onClick} aria-label={label}>
        {inner}
      </button>
    );
  }
  return inner;
}

/* ------------------------------------------------------------------ */
/* Zoom: the next page opens out of the card that was clicked.         */
/* ------------------------------------------------------------------ */

let origin: DOMRect | null = null;
export function setZoomOrigin(r: DOMRect) {
  origin = r;
}

/** Route wrapper used by section pages. Opens from the clicked card if there was one, else fades like every other page. */
export function ZoomPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const start = useRef(origin);
  origin = null;
  const p = useMotionValue(start.current && !reduce ? 0 : 1);
  const r = start.current;
  const clip = useTransform(p, (v) => {
    if (!r || v >= 1) return "none";
    const k = 1 - v;
    const right = window.innerWidth - r.right;
    return `inset(${r.top * k}px ${right * k}px calc((100% - ${r.bottom}px) * ${k}) ${r.left * k}px round ${22 * k}px)`;
  });

  useEffect(() => {
    if (p.get() >= 1) return;
    const c = animate(p, 1, { duration: 0.62, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [p]);

  return (
    <motion.main
      id="main"
      tabIndex={-1}
      className={`page ${className}`}
      style={{ clipPath: clip }}
      initial={{ opacity: r && !reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.main>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal: content rises into place as it scrolls into view.           */
/* ------------------------------------------------------------------ */

export function Reveal({ children, delay = 0, className, as = "div", style }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li"; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Scroll-linked parallax offset for hero layers. */
export function useParallax(speed: number) {
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const on = () => y.set(window.scrollY * speed);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [speed, reduce, y]);
  return y;
}

/** Soft organic blobs drifting behind a hero. Colors come from CSS vars on the parent. */
export function Aurora({ className = "" }: { className?: string }) {
  const y1 = useParallax(0.25);
  const y2 = useParallax(0.12);
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <motion.span className="aurora__b aurora__b--1" style={{ y: y1 }} />
      <motion.span className="aurora__b aurora__b--2" style={{ y: y2 }} />
      <motion.span className="aurora__b aurora__b--3" style={{ y: y1 }} />
      <span className="aurora__grain" />
    </div>
  );
}

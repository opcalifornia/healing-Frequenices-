import { useMemo } from "react";
import { dishColor } from "./dishColor";

/**
 * A flat overhead bowl drawn from simple shapes, different for every dish (the same dish always looks the same).
 * It stands in for a photograph until real food photography is added.
 */
export function DishArt({ id, className, size }: { id: string; className?: string; size?: number }) {
  const shapes = useMemo(() => {
    let seed = 7;
    for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) % 233280;
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const out: Array<{ k: "bean" | "pasta" | "herb" | "tom"; x: number; y: number; a: number }> = [];
    for (let i = 0; i < 46; i++) {
      const a = r() * 6.28;
      const d = Math.sqrt(r()) * 62;
      const k = r();
      out.push({ k: k < 0.38 ? "bean" : k < 0.62 ? "pasta" : k < 0.85 ? "herb" : "tom", x: 100 + Math.cos(a) * d, y: 98 + Math.sin(a) * d, a: r() * 180 });
    }
    return out;
  }, [id]);
  const c = dishColor(id);
  return (
    <svg className={className} viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="rgba(28,20,16,.16)" />
      <circle cx="100" cy="98" r="94" fill="#fff8e6" />
      <circle cx="100" cy="98" r="80" fill="#f7d98a" />
      <circle cx="100" cy="98" r="72" fill={c.soup} />
      {shapes.map((s, i) =>
        s.k === "bean" ? <ellipse key={i} cx={s.x} cy={s.y} rx="5.5" ry="3.6" fill="#fff1d0" transform={`rotate(${s.a} ${s.x} ${s.y})`} /> :
        s.k === "pasta" ? <rect key={i} x={s.x - 6} y={s.y - 2.2} width="12" height="4.4" rx="2.2" fill="#f2b01e" transform={`rotate(${s.a} ${s.x} ${s.y})`} /> :
        s.k === "herb" ? <circle key={i} cx={s.x} cy={s.y} r="2.2" fill="#1f6f4a" /> :
        <circle key={i} cx={s.x} cy={s.y} r="3" fill="#a8200f" />,
      )}
      <path d="M62 70 Q100 40 140 66" stroke="rgba(255,255,255,.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

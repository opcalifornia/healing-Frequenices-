import type { Profile } from "../types";
import { symbolById } from "../rooted/symbols";
import { useUser } from "../store/user";
import "./Avatar.css";

type AvatarProfile = Pick<Profile, "name" | "hue"> & { id?: string; symbol?: string | null };

/**
 * Profile picture: a photo (kept on this device) with a small symbol badge, or a
 * healing symbol on a gradient, or the first letter on the Rooted gradient.
 */
export function Avatar({ profile, size = 40, photo, live }: { profile: AvatarProfile; size?: number; photo?: string | null; live?: boolean }) {
  const stored = useUser((s) => (profile.id ? s.photos?.[profile.id] : undefined));
  const img = photo === undefined ? stored : photo;
  const h = profile.hue;
  const id = `av-${h}-${size}-${profile.id ?? "x"}`;
  const sym = symbolById(profile.symbol);
  const badge = Math.round(size * 0.36);
  // Small avatars stay still; larger ones move gently.
  const animated = live ?? size >= 90;

  const disc = (
    <svg className={`avatar ${animated ? "avatar--live" : ""}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="30%" cy="25%" r="90%">
          <stop offset="0" stopColor={`hsl(${h} 90% 72%)`} />
          <stop offset="0.55" stopColor={`hsl(${(h + 40) % 360} 75% 48%)`} />
          <stop offset="1" stopColor={`hsl(${(h + 80) % 360} 70% 22%)`} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="50" cy="50" r={14 + i * 10} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      ))}
      {sym ? (
        <g transform="translate(14 14) scale(0.72)"><g className={`sym sym--${sym.id}`}>{sym.art}</g></g>
      ) : (
        <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="800" fill="#fff" fontFamily="var(--font)">
          {profile.name.slice(0, 1).toUpperCase()}
        </text>
      )}
    </svg>
  );

  if (!img) return disc;
  return (
    <span className="avatar avatar--photo" style={{ width: size, height: size }} aria-hidden="true">
      <img src={img} alt="" width={size} height={size} draggable={false} />
      {sym && (
        <svg className="avatar__badge" width={badge} height={badge} viewBox="0 0 100 100" style={{ background: `hsl(${(h + 40) % 360} 60% 32%)` }}>
          <g transform="translate(12 12) scale(0.76)">{sym.art}</g>
        </svg>
      )}
    </span>
  );
}

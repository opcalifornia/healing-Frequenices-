import type { Profile } from "../types";

/** Procedural profile avatar: layered gradient rings, seeded by hue. */
export function Avatar({ profile, size = 40 }: { profile: Pick<Profile, "name" | "hue">; size?: number }) {
  const h = profile.hue;
  const id = `av-${h}-${size}`;
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
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
      <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="800" fill="#fff" fontFamily="var(--font)">
        {profile.name.slice(0, 1).toUpperCase()}
      </text>
    </svg>
  );
}

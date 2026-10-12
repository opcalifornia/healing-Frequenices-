/** Original wordmark: a gradient sine glyph plus a lowercase wordmark set in Figtree. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo" role="img" aria-label="Healing Frequencies">
      <svg className="logo__mark" viewBox="0 0 40 24" width="40" height="24" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8b6cff" />
            <stop offset="1" stopColor="#19e3c4" />
          </linearGradient>
        </defs>
        <path
          d="M2 12c3-9 6-9 9 0s6 9 9 0 6-9 9 0 6 9 9 0"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="logo__word" aria-hidden="true">
          healing<span className="logo__thin">frequencies</span>
        </span>
      )}
    </span>
  );
}

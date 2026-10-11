import { APP_NAME } from "../brand";

/** Original mark: a sprout above the soil line with roots below, set beside a lowercase wordmark. */
export function RootedLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo logo--rooted" aria-label={APP_NAME}>
      <svg className="logo__mark" viewBox="0 0 28 32" width="26" height="30" aria-hidden="true">
        <defs>
          <linearGradient id="rooted-leaf" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#7fb77e" />
            <stop offset="1" stopColor="#d9e8a6" />
          </linearGradient>
          <linearGradient id="rooted-root" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e3a57a" />
            <stop offset="1" stopColor="#e3a57a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d="M14 15V7" stroke="url(#rooted-leaf)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14 9c-1-4.5-4.6-6.6-9-6 .2 4.4 3.6 7 9 6Z" fill="url(#rooted-leaf)" />
        <path d="M14 11c1.2-4 4.6-5.9 8.6-5.2-.4 4-3.6 6.2-8.6 5.2Z" fill="url(#rooted-leaf)" opacity="0.85" />
        <path d="M3 15.5h22" stroke="#e8d5b0" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M14 16v8m0-5c-2 1.6-4.5 2-6.5 5.5M14 19c2.2 1.4 4.6 2.4 6 5.8M14 23c-1 2-2.4 3-3.6 6M14 22c1.4 1.6 2.2 3.6 2.6 7" fill="none" stroke="url(#rooted-root)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {!compact && <span className="logo__word" aria-hidden="true">rooted</span>}
    </span>
  );
}

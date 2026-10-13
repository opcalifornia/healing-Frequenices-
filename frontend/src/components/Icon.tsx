const PATHS: Record<string, string> = {
  play: "M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z",
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  search: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM20 20l-4.8-4.8",
  barcode: "M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 9v6M11 9v6M13.5 9v6M16 9v6",
  close: "M6 6l12 12M18 6L6 18",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  chevronDown: "M5 9l7 7 7-7",
  back: "M19 12H5M11 6l-6 6 6 6",
  volume: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  mute: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5",
  home: "M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z",
  wave: "M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0",
  tv: "M4 6.5h16v11H4zM9 20.5h6M12 2.5l-3 3M12 2.5l3 3",
  book: "M4 5.5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6.5v13",
  bookmark: "M6.5 4h11v16.5l-5.5-4-5.5 4z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c1-4 4-5.5 7.5-5.5s6.5 1.5 7.5 5.5",
  timer: "M12 8v5l3 2M9.5 2.5h5M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  sliders: "M5 4v16M12 4v16M19 4v16M2.5 14h5M9.5 8h5M16.5 16h5",
  headphones: "M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1zM20 15h-3v5h2a1 1 0 0 0 1-1z",
  expand: "M5 15l7-7 7 7",
  stop: "M6.5 6.5h11v11h-11z",
  replay: "M4 12a8 8 0 1 0 2.5-5.8M4 4.5v4h4",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.5v.5",
  edit: "M4 20h4l10.5-10.5-4-4L4 16zM13.5 6.5l4 4",
  trash: "M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13",
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4M8 14h2M12 14h2M16 14h0M8 17h2M12 17h2",
  bell: "M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  message: "M4 5h16v11H9l-5 4z",
  leaf: "M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7",
  sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24, filled, className }: { name: IconName; size?: number; filled?: boolean; className?: string }) {
  const fill = filled ?? (name === "play" || name === "pause" || name === "stop");
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

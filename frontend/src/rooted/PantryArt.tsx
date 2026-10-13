import type { PantryCat } from "./pantryContent";

/** Category glyphs, drawn simply so each tile reads at a glance. */
const GLYPH: Record<PantryCat, JSX.Element> = {
  herb: <path d="M50 88V40m0 18c-12-4-20-14-20-28 14 2 20 12 20 28Zm0-8c10-6 20-8 26-20-12-2-24 4-26 20Zm0 22c-10-2-18-8-22-18 12 0 20 6 22 18Z" />,
  tea: <path d="M24 44h44v14c0 14-10 24-22 24S24 72 24 58V44Zm44 4h6a8 8 0 0 1 0 16h-7M36 34c-2-4 2-6 0-10m10 10c-2-4 2-6 0-10m10 10c-2-4 2-6 0-10" />,
  produce: <path d="M50 30c-14-10-32 0-30 20 2 22 18 34 30 30 12 4 28-8 30-30 2-20-16-30-30-20Zm0 0c0-8 4-14 10-16" />,
  grain: <path d="M50 88V24m0 12c-8 0-12-6-12-12 8 0 12 6 12 12Zm0 0c8 0 12-6 12-12-8 0-12 6-12 12Zm0 16c-8 0-12-6-12-12 8 0 12 6 12 12Zm0 0c8 0 12-6 12-12-8 0-12 6-12 12Zm0 16c-8 0-12-6-12-12 8 0 12 6 12 12Zm0 0c8 0 12-6 12-12-8 0-12 6-12 12Z" />,
  nut: <path d="M50 20c-18 0-26 18-26 34s10 28 26 28 26-12 26-28-8-34-26-34Zm0 0v62M34 40c6 4 26 4 32 0M32 60c8 4 28 4 36 0" />,
  fat: <path d="M50 18c-12 20-22 32-22 46a22 22 0 0 0 44 0c0-14-10-26-22-46Zm-10 50c2 6 6 9 12 10" />,
  ferment: <path d="M34 26h32v8H34zM30 34h40v42a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V34Zm10 18h20m-20 12h14" />,
  sea: <path d="M16 52c14-18 40-22 58-2l10-10v24L74 54c-18 20-44 16-58-2Zm52-4h.1" />,
  other: <path d="M50 20l8 18 20 2-15 13 5 20-18-10-18 10 5-20-15-13 20-2Z" />,
};

export function PantryArt({ cat, hue, className = "" }: { cat: PantryCat; hue: number; className?: string }) {
  return (
    <div className={`pantry-art ${className}`} style={{ "--h": hue } as React.CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {GLYPH[cat]}
      </svg>
    </div>
  );
}

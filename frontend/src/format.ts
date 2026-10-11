import type { Band, Goal, Title } from "./types";

export const GOAL_LABEL: Record<Goal, string> = {
  sleep: "Sleep",
  meditate: "Meditate",
  focus: "Focus",
  relax: "Relax",
  energize: "Energize",
};

export const BAND_LABEL: Record<Band, string> = {
  delta: "Delta",
  theta: "Theta",
  alpha: "Alpha",
  beta: "Beta",
  gamma: "Gamma",
};

export const BAND_RANGE: Record<Band, string> = {
  delta: "0.5–4 Hz",
  theta: "4–8 Hz",
  alpha: "8–13 Hz",
  beta: "13–30 Hz",
  gamma: "30+ Hz",
};

export function formatDuration(min?: number): string {
  if (!min) return "";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function formatHz(hz?: number): string {
  if (hz === undefined) return "";
  return `${Number.isInteger(hz) ? hz : hz.toFixed(hz < 10 ? 2 : 1).replace(/0$/, "")} Hz`;
}

/** Short metadata line shown on tiles, hero and detail pages. */
export function metaParts(t: Title): string[] {
  if (t.kind === "show") {
    const seasons = t.seasons?.length ?? 0;
    return [t.category ?? "Series", `${seasons} Season${seasons === 1 ? "" : "s"}`, String(t.year)];
  }
  const parts: string[] = [];
  if (t.kind === "program") parts.push("Deep Sync");
  if (t.band) parts.push(`${BAND_LABEL[t.band]} ${t.kind === "program" ? "journey" : formatHz(t.beat)}`);
  if (t.goal) parts.push(GOAL_LABEL[t.goal]);
  parts.push(formatDuration(t.durationMin));
  return parts;
}

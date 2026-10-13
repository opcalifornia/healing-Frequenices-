import type { CustomSession, Title } from "./types";
import { formatHz } from "./format";

const BANDS: Array<[Title["band"], number]> = [
  ["delta", 4],
  ["theta", 8],
  ["alpha", 13],
  ["beta", 30],
  ["gamma", Infinity],
];

export function bandFor(beat: number): NonNullable<Title["band"]> {
  return BANDS.find(([, hi]) => beat < hi)![0]!;
}

/** User-built sessions are played and displayed through the same Title shape. */
export function customToTitle(c: CustomSession): Title {
  return {
    id: c.id,
    kind: "session",
    name: c.name,
    tagline: `Your session: ${formatHz(c.carrier)} carrier, ${formatHz(c.beat)} beat.`,
    description: "A session you built. Carrier in the left ear, carrier plus beat in the right.",
    band: bandFor(c.beat),
    carrier: c.carrier,
    beat: c.beat,
    durationMin: 30,
    noise: c.noise,
    solfeggio: c.solfeggio,
    isochronic: c.isochronic,
    ambience: c.ambience ?? null,
    music: c.music ?? null,
    tags: ["custom"],
    year: new Date(c.createdAt).getFullYear(),
    art: { hue: Math.round((c.carrier - 100) * 1.2 + c.beat * 4) % 360, pattern: "interference" },
  };
}

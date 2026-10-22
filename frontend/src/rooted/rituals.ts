import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";
import data from "./rituals.json";

/**
 * Rituals: three daily drink blends, each paired with a binaural session.
 * All content lives in `rituals.json`; this file only gives it types.
 */

export type TimeOfDay = "morning" | "afternoon" | "night";

export interface Pairing {
  /** Name of another ingredient in the same recipe. */
  name: string;
  /** One line on why they go together. */
  why: string;
}

export interface Ingredient {
  name: string;
  dose: string;
  purpose: string;
  benefit: string;
  evidence: Strength;
  optional?: boolean;
  pairsWith: Pairing[];
}

export interface RitualSession {
  brainState: string;
  /** Beat frequency at the start and end of the session, in Hz. */
  beatHz: { start: number; end: number };
  /** Base tone for the left ear; the right ear is the left plus the beat. */
  carrierHz: number;
  leftHz: number;
  rightHz: { start: number; end: number };
  durationMin: number;
  durationOptions: number[];
  /** Length of the closing volume fade, in minutes. */
  fadeOutMin: number;
}

export interface Ritual {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  window: string;
  tagline: string;
  accentColor: string;
  accentColor2: string;
  /** "art:<id>" draws the built-in artwork; a path or URL uses that image instead. */
  heroImage: string;
  recipe: { serves: string; method: string; ingredients: Ingredient[] };
  session: RitualSession;
  cautions: string[];
  tips: string[];
  sources: Source[];
}

interface RitualsData {
  disclaimer: string;
  playerWarning: string;
  sessionEvidence: { level: Strength; text: string; source: Source };
  rituals: Ritual[];
}

const DATA = data as unknown as RitualsData;

export const RITUALS: Ritual[] = DATA.rituals;
export const RITUAL_DISCLAIMER = DATA.disclaimer;
export const PLAYER_WARNING = DATA.playerWarning;
export const SESSION_EVIDENCE = DATA.sessionEvidence;
export const ritualById = (id: string) => RITUALS.find((r) => r.id === id);

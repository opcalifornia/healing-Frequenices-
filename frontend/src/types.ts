import type { AmbienceId } from "./audio/ambience";
import type { MusicStyle } from "./audio/music";

export type Goal = "sleep" | "meditate" | "focus" | "relax" | "energize";
export type Band = "delta" | "theta" | "alpha" | "beta" | "gamma";
/** "surf" is brown noise shaped into slow ocean-like swells. */
export type NoiseColor = "pink" | "brown" | "surf";
export type TitleKind = "session" | "program" | "show";
export type ArtShape = "landscape" | "poster";

/** Mixer levels, each 0..1. */
export interface LayerMix {
  binaural: number;
  isochronic: number;
  solfeggio: number;
  noise: number;
  /** Nature soundscape (rain, waterfall, ...). */
  ambience: number;
  /** Generative music. */
  music: number;
}

/** An extra binaural pair layered under the main one. `level` is 0..1 of the main pair. */
export interface BinauralPair {
  carrier: number;
  beat: number;
  level: number;
}

/** One step of a long-form Deep Sync program. */
export interface Stage {
  /** Minutes from the start of the program. */
  at: number;
  beat: number;
  carrier?: number;
  label: string;
}

export interface Episode {
  id: string;
  number: number;
  name: string;
  description: string;
  durationMin: number;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  kind: TitleKind;
  name: string;
  tagline: string;
  description: string;
  goal?: Goal;
  band?: Band;
  carrier?: number;
  beat?: number;
  durationMin?: number;
  noise?: NoiseColor | null;
  solfeggio?: number | null;
  isochronic?: boolean;
  /** Additional binaural pairs played at the same time (layered beats). */
  pairs?: BinauralPair[];
  /** Nature soundscape layered under the tones. */
  ambience?: AmbienceId | null;
  /** Generative music style; undefined = pick from the goal, null = off. */
  music?: MusicStyle | null;
  mix?: Partial<LayerMix>;
  stages?: Stage[];
  tags: string[];
  year: number;
  isNew?: boolean;
  featured?: boolean;
  topRank?: number;
  comingSoon?: boolean;
  category?: string;
  host?: string;
  seasons?: Season[];
  /** Art direction: base hue 0..360 and pattern family. */
  art: { hue: number; pattern: "chladni" | "rings" | "wave" | "rosette" | "interference" };
}

export type RailType = "standard" | "top10" | "continue" | "custom" | "build";

export interface Rail {
  id: string;
  title: string;
  type: RailType;
  shape: ArtShape;
  titleIds: string[];
}

export interface Section {
  id: string;
  name: string;
  heroIds: string[];
  rails: Rail[];
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  readMin: number;
  hue: number;
  body: string[];
}

export interface Catalog {
  version: number;
  titles: Record<string, Title>;
  sections: Record<string, Section>;
  articles: Article[];
}

/** A user-built session saved to My Stuff. */
export interface CustomSession {
  id: string;
  name: string;
  carrier: number;
  beat: number;
  noise: NoiseColor | null;
  solfeggio: number | null;
  isochronic: boolean;
  ambience?: AmbienceId | null;
  music?: MusicStyle | null;
  createdAt: string;
}

export interface ContinueEntry {
  titleId: string;
  /** Seconds listened. */
  position: number;
  duration: number;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  hue: number;
  kids?: boolean;
  /** A healing symbol id from rooted/symbols.tsx. */
  symbol?: string | null;
}

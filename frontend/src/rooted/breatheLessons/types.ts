import type { Strength } from "../../learn/brainContent";
import type { Source } from "../pantryContent";

/** One piece of a lesson. Keep paragraphs short (2 to 4 sentences). */
export type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  /** key = the one thing to remember, try = something to do, care = a caution or limit of the evidence. */
  | { type: "callout"; tone: "key" | "try" | "care"; text: string }
  /** A single striking number or fact with a label. */
  | { type: "fact"; stat: string; label: string };

export type Level = "Start here" | "Go deeper" | "Expert";

export interface Lesson {
  /** Unique, kebab-case. */
  id: string;
  title: string;
  /** One sentence: what you'll understand after reading. */
  tagline: string;
  minutes: number;
  hue: number;
  level: Level;
  /** How strong the evidence is for the lesson's main claims, using the app's scale. */
  evidence: Strength;
  blocks: Block[];
  /** An exercise or tool in the app that goes with it. technique = a technique id from breathContent; to = an in-app route or #section. */
  tryIt?: { label: string; technique?: string; to?: string };
  /** Every source must be a real https URL you opened and read. */
  sources: Source[];
  /** Ids of Experts in experts.ts who work on this topic. */
  people?: string[];
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  institution: string;
  /** What they are known for, in one or two plain sentences. */
  known: string;
  /** What we can learn from their work. */
  teaches: string;
  /** Free resources by them (lab page, open papers, talks). Only links you opened. */
  free: Source[];
  /** Controversies, limits or things not to over-claim. */
  caution?: string;
}

export interface GlossaryTerm { term: string; plain: string }
export interface Myth { myth: string; truth: string; evidence: Strength; source?: Source }

/**
 * The sections of Rooted. The hub, nav and section headers all read from
 * here. `live: false` sections show on the hub as "Coming soon" so the shape
 * of the app is visible while it's being built.
 */

export type SectionId = "healing" | "nourish" | "breathe" | "move" | "combos" | "spirit" | "garden" | "places" | "support" | "earth" | "learn";

export interface RootedSection {
  id: SectionId;
  name: string;
  tagline: string;
  to: string;
  live: boolean;
  /** Bento footprint on the hub. */
  size: "xl" | "wide" | "tall" | "sm";
  /** Two accent colors for art and glow. */
  c1: string;
  c2: string;
}

export const SECTIONS: RootedSection[] = [
  { id: "healing", name: "Healing Frequencies", tagline: "Binaural sessions, shows and sleep, generated live", to: "/healing", live: true, size: "xl", c1: "#8b6cff", c2: "#19e3c4" },
  { id: "nourish", name: "Nourish", tagline: "Food, water and a smarter shopping list, by the evidence", to: "/nourish", live: true, size: "wide", c1: "#9ccc65", c2: "#e8b04a" },
  { id: "breathe", name: "Breathe", tagline: "Box, 4-7-8, the physiological sigh and more", to: "/breathe", live: true, size: "tall", c1: "#6ec6ff", c2: "#b3e5fc" },
  { id: "move", name: "Move", tagline: "Walks after meals, yoga, tai chi, qigong, sauna", to: "/move", live: false, size: "sm", c1: "#ff8a65", c2: "#ffcc80" },
  { id: "combos", name: "Combos", tagline: "Stack breath, sound and habit into one routine", to: "/combos", live: false, size: "sm", c1: "#f06292", c2: "#ffb74d" },
  { id: "learn", name: "Learn", tagline: "Guides to the brain, sleep and frequency safety", to: "/learn", live: true, size: "wide", c1: "#4db6ac", c2: "#c5e1a5" },
  { id: "spirit", name: "Spirit & Ritual", tagline: "Gratitude, sound baths, stillness", to: "/spirit", live: false, size: "sm", c1: "#b39ddb", c2: "#f8bbd0" },
  { id: "garden", name: "Garden & Apothecary", tagline: "Grow your own herbs and teas, safely", to: "/garden", live: false, size: "sm", c1: "#81c784", c2: "#a1887f" },
  { id: "places", name: "Healing Places", tagline: "Blue Zones, hot springs and retreats", to: "/places", live: false, size: "sm", c1: "#4fc3f7", c2: "#ffe082" },
  { id: "support", name: "Support", tagline: "Therapy, bodywork and people who can help", to: "/support", live: false, size: "sm", c1: "#90caf9", c2: "#ce93d8" },
  { id: "earth", name: "Earth & Give Back", tagline: "Vetted nonprofits, wildlife and your footprint", to: "/earth", live: false, size: "wide", c1: "#66bb6a", c2: "#26c6da" },
];

export const sectionById = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;

/** Paths that belong to the Healing Frequencies section. */
export const HEALING_PATHS = ["/healing", "/frequencies", "/shows", "/bedtime", "/build", "/title/", "/collection/"];
export const inHealing = (path: string) => HEALING_PATHS.some((p) => (p.endsWith("/") ? path.startsWith(p) : path === p));

/** Small offline prompts: the app's job is to get you off the app. */
export const OFFLINE_PROMPTS = [
  "Call someone you haven't talked to in a month. Just to say hi.",
  "Eat one meal today with no screen at the table.",
  "Get outside within an hour of waking, even for five minutes.",
  "Walk for ten minutes after your biggest meal.",
  "Write down three specific things that went right today.",
  "Leave your phone in another room for the first 30 minutes of the evening.",
  "Cook something from scratch and share it.",
  "Stand barefoot on grass or sand for a few minutes and just notice.",
  "Ask someone a question and listen to the whole answer.",
  "Put your phone on the charger outside the bedroom tonight.",
  "Spend ten minutes in a garden, park or anywhere green.",
  "Do one small thing for a neighbor.",
];

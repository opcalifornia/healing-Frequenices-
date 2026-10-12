import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PROGRAMS } from "./programs";
import { useUser } from "../store/user";
import { usePractice } from "../store/practice";
import { useNourish } from "../store/nourish";
import { useCalendar } from "../store/calendar";
import { useGarden } from "../store/garden";
import { useBedtime } from "../store/bedtime";
import { useJournal } from "../store/journal";
import { useSupport } from "../store/support";
import { useEarth } from "../store/earth";
import { useWellness } from "../store/wellness";
import { usePrograms } from "../store/programs";

/**
 * The catalog of everything Rooted can do, for the Guide page, plus a way to
 * tell which tools someone has already used from data the app already keeps.
 */

export const AREAS = ["Start here", "Calm & breath", "Body & movement", "Food", "Sleep & light", "Mind & spirit", "Plan & track", "Support", "Sound", "Your account"] as const;
export type Area = (typeof AREAS)[number];

/** Signals counted in a {@link TriedSnapshot}. A number above 0, or true, means "used". */
export type Signal =
  | "bolts" | "hearts" | "customs" | "checkIns" | "soundPrefs"
  | "listItems" | "waterDays"
  | "events" | "doneEvents" | "busy"
  | "garden" | "bedtimePlan" | "nights"
  | "safetyPlan" | "moods" | "pledges" | "deeds"
  | "onboarded" | "programs"
  | "listening" | "favorites" | "customSessions"
  | "profiles" | "signedIn" | "placesHome";

/**
 * How to tell a tool was used. Every tool also counts as tried once its id is in the
 * visited set (see {@link markVisited}), which covers tools that leave no data behind.
 */
export type TriedRule =
  /** A practice log kind. A trailing "*" matches a prefix, e.g. "breath:*". */
  | { log: string }
  | { has: Signal }
  /** Enrolled in a program from this section, or with this program id. */
  | { programSection: string }
  | { programId: string }
  /** A journal entry with this prompt. */
  | { journal: string };

export interface Feature {
  id: string;
  emoji: string;
  title: string;
  /** One plain sentence: what it does. */
  what: string;
  /** One honest sentence: why it helps. */
  why: string;
  area: Area;
  /** In-app route, with an optional #section anchor. */
  to: string;
  minutes?: number;
  triedBy?: TriedRule | TriedRule[];
}

export const FEATURES: Feature[] = [
  /* ---------------- Start here ---------------- */
  { id: "about-you", emoji: "🧭", title: "Tell us your goals", area: "Start here", to: "/about-you", minutes: 1, triedBy: { has: "onboarded" },
    what: "Pick what you want most, how active you are, how much time you have, and anything we should know about your health.",
    why: "Your daily plan, suggestions and safety notes are tailored to what you tell us." },
  { id: "daily-plan", emoji: "🌱", title: "Today's plan", area: "Start here", to: "/",
    what: "Home shows a few small things picked for your goals and the time of day, and checks them off as you go.",
    why: "A short, specific list is easier to start than a whole app full of choices." },
  { id: "one-minute-calm", emoji: "🌬️", title: "One-minute calm", area: "Start here", to: "/breathe", minutes: 1, triedBy: { log: "breath:calm" },
    what: "Follow a growing and shrinking circle, breathing in for 4 and out for 6. Quick picks below it start the right pattern for panic, sleep, focus or energy.",
    why: "Slow breathing with a longer exhale is one of the quickest ways to settle a racing body." },
  { id: "mood-check", emoji: "🙂", title: "How are you today?", area: "Start here", to: "/", triedBy: { has: "moods" },
    what: "Tap one of five faces on Home to check in. A low day gently surfaces support.",
    why: "Noticing how you feel, day to day, helps you see patterns and what's helping." },

  /* ---------------- Calm & breath ---------------- */
  { id: "breath-library", emoji: "🫁", title: "Breathing techniques", area: "Calm & breath", to: "/breathe#breathe", minutes: 2, triedBy: { log: "breath:*" },
    what: "Box breathing, 4-7-8, the physiological sigh, coherent and power breathing, each with when to use it and the evidence.",
    why: "Different patterns suit different moments, like panic, focus or falling asleep." },
  { id: "pattern-builder", emoji: "🎚️", title: "Build a breath pattern", area: "Calm & breath", to: "/breathe#breathe", minutes: 2, triedBy: { has: "customs" },
    what: "Set your own counts for breathing in, holding, breathing out and resting, then save it.",
    why: "A pattern that feels comfortable to you is one you'll actually use." },
  { id: "breath-sounds", emoji: "🔔", title: "Chimes, voice or tone", area: "Calm & breath", to: "/breathe", triedBy: { has: "soundPrefs" },
    what: "Choose how a breathing session guides you: chimes, a spoken voice, a tone or silence, with optional rain or stream sounds.",
    why: "Being guided by sound lets you close your eyes and stop watching the screen." },
  { id: "breath-results", emoji: "📈", title: "Before and after check-ins", area: "Calm & breath", to: "/breathe#results", triedBy: { has: "checkIns" },
    what: "Rate your stress before and after a session and see which techniques help you most.",
    why: "Your own results are a better guide than anyone's general advice." },
  { id: "breath-reminders", emoji: "⏰", title: "Breathing reminders", area: "Calm & breath", to: "/breathe#results",
    what: "Pick times of day and add daily breathing reminders to your phone's calendar.",
    why: "A reminder at the right moment turns a good intention into a habit." },
  { id: "heart-check", emoji: "❤️", title: "Camera heart check", area: "Calm & breath", to: "/breathe#heart", minutes: 2, triedBy: { has: "hearts" },
    what: "Rest a fingertip on your phone's camera to estimate your heart rate and see it respond to slow breathing.",
    why: "Watching your heart slow down shows you the effect is real. It's an estimate, not a medical test." },
  { id: "bolt", emoji: "⏱️", title: "Breath test (BOLT)", area: "Calm & breath", to: "/breathe#bolt", minutes: 1, triedBy: { has: "bolts" },
    what: "Time how long you can comfortably pause after a normal exhale, and track it week to week.",
    why: "A simple number to see whether your everyday breathing is getting calmer over time." },
  { id: "grounding", emoji: "🖐️", title: "5-4-3-2-1 grounding", area: "Calm & breath", to: "/breathe#ground", minutes: 2, triedBy: { log: "ground" },
    what: "A step-by-step walk through five things you see, four you feel, three you hear, two you smell and one you taste.",
    why: "Turning attention to your senses can interrupt a spiral of worry or panic." },
  { id: "pmr", emoji: "💪", title: "Muscle relaxation", area: "Calm & breath", to: "/breathe#relax", minutes: 3, triedBy: { log: "pmr" },
    what: "A guided round of tensing and then releasing each muscle group.",
    why: "Feeling the contrast teaches your body what letting go of tension feels like." },
  { id: "combos", emoji: "🧩", title: "Combos", area: "Calm & breath", to: "/combos", minutes: 5, triedBy: { log: "combo:*" },
    what: "Short guided flows that stack breath, movement, light and reflection, like Morning Armor, Evening Reset and Stress SOS.",
    why: "Linking a few small habits into one routine makes each one easier to keep." },

  /* ---------------- Body & movement ---------------- */
  { id: "move-routines", emoji: "🧘", title: "Follow-along routines", area: "Body & movement", to: "/move#routines", minutes: 10, triedBy: { log: "move:*" },
    what: "Press play on an after-meal walk, a desk reset, yoga, tai chi or qigong, with animated figures to follow.",
    why: "Seeing each move makes it easy to do it right, with no class or equipment." },
  { id: "muscle-map", emoji: "🦴", title: "Muscle map", area: "Body & movement", to: "/move#works",
    what: "See which muscles each routine reaches, highlighted on a body diagram.",
    why: "Knowing what a routine works helps you pick one for how your body feels today." },
  { id: "nature-dose", emoji: "🌳", title: "Your nature dose", area: "Body & movement", to: "/places#dose",
    what: "Slide to your minutes outdoors this week and see how close you are to about two hours.",
    why: "Research links roughly two hours a week in nature with better health and wellbeing." },
  { id: "blue-zones", emoji: "🗺️", title: "Blue Zones and healing places", area: "Body & movement", to: "/places#zones",
    what: "Explore the five places known for long lives, the nine habits they share, and nature spots that may help you feel better.",
    why: "The habits of long-lived communities are simple and borrowable." },
  { id: "bring-home", emoji: "🏡", title: "Bring it home checklist", area: "Body & movement", to: "/places#home", triedBy: { has: "placesHome" },
    what: "Tick off small weekly ways to bring a healing place into ordinary life, and schedule a nature walk.",
    why: "You don't need a retreat. A little every week adds up." },

  /* ---------------- Food ---------------- */
  { id: "plate-builder", emoji: "🍽️", title: "Plate builder", area: "Food", to: "/nourish#plate", minutes: 2,
    what: "Tap foods to build a plate and compare it with the Healthy Eating Plate.",
    why: "A simple picture of a balanced meal is easier to follow than counting." },
  { id: "water", emoji: "💧", title: "Water tracker", area: "Food", to: "/nourish#water", triedBy: { has: "waterDays" },
    what: "Tap to log glasses of water and watch the glass fill toward your daily goal.",
    why: "Many people drink less than they think. A quick tap makes it visible." },
  { id: "pantry", emoji: "🥦", title: "Pantry and body map", area: "Food", to: "/nourish#pantry",
    what: "Look up foods, herbs and spices, see where in the body the research suggests they may help, and how strong the evidence is.",
    why: "Honest evidence ratings help you spend on food that's worth it." },
  { id: "shopping-list", emoji: "🛒", title: "Shopping list", area: "Food", to: "/nourish#pantry", triedBy: { has: "listItems" },
    what: "Add pantry items to a list grouped by store aisle, check them off as you shop, and plan a grocery trip.",
    why: "A list made while you're thinking about health keeps the good stuff in your cart." },
  { id: "store-finder", emoji: "📍", title: "Store finder", area: "Food", to: "/nourish#pantry",
    what: "See which kinds of shops carry what's on your list, and open a map search for ones near you.",
    why: "Knowing where to go saves a wasted trip." },
  { id: "recipes", emoji: "🥣", title: "Pantry recipes", area: "Food", to: "/nourish#recipes", minutes: 20,
    what: "Simple meals from pantry staples, with steps, timing and a button to schedule cooking.",
    why: "Cooking at home is one of the easiest ways to eat more fiber and less sugar." },
  { id: "digestion", emoji: "🌀", title: "Inside your gut", area: "Food", to: "/nourish#gut",
    what: "Follow a bite through your body, see how fiber works, and why a walk after meals flattens blood sugar.",
    why: "Understanding the why makes small food changes feel worth it." },
  { id: "garden", emoji: "🌿", title: "Plan your garden", area: "Food", to: "/garden#plan", triedBy: { has: "garden" },
    what: "Tell us your space and light, get herbs and vegetables that suit it, and track what you've planted.",
    why: "Growing even a few herbs gets you outside, moving and eating fresher food." },
  { id: "apothecary", emoji: "🍵", title: "Home apothecary", area: "Food", to: "/garden#apothecary",
    what: "Simple teas and remedies from what you grow, with safety rules for each.",
    why: "Some herbs have useful evidence behind them, and some interact with medicines. Both matter." },

  /* ---------------- Sleep & light ---------------- */
  { id: "bedtime", emoji: "🌙", title: "Bedtime routine", area: "Sleep & light", to: "/bedtime", minutes: 30, triedBy: [{ has: "bedtimePlan" }, { has: "nights" }],
    what: "Set your bedtime and wake time, pick a wind-down and sleep session, get a reminder, and track your streak.",
    why: "A steady wind-down and a regular schedule are two of the best-supported sleep habits." },
  { id: "light-box", emoji: "☀️", title: "Light box timer", area: "Sleep & light", to: "/light#tools", minutes: 20, triedBy: { log: "light" },
    what: "Time a morning light session, outdoors or with a light box.",
    why: "Bright morning light helps set your body clock, which can improve sleep and mood." },
  { id: "night-light", emoji: "🕯️", title: "Night light and sunrise", area: "Sleep & light", to: "/light#tools",
    what: "Turn your screen into a dim amber night light, or a slow red-to-white sunrise for waking up.",
    why: "Warm, dim light at night disturbs your body clock the least." },
  { id: "light-day", emoji: "🌅", title: "Your light day", area: "Sleep & light", to: "/light#day",
    what: "A timeline of when to get bright light and when to keep it dim, based on your wake time.",
    why: "Bright days and dark nights are the simplest way to work with your body clock." },
  { id: "sleep-guide", emoji: "😴", title: "Better sleep guide", area: "Sleep & light", to: "/learn/sleep", minutes: 8,
    what: "How your sleep clock works, plus morning, evening, caffeine, temperature and nap habits.",
    why: "Small, well-supported changes often help more than any gadget." },

  /* ---------------- Mind & spirit ---------------- */
  { id: "sound-bath", emoji: "🎐", title: "Sound bath", area: "Mind & spirit", to: "/spirit#sound", minutes: 10, triedBy: { log: "soundbath" },
    what: "Strike singing bowls, chimes and a gong, or let a sound bath play by itself. All synthesized live.",
    why: "Many people find it a calming focus point for rest or meditation." },
  { id: "meditate", emoji: "🪷", title: "Meditation timer", area: "Mind & spirit", to: "/spirit#sit", minutes: 5, triedBy: { log: "meditate" },
    what: "A quiet timer with a gentle bell, plus a diagram of what stillness changes in your body under stress.",
    why: "Regular short sits are linked with lower stress for many people." },
  { id: "gratitude", emoji: "📝", title: "Gratitude journal", area: "Mind & spirit", to: "/spirit#gratitude", minutes: 3, triedBy: { journal: "Three good things" },
    what: "Write down three good things from today and keep a private streak.",
    why: "Noticing good moments is linked with small but real lifts in mood." },
  { id: "brain-guide", emoji: "🧠", title: "Inside your brain", area: "Mind & spirit", to: "/learn/brain", minutes: 10,
    what: "An illustrated guide to brain regions, brainwaves, hearing, sleep and what the evidence says about sound.",
    why: "Knowing how your brain works helps you judge wellness claims for yourself." },
  { id: "pledges", emoji: "🌍", title: "Footprint pledges", area: "Mind & spirit", to: "/earth#habits", triedBy: { has: "pledges" },
    what: "Pledge small habits that lighten your footprint, with an honest impact rating on each.",
    why: "Acting on what you care about is linked with a sense of purpose." },
  { id: "good-deeds", emoji: "🤝", title: "Good deeds log", area: "Mind & spirit", to: "/earth#deeds", triedBy: { has: "deeds" },
    what: "Jot down kind things you did and see how many this week, with ideas when you're stuck.",
    why: "Kindness is linked with better mood for the giver, too." },

  /* ---------------- Plan & track ---------------- */
  { id: "calendar", emoji: "📅", title: "Health calendar", area: "Plan & track", to: "/calendar", triedBy: [{ has: "events" }, { has: "doneEvents" }],
    what: "Schedule walks, breathing, meals and appointments, repeat them, and check them off.",
    why: "Habits with a set time are far more likely to happen." },
  { id: "plan-day", emoji: "🪄", title: "Plan my day", area: "Plan & track", to: "/calendar",
    what: "Let Rooted fit a few small practices into the free gaps in your day.",
    why: "It does the fitting-in for you, so a busy day still has room to breathe." },
  { id: "work-import", emoji: "💼", title: "Import your work calendar", area: "Plan & track", to: "/calendar#connect", triedBy: { has: "busy" },
    what: "Bring in meetings and shifts from a calendar file as gray busy blocks, so plans fit around them. They stay on this device.",
    why: "Seeing health plans beside real commitments keeps them realistic." },
  { id: "calendar-export", emoji: "📤", title: "Send to Apple or Google", area: "Plan & track", to: "/calendar#connect",
    what: "Send events to Apple, Google or Outlook with a 5-minute reminder, or, when signed in, subscribe with a live link.",
    why: "Reminders show up where you already look every day." },
  { id: "programs", emoji: "🎯", title: "Daily programs", area: "Plan & track", to: "/breathe#programs", minutes: 10, triedBy: { has: "programs" },
    what: "Multi-day programs, like 7 Days to Calmer or 5 Gentle Mornings, with one short lesson a day.",
    why: "A day-by-day path removes the guesswork about what to do next." },
  { id: "week", emoji: "📊", title: "Your week", area: "Plan & track", to: "/week",
    what: "A recap of your minutes, sessions, mood, water and calendar over the last seven days.",
    why: "Seeing progress, even small, keeps you going." },
  { id: "share-card", emoji: "🖼️", title: "Share cards", area: "Plan & track", to: "/week",
    what: "Make a picture of your week or a finished program to share or save.",
    why: "Sharing a win with a friend can help you stick with it." },
  { id: "invite", emoji: "💌", title: "Invite a friend", area: "Plan & track", to: "/week",
    what: "Send a friend a link to join you, or to do a program together.",
    why: "Doing a habit with someone else makes it more likely you'll both keep it." },

  /* ---------------- Support ---------------- */
  { id: "crisis-lines", emoji: "📞", title: "Help now", area: "Support", to: "/support#now",
    what: "Crisis lines to call or text any time. The heart button at the top of every page opens them too.",
    why: "When things are really hard, talking to someone right away matters most." },
  { id: "safety-plan", emoji: "🛟", title: "Safety plan", area: "Support", to: "/support#plan", minutes: 10, triedBy: { has: "safetyPlan" },
    what: "Write down your warning signs, what helps, and who to call, ready for hard moments. Private to this device.",
    why: "Safety plans are recommended by crisis professionals because they help in the moment." },
  { id: "worried", emoji: "🫶", title: "Worried about someone", area: "Support", to: "/support#worried",
    what: "What to say, what to avoid, and how to help someone who's struggling.",
    why: "Asking directly and listening well can make a real difference." },
  { id: "therapy", emoji: "🛋️", title: "Therapy and bodywork", area: "Support", to: "/support#therapy",
    what: "Therapies with good evidence, how to find a therapist, questions to ask, and what massage, acupuncture and more can and can't do.",
    why: "Knowing your options makes it easier to take the first step toward care." },

  /* ---------------- Sound ---------------- */
  { id: "healing-sessions", emoji: "🎧", title: "Healing Frequencies sessions", area: "Sound", to: "/healing", minutes: 20, triedBy: { has: "listening" },
    what: "Binaural beat sessions for sleep, focus and calm, generated live in your browser.",
    why: "Many people find steady, gentle sound helps them relax or focus. Evidence is mixed, and we say so." },
  { id: "shows", emoji: "📺", title: "Shows", area: "Sound", to: "/shows",
    what: "Longer multi-part listening series you can play in order.",
    why: "A series gives you something to come back to each day." },
  { id: "sound-mixer", emoji: "🎛️", title: "Mix your sound", area: "Sound", to: "/frequencies",
    what: "In the full-screen player, add music, nature sounds or a solfeggio tone, set a sleep timer, and check your headphones.",
    why: "The right mix is the one you enjoy enough to keep listening to." },
  { id: "build-session", emoji: "🛠️", title: "Build your own session", area: "Sound", to: "/build", minutes: 2, triedBy: { has: "customSessions" },
    what: "Pick a carrier tone, beat, noise and layers, name it, and save it.",
    why: "Tuning a session to your own ears makes it more pleasant to use." },
  { id: "my-stuff", emoji: "🔖", title: "My Stuff", area: "Sound", to: "/my-stuff", triedBy: { has: "favorites" },
    what: "Your saved list, sessions you've built, what you were listening to, and reminders.",
    why: "Everything you like, in one place." },
  { id: "safety-guide", emoji: "🛡️", title: "Frequency safety guide", area: "Sound", to: "/learn/safety", minutes: 6,
    what: "Safe volumes, flashing light, low frequencies, headphones and common myths about sound.",
    why: "Listening safely protects your hearing and keeps sessions comfortable." },

  /* ---------------- Your account ---------------- */
  { id: "profiles", emoji: "👥", title: "Profiles", area: "Your account", to: "/profiles", triedBy: { has: "profiles" },
    what: "Add a profile for each person in your home so plans, logs and lists stay separate.",
    why: "Everyone gets suggestions that fit them." },
  { id: "account", emoji: "🔐", title: "Sign in and sync", area: "Your account", to: "/account", triedBy: { has: "signedIn" },
    what: "Create an account to back up your data and use Rooted on more than one device.",
    why: "You won't lose your progress if you change phones." },
  { id: "your-data", emoji: "🗂️", title: "Your data", area: "Your account", to: "/your-data",
    what: "See what's kept, download it, back up private notes if you choose, or delete it all.",
    why: "Your health data is yours. You stay in control of it." },
  { id: "legal", emoji: "📜", title: "Privacy, terms and disclaimer", area: "Your account", to: "/privacy",
    what: "Plain-language privacy policy, terms of use, and a health disclaimer.",
    why: "Know exactly what Rooted does with your information, and what it isn't." },
];

/* ------------------------------------------------------------------ */
/* Tried inference                                                     */
/* ------------------------------------------------------------------ */

/** A plain snapshot of what the active profile has stored. Every field is optional. */
export interface TriedSnapshot {
  logs?: Array<{ kind: string; before?: number; after?: number }>;
  counts?: Partial<Record<Signal, number | boolean>>;
  /** Enrolled program ids. */
  programs?: string[];
  journal?: Array<{ prompt: string }>;
  visited?: string[];
}

const PROGRAM_SECTION: Record<string, string> = Object.fromEntries(PROGRAMS.map((p) => [p.id, p.section]));

function matches(rule: TriedRule, s: TriedSnapshot, kinds: Set<string>): boolean {
  if ("log" in rule) {
    if (rule.log.endsWith("*")) {
      const pre = rule.log.slice(0, -1);
      for (const k of kinds) if (k.startsWith(pre)) return true;
      return false;
    }
    return kinds.has(rule.log);
  }
  if ("has" in rule) {
    const v = s.counts?.[rule.has];
    return typeof v === "number" ? v > 0 : !!v;
  }
  if ("programSection" in rule) return (s.programs ?? []).some((id) => PROGRAM_SECTION[id] === rule.programSection);
  if ("programId" in rule) return (s.programs ?? []).includes(rule.programId);
  return (s.journal ?? []).some((j) => j.prompt === rule.journal);
}

/** Which feature ids this person has used, from stored data and visits. Pure. */
export function triedFeatures(s: TriedSnapshot, features: Feature[] = FEATURES): Set<string> {
  const kinds = new Set((s.logs ?? []).map((l) => l.kind));
  const visited = new Set(s.visited ?? []);
  const out = new Set<string>();
  for (const f of features) {
    if (visited.has(f.id)) {
      out.add(f.id);
      continue;
    }
    const rules = f.triedBy ? (Array.isArray(f.triedBy) ? f.triedBy : [f.triedBy]) : [];
    if (rules.some((r) => matches(r, s, kinds))) out.add(f.id);
  }
  return out;
}

/** Store states, shaped like the zustand stores (only the fields we read). */
export interface RawStores {
  practice?: { logs?: Record<string, Array<{ kind: string; before?: number; after?: number }>>; customs?: Record<string, unknown[]>; bolts?: Record<string, unknown[]>; hearts?: Record<string, unknown[]>; prefs?: { sound?: string; scape?: string } };
  nourish?: { lists?: Record<string, unknown[]>; water?: Record<string, Record<string, number>> };
  calendar?: { events?: Record<string, Array<{ done?: Record<string, true> }>>; busy?: Record<string, unknown[]> };
  garden?: { beds?: Record<string, unknown[]> };
  bedtime?: { plans?: Record<string, unknown>; nights?: Record<string, string[]> };
  journal?: { entries?: Record<string, Array<{ prompt: string }>> };
  support?: { plans?: Record<string, Record<string, string[] | undefined>>; moods?: Record<string, Record<string, number>> };
  earth?: { pledges?: Record<string, string[]>; deeds?: Record<string, unknown[]> };
  wellness?: { about?: Record<string, { onboarded?: boolean; firstWin?: unknown }> };
  programs?: { enrolled?: Record<string, Record<string, unknown>> };
  user?: { token?: string | null; profiles?: Array<{ id: string }>; libraries?: Record<string, { favorites?: unknown[]; continue?: unknown[]; custom?: unknown[] }> };
  /** Checked items in the Places "Bring it home" list. */
  placesHome?: Record<string, unknown>;
}

const DEFAULT_PROFILE_IDS = new Set(["p-main", "p-guest"]);
const len = (x: unknown[] | undefined | null) => x?.length ?? 0;

/** Build a {@link TriedSnapshot} for one profile from raw store states. Pure. */
export function snapshotFor(raw: RawStores, pid: string, visited: string[] = []): TriedSnapshot {
  const logs = raw.practice?.logs?.[pid] ?? [];
  const water = raw.nourish?.water?.[pid] ?? {};
  const events = raw.calendar?.events?.[pid] ?? [];
  const plan = raw.support?.plans?.[pid] ?? {};
  const lib = raw.user?.libraries?.[pid];
  const prefs = raw.practice?.prefs;
  return {
    logs,
    programs: Object.keys(raw.programs?.enrolled?.[pid] ?? {}),
    journal: raw.journal?.entries?.[pid] ?? [],
    visited,
    counts: {
      bolts: len(raw.practice?.bolts?.[pid]),
      hearts: len(raw.practice?.hearts?.[pid]),
      customs: len(raw.practice?.customs?.[pid]),
      checkIns: logs.filter((l) => l.before !== undefined || l.after !== undefined).length,
      soundPrefs: !!prefs && ((prefs.sound !== undefined && prefs.sound !== "chimes") || (prefs.scape !== undefined && prefs.scape !== "none")),
      listItems: len(raw.nourish?.lists?.[pid]),
      waterDays: Object.values(water).filter((ml) => ml > 0).length,
      events: events.length,
      doneEvents: events.filter((e) => e.done && Object.keys(e.done).length > 0).length,
      busy: len(raw.calendar?.busy?.[pid]),
      garden: len(raw.garden?.beds?.[pid]),
      bedtimePlan: !!raw.bedtime?.plans?.[pid],
      nights: len(raw.bedtime?.nights?.[pid]),
      safetyPlan: Object.values(plan).filter((lines) => (lines ?? []).some((l) => l.trim())).length,
      moods: Object.keys(raw.support?.moods?.[pid] ?? {}).length,
      pledges: len(raw.earth?.pledges?.[pid]),
      deeds: len(raw.earth?.deeds?.[pid]),
      onboarded: !!raw.wellness?.about?.[pid]?.onboarded,
      programs: Object.keys(raw.programs?.enrolled?.[pid] ?? {}).length,
      listening: len(lib?.continue),
      favorites: len(lib?.favorites),
      customSessions: len(lib?.custom),
      profiles: (raw.user?.profiles ?? []).filter((p) => !DEFAULT_PROFILE_IDS.has(p.id)).length,
      signedIn: !!raw.user?.token,
      placesHome: Object.keys(raw.placesHome ?? {}).length,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Visited: tools that leave no data behind (reading a guide, etc.)    */
/* ------------------------------------------------------------------ */

interface VisitedState {
  visited: Record<string, string[]>;
  mark(id: string): void;
}

export const useVisited = create<VisitedState>()(
  persist(
    (set, get) => ({
      visited: {},
      mark(id) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        const mine = get().visited[pid] ?? [];
        if (mine.includes(id)) return;
        set({ visited: { ...get().visited, [pid]: [...mine, id] } });
      },
    }),
    { name: "rooted-guide-visited", version: 1 },
  ),
);

/** Remember that the active profile has opened this tool. */
export function markVisited(id: string): void {
  useVisited.getState().mark(id);
}

/** Call from a page or tool to count it as tried once it's opened. */
export function useMarkVisited(id: string): void {
  useEffect(() => {
    markVisited(id);
  }, [id]);
}

const PLACES_HOME_KEY = "rooted.places.home";
function readPlacesHome(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(PLACES_HOME_KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

const NONE: string[] = [];

/** The set of feature ids the active profile has tried, kept up to date with the stores. */
export function useTried(): Set<string> {
  const user = useUser();
  const pid = user.activeProfileId ?? "guest";
  const practice = usePractice();
  const nourish = useNourish();
  const calendar = useCalendar();
  const garden = useGarden();
  const bedtime = useBedtime();
  const journal = useJournal();
  const support = useSupport();
  const earth = useEarth();
  const wellness = useWellness();
  const programs = usePrograms();
  const visited = useVisited((s) => s.visited[pid] ?? NONE);
  return useMemo(
    () => triedFeatures(snapshotFor({ practice, nourish, calendar, garden, bedtime, journal, support, earth, wellness, programs, user, placesHome: readPlacesHome() }, pid, visited)),
    [practice, nourish, calendar, garden, bedtime, journal, support, earth, wellness, programs, user, pid, visited],
  );
}

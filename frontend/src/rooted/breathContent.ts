import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";
import type { CustomPattern } from "../store/practice";

export type PhaseKind = "in" | "top" | "hold" | "out" | "rest";
export interface Phase {
  kind: PhaseKind;
  secs: number;
  say: string;
}

export interface Technique {
  id: string;
  name: string;
  short: string;
  when: string;
  /** One cycle; repeats until time is up. */
  cycle: Phase[];
  minutes: number[];
  evidence: Strength;
  why: string;
  sources: Source[];
  hue: number;
  /** Goal of a frequency session to suggest afterwards. */
  next: "relax" | "sleep" | "focus" | "energize" | "meditate";
  /** Needs the safety gate before it starts. */
  gated?: boolean;
  /** Pacer shape: an orb, or a path the dot traces (box for 4-part, triangle for 3-part). */
  shape?: "orb" | "box" | "triangle";
  /** Made by the person in the pattern builder. */
  custom?: boolean;
  /** Power breathing runs rounds instead of a fixed cycle. */
  rounds?: { breaths: number; maxHold: number; recoveryHold: number; count: number };
}

const BALBAN: Source = { text: "Balban MY et al. Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 2023", url: "https://doi.org/10.1016/j.xcrm.2022.100895" };

const ZACCARO: Source = { text: "Zaccaro A et al. How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 2018", url: "https://doi.org/10.3389/fnhum.2018.00353" };
const LEHRER_HRV: Source = { text: "Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta-analysis. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" };
const CLEVELAND_PURSED: Source = { text: "Cleveland Clinic: Pursed-lip breathing", url: "https://my.clevelandclinic.org/health/treatments/9443-pursed-lip-breathing" };

export const TECHNIQUES: Technique[] = [
  {
    id: "calm", name: "Settle in", short: "4 in · 6 out", when: "Any time you feel wound up. A gentle place to begin.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "out", secs: 6, say: "Breathe out" }],
    minutes: [1, 3, 5], evidence: "Moderate", hue: 160, next: "relax",
    why: "Breathing out for longer than you breathe in, at around six breaths a minute, shifts your body toward its relaxed, rest-and-digest mode. Slow-paced breathing reliably raises heart rate variability, a marker of that shift.",
    sources: [{ text: "Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta-analysis. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }],
  },
  {
    id: "sigh", name: "Physiological sigh", short: "In, top up, long out", when: "The fastest reset when stress spikes. Even one or two help.",
    cycle: [{ kind: "in", secs: 2.5, say: "Breathe in through your nose" }, { kind: "top", secs: 1, say: "Sip in a little more" }, { kind: "out", secs: 6, say: "Long, slow breath out" }],
    minutes: [1, 3, 5], evidence: "Moderate", hue: 200, next: "relax",
    why: "In a Stanford trial of 111 people, five minutes a day of cyclic sighing for a month improved mood and lowered breathing rate more than mindfulness meditation did. The double inhale re-opens tiny air sacs in the lungs; the long exhale slows the heart.",
    sources: [BALBAN],
  },
  {
    id: "box", name: "Box breathing", short: "4 · 4 · 4 · 4", when: "Before a big moment: a meeting, a game, a hard conversation.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "hold", secs: 4, say: "Hold" }, { kind: "out", secs: 4, say: "Breathe out" }, { kind: "rest", secs: 4, say: "Hold" }],
    minutes: [2, 4, 6], evidence: "Weak", hue: 230, next: "focus", shape: "box",
    why: "Used by military and first responders to stay steady under pressure. In the same Stanford trial, box breathing improved mood too, a little less than cyclic sighing. Research on it alone is limited.",
    sources: [BALBAN],
  },
  {
    id: "478", name: "4-7-8 breathing", short: "4 in · 7 hold · 8 out", when: "In bed, to help you drift off. Popularized by Dr. Andrew Weil.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in through your nose" }, { kind: "hold", secs: 7, say: "Hold" }, { kind: "out", secs: 8, say: "Whoosh out through your mouth" }],
    minutes: [1, 2, 4], evidence: "Weak", hue: 265, next: "sleep", shape: "triangle",
    why: "A very long exhale with a hold slows breathing to about three breaths a minute. Small studies show short-term drops in heart rate and blood pressure. It may feel light-headed at first; start with four cycles.",
    sources: [{ text: "Vierra J et al. Effects of sleep deprivation and 4-7-8 breathing control on heart rate variability, blood pressure, blood glucose, and endothelial function in healthy young adults. Physiol Rep, 2022", url: "https://doi.org/10.14814/phy2.15389" }],
  },
  {
    id: "coherent", name: "Coherent breathing", short: "5.5 in · 5.5 out", when: "A steady 10-minute practice for everyday resilience.",
    cycle: [{ kind: "in", secs: 5.5, say: "Breathe in" }, { kind: "out", secs: 5.5, say: "Breathe out" }],
    minutes: [5, 10, 20], evidence: "Moderate", hue: 180, next: "meditate",
    why: "About five and a half breaths a minute lines your breathing up with your heart's natural rhythm (resonance). A meta-analysis of 58 studies found practicing this pace improves anxiety, stress and mood.",
    sources: [{ text: "Lehrer P et al. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }],
  },
  {
    id: "belly", name: "Belly breathing", short: "4 in · 6 out, low and slow", when: "When your shoulders are tight and your breath feels high in your chest. Good for learning to breathe from the diaphragm.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in and let your belly rise" }, { kind: "out", secs: 6, say: "Breathe out and let your belly soften" }],
    minutes: [2, 5, 10], evidence: "Mixed", hue: 140, next: "relax",
    why: "Slow breathing from the diaphragm slows breathing rate, pulse and blood pressure. A systematic review of it as a stand-alone stress practice found only a few well-run studies, so the evidence is encouraging but not strong. It's a good base for every other technique.",
    sources: [{ text: "Hopper SI et al. Effectiveness of diaphragmatic breathing for reducing physiological and psychological stress in adults: a systematic review. JBI Database of Systematic Reviews and Implementation Reports, 2019", url: "https://doi.org/10.11124/JBISRIR-2017-003848" }],
  },
  {
    id: "alternate", name: "Alternate nostril breathing", short: "Left in · right out · right in · left out", when: "A steadying practice for a busy mind. Rest your right hand on your face and close one nostril at a time.",
    cycle: [{ kind: "in", secs: 4, say: "In through the left nostril" }, { kind: "out", secs: 4, say: "Out through the right" }, { kind: "in", secs: 4, say: "In through the right" }, { kind: "out", secs: 4, say: "Out through the left" }],
    minutes: [2, 5, 8], evidence: "Mixed", hue: 190, next: "relax", shape: "box",
    why: "A 2024 analysis of six trials with 525 people found it lowered blood pressure more than no intervention. But the trials were small, often unblinded, and varied a lot, so the result should be read with care. Evidence for stress and anxiety specifically is thinner.",
    sources: [{ text: "Nam et al. Effectiveness of alternative nostril breathing on blood pressure: a systematic review and meta-analysis of randomized controlled trials. Complementary Medicine Research, 2024", url: "https://karger.com/cmr/article/31/5/449/910373/Effectiveness-of-Alternative-Nostril-Breathing-on" }],
  },
  {
    id: "humming", name: "Humming breath", short: "4 in · 8 hum out", when: "When you want something to focus on. The soft hum gives your attention an anchor, and it's discreet enough for a quiet room.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in through your nose" }, { kind: "out", secs: 8, say: "Hum gently as you breathe out" }],
    minutes: [2, 5, 8], evidence: "Weak", hue: 280, next: "relax",
    why: "Studies of humming breath (bhramari) are small and mostly without control groups. They report better heart rate variability and lower anxiety scores, but the long, slow out-breath is probably doing much of the work, as in other slow-breathing practices. Treat it as a pleasant, low-risk option rather than a proven one.",
    sources: [{ text: "Zaccaro A et al. How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 2018", url: "https://doi.org/10.3389/fnhum.2018.00353" }, { text: "University of Pittsburgh. Effects of bhramari (humming) breath compared with slow breathing on heart rate variability (unpublished master's thesis, 20 healthy adults)", url: "https://d-scholarship.pitt.edu/43615/" }],
  },
  {
    id: "triangle", name: "Triangle breathing", short: "4 in · 4 hold · 4 out", when: "A simple pattern for racing thoughts, when box breathing feels like one step too many.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "hold", secs: 4, say: "Hold gently" }, { kind: "out", secs: 4, say: "Breathe out" }],
    minutes: [1, 3, 5], evidence: "Weak", hue: 320, next: "relax", shape: "triangle",
    why: "A three-part rhythm gives your mind something simple to follow, and slow, even breathing is what most of the research on breathing and stress supports. There's no research on this exact pattern, so we rate it as early evidence.",
    sources: [{ text: "Zaccaro A et al. How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 2018", url: "https://doi.org/10.3389/fnhum.2018.00353" }],
  },
  {
    id: "resonance", name: "Resonance breathing", short: "5 in · 5 out, six breaths a minute", when: "A steady daily practice. Slow, even breathing around six breaths a minute is the pace most studied for heart rate variability.",
    cycle: [{ kind: "in", secs: 5, say: "Breathe in" }, { kind: "out", secs: 5, say: "Breathe out" }],
    minutes: [5, 10, 20], evidence: "Strong", hue: 190, next: "meditate",
    why: "Breathing at about six breaths a minute reliably raises heart rate variability, a sign of a flexible, well-regulated heart rhythm. The effect on mood and stress is smaller and less certain than the effect on the heart. Clinicians who use heart rate variability biofeedback find each person's best pace, usually between 4.5 and 6.5 breaths a minute. Try the pace finder below to see which feels easiest for you.",
    sources: [ZACCARO, LEHRER_HRV],
  },
  {
    id: "extended", name: "Longer breath out", short: "4 in · 8 out", when: "When you want a slower, softer pace than six a minute. No holds, nothing forced.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in through your nose" }, { kind: "out", secs: 8, say: "Slowly breathe out" }],
    minutes: [2, 5, 10], evidence: "Weak", hue: 205, next: "relax",
    why: "Making the out-breath longer than the in-breath is a common feature of slow-breathing practices, and the Stanford trial of cyclic sighing points to the long exhale as the likely active ingredient. Direct evidence for a specific ratio is limited, so use whichever ratio feels easy.",
    sources: [BALBAN],
  },
  {
    id: "pursed", name: "Pursed-lip breathing", short: "In through the nose · out through pursed lips", when: "When you feel short of breath after effort, or want an easy way to slow your breathing. Used in lung care.",
    cycle: [{ kind: "in", secs: 2, say: "Breathe in through your nose" }, { kind: "out", secs: 4, say: "Out slowly through pursed lips, like blowing on soup" }],
    minutes: [1, 3, 5], evidence: "Moderate", hue: 215, next: "relax",
    why: "Breathing out slowly through pursed lips keeps your airways open a little longer and slows your breathing. It is taught in lung rehabilitation for breathlessness. For people without a lung condition it is simply an easy way to slow down. If you have a lung condition, ask your clinician how to use it.",
    sources: [CLEVELAND_PURSED],
  },
  {
    id: "equal", name: "Equal breathing", short: "4 in · 4 out, no holds", when: "A gentle, even pace when box breathing feels like too much. It has no breath holds.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "out", secs: 4, say: "Breathe out" }],
    minutes: [2, 5, 10], evidence: "Weak", hue: 175, next: "focus",
    why: "An even in and out, with no holds, is the simplest steady pace and a good place to start if holding your breath feels uncomfortable. Research on this exact ratio is limited. It sits close to the slow, even breathing that studies of slow breathing describe.",
    sources: [ZACCARO],
  },
  {
    id: "power", name: "Power breathing", short: "Rounds of deep breaths and holds", when: "Morning energy. Inspired by a well-known style of fast breathing and breath holds. Sit or lie down.",
    cycle: [{ kind: "in", secs: 1.6, say: "Deep breath in" }, { kind: "out", secs: 1.4, say: "Let go" }],
    minutes: [], evidence: "Mixed", hue: 25, next: "energize", gated: true,
    rounds: { breaths: 30, maxHold: 90, recoveryHold: 15, count: 3 },
    why: "Fast, deep breathing followed by a breath hold. In the Stanford trial it raised energy and mood. A well-known 2014 study found trained practitioners had a dampened immune response to a bacterial toxin. It's powerful, and it can make you faint.",
    sources: [BALBAN, { text: "Kox M et al. Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans. PNAS, 2014", url: "https://doi.org/10.1073/pnas.1322174111" }],
  },
];

export const POWER_SAFETY = [
  "Only do this sitting or lying down. Never while driving, in or near water (including the bath or shower), or standing.",
  "Tingling and light-headedness are common. If you feel faint, stop and breathe normally.",
  "Skip it if you are pregnant, or have epilepsy, heart disease, high blood pressure, a history of fainting, or panic attacks, unless your doctor says it's okay.",
];

/** 5-4-3-2-1 grounding: a classic way to come back to the present during anxiety. */
export const GROUNDING = [
  { n: 5, sense: "see", prompt: "Name five things you can see. Small ones count: a crack in the ceiling, light on a cup." },
  { n: 4, sense: "feel", prompt: "Notice four things you can feel: your feet on the floor, the fabric of your shirt, the air on your skin." },
  { n: 3, sense: "hear", prompt: "Listen for three sounds, near and far." },
  { n: 2, sense: "smell", prompt: "Find two things you can smell, or two smells you like." },
  { n: 1, sense: "taste", prompt: "Notice one thing you can taste. Then take one slow breath." },
];

/** Progressive muscle relaxation: tense for 5 seconds, release for 10. */
export const PMR = [
  "Hands: make tight fists",
  "Arms: bend your elbows and tighten your biceps",
  "Shoulders: lift them up toward your ears",
  "Face: scrunch your eyes and forehead",
  "Jaw: clench your teeth gently",
  "Stomach: tighten your belly",
  "Legs: press your knees together and tighten your thighs",
  "Feet: curl your toes down",
];
export const PMR_SOURCE: Source = { text: "Toussaint L et al. Effectiveness of progressive muscle relaxation, deep breathing, and guided imagery in promoting psychological and physiological states of relaxation. Evid Based Complement Alternat Med, 2021", url: "https://doi.org/10.1155/2021/5924040" };


/** Turn a saved custom pattern into a playable technique. */
export function customTechnique(c: CustomPattern): Technique {
  const cycle: Phase[] = [{ kind: "in", secs: c.inhale, say: "Breathe in" }];
  if (c.hold > 0) cycle.push({ kind: "hold", secs: c.hold, say: "Hold" });
  cycle.push({ kind: "out", secs: c.exhale, say: "Breathe out" });
  if (c.rest > 0) cycle.push({ kind: "rest", secs: c.rest, say: "Hold" });
  const parts = [c.inhale, c.hold, c.exhale, c.rest].filter((x, i) => x > 0 || i === 0 || i === 2);
  return {
    id: c.id, name: c.name, short: parts.map((x) => (Number.isInteger(x) ? x : x.toFixed(1))).join(" · "), when: "Your own pattern.",
    cycle, minutes: [1, 3, 5, 10], evidence: "None", hue: 320, next: "relax", custom: true,
    shape: cycle.length === 4 ? "box" : cycle.length === 3 ? "triangle" : "orb",
    why: "A pattern you built. Slow breathing with a longer exhale than inhale tends to be the most relaxing.", sources: [],
  };
}

export const breathsPerMinute = (c: Pick<CustomPattern, "inhale" | "hold" | "exhale" | "rest">) => 60 / Math.max(1, c.inhale + c.hold + c.exhale + c.rest);

/** Shown before gated practices. The person has to say none of these apply before starting. */
export const BREATH_SCREEN = [
  "I'm sitting or lying down, not standing, driving, or in or near water (bath, pool, sea).",
  "I'm not pregnant, and I don't have high blood pressure, heart disease, epilepsy or seizures, or a history of fainting.",
  "I don't have asthma or another lung condition, and I haven't had panic attacks, or I've checked with my clinician.",
];

/** Shown any time from the Breathe page. */
export const BREATH_SAFETY = [
  "Never practice in or near water, and never while driving or operating machinery.",
  "Sit or lie down, so a dizzy moment can't turn into a fall.",
  "Stop and breathe normally if you feel dizzy, tingly, have chest pain, or feel panicky. Every session has a button for this.",
  "Skip breath holds and fast or forceful breathing if you are pregnant, or have high blood pressure, heart disease, epilepsy, asthma or a lung condition, or a history of panic attacks, unless your clinician says it's fine.",
  "Slow, gentle breathing with no holds is the lowest-risk kind. Even so, breathing exercises make a few people feel more anxious. If that happens, stop.",
  "This is general information, not medical advice and not a replacement for care. If you're in crisis, call or text 988 in the US.",
];

export interface LearnLink { title: string; by: string; kind: "Overview" | "Research" | "Clinical guide" | "Podcast"; text: string; url: string; evidence?: Strength }

/** Free, public sources we read and recommend. We link out and describe them in our own words; we don't copy their text. */
export const LEARN_MORE: LearnLink[] = [
  { title: "Breathing exercises for stress", by: "NHS (UK)", kind: "Overview", text: "A plain, short guide to a simple breathing exercise for stress, from the UK health service.", url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/" },
  { title: "Relaxation techniques: what you need to know", by: "NIH, National Center for Complementary and Integrative Health", kind: "Overview", text: "An honest summary of what research shows about breathing and other relaxation techniques, and who should take care.", url: "https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know" },
  { title: "Brief structured respiration practices enhance mood and reduce physiological arousal", by: "Balban et al., Stanford, Cell Reports Medicine, 2023", kind: "Research", text: "The free paper behind cyclic sighing. A one-month trial of five minutes a day, compared with mindfulness meditation.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/", evidence: "Moderate" },
  { title: "Breathwork for stress: a systematic review and meta-analysis", by: "Fincham et al., Scientific Reports, 2023", kind: "Research", text: "Pools 12 randomized trials. Breathwork lowered stress, with some concerns about study quality.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9828383/", evidence: "Moderate" },
  { title: "How breath-control can change your life", by: "Zaccaro et al., Frontiers in Human Neuroscience, 2018", kind: "Research", text: "A review of slow breathing under ten breaths a minute: more heart rate variability and changes in brain activity in healthy people.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6137615", evidence: "Strong" },
  { title: "Pursed-lip breathing", by: "Cleveland Clinic", kind: "Clinical guide", text: "Step-by-step guide to the technique used for breathlessness, and when to ask a provider.", url: "https://my.clevelandclinic.org/health/treatments/9443-pursed-lip-breathing" },
  { title: "Huberman Lab", by: "Andrew Huberman, Stanford School of Medicine", kind: "Podcast", text: "A free, long-running science podcast whose episodes on breathing helped popularize the physiological sigh. He is a co-author of the Stanford trial above. Treat any podcast as a starting point and check claims against the papers.", url: "https://www.hubermanlab.com" },
];

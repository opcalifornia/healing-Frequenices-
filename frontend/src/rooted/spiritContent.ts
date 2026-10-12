import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

export interface Tradition {
  id: string;
  name: string;
  origin: string;
  what: string;
  evidence: string;
  rating: Strength;
  tryIt: string;
  respect?: string;
  source?: Source;
  hue: number;
}

export const SOUND_BATH_SOURCE: Source = { text: "Goldsby TL et al. Effects of singing bowl sound meditation on mood, tension, and well-being: an observational study. J Evid Based Complementary Altern Med, 2017", url: "https://doi.org/10.1177/2156587216668109" };
export const MEDITATION_SOURCE: Source = { text: "Goyal M et al. Meditation programs for psychological stress and well-being: a systematic review and meta-analysis. JAMA Intern Med, 2014", url: "https://doi.org/10.1001/jamainternmed.2013.13018" };
export const GRATITUDE_SOURCE: Source = { text: "Seligman MEP et al. Positive psychology progress: empirical validation of interventions. Am Psychol, 2005", url: "https://doi.org/10.1037/0003-066X.60.5.410" };

export const SPIRIT_FINDINGS = [
  { title: "Meditation", stat: "8 wks", statLabel: "of practice eased anxiety, depression and pain modestly in trials", rating: "Moderate" as Strength, body: "A review of 47 trials found mindfulness meditation programs gave small to moderate improvements in anxiety, depression and pain, similar to what you'd expect from antidepressants in primary care, without side effects.", source: MEDITATION_SOURCE, hue: 230 },
  { title: "Sound baths", stat: "62", statLabel: "people reported less tension and anxiety after a singing bowl session", rating: "Weak" as Strength, body: "In one observational study, people felt less tension, anger, fatigue and anxiety after an hour-long singing bowl meditation, especially first-timers. There was no comparison group, so part of it may be simply lying down and resting.", source: SOUND_BATH_SOURCE, hue: 280 },
  { title: "Three good things", stat: "6 mo", statLabel: "of happier mood after a week of writing three good things nightly", rating: "Mixed" as Strength, body: "In a randomized online study, people who wrote down three things that went well each night for a week were happier and less depressed six months later. Later reviews find gratitude practices help, though effects are modest.", source: GRATITUDE_SOURCE, hue: 35 },
  { title: "Time in nature", stat: "120", statLabel: "minutes a week in nature linked with better health and well-being", rating: "Moderate" as Strength, body: "In a study of nearly 20,000 people in England, those who spent at least two hours a week in nature, in one go or spread out, were more likely to report good health and high well-being. It's observational, but the pattern held across ages and backgrounds.", source: { text: "White MP et al. Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Sci Rep, 2019", url: "https://doi.org/10.1038/s41598-019-44097-3" }, hue: 130 },
];

export const CHAKRAS = [
  { name: "Root", sanskrit: "Muladhara", where: "Base of the spine", theme: "Safety, grounding", color: "#e53935", y: 0.62 },
  { name: "Sacral", sanskrit: "Svadhisthana", where: "Lower belly", theme: "Creativity, feeling", color: "#fb8c00", y: 0.55 },
  { name: "Solar plexus", sanskrit: "Manipura", where: "Upper belly", theme: "Confidence, will", color: "#fdd835", y: 0.47 },
  { name: "Heart", sanskrit: "Anahata", where: "Center of the chest", theme: "Love, compassion", color: "#43a047", y: 0.38 },
  { name: "Throat", sanskrit: "Vishuddha", where: "Throat", theme: "Expression, truth", color: "#1e88e5", y: 0.29 },
  { name: "Third eye", sanskrit: "Ajna", where: "Between the eyebrows", theme: "Insight, intuition", color: "#5e35b1", y: 0.2 },
  { name: "Crown", sanskrit: "Sahasrara", where: "Top of the head", theme: "Connection, meaning", color: "#ab47bc", y: 0.11 },
];

export const TRADITIONS: Tradition[] = [
  {
    id: "chakras", name: "Chakras", origin: "Hindu and Buddhist tantric traditions, over a thousand years old", hue: 280, rating: "None",
    what: "Seven energy centers along the spine, each linked with a color, an area of the body and a theme of life. The popular seven-chakra system with rainbow colors took its current form in the 20th century.",
    evidence: "There's no anatomical or scientific evidence that chakras exist as physical structures. As a map for meditation and reflection, many people find them meaningful, the way a body scan moves attention through the body.",
    tryIt: "Use the chakra map below as a guided body scan: rest your attention on each area for a few breaths, from root to crown.",
  },
  {
    id: "crystals", name: "Crystals", origin: "Used as talismans across many cultures; modern crystal healing grew in the 1970s and 80s", hue: 300, rating: "None",
    what: "The belief that stones like amethyst or rose quartz carry energies that can heal or balance the body.",
    evidence: "No controlled studies show crystals have effects beyond placebo. In a small 2001 experiment, people holding fake crystals reported the same tingling and warmth as people holding real ones. If a stone helps you pause and set an intention, that ritual itself can be relaxing.",
    tryIt: "Keep a stone you love by your bed or desk as a cue: when you touch it, take one slow breath.",
  },
  {
    id: "grounding", name: "Grounding (earthing)", origin: "A modern practice inspired by walking barefoot outdoors", hue: 130, rating: "Weak",
    what: "Standing, walking or lying barefoot on grass, sand or soil, said to transfer electrons from the earth to the body.",
    evidence: "A handful of small studies report better sleep or less pain, but most are small, unblinded, and run by people who sell grounding products. Time outside in nature, though, has good evidence for mood and well-being.",
    tryIt: "Take your shoes off on grass or sand for five minutes and notice the textures and temperature. Count it toward your 120 minutes in nature this week.",
  },
  {
    id: "forest", name: "Forest bathing (shinrin-yoku)", origin: "Japan, 1980s, now part of public health programs there", hue: 140, rating: "Moderate",
    what: "Slowly walking through a forest with all your senses: no destination, no exercise goal, no phone.",
    evidence: "Studies, many from Japan, find lower stress hormones, heart rate and blood pressure after time in forests compared with city walks. The studies are often small, but the direction is consistent and it overlaps with the broader evidence for nature.",
    tryIt: "Find any park or trail. Walk slower than feels normal for 20 minutes. Stop and notice five sounds, three smells and the light through the leaves.",
  },
  {
    id: "smudging", name: "Smudging and sacred smoke", origin: "Ceremonial practice of many Indigenous peoples of North America; incense is used in many faiths", hue: 25, rating: "None",
    what: "Burning sacred plants like white sage, sweetgrass or cedar for purification, prayer and ceremony.",
    evidence: "It's a spiritual and cultural practice, and isn't meant to be judged as a medical treatment. Claims that sage smoke 'kills bacteria' come from one small study and don't mean it's healthy to breathe. Smoke of any kind irritates the lungs.",
    tryIt: "If it's part of your tradition, open a window and keep it brief. If it isn't, a candle or a moment of silence can mark the same intention.",
    respect: "White sage is sacred to many Native nations, and overharvesting for commercial sale has hurt wild populations. If you buy it, buy from Indigenous-owned sources, or choose garden-grown herbs instead.",
  },
  {
    id: "faith", name: "Prayer and faith community", origin: "Nearly every culture and religion", hue: 45, rating: "Moderate",
    what: "Personal prayer, and gathering with others in worship, service or shared ritual.",
    evidence: "In a 16-year study of about 75,000 US nurses, those who attended religious services more than once a week had about a third lower risk of death than those who never went. It's observational: social connection, purpose and healthier habits likely explain much of it.",
    tryIt: "Whatever your beliefs, the active ingredients seem to be belonging, purpose and regular gathering. Find a community, choir, service group or circle that gives you those.",
    source: { text: "Li S et al. Association of religious service attendance with mortality among women. JAMA Intern Med, 2016", url: "https://doi.org/10.1001/jamainternmed.2016.1615" },
  },
  {
    id: "hz", name: "\"Healing\" frequencies like 528 Hz", origin: "Online wellness culture, from the 'solfeggio' tone set", hue: 260, rating: "None",
    what: "Claims that specific tones repair DNA, raise your vibration or cure disease.",
    evidence: "There's no good evidence for these claims. Pleasant sound can absolutely help you relax, and that's what our Healing Frequencies sessions aim for. Read our Frequencies & Your Health guide for what's proven and what isn't.",
    tryIt: "Enjoy any tone that sounds good to you, at a low volume, as part of rest.",
  },
];

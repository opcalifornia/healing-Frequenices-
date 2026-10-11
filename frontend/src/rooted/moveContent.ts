import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";
import type { PoseName } from "./poses";

export interface Move {
  name: string;
  secs: number;
  cue: string;
  /** Easier option for anyone who needs it. */
  easier?: string;
  a: PoseName;
  b?: PoseName;
  /** Seconds for one a→b→a cycle. */
  period?: number;
  /** Repeat on the other side, mirrored. */
  sides?: boolean;
}

export interface Routine {
  id: string;
  name: string;
  minutes: number;
  when: string;
  kind: "walk" | "stretch" | "yoga" | "taichi" | "qigong";
  hue: number;
  moves: Move[];
  /** Walk only: lengths to choose from. */
  options?: number[];
  next?: "relax" | "sleep" | "focus" | "energize" | "meditate";
}

export const KIND_LABEL: Record<Routine["kind"], string> = { walk: "Walking", stretch: "Stretching", yoga: "Yoga", taichi: "Tai chi", qigong: "Qigong" };

export const ROUTINES: Routine[] = [
  {
    id: "walk", name: "After-meal walk", minutes: 10, kind: "walk", hue: 140, options: [2, 5, 10, 20],
    when: "After your biggest meal. Even two minutes blunts the blood sugar spike.",
    moves: [{ name: "Easy walk", secs: 600, cue: "An easy pace where you could still chat. Swing your arms. Look up and around.", a: "walkA", b: "walkB", period: 1.1 }],
  },
  {
    id: "wake", name: "Morning wake-up", minutes: 5, kind: "stretch", hue: 40, next: "energize",
    when: "Right after you get up, ideally near a window.",
    moves: [
      { name: "Reach for the sky", secs: 30, cue: "Breathe in as you reach up, out as you lower. Grow tall.", a: "stand", b: "reachTall", period: 5 },
      { name: "Neck tilts", secs: 40, cue: "Ear toward shoulder, slowly side to side. Keep your shoulders relaxed.", a: "neckTilt", b: "neckTiltR", period: 6 },
      { name: "Shoulder shrugs", secs: 30, cue: "Lift your shoulders to your ears, then let them drop.", a: "stand", b: "shrug", period: 3 },
      { name: "Side bend", secs: 40, cue: "Arms up, lean gently to one side. Breathe into your ribs.", a: "reach", b: "sideBend", period: 6, sides: true },
      { name: "Hip circles", secs: 40, cue: "Hands on hips, draw slow circles.", a: "hipLeft", b: "hipRight", period: 4 },
      { name: "Soft forward fold", secs: 40, cue: "Bend your knees as much as you like and let your head hang heavy.", easier: "Rest your hands on your thighs instead.", a: "halfLift", b: "fold", period: 7 },
      { name: "Calf raises", secs: 40, cue: "Rise onto your toes, lower slowly. Hold a wall for balance.", a: "stand", b: "calfUp", period: 2.5 },
    ],
  },
  {
    id: "desk", name: "Desk reset", minutes: 3, kind: "stretch", hue: 210, next: "focus",
    when: "Every hour or two of sitting. No need to stand up.",
    moves: [
      { name: "Seated reach", secs: 25, cue: "Interlace your fingers and press your palms to the ceiling.", a: "seated", b: "seatedReach", period: 5 },
      { name: "Chest opener", secs: 30, cue: "Hands behind you, squeeze your shoulder blades and lift your chest.", a: "seated", b: "chestOpen", period: 5 },
      { name: "Seated twist", secs: 40, cue: "Turn from your belly, not your neck. Hold the chair back.", a: "seated", b: "seatedTwist", period: 7, sides: true },
      { name: "Wrist stretch", secs: 30, cue: "Arm out, gently draw your fingers back, then down.", a: "wristStretch", b: "wristStretch2", period: 5 },
      { name: "Neck tilts", secs: 30, cue: "Slow, gentle, no rolling all the way back.", a: "neckTilt", b: "neckTiltR", period: 6 },
      { name: "Stand and shake out", secs: 25, cue: "Stand up, shake your hands and legs loose, take a big breath.", a: "stand", b: "reach", period: 3 },
    ],
  },
  {
    id: "yoga", name: "Gentle yoga flow", minutes: 10, kind: "yoga", hue: 280, next: "relax",
    when: "Morning or evening, on a mat or carpet. Beginner friendly.",
    moves: [
      { name: "Mountain breath", secs: 40, cue: "Stand tall. Breathe in, arms rise. Breathe out, arms lower.", a: "stand", b: "reach", period: 8 },
      { name: "Half lift and fold", secs: 50, cue: "Fold forward, then lift halfway with a long back. Knees soft.", easier: "Hands on your shins or a chair.", a: "fold", b: "halfLift", period: 8 },
      { name: "Cat and cow", secs: 60, cue: "On hands and knees. Breathe in, belly drops, look up. Breathe out, round your back.", a: "cow", b: "cat", period: 7 },
      { name: "Child's pose", secs: 45, cue: "Knees wide, hips back toward heels, arms long. Just breathe.", easier: "Put a pillow under your hips or chest.", a: "child" },
      { name: "Downward dog", secs: 45, cue: "Hips up and back. Bend your knees as much as you need. Pedal your feet.", easier: "Do it with hands on a wall or table.", a: "dog", b: "child", period: 10 },
      { name: "Low lunge", secs: 50, cue: "Back knee down, front knee over ankle. Lift your arms if it feels good.", easier: "Keep hands on your front thigh.", a: "lunge", b: "lungeReach", period: 8, sides: true },
      { name: "Bridge", secs: 50, cue: "On your back, feet flat. Lift your hips on the breath in, lower on the breath out.", a: "bridgeDown", b: "bridge", period: 6 },
      { name: "Knees side to side", secs: 50, cue: "Knees bent, let them fall gently side to side. Shoulders stay down.", a: "kneesLeft", b: "kneesRight", period: 8 },
      { name: "Rest", secs: 90, cue: "Lie still. Let the floor hold you. Notice your breath.", a: "lying" },
    ],
  },
  {
    id: "bedtime", name: "Bedtime stretch", minutes: 6, kind: "stretch", hue: 255, next: "sleep",
    when: "In bed or on the floor, with the lights low.",
    moves: [
      { name: "Butterfly", secs: 50, cue: "Soles of your feet together, knees wide. Fold forward a little if it feels good.", a: "butterfly", b: "butterflyFold", period: 8 },
      { name: "Child's pose", secs: 50, cue: "Forehead down, arms long or by your sides. Slow breaths into your back.", a: "child" },
      { name: "Figure four", secs: 50, cue: "On your back, ankle over the opposite knee. Draw the legs in gently.", a: "figure4", b: "figure4Deep", period: 8, sides: true },
      { name: "Knees side to side", secs: 50, cue: "Let your knees fall slowly to each side.", a: "kneesLeft", b: "kneesRight", period: 10 },
      { name: "Legs up the wall", secs: 90, cue: "Legs up a wall or headboard, arms out. Breathe out longer than in.", easier: "Rest your calves on a chair or pillows instead.", a: "legsUp" },
    ],
  },
  {
    id: "taichi", name: "Tai chi basics", minutes: 6, kind: "taichi", hue: 175, next: "meditate",
    when: "Standing, any time. Slow and smooth is the whole point.",
    moves: [
      { name: "Standing stillness", secs: 45, cue: "Feet hip-width, knees soft, as if sitting on a high stool. Let your breath settle.", a: "soft" },
      { name: "Weight shifting", secs: 60, cue: "Slowly shift your weight from one foot to the other, like water poured between cups.", easier: "Hold a chair back with one hand.", a: "shiftLeft", b: "shiftRight", period: 8 },
      { name: "Cloud hands", secs: 90, cue: "One hand floats at face height, the other at your belly. Turn your waist and let them trade places.", a: "cloudL", b: "cloudR", period: 8 },
      { name: "Push and gather", secs: 60, cue: "Breathe out, push your palms gently forward. Breathe in, draw them back toward your chest.", a: "gather", b: "pushOut", period: 8 },
      { name: "Closing", secs: 45, cue: "Hands rest over your belly. Stand quietly and notice how you feel.", a: "soft" },
    ],
  },
  {
    id: "brocades", name: "Qigong: Eight Brocades, part one", minutes: 6, kind: "qigong", hue: 15, next: "energize",
    when: "Morning energy without strain. The first four movements of Ba Duan Jin.",
    moves: [
      { name: "Hold up the heavens", secs: 80, cue: "Interlace your fingers, palms up, and press to the sky as you breathe in. Lower as you breathe out.", a: "heavensDown", b: "heavens", period: 8 },
      { name: "Draw the bow", secs: 90, cue: "Sink into a wide stance. Push one hand out, pull the other back like drawing a bow. Look past your front hand.", easier: "Use a narrower stance.", a: "horse", b: "bowLeft", period: 8, sides: true },
      { name: "Separate heaven and earth", secs: 80, cue: "One palm presses up while the other presses down. Switch slowly with each breath.", a: "splitUp", b: "splitUpR", period: 8 },
      { name: "Wise owl looks back", secs: 70, cue: "Turn your head slowly to look over one shoulder, then the other. Keep your chest still.", a: "owlL", b: "owlR", period: 8 },
    ],
  },
];

export interface MoveFinding {
  title: string;
  stat: string;
  statLabel: string;
  body: string;
  evidence: Strength;
  source: Source;
  hue: number;
}

export const MOVE_FINDINGS: MoveFinding[] = [
  {
    title: "150 minutes a week", stat: "150", statLabel: "minutes of moderate activity a week, plus strength twice a week",
    body: "The World Health Organization recommends 150 to 300 minutes a week of moderate activity, like brisk walking, for adults, plus muscle strengthening on two or more days. Any amount is better than none, and it all adds up, even in short bouts.",
    evidence: "Strong", hue: 140, source: { text: "WHO guidelines on physical activity and sedentary behaviour, 2020", url: "https://www.who.int/publications/i/item/9789240015128" },
  },
  {
    title: "Steps add up", stat: "6–10k", statLabel: "daily steps where the benefit levels off",
    body: "Pooling 15 studies of about 47,000 adults, more daily steps meant lower risk of death. The benefit leveled off around 6,000 to 8,000 steps for people over 60 and 8,000 to 10,000 for younger adults. You don't need 10,000 to benefit.",
    evidence: "Moderate", hue: 40, source: { text: "Paluch AE et al. Daily steps and all-cause mortality. Lancet Public Health, 2022", url: "https://doi.org/10.1016/S2468-2667(21)00302-9" },
  },
  {
    title: "Tai chi prevents falls", stat: "~20%", statLabel: "fewer falls in older adults doing tai chi",
    body: "A Cochrane review of exercise for preventing falls found tai chi reduced the rate of falls in older adults living in the community by about a fifth. Balance and strength exercise reduced falls by about a quarter.",
    evidence: "Moderate", hue: 175, source: { text: "Sherrington C et al. Exercise for preventing falls in older people living in the community. Cochrane, 2019", url: "https://doi.org/10.1002/14651858.CD012424.pub2" },
  },
  {
    title: "Yoga and tai chi for back pain", stat: "1st", statLabel: "line: the American College of Physicians recommends movement before medicine",
    body: "For chronic low back pain, the American College of Physicians recommends non-drug options first, including exercise, yoga and tai chi.",
    evidence: "Moderate", hue: 280, source: { text: "Qaseem A et al. Noninvasive treatments for low back pain. Ann Intern Med, 2017", url: "https://doi.org/10.7326/M16-2367" },
  },
  {
    title: "Sauna and the heart", stat: "4–7×", statLabel: "a week linked with lower heart risk in Finnish men",
    body: "In a 20-year study of about 2,300 middle-aged Finnish men, those who used a sauna four to seven times a week had lower rates of fatal heart disease than once-a-week users. It's observational: sauna lovers may differ in other ways, and the study only included men.",
    evidence: "Weak", hue: 15, source: { text: "Laukkanen T et al. Sauna bathing and fatal cardiovascular events. JAMA Intern Med, 2015", url: "https://doi.org/10.1001/jamainternmed.2014.8187" },
  },
];

export const SAUNA = {
  how: [
    "Start with 5 to 10 minutes and build up to 15 or 20. Leave sooner if you feel dizzy, sick or uncomfortable.",
    "Drink water before and after. Skip alcohol before and during, which raises the risk of fainting and heart rhythm problems.",
    "Stand up slowly at the end, and cool down gradually with a lukewarm shower.",
  ],
  noGo: [
    "Pregnant",
    "Recent heart attack, unstable chest pain, or severe narrowing of the aortic valve",
    "Low blood pressure or prone to fainting",
    "Unwell with a fever",
    "Under the influence of alcohol or sedating medicine",
  ],
  source: { text: "Laukkanen JA et al. Cardiovascular and other health benefits of sauna bathing: a review of the evidence. Mayo Clin Proc, 2018", url: "https://doi.org/10.1016/j.mayocp.2018.04.008" } as Source,
};

// Listed lengths always come from the moves themselves, so they can't drift.
for (const r of ROUTINES) {
  if (r.kind !== "walk") r.minutes = Math.max(1, Math.round(r.moves.reduce((a, m) => a + m.secs, 0) / 60));
}

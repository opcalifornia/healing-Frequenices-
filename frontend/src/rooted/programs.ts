import type { Strength } from "../learn/brainContent";
import type { flags } from "../store/wellness";

/**
 * Programs: multi-day courses made of short lessons. This is the format
 * Rooted Pros will author in; the first programs are written in-house.
 */

export type Block =
  | { type: "read"; title: string; body: string[]; diagram?: "breathing-body" | "heart-rhythm" | "digestive" | "fiber" | "glucose" | "light-clock" }
  | { type: "breath"; technique: string; minutes: number }
  | { type: "move"; routine: string; minutes?: number }
  | { type: "shop"; title: string; body: string; items: string[] }
  | { type: "water" }
  | { type: "ground" }
  | { type: "quiz"; question: string; options: string[]; answer: number; explain: string }
  | { type: "reflect"; prompt: string; lines: number }
  | { type: "action"; title: string; body: string };

export interface ProgramDay {
  title: string;
  blocks: Block[];
}

export interface Program {
  id: string;
  section: "breathe" | "move" | "nourish" | "spirit";
  title: string;
  tagline: string;
  about: string;
  author: { name: string; role: string; verified: boolean };
  hue: number;
  hue2: number;
  evidence: Strength;
  days: ProgramDay[];
  live: boolean;
}

export const PROGRAMS: Program[] = [
  {
    id: "calmer-7", section: "breathe", title: "7 Days to Calmer", tagline: "A few minutes a day to retrain how you respond to stress",
    about: "One short lesson a day. You'll learn why slow breathing works, practice the five most useful techniques, and finish knowing which one works best for you. About 5 minutes a day.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 195, hue2: 160, evidence: "Moderate", live: true,
    days: [
      {
        title: "Your breath is a remote control",
        blocks: [
          { type: "read", title: "The only automatic system you can steer", body: ["Your heartbeat, digestion and stress response run on autopilot. Breathing does too, but you can take the wheel any time.", "When you slow your breathing, especially your exhale, you signal safety to your nervous system. Your heart slows, and your body shifts toward rest-and-digest."], diagram: "breathing-body" },
          { type: "breath", technique: "calm", minutes: 2 },
          { type: "quiz", question: "Which part of the breath most slows your heart?", options: ["Breathing in", "Breathing out", "Holding your breath"], answer: 1, explain: "Your heart naturally slows a little on every exhale. Making the exhale longer than the inhale strengthens that calming effect." },
        ],
      },
      {
        title: "The fastest reset: the physiological sigh",
        blocks: [
          { type: "read", title: "Two breaths in, one long breath out", body: ["When you're stressed, tiny air sacs in your lungs can partly collapse. A second, short top-up inhale reopens them, and a long exhale offloads carbon dioxide.", "In a Stanford study, five minutes a day of cyclic sighing for a month improved mood and lowered breathing rate more than mindfulness meditation."] },
          { type: "breath", technique: "sigh", minutes: 2 },
          { type: "action", title: "Use it today", body: "The next time you feel your shoulders creep up, a tough email, traffic, a hard conversation, do just one or two sighs. Notice what changes." },
        ],
      },
      {
        title: "Find your rhythm: resonance breathing",
        blocks: [
          { type: "read", title: "Six breaths a minute", body: ["At around six breaths a minute, your breathing and heart rate fall into step. Heart rate rises on each inhale and falls on each exhale, and the swings get much bigger.", "Bigger swings mean higher heart rate variability, a sign your calming system is engaged. Switch the chart between normal and slow breathing to see it."], diagram: "heart-rhythm" },
          { type: "breath", technique: "coherent", minutes: 5 },
          { type: "quiz", question: "About how many breaths a minute is resonance breathing?", options: ["About 15", "About 10", "About 6"], answer: 2, explain: "Around 5.5 to 6 breaths a minute, or about 5 seconds in and 5 seconds out, is the pace where breathing and heart rhythm line up for most adults." },
        ],
      },
      {
        title: "Box breathing for pressure",
        blocks: [
          { type: "read", title: "Steady under stress", body: ["Box breathing, four equal counts of in, hold, out, hold, is used by first responders and athletes to stay steady before high-pressure moments.", "The holds give your mind something simple to count, which crowds out racing thoughts. Follow the dot around the square."] },
          { type: "breath", technique: "box", minutes: 2 },
          { type: "action", title: "Before your next big moment", body: "Before a meeting, a call, or walking into a room, do four slow boxes. It takes about a minute." },
        ],
      },
      {
        title: "Grounding when anxiety spikes",
        blocks: [
          { type: "read", title: "Back to the room", body: ["Anxiety pulls your attention into the future: what might go wrong. Grounding pulls it back to right now, through your senses.", "Pair it with a slow exhale and you work on both your body and your mind."] },
          { type: "ground" },
          { type: "reflect", prompt: "What situations make you most tense?", lines: 2 },
        ],
      },
      {
        title: "Breathing for sleep",
        blocks: [
          { type: "read", title: "A long exhale in bed", body: ["At night, a very slow breath with a long exhale helps quiet a busy mind. 4-7-8 breathing slows you down to about three breaths a minute.", "If it makes you light-headed, keep the hold shorter. There's no need to force it."] },
          { type: "breath", technique: "478", minutes: 2 },
          { type: "action", title: "Tonight", body: "Once you're in bed with the lights off, do four rounds of 4-7-8, then let your breath return to normal. If you're still awake, do four more." },
        ],
      },
      {
        title: "Make it yours",
        blocks: [
          { type: "read", title: "What worked for you?", body: ["You've practiced five techniques this week. The best one is the one you'll actually use.", "Check Your results on the Breathe page: if you rated your stress before and after, it shows which technique lowered it most for you."] },
          { type: "breath", technique: "calm", minutes: 5 },
          { type: "reflect", prompt: "Which technique will you keep using, and when?", lines: 2 },
        ],
      },
    ],
  },
  {
    id: "mornings-5", section: "move", title: "5 Gentle Mornings", tagline: "Wake up your body in about 10 minutes a day",
    about: "Five mornings, five ways to start the day: daylight, water, gentle movement and breath. No equipment, no gym, nothing strenuous. About 10 minutes each.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 40, hue2: 15, evidence: "Moderate", live: true,
    days: [
      {
        title: "Light, water, stretch",
        blocks: [
          { type: "read", title: "The three-minute head start", body: ["Morning daylight is the strongest signal for your body clock: it helps you feel alert now and sleepy at the right time tonight.", "You also wake up a little dehydrated after a night without water. Light, a glass of water and a gentle stretch is a simple, proven way to start."], diagram: "light-clock" },
          { type: "action", title: "Get some daylight", body: "Open the curtains or step outside for a few minutes. Outdoor light is far brighter than indoor light, even on a cloudy day." },
          { type: "water" },
          { type: "move", routine: "wake" },
        ],
      },
      {
        title: "Move, then breathe",
        blocks: [
          { type: "read", title: "Movement wakes the body; breath steadies the mind", body: ["A few minutes of stretching gets blood moving and loosens stiffness from sleep.", "Following it with slow breathing helps you start the day steady instead of rushed."] },
          { type: "move", routine: "wake" },
          { type: "breath", technique: "calm", minutes: 1 },
          { type: "quiz", question: "What's the strongest signal that sets your body clock in the morning?", options: ["Your alarm", "Coffee", "Daylight"], answer: 2, explain: "Light reaching special cells in your eyes is the main signal your master clock uses. Getting outside soon after waking helps you feel alert in the day and sleepy at night." },
        ],
      },
      {
        title: "Qigong: the Eight Brocades",
        blocks: [
          { type: "read", title: "A centuries-old morning practice", body: ["Ba Duan Jin, the Eight Brocades, is a set of slow, flowing movements practiced in parks across China every morning.", "Studies suggest qigong may help with balance, flexibility and stress. Today you'll learn the first four. Move slowly, and breathe with each movement."] },
          { type: "move", routine: "brocades" },
          { type: "reflect", prompt: "How does your body feel compared with when you woke up?", lines: 1 },
        ],
      },
      {
        title: "Tai chi for balance",
        blocks: [
          { type: "read", title: "Slow is the point", body: ["Tai chi is moving meditation. A Cochrane review found it reduced falls in older adults by about a fifth, and it's gentle enough for almost anyone.", "Shift your weight slowly, keep your knees soft, and let your breath set the pace."] },
          { type: "move", routine: "taichi" },
          { type: "action", title: "Take it with you", body: "Today, while you wait for the kettle or the elevator, do a few slow weight shifts from foot to foot." },
        ],
      },
      {
        title: "Gentle yoga and a plan",
        blocks: [
          { type: "read", title: "Ten minutes on the floor", body: ["Today's flow brings everything together: breath, stretching and a few gentle strength moves like bridge.", "The American College of Physicians recommends yoga and tai chi as first options for chronic low back pain. Use the easier option on any move."] },
          { type: "move", routine: "yoga" },
          { type: "reflect", prompt: "Which morning routine will you keep, and on which days?", lines: 2 },
        ],
      },
    ],
  },
  {
    id: "fiber-7", section: "nourish", title: "7 Days to More Fiber", tagline: "Small swaps toward 25 to 29 grams a day",
    about: "Most adults eat about half the fiber linked to the biggest health benefits. One small, tasty swap a day, the science behind it, and a shopping list that builds itself.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 90, hue2: 45, evidence: "Strong", live: true,
    days: [
      {
        title: "Why fiber matters",
        blocks: [
          { type: "read", title: "The nutrient most of us are missing", body: ["A WHO-commissioned review of 185 studies and 58 trials found that people eating 25 to 29 grams of fiber a day had 15 to 30% lower risk of death, heart disease, stroke, type 2 diabetes and colorectal cancer than people eating the least.", "Most adults get around 15 grams. Fiber comes in two kinds, and each works differently. Switch between them below."], diagram: "fiber" },
          { type: "quiz", question: "How much fiber a day is linked to the biggest benefits?", options: ["About 10 grams", "About 25 to 29 grams", "About 60 grams"], answer: 1, explain: "25 to 29 grams a day, and studies found even more was better. Increase slowly and drink water as you do, to avoid bloating." },
        ],
      },
      {
        title: "Swap your breakfast",
        blocks: [
          { type: "read", title: "Oats: the cholesterol-lowering grain", body: ["Oats contain beta-glucan, a soluble fiber that lowers LDL cholesterol. It's one of the few foods with an FDA-authorized heart health claim.", "A bowl of oatmeal with berries and a spoon of chia gets you about a third of the way to your daily fiber."] },
          { type: "shop", title: "For tomorrow's breakfast", body: "Steel-cut or rolled oats, berries (frozen is great) and chia seeds.", items: ["oats", "blueberries", "chia"] },
          { type: "action", title: "Tomorrow morning", body: "Make overnight oats tonight: half a cup of oats, a spoon of chia, milk or yogurt, and berries. Into the fridge, ready when you wake up." },
        ],
      },
      {
        title: "Beans, lentils and chickpeas",
        blocks: [
          { type: "read", title: "The Blue Zones staple", body: ["Beans, lentils and chickpeas are packed with fiber and protein, and a daily serving lowered LDL cholesterol in a meta-analysis of trials.", "They're a daily food in every Blue Zone, the regions where people live longest. Canned is fine: just rinse them."] },
          { type: "shop", title: "Stock your pantry", body: "Pick any you like. Red lentils cook in 20 minutes; canned chickpeas and black beans are ready now.", items: ["lentils", "chickpeas", "black-beans"] },
          { type: "quiz", question: "What does soluble fiber do to sugar from a meal?", options: ["Speeds it into your blood", "Slows how fast it reaches your blood", "Nothing"], answer: 1, explain: "Soluble fiber forms a gel in your gut that slows digestion, so sugar enters your blood more gradually and you stay full longer." },
        ],
      },
      {
        title: "Walk after you eat",
        blocks: [
          { type: "read", title: "Two minutes that change the curve", body: ["Fiber slows sugar from the inside; a short walk after eating helps your muscles use it up. A review of seven studies found even 2 to 5 minutes of light walking after a meal lowered blood sugar compared with sitting.", "Drag across the chart to compare."], diagram: "glucose" },
          { type: "move", routine: "walk", minutes: 5 },
        ],
      },
      {
        title: "Feed your gut microbes",
        blocks: [
          { type: "read", title: "Fermented foods", body: ["Your large intestine is home to tens of trillions of microbes that ferment fiber into compounds that feed your gut lining.", "In a Stanford trial, eating more fermented foods for 10 weeks increased microbiome diversity and lowered 19 inflammation markers. Follow a bite through your body below."], diagram: "digestive" },
          { type: "shop", title: "Pick one or two", body: "Plain yogurt or kefir with breakfast, and kimchi or sauerkraut with dinner. Look for 'live cultures' and the refrigerated kind.", items: ["yogurt", "kefir", "kimchi", "sauerkraut"] },
        ],
      },
      {
        title: "Seeds and nuts",
        blocks: [
          { type: "read", title: "A spoonful at a time", body: ["Ground flaxseed, chia, walnuts and pumpkin seeds add fiber, plant omega-3s and magnesium with almost no effort.", "In PREDIMED, a daily handful of nuts as part of a Mediterranean diet cut major heart events by about 30%."] },
          { type: "shop", title: "Sprinkle-ready", body: "Buy flaxseed ground (whole seeds pass straight through) and keep it in the fridge.", items: ["flaxseed", "walnuts", "pumpkin-seeds"] },
          { type: "action", title: "Today", body: "Add a spoonful of seeds or a small handful of nuts to one meal or snack." },
        ],
      },
      {
        title: "Put it on your plate",
        blocks: [
          { type: "read", title: "Your fiber week, together", body: ["Oats and berries in the morning, beans or lentils at lunch, vegetables filling half your plate, a fermented food, a spoon of seeds, and a short walk after eating.", "As fiber goes up, water should too: it helps fiber do its job."] },
          { type: "water" },
          { type: "reflect", prompt: "Which swaps will you keep?", lines: 2 },
        ],
      },
    ],
  },
];

export const programById = (id: string) => PROGRAMS.find((p) => p.id === id);

/** Swap techniques that aren't advised for someone's profile. */
export function safeTechnique(id: string, f: ReturnType<typeof flags>): string {
  if (id === "power" && f.noPowerBreathing) return "calm";
  if ((id === "478" || id === "box") && f.breathHoldCare) return "calm";
  return id;
}

/** Move routines that need a seated alternative for limited mobility. */
export function safeRoutine(id: string, f: ReturnType<typeof flags>): string {
  return f.seated && id !== "desk" ? "desk" : id;
}

export const dayMinutes = (d: ProgramDay) =>
  Math.max(2, Math.round(d.blocks.reduce((a, b) => a + (b.type === "breath" ? b.minutes : b.type === "ground" ? 2 : b.type === "move" ? 6 : b.type === "read" ? 1 : 0.5), 0)));

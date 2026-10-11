import type { Strength } from "../learn/brainContent";
import type { flags } from "../store/wellness";

/**
 * Programs: multi-day courses made of short lessons. This is the format
 * Rooted Pros will author in; the first programs are written in-house.
 */

export type Block =
  | { type: "read"; title: string; body: string[]; diagram?: "breathing-body" | "heart-rhythm" }
  | { type: "breath"; technique: string; minutes: number }
  | { type: "move"; routine: string }
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
    id: "mornings-5", section: "move", title: "5 Gentle Mornings", tagline: "Wake up your body in 10 minutes a day", about: "Coming soon: light, water, movement and breath to start your day.",
    author: { name: "Rooted Team", role: "In development", verified: true }, hue: 40, hue2: 15, evidence: "Moderate", live: false, days: [],
  },
  {
    id: "fiber-7", section: "nourish", title: "7 Days to More Fiber", tagline: "Small swaps toward 25 to 29 grams a day", about: "Coming soon: one simple food swap a day, with a shopping list that builds itself.",
    author: { name: "Rooted Team", role: "In development", verified: true }, hue: 90, hue2: 45, evidence: "Strong", live: false, days: [],
  },
];

export const programById = (id: string) => PROGRAMS.find((p) => p.id === id);

/** Swap techniques that aren't advised for someone's profile. */
export function safeTechnique(id: string, f: ReturnType<typeof flags>): string {
  if (id === "power" && f.noPowerBreathing) return "calm";
  if ((id === "478" || id === "box") && f.breathHoldCare) return "calm";
  return id;
}

export const dayMinutes = (d: ProgramDay) =>
  Math.max(2, Math.round(d.blocks.reduce((a, b) => a + (b.type === "breath" ? b.minutes : b.type === "ground" ? 2 : b.type === "move" ? 6 : b.type === "read" ? 1 : 0.5), 0)));

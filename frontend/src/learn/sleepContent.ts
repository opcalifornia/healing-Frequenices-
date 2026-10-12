/**
 * Copy for the Better Sleep guide. Written in our own words. Practical tips
 * credited to Huberman Lab are paired with the research behind them, and each
 * claim carries an honest evidence label. Keep that standard when editing.
 */
import type { Strength } from "./brainContent";

export interface Tip {
  title: string;
  body: string;
  strength: Strength;
  source?: string;
}

export const LIGHT_LEVELS: Array<{ label: string; lux: number; note: string }> = [
  { label: "Candle at 1 m", lux: 10, note: "About as dim as evening light should get" },
  { label: "Dim, warm lamp", lux: 50, note: "Good for the last hours before bed" },
  { label: "Typical living room", lux: 150, note: "Bright enough to delay melatonin at night" },
  { label: "Bright office", lux: 500, note: "Still far dimmer than outdoors" },
  { label: "Overcast day, outside", lux: 5000, note: "Even a grey sky beats most indoor light" },
  { label: "Light therapy box", lux: 10000, note: "A stand-in when you can't get outside" },
  { label: "Clear day, outside", lux: 50000, note: "Direct sun can reach 100,000 lux" },
];

export const SLEEP_TIPS: Record<string, Tip[]> = {
  morning: [
    {
      title: "Get outside within 30–60 minutes of waking",
      body: "Morning light is the strongest signal your body clock gets. Huberman suggests a few minutes on a clear morning and longer, 15–30 minutes, when it's overcast. Light through a window is much weaker, so step outside if you can. Never look straight at the sun.",
      strength: "Strong",
      source: "Huberman Lab Toolkit for Sleep; circadian research on morning light",
    },
    {
      title: "Use bright artificial light if you can't get outside",
      body: "Before sunrise or on dark winter mornings, turn on bright lights or sit near a light therapy box. Normal room lighting is usually too dim to do much.",
      strength: "Moderate",
    },
    {
      title: "See some late-afternoon light too",
      body: "Huberman suggests viewing light again in the late afternoon, around sunset, on the idea that it may soften the effect of artificial light later. This is a reasonable habit with early evidence.",
      strength: "Weak",
      source: "Huberman Lab",
    },
  ],
  evening: [
    {
      title: "Dim the lights in the last 2–3 hours before bed",
      body: "Even ordinary room light can delay the evening rise of melatonin. Switch off overhead lights and use low, warm lamps placed below eye level.",
      strength: "Strong",
    },
    {
      title: "Avoid bright light between about 10 pm and 4 am",
      body: "Huberman's rule of thumb: bright light in the middle of the night is the most disruptive for your clock. If you get up, use a dim night-light, not the overhead light.",
      strength: "Moderate",
      source: "Huberman Lab Toolkit for Sleep",
    },
    {
      title: "Brightness matters more than color",
      body: "Blue-rich light hits your clock hardest, but a bright warm light still disrupts it. Night mode and blue-blocking glasses may help a little; turning brightness down helps more. Red-tinted lenses block more than clear 'blue blockers'.",
      strength: "Mixed",
    },
    {
      title: "Put screens down, or at least dim them",
      body: "In a 2015 study, people who read on a light-emitting e-reader before bed took longer to fall asleep, released melatonin later and felt less alert the next morning than when they read a printed book.",
      strength: "Moderate",
      source: "Chang et al., PNAS 2015",
    },
  ],
  caffeine: [
    {
      title: "Stop caffeine 8–10 hours before bed",
      body: "Caffeine's half-life is about 5 hours, so half of a 3 pm coffee is still in you at 8 pm. In a 2013 study, a strong dose taken 6 hours before bed still cut sleep by over an hour.",
      strength: "Strong",
      source: "Drake et al., J Clin Sleep Med 2013",
    },
    {
      title: "Consider waiting 90–120 minutes after waking",
      body: "Huberman suggests delaying your first caffeine to avoid an afternoon crash. Many people find it helps, but direct research on this exact timing is limited.",
      strength: "Weak",
      source: "Huberman Lab",
    },
  ],
  temperature: [
    {
      title: "Keep the bedroom cool",
      body: "Your core temperature needs to drop about 1°C to fall asleep. Most people sleep best around 18–20°C (65–68°F), with warm hands and feet.",
      strength: "Moderate",
    },
    {
      title: "Take a warm bath or shower 1–2 hours before bed",
      body: "It sounds backwards, but warming up first makes your body shed heat afterward. A 2019 review found that a warm bath or shower about 1–2 hours before bed helped people fall asleep faster.",
      strength: "Moderate",
      source: "Haghayegh et al., Sleep Med Rev 2019",
    },
    {
      title: "Warm up in the morning",
      body: "Body temperature rises as you wake. Huberman suggests morning exercise or a brief cold shower to boost alertness and anchor your day. Keep hard exercise out of the last few hours before bed if it keeps you wired.",
      strength: "Weak",
      source: "Huberman Lab",
    },
  ],
  naps: [
    {
      title: "Keep naps short and early",
      body: "Naps of about 20–30 minutes, before early to mid-afternoon, give a boost without stealing from the night. Huberman's earlier guidance was under 90 minutes; shorter is safer if you struggle to fall asleep.",
      strength: "Moderate",
      source: "Huberman Lab newsletter",
    },
    {
      title: "Try NSDR or yoga nidra instead of a nap",
      body: "Non-sleep deep rest, a guided practice lying still with slow breathing and body scanning, is a Huberman favorite for resetting in the afternoon or when you wake at night. Try our Yoga Nidra Delta session.",
      strength: "Weak",
      source: "Huberman Lab",
    },
  ],
  habits: [
    {
      title: "Wake at the same time every day",
      body: "A steady wake time, weekends included, anchors your whole clock. If you only change one thing, change this.",
      strength: "Strong",
    },
    {
      title: "Aim for at least 7 hours",
      body: "Sleep experts recommend 7 or more hours a night for adults, regularly.",
      strength: "Strong",
      source: "AASM & Sleep Research Society consensus, 2015",
    },
    {
      title: "Go easy on alcohol and late meals",
      body: "Alcohol may help you nod off but breaks up sleep in the second half of the night and cuts REM. Large meals close to bed can do the same.",
      strength: "Strong",
    },
    {
      title: "Awake for more than 20 minutes? Get up",
      body: "Keep the lights low, do something relaxing, and return when sleepy. This is part of CBT-I, the first-choice treatment for long-term insomnia. If poor sleep lasts weeks, talk to a doctor.",
      strength: "Strong",
      source: "American College of Physicians guideline, 2016",
    },
    {
      title: "Supplements: talk to a doctor first",
      body: "Huberman discusses supplements such as magnesium, apigenin and L-theanine. Evidence for them is limited and mixed, they can interact with medicines, and they aren't for everyone. We don't recommend any.",
      strength: "Weak",
      source: "Huberman Lab",
    },
  ],
};

export const SLEEP_SOURCES = [
  { text: "Huberman Lab. Toolkit for Sleep (newsletter).", url: "https://www.hubermanlab.com/newsletter/toolkit-for-sleep" },
  { text: "Huberman Lab. Sleep Toolkit: Tools for Optimizing Sleep & Sleep-Wake Timing (podcast episode).", url: "https://www.hubermanlab.com/episode/sleep-toolkit-tools-for-optimizing-sleep-and-sleep-wake-timing" },
  { text: "Huberman Lab. Improve Your Sleep (newsletter).", url: "https://www.hubermanlab.com/newsletter/improve-your-sleep" },
  { text: "Berson, D. M., Dunn, F. A., & Takao, M. (2002). Phototransduction by retinal ganglion cells that set the circadian clock. Science, 295, 1070–1073." },
  { text: "Chang, A.-M., Aeschbach, D., Duffy, J. F., & Czeisler, C. A. (2015). Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness. PNAS, 112(4), 1232–1237." },
  { text: "Drake, C., Roehrs, T., Shambroom, J., & Roth, T. (2013). Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed. Journal of Clinical Sleep Medicine, 9(11), 1195–1200." },
  { text: "Haghayegh, S., et al. (2019). Before-bedtime passive body heating by warm shower or bath to improve sleep: a systematic review and meta-analysis. Sleep Medicine Reviews, 46, 124–135." },
  { text: "Watson, N. F., et al. (2015). Recommended amount of sleep for a healthy adult: a joint consensus statement of the AASM and SRS. Sleep, 38(6), 843–844." },
  { text: "Qaseem, A., et al. (2016). Management of chronic insomnia disorder in adults: a clinical practice guideline from the American College of Physicians. Annals of Internal Medicine, 165(2), 125–133." },
];

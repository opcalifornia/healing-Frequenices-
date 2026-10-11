/**
 * Copy for the "Frequencies & Your Health" guide. Each claim carries an honest
 * evidence label and matches the sources listed below; keep it that way.
 */
import type { Tip } from "./sleepContent";

export const SOUND_LEVELS: Array<{ label: string; db: number }> = [
  { label: "Quiet bedroom", db: 30 },
  { label: "Normal conversation", db: 60 },
  { label: "Busy city traffic", db: 85 },
  { label: "Headphones at max volume", db: 100 },
  { label: "Concert or club", db: 110 },
];

/** NIOSH recommended limit: 85 dBA for 8 hours, halving every 3 dB. Returns minutes per day. */
export function safeMinutes(db: number): number {
  return 480 / 2 ** ((db - 85) / 3);
}

export interface Band {
  name: string;
  lo: number;
  hi: number;
  kind: "sound" | "radio" | "light" | "ionizing";
  note: string;
}

/** Spanning 1 Hz to 10^20 Hz: mechanical sound waves and electromagnetic waves are different physics. */
export const SPECTRUM: Band[] = [
  { name: "Infrasound", lo: 1, hi: 20, kind: "sound", note: "Sound too low to hear. Felt as pressure only at very high levels." },
  { name: "Audible sound", lo: 20, hi: 20000, kind: "sound", note: "Harmful when it is too loud for too long, whatever the pitch." },
  { name: "Ultrasound", lo: 20000, hi: 1e7, kind: "sound", note: "Above hearing. Used in medical imaging at safe levels." },
  { name: "Radio, Wi-Fi, Bluetooth, 5G", lo: 1e5, hi: 3e11, kind: "radio", note: "Non-ionizing: too little energy per photon to break chemical bonds. Established effect at high power: heating." },
  { name: "Visible light", lo: 4.3e14, hi: 7.5e14, kind: "light", note: "Bright light at night shifts your body clock; flashing light can trigger seizures in some people." },
  { name: "UV, X-rays, gamma", lo: 7.5e14, hi: 1e20, kind: "ionizing", note: "Ionizing at higher UV and beyond: enough energy to damage DNA. Sunburn and skin cancer risk." },
];

export const SAFETY_TIPS: Record<string, Tip[]> = {
  loud: [
    {
      title: "Loudness is the frequency risk that's proven",
      body: "Noise-induced hearing loss is permanent and common, and it comes from volume and time, not from any special pitch. US workplace guidance (NIOSH) sets the limit at 85 dB for 8 hours, with the safe time halving for every 3 dB louder.",
      strength: "Strong",
      source: "NIOSH 1998",
    },
    {
      title: "Personal listening: about 80 dB for 40 hours a week",
      body: "The WHO and ITU safe-listening standard for headphones and phones uses a weekly sound allowance equal to about 80 dB for 40 hours (75 dB for children). Many phones can track this for you.",
      strength: "Strong",
      source: "WHO–ITU H.870",
    },
    {
      title: "Binaural sessions should be quiet",
      body: "Binaural beats work at low volume. Set the tones just above where you can hear them. Louder doesn't make the effect stronger; it only adds risk.",
      strength: "Strong",
    },
  ],
  flash: [
    {
      title: "Flashing light between about 3 and 30 flashes per second",
      body: "In people with photosensitive epilepsy, high-contrast flashing in roughly this range is the most likely to trigger a seizure, especially when it fills much of the field of view. That's why our visualizer moves shapes instead of flashing, slows down at fast beat rates, and has a Calm visuals switch.",
      strength: "Strong",
      source: "Fisher et al., Epilepsia 2005",
    },
    {
      title: "Rhythmic sound and seizures",
      body: "Seizures triggered by sound alone are rare, but if you have epilepsy or a seizure disorder, check with a doctor before using rhythmic audio, including binaural and isochronic tones.",
      strength: "Moderate",
    },
  ],
  low: [
    {
      title: "Infrasound: real at extreme levels, overstated elsewhere",
      body: "Very intense infrasound, like that near jet engines or industrial machinery, can cause pressure, discomfort and fatigue. Everyday infrasound from wind, traffic or turbines is usually below what the body can detect, and studies haven't shown direct harm at those levels.",
      strength: "Mixed",
      source: "Leventhall 2007",
    },
    {
      title: "Low-frequency noise can disturb sleep",
      body: "Audible low hums, such as traffic rumble or nearby machinery, are a common cause of annoyance and poor sleep. Masking with brown noise and a quieter bedroom can help.",
      strength: "Moderate",
    },
    {
      title: "The 'brown note' is a myth",
      body: "There is no known sound frequency that makes people lose control of their bowels or 'resonates' organs at normal listening levels.",
      strength: "None",
    },
  ],
  light: [
    {
      title: "Bright light at night",
      body: "Light, especially blue-rich light, at night delays melatonin and shifts your body clock. The Better Sleep guide covers how to dim your evenings.",
      strength: "Strong",
    },
    {
      title: "Ultraviolet light",
      body: "UV from the sun and tanning beds is the part of the light spectrum with proven long-term harm: sunburn, eye damage and skin cancer. Get morning daylight, and protect your skin and eyes in strong midday sun.",
      strength: "Strong",
    },
  ],
  radio: [
    {
      title: "Radio waves can't break chemical bonds",
      body: "Wi-Fi, Bluetooth, mobile networks and 5G use non-ionizing radio waves. The only established biological effect is heating at high power, and international limits (ICNIRP) are set well below that level.",
      strength: "Strong",
      source: "ICNIRP 2020",
    },
    {
      title: "'Possibly carcinogenic' (Group 2B), and what that means",
      body: "In 2011 the WHO's cancer agency classed radio-frequency fields as 'possibly carcinogenic' because of limited, inconsistent evidence. The same group includes aloe vera whole-leaf extract and pickled vegetables. A large 2024 review commissioned by the WHO found no link between mobile phone use and brain cancer.",
      strength: "Strong",
      source: "IARC 2011; Karipidis et al. 2024",
    },
    {
      title: "Do phone signals change brainwaves? Sometimes, slightly",
      body: "Lab studies have looked at EEG while people hold an active phone near the head. A 2019 review found changes in the alpha band in most studies, but not all, and blamed the mixed results on differing methods. A 2025 meta-analysis of 51 studies found a significant alpha effect for older 2G signals, while noting that most studies carried a moderate or high risk of bias. None of this has shown harm to health: brainwaves also shift when you close your eyes or listen to music.",
      strength: "Mixed",
      source: "Danker-Hopfe et al. 2019; Bioelectromagnetics 2025 meta-analysis",
    },
    {
      title: "Bluetooth earbuds are far weaker than a phone",
      body: "Bluetooth headphones typically transmit at a few milliwatts, hundreds of times less than a phone during a call. There is no good evidence that this harms the brain. If you'd still rather minimize exposure, wired headphones remove it entirely, and they happen to be the most reliable choice for binaural beats too.",
      strength: "Moderate",
    },
    {
      title: "What the RF notice on your phone means",
      body: "Phone makers publish RF exposure information because regulators require it. Apple's lists each iPhone's measured SAR (how much radio energy the body absorbs), the distance used in testing, and suggests hands-free options such as the speakerphone or headphones if you want to reduce exposure. It's a disclosure that the phone meets limits, which include a large safety margin, not a statement that the phone is harmful.",
      strength: "Strong",
      source: "Apple RF Exposure information",
    },
    {
      title: "Limits are enforced: the iPhone 12 in France",
      body: "In 2023 France's radio regulator (ANFR) measured an iPhone 12 limb SAR of 5.74 W/kg against a 4 W/kg limit and paused its sale. Apple disputed the test method but released a software update; ANFR measured 3.94 W/kg afterwards and lifted the ban in December 2023. It shows limits are checked, and that the limits themselves sit well below levels known to cause harm.",
      strength: "Strong",
      source: "ANFR 2023",
    },
    {
      title: "Electromagnetic hypersensitivity",
      body: "Some people report symptoms they link to electromagnetic fields. The symptoms are real, but in blinded tests people haven't been able to tell when a field is on or off. If you have symptoms, see a doctor.",
      strength: "Strong",
      source: "WHO fact sheet",
    },
  ],
  myths: [
    {
      title: "'528 Hz repairs DNA'",
      body: "There is no scientific evidence that any audible tone repairs DNA or cures disease. Enjoy solfeggio tones for how they sound.",
      strength: "None",
    },
    {
      title: "'440 Hz tuning is harmful; 432 Hz is natural'",
      body: "Concert pitch is a convention. Small listening studies are inconclusive, and there is no evidence that 440 Hz harms anyone.",
      strength: "None",
    },
    {
      title: "'5G causes illness'",
      body: "Exposure from 5G networks is far below international safety limits, and no health effect has been demonstrated at those levels.",
      strength: "None",
    },
  ],
};

export const HEADPHONE_CHECKLIST: Array<{ title: string; body: string }> = [
  { title: "Turn off spatial audio and head tracking", body: "These features remix left and right to simulate a room. That can blend the two tones and weaken or erase the binaural beat." },
  { title: "Turn off Mono Audio", body: "An accessibility setting on phones and computers that sends the same sound to both ears. With it on, there is no binaural beat at all." },
  { title: "Keep the balance centered and EQ flat", body: "Check with the L/R test in the player: each tone should be in one ear only, at equal loudness." },
  { title: "Wired is the most reliable choice", body: "Wired headphones need no battery, never drop the connection mid-session, and add no compression or processing. Good Bluetooth headphones also work when the settings above are off." },
  { title: "Noise cancelling helps keep volume low", body: "Blocking outside noise means you can listen quietly. That's the main reason to pick ANC, wired or wireless." },
  { title: "For sleep, choose comfort", body: "Flat sleep earbuds or a soft headband with thin speakers are easier to lie on than over-ear headphones." },
];

export const SAFETY_SOURCES: Array<{ text: string; url?: string }> = [
  { text: "NIOSH (1998). Criteria for a Recommended Standard: Occupational Noise Exposure. Publication No. 98-126.", url: "https://www.cdc.gov/niosh/docs/98-126/" },
  { text: "WHO & ITU (2019). Safe listening devices and systems (ITU-T H.870).", url: "https://www.itu.int/rec/T-REC-H.870" },
  { text: "Fisher, R. S., et al. (2005). Photic- and pattern-induced seizures: a review for the Epilepsy Foundation of America Working Group. Epilepsia, 46(9), 1426–1441.", url: "https://doi.org/10.1111/j.1528-1167.2005.31405.x" },
  { text: "Leventhall, G. (2007). What is infrasound? Progress in Biophysics and Molecular Biology, 93(1–3), 130–137.", url: "https://doi.org/10.1016/j.pbiomolbio.2006.07.006" },
  { text: "ICNIRP (2020). Guidelines for limiting exposure to electromagnetic fields (100 kHz to 300 GHz). Health Physics, 118(5), 483–524.", url: "https://doi.org/10.1097/HP.0000000000001210" },
  { text: "IARC (2011). IARC classifies radiofrequency electromagnetic fields as possibly carcinogenic to humans. Press release No. 208.", url: "https://www.iarc.who.int/wp-content/uploads/2018/07/pr208_E.pdf" },
  { text: "Karipidis, K., et al. (2024). The effect of exposure to radiofrequency fields on cancer risk in the general and working population: a systematic review of human observational studies. Environment International, 191, 108983.", url: "https://doi.org/10.1016/j.envint.2024.108983" },
  { text: "Danker-Hopfe, H., et al. (2019). Effects of RF-EMF on the human resting-state EEG: the inconsistencies in the consistency. Bioelectromagnetics, 40(5).", url: "https://doi.org/10.1002/bem.22194" },
  { text: "Systematic review and meta-analysis of mobile-phone RF exposure and human EEG (2025). Bioelectromagnetics.", url: "https://doi.org/10.1002/bem.22531" },
  { text: "ANFR (2023). iPhone 12 marketing can resume in France following exceedance of the specific absorption rate's regulatory value limit.", url: "https://anfr.fr/liste-actualites/actualite/iphone-12-marketing-can-resume-in-france-following-exceedance-of-the-specific-absorption-rates-regulatory-value-limit" },
  { text: "Apple. RF Exposure information for iPhone and other Apple devices.", url: "https://www.apple.com/legal/rfexposure/" },
  { text: "World Health Organization. Radiation: electromagnetic fields (questions and answers).", url: "https://www.who.int/news-room/questions-and-answers/item/radiation-electromagnetic-fields" },
];

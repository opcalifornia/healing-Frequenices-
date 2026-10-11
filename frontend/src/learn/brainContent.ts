/**
 * Text for the "Inside Your Brain" guide. Kept as data so copy can be edited
 * without touching the diagrams. Claims are written to match the sources at
 * the bottom; keep them that way when editing.
 */
import type { Band } from "../types";

export type Region = "frontal" | "parietal" | "temporal" | "occipital" | "central" | "cerebellum" | "brainstem";

export const REGIONS: Record<Region, { name: string; does: string; hearing?: string }> = {
  frontal: {
    name: "Frontal lobe",
    does: "Planning, decisions, focus and self-control. Its rear edge holds the motor cortex, which starts voluntary movement, and in most people a left-side area (Broca's area) helps produce speech.",
  },
  central: {
    name: "Sensorimotor strip",
    does: "The band either side of the central groove: motor cortex in front, touch and body-sense cortex behind. Each strip is mapped to the opposite side of the body.",
  },
  parietal: {
    name: "Parietal lobe",
    does: "Touch, body position, and spatial awareness: knowing where things are around you and where your attention is pointed.",
  },
  temporal: {
    name: "Temporal lobe",
    does: "Hearing and language comprehension. The primary auditory cortex sits on its upper surface, and the hippocampus, key for forming memories, is tucked inside.",
    hearing: "Every sound you hear, including both binaural tones, ends up here, in both hemispheres.",
  },
  occipital: {
    name: "Occipital lobe",
    does: "Vision. It is also where the classic alpha rhythm is strongest when you close your eyes and relax.",
  },
  cerebellum: {
    name: "Cerebellum",
    does: "Coordination, balance and precise timing. It holds roughly 69 of the brain's 86 billion neurons.",
  },
  brainstem: {
    name: "Brainstem",
    does: "Keeps you alive on autopilot: breathing, heart rate and sleep-wake switching. It also hosts the first hearing stations where signals from your two ears meet, which is where a binaural beat is first created.",
  },
};

export interface BandInfo {
  band: Band;
  range: string;
  hz: [number, number];
  color: string;
  regions: Region[];
  where: string;
  when: string[];
  amplitude: string;
  /** Approximate peak-to-peak amplitude in microvolts, for the sample trace. */
  uv: number;
  centre: number;
  research: string;
  sessionId: string;
}

export const BANDS: BandInfo[] = [
  {
    band: "delta",
    range: "0.5–4 Hz",
    hz: [0.5, 4],
    color: "#5b7cff",
    regions: ["frontal"],
    where: "Widespread, and in adults usually largest over the front of the head during deep sleep.",
    when: ["Deep, dreamless sleep (stage N3)", "Infancy, when delta is common even awake", "Under anesthesia"],
    amplitude: "The biggest waves on an EEG, often 75 µV or more.",
    uv: 120,
    centre: 1.5,
    research: "Deep-sleep slow waves are linked to memory consolidation. In a 2013 lab study, quiet sound clicks timed to a sleeper's own slow waves made those waves stronger and improved next-day word recall. Continuous delta binaural beats have not been shown to do the same.",
    sessionId: "deep-rest",
  },
  {
    band: "theta",
    range: "4–8 Hz",
    hz: [4, 8],
    color: "#a46cff",
    regions: ["frontal", "temporal"],
    where: "A 'frontal midline' theta over the top-front of the head during concentration, plus theta deep in the temporal lobe's hippocampus.",
    when: ["Drowsiness and light sleep (stage N1)", "Focused mental work and some meditation", "Memory and navigation (hippocampal theta)"],
    amplitude: "Moderate, typically 20–100 µV.",
    uv: 60,
    centre: 6,
    research: "Frontal midline theta rises during sustained attention and in some meditation practices. Hippocampal theta is best studied in animals, where it organizes memory and navigation.",
    sessionId: "theta-temple",
  },
  {
    band: "alpha",
    range: "8–13 Hz",
    hz: [8, 13],
    color: "#19e3c4",
    regions: ["occipital", "parietal"],
    where: "Back of the head, over the visual cortex. It is strongest with eyes closed and drops the moment you open them.",
    when: ["Relaxed wakefulness with eyes closed", "Calm, idle moments between tasks", "Fades with visual attention or mental effort"],
    amplitude: "Typically 20–60 µV. The first rhythm ever recorded from a human scalp.",
    uv: 45,
    centre: 10,
    research: "Hans Berger described alpha in 1929. Today it is thought to reflect the brain 'gating' sensory input: alpha rises over areas that are being tuned out. Most adults' alpha peaks near 10 Hz, slowing gradually with age.",
    sessionId: "alpha-shore",
  },
  {
    band: "beta",
    range: "13–30 Hz",
    hz: [13, 30],
    color: "#ffc857",
    regions: ["central", "frontal"],
    where: "Front and centre of the head, especially over the motor and sensory strips.",
    when: ["Alert, active thinking and problem solving", "Holding a posture steady", "Dips during a movement, then rebounds after"],
    amplitude: "Small and fast, usually under 20 µV.",
    uv: 16,
    centre: 20,
    research: "Beta over the motor cortex is tied to keeping the current movement or mental set stable. It falls as you start to move and rebounds after you stop.",
    sessionId: "deep-work",
  },
  {
    band: "gamma",
    range: "30+ Hz",
    hz: [30, 100],
    color: "#ff7a8a",
    regions: ["frontal", "parietal", "temporal", "occipital"],
    where: "Local bursts in many areas, especially sensory cortex. It is hard to measure on the scalp because muscle activity looks similar.",
    when: ["Active processing and attention", "Binding features together (colour, shape, sound)", "Strong 40 Hz responses to 40 Hz sounds"],
    amplitude: "Tiny: a few microvolts at the scalp.",
    uv: 6,
    centre: 40,
    research: "Long-term meditators have shown unusually strong gamma (Lutz et al., 2004). In mice, 40 Hz light and sound reduced Alzheimer's-related plaques (2016 onward). Human trials are early, and results in mice often fail to carry over.",
    sessionId: "attention-40",
  },
];

export const SLEEP_STAGES = [
  { id: "W", name: "Awake", color: "#ffc857", rhythm: "Beta when alert, alpha when eyes are closed and relaxed.", share: "about 5%" },
  { id: "REM", name: "REM sleep", color: "#ff7a8a", rhythm: "Low, fast mixed waves that look almost awake, plus 'sawtooth' theta. Vivid dreams; your muscles are switched off.", share: "20–25%" },
  { id: "N1", name: "N1 · drifting off", color: "#a46cff", rhythm: "Alpha fades and slow theta takes over. Lasts only minutes.", share: "about 5%" },
  { id: "N2", name: "N2 · light sleep", color: "#19e3c4", rhythm: "Theta background with 'sleep spindles' (bursts at 11–16 Hz) and large K-complexes.", share: "about 50%" },
  { id: "N3", name: "N3 · deep sleep", color: "#5b7cff", rhythm: "Big, slow delta waves (0.5–2 Hz). Hardest to wake from; most of it happens in the first third of the night.", share: "15–25%, less with age" },
] as const;

export type StageId = (typeof SLEEP_STAGES)[number]["id"];

/** A typical adult night: [start minute, stage]. About five 90-minute cycles. */
export const HYPNOGRAM: Array<[number, StageId]> = [
  [0, "W"], [10, "N1"], [16, "N2"], [34, "N3"], [72, "N2"], [82, "REM"],
  [94, "N2"], [114, "N3"], [142, "N2"], [162, "REM"],
  [184, "N2"], [212, "N3"], [224, "N2"], [254, "REM"],
  [284, "N2"], [318, "N1"], [323, "N2"], [344, "REM"],
  [380, "N2"], [408, "W"], [412, "N2"], [430, "REM"], [472, "W"],
];

export interface Rhythm {
  name: string;
  lo: number;
  hi?: number;
  kind: "body" | "brain" | "app" | "sound";
  note: string;
}

export const RHYTHMS: Rhythm[] = [
  { name: "Circadian clock", lo: 1 / 86400, kind: "body", note: "The roughly 24-hour cycle of sleep, temperature and hormones, run by the suprachiasmatic nucleus in the hypothalamus. Its natural period is a little over 24 hours, and morning light resets it every day." },
  { name: "Sleep cycle", lo: 1 / (110 * 60), hi: 1 / (80 * 60), kind: "body", note: "About 90 minutes (80–110) through light, deep and REM sleep, repeated four to six times a night." },
  { name: "Resonance breathing", lo: 0.083, hi: 0.11, kind: "body", note: "Breathing at about 5–6.5 breaths per minute lines your heart rhythm up with your blood-pressure reflex and makes heart-rate variability swing widest. This is the basis of HRV biofeedback." },
  { name: "Resting breath", lo: 0.2, hi: 0.33, kind: "body", note: "12–20 breaths per minute is typical for a resting adult." },
  { name: "Resting heartbeat", lo: 1, hi: 1.67, kind: "body", note: "60–100 beats per minute. A healthy heart speeds up a little when you breathe in and slows when you breathe out." },
  { name: "Walking cadence", lo: 1.6, hi: 2.0, kind: "body", note: "Most people take about 100–120 steps a minute, close to 2 steps per second." },
  { name: "Brainwaves (EEG)", lo: 0.5, hi: 100, kind: "brain", note: "Delta, theta, alpha, beta and gamma: from one slow wave every two seconds up to around a hundred per second." },
  { name: "App binaural beats", lo: 0.5, hi: 40, kind: "app", note: "The difference between your two ears in our sessions. Deliberately inside the brainwave range." },
  { name: "Speaking voice pitch", lo: 85, hi: 255, kind: "sound", note: "Typical adult voices vibrate at about 85–180 Hz (lower voices) and 165–255 Hz (higher voices)." },
  { name: "App carrier tones", lo: 100, hi: 400, kind: "app", note: "The tones each ear actually hears. Binaural beats are clearest with carriers below about 1,000 Hz, and our 100–400 Hz range overlaps the speaking voice." },
  { name: "Human hearing", lo: 20, hi: 20000, kind: "sound", note: "About 20 Hz to 20,000 Hz, with the top end falling with age. Beat rates of a few hertz are far too slow to hear as a pitch, which is why the brain has to build them." },
];

export type Strength = "Strong" | "Moderate" | "Mixed" | "Weak" | "None";

export const EVIDENCE: Array<{ claim: string; finding: string; strength: Strength }> = [
  {
    claim: "Two slightly different tones, one per ear, are heard as a beat",
    finding: "Described in 1839 and replicated ever since. The beat is created in the brainstem, where the two ears' signals first meet.",
    strength: "Strong",
  },
  {
    claim: "The brain produces a measurable response at the beat rate",
    finding: "EEG can pick up a 'following' response at the beat frequency, mostly over hearing areas. It is weaker than the response to a beat that is actually in the sound, and clearest around 40 Hz.",
    strength: "Moderate",
  },
  {
    claim: "Slow breathing near 6 breaths per minute increases heart-rate variability",
    finding: "A consistent finding in HRV biofeedback research, and linked to feeling calmer. It is not specific to binaural beats, but pairs well with them.",
    strength: "Moderate",
  },
  {
    claim: "Listening can ease anxiety or help you relax",
    finding: "A 2019 meta-analysis found small-to-moderate average effects on anxiety, attention, memory and pain perception, with large differences between studies. Expectation and simply resting with headphones on likely play a part.",
    strength: "Mixed",
  },
  {
    claim: "A beat 'entrains' your whole brain to that frequency",
    finding: "A 2023 systematic review of EEG studies found results all over the place: only around a third of studies saw the expected shift, while most found none or the opposite.",
    strength: "Mixed",
  },
  {
    claim: "Binaural beats synchronize the left and right hemispheres",
    finding: "The original pitch behind mid-century programs. Very few studies have tested it directly, and their results are inconsistent.",
    strength: "Weak",
  },
  {
    claim: "People are 'left-brained' or 'right-brained'",
    finding: "A 2013 study of over 1,000 brain scans found no evidence that people favor one whole hemisphere. Specific functions lean to one side; personalities don't.",
    strength: "None",
  },
  {
    claim: "Frequencies treat or cure illness",
    finding: "There is no good evidence that any audio frequency treats or cures a disease. Our sessions are for relaxation, focus and sleep routines, not medical care.",
    strength: "None",
  },
];

export const SOURCES = [
  "Dove, H. W. (1839). Über die Kombination der Eindrücke beider Ohren und beider Augen zu einem Eindruck. Repertorium der Physik, 3, 494–498.",
  "Licklider, J. C. R., Webster, J. C., & Hedlun, J. M. (1950). On the frequency limits of binaural beats. Journal of the Acoustical Society of America, 22, 468–473.",
  "Oster, G. (1973). Auditory beats in the brain. Scientific American, 229(4), 94–102.",
  "Berger, H. (1929). Über das Elektrenkephalogramm des Menschen. Archiv für Psychiatrie und Nervenkrankheiten, 87, 527–570.",
  "Schwarz, D. W. F., & Taylor, P. (2005). Human auditory steady state responses to binaural and monaural beats. Clinical Neurophysiology, 116(3), 658–668.",
  "Garcia-Argibay, M., Santed, M. A., & Reales, J. M. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. Psychological Research, 83, 357–372.",
  "Ingendoh, R. M., Posny, E. S., & Heine, A. (2023). Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity. PLOS ONE, 18(5), e0286023.",
  "Nielsen, J. A., Zielinski, B. A., Ferguson, M. A., Lainhart, J. E., & Anderson, J. S. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity MRI. PLOS ONE, 8(8), e71275.",
  "Gazzaniga, M. S. (2005). Forty-five years of split-brain research and still going strong. Nature Reviews Neuroscience, 6, 653–659.",
  "Azevedo, F. A. C., et al. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. Journal of Comparative Neurology, 513(5), 532–541.",
  "Ngo, H.-V. V., Martinetz, T., Born, J., & Mölle, M. (2013). Auditory closed-loop stimulation of the sleep slow oscillation enhances memory. Neuron, 78(3), 545–553.",
  "Lutz, A., Greischar, L. L., Rawlings, N. B., Ricard, M., & Davidson, R. J. (2004). Long-term meditators self-induce high-amplitude gamma synchrony during mental practice. PNAS, 101(46), 16369–16373.",
  "Iaccarino, H. F., et al. (2016). Gamma frequency entrainment attenuates amyloid load and modifies microglia. Nature, 540, 230–235.",
  "Lehrer, P. M., & Gevirtz, R. (2014). Heart rate variability biofeedback: how and why does it work? Frontiers in Psychology, 5, 756.",
];

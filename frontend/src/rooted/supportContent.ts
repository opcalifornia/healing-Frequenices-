import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/**
 * Crisis resources and professional support.
 * Written to follow safe messaging guidelines for suicide prevention:
 * hopeful, direct, no method details, always pointing to real people.
 */

export interface Line {
  name: string;
  who: string;
  call?: string;
  callLabel?: string;
  text?: { to: string; body?: string; label: string };
  chat?: string;
  note?: string;
}

export const LINE_988: Line = {
  name: "988 Suicide & Crisis Lifeline",
  who: "Anyone in the US who is struggling or worried about someone. Free, confidential, 24/7.",
  call: "988",
  callLabel: "Call 988",
  text: { to: "988", label: "Text 988" },
  chat: "https://988lifeline.org/chat/",
  note: "Veterans press 1. Para español, oprima 2. Deaf or hard of hearing: use your preferred relay service or dial 711 then 988.",
};

export const CRISIS_LINES: Line[] = [
  LINE_988,
  { name: "Crisis Text Line", who: "Text with a trained crisis counselor, any time.", text: { to: "741741", body: "HOME", label: "Text HOME to 741741" } },
  { name: "The Trevor Project", who: "LGBTQ+ young people under 25.", call: "18664887386", callLabel: "Call 1-866-488-7386", text: { to: "678678", body: "START", label: "Text START to 678-678" } },
  { name: "Trans Lifeline", who: "Peer support run by and for trans people.", call: "18775658860", callLabel: "Call 877-565-8860" },
  { name: "National Domestic Violence Hotline", who: "If someone is hurting or threatening you.", call: "18007997233", callLabel: "Call 1-800-799-7233", text: { to: "88788", body: "START", label: "Text START to 88788" } },
  { name: "SAMHSA National Helpline", who: "Treatment referral for mental health and substance use. Free, 24/7, English and Spanish.", call: "18006624357", callLabel: "Call 1-800-662-4357" },
];

export const OUTSIDE_US = [
  { place: "Canada", how: "Call or text 9-8-8", call: "988" },
  { place: "UK and Ireland", how: "Samaritans: call 116 123", call: "116123" },
  { place: "Anywhere else", how: "Find a free helpline in your country at findahelpline.com", url: "https://findahelpline.com" },
];

export const IF_WORRIED = [
  "Ask directly: \"Are you thinking about suicide?\" Asking does not put the idea in someone's head. It tells them they can talk to you.",
  "Listen without judging or trying to fix. Let them know you're glad they told you.",
  "Help them connect: call or text 988 together, or stay with them while they reach out.",
  "If there's immediate danger, call 911 and stay with them. Help keep things they could use to hurt themselves out of reach.",
  "Follow up in the days after. A message that says \"thinking of you\" matters more than you'd guess.",
];

export const IF_WORRIED_SOURCE: Source = { text: "988 Lifeline and #BeThe1To: five action steps", url: "https://www.bethe1to.com/" };

/** Stanley-Brown Safety Planning Intervention, in plain language. */
export const SAFETY_PLAN_STEPS = [
  { id: "signs", title: "My warning signs", prompt: "Thoughts, feelings or situations that tell me a hard time might be starting.", placeholder: "e.g. not sleeping, pulling away from people, feeling like a burden" },
  { id: "coping", title: "Things I can do on my own", prompt: "Ways to take my mind off things, without contacting anyone.", placeholder: "e.g. go for a walk, a breathing exercise, a shower, music" },
  { id: "places", title: "People and places that help me feel better", prompt: "Where I can be around others, even without talking about how I feel.", placeholder: "e.g. a coffee shop, my sister's house, the gym" },
  { id: "people", title: "People I can ask for help", prompt: "People I trust to talk to. Add a phone number to call them in one tap.", placeholder: "Name, phone" },
  { id: "pros", title: "Professionals I can contact", prompt: "My therapist, doctor, or a crisis line. 988 is always here.", placeholder: "Name, phone" },
  { id: "safe", title: "Making my space safer", prompt: "Steps to keep things I could use to hurt myself away, or with someone I trust, during a crisis.", placeholder: "e.g. ask a friend to hold onto something for now" },
  { id: "reasons", title: "My reasons for living", prompt: "What matters most to me. The people, hopes and things worth staying for.", placeholder: "e.g. my kids, my dog, seeing the ocean again" },
] as const;
export type PlanStepId = (typeof SAFETY_PLAN_STEPS)[number]["id"];

export const SAFETY_PLAN_SOURCE: Source = { text: "Stanley B et al. Comparison of the Safety Planning Intervention with follow-up vs usual care of suicidal patients treated in the emergency department. JAMA Psychiatry, 2018", url: "https://doi.org/10.1001/jamapsychiatry.2018.1776" };

/** Words that suggest someone may be in crisis, for a gentle check-in. Not a diagnosis. */
const CRISIS_PATTERNS = [
  /\bkill(ing)? my ?self\b/i,
  /\bsuicid/i,
  /\bwant(ing)? to die\b/i,
  /\bend (it all|my life)\b/i,
  /\b(don'?t|do not) want to (be here|live|wake up)\b/i,
  /\bno reason to live\b/i,
  /\bhurt(ing)? my ?self\b/i,
  /\bbetter off without me\b/i,
  /\bself[- ]harm/i,
];
export function soundsLikeCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(text));
}

export interface Therapy {
  name: string;
  forWhat: string;
  body: string;
  evidence: Strength;
  source?: Source;
}

export const THERAPIES: Therapy[] = [
  { name: "Cognitive behavioral therapy (CBT)", forWhat: "Depression, anxiety, panic, OCD and more", body: "Learn to notice and change thought and behavior patterns that keep you stuck. Usually 8 to 20 weekly sessions, with practice between them. One of the most studied therapies there is.", evidence: "Strong" },
  { name: "CBT for insomnia (CBT-I)", forWhat: "Long-term trouble sleeping", body: "The recommended first treatment for chronic insomnia, ahead of sleeping pills, per the American College of Physicians. Works on sleep schedule, habits and racing thoughts at night.", evidence: "Strong", source: { text: "Qaseem A et al. Management of chronic insomnia disorder in adults. Ann Intern Med, 2016", url: "https://doi.org/10.7326/M15-2175" } },
  { name: "Trauma-focused therapy (CPT, PE, EMDR)", forWhat: "PTSD and trauma", body: "Structured therapies that help you process traumatic memories safely, so they lose their grip. Recommended in VA/DoD and APA PTSD guidelines.", evidence: "Strong" },
  { name: "Dialectical behavior therapy (DBT)", forWhat: "Intense emotions, self-harm, suicidal thoughts", body: "Skills for handling overwhelming emotions, distress and relationships. Studied specifically for reducing self-harm and suicide attempts.", evidence: "Moderate" },
  { name: "Mindfulness-based programs (MBSR, MBCT)", forWhat: "Stress, anxiety, preventing depression relapse", body: "Eight-week group courses in meditation and awareness. In a 2022 trial, MBSR was as effective as a common anti-anxiety medicine for anxiety disorders.", evidence: "Moderate", source: { text: "Hoge EA et al. MBSR vs escitalopram for anxiety disorders. JAMA Psychiatry, 2022", url: "https://doi.org/10.1001/jamapsychiatry.2022.3679" } },
];

export const FIND_THERAPY = [
  { title: "Through your insurance", body: "Call the number on your card or search your plan's website for in-network mental health providers. Ask about telehealth.", url: undefined },
  { title: "Therapist directories", body: "Search by location, insurance, specialty and cost.", url: "https://www.psychologytoday.com/us/therapists", label: "Psychology Today directory" },
  { title: "Lower-cost options", body: "Community health centers charge on a sliding scale by income.", url: "https://findahealthcenter.hrsa.gov/", label: "Find a health center (HRSA)" },
  { title: "Through work or school", body: "Many employers offer an Employee Assistance Program (EAP) with free, confidential sessions. Colleges usually have a counseling center." },
  { title: "Treatment referral", body: "SAMHSA's free helpline and locator for mental health and substance use services.", url: "https://findtreatment.gov/", label: "FindTreatment.gov" },
];

export const ASK_THERAPIST = [
  "Have you worked with people dealing with what I'm going through?",
  "What kind of therapy do you use, and what would a typical session look like?",
  "How will we know if it's working?",
  "Do you take my insurance, or offer a sliding scale?",
  "Do you offer telehealth?",
];

export interface Practice {
  name: string;
  what: string;
  evidence: Strength;
  body: string;
  find: string;
  findUrl?: string;
  caution?: string;
  source?: Source;
}

export const PRACTICES: Practice[] = [
  {
    name: "Physical therapy", what: "Movement-based care for pain, injury and recovery", evidence: "Strong",
    body: "Physical therapists assess how you move and build an exercise plan for back and neck pain, joint problems, and recovery after injury or surgery. In most US states you can see one without a referral.",
    find: "Use the APTA's Find a PT tool at ChoosePT, or ask your doctor.", findUrl: "https://www.choosept.com/",
  },
  {
    name: "Acupuncture", what: "Thin needles at specific points, from traditional Chinese medicine", evidence: "Moderate",
    body: "A large analysis of 20,000 patients found acupuncture worked better than sham acupuncture and usual care for chronic back, neck, knee and headache pain, though the difference from sham was modest. The American College of Physicians lists it as an option for low back pain.",
    find: "Look for a licensed acupuncturist (L.Ac.) certified by NCCAOM.", findUrl: "https://www.nccaom.org/",
    caution: "Make sure single-use, sterile needles are used. Tell them if you take blood thinners or are pregnant.",
    source: { text: "Vickers AJ et al. Acupuncture for chronic pain: update of an individual patient data meta-analysis. J Pain, 2018", url: "https://doi.org/10.1016/j.jpain.2017.11.005" },
  },
  {
    name: "Massage therapy", what: "Hands-on work on muscles and soft tissue", evidence: "Mixed",
    body: "Massage can ease low back pain and anxiety in the short term, but reviews rate the evidence as low quality and benefits often fade. Many people find it a worthwhile way to relax and reduce tension.",
    find: "Look for a licensed massage therapist (LMT). The AMTA has a directory.", findUrl: "https://www.amtamassage.org/",
    caution: "Skip deep pressure over areas with blood clots, recent injury, or if you take blood thinners. Tell them if you're pregnant.",
  },
  {
    name: "Chiropractic and spinal manipulation", what: "Hands-on adjustment of the spine", evidence: "Mixed",
    body: "Spinal manipulation is one of the options the American College of Physicians lists for low back pain, with small to moderate short-term benefits. Evidence for other conditions is weak.",
    find: "Ask your doctor for a referral, or look for a licensed chiropractor (DC).",
    caution: "Rare but serious complications have been reported with neck manipulation. Ask about gentler alternatives if you're concerned.",
  },
  {
    name: "Registered dietitian", what: "Personalized, evidence-based nutrition care", evidence: "Strong",
    body: "Registered dietitians (RD or RDN) are trained and licensed to give medical nutrition advice for diabetes, heart disease, digestive problems, eating disorders and more. Many insurance plans cover visits.",
    find: "Search the Academy of Nutrition and Dietetics directory.", findUrl: "https://www.eatright.org/find-a-nutrition-expert",
  },
];

import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/** Bands of light, from UV to near-infrared, with what they do to us. */
export interface Band {
  id: string;
  name: string;
  nm: [number, number];
  color: string;
  good: string;
  harm: string;
  rating: Strength;
}

export const BANDS: Band[] = [
  { id: "uvb", name: "UVB", nm: [280, 315], color: "#6a1b9a", rating: "Strong", good: "Lets your skin make vitamin D. A little goes a long way: brief exposure on arms and legs is enough for many people in summer.", harm: "Causes sunburn and is a major cause of skin cancer. Strongest from 10 am to 4 pm, at altitude, and near snow, water or sand." },
  { id: "uva", name: "UVA", nm: [315, 400], color: "#7e57c2", rating: "Strong", good: "Used medically, under supervision, for some skin conditions like psoriasis.", harm: "Penetrates deeper, ages skin and contributes to skin cancer. Passes through windows and clouds. Tanning beds are mostly UVA." },
  { id: "blue", name: "Blue", nm: [400, 490], color: "#2979ff", rating: "Moderate", good: "Your eye's clock-setting cells (melanopsin) respond most to blue light around 480 nm. Daytime blue light boosts alertness and keeps your body clock on time.", harm: "At night it suppresses melatonin and delays your clock, making it harder to fall asleep. Screens are not known to damage your eyes." },
  { id: "green", name: "Green and yellow", nm: [490, 590], color: "#66bb6a", rating: "Mixed", good: "The part of the spectrum your eyes are most sensitive to for seeing. Small studies are exploring green light for migraine.", harm: "Still affects your clock at night, though less than blue." },
  { id: "red", name: "Red", nm: [620, 700], color: "#e53935", rating: "Mixed", good: "Least disruptive to your body clock, so it's the best color for a night light. Used in photobiomodulation (red light therapy).", harm: "Very bright LED panels can still be uncomfortable for eyes. Protect them as the device maker recommends." },
  { id: "nir", name: "Near-infrared", nm: [700, 1000], color: "#8d2a2a", rating: "Mixed", good: "Penetrates deeper into tissue. Studied for pain, wound healing and hair growth, with mixed results.", harm: "Invisible, so you can't tell how bright it is. Never stare into IR sources or lasers." },
];

export interface LightFinding {
  id: string;
  title: string;
  stat: string;
  statLabel: string;
  body: string;
  doThis: string;
  rating: Strength;
  source?: Source;
  hue: number;
  kind: "healing" | "harm" | "myth";
}

export const LIGHT_FINDINGS: LightFinding[] = [
  {
    id: "morning", kind: "healing", title: "Morning daylight", stat: "10k+", statLabel: "lux outdoors, even on a cloudy day, versus about 300 to 500 indoors", rating: "Moderate", hue: 45,
    body: "Light in the first hours after waking is the strongest signal that sets your body clock. It helps you feel alert in the day and sleepy at the right time at night. Outdoor light is far brighter than indoor light, even through clouds.",
    doThis: "Get outside for 5 to 10 minutes within an hour of waking (longer if it's overcast). No sunglasses needed for this short time, but never look directly at the sun.",
  },
  {
    id: "sad", kind: "healing", title: "Bright light therapy for winter depression", stat: "1st", statLabel: "line treatment for seasonal depression, as effective as antidepressants in trials", rating: "Strong", hue: 50,
    body: "A meta-analysis of randomized trials found bright light therapy significantly reduced symptoms of seasonal affective disorder. A later trial found it helped non-seasonal depression too, especially combined with an antidepressant. It's one of the best-evidenced uses of light in medicine.",
    doThis: "Use a 10,000-lux, UV-filtered light box for 20 to 30 minutes within an hour of waking, about 16 to 24 inches from your face, off to the side. Don't stare into it. Talk to your doctor first, especially if you have bipolar disorder or an eye condition.",
    source: { text: "Golden RN et al. The efficacy of light therapy in the treatment of mood disorders: a review and meta-analysis. Am J Psychiatry, 2005", url: "https://doi.org/10.1176/appi.ajp.162.4.656" },
  },
  {
    id: "night", kind: "harm", title: "Light at night", stat: "1 night", statLabel: "of sleeping with a light on impaired insulin response the next morning", rating: "Moderate", hue: 230,
    body: "Reading on a light-emitting tablet before bed delayed melatonin and the body clock compared with a printed book, and people felt sleepier the next morning. In another lab study, sleeping one night in moderate room light raised heart rate and impaired insulin sensitivity the next morning.",
    doThis: "Dim and warm your lights two to three hours before bed, use night mode on screens, and keep your bedroom as dark as you can. For night-time trips, a dim red or amber night light is best.",
    source: { text: "Chang AM et al. Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness. PNAS, 2015", url: "https://doi.org/10.1073/pnas.1418490112" },
  },
  {
    id: "uv", kind: "harm", title: "UV and sunburn", stat: "SPF 30+", statLabel: "broad-spectrum sunscreen when the UV index is 3 or higher", rating: "Strong", hue: 285,
    body: "UV radiation is the main preventable cause of skin cancer, and it also damages eyes (cataracts). Sunburns, especially in childhood, raise melanoma risk. You can get UV damage on cloudy days and through car windows.",
    doThis: "Check the UV index. At 3 or above: shade at midday, a hat, UV400 sunglasses, and broad-spectrum SPF 30+ sunscreen reapplied every 2 hours and after swimming.",
  },
  {
    id: "tanning", kind: "harm", title: "Tanning beds", stat: "+75%", statLabel: "melanoma risk for people who start indoor tanning before age 35", rating: "Strong", hue: 15,
    body: "The World Health Organization's cancer agency classifies UV tanning devices as carcinogenic to humans, its highest category, alongside tobacco. There's no safe tan from a tanning bed, and tanning beds are a poor source of vitamin D.",
    doThis: "Skip tanning beds entirely. If you want a tan, self-tanning lotion is the safe option. For vitamin D, talk to your doctor about food or supplements.",
  },
  {
    id: "red", kind: "healing", title: "Red light therapy", stat: "Mixed", statLabel: "strong for a few uses, weak or unproven for most claims", rating: "Mixed", hue: 0,
    body: "Photobiomodulation uses low-level red and near-infrared light. The best evidence is for preventing mouth sores during cancer treatment, where cancer-care guidelines recommend it, and for some FDA-cleared devices for hereditary hair loss. Evidence for wrinkles, pain and healing is small and mixed. Claims about fat loss, detox or testosterone aren't supported.",
    doThis: "If you try a home device, choose one that's FDA-cleared for the specific use, follow the eye protection instructions, and set realistic expectations. 'FDA-cleared' means it's considered safe and similar to an existing device, not that every marketing claim is proven.",
  },
  {
    id: "glasses", kind: "myth", title: "Blue-light glasses for eye strain", stat: "No", statLabel: "short-term benefit for eye strain in a Cochrane review", rating: "None", hue: 210,
    body: "A 2023 Cochrane review of 17 trials found blue-light filtering lenses probably make no difference to eye strain from screens in the short term, and effects on sleep are uncertain. The American Academy of Ophthalmology doesn't recommend them.",
    doThis: "For tired eyes, follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Blink more, and keep the screen at arm's length. For better sleep, dim and warm your lights at night instead.",
    source: { text: "Singh S et al. Blue-light filtering spectacles for computer vision syndrome and sleep. Cochrane Database Syst Rev, 2023", url: "https://doi.org/10.1002/14651858.CD013244.pub2" },
  },
  {
    id: "screens", kind: "myth", title: "Do screens damage your eyes?", stat: "No", statLabel: "evidence that screen light damages the retina", rating: "None", hue: 200,
    body: "The amount of blue light from phones and computers is tiny compared with daylight, and there's no evidence it harms the eye. Screen use can cause temporary eye strain, mostly from focusing up close and blinking less.",
    doThis: "Take regular breaks, use the 20-20-20 rule, and get outside: time outdoors also lowers the risk of nearsightedness in children.",
  },
];

export const LIGHT_SAFETY = [
  "Light therapy can trigger mania or hypomania in people with bipolar disorder. Use it only with a doctor's guidance.",
  "Some medicines and supplements make your eyes and skin more sensitive to light, including some antibiotics, acne medicines, lithium and St. John's wort. Ask your pharmacist.",
  "If you have an eye condition like macular degeneration or glaucoma, or diabetes affecting your eyes, check with an eye doctor before light therapy.",
  "Never look at lasers, the sun, or very bright LEDs directly. Keep laser pointers away from children.",
  "Flashing lights can trigger seizures in people with photosensitive epilepsy. See our Frequencies & Your Health guide.",
];

export const LIGHT_GEAR = [
  { name: "Light therapy box", spec: "10,000 lux at your sitting distance, UV-filtered, a large surface (about 12 by 15 inches or bigger)", id: "custom-light-therapy-box", aisle: "Other" },
  { name: "Dawn simulator alarm clock", spec: "Gradually brightens before your alarm. Small studies support dawn simulation for winter blues.", id: "custom-dawn-simulator", aisle: "Other" },
  { name: "Amber or red night light", spec: "Dim, warm light for night-time trips without fully waking your body clock", id: "custom-amber-night-light", aisle: "Other" },
  { name: "Blackout curtains or a sleep mask", spec: "Keep your bedroom dark, especially in summer or near streetlights", id: "custom-blackout-curtains", aisle: "Other" },
  { name: "UV400 sunglasses", spec: "Block 99 to 100% of UVA and UVB. Darkness of the tint doesn't indicate UV protection.", id: "custom-uv400-sunglasses", aisle: "Other" },
  { name: "Broad-spectrum sunscreen, SPF 30+", spec: "Water-resistant if you'll sweat or swim", id: "custom-sunscreen", aisle: "Other" },
];

export const LIGHT_SOURCES: Source[] = [
  { text: "Lam RW et al. Efficacy of bright light treatment, fluoxetine, and the combination in nonseasonal major depressive disorder. JAMA Psychiatry, 2016", url: "https://doi.org/10.1001/jamapsychiatry.2015.2235" },
  { text: "Mason IC et al. Light exposure during sleep impairs cardiometabolic function. PNAS, 2022", url: "https://doi.org/10.1073/pnas.2113290119" },
  { text: "IARC: Sunbeds and UV radiation classified as carcinogenic to humans (Group 1), 2009" },
  { text: "International Agency for Research on Cancer Working Group. The association of use of sunbeds with cutaneous malignant melanoma: a systematic review. Int J Cancer, 2007", url: "https://doi.org/10.1002/ijc.22453" },
  { text: "American Academy of Ophthalmology: Should you be worried about blue light?", url: "https://www.aao.org/eye-health" },
  { text: "US EPA: UV Index scale", url: "https://www.epa.gov/sunsafety" },
];

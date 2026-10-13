import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/** A Blue Zone: a region where researchers reported unusually many people living to 90 and 100. */
export interface BlueZone {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  hue: number;
  tagline: string;
  /** What researchers reported about how people live there. */
  life: string[];
  research: string;
  caveat: string;
  bringHome: string;
}

export const BLUE_ZONES: BlueZone[] = [
  {
    id: "okinawa", name: "Okinawa", country: "Japan", lat: 26.3, lon: 127.8, hue: 350,
    tagline: "Moai friendships, ikigai and \"hara hachi bu\"",
    life: [
      "Lifelong friend groups called moai that support each other socially and financially.",
      "A sense of purpose, or ikigai: a reason to get up in the morning, even very late in life.",
      "\"Hara hachi bu\": a saying reminding people to stop eating when about 80% full.",
      "A traditional diet heavy in sweet potato, vegetables, soy and seaweed, with little meat.",
      "Daily gardening and lots of sitting on, and getting up from, the floor.",
    ],
    research: "Okinawa had some of the world's highest reported rates of centenarians, studied for decades in the Okinawa Centenarian Study. Older generations ate a mostly plant-based diet with modest calories.",
    caveat: "Younger Okinawans now eat a more Western diet, and the region's life-expectancy advantage has shrunk. Some researchers have questioned how reliable old Japanese age records are, because many family registers were destroyed in World War II.",
    bringHome: "Build your own moai: a small group you see every week. Try pausing at \"comfortably satisfied\" rather than full.",
  },
  {
    id: "sardinia", name: "Sardinia", country: "Italy", lat: 40.1, lon: 9.4, hue: 20,
    tagline: "Shepherds, steep hills and family at the center",
    life: [
      "Many older men worked as shepherds, walking miles a day over hilly ground.",
      "Elders live with or near family, and are respected and included.",
      "Meals built on whole-grain bread, beans, garden vegetables, goat's and sheep's milk cheese.",
      "A small glass of local red wine with meals and friends, for those who drink.",
      "Daily laughter and gathering in the village street.",
    ],
    research: "Demographers Michel Poulain and Gianni Pes mapped villages in Sardinia's mountainous interior with an unusually high share of men reaching 100, and marked them in blue ink on the map: the origin of the name \"Blue Zone.\" Sardinia's age records were checked against birth and church registers.",
    caveat: "Sardinia's records are considered among the better-validated, but long-lived villages are small populations, so chance and migration can skew the numbers. Wine is not a health recommendation: if you don't drink, there's no reason to start.",
    bringHome: "Make walking part of how you get around, and choose routes with hills or stairs. Share meals with family or friends.",
  },
  {
    id: "nicoya", name: "Nicoya", country: "Costa Rica", lat: 10.1, lon: -85.4, hue: 140,
    tagline: "\"Plan de vida\", hard work and beans and corn",
    life: [
      "A strong \"plan de vida\", or reason to live, often centered on family.",
      "Physical work outside well into old age.",
      "The traditional \"three sisters\": corn tortillas, beans and squash.",
      "Hard water rich in calcium and magnesium (a possible but unproven factor).",
      "Frequent visits with neighbors and close family ties.",
    ],
    research: "Studies of Costa Rica's older adults found men in the Nicoya Peninsula had longer life expectancy at age 60 than elsewhere in the country, and longer telomeres, a marker linked to cellular aging.",
    caveat: "Later analyses suggested Nicoya's advantage has faded in younger generations, and that it's concentrated among men. As with other zones, it's hard to separate lifestyle from genes, history and chance.",
    bringHome: "Write down your own \"plan de vida\": who and what you're living for. Put beans on the menu a few times a week.",
  },
  {
    id: "ikaria", name: "Ikaria", country: "Greece", lat: 37.6, lon: 26.2, hue: 210,
    tagline: "Naps, herbal teas and island time",
    life: [
      "A Mediterranean diet: olive oil, wild greens, beans, potatoes, fish and goat's milk.",
      "Regular afternoon naps and a relaxed relationship with the clock.",
      "Herbal teas from local plants like sage, oregano and rosemary.",
      "Hilly terrain, so everyday life means walking and gardening.",
      "Close community and frequent festivals, or panigiria.",
    ],
    research: "Surveys on Ikaria reported many residents over 90 with relatively low rates of dementia and depression. The island's diet closely matches the Mediterranean pattern, which has strong evidence for heart health from large trials.",
    caveat: "The Ikaria data come mainly from small surveys, and age records on Greek islands are not always reliable. The benefits of the Mediterranean diet are better supported than the island's longevity figures themselves.",
    bringHome: "Cook with olive oil, beans and greens. Protect a short rest in the afternoon if your day allows it.",
  },
  {
    id: "loma-linda", name: "Loma Linda", country: "California, USA", lat: 34.05, lon: -117.26, hue: 45,
    tagline: "Sabbath rest, plant-based eating and faith community",
    life: [
      "A weekly 24-hour Sabbath for rest, family, nature walks and worship.",
      "Many follow a vegetarian or mostly plant-based diet, with nuts and legumes.",
      "Little or no alcohol or tobacco.",
      "Volunteering and close faith-based community.",
      "Regular, moderate exercise.",
    ],
    research: "The Adventist Health Studies have followed tens of thousands of Seventh-day Adventists for decades. Members, especially vegetarians, lived several years longer on average than other Californians, with lower rates of heart disease and some cancers.",
    caveat: "Loma Linda is the best-documented Blue Zone because it's based on large, long-running cohort studies, but people who join and stay in a health-focused faith community may differ in many ways that are hard to fully adjust for.",
    bringHome: "Choose one day or half-day a week to unplug from work and spend time outdoors with people you love.",
  },
];

export const BLUE_ZONE_CAVEAT = {
  title: "Are Blue Zones real? It's debated.",
  body: "Blue Zones were popularized by Dan Buettner with National Geographic, building on demographic work in Sardinia and long-running studies in Okinawa and Loma Linda. In 2024, researcher Saul Newman published analyses arguing that many records of extreme old age, including in some Blue Zones, show patterns that suggest clerical errors, missing birth certificates and pension fraud, and that extreme longevity tends to cluster where records are poorest. Blue Zones researchers dispute this, pointing to age validation work in places like Sardinia. The fair takeaway: exactly how many centenarians live in each place is debated, but the habits themselves (moving naturally, eating mostly plants, purpose, rest and close relationships) are each supported by separate research.",
};

export interface Habit {
  id: string;
  title: string;
  body: string;
  group: "Move" | "Outlook" | "Eat" | "Belong";
  rating: Strength;
  hue: number;
}

/** The "Power 9": lessons Buettner's team drew from what the zones have in common. */
export const POWER_9: Habit[] = [
  { id: "move", group: "Move", title: "Move naturally", hue: 200, rating: "Strong", body: "Not gym marathons: walking, gardening, stairs, kneading bread. Regular physical activity is one of the best-evidenced ways to lower the risk of heart disease, diabetes and early death." },
  { id: "purpose", group: "Outlook", title: "Purpose", hue: 45, rating: "Moderate", body: "Knowing why you wake up in the morning. Cohort studies link a stronger sense of purpose with lower mortality, though it's hard to prove cause and effect." },
  { id: "downshift", group: "Outlook", title: "Downshift", hue: 260, rating: "Moderate", body: "Daily rituals to shed stress: prayer, a nap, remembering ancestors, a happy hour with friends. Chronic stress affects sleep, blood pressure and mood." },
  { id: "80", group: "Eat", title: "The 80% rule", hue: 30, rating: "Mixed", body: "Stop eating when you're no longer hungry, not when you're full. Eating slowly and mindfully may help with weight, though trials of this exact rule are limited." },
  { id: "plants", group: "Eat", title: "Plant slant", hue: 120, rating: "Strong", body: "Beans, whole grains, vegetables, fruit and nuts as the base, with meat as a small or occasional side. Diets like this are linked with lower heart disease risk in large studies and trials." },
  { id: "wine", group: "Eat", title: "Wine at five?", hue: 340, rating: "Weak", body: "Most Blue Zone residents (outside Loma Linda) drank modestly with food and friends. Newer research suggests no amount of alcohol is risk-free, so the social ritual matters more than the drink. If you don't drink, don't start." },
  { id: "faith", group: "Belong", title: "Belong", hue: 280, rating: "Moderate", body: "Most centenarians interviewed belonged to a faith-based community. Regular religious attendance is linked with longer life in cohort studies, probably partly through social support. Any caring community may help." },
  { id: "family", group: "Belong", title: "Loved ones first", hue: 15, rating: "Moderate", body: "Keeping aging parents and grandparents close, committing to a partner, and investing time in children. Strong family and social ties are linked with better health." },
  { id: "tribe", group: "Belong", title: "Right tribe", hue: 180, rating: "Moderate", body: "Social circles that support healthy habits. Habits like smoking, eating and even happiness tend to spread through social networks. Loneliness is linked with higher risk of heart disease and early death." },
];

export interface HealingPlace {
  id: string;
  title: string;
  kicker: string;
  stat: string;
  statLabel: string;
  body: string;
  evidence: Strength;
  evidenceNote: string;
  cautions: string[];
  bringHome: string[];
  source?: Source;
  hue: number;
}

export const HEALING_PLACES: HealingPlace[] = [
  {
    id: "forest", title: "Forest bathing", kicker: "Shinrin-yoku", stat: "2 hrs", statLabel: "a week in nature was linked with better health and wellbeing in a study of 20,000 people", hue: 130,
    evidence: "Moderate", evidenceNote: "Moderate for short-term drops in stress and blood pressure; long-term effects are less clear.",
    body: "Shinrin-yoku, or \"forest bathing,\" was promoted in Japan in the 1980s: slow, unhurried time among trees, using all your senses. It's not exercise or hiking. Reviews of mostly small studies found that time in forests may lower stress hormones, heart rate and blood pressure, and improve mood, compared with time in a city. Many studies are short, small and hard to blind, so treat the results as promising rather than proven.",
    cautions: [
      "Check for ticks after walks in long grass or woods, and know the signs of Lyme disease where it's common.",
      "Tell someone where you're going, bring water, and stay on marked trails.",
      "Forest bathing is a complement to medical care, not a treatment for high blood pressure or depression on its own.",
    ],
    bringHome: [
      "Take a 20-minute slow walk in the greenest place nearby: a park, tree-lined street or garden.",
      "Leave your phone in your pocket. Notice five things you can see, four you can hear, three you can smell.",
      "Aim for about two hours a week in nature, in whatever chunks work for you.",
    ],
    source: { text: "Hansen MM, Jones R, Tocchini K. Shinrin-Yoku (Forest Bathing) and Nature Therapy: A State-of-the-Art Review. Int J Environ Res Public Health, 2017", url: "https://doi.org/10.3390/ijerph14080851" },
  },
  {
    id: "springs", title: "Hot springs and spas", kicker: "Balneotherapy", stat: "Some", statLabel: "evidence that mineral baths may ease arthritis and back pain for a while", hue: 15,
    evidence: "Moderate", evidenceNote: "Moderate for short-term relief of some musculoskeletal pain, like osteoarthritis and chronic low back pain. Weak for most other claims.",
    body: "Balneotherapy means bathing in mineral or thermal water, and it's part of standard care in some European countries. Reviews suggest it may ease pain and stiffness from osteoarthritis, chronic low back pain and fibromyalgia for weeks to months, but many trials are small and it's hard to tell how much comes from warmth, rest and the setting itself. Claims that particular minerals \"detox\" the body or cure disease aren't supported.",
    cautions: [
      "Heat lowers blood pressure and makes the heart work harder. If you have heart disease, low or uncontrolled high blood pressure, or have fainted before, ask your doctor first.",
      "In pregnancy, avoid hot tubs and very hot springs, especially in the first trimester: raising your core temperature may affect the baby.",
      "Limit soaks to 10 to 15 minutes, stay hydrated, skip alcohol, and get out slowly if you feel dizzy.",
      "Hot tubs can spread germs like Legionella and Pseudomonas (\"hot tub rash\"). Use well-maintained, properly disinfected tubs, don't swallow the water, and shower after.",
      "In natural hot springs, keep your head above water: rare but serious amoeba infections can enter through the nose in warm untreated water.",
    ],
    bringHome: [
      "A warm bath before bed (about 1 to 2 hours before sleep) may help you fall asleep faster.",
      "Add a warm shower on stiff mornings, then gentle stretching.",
      "Make it a ritual: dim lights, no phone, a cool glass of water after.",
    ],
    source: { text: "CDC: Healthy Swimming, hot tubs and spas", url: "https://www.cdc.gov/healthy-swimming/" },
  },
  {
    id: "blue", title: "Blue spaces", kicker: "Coasts, lakes and rivers", stat: "Coast", statLabel: "living near the coast was linked with better health in large European studies", hue: 200,
    evidence: "Mixed", evidenceNote: "Mostly observational. Consistent links with mood and activity, but cause and effect is hard to prove.",
    body: "\"Blue space\" means places with water: coasts, lakes, rivers and even canals and fountains. The EU-funded BlueHealth research program and other studies found people who live near or regularly visit water tend to report better mental health and are more active. Watching or listening to water seems restful for many people. These studies mostly show associations, and wealthier people often live near water, so the effect of water itself is still being worked out.",
    cautions: [
      "Drowning is a leading cause of accidental death. Swim at lifeguarded beaches, never alone, and know the signs of rip currents.",
      "Cold-water swimming can trigger cold shock and heart rhythm problems. Build up slowly and talk to your doctor first if you have a heart condition.",
      "Check local water-quality advisories for algae blooms or sewage after heavy rain.",
      "Sun reflects off water, so sun protection matters more.",
    ],
    bringHome: [
      "Find your nearest water: a lake, river path, canal or fountain, and walk there once a week.",
      "Listen to recorded ocean or rain sounds while winding down.",
      "Eat lunch by water when you can.",
    ],
    source: { text: "Gascon M et al. Outdoor blue spaces, human health and well-being: A systematic review of quantitative studies. Int J Hyg Environ Health, 2017", url: "https://doi.org/10.1016/j.ijheh.2017.08.004" },
  },
  {
    id: "dark", title: "Dark-sky places", kicker: "Stars, sleep and awe", stat: "~2 hrs", statLabel: "earlier body clock after a summer camping week with only natural light, in a small study", hue: 245,
    evidence: "Mixed", evidenceNote: "Small studies support natural light-dark cycles for body-clock timing. Research on awe is early.",
    body: "Most people now live under skies too bright to see the Milky Way. Certified dark-sky parks and reserves protect natural darkness. In a small study, a week of camping with only natural light (bright days, dark nights) shifted people's body clocks earlier, toward sunrise and sunset. Looking at a vast starry sky is also a classic trigger of awe, which early research links with feeling more relaxed, more connected and less focused on everyday worries.",
    cautions: [
      "Bring a red-light headlamp: it keeps your night vision and is easier on your body clock.",
      "Dark sites are often remote. Plan for cold nights, tell someone your plans, and drive carefully on unlit roads.",
    ],
    bringHome: [
      "Make your bedroom truly dark: blackout curtains or a mask, and cover small LEDs.",
      "On a clear night, step outside, let your eyes adjust for 15 to 20 minutes, and look up.",
      "Dim indoor lights for the last hours of your evening.",
    ],
    source: { text: "Wright KP Jr et al. Entrainment of the human circadian clock to the natural light-dark cycle. Curr Biol, 2013", url: "https://doi.org/10.1016/j.cub.2013.06.039" },
  },
  {
    id: "mountains", title: "Mountains and green space", kicker: "Parks, gardens and trails", stat: "120 min", statLabel: "a week in nature, the threshold where benefits appeared in one large study", hue: 100,
    evidence: "Moderate", evidenceNote: "Consistent observational links between green space and mental health; experimental studies are smaller.",
    body: "You don't need a remote wilderness. City parks, gardens and tree-lined streets count. Reviews link access to green space with lower stress, better mood and more physical activity, and the World Health Organization recommends green space as part of healthy cities. In a study of about 20,000 people in England, those who spent at least 120 minutes a week in nature were more likely to report good health and wellbeing, however they split that time up.",
    cautions: [
      "At high altitude, go up gradually. Headache, nausea and breathlessness can signal altitude sickness: go back down if symptoms get worse.",
      "Sun is stronger at altitude. Wear sunscreen and sunglasses.",
    ],
    bringHome: [
      "Map three green spots within 10 minutes of home or work.",
      "Swap one indoor workout a week for a walk outside.",
      "Bring nature in: houseplants, a window box, or a view of trees from your desk.",
    ],
    source: { text: "White MP et al. Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Sci Rep, 2019", url: "https://doi.org/10.1038/s41598-019-44097-3" },
  },
];

/** How to vet a wellness retreat before you book. */
export const RETREAT_GREEN_FLAGS = [
  { title: "Real credentials", body: "Teachers and therapists list their training and licenses, and you can verify them: licensed medical or mental health professionals, certified yoga teachers, registered dietitians." },
  { title: "Health screening", body: "They ask about your health, medicines and mental health history before you arrive, and adjust activities for you." },
  { title: "Safety plan", body: "Staff trained in first aid, a clear plan for medical emergencies, and a realistic distance to the nearest hospital." },
  { title: "Honest promises", body: "They talk about rest, skills and support, not cures. Outcomes are described as \"may help\" with evidence you can check." },
  { title: "Clear prices and policies", body: "Full costs, cancellation terms and what's included are written down. No pressure to pay more once you're there." },
  { title: "Freedom to opt out", body: "You can skip any session, leave early, and contact the outside world. Consent is asked for, not assumed." },
];

export const RETREAT_RED_FLAGS = [
  "Promises to cure cancer, autoimmune disease, addiction, trauma or depression.",
  "Telling you to stop prescribed medicines, or to skip your doctor.",
  "Plant medicines or psychedelics (like ayahuasca, psilocybin or iboga) offered without medical and psychiatric screening, trained staff and emergency care on site. These can be dangerous with heart conditions, some antidepressants and a personal or family history of psychosis or bipolar disorder. Iboga in particular has been linked with deaths from heart rhythm problems.",
  "Extreme fasting, water-only \"cleanses,\" sleep deprivation or punishing heat sessions (like sweat lodges) without medical oversight.",
  "Taking your phone, isolating you from family, or pressuring you to sign up for more.",
  "Leaders who can't explain their training, or who claim special powers.",
  "Reviews that only appear on their own website, or no way to find independent reviews.",
];

export const RETREAT_QUESTIONS = [
  "Who leads each session, and what are their qualifications?",
  "How do you screen for health conditions and medicines before I arrive?",
  "What happens if someone has a medical or mental health emergency?",
  "What's the evidence for the main practices you offer?",
  "Can I skip activities or leave early, and what's the refund policy?",
];

export interface HomeAction {
  id: string;
  text: string;
  place: string;
  hue: number;
}

/** Small, weekly ways to bring a healing place into ordinary life. */
export const BRING_HOME: HomeAction[] = [
  { id: "walk", text: "Take a 20-minute slow walk somewhere green", place: "Forest", hue: 130 },
  { id: "120", text: "Add up to about 2 hours in nature this week", place: "Green space", hue: 100 },
  { id: "water", text: "Visit water: a lake, river, beach or fountain", place: "Blue space", hue: 200 },
  { id: "bath", text: "Have a warm bath or shower 1 to 2 hours before bed", place: "Hot springs", hue: 15 },
  { id: "sky", text: "Step outside on a clear night and look up for 15 minutes", place: "Dark sky", hue: 245 },
  { id: "dark", text: "Make your bedroom fully dark tonight", place: "Dark sky", hue: 245 },
  { id: "beans", text: "Eat a meal built around beans, greens and whole grains", place: "Blue Zones", hue: 120 },
  { id: "moai", text: "Share a meal or a walk with friends or family", place: "Blue Zones", hue: 350 },
  { id: "purpose", text: "Write one line about why you get up in the morning", place: "Blue Zones", hue: 45 },
  { id: "rest", text: "Protect a few hours of unplugged rest this week", place: "Blue Zones", hue: 260 },
  { id: "move", text: "Choose stairs, hills or walking for an everyday errand", place: "Blue Zones", hue: 200 },
  { id: "plant", text: "Bring nature in: a houseplant, window box or tree view", place: "Green space", hue: 110 },
];

export const PLACES_SOURCES: Source[] = [
  { text: "Buettner D, Skemp S. Blue Zones: Lessons From the World's Longest Lived. Am J Lifestyle Med, 2016", url: "https://doi.org/10.1177/1559827616637066" },
  { text: "Buettner D. The Secrets of Long Life. National Geographic, November 2005" },
  { text: "Poulain M et al. Identification of a geographic area characterized by extreme longevity in the Sardinia island: the AKEA study. Exp Gerontol, 2004" },
  { text: "Newman SJ. Supercentenarian and remarkable age records exhibit patterns indicative of clerical errors and pension fraud. bioRxiv preprint, updated 2024" },
  { text: "Ideno Y et al. Blood pressure-lowering effect of Shinrin-yoku (Forest bathing): a systematic review and meta-analysis. BMC Complement Altern Med, 2017", url: "https://doi.org/10.1186/s12906-017-1912-z" },
  { text: "Hansen MM, Jones R, Tocchini K. Shinrin-Yoku (Forest Bathing) and Nature Therapy: A State-of-the-Art Review. Int J Environ Res Public Health, 2017", url: "https://doi.org/10.3390/ijerph14080851" },
  { text: "White MP et al. Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Sci Rep, 2019", url: "https://doi.org/10.1038/s41598-019-44097-3" },
  { text: "Gascon M et al. Outdoor blue spaces, human health and well-being: A systematic review of quantitative studies. Int J Hyg Environ Health, 2017", url: "https://doi.org/10.1016/j.ijheh.2017.08.004" },
  { text: "Grellier J et al. BlueHealth: a study programme protocol for mapping and quantifying the potential benefits to public health and well-being from Europe's blue spaces. BMJ Open, 2017" },
  { text: "Verhagen AP et al. Balneotherapy (or spa therapy) for rheumatoid arthritis. Cochrane Database Syst Rev, 2015", url: "https://doi.org/10.1002/14651858.CD000518.pub2" },
  { text: "CDC: Healthy Swimming, hot tubs and spas", url: "https://www.cdc.gov/healthy-swimming/" },
  { text: "Wright KP Jr et al. Entrainment of the human circadian clock to the natural light-dark cycle. Curr Biol, 2013", url: "https://doi.org/10.1016/j.cub.2013.06.039" },
  { text: "World Health Organization Regional Office for Europe. Urban green spaces and health: a review of evidence, 2016" },
  { text: "NIH National Center for Complementary and Integrative Health (NCCIH)", url: "https://www.nccih.nih.gov/" },
  { text: "DarkSky International: International Dark Sky Places", url: "https://darksky.org/" },
];

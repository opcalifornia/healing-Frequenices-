import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/** The handful of diet findings with the strongest human evidence, in plain language. */
export interface Finding {
  id: string;
  title: string;
  stat: string;
  statLabel: string;
  body: string;
  doThis: string;
  evidence: Strength;
  source: Source;
  hue: number;
}

export const FINDINGS: Finding[] = [
  {
    id: "mediterranean", title: "Eat like the Mediterranean", stat: "~30%", statLabel: "fewer heart attacks, strokes and heart deaths",
    body: "In PREDIMED, a randomized trial of about 7,400 adults at high heart risk in Spain, a Mediterranean diet with extra virgin olive oil or nuts cut major cardiovascular events by about 30% compared with a reduced-fat diet. The diet: vegetables, legumes, fruit, whole grains, fish, olive oil and nuts, with little red meat or sweets.",
    doThis: "Make olive oil your main fat, eat beans or lentils most days, and have a handful of nuts.",
    evidence: "Strong", hue: 70,
    source: { text: "Estruch R et al. NEJM, 2018", url: "https://doi.org/10.1056/NEJMoa1800389" },
  },
  {
    id: "fiber", title: "Get 25 to 29 grams of fiber", stat: "15–30%", statLabel: "lower risk of death, heart disease, stroke and type 2 diabetes",
    body: "A WHO-commissioned set of meta-analyses covering 185 cohort studies and 58 trials found that people eating 25 to 29 g of fiber a day had 15 to 30% lower risk of death from all causes, heart disease, stroke, type 2 diabetes and colorectal cancer than people eating the least. More was better. Most adults get about 15 g.",
    doThis: "Add beans, oats, berries, vegetables and seeds. Increase slowly and drink water as you do.",
    evidence: "Strong", hue: 40,
    source: { text: "Reynolds A et al. Lancet, 2019", url: "https://doi.org/10.1016/S0140-6736(18)31809-9" },
  },
  {
    id: "upf", title: "Cut back on ultra-processed food", stat: "+500", statLabel: "extra calories a day eaten on an ultra-processed diet",
    body: "In a tightly controlled NIH trial, 20 adults lived in a clinic for a month and ate either ultra-processed or unprocessed meals, matched for calories, sugar, fat, fiber and salt, and could eat as much as they wanted. On the ultra-processed diet they ate about 500 more calories a day and gained weight. On the unprocessed diet they lost weight.",
    doThis: "Cook more meals from whole ingredients. If the label lists things you wouldn't keep in your kitchen, it's probably ultra-processed.",
    evidence: "Moderate", hue: 10,
    source: { text: "Hall KD et al. Cell Metabolism, 2019", url: "https://doi.org/10.1016/j.cmet.2019.05.008" },
  },
  {
    id: "fermented", title: "Eat fermented foods daily", stat: "19", statLabel: "inflammation markers that went down",
    body: "In a 10-week Stanford trial, 36 adults ate either more fermented foods (yogurt, kefir, kimchi, kombucha, fermented vegetables) or more fiber. The fermented group's gut microbiome became more diverse and 19 inflammatory proteins dropped. It's one small trial, but a striking one.",
    doThis: "Work up to a few servings a day: yogurt or kefir at breakfast, kimchi or sauerkraut with dinner.",
    evidence: "Weak", hue: 200,
    source: { text: "Wastyk HC et al. Cell, 2021", url: "https://doi.org/10.1016/j.cell.2021.06.019" },
  },
  {
    id: "walk", title: "Walk for a few minutes after eating", stat: "2–5", statLabel: "minutes of light walking is enough to blunt the blood sugar spike",
    body: "A review of seven studies found that light walking after meals, even for two to five minutes, lowered blood sugar and insulin compared with sitting. Standing helped a little; walking helped more.",
    doThis: "After your biggest meal, take a short walk, wash the dishes, or tidy up. Anything but the couch.",
    evidence: "Moderate", hue: 140,
    source: { text: "Buffey AJ et al. Sports Medicine, 2022", url: "https://doi.org/10.1007/s40279-022-01649-4" },
  },
];

/** Harvard Healthy Eating Plate proportions, as quarters of the plate. */
export const PLATE = [
  { id: "veg", name: "Vegetables", share: 0.375, color: "#7cb342", tip: "The more variety the better. Potatoes and fries don't count.", foods: ["Leafy greens", "Broccoli", "Peppers", "Carrots", "Tomatoes", "Mushrooms", "Beets", "Cabbage"] },
  { id: "fruit", name: "Fruit", share: 0.125, color: "#e53935", tip: "Whole fruit, all colors. Limit juice to a small glass.", foods: ["Berries", "Apple", "Orange", "Banana", "Grapes", "Pear"] },
  { id: "grain", name: "Whole grains", share: 0.25, color: "#f9a825", tip: "Whole wheat, brown rice, oats, quinoa. Go easy on white bread and white rice.", foods: ["Brown rice", "Quinoa", "Oats", "Whole wheat pasta", "Barley", "Whole grain bread"] },
  { id: "protein", name: "Healthy protein", share: 0.25, color: "#8d6e63", tip: "Fish, poultry, beans, nuts. Limit red meat; avoid processed meats like bacon and cold cuts.", foods: ["Beans", "Lentils", "Fish", "Chicken", "Tofu", "Eggs", "Nuts"] },
] as const;
export type PlateGroup = (typeof PLATE)[number]["id"];

export const PLATE_SOURCE: Source = { text: "Harvard T.H. Chan School of Public Health: Healthy Eating Plate", url: "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/" };

export interface Myth {
  claim: string;
  verdict: "Myth" | "Unproven" | "Partly true";
  body: string;
  source?: Source;
}

/** Popular wellness claims, checked. */
export const MYTHS: Myth[] = [
  {
    claim: "You need a cleanse or detox tea to flush toxins",
    verdict: "Myth",
    body: "Your liver, kidneys, gut and lungs clear waste all day. A critical review found no good evidence that commercial detox diets remove toxins. Many detox teas are laxatives, which can dehydrate you. What actually supports those organs: water, fiber, sleep, and less alcohol.",
    source: { text: "Klein AV, Kiat H. J Hum Nutr Diet, 2015", url: "https://doi.org/10.1111/jhn.12286" },
  },
  {
    claim: "Alkaline water or an alkaline diet changes your body's pH",
    verdict: "Myth",
    body: "Your body holds blood pH in a tight range (about 7.35 to 7.45) no matter what you eat. A systematic review found no evidence that dietary acid load or alkaline water affects cancer. Alkaline diets are healthy only because they're mostly vegetables and fruit.",
    source: { text: "Fenton TR, Huang T. BMJ Open, 2016", url: "https://doi.org/10.1136/bmjopen-2016-010438" },
  },
  {
    claim: "Detox foot pads and ionic foot baths pull toxins out through your feet",
    verdict: "Myth",
    body: "The pads darken from moisture in your sweat, and the foot bath water changes color because its metal electrodes corrode in salt water, with or without feet in it. The US Federal Trade Commission has taken action against foot pad marketers for unsupported claims.",
  },
  {
    claim: "Magnesium bath salts top up your magnesium",
    verdict: "Unproven",
    body: "There's no good evidence that skin absorbs meaningful magnesium from a bath. A warm bath before bed can still help you fall asleep. For magnesium, eat pumpkin seeds, almonds, spinach, beans and whole grains.",
    source: { text: "Gröber U et al. Nutrients, 2017", url: "https://doi.org/10.3390/nu9080813" },
  },
  {
    claim: "Hydrogen water boosts energy and fights aging",
    verdict: "Unproven",
    body: "There are a few small, short studies with mixed results, often funded by makers. It's probably harmless but expensive. Plain water hydrates you just as well.",
  },
  {
    claim: "Intermittent fasting melts fat better than other diets",
    verdict: "Partly true",
    body: "Time-restricted eating helps some people eat less, and that's the benefit. In a 12-month trial, people who restricted calories lost about the same weight whether or not they also ate within an 8-hour window. Pick the pattern you can stick to.",
    source: { text: "Liu D et al. NEJM, 2022", url: "https://doi.org/10.1056/NEJMoa2114833" },
  },
];

export const FASTING = {
  points: [
    "Time-restricted eating (for example, eating between 9 am and 5 pm) works mostly by helping people eat less. Trials comparing it with regular calorie cutting find similar weight loss (Liu, NEJM 2022; Lowe, JAMA Internal Medicine 2020).",
    "An earlier eating window lines up better with your body clock than late-night eating, and finishing dinner 2 to 3 hours before bed helps sleep.",
    "When you break a fast, lead with fiber and protein: vegetables, beans, eggs, yogurt or nuts, not a sugary snack. Fiber slows how fast sugar reaches your blood.",
  ],
  noGo: [
    "Pregnant or breastfeeding",
    "Under 18",
    "A history of eating disorders",
    "Type 1 diabetes, or taking insulin or other blood-sugar-lowering medicine",
    "Underweight, or recovering from illness or surgery",
  ],
  sources: [
    { text: "Liu D et al. Calorie restriction with or without time-restricted eating. NEJM, 2022", url: "https://doi.org/10.1056/NEJMoa2114833" },
    { text: "Lowe DA et al. Effects of time-restricted eating on weight loss (TREAT). JAMA Intern Med, 2020", url: "https://doi.org/10.1001/jamainternmed.2020.4153" },
  ] as Source[],
};

export const WATER_FACTS = [
  { title: "How much?", body: "The US National Academies set adequate total water at about 3.7 L a day for men and 2.7 L for women. Roughly 20% comes from food, so that's about 3.0 L and 2.2 L from drinks. You need more in heat, at altitude, when exercising, and when pregnant or breastfeeding." },
  { title: "The easy check", body: "Pale straw-colored urine usually means you're well hydrated. Dark yellow means drink more. Thirst is a fine guide for most healthy adults." },
  { title: "Coffee and tea count", body: "Caffeinated drinks hydrate too; the mild diuretic effect doesn't cancel out the water. The FDA suggests most adults keep caffeine under 400 mg a day, about four cups of brewed coffee." },
  { title: "Don't overdo it", body: "Drinking several liters very fast, as in water challenges or long endurance events, can dilute blood sodium dangerously (hyponatremia). Sip through the day. If you have heart or kidney disease, follow your clinician's fluid advice." },
];

export const WATER_SOURCES: Source[] = [
  { text: "National Academies: Dietary Reference Intakes for Water, Potassium, Sodium, Chloride and Sulfate, 2004", url: "https://nap.nationalacademies.org/catalog/10925" },
  { text: "FDA: Spilling the beans: how much caffeine is too much?", url: "https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much" },
];

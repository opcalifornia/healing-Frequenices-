import type { Strength } from "../learn/brainContent";
import type { GoalId } from "../store/wellness";
import { PANTRY, type Source } from "./pantryContent";

/**
 * Simple recipes built from the Pantry.
 *
 * Rules for this file:
 * - 30 minutes or less of cooking, 10 ingredients or fewer, everyday prices, mostly plants.
 * - `pantryId` must match an item in PANTRY so the shopping list gets the right aisle.
 * - `why.evidence` rates the claim in `why.text`, using the same scale as the rest of the app.
 * - No numbers about energy content and no body-size framing. Some people using
 *   this app have a history of disordered eating; recipes are about food, not control.
 */

export type RecipeTag = "fiber" | "protein" | "omega-3" | "gut" | "quick" | "vegetarian" | "vegan";
export const RECIPE_TAGS: RecipeTag[] = ["fiber", "protein", "omega-3", "gut", "quick", "vegetarian", "vegan"];
export const TAG_LABEL: Record<RecipeTag, string> = {
  fiber: "High fiber",
  protein: "Plant protein",
  "omega-3": "Omega-3",
  gut: "Gut-friendly",
  quick: "Quick",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
};

export type Allergen = "fish" | "soy" | "nuts" | "gluten" | "dairy" | "sesame";
export const ALLERGEN_LABEL: Record<Allergen, string> = { fish: "Fish", soy: "Soy", nuts: "Tree nuts", gluten: "Gluten", dairy: "Dairy", sesame: "Sesame" };

export interface Ingredient {
  /** Pantry id when the food is in the Pantry. */
  pantryId?: string;
  name: string;
  amount: string;
  /** Store aisle for foods that aren't in the Pantry. */
  aisle?: string;
}

export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  /** Hands-on and cooking time. */
  minutes: number;
  /** Any hands-off wait, like soaking overnight. */
  wait?: string;
  serves: number;
  hue: number;
  tags: RecipeTag[];
  goals: Array<Extract<GoalId, "eat" | "energy" | "sleep">>;
  /** Rough plate split (sums to 1): vegetables and fruit, grains, protein. */
  plate: { veg: number; grain: number; protein: number };
  ingredients: Ingredient[];
  steps: string[];
  why: { text: string; evidence: Strength; sources: Source[] };
  allergens: Allergen[];
  cautions: string[];
  /** Easy swaps for allergies or what's in the cupboard. */
  swaps?: string[];
}

const PLATE: Source = { text: "Harvard T.H. Chan School of Public Health: Healthy Eating Plate", url: "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/" };
const REYNOLDS: Source = { text: "Reynolds A et al. Carbohydrate quality and human health. Lancet, 2019", url: "https://doi.org/10.1016/S0140-6736(18)31809-9" };
const PULSES: Source = { text: "Ha V et al. Effect of dietary pulse intake on LDL cholesterol: a meta-analysis. CMAJ, 2014", url: "https://doi.org/10.1503/cmaj.131727" };
const WASTYK: Source = { text: "Wastyk HC et al. Gut-microbiota-targeted diets modulate human immune status. Cell, 2021", url: "https://doi.org/10.1016/j.cell.2021.06.019" };
const RIMM: Source = { text: "Rimm EB et al. Seafood long-chain n-3 fatty acids and cardiovascular disease. AHA science advisory, Circulation, 2018", url: "https://doi.org/10.1161/CIR.0000000000000574" };
const PREDIMED: Source = { text: "Estruch R et al. Mediterranean diet with olive oil or nuts (PREDIMED). NEJM, 2018", url: "https://doi.org/10.1056/NEJMoa1800389" };
const OAT_CLAIM: Source = { text: "FDA health claim: soluble fiber from oats and barley and coronary heart disease (21 CFR 101.81)", url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81" };
const AUNE: Source = { text: "Aune D et al. Fruit and vegetable intake and risk of cardiovascular disease, cancer and mortality: a meta-analysis. Int J Epidemiol, 2017", url: "https://doi.org/10.1093/ije/dyw319" };
const FISH: Source = { text: "FDA/EPA: Advice about eating fish", url: "https://www.fda.gov/food/consumers/advice-about-eating-fish" };

const VIT_K = "Leafy greens are high in vitamin K. If you take warfarin, keep how much you eat steady from week to week and tell your clinician.";
const SODIUM = "Canned beans, broth and sauces can be salty. Rinse beans and choose low-sodium versions if you're watching salt.";
const FIBER_SLOW = "New to beans or lots of fiber? Start with smaller portions and drink water; your gut adjusts in a few weeks.";

export const RECIPES: Recipe[] = [
  {
    id: "overnight-oats",
    title: "Overnight oats with berries & chia",
    blurb: "Stir it together at night, grab it in the morning.",
    minutes: 5, wait: "plus overnight in the fridge", serves: 1, hue: 235,
    tags: ["fiber", "quick", "vegetarian", "gut"], goals: ["eat", "energy"],
    plate: { veg: 0.35, grain: 0.4, protein: 0.25 },
    ingredients: [
      { pantryId: "oats", name: "Rolled oats", amount: "½ cup" },
      { pantryId: "chia", name: "Chia seeds", amount: "1 tbsp" },
      { pantryId: "yogurt", name: "Plain yogurt", amount: "¼ cup" },
      { name: "Milk or unsweetened soy milk", amount: "½ cup", aisle: "Fridge & ferments" },
      { pantryId: "blueberries", name: "Blueberries (fresh or frozen)", amount: "½ cup" },
      { pantryId: "cinnamon", name: "Cinnamon", amount: "a pinch" },
    ],
    steps: [
      "In a jar, stir together the oats, chia, yogurt, milk and cinnamon.",
      "Top with the berries, close the lid and refrigerate overnight (or at least 4 hours).",
      "Stir and eat cold, or warm it for a minute.",
    ],
    why: {
      text: "Oats carry beta-glucan, the soluble fiber behind an FDA-authorized heart-health claim, and chia and berries add more fiber. Eating more fiber and whole grains is linked to lower risk of heart disease and type 2 diabetes in large reviews. Yogurt with live cultures is a fermented food.",
      evidence: "Strong",
      sources: [OAT_CLAIM, REYNOLDS],
    },
    allergens: ["dairy"],
    cautions: ["Oats are naturally gluten-free but often cross-contaminated. If you have celiac disease, buy oats labelled gluten-free.", "Chia swells a lot in liquid; give it time to soak and drink water with it."],
    swaps: ["Vegan: use soy yogurt and soy milk.", "No chia? Use ground flaxseed."],
  },
  {
    id: "lentil-soup",
    title: "Weeknight lentil soup",
    blurb: "One pot, pantry staples, even better the next day.",
    minutes: 30, serves: 4, hue: 20,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.5, grain: 0.1, protein: 0.4 },
    ingredients: [
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { pantryId: "onions", name: "Onion", amount: "1, chopped" },
      { pantryId: "carrots", name: "Carrots", amount: "2, chopped" },
      { pantryId: "garlic", name: "Garlic", amount: "3 cloves" },
      { name: "Ground cumin", amount: "1 tsp", aisle: "Herbs & spices" },
      { pantryId: "lentils", name: "Brown or green lentils, rinsed", amount: "1 cup" },
      { name: "Canned diced tomatoes", amount: "1 can (14 oz)", aisle: "Grains & beans" },
      { name: "Low-sodium vegetable broth", amount: "4 cups", aisle: "Other" },
      { pantryId: "spinach", name: "Spinach", amount: "2 big handfuls" },
      { pantryId: "lemons", name: "Lemon", amount: "½" },
    ],
    steps: [
      "Warm the oil in a pot. Cook the onion and carrot for 5 minutes until soft.",
      "Add garlic and cumin; stir for 30 seconds.",
      "Add lentils, tomatoes and broth. Simmer, partly covered, for 20 to 25 minutes until the lentils are tender.",
      "Stir in the spinach until it wilts. Finish with a squeeze of lemon and salt to taste.",
    ],
    why: {
      text: "About one serving of beans, peas or lentils a day lowered LDL cholesterol in a meta-analysis of trials, and lentils bring protein and fiber together. Half the pot is vegetables, which matches the plate model.",
      evidence: "Strong",
      sources: [PULSES, PLATE],
    },
    allergens: [],
    cautions: [VIT_K, SODIUM, FIBER_SLOW],
  },
  {
    id: "black-bean-tacos",
    title: "Black bean tacos with avocado",
    blurb: "Fifteen minutes, crunchy slaw, no oven.",
    minutes: 15, serves: 2, hue: 270,
    tags: ["fiber", "protein", "quick", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.45, grain: 0.25, protein: 0.3 },
    ingredients: [
      { pantryId: "black-beans", name: "Black beans, rinsed", amount: "1 can (15 oz)" },
      { name: "Ground cumin", amount: "1 tsp", aisle: "Herbs & spices" },
      { pantryId: "garlic", name: "Garlic", amount: "1 clove" },
      { name: "Corn tortillas", amount: "6 small", aisle: "Grains & beans" },
      { pantryId: "avocado", name: "Avocado", amount: "1" },
      { name: "Shredded cabbage", amount: "2 cups", aisle: "Produce" },
      { name: "Lime", amount: "1", aisle: "Produce" },
      { name: "Salsa", amount: "½ cup", aisle: "Specialty & international" },
      { pantryId: "pumpkin-seeds", name: "Pumpkin seeds", amount: "2 tbsp" },
    ],
    steps: [
      "Warm the beans in a pan with the cumin, grated garlic and a splash of water. Mash about half.",
      "Toss the cabbage with lime juice and a pinch of salt.",
      "Warm the tortillas in a dry pan or over a gas flame.",
      "Fill with beans, cabbage, sliced avocado, salsa and pumpkin seeds.",
    ],
    why: {
      text: "Black beans have about 15 grams of fiber per cooked cup, and pulses lower LDL cholesterol in trials. Avocado adds mostly unsaturated fat, the kind linked to better heart health.",
      evidence: "Strong",
      sources: [PULSES, REYNOLDS],
    },
    allergens: [],
    cautions: [SODIUM, FIBER_SLOW],
    swaps: ["Corn tortillas are usually gluten-free; check the label if that matters to you."],
  },
  {
    id: "sheet-pan-salmon",
    title: "Sheet-pan salmon (or tofu) with greens",
    blurb: "Everything on one tray, about 25 minutes.",
    minutes: 25, serves: 2, hue: 12,
    tags: ["omega-3"], goals: ["eat", "energy", "sleep"],
    plate: { veg: 0.5, grain: 0.2, protein: 0.3 },
    ingredients: [
      { pantryId: "salmon", name: "Salmon fillets (or firm tofu)", amount: "2 fillets / 14 oz block" },
      { pantryId: "broccoli", name: "Broccoli florets", amount: "1 head" },
      { pantryId: "sweet-potato", name: "Sweet potato, cut in ½-inch cubes", amount: "1 medium" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { pantryId: "garlic", name: "Garlic", amount: "2 cloves" },
      { pantryId: "lemons", name: "Lemon", amount: "1" },
      { pantryId: "leafy-greens", name: "Kale, stems removed", amount: "2 handfuls" },
    ],
    steps: [
      "Heat the oven to 425°F (220°C). Toss sweet potato with half the oil and salt; roast 10 minutes.",
      "Push it aside. Add broccoli, kale and the salmon (or pressed, cubed tofu). Drizzle with the rest of the oil, garlic and lemon zest.",
      "Roast 12 to 15 minutes, until the salmon flakes easily (145°F inside) or the tofu is golden.",
      "Squeeze lemon over everything.",
    ],
    why: {
      text: "Fatty fish like salmon is the richest food source of the omega-3s EPA and DHA. The American Heart Association recommends one to two seafood meals a week, based on lower cardiovascular risk in studies, and salmon is on the FDA's low-mercury 'best choices' list.",
      evidence: "Moderate",
      sources: [RIMM, FISH],
    },
    allergens: ["fish"],
    cautions: ["Contains fish. The tofu version contains soy instead.", VIT_K],
    swaps: ["Vegan: firm tofu works the same way. Add ground flaxseed or walnuts on the side for plant omega-3 (ALA)."],
  },
  {
    id: "ginger-turmeric-dal",
    title: "Ginger-turmeric red lentil dal",
    blurb: "Red lentils melt into a cozy, golden stew.",
    minutes: 30, serves: 4, hue: 45,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "sleep"],
    plate: { veg: 0.3, grain: 0.3, protein: 0.4 },
    ingredients: [
      { pantryId: "lentils", name: "Red lentils, rinsed", amount: "1 cup" },
      { pantryId: "evoo", name: "Olive oil", amount: "1 tbsp" },
      { pantryId: "onions", name: "Onion", amount: "1, chopped" },
      { pantryId: "ginger", name: "Fresh ginger, grated", amount: "1 thumb" },
      { pantryId: "garlic", name: "Garlic", amount: "3 cloves" },
      { pantryId: "turmeric", name: "Ground turmeric", amount: "1 tsp" },
      { name: "Black pepper", amount: "a few grinds", aisle: "Herbs & spices" },
      { name: "Canned diced tomatoes", amount: "1 can (14 oz)", aisle: "Grains & beans" },
      { pantryId: "spinach", name: "Spinach", amount: "2 handfuls" },
      { name: "Brown rice, to serve", amount: "2 cups cooked", aisle: "Grains & beans" },
    ],
    steps: [
      "Cook the onion in oil for 5 minutes. Add ginger, garlic, turmeric and pepper; stir 1 minute.",
      "Add lentils, tomatoes and 3 cups water. Simmer 18 to 20 minutes, stirring now and then, until thick and soft.",
      "Stir in the spinach and salt to taste.",
      "Serve over brown rice (cooked ahead, or quick-cook rice).",
    ],
    why: {
      text: "The proven benefit here is from the lentils: pulses lower LDL cholesterol in trials. Ginger and turmeric add flavor; research on curcumin for inflammation is mixed and mostly uses supplements, so treat the spices as taste, not treatment. Black pepper and oil help the body absorb curcumin.",
      evidence: "Strong",
      sources: [PULSES],
    },
    allergens: [],
    cautions: [
      "Turmeric and ginger here are normal cooking amounts. The Pantry's cautions about blood thinners and liver effects are about turmeric supplements, not food.",
      VIT_K,
      FIBER_SLOW,
    ],
  },
  {
    id: "kinpira-gobo",
    title: "Burdock & carrot kinpira",
    blurb: "A classic Japanese side: sweet, salty and crunchy.",
    minutes: 20, serves: 3, hue: 28,
    tags: ["fiber", "gut", "vegetarian"], goals: ["eat"],
    plate: { veg: 0.9, grain: 0, protein: 0.1 },
    ingredients: [
      { pantryId: "burdock-root", name: "Burdock root (gobo)", amount: "1 long root" },
      { pantryId: "carrots", name: "Carrot", amount: "1" },
      { name: "Toasted sesame oil", amount: "1 tbsp", aisle: "Oils & vinegar" },
      { name: "Soy sauce or tamari", amount: "1½ tbsp", aisle: "Specialty & international" },
      { name: "Mirin", amount: "1 tbsp", aisle: "Specialty & international" },
      { pantryId: "raw-honey", name: "Honey", amount: "1 tsp" },
      { name: "Sesame seeds", amount: "1 tsp", aisle: "Nuts & seeds" },
      { name: "Chili flakes (optional)", amount: "a pinch", aisle: "Herbs & spices" },
    ],
    steps: [
      "Scrub the burdock (no need to peel). Cut it and the carrot into matchsticks. Soak the burdock in water for 5 minutes, then drain.",
      "Stir-fry both in sesame oil over medium-high heat for 5 minutes.",
      "Add soy sauce, mirin and honey. Cook 3 to 4 minutes until glossy and the liquid is gone.",
      "Sprinkle with sesame seeds and chili. Serve warm or cold with rice.",
    ],
    why: {
      text: "Burdock is rich in inulin, a prebiotic fiber that feeds gut bacteria. Studies of burdock itself in people are few; the reliable benefit is the fiber, the same as other vegetables. Claims that it 'purifies the blood' aren't supported; your liver and kidneys do that job.",
      evidence: "Weak",
      sources: [REYNOLDS],
    },
    allergens: ["soy", "gluten", "sesame"],
    cautions: [
      "Buy burdock at a store, don't forage it: wild burdock can be confused with toxic plants.",
      "Burdock may lower blood sugar. If you take diabetes medicine, watch your levels.",
      "Soy sauce contains wheat; use tamari labelled gluten-free if needed.",
      "Inulin can cause gas at first. Start with a small serving.",
    ],
    swaps: ["Vegan: use maple syrup instead of honey."],
  },
  {
    id: "greek-chickpea-salad",
    title: "Greek salad with chickpeas",
    blurb: "No cooking. A big bowl in about 15 minutes.",
    minutes: 15, serves: 2, hue: 35,
    tags: ["fiber", "protein", "quick", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.6, grain: 0.05, protein: 0.35 },
    ingredients: [
      { pantryId: "chickpeas", name: "Chickpeas, rinsed", amount: "1 can (15 oz)" },
      { name: "Cucumber", amount: "1", aisle: "Produce" },
      { name: "Tomatoes", amount: "2", aisle: "Produce" },
      { name: "Red onion", amount: "¼", aisle: "Produce" },
      { name: "Kalamata olives", amount: "¼ cup", aisle: "Specialty & international" },
      { name: "Feta", amount: "2 oz", aisle: "Fridge & ferments" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { pantryId: "acv", name: "Vinegar (cider or red wine)", amount: "1 tbsp" },
      { name: "Dried oregano", amount: "½ tsp", aisle: "Herbs & spices" },
    ],
    steps: [
      "Chop the cucumber and tomatoes; slice the onion thin.",
      "Whisk oil, vinegar, oregano and a pinch of salt in a big bowl.",
      "Add chickpeas, vegetables and olives; toss. Crumble feta on top.",
    ],
    why: {
      text: "This is a Mediterranean-style meal: vegetables, legumes and extra virgin olive oil. In the PREDIMED trial, a Mediterranean diet with extra olive oil lowered major cardiovascular events compared with a lower-fat diet.",
      evidence: "Strong",
      sources: [PREDIMED, PULSES],
    },
    allergens: ["dairy"],
    cautions: [SODIUM, "Olives and feta are salty, so you may not need extra salt."],
    swaps: ["Vegan: skip the feta or use a handful of walnuts."],
  },
  {
    id: "miso-greens-soup",
    title: "Miso soup with greens & shiitake",
    blurb: "Ten minutes to a warm, savory bowl.",
    minutes: 10, serves: 2, hue: 35,
    tags: ["gut", "quick", "vegan", "vegetarian", "protein"], goals: ["eat", "sleep"],
    plate: { veg: 0.55, grain: 0, protein: 0.45 },
    ingredients: [
      { pantryId: "shiitake", name: "Shiitake mushrooms, sliced", amount: "4 to 6" },
      { name: "Firm or silken tofu, cubed", amount: "½ block", aisle: "Fridge & ferments" },
      { pantryId: "spinach", name: "Spinach or bok choy", amount: "2 handfuls" },
      { pantryId: "miso", name: "Miso paste", amount: "2 tbsp" },
      { name: "Scallions", amount: "2", aisle: "Produce" },
      { name: "Dried wakame seaweed (optional)", amount: "1 tsp", aisle: "Specialty & international" },
    ],
    steps: [
      "Simmer 3 cups water with the shiitake (and wakame, if using) for 5 minutes.",
      "Add tofu and greens; heat 2 minutes.",
      "Turn off the heat. Stir the miso into a ladle of the broth until smooth, then stir it back in. Don't boil it.",
      "Top with sliced scallions.",
    ],
    why: {
      text: "Miso is a fermented food. In a 10-week Stanford trial, eating more fermented foods increased gut microbiome diversity and lowered some inflammation markers. Cooking reduces live microbes, so stirring miso in off the heat keeps more of them; the evidence for miso specifically is limited.",
      evidence: "Weak",
      sources: [WASTYK],
    },
    allergens: ["soy"],
    cautions: ["Miso is very high in sodium. If you're watching salt, use less and add more mushrooms for flavor.", VIT_K],
  },
  {
    id: "veggie-stir-fry",
    title: "Veggie stir-fry with brown rice",
    blurb: "Use whatever vegetables are in the fridge.",
    minutes: 25, serves: 2, hue: 115,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.5, grain: 0.25, protein: 0.25 },
    ingredients: [
      { name: "Brown rice (quick-cook or leftover)", amount: "2 cups cooked", aisle: "Grains & beans" },
      { name: "Firm tofu or shelled edamame", amount: "1 block / 1½ cups", aisle: "Fridge & ferments" },
      { pantryId: "broccoli", name: "Broccoli", amount: "1 head" },
      { name: "Bell pepper", amount: "1", aisle: "Produce" },
      { pantryId: "shiitake", name: "Shiitake mushrooms", amount: "1 cup sliced" },
      { pantryId: "ginger", name: "Fresh ginger", amount: "1 tbsp grated" },
      { pantryId: "garlic", name: "Garlic", amount: "2 cloves" },
      { name: "Soy sauce or tamari", amount: "2 tbsp", aisle: "Specialty & international" },
      { name: "Neutral or olive oil", amount: "1 tbsp", aisle: "Oils & vinegar" },
    ],
    steps: [
      "Press the tofu with a towel and cube it. Brown it in hot oil for 6 to 8 minutes; set aside.",
      "Stir-fry broccoli, pepper and mushrooms over high heat for 4 to 5 minutes, adding a splash of water if they stick.",
      "Add ginger and garlic for 30 seconds, then the tofu and soy sauce. Toss.",
      "Serve over warm brown rice.",
    ],
    why: {
      text: "Swapping refined grains for whole grains like brown rice is linked to lower risk of heart disease and type 2 diabetes in a large Lancet review. Tofu or edamame adds plant protein, and the plate is about half vegetables.",
      evidence: "Strong",
      sources: [REYNOLDS, PLATE],
    },
    allergens: ["soy", "gluten"],
    cautions: ["Soy sauce contains wheat; use tamari labelled gluten-free if needed.", SODIUM],
  },
  {
    id: "yogurt-parfait",
    title: "Yogurt parfait with walnuts",
    blurb: "Layer it in a glass in five minutes.",
    minutes: 5, serves: 1, hue: 210,
    tags: ["gut", "quick", "vegetarian", "omega-3"], goals: ["eat", "energy"],
    plate: { veg: 0.35, grain: 0.2, protein: 0.45 },
    ingredients: [
      { pantryId: "yogurt", name: "Plain yogurt", amount: "¾ cup" },
      { pantryId: "blueberries", name: "Berries", amount: "½ cup" },
      { pantryId: "walnuts", name: "Walnuts, chopped", amount: "2 tbsp" },
      { pantryId: "flaxseed", name: "Ground flaxseed", amount: "1 tbsp" },
      { pantryId: "oats", name: "Rolled oats (or low-sugar granola)", amount: "2 tbsp" },
      { pantryId: "raw-honey", name: "Honey (optional)", amount: "1 tsp" },
    ],
    steps: [
      "Spoon half the yogurt into a glass. Add half the berries, oats and walnuts.",
      "Repeat the layers. Sprinkle flaxseed on top and drizzle with honey if you like.",
    ],
    why: {
      text: "Yogurt with live cultures is a fermented food, and walnuts and flaxseed are among the richest plant sources of omega-3 ALA. In the PREDIMED trial, a Mediterranean diet with daily nuts lowered cardiovascular events.",
      evidence: "Moderate",
      sources: [WASTYK, PREDIMED],
    },
    allergens: ["dairy", "nuts"],
    cautions: ["Contains tree nuts (walnuts).", "Never give honey to babies under 12 months; it can cause infant botulism.", "Choose plain yogurt; flavored ones can be very sugary."],
    swaps: ["Nut-free: use pumpkin seeds instead of walnuts.", "Vegan: use soy yogurt and maple syrup."],
  },
  {
    id: "minestrone",
    title: "Quick minestrone",
    blurb: "Beans, greens and a little pasta in one pot.",
    minutes: 30, serves: 4, hue: 70,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.5, grain: 0.25, protein: 0.25 },
    ingredients: [
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { pantryId: "onions", name: "Onion", amount: "1, chopped" },
      { name: "Carrots and celery", amount: "2 each, chopped", aisle: "Produce" },
      { pantryId: "garlic", name: "Garlic", amount: "3 cloves" },
      { name: "Canned diced tomatoes", amount: "1 can (14 oz)", aisle: "Grains & beans" },
      { name: "Low-sodium vegetable broth", amount: "5 cups", aisle: "Other" },
      { name: "White beans, rinsed", amount: "1 can (15 oz)", aisle: "Grains & beans" },
      { name: "Small whole wheat pasta", amount: "¾ cup", aisle: "Grains & beans" },
      { pantryId: "leafy-greens", name: "Kale, chopped", amount: "3 handfuls" },
      { name: "Dried Italian herbs", amount: "1 tsp", aisle: "Herbs & spices" },
    ],
    steps: [
      "Cook onion, carrot and celery in oil for 6 minutes. Add garlic and herbs for 30 seconds.",
      "Add tomatoes and broth; bring to a boil.",
      "Add pasta and beans and simmer 10 minutes, until the pasta is tender.",
      "Stir in kale for the last 3 minutes. Season with salt and pepper.",
    ],
    why: {
      text: "Eating more vegetables and fruit is linked to lower risk of heart disease and early death in a large meta-analysis, with benefits up to about 800 g a day. Beans and whole wheat pasta add fiber and protein.",
      evidence: "Moderate",
      sources: [AUNE, PULSES],
    },
    allergens: ["gluten"],
    cautions: [VIT_K, SODIUM],
    swaps: ["Gluten-free: use rice, quinoa or gluten-free pasta."],
  },
  {
    id: "sweet-potato-kale-bowl",
    title: "Roasted sweet potato & kale bowl",
    blurb: "Crispy chickpeas, quinoa and a lemony tahini drizzle.",
    minutes: 30, serves: 2, hue: 22,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "energy", "sleep"],
    plate: { veg: 0.5, grain: 0.25, protein: 0.25 },
    ingredients: [
      { pantryId: "sweet-potato", name: "Sweet potato, cubed small", amount: "1 large" },
      { pantryId: "chickpeas", name: "Chickpeas, rinsed and dried", amount: "1 can (15 oz)" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { name: "Smoked paprika", amount: "1 tsp", aisle: "Herbs & spices" },
      { pantryId: "quinoa", name: "Quinoa, rinsed", amount: "½ cup" },
      { pantryId: "leafy-greens", name: "Kale, stems removed", amount: "3 handfuls" },
      { name: "Tahini", amount: "2 tbsp", aisle: "Specialty & international" },
      { pantryId: "lemons", name: "Lemon", amount: "1" },
      { pantryId: "pumpkin-seeds", name: "Pumpkin seeds", amount: "2 tbsp" },
    ],
    steps: [
      "Heat the oven to 425°F (220°C). Toss sweet potato and chickpeas with oil, paprika and salt; roast 25 minutes, stirring once.",
      "Meanwhile, simmer quinoa in 1 cup water for 15 minutes, covered.",
      "Massage the kale with a squeeze of lemon and a pinch of salt until it softens.",
      "Whisk tahini with lemon juice and water until drizzly. Build bowls and top with pumpkin seeds.",
    ],
    why: {
      text: "Built on the plate model: half vegetables, a quarter whole grains, a quarter protein, with olive oil. Chickpeas are a pulse, which lower LDL cholesterol in trials, and sweet potatoes are rich in beta-carotene and fiber.",
      evidence: "Strong",
      sources: [PLATE, PULSES],
    },
    allergens: ["sesame"],
    cautions: ["Tahini is made from sesame.", VIT_K, FIBER_SLOW],
  },
  {
    id: "spinach-omelet",
    title: "Spinach and mushroom omelet",
    blurb: "Eggs and vegetables in about ten minutes.",
    minutes: 10, serves: 1, hue: 48,
    tags: ["quick", "vegetarian", "protein"], goals: ["eat", "energy"],
    plate: { veg: 0.5, grain: 0, protein: 0.5 },
    ingredients: [
      { pantryId: "eggs", name: "Eggs", amount: "2" },
      { pantryId: "spinach", name: "Spinach", amount: "2 handfuls" },
      { pantryId: "shiitake", name: "Mushrooms, sliced", amount: "½ cup" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "1 tsp" },
      { pantryId: "garlic", name: "Garlic, minced", amount: "1 clove" },
    ],
    steps: [
      "Warm the oil in a non-stick pan. Cook the mushrooms and garlic 3 minutes, add the spinach and stir until it wilts, then tip it onto a plate.",
      "Beat the eggs with a pinch of salt and pour them into the pan. Cook on medium heat until just set underneath.",
      "Add the vegetables to one half, fold the omelet over and slide it onto a plate.",
    ],
    why: {
      text: "Eating more vegetables is linked to lower risk of heart disease, cancer and early death in a large meta-analysis of cohort studies. Those are observational studies, so they show a link and not proof. Adding greens to a protein-rich breakfast is a simple way to get them in.",
      evidence: "Moderate",
      sources: [AUNE, PLATE],
    },
    allergens: [],
    cautions: ["Contains egg. Cook eggs until the white and yolk are set if you are pregnant or serving someone who is vulnerable to foodborne illness.", VIT_K],
    swaps: ["Vegan: scramble crumbled firm tofu with turmeric instead of eggs."],
  },
  {
    id: "walnut-oatmeal",
    title: "Warm oatmeal with walnuts and cinnamon",
    blurb: "A bowl of oats with crunch, ready in five minutes.",
    minutes: 5, serves: 1, hue: 30,
    tags: ["fiber", "quick", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.2, grain: 0.55, protein: 0.25 },
    ingredients: [
      { pantryId: "oats", name: "Rolled oats", amount: "½ cup" },
      { name: "Milk or unsweetened soy milk (or water)", amount: "1 cup", aisle: "Fridge & ferments" },
      { pantryId: "walnuts", name: "Walnuts, chopped", amount: "2 tbsp" },
      { pantryId: "cinnamon", name: "Cinnamon", amount: "½ tsp" },
      { pantryId: "blueberries", name: "Blueberries (fresh or frozen)", amount: "¼ cup" },
    ],
    steps: [
      "Simmer the oats in the milk for 3 to 4 minutes, stirring, until thick.",
      "Top with walnuts, blueberries and cinnamon.",
    ],
    why: {
      text: "Oats carry beta-glucan, a soluble fiber behind an FDA-authorized heart-health claim. Nuts, including walnuts, were part of the Mediterranean-style diet that lowered heart disease in the PREDIMED trial.",
      evidence: "Strong",
      sources: [OAT_CLAIM, PREDIMED],
    },
    allergens: ["nuts"],
    cautions: ["Contains tree nuts. Oats are naturally gluten-free but often cross-contaminated, so buy oats labelled gluten-free if you have celiac disease."],
    swaps: ["Vegan: use soy or oat milk.", "Nut allergy: use pumpkin seeds."],
  },
  {
    id: "chickpea-avocado-toast",
    title: "Smashed chickpea and avocado toast",
    blurb: "Fiber and protein on toast, no cooking.",
    minutes: 8, serves: 1, hue: 100,
    tags: ["fiber", "protein", "quick", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.3, grain: 0.35, protein: 0.35 },
    ingredients: [
      { pantryId: "whole-grain-bread", name: "Whole-grain bread", amount: "2 slices" },
      { pantryId: "chickpeas", name: "Chickpeas, rinsed (canned is fine)", amount: "½ cup" },
      { pantryId: "avocado", name: "Avocado", amount: "½" },
      { pantryId: "spinach", name: "Spinach", amount: "1 handful" },
      { pantryId: "lemons", name: "Lemon", amount: "½" },
    ],
    steps: [
      "Toast the bread.",
      "Mash the chickpeas and avocado together with a squeeze of lemon and a pinch of salt.",
      "Pile onto the toast and top with spinach.",
    ],
    why: {
      text: "Beans and chickpeas lowered LDL (\"bad\") cholesterol in a meta-analysis of controlled trials, and whole grains and fiber are linked to lower risk of heart disease and type 2 diabetes in large reviews.",
      evidence: "Moderate",
      sources: [PULSES, REYNOLDS],
    },
    allergens: ["gluten"],
    cautions: [SODIUM, FIBER_SLOW, VIT_K],
    swaps: ["Gluten-free: use gluten-free bread or serve on rice cakes."],
  },
  {
    id: "kefir-berry-smoothie",
    title: "Kefir berry smoothie",
    blurb: "Blend and drink, two minutes.",
    minutes: 3, serves: 1, hue: 280,
    tags: ["gut", "quick", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.45, grain: 0.1, protein: 0.45 },
    ingredients: [
      { pantryId: "kefir", name: "Plain kefir", amount: "1 cup" },
      { pantryId: "blueberries", name: "Blueberries (fresh or frozen)", amount: "½ cup" },
      { pantryId: "spinach", name: "Spinach", amount: "1 handful" },
      { pantryId: "chia", name: "Chia seeds", amount: "1 tsp" },
    ],
    steps: ["Blend everything until smooth, adding a splash of water if it is too thick.", "Drink right away."],
    why: {
      text: "In a 10-week trial of 36 healthy adults, eating more fermented foods increased the variety of gut bacteria and lowered several markers of inflammation. It is a small study, so treat it as an early signal.",
      evidence: "Weak",
      sources: [WASTYK],
    },
    allergens: ["dairy"],
    cautions: ["Contains dairy. If you have a weakened immune system, ask your clinician before adding fermented foods.", VIT_K],
    swaps: ["Dairy-free: use a plain dairy-free kefir or yogurt drink."],
  },
  {
    id: "sardine-toast",
    title: "Sardines on toast with greens",
    blurb: "Omega-3s from a tin, five minutes.",
    minutes: 5, serves: 1, hue: 200,
    tags: ["omega-3", "quick", "protein"], goals: ["eat", "energy", "sleep"],
    plate: { veg: 0.25, grain: 0.35, protein: 0.4 },
    ingredients: [
      { pantryId: "whole-grain-bread", name: "Whole-grain bread", amount: "2 slices" },
      { pantryId: "sardines", name: "Sardines in olive oil, drained", amount: "1 tin" },
      { pantryId: "leafy-greens", name: "Arugula or other greens", amount: "1 handful" },
      { pantryId: "lemons", name: "Lemon", amount: "½" },
    ],
    steps: ["Toast the bread.", "Top with greens and the sardines, mashing them lightly.", "Squeeze lemon over the top and add black pepper."],
    why: {
      text: "Fatty fish such as sardines are rich in the omega-3s EPA and DHA. The American Heart Association recommends one to two seafood meals a week, and sardines are among the fish the FDA lists as lower in mercury.",
      evidence: "Moderate",
      sources: [RIMM, FISH],
    },
    allergens: ["fish", "gluten"],
    cautions: ["Contains fish. Tinned fish can be salty; choose lower-sodium tins if you are watching salt.", VIT_K],
    swaps: ["Gluten-free: serve on gluten-free bread or on cucumber slices."],
  },
  {
    id: "barley-mushroom-soup",
    title: "Barley and mushroom soup",
    blurb: "A filling, brothy soup from the cupboard.",
    minutes: 30, serves: 3, hue: 24,
    tags: ["fiber", "vegan", "vegetarian"], goals: ["eat", "sleep"],
    plate: { veg: 0.4, grain: 0.45, protein: 0.15 },
    ingredients: [
      { pantryId: "barley", name: "Pearl barley, rinsed", amount: "¾ cup" },
      { pantryId: "shiitake", name: "Mushrooms, sliced", amount: "2 cups" },
      { pantryId: "carrots", name: "Carrots, diced", amount: "2" },
      { pantryId: "onions", name: "Onion, diced", amount: "1" },
      { pantryId: "garlic", name: "Garlic, minced", amount: "2 cloves" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "1 tbsp" },
      { name: "Vegetable broth (low-sodium)", amount: "5 cups", aisle: "Other" },
    ],
    steps: [
      "Warm the oil in a pot. Cook the onion, carrots and mushrooms 5 minutes, add the garlic for a minute.",
      "Add the barley and broth. Bring to a boil, then simmer about 20 minutes until the barley is tender.",
      "Season with pepper and eat hot.",
    ],
    why: {
      text: "Barley, like oats, carries beta-glucan, a soluble fiber covered by an FDA-authorized heart-health claim. Whole grains and fiber are linked to lower risk of heart disease and type 2 diabetes in large reviews.",
      evidence: "Strong",
      sources: [OAT_CLAIM, REYNOLDS],
    },
    allergens: ["gluten"],
    cautions: ["Barley contains gluten. Avoid it if you have celiac disease or gluten sensitivity.", SODIUM, FIBER_SLOW],
    swaps: ["Gluten-free: use brown rice or quinoa, and adjust the simmer time."],
  },
  {
    id: "beet-quinoa-salad",
    title: "Beet, quinoa and chickpea salad",
    blurb: "A colourful bowl with a lemon-olive oil dressing.",
    minutes: 15, serves: 2, hue: 330,
    tags: ["fiber", "protein", "vegan", "vegetarian"], goals: ["eat", "energy"],
    plate: { veg: 0.4, grain: 0.3, protein: 0.3 },
    ingredients: [
      { pantryId: "quinoa", name: "Quinoa, rinsed", amount: "¾ cup dry" },
      { pantryId: "chickpeas", name: "Chickpeas, rinsed (canned is fine)", amount: "1 cup" },
      { pantryId: "beets", name: "Cooked beets (vacuum-packed), diced", amount: "2" },
      { pantryId: "walnuts", name: "Walnuts, chopped", amount: "¼ cup" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "2 tbsp" },
      { pantryId: "lemons", name: "Lemon", amount: "1" },
      { pantryId: "leafy-greens", name: "Arugula or other greens", amount: "2 handfuls" },
    ],
    steps: [
      "Cook the quinoa in 1½ cups water for about 12 minutes, then let it cool a few minutes.",
      "Whisk the olive oil with the juice of the lemon and a pinch of salt.",
      "Toss quinoa, chickpeas, beets, walnuts and greens with the dressing.",
    ],
    why: {
      text: "Chickpeas and other pulses lowered LDL cholesterol in a meta-analysis of controlled trials, and nuts with olive oil were part of the Mediterranean-style diet that lowered heart disease in the PREDIMED trial.",
      evidence: "Strong",
      sources: [PULSES, PREDIMED],
    },
    allergens: ["nuts"],
    cautions: [SODIUM, FIBER_SLOW, VIT_K, "Beets can turn urine or stools pink or red. It is harmless."],
    swaps: ["Nut allergy: use pumpkin seeds instead of walnuts."],
  },
  {
    id: "miso-salmon-broccoli",
    title: "Miso salmon with broccoli",
    blurb: "A glaze of miso and lemon, one tray.",
    minutes: 20, serves: 2, hue: 15,
    tags: ["omega-3", "protein"], goals: ["eat", "energy", "sleep"],
    plate: { veg: 0.45, grain: 0.2, protein: 0.35 },
    ingredients: [
      { pantryId: "salmon", name: "Salmon fillets", amount: "2" },
      { pantryId: "miso", name: "Miso paste", amount: "1 tbsp" },
      { pantryId: "broccoli", name: "Broccoli florets", amount: "1 head" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "1 tbsp" },
      { pantryId: "ginger", name: "Fresh ginger, grated", amount: "1 tsp" },
      { pantryId: "brown-rice", name: "Brown rice, cooked", amount: "1 cup" },
    ],
    steps: [
      "Heat the oven to 425°F (220°C). Stir the miso with the ginger and a splash of water.",
      "Put the broccoli on a tray with the oil. Add the salmon and spread the miso on top.",
      "Roast 12 to 15 minutes until the salmon flakes easily. Serve over rice.",
    ],
    why: {
      text: "Fatty fish like salmon is the richest food source of the omega-3s EPA and DHA. The American Heart Association recommends one to two seafood meals a week, based on lower cardiovascular risk in studies.",
      evidence: "Moderate",
      sources: [RIMM, FISH],
    },
    allergens: ["fish", "soy"],
    cautions: ["Contains fish and soy. Miso is salty; use less if you are watching salt.", VIT_K],
    swaps: ["Vegan: use thick slices of firm tofu in place of the salmon."],
  },
  {
    id: "kimchi-rice-bowl",
    title: "Kimchi brown-rice bowl with egg",
    blurb: "Leftover rice, a ferment and a fried egg, ready in fifteen minutes.",
    minutes: 15, serves: 1, hue: 8,
    tags: ["gut", "quick", "vegetarian"], goals: ["eat"],
    plate: { veg: 0.35, grain: 0.4, protein: 0.25 },
    ingredients: [
      { pantryId: "brown-rice", name: "Brown rice, cooked", amount: "1 cup" },
      { pantryId: "kimchi", name: "Kimchi, chopped", amount: "½ cup" },
      { pantryId: "spinach", name: "Spinach", amount: "2 handfuls" },
      { pantryId: "eggs", name: "Egg", amount: "1" },
      { pantryId: "evoo", name: "Extra virgin olive oil", amount: "1 tsp" },
    ],
    steps: [
      "Warm the oil in a pan. Stir-fry the rice and kimchi 3 minutes, add the spinach until it wilts, and tip into a bowl.",
      "Fry the egg in the same pan and put it on top.",
    ],
    why: {
      text: "Fermented foods like kimchi increased the variety of gut bacteria in a small 10-week trial in 36 healthy adults. It is early evidence, and heating kimchi may reduce its live cultures, so add some fresh on top if you like.",
      evidence: "Weak",
      sources: [WASTYK],
    },
    allergens: ["fish"],
    cautions: ["Many kimchi recipes use fish sauce or shrimp. Check the label if you have a fish or shellfish allergy.", "Kimchi is salty.", VIT_K],
    swaps: ["Vegetarian without egg: use cubes of tofu."],
  },
];

const PANTRY_BY_ID = new Map(PANTRY.map((p) => [p.id, p]));

/** Shopping-list id for an ingredient: the pantry id, or a custom id like Pantry's own custom items. */
export function ingredientId(i: Ingredient): string {
  return i.pantryId ?? `custom-${i.name.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/\W+/g, "-").replace(/^-|-$/g, "")}`;
}

/** The shopping-list item for an ingredient, with the Pantry's aisle when it has one. */
export function toListItem(i: Ingredient): { id: string; name: string; aisle: string; qty: string } {
  const p = i.pantryId ? PANTRY_BY_ID.get(i.pantryId) : undefined;
  return { id: ingredientId(i), name: p ? p.name : i.name, aisle: p?.aisle ?? i.aisle ?? "Other", qty: i.amount };
}

/** List items for a recipe that aren't already on the list (by id), deduped within the recipe too. */
export function itemsToAdd(r: Recipe, existingIds: Iterable<string>) {
  const seen = new Set(existingIds);
  const out: ReturnType<typeof toListItem>[] = [];
  for (const i of r.ingredients) {
    const item = toListItem(i);
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

/** True when a recipe includes greens the Pantry flags for warfarin (vitamin K). */
export function hasVitaminKFlag(r: Recipe): boolean {
  return r.ingredients.some((i) => i.pantryId && PANTRY_BY_ID.get(i.pantryId)?.cautions.some((c) => /warfarin/i.test(c)));
}

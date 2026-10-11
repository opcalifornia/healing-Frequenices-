import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

export type Space = "windowsill" | "container" | "bed";
export type Light = "low" | "part" | "full";

export interface Plant {
  id: string;
  name: string;
  /** Link to the Pantry entry with the research, if there is one. */
  pantryId?: string;
  hue: number;
  needs: Light;
  spaces: Space[];
  level: "Easiest" | "Easy" | "Some care";
  start: string;
  harvestDays: number;
  water: string;
  use: string;
  tip: string;
  caution?: string;
}

export const SPACE_LABEL: Record<Space, string> = { windowsill: "A sunny windowsill", container: "Pots on a balcony or patio", bed: "A garden bed" };
export const LIGHT_LABEL: Record<Light, string> = { low: "Bright but little direct sun", part: "A few hours of sun", full: "6+ hours of direct sun" };
const LIGHT_RANK: Record<Light, number> = { low: 0, part: 1, full: 2 };
export const fits = (p: Plant, space: Space, light: Light) => p.spaces.includes(space) && LIGHT_RANK[light] >= LIGHT_RANK[p.needs];

export const PLANTS: Plant[] = [
  { id: "microgreens", name: "Microgreens", hue: 110, needs: "low", spaces: ["windowsill", "container"], level: "Easiest", start: "Seed (broccoli, radish, pea or sunflower)", harvestDays: 10, water: "Mist daily; keep the soil damp, not soggy.", use: "Snip onto salads, eggs, sandwiches and bowls.", tip: "Sow seeds thickly on a shallow tray of soil, cover for 2 to 3 days until they sprout, then give them light. Harvest when the first true leaves appear." },
  { id: "green-onion", name: "Green onions (regrown)", hue: 95, needs: "low", spaces: ["windowsill"], level: "Easiest", start: "The root ends from store-bought green onions", harvestDays: 9, water: "Change the water every couple of days.", use: "Snip the tops for any savory dish.", tip: "Stand the white root ends in a glass with an inch of water. They regrow in about a week, and you can harvest several times." },
  { id: "mint", name: "Mint", hue: 150, needs: "part", spaces: ["windowsill", "container"], level: "Easiest", start: "A small nursery plant", harvestDays: 28, water: "Keep the soil moist.", use: "Fresh mint tea, salads, water, desserts.", tip: "Pick from the tips often to keep it bushy.", caution: "Grow it in its own pot. In the ground, mint spreads aggressively and takes over a bed." },
  { id: "lemon-balm", name: "Lemon balm", pantryId: "lemon-balm", hue: 75, needs: "part", spaces: ["container", "bed"], level: "Easiest", start: "A small nursery plant", harvestDays: 28, water: "Water when the top inch of soil is dry.", use: "Calming evening tea, fresh or dried.", tip: "Cut back flowering stems so it doesn't self-seed everywhere." },
  { id: "basil", name: "Basil", hue: 120, needs: "full", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 60, water: "Water at the base when the top of the soil is dry.", use: "Pesto, salads, tomatoes, soups.", tip: "Pinch off flower buds as soon as they appear, and harvest from the top down. It needs warmth: it hates cold windows." },
  { id: "parsley", name: "Parsley", hue: 125, needs: "part", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "A nursery plant (seeds are slow)", harvestDays: 30, water: "Keep evenly moist.", use: "Salads, tabbouleh, sauces, garnish. Rich in vitamins C and K.", tip: "Harvest outer stems first so the center keeps growing." },
  { id: "cilantro", name: "Cilantro", hue: 105, needs: "part", spaces: ["container", "bed"], level: "Some care", start: "Seed, sown every few weeks", harvestDays: 40, water: "Keep moist.", use: "Salsas, curries, tacos.", tip: "It bolts (flowers) fast in summer heat. Grow it in spring and fall, and sow a little every few weeks." },
  { id: "thyme", name: "Thyme", hue: 90, needs: "full", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "A small nursery plant", harvestDays: 28, water: "Let it dry out between waterings.", use: "Roasts, soups, beans, tea.", tip: "Gritty, well-drained soil keeps it happy. Too much water is the usual killer." },
  { id: "rosemary", name: "Rosemary", hue: 160, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "A small nursery plant", harvestDays: 30, water: "Let it dry out between waterings.", use: "Roasted vegetables, potatoes, bread, beans.", tip: "Bring pots indoors to a bright window where winters are cold." },
  { id: "chamomile", name: "Chamomile", pantryId: "chamomile", hue: 50, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed (German chamomile)", harvestDays: 60, water: "Water when the top of the soil is dry.", use: "Pick the flowers when fully open and dry them for tea.", tip: "Just press seeds onto the soil surface; they need light to germinate.", caution: "Avoid if you're allergic to ragweed or daisies." },
  { id: "calendula", name: "Calendula", hue: 35, needs: "full", spaces: ["container", "bed"], level: "Easiest", start: "Seed", harvestDays: 55, water: "Water when dry.", use: "Edible petals for salads; dried flowers for infused oil and salve.", tip: "Pick flowers often and it keeps blooming until frost.", caution: "Avoid if you're allergic to ragweed or daisies." },
  { id: "lavender", name: "Lavender", hue: 270, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "A nursery plant", harvestDays: 90, water: "Drought tolerant; water sparingly.", use: "A pinch of culinary lavender in tea or baking; dried bundles for scent.", tip: "Needs sharp drainage and full sun. Expect the best flowers in its second year.", caution: "Never swallow lavender essential oil." },
  { id: "tulsi", name: "Holy basil (tulsi)", pantryId: "tulsi", hue: 130, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 70, water: "Keep evenly moist.", use: "Fresh or dried leaves for tea.", tip: "Loves heat. Grow it outside in summer or in your sunniest window." },
  { id: "aloe", name: "Aloe vera", hue: 140, needs: "low", spaces: ["windowsill", "container"], level: "Easiest", start: "A small plant or a pup from a friend", harvestDays: 60, water: "Every 2 to 3 weeks; let it dry out completely.", use: "Gel from a leaf can soothe minor sunburn and small burns.", tip: "Bright, indirect light and a gritty cactus mix.", caution: "Don't eat the leaf or the yellow latex under the skin; it's a strong laxative." },
  { id: "ginger", name: "Ginger", pantryId: "ginger", hue: 40, needs: "part", spaces: ["container"], level: "Some care", start: "A plump piece of organic grocery ginger with visible buds", harvestDays: 240, water: "Keep moist but not soggy.", use: "Fresh ginger for tea and cooking.", tip: "Soak the root overnight, plant it buds up just under the soil in a wide pot, and keep it warm. Bring it indoors below about 50°F (10°C)." },
  { id: "turmeric", name: "Turmeric", pantryId: "turmeric", hue: 45, needs: "part", spaces: ["container"], level: "Some care", start: "A fresh turmeric root with buds", harvestDays: 270, water: "Keep moist in summer, drier in winter.", use: "Fresh turmeric for curries, eggs, rice and tea.", tip: "Grows like ginger: warm, humid and in a wide pot. The leaves die back when the roots are ready." },
  { id: "garlic", name: "Garlic", pantryId: "garlic", hue: 55, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Cloves from seed garlic, planted in fall", harvestDays: 240, water: "Water in spring; stop when the leaves start to yellow.", use: "Everything savory.", tip: "Plant cloves pointy end up in autumn, 2 inches deep. Harvest in early summer when about half the leaves are brown." },
];

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  hue: number;
  time: string;
  ingredients: Array<{ text: string; pantryId?: string; buy?: string; aisle?: string }>;
  steps: string[];
  safety: string[];
  evidence: Strength;
  why: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "morning-ginger", name: "Morning ginger-lemon", tagline: "A warm, caffeine-free start", hue: 40, time: "12 min", evidence: "Moderate",
    why: "Ginger has the best evidence of any kitchen herb for easing nausea. This won't replace coffee's caffeine, but a warm, spicy drink is a pleasant wake-up ritual and helps you get water in first thing.",
    ingredients: [{ text: "1-inch piece of fresh ginger, thinly sliced", pantryId: "ginger" }, { text: "2 cups water" }, { text: "Juice of half a lemon", buy: "Lemons", aisle: "Produce" }, { text: "1 tsp raw honey (optional)", pantryId: "raw-honey" }],
    steps: ["Simmer the ginger in the water for 10 minutes.", "Take it off the heat and add the lemon juice.", "Stir in honey once it's cool enough to drink, if you like."],
    safety: ["Never give honey to babies under 12 months.", "Large amounts of ginger can cause heartburn."],
  },
  {
    id: "evening-calm", name: "Evening calm blend", tagline: "Chamomile, lemon balm and a pinch of lavender", hue: 265, time: "8 min", evidence: "Weak",
    why: "Chamomile and lemon balm have small, mixed studies for calm and sleep. The bigger benefit may be the ritual itself: a warm, caffeine-free drink as a cue that the day is over.",
    ingredients: [{ text: "1 tsp dried chamomile flowers", pantryId: "chamomile" }, { text: "1 tsp dried lemon balm", pantryId: "lemon-balm" }, { text: "A small pinch of dried culinary lavender", buy: "Culinary lavender", aisle: "Herbs & spices" }, { text: "1 cup water, just off the boil" }],
    steps: ["Put the herbs in a teapot or infuser.", "Pour the hot water over and cover, so the aromatic oils stay in the cup.", "Steep 5 to 7 minutes, strain, and drink about an hour before bed."],
    safety: ["Skip chamomile if you're allergic to ragweed or daisies.", "These herbs can add to the effect of sedatives and sleep aids.", "Pregnant or on medication? Check with your clinician first."],
  },
  {
    id: "digestive", name: "After-dinner digestive", tagline: "Peppermint, ginger and fennel", hue: 150, time: "12 min", evidence: "Mixed",
    why: "Peppermint oil capsules have good evidence for IBS, and ginger for nausea. As a tea the effects are gentler, but many people find this blend soothing after a big meal.",
    ingredients: [{ text: "3 thin slices of fresh ginger", pantryId: "ginger" }, { text: "1/2 tsp fennel seeds, lightly crushed", buy: "Fennel seeds", aisle: "Herbs & spices" }, { text: "A small handful of fresh mint, or 1 tsp dried peppermint", pantryId: "peppermint" }, { text: "1 1/2 cups water" }],
    steps: ["Simmer the ginger and fennel in the water for 5 minutes.", "Take it off the heat, add the mint, cover and steep 5 minutes.", "Strain and sip slowly."],
    safety: ["Peppermint can make acid reflux and heartburn worse."],
  },
  {
    id: "hibiscus", name: "Hibiscus cold brew", tagline: "Tart, ruby-red, caffeine-free", hue: 345, time: "5 min + 6 hours", evidence: "Mixed",
    why: "Several small trials found hibiscus tea modestly lowered blood pressure in people with mildly high readings. Cold brewing makes it smooth and less sour.",
    ingredients: [{ text: "2 tbsp dried hibiscus flowers", pantryId: "hibiscus" }, { text: "4 cups cold water" }, { text: "1 lime", buy: "Limes", aisle: "Produce" }, { text: "Fresh mint to serve" }],
    steps: ["Combine the hibiscus and cold water in a jar.", "Refrigerate 6 to 8 hours, then strain.", "Serve over ice with lime and mint. Keeps 3 days in the fridge."],
    safety: ["May add to the effect of blood pressure medicine.", "Avoid during pregnancy."],
  },
  {
    id: "ginger-honey", name: "Ginger honey", tagline: "A spoonful for tea or sore throats", hue: 35, time: "10 min", evidence: "Moderate",
    why: "A Cochrane review found honey can ease cough in children over one. The ginger adds warmth and flavor; stir a spoonful into hot water or tea.",
    ingredients: [{ text: "A 3-inch piece of fresh ginger, very thinly sliced", pantryId: "ginger" }, { text: "About 1 cup raw honey", pantryId: "raw-honey" }, { text: "A clean glass jar with a lid" }],
    steps: ["Pack the ginger slices into the jar.", "Pour honey over until fully covered, and stir out air bubbles.", "Keep it in the fridge and use within 2 weeks."],
    safety: ["Never give honey to babies under 12 months.", "Fresh ingredients add moisture to honey, so keep it refrigerated and make small batches."],
  },
  {
    id: "calendula-salve", name: "Calendula salve", tagline: "A simple skin balm from your garden", hue: 30, time: "3 hours, mostly waiting", evidence: "Weak",
    why: "Calendula has been used on skin for centuries. Studies on wound healing and skin irritation are small and mixed, but a simple oil-and-beeswax balm is a gentle moisturizer for dry skin.",
    ingredients: [{ text: "1/2 cup fully dried calendula flowers", buy: "Dried calendula flowers", aisle: "Specialty & international" }, { text: "1 cup olive oil", pantryId: "evoo" }, { text: "About 1 oz (28 g) beeswax pellets", buy: "Beeswax pellets", aisle: "Other" }, { text: "Small tins or jars" }],
    steps: [
      "Put the flowers and oil in a heatproof jar set in a pot of barely simmering water (a double boiler).",
      "Warm gently on the lowest heat for 2 to 3 hours. Don't let it fry or smoke.",
      "Strain through cheesecloth, squeezing out the oil.",
      "Melt the beeswax into the warm oil, about 1 part wax to 4 or 5 parts oil. Pour into tins and let it set.",
    ],
    safety: ["Flowers must be completely dry; any moisture can grow mold.", "Patch test on your inner arm first.", "Avoid if you're allergic to ragweed or daisies.", "For minor dry skin only, not open or deep wounds."],
  },
];

export const SAFETY_RULES = [
  { title: "Natural doesn't mean safe", body: "Herbs are active substances. They can cause allergies and interact with medicines like blood thinners, blood pressure drugs, sedatives and diabetes medicine. Check each herb's Pantry page." },
  { title: "Be 100% sure before you forage", body: "Some deadly plants look like edible ones. Wild burdock, for example, can be confused with toxic plants. Buy herbs from a trusted source unless an expert has taught you." },
  { title: "Never swallow essential oils", body: "Concentrated essential oils can be toxic if swallowed, even in small amounts, and are especially dangerous for children. Keep them locked away." },
  { title: "Garlic in oil needs the fridge", body: "Fresh garlic or herbs stored in oil at room temperature can grow the bacteria that cause botulism. Make small batches, refrigerate, and use within 4 days, or freeze." },
  { title: "Check before giving herbs to kids or in pregnancy", body: "Many herbs haven't been studied in children or during pregnancy and breastfeeding. Ask a pediatrician, midwife or pharmacist first." },
  { title: "Pets are different", body: "Many common herbs, including mint, chamomile, lavender and aloe, are listed as toxic to cats or dogs. Keep pots out of reach.", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants", label: "ASPCA toxic plant list" },
];

export const BASICS = [
  { title: "Start with three pots", body: "Mint, basil and parsley cover a lot of cooking and tea, and they're forgiving. Add more once those are thriving.", hue: 120 },
  { title: "Drainage beats everything", body: "Use pots with holes, a quality potting mix (never garden soil in a pot), and water when the top inch is dry. Most herbs die from too much water, not too little.", hue: 200 },
  { title: "Harvest to grow", body: "Regular snipping from the top makes herbs bushier. Never take more than a third of the plant at once.", hue: 90 },
  { title: "Compost your scraps", body: "Mix 'greens' (fruit and vegetable scraps, coffee grounds) with 'browns' (dry leaves, cardboard). Keep it as damp as a wrung-out sponge and turn it every week or two. In a few months it becomes rich soil.", hue: 30 },
  { title: "Regrow from the kitchen", body: "Green onion roots, the base of a celery bunch, and romaine hearts will regrow in a shallow dish of water on a windowsill.", hue: 150 },
  { title: "Know your zone", body: "Your USDA hardiness zone tells you which perennials survive your winters and when to plant outdoors.", url: "https://planthardiness.ars.usda.gov/", label: "Look up your zone", hue: 260 },
];

export const GARDEN_SOURCES: Source[] = [
  { text: "USDA Plant Hardiness Zone Map", url: "https://planthardiness.ars.usda.gov/" },
  { text: "ASPCA: Toxic and non-toxic plants", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants" },
];

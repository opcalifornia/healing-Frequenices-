import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";
import { foodIndex } from "./nutrientsContent";

export type Space = "windowsill" | "container" | "bed";
export type PlantKind = "herb" | "vegetable" | "fruit" | "flower";
/** Cool-season crops grow in spring and fall and handle light frost; warm-season crops need warm soil and no frost. */
export type Season = "cool" | "warm" | "perennial" | "any";
export type Light = "low" | "part" | "full";

export interface Plant {
  id: string;
  name: string;
  kind: PlantKind;
  season: Season;
  /** The name of this food in the vitamins and minerals guide, to show what it is rich in. */
  food?: string;
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
  { id: "microgreens", kind: "vegetable", season: "any", food: "broccoli", name: "Microgreens", hue: 110, needs: "low", spaces: ["windowsill", "container"], level: "Easiest", start: "Seed (broccoli, radish, pea or sunflower)", harvestDays: 10, water: "Mist daily; keep the soil damp, not soggy.", use: "Snip onto salads, eggs, sandwiches and bowls.", tip: "Sow seeds thickly on a shallow tray of soil, cover for 2 to 3 days until they sprout, then give them light. Harvest when the first true leaves appear." },
  { id: "green-onion", kind: "vegetable", season: "any", name: "Green onions (regrown)", hue: 95, needs: "low", spaces: ["windowsill"], level: "Easiest", start: "The root ends from store-bought green onions", harvestDays: 9, water: "Change the water every couple of days.", use: "Snip the tops for any savory dish.", tip: "Stand the white root ends in a glass with an inch of water. They regrow in about a week, and you can harvest several times." },
  { id: "mint", kind: "herb", season: "perennial", name: "Mint", hue: 150, needs: "part", spaces: ["windowsill", "container"], level: "Easiest", start: "A small nursery plant", harvestDays: 28, water: "Keep the soil moist.", use: "Fresh mint tea, salads, water, desserts.", tip: "Pick from the tips often to keep it bushy.", caution: "Grow it in its own pot. In the ground, mint spreads aggressively and takes over a bed." },
  { id: "lemon-balm", kind: "herb", season: "perennial", name: "Lemon balm", pantryId: "lemon-balm", hue: 75, needs: "part", spaces: ["container", "bed"], level: "Easiest", start: "A small nursery plant", harvestDays: 28, water: "Water when the top inch of soil is dry.", use: "Relaxing evening tea, fresh or dried.", tip: "Cut back flowering stems so it doesn't self-seed everywhere." },
  { id: "basil", kind: "herb", season: "warm", name: "Basil", hue: 120, needs: "full", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 60, water: "Water at the base when the top of the soil is dry.", use: "Pesto, salads, tomatoes, soups.", tip: "Pinch off flower buds as soon as they appear, and harvest from the top down. It needs warmth: it hates cold windows." },
  { id: "parsley", kind: "herb", season: "cool", name: "Parsley", hue: 125, needs: "part", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "A nursery plant (seeds are slow)", harvestDays: 30, water: "Keep evenly moist.", use: "Salads, tabbouleh, sauces, garnish. Rich in vitamins C and K.", tip: "Harvest outer stems first so the center keeps growing." },
  { id: "cilantro", kind: "herb", season: "cool", name: "Cilantro", hue: 105, needs: "part", spaces: ["container", "bed"], level: "Some care", start: "Seed, sown every few weeks", harvestDays: 40, water: "Keep moist.", use: "Salsas, curries, tacos.", tip: "It bolts (flowers) fast in summer heat. Grow it in spring and fall, and sow a little every few weeks." },
  { id: "thyme", kind: "herb", season: "perennial", name: "Thyme", hue: 90, needs: "full", spaces: ["windowsill", "container", "bed"], level: "Easy", start: "A small nursery plant", harvestDays: 28, water: "Let it dry out between waterings.", use: "Roasts, soups, beans, tea.", tip: "Gritty, well-drained soil keeps it happy. Too much water is the usual killer." },
  { id: "rosemary", kind: "herb", season: "perennial", name: "Rosemary", hue: 160, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "A small nursery plant", harvestDays: 30, water: "Let it dry out between waterings.", use: "Roasted vegetables, potatoes, bread, beans.", tip: "Bring pots indoors to a bright window where winters are cold." },
  { id: "chamomile", kind: "flower", season: "cool", name: "Chamomile", pantryId: "chamomile", hue: 50, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed (German chamomile)", harvestDays: 60, water: "Water when the top of the soil is dry.", use: "Pick the flowers when fully open and dry them for tea.", tip: "Just press seeds onto the soil surface; they need light to germinate.", caution: "Avoid if you're allergic to ragweed or daisies." },
  { id: "calendula", kind: "flower", season: "cool", name: "Calendula", hue: 35, needs: "full", spaces: ["container", "bed"], level: "Easiest", start: "Seed", harvestDays: 55, water: "Water when dry.", use: "Edible petals for salads; dried flowers for infused oil and salve.", tip: "Pick flowers often and it keeps blooming until frost.", caution: "Avoid if you're allergic to ragweed or daisies." },
  { id: "lavender", kind: "flower", season: "perennial", name: "Lavender", hue: 270, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "A nursery plant", harvestDays: 90, water: "Drought tolerant; water sparingly.", use: "A pinch of culinary lavender in tea or baking; dried bundles for scent.", tip: "Needs sharp drainage and full sun. Expect the best flowers in its second year.", caution: "Never swallow lavender essential oil." },
  { id: "tulsi", kind: "herb", season: "warm", name: "Holy basil (tulsi)", pantryId: "tulsi", hue: 130, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 70, water: "Keep evenly moist.", use: "Fresh or dried leaves for tea.", tip: "Loves heat. Grow it outside in summer or in your sunniest window." },
  { id: "aloe", kind: "herb", season: "any", name: "Aloe vera", hue: 140, needs: "low", spaces: ["windowsill", "container"], level: "Easiest", start: "A small plant or a pup from a friend", harvestDays: 60, water: "Every 2 to 3 weeks; let it dry out completely.", use: "Gel from a leaf can soothe minor sunburn and small burns.", tip: "Bright, indirect light and a gritty cactus mix.", caution: "Don't eat the leaf or the yellow latex under the skin; it's a strong laxative." },
  { id: "ginger", kind: "herb", season: "warm", name: "Ginger", pantryId: "ginger", hue: 40, needs: "part", spaces: ["container"], level: "Some care", start: "A plump piece of organic grocery ginger with visible buds", harvestDays: 240, water: "Keep moist but not soggy.", use: "Fresh ginger for tea and cooking.", tip: "Soak the root overnight, plant it buds up just under the soil in a wide pot, and keep it warm. Bring it indoors below about 50°F (10°C)." },
  { id: "turmeric", kind: "herb", season: "warm", name: "Turmeric", pantryId: "turmeric", hue: 45, needs: "part", spaces: ["container"], level: "Some care", start: "A fresh turmeric root with buds", harvestDays: 270, water: "Keep moist in summer, drier in winter.", use: "Fresh turmeric for curries, eggs, rice and tea.", tip: "Grows like ginger: warm, humid and in a wide pot. The leaves die back when the roots are ready." },
  { id: "garlic", kind: "vegetable", season: "cool", food: "garlic", name: "Garlic", pantryId: "garlic", hue: 55, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Cloves from seed garlic, planted in fall", harvestDays: 240, water: "Water in spring; stop when the leaves start to yellow.", use: "Everything savory.", tip: "Plant cloves pointy end up in autumn, 2 inches deep. Harvest in early summer when about half the leaves are brown." },
  { id: "lettuce", kind: "vegetable", season: "cool", food: "lettuce", name: "Lettuce", hue: 100, needs: "part", spaces: ["windowsill", "container", "bed"], level: "Easiest", start: "Seed, sown every 2 to 3 weeks", harvestDays: 35, water: "Keep evenly moist.", use: "Salads and sandwiches.", tip: "Cut the outer leaves and leave the centre, and the plant keeps producing. It turns bitter and runs to seed in hot weather, so grow it in spring and fall." },
  { id: "spinach", kind: "vegetable", season: "cool", food: "spinach", name: "Spinach", pantryId: "spinach", hue: 130, needs: "part", spaces: ["container", "bed"], level: "Easy", start: "Seed", harvestDays: 40, water: "Keep evenly moist.", use: "Salads, smoothies, eggs and soups.", tip: "Sow in early spring or late summer. It bolts (flowers and turns bitter) in heat and long days." },
  { id: "kale", kind: "vegetable", season: "cool", food: "kale", name: "Kale", hue: 150, needs: "part", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 55, water: "Water regularly; mulch to hold moisture.", use: "Salads, soups, smoothies and baked chips.", tip: "Pick the outer leaves and let the centre keep growing. Leaves taste sweeter after a light frost." },
  { id: "radish", kind: "vegetable", season: "cool", food: "radish", name: "Radishes", hue: 345, needs: "part", spaces: ["container", "bed"], level: "Easiest", start: "Seed", harvestDays: 28, water: "Keep evenly moist so the roots stay crisp.", use: "Salads, tacos and pickles.", tip: "One of the fastest crops, which makes it a good first success for beginners and children. Thin the seedlings so the roots have room." },
  { id: "peas", kind: "vegetable", season: "cool", food: "peas", name: "Peas", hue: 115, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed, planted early in spring", harvestDays: 60, water: "Water regularly while pods form.", use: "Eat fresh, steam, or add to stir-fries.", tip: "Give them a trellis or netting to climb. Pick often to keep the plants producing." },
  { id: "carrots", kind: "vegetable", season: "cool", food: "carrots", name: "Carrots", hue: 30, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Seed, sown directly", harvestDays: 70, water: "Keep the soil evenly moist until they sprout, then water regularly.", use: "Raw, roasted, soups and juices.", tip: "They need loose, deep soil without stones, or a deep pot. Thin the seedlings so the roots can swell." },
  { id: "beets", kind: "vegetable", season: "cool", food: "beets", name: "Beets", pantryId: "beets", hue: 335, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed", harvestDays: 55, water: "Water regularly.", use: "Roasted, grated raw, or in soups. The leaves are edible too.", tip: "Each seed is really a cluster, so thin the seedlings. Eat the thinnings as greens." },
  { id: "chard", kind: "vegetable", season: "cool", food: "swiss chard", name: "Swiss chard", hue: 355, needs: "part", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 55, water: "Keep evenly moist.", use: "Sautéed, in soups, or raw when young.", tip: "Cut the outer leaves and it keeps growing for months. It tolerates both cool and warm weather better than most greens." },
  { id: "broccoli", kind: "vegetable", season: "cool", food: "broccoli", name: "Broccoli", pantryId: "broccoli", hue: 140, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Nursery plant, or seed started indoors", harvestDays: 75, water: "Water regularly and evenly.", use: "Steamed, roasted or raw.", tip: "Cut the main head while the buds are tight and green. Smaller side shoots keep coming for weeks. It needs a large pot." },
  { id: "potatoes", kind: "vegetable", season: "cool", food: "potatoes", name: "Potatoes", hue: 40, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Certified seed potatoes (not supermarket ones)", harvestDays: 90, water: "Water regularly; keep the soil evenly moist.", use: "Baked, boiled, roasted or mashed.", tip: "Add soil around the stems as they grow, so more tubers form. Grow in a deep tub or bag if you lack a bed.", caution: "Green skin, sprouts and the leaves contain solanine, which can make you ill. Store potatoes in the dark and cut away any green parts." },
  { id: "tomatoes", kind: "vegetable", season: "warm", food: "tomatoes", name: "Tomatoes", hue: 5, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Nursery plant", harvestDays: 75, water: "Water deeply and evenly. Uneven watering can split the fruit.", use: "Salads, sauces and roasting.", tip: "Stake or cage them early. Cherry types are easiest in pots." },
  { id: "peppers", kind: "vegetable", season: "warm", food: "peppers", name: "Peppers", hue: 12, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Nursery plant", harvestDays: 80, water: "Water when the top inch is dry.", use: "Salads, stir-fries and sauces.", tip: "Be patient: they need warm weather and take longer than tomatoes. Sweet peppers turn red, yellow or orange if left on the plant.", caution: "Wash your hands after handling hot peppers, and keep them away from your eyes." },
  { id: "green-beans", kind: "vegetable", season: "warm", food: "green beans", name: "Green beans", hue: 125, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed, sown directly after the last frost", harvestDays: 55, water: "Water regularly, at the base.", use: "Steamed, sautéed or raw.", tip: "Bush beans are easiest in pots. Pole beans need a trellis but give more in less space. Pick often." },
  { id: "cucumbers", kind: "vegetable", season: "warm", food: "cucumber", name: "Cucumbers", hue: 120, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 55, water: "Water regularly and deeply.", use: "Salads, pickles and snacks.", tip: "Grow them up a trellis to save space and keep the fruit clean. Steady watering keeps them from turning bitter." },
  { id: "zucchini", kind: "vegetable", season: "warm", food: "zucchini", name: "Zucchini", hue: 105, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Seed or nursery plant", harvestDays: 50, water: "Water regularly at the base.", use: "Sautéed, grilled, baked or spiralised.", tip: "One or two plants are plenty. Pick them small, around 6 to 8 inches, or they turn tough and watery. It needs a big pot." },
  { id: "sweet-potatoes", kind: "vegetable", season: "warm", food: "sweet potatoes", name: "Sweet potatoes", hue: 25, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Slips (rooted shoots) from a nursery", harvestDays: 110, water: "Water regularly at first, then less.", use: "Roasted, mashed or baked. The leaves are edible too.", tip: "They need a long, warm season. Harvest before the first frost." },
  { id: "strawberries", kind: "fruit", season: "perennial", food: "strawberries", name: "Strawberries", hue: 350, needs: "full", spaces: ["container", "bed"], level: "Easy", start: "Nursery plants", harvestDays: 90, water: "Keep evenly moist.", use: "Fresh, in smoothies or frozen.", tip: "Hanging baskets and pots work well. Day-neutral types fruit through the season. Pick fruit when fully red." },
  { id: "blueberries", kind: "fruit", season: "perennial", food: "blueberries", name: "Blueberries", pantryId: "blueberries", hue: 235, needs: "full", spaces: ["container", "bed"], level: "Some care", start: "Nursery plants (two or more varieties)", harvestDays: 730, water: "Keep evenly moist.", use: "Fresh, frozen or in baking.", tip: "They need acidic soil and a patient gardener: expect a modest crop in the first year or two. Planting two varieties together gives bigger harvests." },
  { id: "raspberries", kind: "fruit", season: "perennial", food: "raspberries", name: "Raspberries", hue: 340, needs: "full", spaces: ["bed"], level: "Easy", start: "Bare-root canes or nursery plants", harvestDays: 365, water: "Water regularly during fruiting.", use: "Fresh, frozen or in desserts.", tip: "They spread: give them a dedicated bed or a large pot and a trellis or wires. Everbearing types fruit the first year." },
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
    id: "evening-calm", name: "Evening ease blend", tagline: "Chamomile, lemon balm and a pinch of lavender", hue: 265, time: "8 min", evidence: "Weak",
    why: "Chamomile and lemon balm have small, mixed studies for relaxation and sleep. The bigger benefit may be the ritual itself: a warm, caffeine-free drink as a cue that the day is over.",
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

export const SAFETY_RULES: Array<{ title: string; body: string; url?: string; label?: string }> = [
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

export const MORE_BASICS = [
  { title: "Cool-season or warm-season?", body: "Cool-season crops (lettuce, spinach, peas, broccoli, carrots) grow in spring and fall and handle light frost. Warm-season crops (tomatoes, peppers, beans, cucumbers, zucchini) need warm soil and must wait until after your last spring frost. Hardy cool-season crops can go in 2 to 4 weeks before it.", url: "https://cmg.extension.colostate.edu/Gardennotes/720.pdf", label: "Colorado State Extension: vegetable planting guide", hue: 175 },
  { title: "Plant a little, often", body: "For crops you harvest once, such as lettuce and radishes, sow a short row every 2 to 3 weeks instead of everything at once. You'll have a steady supply instead of a glut. Long-harvest crops like kale don't need it.", hue: 60 },
  { title: "Match the pot to the plant", body: "Big plants need big pots: tomatoes, peppers, zucchini, cucumbers and broccoli want a large container with drainage and potting mix. Lettuce, radishes and herbs are happy in shallow ones. Container plants dry out fast, so check them daily in summer.", hue: 20 },
];

export const GARDEN_SOURCES: Source[] = [
  { text: "Colorado State University Extension: GardenNotes 720, Vegetable planting guide", url: "https://cmg.extension.colostate.edu/Gardennotes/720.pdf" },
  { text: "US EPA: Healthy gardening, including lead in garden soil", url: "https://www.epa.gov/node/299831" },
  { text: "USDA Plant Hardiness Zone Map", url: "https://planthardiness.ars.usda.gov/" },
  { text: "ASPCA: Toxic and non-toxic plants", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants" },
];

export const KIND_LABEL: Record<PlantKind, string> = { herb: "Herbs", vegetable: "Vegetables", fruit: "Fruit", flower: "Flowers" };

export const SEASON_LABEL: Record<Season, string> = {
  cool: "Cool-season: spring and fall",
  warm: "Warm-season: after the last frost",
  perennial: "Comes back year after year",
  any: "Grows well indoors, any time",
};

/** Vitamins and minerals this food is a good source of, from the nutrient guide. */
export function nutrientsFor(p: Plant): string[] {
  if (!p.food) return [];
  const want = p.food.toLowerCase();
  const alt = new Set([want, `${want}s`, want.replace(/s$/, ""), want.replace(/es$/, "")]);
  const hit = foodIndex().find((f) => alt.has(f.name.toLowerCase()));
  return hit?.nutrients ?? [];
}

export interface PlantingAdvice {
  /** True when it is roughly a good time to plant where the person is. A rough guide only. */
  now: boolean;
  text: string;
}

/**
 * A rough planting window from the month and latitude. It can't know your local frost dates, so it always says
 * to check them. Hardy cool-season crops go in 2 to 4 weeks before the average last spring frost; warm-season
 * crops wait until after it (Colorado State University Extension, GardenNotes 720).
 */
export function plantingAdvice(p: Plant, month: number, lat: number): PlantingAdvice {
  if (p.season === "any") return { now: true, text: "Indoor and windowsill crops can be started at any time of year." };
  if (Math.abs(lat) < 23.5) {
    return p.season === "cool"
      ? { now: false, text: "In the tropics, grow cool-season crops in the cooler, drier part of the year. Ask a local grower or extension office." }
      : { now: true, text: "Warm-season crops can be grown through most of the year in the tropics, with regular watering." };
  }
  const m = lat < 0 ? (month + 6) % 12 : month; // shift the seasons for the southern hemisphere
  const spring = [2, 3, 4].includes(m);
  const lateSummer = [7, 8].includes(m);
  const earlySummer = [4, 5].includes(m);
  const hemi = lat < 0 ? "Seasons are reversed where you are, so these months are shifted by six." : "";
  const base: Record<Exclude<Season, "any">, PlantingAdvice> = {
    cool: { now: spring || lateSummer, text: "Plant in early spring, a few weeks before your average last spring frost, or in late summer for a fall crop." },
    warm: { now: earlySummer, text: "Wait until after your average last spring frost, when the soil is warm. Start tender plants indoors a few weeks earlier." },
    perennial: { now: spring || [8, 9].includes(m), text: "Plant in spring, or in early fall in mild climates, so the roots settle in before winter." },
  };
  const r = base[p.season];
  return { ...r, text: `${r.text} Check your local last-frost date with your county extension office.${hemi ? ` ${hemi}` : ""}` };
}

export const WHY_GARDEN: Array<{ id: string; title: string; stat: string; statLabel: string; rating: Strength; hue: number; body: string; source?: Source; link?: { to: string; label: string } }> = [
  {
    id: "wellbeing", title: "Gardening and how you feel", stat: "22", statLabel: "studies pooled in a 2016 meta-analysis", rating: "Moderate", hue: 120,
    body: "A meta-analysis of 22 studies found that gardening was linked with lower depression, anxiety and body mass index, and with higher life satisfaction, quality of life and sense of community. Most of the studies were observational, and the authors found some publication bias, so the results show a link, not proof that gardening causes the benefits.",
    source: { text: "Soga M, Gaston KJ, Yamaura Y. Gardening is beneficial for health: a meta-analysis. Preventive Medicine Reports, 2016", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5153451" },
  },
  {
    id: "produce", title: "Growing food and eating more of it", stat: "Mixed", statLabel: "surveys say yes, one randomised trial found little change", rating: "Mixed", hue: 95,
    body: "Surveys in Denver and Flint found that people who garden, especially in community gardens, eat more fruit and vegetables than people who don't. But gardeners may already differ in ways that matter. A randomised trial of a community gardening programme in the US did not find a significant change in fruit and vegetable intake, though fibre intake rose.",
    source: { text: "Litt JS et al. The influence of social involvement, neighborhood aesthetics, and community garden participation on fruit and vegetable consumption. American Journal of Public Health, 2011", url: "https://doi.org/10.2105/AJPH.2010.300111" },
  },
  {
    id: "daylight", title: "A reason to be outside in the morning", stat: "5-10 min", statLabel: "of morning daylight helps set your body clock", rating: "Moderate", hue: 45,
    body: "Daylight early in the day is the strongest cue for your body clock, and a bit of watering or picking is an easy reason to get it. See the Light section for the evidence and a live sun tracker for where you are.",
    link: { to: "/light#sun", label: "Follow the sun" },
  },
];

export const SOIL_SAFETY = {
  title: "Test the soil before growing food in it",
  body: "Soil in older neighbourhoods, near busy roads or near old painted buildings can contain lead. The EPA's advice: grow in raised beds with clean soil on a barrier of garden fabric (at least 16 inches deep for shallow-rooted crops), or in containers. Keep the soil near neutral pH, mulch to stop dust and splashing, wash your hands, tools and produce, peel root crops, and keep children and pets out of any bed where lead levels are unknown. Your county extension office can point you to soil testing.",
  url: "https://www.epa.gov/node/299831",
  label: "EPA: healthy gardening",
};

/**
 * Typical care for plants in pots, as a starting rhythm. Real needs depend on weather, pot size and soil,
 * so reminders say "check", not "water": press a finger into the top inch of soil first.
 * Feeding is a diluted balanced fertiliser every few weeks while the plant is growing, per the product label.
 */
export const CARE: Record<string, { water: number; feed?: number }> = {
  microgreens: { water: 1 }, "green-onion": { water: 2 }, mint: { water: 3 }, "lemon-balm": { water: 3 }, basil: { water: 3, feed: 21 },
  parsley: { water: 3 }, cilantro: { water: 3 }, thyme: { water: 7 }, rosemary: { water: 7 }, chamomile: { water: 3 }, calendula: { water: 3 },
  lavender: { water: 10 }, tulsi: { water: 3 }, aloe: { water: 14 }, ginger: { water: 4 }, turmeric: { water: 4 }, garlic: { water: 7 },
  lettuce: { water: 2 }, spinach: { water: 2 }, kale: { water: 3, feed: 21 }, radish: { water: 2 }, peas: { water: 3 }, carrots: { water: 3 },
  beets: { water: 3 }, chard: { water: 3 }, broccoli: { water: 3, feed: 21 }, potatoes: { water: 4, feed: 21 }, tomatoes: { water: 2, feed: 14 },
  peppers: { water: 3, feed: 14 }, "green-beans": { water: 3 }, cucumbers: { water: 2, feed: 14 }, zucchini: { water: 3, feed: 14 },
  "sweet-potatoes": { water: 5 }, strawberries: { water: 2, feed: 14 }, blueberries: { water: 3, feed: 30 }, raspberries: { water: 4 },
};

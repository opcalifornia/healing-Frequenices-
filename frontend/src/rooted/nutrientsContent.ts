import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/**
 * Vitamins and minerals: what each one does, where to find it, and who should be careful.
 *
 * Rules for this file:
 * - `evidence` rates the best-supported claim in `does`, on the app's usual scale.
 *   Every nutrient here is essential; the label is about the benefits listed, not about
 *   whether you need it at all.
 * - Food first. No supplement doses: the NIH fact sheet each entry links to gives the
 *   recommended amounts for every age and life stage.
 * - Every entry says who should check with a clinician or pharmacist before a supplement.
 */

export type NutrientGroup = "fat-vit" | "water-vit" | "major-min" | "trace-min";

export const GROUP_LABEL: Record<NutrientGroup, string> = {
  "fat-vit": "Fat-soluble vitamins",
  "water-vit": "Water-soluble vitamins",
  "major-min": "Major minerals",
  "trace-min": "Trace minerals",
};

export const GROUP_NOTE: Record<NutrientGroup, string> = {
  "fat-vit": "Absorbed best with a little fat in the meal, and stored in the body.",
  "water-vit": "Not stored for long, so you need them regularly. Cooking in water can wash some out.",
  "major-min": "Needed in larger amounts, and make up much of your bones, blood and body fluids.",
  "trace-min": "Needed in tiny amounts, with big jobs. Too little or too much both cause problems.",
};

export interface Nutrient {
  id: string;
  name: string;
  also?: string;
  group: NutrientGroup;
  evidence: Strength;
  hue: number;
  summary: string;
  does: string[];
  /** Plant foods, most useful first. */
  plants: string[];
  /** Animal and fortified foods. */
  other: string[];
  tips: string[];
  /** Who tends to get less than they need. */
  lowRisk: string;
  /** Who should check with a clinician or pharmacist before a supplement, and why. */
  care: string[];
  sources: Source[];
}

const ods = (slug: string, label: string): Source => ({ text: `NIH Office of Dietary Supplements. ${label}: Fact Sheet for Health Professionals`, url: `https://ods.od.nih.gov/factsheets/${slug}-HealthProfessional/` });

export const NUTRIENTS: Nutrient[] = [
  // ---------------- Fat-soluble vitamins ----------------
  {
    id: "vit-d", name: "Vitamin D", also: "D3 (cholecalciferol), D2 (ergocalciferol)", group: "fat-vit", evidence: "Strong", hue: 45,
    summary: "The sunshine vitamin: helps your gut take up calcium and keeps bones and muscles working.",
    does: ["Helps your body absorb calcium, so bones stay strong. Severe lack causes rickets in children and soft bones in adults (strong evidence).", "Supports muscle and immune function.", "Taking extra for general disease prevention has not held up: a large trial of over 25,000 adults found no drop in cancer or heart disease overall (strong evidence of no broad benefit)."],
    plants: ["Mushrooms exposed to UV light (D2)", "Fortified plant milks and cereals", "Vegan D3 from lichen (supplements)"],
    other: ["Oily fish: salmon, trout, sardines, mackerel", "Egg yolks", "Fortified milk and orange juice", "Cod liver oil (also very high in vitamin A)"],
    tips: ["Sunlight on bare skin is the main source for most people. How much you make depends on season, latitude, skin tone, age and sunscreen, so food and supplements matter more far from the equator in winter. See Follow the sun in Light.", "D3 is usually the form used in supplements and raises blood levels more than D2.", "Take it with a meal that has some fat.", "Magnesium is needed to turn vitamin D into its active form (see Better together)."],
    lowRisk: "People with darker skin, older adults, people who cover their skin or stay indoors, people living far from the equator in winter, and people with conditions that limit fat absorption.",
    care: ["A blood test is the only way to know your level. Ask a clinician before taking high amounts: too much can raise blood calcium and harm the kidneys.", "Check with a pharmacist if you take steroids, weight-loss medicines or anti-seizure drugs."],
    sources: [ods("VitaminD", "Vitamin D"), { text: "Manson JE et al. Vitamin D Supplements and Prevention of Cancer and Cardiovascular Disease. NEJM, 2019", url: "https://doi.org/10.1056/NEJMoa1809944" }],
  },
  {
    id: "vit-k", name: "Vitamin K", also: "K1 (phylloquinone), K2 (menaquinones such as MK-4, MK-7)", group: "fat-vit", evidence: "Strong", hue: 120,
    summary: "Makes the proteins that help blood clot, and others that direct calcium in bones.",
    does: ["Needed for blood clotting (strong evidence).", "Helps make proteins that bind calcium in bone.", "K2 specifically, for bone and artery health: studies so far are mixed and small, and whether K2 supplements prevent fractures or artery stiffening is not settled (mixed evidence)."],
    plants: ["Kale, collards, spinach, turnip greens (K1)", "Broccoli, Brussels sprouts, cabbage (K1)", "Natto, fermented soybeans, the richest K2 (MK-7) food", "Parsley, scallions, lettuce"],
    other: ["Egg yolks and butter (some K2, mainly MK-4)", "Some cheeses (K2)", "Chicken and liver (K2)"],
    tips: ["Leafy greens are the main source of K1. A little oil or dressing helps you absorb it.", "K2 comes mostly from fermented and animal foods. Natto is the standout.", "Gut bacteria make some K2 too, but how much you absorb from that is unclear."],
    lowRisk: "Newborns (given a shot at birth), people with fat-absorption problems, and long-term antibiotic users.",
    care: ["If you take warfarin (Coumadin) or a similar blood thinner, vitamin K changes how it works. Keep your intake steady and ask your clinician before adding a supplement or changing how many greens you eat."],
    sources: [ods("VitaminK", "Vitamin K")],
  },
  {
    id: "vit-a", name: "Vitamin A", also: "retinol, and beta-carotene from plants", group: "fat-vit", evidence: "Strong", hue: 28,
    summary: "For vision, immune defences, skin and growth.",
    does: ["Makes the pigment your eyes use in dim light; lack is a leading cause of preventable childhood blindness worldwide (strong evidence).", "Supports the immune system and the lining of your skin, gut and lungs.", "Needed for growth and development before birth."],
    plants: ["Sweet potato", "Carrots", "Spinach, kale, collards", "Butternut squash and pumpkin", "Cantaloupe, mango, apricots", "Red peppers"],
    other: ["Beef liver (very high)", "Eggs", "Milk and cheese", "Oily fish"],
    tips: ["Orange, yellow and dark green produce carries beta-carotene, which your body turns into vitamin A as needed.", "Cook carrots and sweet potato with a little fat to take up more."],
    lowRisk: "Mostly a concern in parts of the world with limited food variety, and for people with fat-absorption problems.",
    care: ["Ready-made vitamin A (retinol) from liver, cod liver oil or supplements is harmful in high amounts, and excess in pregnancy is linked to birth defects. Talk to a clinician if you are or may become pregnant.", "Beta-carotene supplements raised lung cancer risk in people who smoke. Food sources are fine."],
    sources: [ods("VitaminA", "Vitamin A and Carotenoids")],
  },
  {
    id: "vit-e", name: "Vitamin E", also: "alpha-tocopherol", group: "fat-vit", evidence: "Moderate", hue: 80,
    summary: "A fat-soluble antioxidant that protects cell membranes.",
    does: ["Protects fats in your cell membranes from damage by free radicals (strong evidence it is needed).", "Supports the immune system.", "Taking vitamin E supplements has not been shown to prevent heart disease or cancer in large trials (moderate evidence of no benefit)."],
    plants: ["Sunflower seeds", "Almonds and hazelnuts", "Wheat germ and wheat germ oil", "Peanut butter", "Spinach, broccoli, avocado", "Sunflower and safflower oil"],
    other: ["Fortified cereals", "Fish such as trout"],
    tips: ["Nuts and seeds are the easiest daily sources. A small handful goes a long way.", "Real shortage is rare and is usually from a fat-absorption problem."],
    lowRisk: "People with conditions that limit fat absorption, such as cystic fibrosis or Crohn's disease, and very premature babies.",
    care: ["High-dose supplements can raise bleeding risk, especially with blood thinners. Ask a clinician or pharmacist first.", "A large trial of vitamin E found a higher rate of prostate cancer in men taking it. Food is the safe route."],
    sources: [ods("VitaminE", "Vitamin E")],
  },

  // ---------------- Water-soluble vitamins ----------------
  {
    id: "vit-c", name: "Vitamin C", also: "ascorbic acid", group: "water-vit", evidence: "Strong", hue: 35,
    summary: "Builds collagen, supports immunity and helps you take up iron from plants.",
    does: ["Needed to make collagen for skin, blood vessels, bones and wound healing; severe lack causes scurvy (strong evidence).", "Helps your body absorb iron from plant foods (strong evidence).", "Acts as an antioxidant.", "Regular extra doses may slightly shorten colds, but they don't stop them (moderate evidence)."],
    plants: ["Red and yellow peppers", "Oranges, grapefruit, kiwi, strawberries", "Broccoli, Brussels sprouts, cauliflower", "Tomatoes, potatoes", "Guava, papaya, pineapple"],
    other: [],
    tips: ["Eat some raw or lightly cooked: heat and long boiling destroy some vitamin C.", "Pair it with iron-rich plant foods such as lentils or spinach."],
    lowRisk: "People who smoke (they need more), people with very limited diets, and some older adults.",
    care: ["Very large supplement amounts can cause stomach upset and kidney stones in some people.", "Ask a clinician if you have had kidney stones or have a condition that stores too much iron."],
    sources: [ods("VitaminC", "Vitamin C")],
  },
  {
    id: "b1", name: "Thiamin", also: "vitamin B1", group: "water-vit", evidence: "Strong", hue: 190,
    summary: "Helps turn food into energy and keeps nerves working.",
    does: ["Helps cells turn carbohydrate into energy (strong evidence).", "Supports nerve and heart function. Severe lack causes beriberi."],
    plants: ["Sunflower seeds", "Black beans, lentils, peas", "Whole grains and brown rice", "Fortified cereals and breads", "Asparagus, green peas"],
    other: ["Pork", "Trout and tuna", "Mussels"],
    tips: ["Refined white flour and rice lose thiamin, which is why they are usually enriched.", "Tea and coffee in large amounts can slightly reduce absorption."],
    lowRisk: "People with heavy long-term alcohol use, some who have had weight-loss surgery, people with certain digestive conditions, and those on some long-term diuretics.",
    care: ["Thiamin from food and standard supplements is very safe. A clinician should guide it if you drink heavily or have had weight-loss surgery."],
    sources: [ods("Thiamin", "Thiamin")],
  },
  {
    id: "b2", name: "Riboflavin", also: "vitamin B2", group: "water-vit", evidence: "Strong", hue: 55,
    summary: "Helps make energy and keeps skin and eyes healthy.",
    does: ["Helps cells make energy from food (strong evidence).", "Supports skin, eyes and the nervous system.", "High-dose riboflavin has been studied for migraine prevention with some benefit in small trials (mixed evidence)."],
    plants: ["Almonds", "Mushrooms", "Spinach", "Fortified cereals", "Quinoa and oats"],
    other: ["Milk, yogurt and cheese", "Eggs", "Beef liver", "Salmon"],
    tips: ["It breaks down in light, so milk is often sold in opaque containers.", "It turns urine bright yellow. That's harmless."],
    lowRisk: "Vegans who eat few fortified foods, pregnant and breastfeeding people, and people with a limited diet.",
    care: ["Safe from food. Ask a clinician before using high-dose supplements for migraines."],
    sources: [ods("Riboflavin", "Riboflavin")],
  },
  {
    id: "b3", name: "Niacin", also: "vitamin B3", group: "water-vit", evidence: "Strong", hue: 15,
    summary: "Helps cells release energy and make and repair DNA.",
    does: ["Part of the machinery cells use to produce energy (strong evidence).", "Severe lack causes pellagra."],
    plants: ["Peanuts and peanut butter", "Mushrooms", "Brown rice and whole grains", "Green peas", "Avocado", "Potatoes"],
    other: ["Chicken and turkey", "Tuna and salmon", "Beef", "Fortified cereals"],
    tips: ["Your body can also make niacin from the amino acid tryptophan found in protein foods."],
    lowRisk: "Rare in places with enriched foods. People with heavy alcohol use or very limited diets are at higher risk.",
    care: ["Supplement forms in higher amounts cause flushing, and in larger amounts can harm the liver. Doctors sometimes prescribe niacin for cholesterol, only with monitoring."],
    sources: [ods("Niacin", "Niacin")],
  },
  {
    id: "b5", name: "Pantothenic acid", also: "vitamin B5", group: "water-vit", evidence: "Strong", hue: 160,
    summary: "Helps your body use fats and carbohydrates for energy.",
    does: ["Part of coenzyme A, which is needed to make energy and many body compounds (strong evidence)."],
    plants: ["Shiitake mushrooms", "Avocado", "Sweet potato", "Sunflower seeds", "Chickpeas and lentils", "Whole grains"],
    other: ["Eggs", "Chicken and beef", "Milk and yogurt", "Fish"],
    tips: ["Its name comes from the Greek for \"from everywhere\": it is in nearly all foods, so shortage is very rare."],
    lowRisk: "Almost no one eating a varied diet.",
    care: ["Very safe. Very high supplement amounts can cause digestive upset."],
    sources: [ods("PantothenicAcid", "Pantothenic Acid")],
  },
  {
    id: "b6", name: "Vitamin B6", also: "pyridoxine", group: "water-vit", evidence: "Strong", hue: 205,
    summary: "Helps make brain chemicals and process protein.",
    does: ["Involved in more than 100 enzyme reactions, mostly in protein metabolism (strong evidence).", "Needed to make serotonin, dopamine and haemoglobin.", "Used in pregnancy for nausea under clinician advice (moderate evidence)."],
    plants: ["Chickpeas", "Potatoes", "Bananas", "Fortified cereals", "Pistachios and sunflower seeds", "Winter squash"],
    other: ["Salmon and tuna", "Chicken and turkey", "Beef liver"],
    tips: ["Chickpeas and a banana already cover a large share of a day's needs."],
    lowRisk: "People with kidney disease, autoimmune or digestive conditions, heavy alcohol use, and some older adults.",
    care: ["Taking too much from supplements for months can damage nerves, causing numbness and pain. Food is not a risk.", "Check with a pharmacist if you take anti-seizure drugs."],
    sources: [ods("VitaminB6", "Vitamin B6")],
  },
  {
    id: "b7", name: "Biotin", also: "vitamin B7", group: "water-vit", evidence: "Moderate", hue: 300,
    summary: "Helps turn food into energy. Its famous hair and nail claims are not well supported.",
    does: ["Helps enzymes break down fats, carbohydrates and protein (strong evidence it's needed).", "Biotin for hair, skin or nails in people who are not low: little good evidence (weak evidence)."],
    plants: ["Sunflower seeds", "Almonds and peanuts", "Sweet potatoes", "Spinach", "Broccoli", "Mushrooms"],
    other: ["Cooked eggs", "Salmon and pork", "Beef liver", "Milk and yogurt"],
    tips: ["Raw egg whites contain a protein that blocks biotin. Cooked eggs are fine.", "Real deficiency is rare."],
    lowRisk: "People who eat large amounts of raw egg whites, those on long-term anti-seizure drugs, and people with rare inherited problems.",
    care: ["Biotin supplements can distort common lab tests, including thyroid and heart-attack (troponin) blood tests. The US FDA warns about this. Tell any clinician or lab you take it, and stop it before tests if they advise."],
    sources: [ods("Biotin", "Biotin")],
  },
  {
    id: "folate", name: "Folate", also: "vitamin B9; folic acid is the supplement and fortification form", group: "water-vit", evidence: "Strong", hue: 135,
    summary: "Builds DNA and red blood cells. Important before and during early pregnancy.",
    does: ["Needed to make DNA and new cells and to form red blood cells (strong evidence).", "Taking folic acid before and in early pregnancy lowers the chance of neural tube defects such as spina bifida (strong evidence)."],
    plants: ["Lentils, chickpeas, black beans", "Spinach, kale, romaine", "Asparagus and Brussels sprouts", "Broccoli", "Oranges", "Avocado", "Fortified bread, pasta, rice and cereals"],
    other: ["Beef liver", "Eggs"],
    tips: ["The name comes from \"foliage\": leafy greens and beans are the heroes.", "Heat and long cooking destroy some folate, so steam or eat greens fresh."],
    lowRisk: "People who are pregnant or planning a pregnancy, heavy alcohol users, and people with digestive conditions that limit absorption.",
    care: ["If there is any chance of pregnancy, ask a clinician about folic acid. It matters before you know you are pregnant.", "A lot of folic acid can hide the signs of low vitamin B12. Ask a clinician if you are over 50 or eat no animal foods."],
    sources: [ods("Folate", "Folate")],
  },
  {
    id: "b12", name: "Vitamin B12", also: "cobalamin", group: "water-vit", evidence: "Strong", hue: 340,
    summary: "Keeps nerves and blood cells healthy. Found naturally only in animal foods.",
    does: ["Needed to make red blood cells and DNA, and to protect nerves (strong evidence).", "Low levels over time can cause anaemia and nerve damage."],
    plants: ["None naturally. Fortified nutritional yeast, plant milks and cereals", "Some fortified meat substitutes"],
    other: ["Clams and oysters", "Beef liver", "Salmon, trout and tuna", "Beef and poultry", "Milk, yogurt, cheese", "Eggs"],
    tips: ["If you eat no animal foods, you need a reliable source: fortified foods or a supplement.", "Your body stores it for years, so shortage develops slowly."],
    lowRisk: "Vegans and some vegetarians, adults over 50 (who absorb less from food), people who take metformin or long-term acid-reducing medicines, and people with digestive conditions or weight-loss surgery.",
    care: ["Ask a clinician about a blood test if you fit the groups above, or have tingling hands and feet or unusual tiredness.", "Check with a pharmacist if you take metformin or acid reducers."],
    sources: [ods("VitaminB12", "Vitamin B12")],
  },
  {
    id: "choline", name: "Choline", also: "an essential nutrient, often grouped with the B vitamins", group: "water-vit", evidence: "Moderate", hue: 18,
    summary: "Builds cell membranes and a brain chemical for memory and muscle control.",
    does: ["Needed for cell membranes and for acetylcholine, a messenger for memory, mood and muscles (strong evidence).", "Important for a baby's brain development in pregnancy (moderate evidence)."],
    plants: ["Soybeans and tofu", "Quinoa", "Broccoli and Brussels sprouts", "Potatoes", "Kidney beans", "Peanuts"],
    other: ["Eggs (the yolk)", "Beef liver and beef", "Chicken and turkey", "Fish such as salmon", "Milk"],
    tips: ["Most people eat less than the suggested amount. Eggs are the easiest single source."],
    lowRisk: "Pregnant and breastfeeding people, people who eat no animal foods, and heavy alcohol users.",
    care: ["Very high supplement amounts can cause a fishy body odour, low blood pressure and nausea. Food is fine."],
    sources: [ods("Choline", "Choline")],
  },

  // ---------------- Major minerals ----------------
  {
    id: "magnesium", name: "Magnesium", group: "major-min", evidence: "Moderate", hue: 160,
    summary: "A helper in over 300 reactions: muscles, nerves, blood sugar, blood pressure and bones.",
    does: ["Needed for hundreds of enzyme reactions, including making energy, muscle contraction and nerve signals (strong evidence it is essential).", "Higher intakes are linked to lower blood pressure, and supplements lower it modestly in some studies (moderate evidence).", "Helps turn vitamin D into its active form (moderate evidence, mostly lab and review-based).", "For sleep, anxiety or muscle cramps in people who are not low: weak or mixed. A Cochrane review found magnesium unlikely to reduce cramps in older adults (moderate-certainty evidence)."],
    plants: ["Pumpkin seeds and chia seeds", "Almonds, cashews, peanuts", "Spinach and Swiss chard", "Black beans, edamame, lentils", "Whole grains, oats, brown rice", "Avocado and banana", "Dark chocolate", "Potato with the skin"],
    other: ["Yogurt and milk", "Halibut and salmon"],
    tips: ["Greens contain magnesium in the middle of every leaf (it is at the centre of chlorophyll). Refined grains lose much of it.", "Absorption from supplements varies: citrate, glycinate and chloride forms are taken up better than oxide.", "Alcohol and some medicines increase how much you lose."],
    lowRisk: "Many adults eat less than the suggested amount. Higher risk: people with type 2 diabetes, digestive conditions such as Crohn's or celiac disease, heavy alcohol use, and older adults.",
    care: ["Supplement forms (not food) can cause diarrhoea and cramps in higher amounts.", "Ask a clinician or pharmacist first if you have kidney disease, or take antibiotics (tetracyclines, quinolones), bisphosphonates, diuretics or long-term stomach-acid medicines. These can interact."],
    sources: [ods("Magnesium", "Magnesium"), { text: "Uwitonze AM, Razzaque MS. Role of Magnesium in Vitamin D Activation and Function. J Am Osteopath Assoc, 2018", url: "https://doi.org/10.7556/jaoa.2018.037" }, { text: "Garrison SR et al. Magnesium for skeletal muscle cramps. Cochrane Database Syst Rev, 2020", url: "https://doi.org/10.1002/14651858.CD009402.pub3" }],
  },
  {
    id: "calcium", name: "Calcium", group: "major-min", evidence: "Strong", hue: 210,
    summary: "The main mineral in bones and teeth, and a signal for muscles and nerves.",
    does: ["Builds and maintains bones and teeth (strong evidence).", "Needed for muscle contraction, nerve signals and blood clotting.", "Calcium supplements alone have only a small effect on fractures, and work best with enough vitamin D (moderate evidence)."],
    plants: ["Calcium-set tofu", "Fortified plant milks and juices", "Kale, bok choy, collard greens", "Broccoli", "White beans", "Almonds", "Sesame seeds and tahini", "Figs"],
    other: ["Milk, yogurt, cheese", "Canned sardines and salmon with bones"],
    tips: ["Spinach is high in calcium on paper, but your body absorbs little of it. Kale and bok choy are better.", "Spread calcium through the day. The body absorbs smaller amounts better.", "Vitamin D and magnesium both help it do its job."],
    lowRisk: "Teens, women after menopause, older adults, people who avoid dairy without replacing it, and people with eating disorders or low body weight.",
    care: ["Too much from supplements can cause constipation and kidney stones. Ask a clinician about supplements, especially if you've had stones.", "Calcium can reduce how well some medicines work (certain antibiotics, thyroid medicine, iron). Space them apart and ask a pharmacist."],
    sources: [ods("Calcium", "Calcium")],
  },
  {
    id: "potassium", name: "Potassium", group: "major-min", evidence: "Strong", hue: 100,
    summary: "Helps balance fluids, power muscles and nerves, and keeps blood pressure in range.",
    does: ["Balances fluids and supports nerve signals and muscle contraction, including the heart (strong evidence).", "Eating more potassium-rich foods, along with less sodium, lowers blood pressure (strong evidence, the basis of the DASH eating pattern).", "It may reduce the risk of kidney stones and bone loss (moderate evidence)."],
    plants: ["Potatoes and sweet potatoes", "Beans, lentils, white beans", "Spinach and Swiss chard", "Bananas, oranges, cantaloupe", "Tomatoes and tomato paste", "Avocado", "Coconut water", "Dried apricots"],
    other: ["Yogurt and milk", "Salmon"],
    tips: ["Most people eat less than the suggested amount and more sodium than they need.", "Fruit and vegetables are the easiest route, and they bring fibre."],
    lowRisk: "Most people eat too little. Illness with vomiting or diarrhoea, and some water pills, can lower it.",
    care: ["Ask a clinician before increasing potassium or using salt substitutes if you have kidney disease or take ACE inhibitors, ARBs or potassium-sparing diuretics. Too much can affect heart rhythm.", "Most store-bought potassium supplements hold only a small amount, so food is the main route."],
    sources: [ods("Potassium", "Potassium")],
  },
  {
    id: "phosphorus", name: "Phosphorus", group: "major-min", evidence: "Strong", hue: 270,
    summary: "A partner of calcium in bones, and part of the molecule that carries energy.",
    does: ["Builds bones and teeth with calcium (strong evidence).", "Part of DNA and ATP, the cell's energy currency."],
    plants: ["Lentils, chickpeas, beans", "Nuts and seeds", "Whole grains, oats", "Potatoes", "Tofu"],
    other: ["Dairy", "Meat, poultry and fish", "Eggs"],
    tips: ["Shortage is rare. Phosphorus in plants is bound up and absorbed less than the kind added to processed foods.", "Phosphate additives (E338 to E341, E450 to E452) in cola, processed meat and cheese are absorbed almost fully. The scanner shows them."],
    lowRisk: "Almost no one. Uncommon in people with alcohol dependence or certain illnesses.",
    care: ["If you have kidney disease, you may need to limit phosphorus, including additives. Ask your care team."],
    sources: [ods("Phosphorus", "Phosphorus")],
  },

  // ---------------- Trace minerals ----------------
  {
    id: "iron", name: "Iron", group: "trace-min", evidence: "Strong", hue: 5,
    summary: "Carries oxygen in your blood and to your muscles.",
    does: ["Makes haemoglobin, which carries oxygen in red blood cells (strong evidence).", "Needed for energy, focus and immune function. Low iron can bring tiredness, breathlessness and pale skin."],
    plants: ["Lentils, chickpeas, beans", "Tofu and tempeh", "Spinach and Swiss chard", "Pumpkin and sesame seeds", "Quinoa", "Fortified cereals", "Dark chocolate", "Dried apricots"],
    other: ["Red meat and liver (the best-absorbed \"haem\" iron)", "Oysters, mussels, sardines", "Poultry"],
    tips: ["Eat plant iron with vitamin C (peppers, citrus, tomatoes) to take up more.", "Tea, coffee and calcium at the same meal reduce absorption. Have them between meals.", "Cooking in a cast-iron pan adds a little."],
    lowRisk: "People who menstruate heavily, are pregnant, are vegetarian or vegan, give blood often, have digestive conditions, or are young children and teenagers.",
    care: ["Don't take iron supplements unless a blood test shows you need them. Extra iron can build up and cause harm, and it upsets the stomach.", "People with hemochromatosis should avoid extra iron and vitamin C supplements.", "Keep iron supplements away from children. An overdose can be dangerous."],
    sources: [ods("Iron", "Iron")],
  },
  {
    id: "zinc", name: "Zinc", group: "trace-min", evidence: "Strong", hue: 230,
    summary: "For immunity, wound healing, taste and smell.",
    does: ["Needed for immune cells, wound healing, and your sense of taste and smell (strong evidence).", "Zinc lozenges started within a day of cold symptoms may shorten a cold slightly (mixed evidence)."],
    plants: ["Pumpkin seeds", "Chickpeas, lentils, beans", "Cashews and hemp seeds", "Oats and whole grains", "Fortified cereals", "Tofu"],
    other: ["Oysters (the richest food)", "Beef, crab, lobster", "Poultry", "Yogurt and cheese"],
    tips: ["Plant foods contain phytates that reduce zinc absorption. Soaking beans and grains, sprouting and fermenting help.", "People eating no animal foods may need somewhat more from plants."],
    lowRisk: "Vegetarians and vegans, older adults, people with digestive conditions, heavy alcohol users, and pregnant and breastfeeding people.",
    care: ["Taking a lot for a long time can cause copper shortage and weaken immunity.", "Zinc nasal sprays have been linked to lasting loss of smell. The US FDA warns against them.", "Zinc can reduce absorption of some antibiotics. Ask a pharmacist."],
    sources: [ods("Zinc", "Zinc")],
  },
  {
    id: "selenium", name: "Selenium", group: "trace-min", evidence: "Strong", hue: 50,
    summary: "A tiny amount powers antioxidant enzymes and thyroid hormones.",
    does: ["Part of enzymes that protect cells and help the thyroid make and use hormones (strong evidence).", "Selenium supplements have not been shown to prevent cancer or heart disease in people who aren't low (moderate evidence of no benefit)."],
    plants: ["Brazil nuts (very high)", "Whole grains and brown rice", "Sunflower seeds", "Mushrooms", "Beans and lentils"],
    other: ["Tuna, sardines, halibut, shrimp", "Eggs", "Beef, turkey and chicken", "Cottage cheese"],
    tips: ["The amount in plants depends on the soil they grew in.", "One or two Brazil nuts can cover a day, so they're a food to enjoy in small numbers, not by the handful."],
    lowRisk: "Uncommon. People with severe digestive disease, or those who depend on a diet from very selenium-poor soil.",
    care: ["Too much is harmful: hair and nail loss, nerve problems. Avoid high-dose supplements and eating Brazil nuts by the handful every day."],
    sources: [ods("Selenium", "Selenium")],
  },
  {
    id: "iodine", name: "Iodine", group: "trace-min", evidence: "Strong", hue: 285,
    summary: "The thyroid needs it to make hormones that set your metabolism.",
    does: ["Used to make thyroid hormones, which control metabolism, growth and a baby's brain development (strong evidence).", "Too little can cause goitre and, in pregnancy, harm brain development."],
    plants: ["Seaweed (nori, kelp, wakame: amounts vary a lot)", "Iodised salt", "Prunes and lima beans (small amounts)"],
    other: ["Cod, haddock, tuna", "Milk, yogurt, cheese", "Eggs", "Shrimp"],
    tips: ["Sea salt and \"gourmet\" salts are often not iodised. Check the label.", "Plant foods depend on the soil, so people eating no dairy, fish or iodised salt can run low."],
    lowRisk: "Pregnant and breastfeeding people, people who avoid dairy, fish and iodised salt, and vegans.",
    care: ["Kelp and some seaweed hold a very large and variable amount, and too much can cause thyroid problems just as too little can. Ask a clinician before kelp supplements, and if you have thyroid disease."],
    sources: [ods("Iodine", "Iodine")],
  },
  {
    id: "copper", name: "Copper", group: "trace-min", evidence: "Strong", hue: 22,
    summary: "Helps use iron, build connective tissue and support nerves.",
    does: ["Needed to make energy, use iron and form connective tissue and blood vessels (strong evidence).", "Supports nerve and immune function."],
    plants: ["Cashews, sunflower seeds, sesame seeds", "Shiitake mushrooms", "Chickpeas and lentils", "Dark chocolate", "Potatoes", "Whole grains"],
    other: ["Oysters and shellfish", "Beef liver"],
    tips: ["Zinc and copper compete for absorption, so they are best kept in balance."],
    lowRisk: "Rare. More likely in people taking high-dose zinc long term, or after some weight-loss surgery.",
    care: ["Supplements are rarely needed. Too much can harm the liver. Ask a clinician, especially with liver disease."],
    sources: [ods("Copper", "Copper")],
  },
  {
    id: "manganese", name: "Manganese", group: "trace-min", evidence: "Moderate", hue: 320,
    summary: "A helper for bone formation and for breaking down carbohydrates and cholesterol.",
    does: ["Part of enzymes involved in bone formation, metabolism and antioxidant defence (strong evidence it's needed).", "Shortage is very rare, so benefits from extra are unproven (weak evidence)."],
    plants: ["Hazelnuts and pecans", "Brown rice and oats", "Chickpeas and lentils", "Pineapple", "Spinach", "Tea"],
    other: ["Mussels and oysters"],
    tips: ["A varied diet with whole grains, nuts and legumes covers it."],
    lowRisk: "Almost no one.",
    care: ["Too much can affect the nervous system. It is most often linked to heavy workplace exposure or some well water, rather than food. Avoid high-dose supplements."],
    sources: [ods("Manganese", "Manganese")],
  },
  {
    id: "chromium", name: "Chromium", group: "trace-min", evidence: "Weak", hue: 175,
    summary: "A trace mineral often marketed for blood sugar. The evidence for that is thin.",
    does: ["May help insulin work, but whether people need more is unclear, and true deficiency is very rare (weak evidence).", "Chromium supplements for blood sugar or weight loss: results are mixed and small (mixed evidence)."],
    plants: ["Broccoli", "Whole grains", "Potatoes", "Grape juice", "Green beans", "Apples and bananas"],
    other: ["Beef and poultry", "Eggs"],
    tips: ["Food amounts vary widely, which makes it hard to study. Don't rely on it for blood sugar."],
    lowRisk: "Almost no one.",
    care: ["If you have diabetes, ask your care team before taking chromium, since it may change how your medicines work."],
    sources: [ods("Chromium", "Chromium")],
  },
  {
    id: "molybdenum", name: "Molybdenum", group: "trace-min", evidence: "Moderate", hue: 245,
    summary: "A trace mineral for enzymes that break down toxins and process proteins.",
    does: ["Part of enzymes that process certain amino acids and clear waste (strong evidence it's needed).", "Deficiency has only been seen in rare inherited conditions or unusual tube feeding."],
    plants: ["Legumes: lentils, black-eyed peas, beans", "Whole grains", "Nuts", "Leafy vegetables"],
    other: ["Dairy", "Liver"],
    tips: ["Beans and lentils are the best daily source."],
    lowRisk: "Almost no one.",
    care: ["Supplements are not needed and very high amounts can cause problems. Skip them unless a clinician advises."],
    sources: [ods("Molybdenum", "Molybdenum")],
  },
];

export const nutrientById = (id: string) => NUTRIENTS.find((n) => n.id === id);

/** Pairings that matter, with how well each is supported. */
export interface Pairing {
  id: string;
  title: string;
  parts: string[];
  evidence: Strength;
  body: string;
  link?: string;
  sources: Source[];
}

export const PAIRINGS: Pairing[] = [
  {
    id: "d-mg", title: "Vitamin D + Magnesium", parts: ["vit-d", "magnesium"], evidence: "Moderate",
    body: "The enzymes that turn vitamin D into its active form need magnesium to work. A review of the research argues that low magnesium may blunt vitamin D's effects, and that enough of both matters. Controlled trials on the best amounts are still needed, so see it as a good reason to eat magnesium-rich foods, not to take large doses.",
    link: "/light#sun",
    sources: [{ text: "Uwitonze AM, Razzaque MS. Role of Magnesium in Vitamin D Activation and Function. J Am Osteopath Assoc, 2018", url: "https://doi.org/10.7556/jaoa.2018.037" }],
  },
  {
    id: "d-k2", title: "Vitamin D + K2", parts: ["vit-d", "vit-k"], evidence: "Mixed",
    body: "Vitamin D helps you absorb calcium. Vitamin K helps make proteins that steer calcium into bone. That is a neat idea, and some small studies show better bone markers when they're combined, but whether pairing D3 with K2 protects against fractures or artery hardening has not been settled. Sunlight, leafy greens and fermented foods give you both without any pills. If you take warfarin, ask your clinician before adding K2.",
    sources: [ods("VitaminK", "Vitamin K"), ods("VitaminD", "Vitamin D")],
  },
  {
    id: "d-ca", title: "Calcium + Vitamin D", parts: ["calcium", "vit-d"], evidence: "Strong",
    body: "Vitamin D lets your gut take up calcium. Without enough D, much of the calcium you eat passes straight through.",
    sources: [ods("Calcium", "Calcium"), ods("VitaminD", "Vitamin D")],
  },
  {
    id: "fe-c", title: "Iron + Vitamin C", parts: ["iron", "vit-c"], evidence: "Strong",
    body: "Vitamin C turns the iron in plant foods into a form your body can absorb. Squeeze lemon on lentils, or add peppers to a bean dish. Tea, coffee and calcium at the same meal do the opposite, so have them between meals.",
    sources: [ods("Iron", "Iron")],
  },
  {
    id: "fat", title: "Vitamins A, D, E and K + a little fat", parts: ["vit-a", "vit-d", "vit-e", "vit-k"], evidence: "Strong",
    body: "These four dissolve in fat, so you absorb them better from a meal that has some. A drizzle of olive oil on greens, or nuts with carrots, is plenty.",
    sources: [ods("VitaminA", "Vitamin A and Carotenoids"), ods("VitaminK", "Vitamin K")],
  },
  {
    id: "zn-cu", title: "Zinc and Copper in balance", parts: ["zinc", "copper"], evidence: "Strong",
    body: "They compete to be absorbed. Long-term high-dose zinc can cause copper shortage, which is a reason to get these from food, and to ask a clinician before supplementing either.",
    sources: [ods("Zinc", "Zinc"), ods("Copper", "Copper")],
  },
  {
    id: "b12-fol", title: "Folate and B12 together", parts: ["folate", "b12"], evidence: "Strong",
    body: "Both are needed to make red blood cells and DNA. A lot of folic acid can hide the signs of low B12, which is why older adults and people eating no animal foods should check their B12.",
    sources: [ods("Folate", "Folate"), ods("VitaminB12", "Vitamin B12")],
  },
];

export const NUTRIENT_SOURCES: Source[] = [
  { text: "NIH Office of Dietary Supplements: fact sheets for every vitamin and mineral, with recommended amounts for each age", url: "https://ods.od.nih.gov/factsheets/list-all/" },
  { text: "U.S. Department of Agriculture FoodData Central: look up the nutrients in any food", url: "https://fdc.nal.usda.gov/" },
];

/** Every food named in the guide, with the nutrients it carries, for "find by food". */
export interface FoodEntry { name: string; plant: boolean; nutrients: string[] }

/** Strip the "(note)" and trailing detail so foods match across entries. */
function foodName(raw: string): string {
  return raw.replace(/\s*\(.*?\)/g, "").trim();
}

export function foodIndex(): FoodEntry[] {
  const map = new Map<string, FoodEntry>();
  const add = (raw: string, plant: boolean, id: string) => {
    if (raw.includes(":") || /supplement|richest|form\b/i.test(raw)) return;
    for (const piece of foodName(raw).split(/,| and /).map((s) => s.trim()).filter(Boolean)) {
      const key = piece.toLowerCase().replace(/^(fortified|calcium-set|cooked|dried)\s+/, "");
      if (key.length < 3 || key.split(" ").length > 3) continue;
      const e = map.get(key) ?? { name: key[0].toUpperCase() + key.slice(1), plant, nutrients: [] };
      if (!e.nutrients.includes(id)) e.nutrients.push(id);
      map.set(key, e);
    }
  };
  for (const n of NUTRIENTS) { n.plants.forEach((p) => add(p, true, n.id)); n.other.forEach((p) => add(p, false, n.id)); }
  return [...map.values()].sort((a, b) => b.nutrients.length - a.nutrients.length || a.name.localeCompare(b.name));
}

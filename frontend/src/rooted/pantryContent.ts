import type { Strength } from "../learn/brainContent";

/**
 * The Pantry: foods, herbs and teas with what the research actually says.
 *
 * Rules for this file:
 * - `evidence` rates the best-supported health claim in `benefits`, using the
 *   same scale as the rest of the app (Strong … None).
 * - Traditional uses go in `tradition` and are labelled as tradition, never as
 *   proven effects.
 * - No supplement doses. Food amounts only where a public-health body sets one.
 * - Every herb lists who should check with a clinician first.
 */

export type PantryCat = "herb" | "tea" | "produce" | "grain" | "nut" | "fat" | "ferment" | "sea" | "other";

export interface Source {
  text: string;
  url?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  also?: string;
  cat: PantryCat;
  aisle: string;
  evidence: Strength;
  hue: number;
  summary: string;
  benefits: string[];
  tradition?: string;
  use: string;
  cautions: string[];
  find: string;
  sources: Source[];
}

export const CAT_LABEL: Record<PantryCat, string> = {
  herb: "Herbs & roots",
  tea: "Teas",
  produce: "Produce",
  grain: "Grains & beans",
  nut: "Nuts & seeds",
  fat: "Oils & vinegar",
  ferment: "Fermented",
  sea: "Seafood",
  other: "Other",
};

const NCCIH = (slug: string, name: string): Source => ({ text: `NCCIH: ${name}: Usefulness and Safety`, url: `https://www.nccih.nih.gov/health/${slug}` });
const HERBS_AT_A_GLANCE: Source = { text: "NCCIH: Herbs at a Glance", url: "https://www.nccih.nih.gov/health/herbsataglance" };
const FDC: Source = { text: "USDA FoodData Central (nutrient values)", url: "https://fdc.nal.usda.gov/" };
const REYNOLDS: Source = { text: "Reynolds A et al. Carbohydrate quality and human health. Lancet, 2019", url: "https://doi.org/10.1016/S0140-6736(18)31809-9" };
const PREDIMED: Source = { text: "Estruch R et al. Mediterranean diet with olive oil or nuts (PREDIMED). NEJM, 2018", url: "https://doi.org/10.1056/NEJMoa1800389" };
const WASTYK: Source = { text: "Wastyk HC et al. Gut-microbiota-targeted diets modulate human immune status. Cell, 2021", url: "https://doi.org/10.1016/j.cell.2021.06.019" };
const OAT_CLAIM: Source = { text: "FDA health claim: soluble fiber from oats and barley and coronary heart disease (21 CFR 101.81)", url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81" };
const PULSES: Source = { text: "Ha V et al. Effect of dietary pulse intake on LDL cholesterol: a meta-analysis. CMAJ, 2014", url: "https://doi.org/10.1503/cmaj.131727" };
const NITRATE: Source = { text: "Siervo M et al. Inorganic nitrate and beetroot juice and blood pressure: a meta-analysis. J Nutr, 2013", url: "https://doi.org/10.3945/jn.112.170233" };
const FISH: Source = { text: "FDA/EPA: Advice about eating fish", url: "https://www.fda.gov/food/consumers/advice-about-eating-fish" };
const RIMM: Source = { text: "Rimm EB et al. Seafood long-chain n-3 fatty acids and cardiovascular disease. AHA science advisory, Circulation, 2018", url: "https://doi.org/10.1161/CIR.0000000000000574" };
const WARFARIN = "Large amounts of vitamin K can change how warfarin works. If you take it, keep your intake steady and tell your clinician.";
const CLINICIAN = "Pregnant, breastfeeding, on prescription medicine, or managing a health condition? Check with a clinician or pharmacist before using it as a remedy.";
const SUPPLEMENT = "Sold as a supplement, which the FDA doesn't check for purity or strength before sale. If you buy one, look for a USP or NSF seal.";

export const PANTRY: PantryItem[] = [
  // Herbs & roots
  {
    id: "burdock-root", name: "Burdock root", also: "gobo, Arctium lappa", cat: "herb", aisle: "Specialty & international", evidence: "Weak", hue: 28,
    summary: "A long, earthy root eaten as a vegetable in Japan and used in herbal traditions worldwide.",
    benefits: [
      "Rich in inulin, a prebiotic fiber that feeds gut bacteria, like other fiber-rich foods.",
      "Lab and animal studies show antioxidant compounds, but there are very few studies in people.",
      "Claims that it 'purifies the blood' or detoxes the body aren't backed by human research. Your liver and kidneys do that job.",
    ],
    tradition: "Used as a 'blood purifier' in Western herbalism and in traditional Chinese medicine, often in teas and tonics.",
    use: "Scrub (no need to peel), slice thin, and soak a few minutes so it doesn't darken. Stir-fry with carrot as kinpira gobo, add to soups, or simmer dried root as a tea.",
    cautions: [
      "Buy it, don't forage it. Wild burdock root can be confused with toxic plants like belladonna.",
      "May lower blood sugar. If you take diabetes medicine, watch your levels.",
      "Avoid if you're allergic to ragweed, daisies or chrysanthemums (same plant family).",
      CLINICIAN,
    ],
    find: "Japanese and Asian grocers (labelled gobo), health food stores, and some farmers markets in fall. Dried root and tea at herb shops.",
    sources: [HERBS_AT_A_GLANCE, FDC],
  },
  {
    id: "ginger", name: "Ginger", cat: "herb", aisle: "Produce", evidence: "Moderate", hue: 40,
    summary: "A spicy root with the best evidence of any kitchen herb, for nausea.",
    benefits: [
      "May ease nausea and vomiting in pregnancy, according to NCCIH's review of trials.",
      "Studied for nausea after surgery and during chemotherapy, with mixed results.",
      "Small trials on arthritis pain and menstrual cramps are promising but not conclusive.",
    ],
    tradition: "Used for digestion and colds in Ayurveda and traditional Chinese medicine for thousands of years.",
    use: "Grate fresh into stir-fries, dressings and soups, or steep sliced ginger in hot water for 10 minutes as tea.",
    cautions: ["Can cause heartburn or stomach upset in large amounts.", "Talk to your clinician before using ginger for nausea in pregnancy.", CLINICIAN],
    find: "Any grocery store's produce section. Look for firm roots with thin, shiny skin.",
    sources: [NCCIH("ginger", "Ginger")],
  },
  {
    id: "turmeric", name: "Turmeric", cat: "herb", aisle: "Herbs & spices", evidence: "Mixed", hue: 45,
    summary: "The golden spice in curry. Hugely popular, though the research is weaker than the hype.",
    benefits: [
      "Curcumin, its main compound, is studied for joint pain and inflammation, with mixed and mostly small trials.",
      "Curcumin is poorly absorbed on its own. Black pepper and fat increase absorption.",
      "As a spice in food, it's safe and flavorful. The case for high-dose supplements isn't settled.",
    ],
    tradition: "A staple of Ayurvedic medicine for skin, digestion and joints.",
    use: "Add to curries, lentils, rice, eggs and roasted vegetables with a pinch of black pepper and some oil.",
    cautions: [
      "Turmeric supplements have been linked to rare cases of liver injury (NCCIH). This hasn't been seen with turmeric in food.",
      "Supplements may interact with blood thinners and diabetes medicine.",
      SUPPLEMENT,
      CLINICIAN,
    ],
    find: "Spice aisle (ground). Fresh turmeric root at Indian and Asian grocers and many larger supermarkets.",
    sources: [NCCIH("turmeric", "Turmeric")],
  },
  {
    id: "garlic", name: "Garlic", cat: "herb", aisle: "Produce", evidence: "Mixed", hue: 50,
    summary: "A kitchen essential with small, real effects on blood pressure and cholesterol in some studies.",
    benefits: [
      "Some studies find small drops in blood pressure and cholesterol, but results vary (NCCIH).",
      "There's no good evidence that garlic prevents colds.",
    ],
    tradition: "Used across cultures for infections, heart health and stamina.",
    use: "Crush or chop, then let it sit 10 minutes before cooking. Use generously in sauces, beans, greens and dressings.",
    cautions: ["Garlic supplements can increase bleeding risk with blood thinners and before surgery.", "Can cause heartburn and, well, garlic breath.", CLINICIAN],
    find: "Every grocery store. Firm heads with tight skin.",
    sources: [NCCIH("garlic", "Garlic")],
  },
  {
    id: "cinnamon", name: "Cinnamon (Ceylon)", cat: "herb", aisle: "Herbs & spices", evidence: "Mixed", hue: 18,
    summary: "A warm spice studied for blood sugar, with inconsistent results.",
    benefits: ["Studies on blood sugar in type 2 diabetes conflict. It isn't a substitute for treatment (NCCIH).", "A good way to add sweetness and flavor without adding sugar."],
    use: "Sprinkle on oats, yogurt, coffee, roasted squash and stews.",
    cautions: [
      "Common cassia cinnamon contains coumarin, which in large amounts can harm the liver. Ceylon cinnamon has far less. Sprinkling it on food is fine; heaping spoonfuls every day aren't.",
      CLINICIAN,
    ],
    find: "Spice aisle; Ceylon is often labelled 'true cinnamon'. Health food stores and spice shops.",
    sources: [NCCIH("cinnamon", "Cinnamon")],
  },
  {
    id: "dandelion-greens", name: "Dandelion greens", cat: "herb", aisle: "Produce", evidence: "Weak", hue: 95,
    summary: "A bitter leafy green, rich in vitamins A and K.",
    benefits: [
      "Very nutrient-dense: lots of vitamin K and vitamin A, plus fiber (USDA).",
      "One small human study suggested a mild diuretic effect. That's all the human evidence there is.",
    ],
    tradition: "Used as a liver and digestive tonic in European and Chinese herbalism.",
    use: "Sauté with garlic and olive oil, or mix young leaves into salads to temper the bitterness.",
    cautions: [WARFARIN, "If you forage, avoid lawns, roadsides and anywhere that might be sprayed.", "Avoid if you're allergic to ragweed or daisies.", CLINICIAN],
    find: "Farmers markets in spring, Whole Foods-type stores, Italian and Asian grocers.",
    sources: [{ text: "Clare BA et al. The diuretic effect in human subjects of an extract of Taraxacum officinale. J Altern Complement Med, 2009", url: "https://doi.org/10.1089/acm.2008.0152" }, FDC],
  },
  {
    id: "nettle", name: "Stinging nettle", cat: "herb", aisle: "Specialty & international", evidence: "Weak", hue: 110,
    summary: "A wild green that loses its sting when cooked. Tastes like earthy spinach.",
    benefits: ["Nutritious as a cooked green.", "Studied for hay fever and enlarged prostate, with small and mixed results."],
    tradition: "A spring tonic in European folk medicine, often taken as tea.",
    use: "Blanch for a minute to remove the sting, then use like spinach in soup, pesto or eggs. Dried leaf makes a mild tea.",
    cautions: ["Raw leaves sting. Wear gloves when handling.", "May affect blood pressure, blood sugar and diuretic medicines.", CLINICIAN],
    find: "Farmers markets in spring; dried nettle leaf at herb shops and health food stores.",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "tulsi", name: "Holy basil", also: "tulsi", cat: "herb", aisle: "Tea", evidence: "Weak", hue: 120,
    summary: "A fragrant basil sacred in Hinduism, now popular as a relaxing tea.",
    benefits: ["A few small trials suggest it may help with stress, but they're small and short.", "A pleasant, caffeine-free tea."],
    tradition: "Revered in Ayurveda as an 'adaptogen' for stress and longevity.",
    use: "Steep as tea, alone or blended with green tea or ginger.",
    cautions: ["Avoid in pregnancy or if trying to conceive; animal studies raise questions.", CLINICIAN],
    find: "Tea aisle at health food stores; fresh at Indian grocers.",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "moringa", name: "Moringa leaf", cat: "herb", aisle: "Specialty & international", evidence: "Weak", hue: 100,
    summary: "A nutrient-dense leaf from a fast-growing tropical tree, usually sold as a powder.",
    benefits: ["The leaves are rich in vitamins and minerals.", "Human trials for blood sugar and other claims are small and early."],
    tradition: "Eaten as a vegetable and used medicinally in South Asia and Africa.",
    use: "Stir a little powder into smoothies, soups or dals. It's grassy and strong.",
    cautions: ["Avoid the root and bark, especially in pregnancy.", "May lower blood sugar and blood pressure.", SUPPLEMENT, CLINICIAN],
    find: "Health food stores and Indian or Filipino grocers (fresh leaves or drumstick pods).",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "sea-moss", name: "Sea moss", also: "Irish moss", cat: "herb", aisle: "Specialty & international", evidence: "Weak", hue: 170,
    summary: "A red seaweed that's popular online, with very little research in people.",
    benefits: ["Contains some minerals and fiber like other seaweeds.", "Popular claims about '92 minerals', immunity and thyroid health have little human research behind them."],
    tradition: "Used in Caribbean and Irish cooking, especially in drinks and puddings.",
    use: "Soak and blend into a gel to thicken smoothies or drinks, in small amounts.",
    cautions: [
      "Iodine content varies a lot and can be very high, which can upset your thyroid.",
      "Seaweed can carry heavy metals. Buy brands that publish lab testing.",
      "Ask your clinician first if you have a thyroid condition.",
    ],
    find: "Caribbean grocers and health food stores.",
    sources: [FDC],
  },
  {
    id: "ashwagandha", name: "Ashwagandha", cat: "herb", aisle: "Specialty & international", evidence: "Mixed", hue: 30,
    summary: "An Ayurvedic root sold mostly as a supplement for stress and sleep.",
    benefits: ["Some small, short trials suggest it may reduce stress and improve sleep. Longer, larger studies are lacking (NCCIH)."],
    tradition: "One of the most important herbs in Ayurveda, used as a rejuvenating tonic.",
    use: "Mostly sold as capsules or powder. If you're considering it, talk to a clinician first.",
    cautions: [
      "Linked to rare cases of liver injury (NCCIH).",
      "Avoid in pregnancy. May affect thyroid hormone levels and interact with sedatives and immune-suppressing medicine.",
      SUPPLEMENT,
      CLINICIAN,
    ],
    find: "Health food stores and supplement aisles.",
    sources: [NCCIH("ashwagandha", "Ashwagandha")],
  },
  {
    id: "elderberry", name: "Elderberry", cat: "herb", aisle: "Specialty & international", evidence: "Weak", hue: 280,
    summary: "Dark purple berries made into syrups, popular for colds and flu.",
    benefits: ["A few small studies suggest it may shorten flu or cold symptoms, but the evidence is limited (NCCIH)."],
    tradition: "A European folk remedy for colds and fevers.",
    use: "Store-bought syrup, or cooked berries in jam or tea.",
    cautions: ["Raw berries, leaves and stems can cause nausea and vomiting. Always cook elderberries.", CLINICIAN],
    find: "Pharmacies and health food stores (syrup); dried berries at herb shops.",
    sources: [NCCIH("european-elder", "European Elder")],
  },

  // Teas
  {
    id: "chamomile", name: "Chamomile tea", cat: "tea", aisle: "Tea", evidence: "Weak", hue: 48,
    summary: "The classic bedtime tea. A warm, caffeine-free ritual with modest evidence.",
    benefits: ["Small studies on sleep and anxiety show modest or mixed results (NCCIH).", "A warm caffeine-free drink is a good wind-down cue in itself."],
    use: "Steep 5 minutes, covered, about an hour before bed.",
    cautions: ["Avoid if you're allergic to ragweed or daisies.", "May interact with some medicines, including warfarin and cyclosporine.", CLINICIAN],
    find: "The tea aisle of any grocery store.",
    sources: [NCCIH("chamomile", "Chamomile")],
  },
  {
    id: "peppermint", name: "Peppermint tea", cat: "tea", aisle: "Tea", evidence: "Moderate", hue: 150,
    summary: "Refreshing and caffeine-free. Peppermint oil capsules have real evidence for IBS.",
    benefits: ["Enteric-coated peppermint oil capsules may ease irritable bowel syndrome symptoms (NCCIH). The tea is much weaker, but many people find it soothing after meals."],
    use: "Steep fresh or dried leaves 5 to 7 minutes. Good hot or iced.",
    cautions: ["Can worsen heartburn and acid reflux.", CLINICIAN],
    find: "The tea aisle; fresh mint in produce.",
    sources: [NCCIH("peppermint-oil", "Peppermint Oil")],
  },
  {
    id: "green-tea", name: "Green tea", cat: "tea", aisle: "Tea", evidence: "Mixed", hue: 90,
    summary: "A gentler caffeine source, with L-theanine for a gentler lift.",
    benefits: [
      "Has about a third to half the caffeine of coffee, plus L-theanine, which may smooth the jitters.",
      "Observational studies link it to better heart health, but trials haven't proven it prevents disease (NCCIH).",
    ],
    use: "Steep in water just below boiling (about 80 °C / 175 °F) for 2 to 3 minutes so it isn't bitter. Have it before noon if you're sensitive to caffeine.",
    cautions: ["Concentrated green tea extract supplements have been linked to liver injury. The tea itself hasn't.", "Counts toward your daily caffeine (FDA suggests up to 400 mg a day for most adults).", CLINICIAN],
    find: "Tea aisle; loose leaf at tea shops and Asian grocers.",
    sources: [NCCIH("green-tea", "Green Tea")],
  },
  {
    id: "hibiscus", name: "Hibiscus tea", cat: "tea", aisle: "Tea", evidence: "Mixed", hue: 345,
    summary: "Tart, ruby-red and caffeine-free. Small trials suggest a modest effect on blood pressure.",
    benefits: ["Several small trials found modest drops in blood pressure in people with mildly high blood pressure. It isn't a substitute for medicine."],
    tradition: "Drunk as agua de jamaica in Mexico and as bissap or sobolo in West Africa.",
    use: "Steep dried flowers 5 to 10 minutes. Delicious iced with lime and a little honey.",
    cautions: ["May add to the effect of blood pressure medicine.", "Avoid in pregnancy.", CLINICIAN],
    find: "Latin American and African grocers (flor de jamaica) and the tea aisle.",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "rooibos", name: "Rooibos tea", cat: "tea", aisle: "Tea", evidence: "Weak", hue: 15,
    summary: "A naturally caffeine-free red tea from South Africa. Good for evenings.",
    benefits: ["Caffeine-free and low in tannins.", "Antioxidant claims come mostly from lab studies; human research is limited."],
    use: "Steep 5 minutes in boiling water. Good with milk.",
    cautions: ["Generally considered safe as a drink."],
    find: "The tea aisle of most grocery stores.",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "lemon-balm", name: "Lemon balm tea", cat: "tea", aisle: "Tea", evidence: "Weak", hue: 75,
    summary: "A lemony mint-family herb, used for relaxation and sleep.",
    benefits: ["A few small trials suggest relaxing effects, often in blends with valerian. Better studies are needed."],
    use: "Steep fresh or dried leaves 5 to 10 minutes. It's easy to grow in a pot.",
    cautions: ["May add to the effect of sedatives and thyroid medicine.", CLINICIAN],
    find: "Health food stores and herb shops; plants at garden centers.",
    sources: [HERBS_AT_A_GLANCE],
  },
  {
    id: "valerian", name: "Valerian root tea", cat: "tea", aisle: "Tea", evidence: "Mixed", hue: 260,
    summary: "An old sleep remedy. Strong smell, mixed evidence.",
    benefits: ["Studies on sleep are inconsistent; some people report it helps them fall asleep (NCCIH)."],
    use: "Steep 10 minutes, about an hour before bed. Often blended with chamomile or lemon balm.",
    cautions: ["Don't combine with alcohol, sleep aids or other sedatives, or drive after taking it.", "Not recommended in pregnancy or for children under 3.", CLINICIAN],
    find: "Tea aisle (in 'sleep' blends) and health food stores.",
    sources: [NCCIH("valerian", "Valerian")],
  },

  // Produce
  {
    id: "leafy-greens", name: "Kale and collards", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 125,
    summary: "Dark leafy greens: fiber, folate, vitamin K and nitrate.",
    benefits: ["Dietary nitrate from leafy greens and beets modestly lowers blood pressure in trials.", "Higher vegetable intake is linked with lower heart disease risk in large cohorts."],
    use: "Massage raw kale with lemon and olive oil, or braise collards with garlic and beans.",
    cautions: [WARFARIN],
    find: "Any produce section; farmers markets.",
    sources: [NITRATE, FDC],
  },
  {
    id: "spinach", name: "Spinach", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 130,
    summary: "An easy green that disappears into almost anything.",
    benefits: ["A source of folate, vitamin K, magnesium and nitrate.", "Nitrate-rich vegetables modestly lower blood pressure."],
    use: "Wilt into eggs, pasta, soups and smoothies.",
    cautions: ["High in oxalate. If you've had calcium-oxalate kidney stones, ask about portion sizes.", WARFARIN],
    find: "Any produce section.",
    sources: [NITRATE, FDC],
  },
  {
    id: "broccoli", name: "Broccoli", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 115,
    summary: "A cruciferous vegetable with fiber, vitamin C and sulforaphane.",
    benefits: ["Cruciferous vegetables are linked to lower risk of some diseases in observational studies.", "Very high in vitamin C and fiber."],
    use: "Roast hot until the edges char, or steam lightly. Chopping it and waiting a few minutes before cooking preserves sulforaphane.",
    cautions: ["Can cause gas as you increase fiber. Build up slowly."],
    find: "Any produce section, fresh or frozen (frozen is just as good).",
    sources: [FDC],
  },
  {
    id: "beets", name: "Beets", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 340,
    summary: "Sweet, earthy and one of the richest food sources of nitrate.",
    benefits: ["Beetroot juice modestly lowers blood pressure in trials (meta-analysis).", "Studied for exercise endurance, with some positive results."],
    use: "Roast whole, then slip off the skins. Grate raw into salads.",
    cautions: ["Can turn urine pink. It's harmless.", "High in oxalate if you're prone to kidney stones."],
    find: "Any produce section; pre-cooked beets in the refrigerated aisle.",
    sources: [NITRATE],
  },
  {
    id: "sweet-potato", name: "Sweet potato", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 22,
    summary: "Fiber, potassium and lots of beta-carotene.",
    benefits: ["One medium sweet potato covers more than a day's vitamin A, as beta-carotene (USDA).", "Fiber-rich whole foods are linked to lower disease risk."],
    use: "Roast in wedges, bake whole, or mash with a little olive oil and salt. Eat the skin for extra fiber.",
    cautions: ["None for most people."],
    find: "Any produce section.",
    sources: [FDC, REYNOLDS],
  },
  {
    id: "blueberries", name: "Blueberries", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 235,
    summary: "Fiber and anthocyanins. Frozen counts.",
    benefits: ["Higher berry and flavonoid intake is linked with lower type 2 diabetes and heart risk in large observational studies.", "A good source of fiber and vitamin C."],
    use: "On oats or yogurt, in smoothies, or straight from the freezer.",
    cautions: ["None for most people."],
    find: "Produce section, or frozen (often cheaper and just as nutritious).",
    sources: [FDC],
  },
  {
    id: "avocado", name: "Avocado", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 85,
    summary: "Creamy, filling, and full of fiber and unsaturated fat.",
    benefits: ["About 10 grams of fiber per avocado (USDA).", "Swapping saturated fats for unsaturated fats like these lowers LDL cholesterol."],
    use: "On toast, in salads and bowls, or blended into dressings.",
    cautions: ["Calorie-dense; enjoy it in place of other fats, not on top of them."],
    find: "Any produce section. Ripe ones give slightly to gentle pressure.",
    sources: [FDC],
  },
  {
    id: "shiitake", name: "Shiitake mushrooms", cat: "produce", aisle: "Produce", evidence: "Weak", hue: 25,
    summary: "Savory, meaty mushrooms with a small amount of immune research.",
    benefits: ["One small trial found changes in immune markers after daily shiitake. It's early research.", "Adds deep savory flavor, so you need less salt."],
    tradition: "Valued for longevity in Japanese and Chinese food traditions.",
    use: "Remove tough stems, then sauté, roast or simmer in broths. Dried shiitake make a rich stock.",
    cautions: ["Cook them well. Raw or undercooked shiitake can cause an itchy, streaky rash in some people."],
    find: "Produce section; dried at Asian grocers.",
    sources: [FDC],
  },

  // Grains & beans
  {
    id: "oats", name: "Oats", cat: "grain", aisle: "Grains & beans", evidence: "Strong", hue: 38,
    summary: "One of the few foods with an FDA-authorized heart health claim.",
    benefits: [
      "Beta-glucan, the soluble fiber in oats, lowers LDL cholesterol. The FDA allows a heart-health claim at 3 g of beta-glucan a day (about 1.5 cups of cooked oatmeal).",
      "High-fiber diets (25 to 29 g a day) are linked to 15 to 30% lower risk of heart disease, stroke, type 2 diabetes and colorectal cancer (Lancet, 2019).",
    ],
    use: "Overnight oats, porridge with fruit and nuts, or blended into pancakes. Steel-cut and rolled are best; skip the sugary packets.",
    cautions: ["If you have celiac disease, buy oats labelled gluten-free."],
    find: "Cereal or bulk aisle at any grocery store.",
    sources: [OAT_CLAIM, REYNOLDS],
  },
  {
    id: "barley", name: "Barley", cat: "grain", aisle: "Grains & beans", evidence: "Strong", hue: 42,
    summary: "A chewy whole grain with the same cholesterol-lowering fiber as oats.",
    benefits: ["Covered by the same FDA beta-glucan health claim as oats.", "A whole grain high in fiber."],
    use: "Simmer in soups and stews, or cook like rice for grain bowls.",
    cautions: ["Contains gluten."],
    find: "Rice and grains aisle. Hulled barley is the whole grain; pearled is partly refined but still good.",
    sources: [OAT_CLAIM],
  },
  {
    id: "quinoa", name: "Quinoa", cat: "grain", aisle: "Grains & beans", evidence: "Moderate", hue: 50,
    summary: "A quick-cooking whole grain with complete protein.",
    benefits: ["Contains all essential amino acids, plus fiber and magnesium.", "Whole grains in place of refined grains are linked to lower disease risk."],
    use: "Rinse well, then simmer 15 minutes. Use for bowls, salads and breakfast porridge.",
    cautions: ["Rinse it to remove its bitter coating (saponins)."],
    find: "Rice and grains aisle or bulk bins.",
    sources: [REYNOLDS, FDC],
  },
  {
    id: "lentils", name: "Lentils", cat: "grain", aisle: "Grains & beans", evidence: "Strong", hue: 20,
    summary: "Fast-cooking, cheap, and packed with protein and fiber.",
    benefits: ["About one serving of beans, peas or lentils a day lowered LDL cholesterol in a meta-analysis of trials.", "Legumes are a daily staple in every Blue Zone."],
    use: "Red lentils melt into soups and dal in 20 minutes; green and black hold their shape for salads.",
    cautions: ["Increase slowly if you're not used to fiber, and drink water with it."],
    find: "Grains and beans aisle, dried or canned.",
    sources: [PULSES, REYNOLDS],
  },
  {
    id: "chickpeas", name: "Chickpeas", cat: "grain", aisle: "Grains & beans", evidence: "Strong", hue: 35,
    summary: "The base of hummus, falafel and countless stews.",
    benefits: ["Pulses lower LDL cholesterol in trials.", "High in fiber, protein and folate."],
    use: "Roast canned chickpeas until crisp, blend into hummus, or simmer in tomato stews.",
    cautions: ["Rinse canned chickpeas to reduce sodium."],
    find: "Canned or dried in the beans aisle.",
    sources: [PULSES],
  },
  {
    id: "black-beans", name: "Black beans", cat: "grain", aisle: "Grains & beans", evidence: "Strong", hue: 270,
    summary: "Fiber-rich, satisfying, and cheap.",
    benefits: ["Pulses lower LDL cholesterol in trials.", "About 15 grams of fiber per cooked cup (USDA)."],
    use: "Tacos, burrito bowls, soups and veggie burgers.",
    cautions: ["Rinse canned beans to reduce sodium."],
    find: "Canned or dried in the beans aisle.",
    sources: [PULSES, FDC],
  },

  // Nuts & seeds
  {
    id: "walnuts", name: "Walnuts", cat: "nut", aisle: "Nuts & seeds", evidence: "Moderate", hue: 32,
    summary: "The nut highest in plant omega-3 (ALA).",
    benefits: ["In PREDIMED, a Mediterranean diet with a daily handful of mixed nuts (half walnuts) cut major heart events by about 30% versus a low-fat diet.", "Rich in ALA, a plant omega-3."],
    use: "A small handful (about 30 g / 1 oz) on oats, salads or as a snack.",
    cautions: ["Tree nut allergy."],
    find: "Baking or snack aisle and bulk bins. Store in the fridge so they don't go rancid.",
    sources: [PREDIMED],
  },
  {
    id: "almonds", name: "Almonds", cat: "nut", aisle: "Nuts & seeds", evidence: "Moderate", hue: 28,
    summary: "Protein, fiber, vitamin E and magnesium in one handful.",
    benefits: ["Part of the nut mix in PREDIMED.", "A good source of vitamin E and magnesium."],
    use: "A small handful as a snack, or almond butter on fruit.",
    cautions: ["Tree nut allergy."],
    find: "Snack aisle and bulk bins.",
    sources: [PREDIMED, FDC],
  },
  {
    id: "pumpkin-seeds", name: "Pumpkin seeds", also: "pepitas", cat: "nut", aisle: "Nuts & seeds", evidence: "Moderate", hue: 80,
    summary: "One of the richest food sources of magnesium.",
    benefits: ["About 150 mg of magnesium per ounce, more than a third of the daily need for most adults (NIH).", "Food sources of magnesium have no upper limit; the 350 mg limit applies only to supplements."],
    use: "Toast in a dry pan and sprinkle on salads, soups and oats.",
    cautions: ["None for most people."],
    find: "Snack aisle, bulk bins, and Latin grocers (pepitas).",
    sources: [{ text: "NIH Office of Dietary Supplements: Magnesium fact sheet", url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/" }],
  },
  {
    id: "chia", name: "Chia seeds", cat: "nut", aisle: "Nuts & seeds", evidence: "Moderate", hue: 210,
    summary: "Tiny seeds with a big dose of fiber.",
    benefits: ["About 10 grams of fiber per ounce (USDA).", "Contain ALA, a plant omega-3."],
    use: "Stir into yogurt or oats, or make chia pudding by soaking overnight in milk.",
    cautions: ["Always soak chia or eat it with plenty of liquid. Dry seeds swell and have caused choking.", "Increase slowly as with any high-fiber food."],
    find: "Baking aisle, health food section and bulk bins.",
    sources: [FDC],
  },
  {
    id: "flaxseed", name: "Ground flaxseed", cat: "nut", aisle: "Nuts & seeds", evidence: "Moderate", hue: 36,
    summary: "Fiber and omega-3, with a trial showing lower blood pressure.",
    benefits: ["In a six-month trial, 30 g of ground flaxseed a day lowered blood pressure in people with peripheral artery disease.", "Rich in fiber and ALA."],
    use: "Buy it ground (or grind it). Whole seeds pass straight through. Add to oats, smoothies and baking.",
    cautions: ["Drink water with it.", "May affect blood sugar and blood thinners in large amounts.", CLINICIAN],
    find: "Baking or health food aisle. Keep ground flax in the fridge.",
    sources: [NCCIH("flaxseed-and-flaxseed-oil", "Flaxseed and Flaxseed Oil"), { text: "Rodriguez-Leyva D et al. Potent antihypertensive action of dietary flaxseed. Hypertension, 2013", url: "https://doi.org/10.1161/HYPERTENSIONAHA.113.01070" }],
  },

  // Oils & vinegar
  {
    id: "evoo", name: "Extra virgin olive oil", cat: "fat", aisle: "Oils & vinegar", evidence: "Strong", hue: 70,
    summary: "The backbone of the Mediterranean diet, backed by a large trial.",
    benefits: ["In PREDIMED, a Mediterranean diet with about 4 tablespoons a day of extra virgin olive oil cut major heart events by about 30% versus a low-fat diet."],
    use: "Your everyday oil for dressings, roasting and sautéing. It's fine for normal home cooking temperatures.",
    cautions: ["Calorie-dense. Use it in place of butter and other fats."],
    find: "Oils aisle. Look for 'extra virgin', a harvest date, and a dark bottle.",
    sources: [PREDIMED],
  },
  {
    id: "acv", name: "Apple cider vinegar", cat: "fat", aisle: "Oils & vinegar", evidence: "Weak", hue: 30,
    summary: "Great in dressings. The health claims are mostly small studies.",
    benefits: ["Small studies show vinegar with a meal can slightly blunt the blood sugar rise afterwards.", "Weight-loss and 'detox' claims aren't well supported."],
    use: "In salad dressings, pickles and marinades. If you drink it, dilute it well and use a straw.",
    cautions: [
      "Undiluted vinegar can burn your throat and wear away tooth enamel.",
      "Can lower potassium, especially with diuretics or insulin.",
      CLINICIAN,
    ],
    find: "Vinegar aisle. 'With the mother' is unfiltered; it isn't proven to be healthier.",
    sources: [HERBS_AT_A_GLANCE],
  },

  // Fermented
  {
    id: "yogurt", name: "Plain yogurt", cat: "ferment", aisle: "Fridge & ferments", evidence: "Moderate", hue: 210,
    summary: "Protein, calcium and live cultures.",
    benefits: ["In 2024 the FDA allowed a qualified claim that eating yogurt regularly may reduce type 2 diabetes risk (limited evidence).", "In a 10-week trial, a diet high in fermented foods increased gut microbiome diversity and lowered inflammation markers."],
    use: "With fruit and oats, in dressings and marinades, or instead of sour cream.",
    cautions: ["Choose plain; flavored yogurts can have as much sugar as dessert.", "Look for 'live and active cultures' on the label."],
    find: "Dairy aisle. Greek yogurt has more protein.",
    sources: [WASTYK],
  },
  {
    id: "kefir", name: "Kefir", cat: "ferment", aisle: "Fridge & ferments", evidence: "Weak", hue: 200,
    summary: "A drinkable fermented milk with many strains of microbes.",
    benefits: ["Part of the fermented-food diet that raised microbiome diversity in the 2021 Stanford trial.", "Usually well tolerated by people with lactose intolerance."],
    use: "Drink plain, or blend into smoothies.",
    cautions: ["Choose plain to avoid added sugar."],
    find: "Dairy aisle near the yogurt.",
    sources: [WASTYK, NCCIH("probiotics-what-you-need-to-know", "Probiotics")],
  },
  {
    id: "kimchi", name: "Kimchi", cat: "ferment", aisle: "Fridge & ferments", evidence: "Weak", hue: 5,
    summary: "Spicy fermented cabbage, a Korean staple.",
    benefits: ["A fermented food with live microbes; part of the 2021 Stanford trial diet.", "Research on specific health effects is early."],
    use: "A spoonful beside rice, eggs, noodles or grain bowls.",
    cautions: ["High in sodium. A little goes a long way if you watch salt."],
    find: "Refrigerated section of most supermarkets and Korean grocers. Live cultures are only in refrigerated, unpasteurized kimchi.",
    sources: [WASTYK],
  },
  {
    id: "sauerkraut", name: "Sauerkraut", cat: "ferment", aisle: "Fridge & ferments", evidence: "Weak", hue: 55,
    summary: "Fermented cabbage. Only the refrigerated kind has live cultures.",
    benefits: ["A fermented food with live microbes, when unpasteurized.", "Easy to make at home with cabbage and salt."],
    use: "On sandwiches, sausages, grain bowls and salads.",
    cautions: ["High in sodium.", "Shelf-stable jars are pasteurized, so the microbes are gone."],
    find: "Refrigerated section, near the pickles or deli.",
    sources: [WASTYK],
  },
  {
    id: "miso", name: "Miso", cat: "ferment", aisle: "Fridge & ferments", evidence: "Weak", hue: 35,
    summary: "Fermented soybean paste that adds deep savory flavor.",
    benefits: ["A fermented food, but cooking or boiling it kills the live microbes.", "Adds savory depth with a small amount."],
    use: "Stir into soup after taking it off the heat, or whisk into dressings and glazes.",
    cautions: ["Very high in sodium."],
    find: "Refrigerated section of supermarkets and Asian grocers.",
    sources: [FDC],
  },
  {
    id: "kombucha", name: "Kombucha", cat: "ferment", aisle: "Fridge & ferments", evidence: "Weak", hue: 25,
    summary: "Fizzy fermented tea. Popular, with almost no human research.",
    benefits: ["A lower-sugar alternative to soda.", "Health claims are based mainly on lab and animal studies."],
    use: "As a treat or soda replacement.",
    cautions: ["Contains a little alcohol and caffeine.", "Home brewing can grow harmful microbes; follow tested methods.", "Not recommended in pregnancy or for people with weakened immune systems."],
    find: "Refrigerated drinks section.",
    sources: [HERBS_AT_A_GLANCE],
  },

  // Seafood
  {
    id: "salmon", name: "Salmon", cat: "sea", aisle: "Seafood", evidence: "Moderate", hue: 12,
    summary: "Omega-3 rich fish. The American Heart Association recommends two servings of fish a week.",
    benefits: ["Eating fish once or twice a week is linked to lower risk of heart disease death (AHA science advisory).", "Rich in EPA and DHA omega-3s, protein and vitamin D."],
    use: "Bake or pan-sear 10 to 12 minutes. Canned salmon is cheaper and works in patties and salads.",
    cautions: ["Salmon is low in mercury and on the FDA's 'best choices' list."],
    find: "Seafood counter, freezer or canned aisle.",
    sources: [RIMM, FISH],
  },
  {
    id: "sardines", name: "Sardines", cat: "sea", aisle: "Seafood", evidence: "Moderate", hue: 205,
    summary: "Small, cheap, low in mercury, and loaded with omega-3s and calcium.",
    benefits: ["Among the richest sources of omega-3s.", "Eaten with their soft bones, they're a good calcium source."],
    use: "On toast with lemon, mashed into pasta, or on salads.",
    cautions: ["Low in mercury (FDA 'best choices'). Canned can be salty; check labels."],
    find: "Canned fish aisle.",
    sources: [RIMM, FISH],
  },

  // Other
  {
    id: "raw-honey", name: "Raw honey", cat: "other", aisle: "Other", evidence: "Moderate", hue: 42,
    summary: "A sweetener with a real use: soothing coughs in children over one.",
    benefits: ["A Cochrane review found honey may ease cough symptoms in children better than no treatment."],
    use: "In tea or warm water with lemon. It's still sugar, so use it like sugar.",
    cautions: ["Never give honey to babies under 12 months. It can cause infant botulism.", "It's still sugar, so be mindful if you're managing blood sugar."],
    find: "Baking aisle; local honey at farmers markets.",
    sources: [{ text: "Oduwole O et al. Honey for acute cough in children. Cochrane Database Syst Rev, 2018", url: "https://doi.org/10.1002/14651858.CD007094.pub5" }],
  },
  {
    id: "dark-chocolate", name: "Dark chocolate (70%+)", cat: "other", aisle: "Other", evidence: "Mixed", hue: 20,
    summary: "A treat with interesting, but mixed, heart research.",
    benefits: ["In the COSMOS trial, cocoa flavanol supplements didn't significantly reduce overall heart events, though deaths from heart disease were lower. Chocolate bars contain far less flavanol, plus sugar."],
    use: "A square or two, savored slowly.",
    cautions: ["Some dark chocolate bars have tested high for lead and cadmium. Vary brands and keep portions small."],
    find: "Candy or baking aisle.",
    sources: [{ text: "Sesso HD et al. Cocoa flavanol supplementation and cardiovascular disease (COSMOS). Am J Clin Nutr, 2022", url: "https://doi.org/10.1093/ajcn/nqac055" }],
  },
  {
    id: "epsom-salt", name: "Epsom salt", also: "magnesium sulfate", cat: "other", aisle: "Other", evidence: "None", hue: 195,
    summary: "A bath soak. The warm bath helps; magnesium through the skin isn't proven.",
    benefits: [
      "There's no good evidence that your skin absorbs meaningful magnesium from a bath (Nutrients, 2017 review).",
      "A warm bath 1 to 2 hours before bed can help you fall asleep, salt or no salt.",
    ],
    use: "Dissolve a cup or two in a warm bath if you enjoy it. Don't drink it unless a clinician tells you to; it's a strong laxative.",
    cautions: ["If you have diabetes or nerve damage in your feet, ask before long foot soaks.", "Avoid on broken skin."],
    find: "Pharmacy aisle.",
    sources: [{ text: "Gröber U et al. Myth or reality: transdermal magnesium? Nutrients, 2017", url: "https://doi.org/10.3390/nu9080813" }],
  },

  {
    id: "eggs", name: "Eggs", cat: "other", aisle: "Fridge & ferments", evidence: "Mixed", hue: 48,
    summary: "A cheap, complete protein. Experts still weigh their cholesterol in different ways.",
    benefits: [
      "A source of protein, choline and vitamin A (USDA).",
      "The American Heart Association says healthy people can fit up to one whole egg a day into a heart-healthy pattern. Studies and guidelines don't fully agree, so the evidence here is mixed.",
    ],
    use: "Boil, poach or scramble with vegetables. Pair with whole-grain toast, beans or greens.",
    cautions: [
      "Egg is a common allergen, especially in children.",
      "People with diabetes, high cholesterol or heart failure risk should ask a clinician how many eggs suit them (AHA).",
      "Cook until the white and yolk are firm if you are pregnant, older, or have a weakened immune system.",
    ],
    find: "Refrigerated dairy case. Check the date on the carton and skip cracked eggs.",
    sources: [
      { text: "Carson JAS et al. Dietary cholesterol and cardiovascular risk: an AHA science advisory. Circulation, 2020", url: "https://doi.org/10.1161/CIR.0000000000000743" },
      { text: "American Heart Association: dietary cholesterol and cardiovascular risk (commentary)", url: "https://professional.heart.org/en/science-news/dietary-cholesterol-and-cardiovascular-risk/commentary" },
    ],
  },
  {
    id: "lemons", name: "Lemons", cat: "produce", aisle: "Produce", evidence: "Weak", hue: 55,
    summary: "A bright, sour fruit that brings vitamin C and lots of flavor.",
    benefits: [
      "Citrus fruits are a good source of vitamin C, which the body uses to make collagen and to absorb iron from plant foods (NIH).",
      "Juice or zest can add flavor to food with less need for salt. There is little research on lemons themselves.",
    ],
    use: "Squeeze over greens, fish, beans and soups, or add zest to grains and dressings.",
    cautions: [
      "The acid can wear tooth enamel. Rinse with water after sipping lemon water.",
      "Citrus can sting mouth sores or worsen heartburn for some people.",
      "Squeezing lemon on skin and then sitting in strong sun can cause a rash.",
    ],
    find: "Produce section. Heavy, firm fruit with smooth skin gives the most juice.",
    sources: [
      { text: "NIH Office of Dietary Supplements: Vitamin C fact sheet for consumers", url: "https://ods.od.nih.gov/factsheets/VitaminC-Consumer/" },
    ],
  },
  {
    id: "onions", name: "Onions", cat: "produce", aisle: "Produce", evidence: "Weak", hue: 30,
    summary: "A kitchen base for countless dishes, with fiber and plant compounds.",
    benefits: [
      "Adds flavor and a little fiber to vegetables, beans and grains, so plant-based meals taste good.",
      "Onions contain flavonoids such as quercetin. Evidence for health effects in people is limited.",
    ],
    use: "Slowly cook in a little oil until soft and sweet for a base, or slice raw into salads and sandwiches.",
    cautions: [
      "Can trigger heartburn or gas, and are high in FODMAPs, which bother some people with IBS.",
      "Dogs and cats should not eat onions.",
    ],
    find: "Produce section, sold loose or in bags. Choose dry, firm bulbs with no soft spots.",
    sources: [
      { text: "USDA FoodData Central (nutrient values)", url: "https://fdc.nal.usda.gov/" },
    ],
  },
  {
    id: "carrots", name: "Carrots", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 28,
    summary: "A sweet, crunchy root rich in beta-carotene.",
    benefits: [
      "Beta-carotene is turned into vitamin A, which supports vision, immune function and growth (NIH).",
      "Higher vegetable intake is linked to lower heart disease and early death in large observational studies. That shows a link, not proof.",
    ],
    use: "Eat raw with hummus, roast until caramelized, or grate into slaws and soups. A little oil helps you absorb carotenoids.",
    cautions: [
      "Very large amounts over weeks can tint skin orange. It is harmless and fades.",
      "Whole raw carrot is a choking risk for young children. Cook or grate it.",
      "Some people with birch pollen allergy react to raw carrot.",
    ],
    find: "Produce section, or frozen and canned. Bagged baby carrots are handy.",
    sources: [
      { text: "NIH Office of Dietary Supplements: Vitamin A and carotenoids fact sheet for consumers", url: "https://ods.od.nih.gov/factsheets/VitaminA-Consumer/" },
      { text: "Aune D et al. Fruit and vegetable intake and risk of cardiovascular disease, cancer and all-cause mortality. Int J Epidemiol, 2017", url: "https://doi.org/10.1093/ije/dyw319" },
    ],
  },
  {
    id: "brown-rice", name: "Brown rice", cat: "grain", aisle: "Grains & beans", evidence: "Moderate", hue: 36,
    summary: "A whole-grain rice with more fiber than white rice.",
    benefits: [
      "Whole grains in place of refined grains are linked to lower risk of heart disease, type 2 diabetes and bowel cancer in large reviews.",
      "Keeps the bran and germ, so it has more fiber and magnesium than white rice (USDA).",
    ],
    use: "Simmer 40 to 45 minutes, or batch-cook and freeze. Use in bowls, stir-fries and soups.",
    cautions: [
      "Rice can carry inorganic arsenic from soil and water. EFSA suggests rinsing it and cooking it in plenty of water, then draining. Vary your grains, especially for young children.",
      "Cool and refrigerate leftover rice quickly, and reheat until steaming hot.",
    ],
    find: "Rice and grains aisle or bulk bins. Quick-cook versions save time.",
    sources: [
      { text: "Reynolds A et al. Carbohydrate quality and human health. Lancet, 2019", url: "https://doi.org/10.1016/S0140-6736(18)31809-9" },
      { text: "EFSA: Dietary exposure to inorganic arsenic in the European population", url: "https://www.efsa.europa.eu/de/efsajournal/pub/3597" },
    ],
  },
  {
    id: "tofu", name: "Tofu", also: "bean curd, soy", cat: "other", aisle: "Fridge & ferments", evidence: "Moderate", hue: 52,
    summary: "A mild soy protein that takes on any flavor.",
    benefits: [
      "Eating tofu and other soy foods is linked with lower heart disease risk in large cohorts. Harvard experts note it helps most when it replaces red or processed meat.",
      "A plant source of protein, and often calcium when set with calcium salts (check the label).",
    ],
    use: "Press firm tofu, then pan-fry, bake or crumble into scrambles. Blend silken tofu into sauces and smoothies.",
    cautions: [
      "Soy is a major allergen.",
      "If you take thyroid medicine, ask your clinician about soy timing.",
      "Packaged tofu is perishable. Keep it chilled and use it by the date.",
    ],
    find: "Refrigerated produce or deli area, and shelf-stable silken boxes in the Asian foods aisle.",
    sources: [
      { text: "Harvard T.H. Chan School of Public Health: Is tofu healthy?", url: "https://hsph.harvard.edu/news/is-tofu-healthy-yes-says-harvard-chan-expert/" },
    ],
  },
  {
    id: "tomatoes", name: "Tomatoes", cat: "produce", aisle: "Produce", evidence: "Weak", hue: 5,
    summary: "Juicy and rich in lycopene, a red plant pigment.",
    benefits: [
      "Higher lycopene intake and blood levels are linked to lower stroke risk in observational studies. Trials mostly measure markers like blood pressure, not heart attacks.",
      "A good source of vitamin C and potassium (USDA).",
    ],
    use: "Cooking with a little olive oil helps you absorb lycopene. Roast, simmer into sauce, or slice fresh.",
    cautions: [
      "Acidic, so can worsen reflux for some people.",
      "Canned tomatoes and sauces can be high in sodium. Look for no-salt-added.",
      "Rarely an allergen, and can cause mouth itching in people with pollen allergy.",
    ],
    find: "Produce section, or canned, jarred and paste year-round.",
    sources: [
      { text: "Lycopene and tomato and risk of cardiovascular diseases: a systematic review and meta-analysis (Northumbria University)", url: "https://researchportal.northumbria.ac.uk/en/publications/lycopene-and-tomato-and-risk-of-cardiovascular-diseases-a-systema/" },
      { text: "USDA FoodData Central (nutrient values)", url: "https://fdc.nal.usda.gov/" },
    ],
  },
  {
    id: "cabbage", name: "Cabbage", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 120,
    summary: "A sturdy, low-cost cruciferous vegetable with fiber and vitamins C and K.",
    benefits: [
      "Cruciferous vegetables are linked to lower risk of heart disease and early death in observational studies.",
      "A source of fiber, vitamin C and vitamin K (USDA).",
    ],
    use: "Shred raw into slaw, sauté, braise, or ferment into sauerkraut. It keeps well in the fridge for weeks.",
    cautions: [
      "Rich in vitamin K. If you take warfarin, tell your clinician and keep your intake steady.",
      "Can cause gas or bloating. Build up slowly.",
      "Very large amounts of raw cruciferous vegetables may affect thyroid function in people with low iodine intake. Ask a clinician if you have a thyroid condition.",
    ],
    find: "Produce section all year. Choose heavy heads with tight leaves.",
    sources: [
      { text: "Aune D et al. Fruit and vegetable intake and risk of cardiovascular disease, cancer and all-cause mortality. Int J Epidemiol, 2017", url: "https://doi.org/10.1093/ije/dyw319" },
      { text: "NIH Office of Dietary Supplements: Vitamin K fact sheet for consumers", url: "https://ods.od.nih.gov/factsheets/vitaminK-Consumer?print=1" },
    ],
  },
  {
    id: "frozen-vegetables", name: "Frozen vegetables", cat: "produce", aisle: "Other", evidence: "Moderate", hue: 150,
    summary: "Picked and frozen quickly, so they keep well and are ready when you are.",
    benefits: [
      "Eating more vegetables is linked to lower heart disease and early death in large observational studies. Frozen ones count.",
      "In one small, industry-funded study, frozen produce kept vitamin C, beta-carotene and folate about as well as fresh, and sometimes better than fresh kept at home for days.",
    ],
    use: "Add straight to soups, stir-fries, pasta and omelets. Steam briefly or roast from frozen.",
    cautions: [
      "Choose plain bags. Sauces and seasoning blends can add salt and fat.",
      "Follow the pack directions. Some vegetables need cooking before eating.",
      "Check the label for allergens in mixed or sauced products.",
    ],
    find: "Freezer aisle. Plain bags of broccoli, peas, spinach, mixed vegetables and more.",
    sources: [
      { text: "Li L et al. Selected nutrient analyses of fresh, fresh-stored, and frozen fruits and vegetables. J Food Compos Anal, 2017", url: "https://doi.org/10.1016/j.jfca.2017.02.002" },
      { text: "Aune D et al. Fruit and vegetable intake and risk of cardiovascular disease, cancer and all-cause mortality. Int J Epidemiol, 2017", url: "https://doi.org/10.1093/ije/dyw319" },
    ],
  },
  {
    id: "apples", name: "Apples", cat: "produce", aisle: "Produce", evidence: "Moderate", hue: 355,
    summary: "A portable fruit with fiber, including pectin, in the skin and flesh.",
    benefits: [
      "Apples and pears are linked with lower risk of cardiovascular disease and early death in a large meta-analysis of cohorts. That shows a link, not proof.",
      "A source of fiber and vitamin C (USDA). Eat the skin for extra fiber.",
    ],
    use: "Slice with nut butter, bake with cinnamon, or add to oats and slaws.",
    cautions: [
      "Seeds are best not chewed in quantity.",
      "Raw apple can cause mouth itching in people with birch pollen allergy.",
      "Whole apple is a choking risk for young children. Slice or cook it.",
    ],
    find: "Produce section all year. Local apples are best in fall.",
    sources: [
      { text: "Aune D et al. Fruit and vegetable intake and risk of cardiovascular disease, cancer and all-cause mortality. Int J Epidemiol, 2017", url: "https://doi.org/10.1093/ije/dyw319" },
      { text: "USDA FoodData Central (nutrient values)", url: "https://fdc.nal.usda.gov/" },
    ],
  },
  {
    id: "whole-grain-bread", name: "Whole-grain bread", cat: "grain", aisle: "Grains & beans", evidence: "Moderate", hue: 32,
    summary: "A familiar way to eat more whole grains.",
    benefits: [
      "Higher whole-grain intake is linked to lower risk of heart disease, type 2 diabetes and early death in large reviews (Harvard, Lancet).",
      "Gives more fiber than white bread when it is made mostly from whole grain.",
    ],
    use: "Look for 'whole wheat' or another whole grain as the first ingredient. Use for toast, sandwiches and soup dippers.",
    cautions: [
      "Contains gluten, and often wheat, soy or seeds that can be allergens.",
      "Breads vary in salt and added sugar. Compare labels.",
      "Colored or 'multigrain' breads are not always whole grain.",
    ],
    find: "Bakery or bread aisle. Check the ingredient list, not just the front of the pack.",
    sources: [
      { text: "Harvard T.H. Chan School of Public Health Nutrition Source: Whole grains", url: "https://nutritionsource.hsph.harvard.edu/what-should-you-eat/whole-grains" },
      { text: "Reynolds A et al. Carbohydrate quality and human health. Lancet, 2019", url: "https://doi.org/10.1016/S0140-6736(18)31809-9" },
    ],
  },
  {
    id: "bananas", name: "Bananas", cat: "produce", aisle: "Produce", evidence: "Weak", hue: 52,
    summary: "An easy, cheap fruit with potassium and fiber.",
    benefits: [
      "A good source of potassium, which supports heart, nerve, muscle and kidney function (NIH).",
      "Green bananas have more resistant starch, which feeds gut bacteria. Human evidence for health effects is limited.",
    ],
    use: "Eat as is, slice onto oats, blend into smoothies, or freeze overripe ones for baking.",
    cautions: [
      "If you have kidney disease or take medicine that raises potassium, ask your clinician how much is right for you.",
      "People with latex allergy may react to bananas.",
    ],
    find: "Produce section, sold by the bunch at every stage of ripeness.",
    sources: [
      { text: "NIH Office of Dietary Supplements: Potassium fact sheet for consumers", url: "https://ods.od.nih.gov/factsheets/potassium-Consumer/?print=1" },
      { text: "USDA FoodData Central (nutrient values)", url: "https://fdc.nal.usda.gov/" },
    ],
  },
];

export const pantryById = (id: string) => PANTRY.find((p) => p.id === id);

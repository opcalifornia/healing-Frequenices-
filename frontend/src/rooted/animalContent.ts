import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/**
 * Animal products: how animals are raised, what regulators allow, and what the research says.
 *
 * Rules for this file:
 * - Honest, not alarmist. Where regulators or scientists disagree, say so.
 * - `rating` is how well supported the human-health claim in `body` is, on the app's usual scale.
 * - Rules described are the United States unless stated. Other countries differ.
 * - Every card carries sources, and says what a person can actually do.
 */

export interface AnimalTopic {
  id: string;
  group: "antibiotics" | "hormones" | "feed" | "processing" | "organic" | "labels" | "health";
  title: string;
  stat: string;
  statLabel: string;
  rating: Strength;
  hue: number;
  /** What it is and why it is used. */
  what: string;
  /** What the rules say. */
  rules: string;
  /** What the research says about people. */
  research: string;
  /** Things a person can do. */
  doThis: string[];
  sources: Source[];
}

const FDA_VFD: Source = { text: "FDA. Veterinary Feed Directive Final Rule and Next Steps", url: "https://www.fda.gov/animal-veterinary/development-approval-process/fact-sheet-veterinary-feed-directive-final-rule-and-next-steps" };
const FSIS_LABELS: Source = { text: "USDA FSIS. Meat and Poultry Labeling Terms", url: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/meat-and-poultry-labeling-terms" };
const NOP: Source = { text: "USDA Agricultural Marketing Service. Organic Livestock and Dairy", url: "https://www.ams.usda.gov/grades-standards/organic-livestock-dairy" };

export const ANIMAL_TOPICS: AnimalTopic[] = [
  {
    id: "antibiotics", group: "antibiotics", title: "Antibiotics in farm animals", stat: "2017", statLabel: "the year US growth-promotion uses of medically important antibiotics ended", rating: "Moderate", hue: 28,
    what: "Farm animals are given antibiotics to treat sick animals, to control disease on a farm, to prevent disease in animals at risk, and, in the past, to help them grow faster on less feed. In some countries most of the antibiotics that matter for human medicine are used in animals.",
    rules: "In the US, since 2017 medically important antibiotics can't be used to make animals grow faster, and putting them in feed or water needs a veterinarian's authorisation. Use for treating, controlling and preventing disease is still allowed under a vet's oversight. The World Health Organization goes further and recommends ending routine use in healthy animals.",
    research: "Antibiotic use in animals helps drug-resistant bacteria survive and spread, and resistant germs such as Salmonella and Campylobacter can reach people through food, animal contact and the environment. A large review found that cutting antibiotic use in food animals reduced resistant bacteria in those animals; the evidence in people is thinner, mostly in those who work with animals. Antibiotic residues in the meat itself are a smaller concern: US testing finds violations in well under 1% of routinely sampled carcasses.",
    doThis: ["Handle and cook meat and poultry safely: it removes the germs, resistant or not.", "If you want to support lower antibiotic use, look for USDA Organic, which does not allow antibiotics, or a \"raised without antibiotics\" claim.", "Remember that your own antibiotic use matters too: take them only when prescribed."],
    sources: [FDA_VFD, { text: "WHO. Guidelines on use of medically important antimicrobials in food-producing animals, 2017", url: "https://www.who.int/publications/i/item/9789241550130" }, { text: "Tang KL et al. Restricting the use of antibiotics in food-producing animals and its associations with antibiotic resistance. Lancet Planetary Health, 2017", url: "https://doi.org/10.1016/S2542-5196(17)30141-9" }, { text: "CDC. Antimicrobial resistance facts (NARMS)", url: "https://www.cdc.gov/narms/resistance" }, { text: "USDA FSIS. Chemical residues and contaminants data", url: "https://www.fsis.usda.gov/science-data/data-sets-visualizations/chemical-residues-and-contaminants" }],
  },
  {
    id: "hormones", group: "hormones", title: "Growth hormones in beef", stat: "6", statLabel: "growth-promoting hormones approved for beef cattle in the US, banned in the EU", rating: "Mixed", hue: 330,
    what: "Small slow-release implants under the skin of an ear help beef cattle gain weight faster on less feed. Three are natural hormones (estradiol, progesterone, testosterone) and three are synthetic (zeranol, trenbolone acetate, melengestrol acetate).",
    rules: "The FDA approves them and sets safe limits for what can be in meat. Hormones are not allowed in poultry or pork in the US. The European Union bans estradiol and the other five for growth promotion, treating estradiol as a carcinogen and saying the data can't give a number for the risk of the others.",
    research: "All meat and milk contain natural hormones, and meat from treated cattle carries slightly more. Regulators disagree about whether that matters. The FDA and many other bodies judge it safe at the approved levels; the EU concluded the evidence wasn't enough to be sure. We don't have good studies that follow people who eat treated and untreated beef over decades, so the honest answer is that the long-term effect on people is unknown, not proven harmful.",
    doThis: ["If you'd rather avoid them, choose USDA Organic beef, which prohibits hormones, or beef labelled \"no hormones administered\" (the producer must document it).", "Ignore \"no hormones added\" on pork and poultry: hormones are already prohibited, and the label has to say so."],
    sources: [{ text: "FDA. Steroid hormone implants used for growth in food-producing animals", url: "https://www.fda.gov/animal-veterinary/product-safety-information/steroid-hormone-implants-used-growth-food-producing-animals" }, { text: "European Commission. Hormones in meat", url: "https://food.ec.europa.eu/food-safety/chemical-safety/hormones-meat_en" }, FSIS_LABELS],
  },
  {
    id: "rbst", group: "hormones", title: "rBST in milk", stat: "1993", statLabel: "year the FDA approved a growth hormone injection for dairy cows", rating: "Weak", hue: 200,
    what: "Recombinant bovine somatotropin (rBST, also called rBGH) is a hormone made in a lab and injected in dairy cows to raise how much milk they make. Many brands now label milk \"from cows not treated with rBST\".",
    rules: "Approved by the FDA, which considers the milk safe. Organic standards don't allow it.",
    research: "The hormone isn't active in people and is broken down in digestion. Treated cows' milk can have somewhat more of another hormone, IGF-1, though within the normal range of milk. The American Cancer Society says the FDA and many other bodies find the milk safe and that the evidence of harm to people isn't conclusive.",
    doThis: ["If you'd rather avoid it, look for \"rBST-free\" or USDA Organic milk.", "There's no strong evidence you need to for your own health."],
    sources: [{ text: "American Cancer Society. Recombinant bovine growth hormone (rBGH)", url: "https://www.cancer.org/cancer/risk-prevention/chemicals/recombinant-bovine-growth-hormone.html" }, { text: "AVMA. FDA rejects petition to ban rBST", url: "https://www.avma.org/News/JAVMANews/Pages/s061500d.aspx" }],
  },
  {
    id: "ractopamine", group: "feed", title: "Ractopamine in pork and beef", stat: "Allowed in the US", statLabel: "banned in the EU, China and many other countries", rating: "Weak", hue: 270,
    what: "Ractopamine is a feed additive that makes pigs, cattle and turkeys put on more lean muscle. It isn't a hormone, but it acts on similar receptors.",
    rules: "Approved by the FDA, which judges it safe when used as the label says. Many countries, including the EU and China, ban it or won't accept meat with any residue, which has caused trade disputes. International standard-setters have also disagreed over limits.",
    research: "There are few studies on people eating meat from treated animals, so the evidence of harm to eaters is very limited. Critics point to reports of sick or dead pigs in FDA records, and note that governments differ on how cautious to be. Extension scientists say pork from treated pigs is safe when used as directed.",
    doThis: ["USDA Organic prohibits it. Some brands label pork \"ractopamine-free\" and verify it.", "It isn't something to worry about day to day, but it's a fair question to ask about how the animals are raised."],
    sources: [{ text: "Michigan State University Extension. Pork from ractopamine-fed pigs is safe for consumption", url: "https://www.canr.msu.edu/news/pork-from-ractopamine-fed-pigs-is-safe-for-consumption" }],
  },
  {
    id: "solution", group: "processing", title: "Water and \"solutions\" added to meat and poultry", stat: "Up to X%", statLabel: "the label has to state the maximum water or solution", rating: "Strong", hue: 190,
    what: "Raw chicken and some pork are often injected, tumbled or soaked with a salt water solution, sometimes with broth or flavourings, to make them seem juicier. Poultry also soaks up water in chilling.",
    rules: "US rules require raw products that retain water from processing to say so, for example \"up to 8% retained water\", and products with added solutions to say so in the name, for example \"flavored with up to 10% of a solution of water, salt and spices\".",
    research: "This isn't a safety concern, but it matters for what you pay for and for sodium. You pay meat prices for added water, and a solution of salt water adds sodium you didn't plan on.",
    doThis: ["Read the product name and the fine print for \"solution\", \"broth\", \"retained water\" or \"enhanced\".", "Look for packs with no added solution if you watch sodium or want what you paid for to be meat."],
    sources: [{ text: "US Code of Federal Regulations, 9 CFR 441.10. Retained water", url: "https://www.law.cornell.edu/cfr/text/9/441.10" }, FSIS_LABELS],
  },
  {
    id: "washes", group: "processing", title: "Cleaning washes on poultry and meat", stat: "Approved", statLabel: "processing rinses are regulated by the USDA", rating: "Weak", hue: 170,
    what: "To reduce germs such as Salmonella, plants rinse or dip carcasses in approved antimicrobial solutions, commonly peracetic acid (made from acetic acid, the acid in vinegar, and hydrogen peroxide) or chlorine, and chill poultry in cold water.",
    rules: "The USDA's list of safe and suitable ingredients says which substances can be used and in what amounts. These are separate from the veterinary drugs above.",
    research: "We found no good evidence that residues from these rinses harm people at the permitted levels, and this guide hasn't verified how other countries regulate them. They don't replace safe handling at home: raw poultry can still carry germs.",
    doThis: ["Don't wash raw poultry at home: it splashes germs around your kitchen.", "Cook chicken to 165°F (74°C), and keep raw meat away from ready-to-eat food."],
    sources: [{ text: "USDA FSIS. Directive 7120.1, Safe and suitable ingredients used in the production of meat, poultry and egg products", url: "https://www.fsis.usda.gov/policy/fsis-directives/7120.1" }],
  },
  {
    id: "organic", group: "organic", title: "What \"USDA Organic\" means for animals", stat: "4 rules", statLabel: "organic feed, no antibiotics, no growth hormones, outdoor access", rating: "Strong", hue: 110,
    what: "Certified organic animals eat certified organic feed, aren't given antibiotics or growth hormones, and must have outdoor access, with ruminants such as cattle grazing on pasture during the grazing season. Farms keep records and are inspected every year.",
    rules: "An animal that is treated with antibiotics can't be sold as organic. Vaccines and vitamin and mineral supplements are allowed. Organic is a legally defined and inspected label, unlike many of the other claims on packs.",
    research: "Organic is a set of farming rules, and those rules are met. Whether the food is healthier for you is a separate question: see the next card.",
    doThis: ["If avoiding antibiotics, growth hormones and feed additives matters to you, organic is the one label that covers all of them and is checked.", "Organic costs more. If your budget is tight, the health gap is small (see below), and cooking and eating a varied diet matter more."],
    sources: [NOP],
  },
  {
    id: "organic-health", group: "organic", title: "Is organic meat and milk healthier?", stat: "~50%", statLabel: "more omega-3 in organic meat and milk in two large reviews, from a small base", rating: "Moderate", hue: 140,
    what: "Two 2016 reviews of hundreds of studies compared organic and conventional meat and milk. A 2012 review compared organic and conventional foods more broadly.",
    rules: "These are research findings, not rules.",
    research: "Organic meat and milk tend to have more omega-3 fats, mostly because the animals eat more grass and clover. But the amounts are small: experts estimated that switching to organic milk adds only about 33 mg of omega-3 a day, too little to matter much. The 2012 review found no consistent differences in vitamins, found organic produce less likely to carry pesticide residues, and suggested organic chicken and pork may carry fewer antibiotic-resistant bacteria, though there was no difference in the risk of bacterial contamination overall. Whether choosing organic leads to better health in people has not been shown: studies of long-term health are hard to do.",
    doThis: ["Choose organic for the farming practices it guarantees, not for a promised health boost.", "For omega-3s, oily fish gives far more than any milk."],
    sources: [{ text: "Smith-Spangler C et al. Are organic foods safer or healthier than conventional alternatives? Annals of Internal Medicine, 2012", url: "https://www.acpjournals.org/doi/10.7326/0003-4819-157-5-201209040-00007" }, { text: "Średnicka-Tober D et al. Higher PUFA and n-3 PUFA, CLA, α-tocopherol and iron, but lower iodine and selenium concentrations in organic milk; and organic meat (British Journal of Nutrition, 2016), summarised by the Organic Research Centre", url: "https://www.organicresearchcentre.com/news-events/news/nutritional-differences-between-organic-and-non-organic-milk/" }],
  },
  {
    id: "labels", group: "labels", title: "Reading the label", stat: "Few are checked", statLabel: "many label claims are voluntary and defined only loosely", rating: "Strong", hue: 50,
    what: "Packs of meat, poultry, eggs and dairy carry many claims. Some are legally defined and inspected. Some are checked against paperwork from the producer. Some mean very little.",
    rules: "\"Natural\" means no artificial ingredient or added colour and only minimal processing. It says nothing about how the animal was raised. \"No hormones added\" on pork and poultry must be followed by a statement that federal rules prohibit hormones. \"Free range\", \"pasture raised\", \"grass-fed\" and \"raised without antibiotics\" are voluntary raising claims that producers must back with documentation, and their meanings vary. \"Certified Organic\" is a legally defined, inspected standard.",
    research: "Labels tell you about practices, not about safety or nutrition. A \"natural\" chicken and a conventional one are raised the same way.",
    doThis: ["Treat \"natural\" as a processing claim only.", "Look for a certifier's name or seal (USDA Organic, or a third-party animal welfare certification) when you want a claim you can rely on."],
    sources: [FSIS_LABELS],
  },
  {
    id: "processed", group: "health", title: "Processed and red meat", stat: "Group 1", statLabel: "IARC's rating for processed meat: strong evidence it can cause bowel cancer", rating: "Strong", hue: 5,
    what: "This is about the meat itself, not how the animal was raised. Processed meat is meat that has been salted, cured, fermented or smoked: bacon, ham, sausages, hot dogs and deli meats. Red meat is beef, pork, lamb and similar.",
    rules: "The World Health Organization's cancer agency (IARC) classified processed meat as carcinogenic to humans (Group 1) and red meat as probably carcinogenic (Group 2A) in 2015. Group 1 describes how strong the evidence is, not how big the risk is.",
    research: "Each 50 g of processed meat a day (about one hot dog) was linked to roughly an 18% higher chance of bowel cancer. For an individual the extra risk stays small, but rises with how much is eaten. Evidence for red meat is more limited. How the animal was raised was not part of this finding.",
    doThis: ["Eat processed meats less often and in smaller amounts.", "Mix in beans, lentils, fish and poultry, and fill half your plate with plants."],
    sources: [{ text: "Bouvard V et al. Carcinogenicity of consumption of red and processed meat. Lancet Oncology, 2015", url: "https://doi.org/10.1016/S1470-2045(15)00444-1" }],
  },
];

export const GROUP_LABEL: Record<AnimalTopic["group"], string> = {
  antibiotics: "Antibiotics",
  hormones: "Hormones",
  feed: "Feed additives",
  processing: "Processing",
  organic: "Organic",
  labels: "Labels",
  health: "Meat and health",
};

/** The same practice in the US and the EU, only where we have a source for both. */
export const COMPARE: Array<{ practice: string; us: string; eu: string; source: Source }> = [
  { practice: "Growth hormones in beef cattle", us: "Allowed (six FDA-approved products)", eu: "Banned", source: { text: "European Commission. Hormones in meat", url: "https://food.ec.europa.eu/food-safety/chemical-safety/hormones-meat_en" } },
  { practice: "Hormones in pork and poultry", us: "Not allowed", eu: "Not allowed", source: FSIS_LABELS },
  { practice: "Ractopamine feed additive", us: "Allowed", eu: "Banned", source: { text: "Michigan State University Extension. Pork from ractopamine-fed pigs", url: "https://www.canr.msu.edu/news/pork-from-ractopamine-fed-pigs-is-safe-for-consumption" } },
];

export const ANIMAL_INTRO_SOURCES: Source[] = [
  { text: "USDA FSIS. Meat and Poultry Labeling Terms", url: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/meat-and-poultry-labeling-terms" },
  { text: "FDA. Antimicrobial resistance and animal agriculture (Veterinary Feed Directive)", url: "https://www.fda.gov/animal-veterinary/development-approval-process/fact-sheet-veterinary-feed-directive-final-rule-and-next-steps" },
];

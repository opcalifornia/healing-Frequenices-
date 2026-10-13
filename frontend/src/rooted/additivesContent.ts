import type { Strength } from "../learn/brainContent";
import type { Consideration } from "../store/wellness";
import type { Source } from "./pantryContent";

/**
 * Food additives: what the research says, and how strong it is.
 *
 * Rules for this file:
 * - Every entry with a concern cites a regulator or a published study, and every
 *   URL was checked against the real page. Add nothing without a source.
 * - `evidence` rates how well the research supports the CONCERN, on the same scale
 *   as the rest of the app. "Weak" means early or limited evidence, not proof of harm.
 * - Say what the research found and how big the effect was. Never "toxic", "poison"
 *   or "cures". A concern is not a verdict, and many people eat these at levels
 *   regulators consider acceptable.
 * - No medical advice. "Who may want to be careful" only names groups a regulator
 *   or label rule already names.
 */

export type ConcernLevel = "restricted" | "some" | "little";

export const LEVEL_LABEL: Record<ConcernLevel, string> = {
  restricted: "Restricted by regulators",
  some: "Some research concern",
  little: "Little concern found",
};

export interface Additive extends AdditiveBase {
  /** Short "potential associated risks" tags, each worded with how strong the finding is. Empty when there is none. */
  topics: string[];
}

interface AdditiveBase {
  /** Lowercase code, for example "e171". */
  id: string;
  /** Display code, for example "E171". */
  code: string;
  name: string;
  also?: string;
  /** What it is used for. */
  kind: string;
  /** Where people usually meet it. */
  found: string;
  level: ConcernLevel;
  /** How well the research supports the concern. */
  evidence: Strength;
  summary: string;
  research: string[];
  /** A group that a regulator or label rule says may want to take care. */
  careIf?: string;
  /** Profile considerations that make this worth a closer look for someone. */
  careFlags?: Consideration[];
  regulation: string;
  sources: Source[];
}

const EFSA_ADDITIVES: Source = { text: "EFSA: Food additives", url: "https://www.efsa.europa.eu/en/topics/topic/food-additives" };
const EFSA_TIO2: Source = { text: "EFSA: Titanium dioxide (E171) no longer considered safe as a food additive, 2021", url: "https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive" };
const IARC_MEAT: Source = { text: "IARC: Evaluation of consumption of red meat and processed meat, 2015", url: "https://www.iarc.who.int/wp-content/uploads/2018/07/pr240_E.pdf" };
const EFSA_NITRITE: Source = { text: "EFSA: Re-evaluation of potassium nitrite (E 249) and sodium nitrite (E 250), 2017", url: "https://www.efsa.europa.eu/ro/efsajournal/pub/4786" };
const EFSA_NITRITE_NEWS: Source = { text: "EFSA: Safe levels for nitrites and nitrates added to food, 2017", url: "https://www.efsa.europa.eu/en/press/news/170615" };
const MCCANN: Source = { text: "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007", url: "https://doi.org/10.1016/S0140-6736(07)61306-3" };
const EU_ADDITIVES_LAW: Source = { text: "EU Regulation (EC) No 1333/2008 on food additives (labelling rules)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32008R1333" };
const FDA_BENZENE: Source = { text: "FDA: Benzene in soft drinks and other beverages (Q&A)", url: "https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages" };
const WHO_ASPARTAME: Source = { text: "WHO and IARC: Aspartame hazard and risk assessment results, 2023", url: "https://www.who.int/news/item/14-07-2023-aspartame-hazard-and-risk-assessment-results-released" };
const ERYTHRITOL: Source = { text: "Witkowski M et al. The artificial sweetener erythritol and cardiovascular event risk. Nature Medicine, 2023", url: "https://doi.org/10.1038/s41591-023-02223-9" };
const CARRAGEENAN: Source = { text: "EFSA: Re-evaluation of carrageenan (E 407) and processed Eucheuma seaweed (E 407a), 2018", url: "https://www.efsa.europa.eu/en/efsajournal/pub/5238" };
const CHASSAING: Source = { text: "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota. Nature, 2015", url: "https://doi.org/10.1038/nature14232" };
const SELLEM: Source = { text: "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease (NutriNet-Santé). BMJ, 2023", url: "https://doi.org/10.1136/bmj-2023-076058" };
const EFSA_SULFITES: Source = { text: "EFSA: Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-228), 2022", url: "https://www.efsa.europa.eu/en/efsajournal/pub/7594" };
const EFSA_GLUTAMATE: Source = { text: "EFSA: Re-evaluation of glutamic acid and glutamates (E 620-625), 2017", url: "https://www.efsa.europa.eu/en/efsajournal/pub/4910" };

const COLOUR_RESEARCH = [
  "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks with a mix of artificial colours and sodium benzoate. Some groups of children showed a small rise in hyperactive behaviour compared with a placebo drink.",
  "The effects were small, they came from mixtures, and the study could not say which single ingredient was responsible. The European Food Safety Authority (EFSA) looked at it in 2008 and found no grounds to change the safe daily intake of any one colour.",
  "Because of the study, the EU requires a label on foods with these colours: they \"may have an adverse effect on activity and attention in children\".",
];
const COLOUR_CARE = "Children, and families who notice a link between colourful foods and behaviour.";
const COLOUR_REG = "In the EU, products with this colour must carry a warning about children's activity and attention. Rules in other countries differ.";

function colour(code: string, name: string, also: string | undefined, found: string, extra?: string): AdditiveBase {
  return {
    id: code.toLowerCase(),
    code,
    name,
    also,
    kind: "Colour",
    found,
    level: "some",
    evidence: "Mixed",
    summary: "Linked to a small rise in hyperactive behaviour in some children, when eaten in mixtures. The evidence is mixed.",
    research: extra ? [...COLOUR_RESEARCH, extra] : COLOUR_RESEARCH,
    careIf: COLOUR_CARE,
    regulation: COLOUR_REG,
    sources: [MCCANN, EU_ADDITIVES_LAW],
  };
}

const SULFITE_FOUND = "Wine, dried fruit, some juices, pickles and processed potatoes.";
function sulfite(code: string, name: string): AdditiveBase {
  return {
    id: code.toLowerCase(),
    code,
    name,
    kind: "Preservative and antioxidant",
    found: SULFITE_FOUND,
    level: "some",
    evidence: "Moderate",
    summary: "Can trigger reactions in people who are sensitive to sulfites. EFSA also flagged a safety concern about how much some people eat.",
    research: [
      "Sulfites are a well-known trigger for reactions in some sensitive people, including some people with asthma. That is why they must be declared on labels.",
      "In 2022 EFSA looked at the sulfites again. It withdrew the old safe daily intake because the toxicity data was too thin, and set a safety margin instead. Estimated intake in the population fell below that margin, which EFSA flagged as a safety concern.",
      "This is about the total amount people take in from many foods and drinks. A single serving is unlikely to matter for most people.",
    ],
    careIf: "People with asthma or a known sulfite sensitivity.",
    regulation: "Sulfites must be declared as an allergen on labels in the EU and the US above a small threshold.",
    sources: [EFSA_SULFITES],
  };
}

function gentle(code: string, name: string, kind: string, found: string, also?: string): AdditiveBase {
  return {
    id: code.toLowerCase(),
    code,
    name,
    also,
    kind,
    found,
    level: "little",
    evidence: "None",
    summary: "Regulators have not identified a safety concern at the levels allowed in food.",
    research: [
      "Regulators, including EFSA through its programme of reviewing older additives, have not identified a safety concern at the amounts allowed in food.",
      "A longer name on a label is not a reason for worry on its own. Many additives are simple, familiar substances.",
    ],
    regulation: "Authorised in the EU. Check your own country's rules.",
    sources: [EFSA_ADDITIVES],
  };
}

const RAW: AdditiveBase[] = [
  {
    id: "e171",
    code: "E171",
    name: "Titanium dioxide",
    kind: "Colour (white)",
    found: "White coatings on sweets and chewing gum, some baked goods and sauces.",
    level: "restricted",
    evidence: "Weak",
    summary: "EFSA concluded in 2021 that it can no longer be considered safe as a food additive, because a risk to DNA could not be ruled out.",
    research: [
      "EFSA's 2021 review found that a concern about genotoxicity (damage to DNA) could not be ruled out, and that it could not set a safe daily intake.",
      "Absorption after eating it is low, but tiny particles can build up in the body over time.",
      "General toxicity studies did not show adverse effects at the doses tested. The concern is about what could not be excluded, not about harm shown in people.",
    ],
    regulation: "Removed from the EU's list of authorised food additives in 2022. Rules in other countries differ, so check yours.",
    sources: [EFSA_TIO2],
  },
  {
    id: "e250",
    code: "E250",
    name: "Sodium nitrite",
    also: "E249 potassium nitrite",
    kind: "Preservative (curing)",
    found: "Bacon, ham, hot dogs, salami and other cured meats.",
    level: "some",
    evidence: "Moderate",
    summary: "The strong research link is to eating processed meat, which can contain it. How much of that link is due to nitrite itself is not settled.",
    research: [
      "In 2015 the International Agency for Research on Cancer (IARC) classed processed meat as carcinogenic to humans (Group 1), based on sufficient evidence that eating it causes colorectal cancer. IARC estimated about an 18% higher risk for each 50 g eaten daily.",
      "IARC's label describes how strong the evidence is, not how big the risk is. For one person the added risk is small, and it rises with the amount eaten.",
      "EFSA re-evaluated nitrite as an additive in 2017 and kept a safe daily intake of 0.07 mg per kg of body weight. Average intake from additive use was below it.",
    ],
    regulation: "Authorised in the EU and the US for curing meat, with limits on the amount.",
    sources: [IARC_MEAT, EFSA_NITRITE, EFSA_NITRITE_NEWS],
  },
  colour("E102", "Tartrazine", "Yellow 5 in the US", "Fizzy drinks, sweets, desserts, crisps and sauces."),
  colour("E104", "Quinoline yellow", undefined, "Sweets, drinks, ice lollies and coated snacks.", "In 2009 EFSA recommended lowering the safe daily intake for this colour."),
  colour("E110", "Sunset yellow FCF", "Yellow 6 in the US", "Orange drinks, sweets, biscuits and snacks.", "In 2009 EFSA recommended lowering the safe daily intake for this colour."),
  colour("E122", "Carmoisine", "Azorubine", "Jelly, sweets, jams and some desserts."),
  colour("E124", "Ponceau 4R", undefined, "Sweets, desserts, drinks and processed meats.", "In 2009 EFSA recommended lowering the safe daily intake for this colour."),
  colour("E129", "Allura red AC", "Red 40 in the US", "Sweets, drinks, cereals and snack foods."),
  {
    id: "e211",
    code: "E211",
    name: "Sodium benzoate",
    kind: "Preservative",
    found: "Fizzy drinks, squashes, pickles, sauces and salad dressings.",
    level: "some",
    evidence: "Weak",
    summary: "Can form tiny amounts of benzene in drinks that also contain vitamin C. It was also part of the colour mix in the 2007 hyperactivity study.",
    research: [
      "The US Food and Drug Administration (FDA) says benzene can form at very low levels in some soft drinks that contain benzoate and vitamin C, more so with heat and light.",
      "FDA tested drinks, asked the few above its limit to reformulate, and concluded that levels found did not pose a safety concern.",
      "Sodium benzoate was in the drink mixes used in the 2007 McCann study of children's behaviour. That study cannot say which ingredient was responsible.",
    ],
    careIf: "Children, if a family notices a link between these drinks and behaviour.",
    regulation: "Authorised in the EU and US with limits on use.",
    sources: [FDA_BENZENE, MCCANN],
  },
  {
    id: "e951",
    code: "E951",
    name: "Aspartame",
    kind: "Sweetener",
    found: "Diet and zero-sugar drinks, sugar-free gum, light yoghurts and tabletop sweeteners.",
    level: "some",
    evidence: "Weak",
    summary: "IARC classed it as possibly carcinogenic in 2023, based on limited evidence. A separate WHO committee kept its safe daily intake unchanged.",
    research: [
      "In July 2023 IARC placed aspartame in Group 2B, \"possibly carcinogenic to humans\", on the basis of limited evidence, mainly for a type of liver cancer.",
      "On the same day the WHO and FAO expert committee on food additives (JECFA) reviewed the risk and kept the acceptable daily intake at 40 mg per kg of body weight.",
      "WHO noted an adult weighing 70 kg would need roughly 9 to 14 cans of diet soft drink a day to go over that limit. IARC's grouping describes the strength of evidence, not the size of the risk.",
      "Both bodies called for more research.",
    ],
    careIf: "People with phenylketonuria (PKU) must avoid it. Labels say it contains a source of phenylalanine.",
    regulation: "Authorised in the EU and the US. JECFA's acceptable daily intake is 0 to 40 mg per kg of body weight.",
    sources: [WHO_ASPARTAME],
  },
  {
    id: "e968",
    code: "E968",
    name: "Erythritol",
    kind: "Sweetener (sugar alcohol)",
    found: "Sugar-free sweets, protein bars, low-carb products and tabletop sweeteners.",
    level: "some",
    evidence: "Weak",
    summary: "One 2023 study linked higher blood levels to more heart attacks and strokes in people already at higher heart risk. It shows a link, not cause and effect.",
    research: [
      "In a 2023 Nature Medicine study of 1,157 people at higher heart risk, higher blood erythritol went with more heart attacks, strokes or deaths over the next 3 years. Two other groups of people showed a similar pattern.",
      "In lab tests, erythritol made blood platelets more reactive, and in a small pilot of 8 healthy volunteers, a drink sweetened with erythritol raised blood levels for more than 2 days.",
      "The authors say it shows an association. It does not prove that erythritol causes heart problems, and the volunteer study was very small.",
    ],
    careIf: "People who already have heart disease or high heart risk may want to ask their clinician.",
    careFlags: ["heart"],
    regulation: "Authorised in the EU and the US.",
    sources: [ERYTHRITOL],
  },
  {
    id: "e407",
    code: "E407",
    name: "Carrageenan",
    kind: "Thickener (from seaweed)",
    found: "Plant milks, ice cream, deli meats, yoghurts and desserts.",
    level: "little",
    evidence: "Weak",
    summary: "Often debated online. EFSA's 2018 review found no concern about cancer risk, but asked for more data on some uses.",
    research: [
      "EFSA's 2018 re-evaluation found that carrageenan is not absorbed intact and found no concern about carcinogenicity.",
      "EFSA also asked for more technical and toxicity data, including for foods for young infants, and a follow-up review has been under way.",
      "Concerns online often come from a different, degraded form used only in lab studies. That form is not allowed in food.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [CARRAGEENAN],
  },
  {
    id: "e466",
    code: "E466",
    name: "Carboxymethylcellulose",
    also: "CMC, cellulose gum",
    kind: "Emulsifier and thickener",
    found: "Ice cream, sauces, baked goods and gluten-free breads.",
    level: "some",
    evidence: "Weak",
    summary: "In mice, low doses changed gut bacteria and caused inflammation. Human evidence is limited.",
    research: [
      "A 2015 study in Nature (Chassaing et al.) found that carboxymethylcellulose and polysorbate 80, at low concentrations in food, changed gut bacteria in mice and led to low-grade inflammation and weight gain.",
      "Other scientists have pointed out that the doses were far higher than people eat. Studies in people are limited.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [CHASSAING],
  },
  {
    id: "e433",
    code: "E433",
    name: "Polysorbate 80",
    kind: "Emulsifier",
    found: "Ice cream, creamy sauces, baked goods and some vitamin products.",
    level: "some",
    evidence: "Weak",
    summary: "In mice, low doses changed gut bacteria and caused inflammation. Human evidence is limited.",
    research: [
      "A 2015 study in Nature (Chassaing et al.) found that polysorbate 80 and carboxymethylcellulose changed gut bacteria in mice and led to low-grade inflammation and weight gain.",
      "The doses were far higher than people usually eat, and studies in people are limited.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [CHASSAING],
  },
  {
    id: "e472b",
    code: "E472b",
    name: "Lactic acid esters of mono- and diglycerides",
    kind: "Emulsifier",
    found: "Bread, cakes, margarine, whipped toppings and packaged desserts.",
    level: "some",
    evidence: "Weak",
    summary: "In a large French study, higher intake went with a higher risk of cardiovascular disease. It shows a link, not cause and effect.",
    research: [
      "A 2023 BMJ study followed 95,442 French adults for a median of 7.4 years. Higher intake of E472b was associated with more cardiovascular disease and cerebrovascular disease.",
      "The associations were modest. This is an observational study, so it cannot show cause, and the authors say the finding should be repeated in other groups.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [SELLEM],
  },
  {
    id: "e472c",
    code: "E472c",
    name: "Citric acid esters of mono- and diglycerides",
    kind: "Emulsifier",
    found: "Infant formula, bread, margarine and packaged desserts.",
    level: "some",
    evidence: "Weak",
    summary: "In a large French study, higher intake went with a higher risk of cardiovascular and coronary heart disease. It shows a link, not cause and effect.",
    research: [
      "A 2023 BMJ study followed 95,442 French adults for a median of 7.4 years. Higher intake of E472c was associated with more cardiovascular disease and coronary heart disease.",
      "The associations were modest. This is an observational study, so it cannot show cause, and the authors say it should be repeated in other groups.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [SELLEM],
  },
  {
    id: "e339",
    code: "E339",
    name: "Sodium phosphates",
    also: "Trisodium phosphate",
    kind: "Acidity regulator and emulsifier",
    found: "Processed cheese, deli meats, baked goods and some drinks.",
    level: "some",
    evidence: "Weak",
    summary: "In one large French study, higher intake was linked to a slightly higher risk of coronary heart disease. It shows a link, not cause and effect.",
    research: [
      "In the 2023 BMJ study of 95,442 French adults, high intake of trisodium phosphate (E339) was associated with a slightly higher risk of coronary heart disease (hazard ratio 1.06).",
      "That is a small difference seen in observational data. The authors say it needs to be repeated in other groups, and that experiments are needed to understand why.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [SELLEM],
  },
  sulfite("E220", "Sulfur dioxide"),
  sulfite("E221", "Sodium sulfite"),
  sulfite("E222", "Sodium bisulfite"),
  sulfite("E223", "Sodium metabisulfite"),
  sulfite("E224", "Potassium metabisulfite"),
  sulfite("E226", "Calcium sulfite"),
  sulfite("E227", "Calcium bisulfite"),
  sulfite("E228", "Potassium bisulfite"),
  {
    id: "e621",
    code: "E621",
    name: "Monosodium glutamate",
    also: "MSG",
    kind: "Flavour enhancer",
    found: "Savoury snacks, instant noodles, stock cubes, sauces and restaurant food.",
    level: "little",
    evidence: "Weak",
    summary: "Glutamate also occurs naturally in foods like tomatoes and cheese. EFSA set a group safe daily intake in 2017, and noted some people may eat more than that.",
    research: [
      "EFSA's 2017 re-evaluation set a group safe daily intake of 30 mg per kg of body weight for glutamic acid and its salts (E 620 to 625). It found no concern about damage to DNA.",
      "EFSA noted that estimated intake from additive use exceeded that level in some groups of people.",
      "Glutamate is also made naturally by the body and found in many foods, for example tomatoes, mushrooms and aged cheese.",
    ],
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_GLUTAMATE],
  },
  gentle("E330", "Citric acid", "Acidity regulator", "Drinks, sweets, jams, tinned foods and many sauces."),
  gentle("E300", "Ascorbic acid", "Antioxidant", "Juices, bread, cured meats and many packaged foods.", "Vitamin C"),
  gentle("E322", "Lecithin", "Emulsifier", "Chocolate, spreads, baked goods and margarine.", "Soy or sunflower lecithin"),
  gentle("E440", "Pectin", "Gelling agent (from fruit)", "Jams, jellies, fruit snacks and yoghurts."),
  gentle("E415", "Xanthan gum", "Thickener", "Sauces, dressings, gluten-free baking and plant milks."),
  gentle("E412", "Guar gum", "Thickener", "Ice cream, sauces, gluten-free baking and drinks."),
  gentle("E306", "Tocopherols", "Antioxidant", "Oils, margarine and snacks.", "Vitamin E"),
];

const COLOUR_TOPICS = ["Children's behaviour (small effect, mixtures)", "Label warning required in the EU"];
const SULFITE_TOPICS = ["Sensitivity reactions, including in some people with asthma", "Intake above EFSA's safety margin"];
const TOPICS: Record<string, string[]> = {
  e171: ["Regulators removed it in the EU", "DNA damage could not be ruled out"],
  e250: ["Cancer risk linked to processed meat (strong for the meat, unclear for nitrite)"],
  e102: COLOUR_TOPICS, e104: COLOUR_TOPICS, e110: COLOUR_TOPICS, e122: COLOUR_TOPICS, e124: COLOUR_TOPICS, e129: COLOUR_TOPICS,
  e211: ["Benzene can form with vitamin C", "Children's behaviour (in colour mixtures)"],
  e951: ["Possibly carcinogenic (IARC, limited evidence)", "Must be avoided with PKU"],
  e968: ["Heart health (one study, a link only)"],
  e407: ["Gut health (debated, EFSA found no cancer concern)"],
  e466: ["Gut health (animal studies)"],
  e433: ["Gut health (animal studies)"],
  e472b: ["Heart health (one large study, a link only)"],
  e472c: ["Heart health (one large study, a link only)"],
  e339: ["Heart health (one large study, a link only)"],
  e621: ["Intake above the guideline for some people"],
};
for (const c of ["e220", "e221", "e222", "e223", "e224", "e226", "e227", "e228"]) TOPICS[c] = SULFITE_TOPICS;

export const ADDITIVES: Additive[] = RAW.map((a) => ({ ...a, topics: TOPICS[a.id] ?? [] }));

const BY_ID = new Map(ADDITIVES.map((a) => [a.id, a]));

/** Find an additive from "E330", "e330", "en:e330" or "E-330". */
export function additiveById(raw: string): Additive | undefined {
  return BY_ID.get(normalizeCode(raw) ?? "");
}

/** "en:e330" -> "e330". Returns undefined for anything that isn't an E-number. */
export function normalizeCode(raw: string): string | undefined {
  const m = raw.trim().toLowerCase().replace(/^[a-z]{2}:/, "").replace(/[\s-]/g, "").match(/^e(\d{3,4}[a-z]?)(?:[ivx]+)?$/);
  return m ? `e${m[1]}` : undefined;
}

export const LEVEL_ORDER: Record<ConcernLevel, number> = { restricted: 0, some: 1, little: 2 };

export function searchAdditives(q: string): Additive[] {
  const s = q.trim().toLowerCase();
  if (!s) return ADDITIVES;
  const code = normalizeCode(s);
  return ADDITIVES.filter(
    (a) => a.id === code || a.id.startsWith(s) || a.name.toLowerCase().includes(s) || (a.also ?? "").toLowerCase().includes(s) || a.kind.toLowerCase().includes(s),
  );
}

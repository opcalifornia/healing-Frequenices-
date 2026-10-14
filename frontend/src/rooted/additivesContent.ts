import type { Strength } from "../learn/brainContent";
import type { Consideration } from "../store/wellness";
import type { Source } from "./pantryContent";
import { SAME_REVIEW } from "./eNumbers";
import { AUDITED } from "./additivesAudited";

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
  /** The concern rests only on lab or animal studies so far, which keeps it to a "minor" step. */
  labOnly?: boolean;
  /** Where other rating systems (consumer groups, apps) rate it differently from regulators, and why. */
  contested?: string;
  /** Short risk tags. Set here, or in the TOPICS table below. */
  topics?: string[];
  /** Lowercase code, for example "e171". */
  id: string;
  /** Display code, for example "E171". */
  code: string;
  name: string;
  /** The name printed on US ingredient labels, when it differs, for example "Red 40" for Allura red AC. */
  labelName?: string;
  /** Meets all three of Yuka's tests for a red rating (serious effect, strong evidence, exposure of concern), checked against the sources listed. */
  highRisk?: boolean;
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
  /** What applies in the United States, verified against law-firm and trade reports. */
  usNote?: string;
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
const EFSA_CARAMEL: Source = { text: "EFSA: Caramel colours, consumer exposure lower than previously estimated, 2012", url: "https://www.efsa.europa.eu/en/press/news/121219" };
const FDA_RED3: Source = { text: "FDA: Revoking authorization for Red No. 3 in food and ingested drugs, 2025", url: "https://www.fda.gov/food/hfp-constituent-updates/fda-revoke-authorization-use-red-no-3-food-and-ingested-drugs" };
const FDA_BVO: Source = { text: "FDA: Revoking the regulation allowing brominated vegetable oil in food, 2024", url: "https://www.fda.gov/food/hfp-constituent-updates/fda-revokes-regulation-allowing-use-brominated-vegetable-oil-bvo-food" };
const EFSA_BHA: Source = { text: "EFSA: Exposure to butylated hydroxyanisole (E 320), statement, 2012", url: "https://www.efsa.europa.eu/en/efsajournal/pub/2759" };
const EFSA_BHT: Source = { text: "EFSA: Re-evaluation of butylated hydroxytoluene BHT (E 321), 2012", url: "https://www.efsa.europa.eu/en/efsajournal/pub/2588" };
const IARC_BHA: Source = { text: "IARC Monographs Vol. 40: Butylated hydroxyanisole (BHA), 1986", url: "https://inchem.org/documents/iarc/vol40/butylatedhydroxyanisole.html" };
const EFSA_CARAMEL_2011: Source = { text: "EFSA: Caramel colours reviewed, 2011", url: "https://www.efsa.europa.eu/en/press/news/ans110308" };
const CARAMEL_4MEI: Source = { text: "Caramel color in soft drinks and exposure to 4-methylimidazole: a quantitative risk assessment. PLoS One, 2015", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4333292/" };
const EFSA_SORBATE_2015: Source = { text: "EFSA: Re-evaluation of sorbic acid, potassium sorbate and calcium sorbate (E 200-203), 2015", url: "https://www.efsa.europa.eu/en/efsajournal/pub/4144" };
const EFSA_SORBATE_2019: Source = { text: "EFSA: Follow-up of the re-evaluation of sorbic acid (E 200) and potassium sorbate (E 202), 2019", url: "https://www.efsa.europa.eu/en/efsajournal/pub/5625" };
const EFSA_PHOSPHATES: Source = { text: "EFSA: Re-evaluation of phosphoric acid and phosphates (E 338-341, E 343, E 450-452), 2019", url: "https://www.efsa.europa.eu/en/efsajournal/pub/5674" };
const EFSA_NITRATE: Source = { text: "EFSA: Re-evaluation of sodium nitrate (E 251) and potassium nitrate (E 252), 2017", url: "https://www.efsa.europa.eu/en/efsajournal/pub/4787" };
const SUCRALOSE: Source = { text: "Schiffman SS et al. Toxicological and pharmacokinetic properties of sucralose-6-acetate and its parent sucralose: in vitro screening assays. J Toxicol Environ Health B, 2023", url: "https://doi.org/10.1080/10937404.2023.2213903" };
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
      "EFSA's 2019 re-evaluation of phosphates set a group safe daily intake of 40 mg per kg of body weight (as phosphorus) and found that many children's estimated intake is above it. The limit does not apply to people with reduced kidney function.",
    ],
    careIf: "People with reduced kidney function.",
    regulation: "Authorised in the EU and the US.",
    sources: [SELLEM, EFSA_PHOSPHATES],
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
  gentle("E471", "Mono- and diglycerides of fatty acids", "Emulsifier", "Bread, cakes, ice cream, margarine and many packaged foods."),
  gentle("E500", "Sodium carbonates", "Raising agent", "Baking powder, biscuits, cocoa and some drinks.", "Includes baking soda"),
  gentle("E551", "Silicon dioxide", "Anti-caking agent", "Powdered seasonings, salt, coffee creamers and supplements."),
  gentle("E160a", "Carotenes", "Colour (orange)", "Margarine, juices, cheese, baked goods and drinks.", "Beta-carotene"),
  gentle("E162", "Beetroot red", "Colour (red, from beets)", "Ice cream, yoghurts, sauces and sweets.", "Betanin"),
  gentle("E163", "Anthocyanins", "Colour (red to purple, from fruit and vegetables)", "Drinks, sweets and jams."),
  gentle("E101", "Riboflavin", "Colour (yellow)", "Cereals, sauces, sweets and drinks.", "Vitamin B2"),
  gentle("E270", "Lactic acid", "Acidity regulator", "Pickles, sauces, drinks and sourdough."),
  gentle("E296", "Malic acid", "Acidity regulator", "Sweets, drinks and fruit products."),
  gentle("E260", "Acetic acid", "Acidity regulator", "Pickles, sauces and dressings.", "The acid in vinegar"),
  gentle("E334", "Tartaric acid", "Acidity regulator", "Wine, sweets, baking powder and drinks."),
  gentle("E410", "Locust bean gum", "Thickener (from seeds)", "Ice cream, dairy desserts and sauces.", "Carob gum"),
  gentle("E414", "Gum arabic", "Thickener (from acacia)", "Sweets, drinks and chewing gum.", "Acacia gum"),
  gentle("E418", "Gellan gum", "Gelling agent", "Plant milks, jellies and drinks."),
  gentle("E406", "Agar", "Gelling agent (from seaweed)", "Jellies, desserts and some sweets."),
  {
    id: "e150a",
    code: "E150a",
    name: "Plain caramel colour",
    kind: "Colour (brown)",
    found: "Whisky, sauces, baked goods and some sweets.",
    level: "little",
    evidence: "None",
    summary: "EFSA set a group safe daily intake for caramel colours in 2011. Plain caramel (E150a) is made without ammonia or sulfites.",
    research: [
      "EFSA's 2011 review covered all four types of caramel colour (E150a to d) and set a group acceptable daily intake of 300 mg per kg of body weight.",
      "It noted that estimated intake could be above that level for some people. In 2012 EFSA refined the estimates with new industry data and found intake was considerably lower than first thought.",
    ],
    topics: [],
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_CARAMEL_2011, EFSA_CARAMEL],
  },
  {
    id: "e150b",
    code: "E150b",
    name: "Caustic sulfite caramel",
    kind: "Colour (brown)",
    found: "Sherry, some spirits and vinegars, and some sauces.",
    level: "little",
    evidence: "None",
    summary: "Part of EFSA's 2011 group safe daily intake for caramel colours. Estimated intake was below it.",
    research: [
      "EFSA's 2011 review set a group acceptable daily intake of 300 mg per kg of body weight for caramel colours E150a to d.",
      "For E150b specifically, estimated intake was below that level.",
    ],
    topics: [],
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_CARAMEL_2011, EFSA_CARAMEL],
  },
  {
    id: "e150c",
    code: "E150c",
    name: "Ammonia caramel colour",
    kind: "Colour (brown)",
    found: "Baked goods, beer, soy sauce and some sauces.",
    level: "some",
    evidence: "Weak",
    summary: "EFSA gave this type its own, lower safe daily intake because of an uncertainty about effects on the immune system.",
    research: [
      "EFSA's 2011 review set a lower limit of 100 mg per kg of body weight for E150c, within the group limit, because of uncertainty about possible effects of a substance in it, called THI, on the immune system.",
      "In 2012 EFSA found intake was lower than first estimated. Toddlers and adults who eat a lot of it, mostly from bakery products and alcoholic drinks, could still go over the limit.",
      "The ammonia types can contain a by-product called 4-methylimidazole (4-MEI). IARC lists 4-MEI as possibly carcinogenic (Group 2B), based only on animal studies.",
    ],
    topics: ["Immune system (uncertainty about one component)", "Intake can exceed the limit for some toddlers and adults", "4-MEI by-product: possibly carcinogenic (IARC, animal studies only)"],
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_CARAMEL_2011, EFSA_CARAMEL, CARAMEL_4MEI],
  },
  {
    id: "e150d",
    code: "E150d",
    name: "Sulfite ammonia caramel colour",
    kind: "Colour (brown)",
    found: "Colas, soft drinks, soy sauce, vinegars, sauces and baked goods.",
    level: "some",
    evidence: "Weak",
    summary: "The most common caramel colour in soft drinks. It can contain 4-MEI, a by-product that IARC lists as possibly carcinogenic, based on animal studies.",
    research: [
      "The ammonia types of caramel colour can contain a by-product called 4-methylimidazole (4-MEI), usually at higher levels in the sulfite ammonia type used in soft drinks. IARC lists 4-MEI as possibly carcinogenic to humans (Group 2B), based only on animal studies.",
      "EFSA's 2011 review set a group acceptable daily intake of 300 mg per kg of body weight for caramel colours. In 2012 EFSA refined its estimates with new industry data and found that combined intake of all caramel colours stayed under that limit for every population group.",
      "A 2015 risk assessment looked at how much 4-MEI people take in from soft drinks.",
    ],
    topics: ["4-MEI by-product: possibly carcinogenic (IARC, animal studies only)"],
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_CARAMEL_2011, EFSA_CARAMEL, CARAMEL_4MEI],
  },
  {
    id: "e127",
    code: "E127",
    name: "Erythrosine",
    also: "Red No. 3",
    kind: "Colour (red)",
    found: "Candy, cake decorations, icing, and some cherries and drinks.",
    level: "restricted",
    evidence: "Weak",
    summary: "The US FDA is withdrawing approval for it in food, because of cancer seen in lab animals. Food use ends on 15 January 2027.",
    research: [
      "In January 2025 the FDA announced it would revoke the authorisation of Red No. 3 in food and ingested drugs, under the Delaney Clause. That law bars additives shown to cause cancer in animals.",
      "Food use ends on 15 January 2027, and ingested drugs on 18 January 2028. Products made before then can stay on shelves. HHS and the FDA have asked companies to remove it sooner.",
      "The decision rests on animal studies, not on cancer shown in people.",
    ],
    topics: ["Cancer in lab animals (basis for the US withdrawal)"],
    regulation: "US approval for food ends 15 January 2027. Rules in other countries differ.",
    sources: [FDA_RED3],
  },
  {
    id: "e443",
    code: "E443",
    name: "Brominated vegetable oil",
    also: "BVO",
    kind: "Stabiliser in citrus drinks",
    found: "Some fruit-flavoured soft drinks, mostly in the US, before the ban.",
    level: "restricted",
    evidence: "Moderate",
    summary: "The US FDA revoked approval in 2024, saying the evidence no longer supports calling it safe.",
    research: [
      "The FDA revoked the authorisation for BVO in food in 2024. It took effect on 2 August 2024. Its only authorised use was to keep flavour oils from separating in fruit-flavoured drinks.",
      "The agency said animal and human data no longer support a conclusion that BVO is safe in food, citing studies run with the National Institutes of Health.",
      "Companies had a year to reformulate or use up stock, so older bottles may still carry it.",
    ],
    topics: ["Withdrawn by the FDA in 2024"],
    regulation: "No longer authorised in US food as of the 2024 rule. Check your own country's rules.",
    sources: [FDA_BVO],
  },
  {
    id: "e320",
    code: "E320",
    name: "Butylated hydroxyanisole",
    also: "BHA",
    kind: "Preservative (antioxidant)",
    found: "Chips, cereals, chewing gum, instant mashed potato and fats and oils.",
    level: "some",
    evidence: "Weak",
    summary: "IARC classes it as possibly carcinogenic, based on animal studies. EFSA set a safe daily intake and found most people's intake from additive use is under it.",
    research: [
      "The International Agency for Research on Cancer (IARC) lists BHA as possibly carcinogenic to humans (Group 2B), based on stomach tumours in rodents fed high doses. IARC found no data on cancer in people. That grouping describes how strong the evidence is, not how much risk there is at the amounts in food.",
      "EFSA's 2011 re-evaluation set an acceptable daily intake of 1.0 mg per kg of body weight, based on effects in rat pups.",
      "A 2012 EFSA statement found intake from additive use is below that level for most groups, but combined intake from additives and food-contact materials could be above it for most groups.",
    ],
    topics: ["Possibly carcinogenic (IARC, based on animal studies)"],
    regulation: "Authorised in the EU and the US, with limits.",
    sources: [IARC_BHA, EFSA_BHA],
  },
  {
    id: "e321",
    code: "E321",
    name: "Butylated hydroxytoluene",
    also: "BHT",
    kind: "Preservative (antioxidant)",
    found: "Cereals, chewing gum, snacks, fats and oils.",
    level: "little",
    evidence: "Weak",
    summary: "EFSA lowered its safe daily intake in 2012 after reviewing animal studies.",
    research: [
      "EFSA's 2012 re-evaluation set an acceptable daily intake of 0.25 mg per kg of body weight, based on rat studies. That is lower than the 0.3 mg per kg set earlier by the WHO and FAO expert committee (JECFA).",
    ],
    topics: ["Lower safe intake set by EFSA in 2012"],
    regulation: "Authorised in the EU and the US, with limits.",
    sources: [EFSA_BHT],
  },
  {
    id: "e200",
    code: "E200",
    name: "Sorbic acid",
    kind: "Preservative",
    found: "Cheese, wine, baked goods, dried fruit and drinks.",
    level: "little",
    evidence: "None",
    summary: "EFSA found no genotoxicity and raised its safe daily intake in 2019. It is often flagged online, but regulators have not found a concern.",
    research: [
      "EFSA's 2015 review found no evidence that sorbic acid or potassium sorbate damages DNA, and no adverse effects in rats at doses up to 9,200 mg per kg of body weight.",
      "In 2019, after a further study, EFSA set a group acceptable daily intake of 11 mg of sorbic acid per kg of body weight for sorbic acid (E200) and potassium sorbate (E202).",
    ],
    topics: [],
    regulation: "Authorised in the EU and the US with limits.",
    sources: [EFSA_SORBATE_2015, EFSA_SORBATE_2019],
  },
  {
    id: "e202",
    code: "E202",
    name: "Potassium sorbate",
    kind: "Preservative",
    found: "Wine, cheese, dried fruit, baked goods, drinks and many sauces.",
    level: "little",
    evidence: "None",
    summary: "EFSA found no genotoxicity and raised its safe daily intake in 2019. Some apps flag it as high-risk, but regulators have not found a concern.",
    research: [
      "EFSA's 2015 review found no evidence that sorbic acid or potassium sorbate damages DNA, and no adverse effects in rats at doses up to 9,200 mg per kg of body weight.",
      "In 2019, after a further study, EFSA set a group acceptable daily intake of 11 mg of sorbic acid per kg of body weight for sorbic acid (E200) and potassium sorbate (E202).",
      "Calcium sorbate (E203) is treated separately because it had too little genotoxicity data.",
    ],
    topics: [],
    regulation: "Authorised in the EU and the US with limits.",
    sources: [EFSA_SORBATE_2015, EFSA_SORBATE_2019],
  },
  phosphate("E338", "Phosphoric acid", "Acidity regulator", "Colas, some other soft drinks, processed cheese and baked goods."),
  phosphate("E340", "Potassium phosphates", "Acidity regulator", "Processed meat, cheese, baked goods and drinks."),
  phosphate("E341", "Calcium phosphates", "Raising agent and anti-caking agent", "Baked goods, powdered mixes and processed foods."),
  phosphate("E450", "Diphosphates", "Raising agent and emulsifier", "Baked goods, processed meat and cheese."),
  phosphate("E451", "Triphosphates", "Emulsifier and stabiliser", "Processed meat, fish and cheese."),
  phosphate("E452", "Polyphosphates", "Emulsifier and stabiliser", "Processed meat, fish, cheese and desserts."),
  {
    id: "e955",
    code: "E955",
    name: "Sucralose",
    kind: "Sweetener",
    found: "Diet and zero-sugar drinks, sugar-free sweets, protein products and tabletop sweeteners.",
    level: "some",
    evidence: "Weak",
    summary: "A 2023 lab study on cells found a by-product could damage DNA. It was done in the lab, and it doesn't show harm in people.",
    research: [
      "A 2023 study (Schiffman et al.) tested sucralose and a related compound, sucralose-6-acetate, on human blood cells and gut tissue in the lab. It reported DNA damage from sucralose-6-acetate and a weakening of the gut lining's tight junctions.",
      "The study used cells in the lab. The authors say it is not known whether the effects happen in people at normal intake.",
    ],
    topics: ["DNA damage in lab tests on cells (not shown in people)", "Gut lining in lab tests"],
    regulation: "Authorised in the EU and the US.",
    sources: [SUCRALOSE],
  },
  {
    id: "e249",
    code: "E249",
    name: "Potassium nitrite",
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
    topics: ["Cancer risk linked to processed meat (strong for the meat, unclear for nitrite)"],
    regulation: "Authorised in the EU and the US for curing meat, with limits on the amount.",
    sources: [IARC_MEAT, EFSA_NITRITE, EFSA_NITRITE_NEWS],
  },
  nitrate("E251", "Sodium nitrate"),
  nitrate("E252", "Potassium nitrate"),
];

function phosphate(code: string, name: string, kind: string, found: string): AdditiveBase {
  return {
    id: code.toLowerCase(),
    code,
    name,
    kind,
    found,
    level: "some",
    evidence: "Weak",
    summary: "EFSA set a group safe daily intake for phosphates in 2019 and found that many children's intake may be above it. People with reduced kidney function should take care.",
    research: [
      "EFSA's 2019 re-evaluation set a group acceptable daily intake of 40 mg per kg of body weight (as phosphorus) for phosphoric acid and phosphates.",
      "Estimated intake was above that level for infants, toddlers and other children on average, and for infants through adolescents at the high end. Food supplements could push it higher.",
      "EFSA said the limit does not apply to people with moderate or severe reduced kidney function. It found no safety concern in infant formula for babies under 16 weeks.",
    ],
    careIf: "People with reduced kidney function.",
    regulation: "Authorised in the EU and the US.",
    sources: [EFSA_PHOSPHATES],
  };
}

function nitrate(code: string, name: string): AdditiveBase {
  return {
    id: code.toLowerCase(),
    code,
    name,
    kind: "Preservative (curing)",
    found: "Cured meats, some cheeses and some vegetables.",
    level: "little",
    evidence: "Weak",
    summary: "EFSA found no safety concern from nitrate used as an additive at current levels. Nitrate in the body can convert to nitrite.",
    research: [
      "EFSA's 2017 re-evaluation found that exposure to nitrate from its use as a food additive was below the acceptable daily intake of 3.7 mg per kg of body weight, and that there is no safety concern at current uses and levels.",
      "Some nitrate is converted to nitrite in the body, which is why EFSA looked at both together. The strongest research link is between eating processed meat and colorectal cancer (IARC, 2015), which is covered under nitrite.",
    ],
    topics: ["Processed meat cancer link (nitrate can convert to nitrite)"],
    regulation: "Authorised in the EU and the US with limits.",
    sources: [EFSA_NITRATE, IARC_MEAT],
  };
}


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

// Benzoates share one set of findings with sodium benzoate.
const E211 = RAW.find((a) => a.id === "e211");
if (E211) {
  RAW.push({ ...E211, id: "e210", code: "E210", name: "Benzoic acid" }, { ...E211, id: "e212", code: "E212", name: "Potassium benzoate" });
}
for (const c of ["e210", "e212"]) TOPICS[c] = TOPICS.e211;
const PHOSPHATE_TOPICS = ["Intake above EFSA's guideline for many children", "Kidney function (people with reduced function)"];
for (const c of ["e338", "e340", "e341", "e450", "e451", "e452"]) TOPICS[c] = PHOSPHATE_TOPICS;
TOPICS.e339 = ["Heart health (one large study, a link only)", ...PHOSPHATE_TOPICS];
TOPICS.e249 = TOPICS.e250;

const LAB_ONLY = new Set(["e466", "e433", "e955"]);

/** The re-researched entries win over any older one with the same id. */
const AUDITED_IDS = new Set(AUDITED.map((a) => a.id));
const codeKey = (code: string): [number, string] => {
  const m = code.match(/^E(\d+)([a-z]*)/i);
  return [m ? Number(m[1]) : 99999, m ? m[2].toLowerCase() : code];
};

export const ADDITIVES: Additive[] = [
  ...RAW.filter((a) => !AUDITED_IDS.has(a.id)).map((a) => ({ ...a, topics: TOPICS[a.id] ?? a.topics ?? [], labOnly: LAB_ONLY.has(a.id) || a.labOnly })),
  ...AUDITED.map((a): Additive => ({ ...a, topics: a.topics ?? [] })),
].sort((a, b) => {
  const [an, as] = codeKey(a.code);
  const [bn, bs] = codeKey(b.code);
  return an - bn || as.localeCompare(bs);
});

const BY_ID = new Map(ADDITIVES.map((a) => [a.id, a]));

/** Find an additive from "E330", "e330", "en:e330" or "E-330". */
export function additiveById(raw: string): Additive | undefined {
  const code = normalizeCode(raw) ?? raw.trim().toLowerCase();
  return BY_ID.get(code) ?? BY_ID.get(SAME_REVIEW[code] ?? "");
}

/** "en:e330" -> "e330". Returns undefined for anything that isn't an E-number. */
export function normalizeCode(raw: string): string | undefined {
  const m = raw.trim().toLowerCase().replace(/^[a-z]{2}:/, "").replace(/[\s-]/g, "").match(/^e(\d{3,4}[a-f]?)(?:[ivx]+)?$/);
  return m ? `e${m[1]}` : undefined;
}

export const LEVEL_ORDER: Record<ConcernLevel, number> = { restricted: 0, some: 1, little: 2 };

/**
 * A five-step scale for how much concern the research and regulators show, worst first.
 * Each step has its own colour AND shape so it reads at a glance, even without colour.
 *
 *  restricted  regulators have acted (removed, withdrawn or restricted)
 *  notable     a real concern backed by moderate or better evidence in people
 *  some        a concern with limited or mixed evidence
 *  minor       a small or early concern (lab or animal studies only, or EFSA noted a limit)
 *  clear       reviewed, and no concern found
 */
export type Tier = "restricted" | "notable" | "some" | "clear";

/**
 * Four steps in the same colours as Yuka: red, orange, yellow, green. The names keep our evidence-first wording.
 * Red follows Yuka's published test: a serious health effect, strong evidence (an official opinion or converging studies),
 * and exposure that may reach levels of concern. A regulator ban counts too.
 */
export const TIERS: Array<{ id: Tier; label: string; short: string; shape: "octagon" | "square" | "diamond" | "triangle" | "circle"; color: string; means: string }> = [
  { id: "restricted", label: "High risk", short: "High risk", shape: "octagon", color: "#f0524f", means: "A serious health effect, backed by strong evidence such as an official opinion, at amounts people may reach. Or a regulator has banned or restricted it." },
  { id: "notable", label: "Moderate risk", short: "Moderate", shape: "square", color: "#f58a3c", means: "Studies point to a possible harm, but the evidence or the amounts people eat don't fully reach the high-risk test." },
  { id: "some", label: "Limited risk", short: "Limited", shape: "triangle", color: "#f2cf3a", means: "Milder effects such as digestive upset or sensitivity, or a suspected risk where the evidence is still thin." },
  { id: "clear", label: "No risk found", short: "No risk found", shape: "circle", color: "#4fbf6b", means: "Regulators and the studies we checked found no risk at the amounts allowed in food. Research continues, so this is not a guarantee." },
];

export const TIER_ORDER: Record<Tier, number> = { restricted: 0, notable: 1, some: 2, clear: 3 };

export function tierOf(a: Pick<Additive, "level" | "evidence" | "labOnly" | "highRisk">): Tier {
  if (a.level === "restricted" || a.highRisk) return "restricted";
  if (a.level === "some") return a.evidence === "Moderate" || a.evidence === "Strong" ? "notable" : "some";
  return a.evidence === "None" ? "clear" : "some";
}

/** The name people see on the pack: "Red 40", not "Allura red AC". The scientific name stays on the detail page. */
export const shownName = (a: Pick<Additive, "name" | "labelName">) => a.labelName ?? a.name;

export const tierInfo = (t: Tier) => TIERS.find((x) => x.id === t)!;

export function searchAdditives(q: string): Additive[] {
  const s = q.trim().toLowerCase();
  if (!s) return ADDITIVES;
  const code = normalizeCode(s);
  return ADDITIVES.filter(
    (a) => a.id === code || a.id.startsWith(s) || a.name.toLowerCase().includes(s) || (a.labelName ?? "").toLowerCase().includes(s) || (a.also ?? "").toLowerCase().includes(s) || a.kind.toLowerCase().includes(s),
  );
}

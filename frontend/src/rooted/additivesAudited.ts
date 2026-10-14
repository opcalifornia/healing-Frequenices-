import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/**
 * Additives re-researched from primary sources (EFSA re-evaluations, FDA and IARC decisions, and published studies).
 * Each was rated with one rule so that related additives agree. See "How we rate" in the scanner.
 * This file replaces the older entries with the same id in additivesContent.ts.
 */
export interface AuditedAdditive {
  id: string;
  code: string;
  name: string;
  /** The name printed on US ingredient labels, when it differs, for example "Red 40" for Allura red AC. */
  labelName?: string;
  highRisk?: boolean;
  also?: string;
  kind: string;
  found: string;
  level: "restricted" | "some" | "little";
  evidence: Strength;
  /** The concern rests only on lab, animal or in-vitro studies so far. */
  labOnly?: boolean;
  summary: string;
  research: string[];
  careIf?: string;
  regulation: string;
  topics: string[];
  /** Where other rating systems differ from regulators, and why. */
  contested?: string;
  sources: Source[];
}

export const AUDITED: AuditedAdditive[] = [
 {
  "id": "e100",
  "code": "E100",
  "name": "Curcumin",
  "also": "Turmeric extract",
  "kind": "Colour (yellow)",
  "found": "Mustard, curry sauces, dairy desserts, drinks, cereals and sweets.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Curcumin is the yellow pigment of turmeric. EFSA set a safe daily intake in 2010 but said some lab genotoxicity findings were not fully settled.",
  "research": [
   "EFSA re-evaluated curcumin (E100) in 2010 and adopted the acceptable daily intake (ADI) of 0 to 3 mg per kg of body weight set earlier by JECFA. It is based on a reproductive study in animals.",
   "The EFSA panel said positive results in lab tests for chromosome damage and DNA adducts should not be ignored. The animal studies available at the time were not enough to remove that doubt.",
   "EFSA later refined its exposure estimates. Adults were found to take in less than first thought, but high consumers in some surveys came close to or above the ADI.",
   "Most of the discussion about curcumin and the liver concerns high-dose supplements, often with piperine added to raise absorption. The UK COT committee said exceeding the ADI could pose a risk, especially for people with liver or bile duct problems or who take medicines. Those doses are far above colour use."
  ],
  "careIf": "People with liver, gall bladder or bile duct problems, and anyone taking medicines, when using curcumin supplements. This concerns supplements, not the small amounts used as a colour.",
  "regulation": "Authorised as a colour in the EU (E100) and the US (turmeric and turmeric oleoresin as colour additives exempt from certification).",
  "topics": [
   "Genotoxicity (lab studies, not settled)"
  ],
  "contested": "Consumer databases usually rate curcumin as low risk because turmeric is a long-used food. That fits the regulator view for colour use. The caution is mostly about concentrated supplements.",
  "sources": [
   {
    "text": "UK COT committee. Statement on curcumin in food supplements",
    "url": "https://cot.food.gov.uk/print/pdf/node/13116"
   }
  ]
 },
 {
  "id": "e101",
  "code": "E101",
  "name": "Riboflavin",
  "labelName": "Riboflavin (vitamin B2)",
  "also": "Vitamin B2, riboflavin-5'-phosphate",
  "kind": "Colour (yellow)",
  "found": "Cereals, sauces, sweets, drinks and fortified foods.",
  "level": "little",
  "evidence": "None",
  "summary": "Riboflavin is vitamin B2. EFSA found no genotoxicity concern and no adverse effects in the animal studies it reviewed.",
  "research": [
   "EFSA re-evaluated riboflavin (E101i) and riboflavin-5'-phosphate (E101ii) in 2013. It found no adverse effects in two 90-day rat studies and no genotoxicity concern.",
   "EFSA did not set an ADI because long-term and reproductive studies were missing. It noted that the database could not show what very high intakes from all sources would do. The body clears excess riboflavin in urine, and no credible harm signal from food use was found."
  ],
  "regulation": "Authorised in the EU (E101) and the US as a colour additive and a nutrient.",
  "topics": [],
  "contested": "CSPI and consumer apps generally treat riboflavin as safe, which matches the regulators.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of riboflavin (E 101(i)) and riboflavin-5'-phosphate sodium (E 101(ii)) as food additives. EFSA Journal, 2013",
    "url": "https://www.efsa.europa.eu/pt/efsajournal/pub/3357"
   },
   {
    "text": "EFSA ANS Panel. Riboflavin re-evaluation (open-access copy), 2013",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009745"
   }
  ]
 },
 {
  "id": "e102",
  "code": "E102",
  "name": "Tartrazine",
  "labelName": "Yellow 5",
  "highRisk": true,
  "also": "Yellow 5 in the US",
  "kind": "Colour",
  "found": "Fizzy drinks, sweets, desserts, crisps and sauces.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 7.5 mg per kg of body weight per day. Refined intake estimates at maximum reported use levels were below it. EFSA noted that tartrazine can trigger intolerance reactions in a small fraction of people, possibly at doses within the ADI."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V).  In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether. Where views differ: Rated high risk to match Yuka, which cites studies linking it to hyperactivity and attention problems in children and says a 1964 safety study never looked at behaviour. EFSA kept its daily limit unchanged in 2009 and no regulator has banned it for sale; the EU requires a warning label.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of tartrazine (E 102), 2009",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/1331"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   },
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e104",
  "code": "E104",
  "name": "Quinoline yellow",
  "kind": "Colour",
  "found": "Sweets, drinks, ice lollies and coated snacks.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 0.5 mg per kg of body weight per day (EFSA lowered it from 10 in 2009). In 2009 intake estimates were generally well above the new ADI, so the EU cut maximum levels in many foods. EFSA's 2015 refined assessment found mean and high intake below the ADI for all groups."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V). Maximum levels for this colour were lowered in the EU in 2012. In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment for quinoline yellow (E 104), 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4070"
   },
   {
    "text": "Commission Regulation (EU) No 232/2012 (lower use levels for E 104 and E 124)",
    "url": "https://eur-lex.europa.eu/eli/reg/2012/232/oj/eng"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   }
  ]
 },
 {
  "id": "e110",
  "code": "E110",
  "name": "Sunset yellow FCF",
  "labelName": "Yellow 6",
  "highRisk": true,
  "also": "Yellow 6 in the US",
  "kind": "Colour",
  "found": "Orange drinks, sweets, biscuits and snacks.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 4 mg per kg of body weight per day. In 2009 EFSA set a temporary ADI of 1 mg/kg and noted children could exceed it. In 2014 it reconsidered after new studies, raised the ADI to 4 mg/kg (matching JECFA), and found exposure well below it for all groups."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V).  In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether. Where views differ: Rated high risk to match Yuka. EFSA lowered its daily limit in 2009, and children's high intakes were estimated to exceed it before limits were tightened in 2011. California's OEHHA lists it among dyes with behaviour effects in some children. No regulator has banned it for sale; the EU requires a warning label.",
  "sources": [
   {
    "text": "EFSA. Reconsideration of the temporary ADI and refined exposure assessment for sunset yellow FCF (E 110), 2014",
    "url": "https://www.efsa.europa.eu/et/efsajournal/pub/3765"
   },
   {
    "text": "EFSA. Sunset yellow: EFSA sets ADI (news), 2014",
    "url": "https://www.efsa.europa.eu/es/press/news/140715"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   },
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e120",
  "code": "E120",
  "name": "Carmine",
  "also": "Cochineal, carminic acid, natural red 4",
  "kind": "Colour (red)",
  "found": "Yoghurts, sweets, drinks, some meat products, ice cream and cosmetics.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Carmine is a red dye made from crushed cochineal insects. It can cause allergic reactions in some people, occasionally severe.",
  "research": [
   "Origin: carmine is made from the dried bodies of female cochineal insects. It is not suitable for vegans or vegetarians, and the insect origin matters for some religious diets.",
   "EFSA re-evaluated carmine in 2015. It kept the ADI of 5 mg carmine per kg of body weight (about 2.5 mg carminic acid) and noted estimated intakes were below it. EFSA also said no safe threshold can be set for allergic reactions and that proteins from the insect should be removed by purification.",
   "In the US, the FDA required carmine and cochineal extract to be named on labels from 2011 after reports of severe allergic reactions, including anaphylaxis. Case reports exist, so the risk is real but affects few people."
  ],
  "careIf": "People with allergies to carmine or cochineal, and possibly people with insect allergies. Vegans and vegetarians avoid it for ethical reasons.",
  "regulation": "Authorised in the EU (E120). In the US it must be named on food labels as cochineal extract or carmine.",
  "topics": [
   "Allergic reactions (case reports, can be severe)"
  ],
  "contested": "CSPI rates carmine and cochineal 'Certain people should avoid' because of allergic reactions. That agrees with the regulators: they accept it for most people but require clear labelling. It is a hypersensitivity issue, not a general toxicity one.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of cochineal, carminic acid, carmines (E 120) as a food additive. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4288"
   },
   {
    "text": "FDA. Listing of color additives exempt from certification; food labeling: cochineal extract and carmine. Federal Register, 2009",
    "url": "https://www.govinfo.gov/content/pkg/FR-2009-01-05/html/E8-31253.htm"
   },
   {
    "text": "CSPI. Chemical Cuisine: carmine and cochineal",
    "url": "https://www.cspinet.org/article/carminecochineal"
   }
  ]
 },
 {
  "id": "e122",
  "code": "E122",
  "name": "Carmoisine",
  "also": "Azorubine",
  "kind": "Colour",
  "found": "Jelly, sweets, jams and some desserts.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 4 mg per kg of body weight per day. In 2009 high-intake children aged 1 to 10 could slightly exceed it. EFSA's 2015 refined assessment found the ADI was not exceeded for any group. EFSA found no genotoxicity concern."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V).  In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of azorubine/carmoisine (E 122), 2009",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/1332"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   }
  ]
 },
 {
  "id": "e123",
  "code": "E123",
  "name": "Amaranth",
  "labelName": "Red 2",
  "also": "Red No. 2 (a different dye from Allura red)",
  "kind": "Colour (red)",
  "found": "Aperitif wines and spirits, fish roe and some other products.",
  "level": "restricted",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA lowered its safe daily intake in 2010 and found no sign of DNA damage or cancer. It is not allowed in US food, and little of it is used in the EU.",
  "research": [
   "EFSA re-evaluated amaranth in 2010 and set a safe daily intake (ADI) of 0.15 mg per kg of body weight, lower than earlier limits of 0.5 (JECFA) and 0.8 (EU scientific committee). The new value came from a 2-year study and reproduction studies in animals.",
   "EFSA found it was not genotoxic and not carcinogenic. It estimated children's intake was around 30 times below the ADI, but adults who drink a lot of amaranth-coloured aperitif drinks could reach several times the ADI at the high end.",
   "A later EFSA refined assessment, using better data, found high-end adult intake roughly 15 times lower than first estimated, and all groups below the ADI."
  ],
  "regulation": "Authorised in the EU for a few uses such as aperitif wines, spirits and fish roe. In the US, FDA removed it (as Red No. 2) in 1976, so it is not used in US food. Check your own country's rules.",
  "topics": [
   "Intake above the safe level for some adults (2010 estimate, later revised)"
  ],
  "contested": "Consumer databases that class it as high risk are mostly reacting to its US ban and its azo-dye family, not to a confirmed harm. EFSA found no genotoxicity or cancer, and later intake estimates fell below the ADI. We rate it restricted only because a major regulator does not allow it, and rate the evidence as weak.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of amaranth (E 123) as a food additive, 2010",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/1649"
   },
   {
    "text": "EFSA. Refined exposure assessment for amaranth (E 123)",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/3442"
   },
   {
    "text": "EFSA. EFSA lowers ADI on amaranth (news), 2010",
    "url": "https://www.efsa.europa.eu/en/press/news/100726"
   }
  ]
 },
 {
  "id": "e124",
  "code": "E124",
  "name": "Ponceau 4R",
  "kind": "Colour",
  "found": "Sweets, desserts, drinks and processed meats.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 0.7 mg per kg of body weight per day (EFSA lowered it in 2009 after kidney findings in mice). In 2009 adults at high intake and children could exceed it, so the EU withdrew or cut use levels in dozens of food categories from June 2013. EFSA's 2015 refined assessment found no group above the ADI."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V). Many maximum levels for this colour were withdrawn or cut in the EU from 2013. In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment for Ponceau 4R (E 124), 2015",
    "url": "https://www.efsa.europa.eu/it/efsajournal/pub/4073"
   },
   {
    "text": "Commission Regulation (EU) No 232/2012 (lower use levels for E 104 and E 124)",
    "url": "https://eur-lex.europa.eu/eli/reg/2012/232/oj/eng"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   }
  ]
 },
 {
  "id": "e127",
  "code": "E127",
  "name": "Erythrosine",
  "labelName": "Red 3",
  "also": "Red No. 3",
  "kind": "Colour (red)",
  "found": "Cocktail and glace cherries, candy, cake decorations, icing, and some drinks and medicines.",
  "level": "restricted",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "The US FDA is withdrawing approval for it in food because it caused thyroid tumours in male rats. FDA and EFSA both say the rat finding is not expected to apply to people.",
  "research": [
   "In January 2025 FDA announced it would revoke authorisation of Red No. 3 in food and ingested drugs under the Delaney Clause. That 1958 law bars any additive found to cause cancer in animals, whatever the dose or mechanism.",
   "The finding came from high-dose studies in male rats, where the dye disturbs thyroid hormones and leads to thyroid tumours. FDA said this mechanism is specific to rats and that it does not expect it in people. It acted because the law left no choice, not because it found a new risk to people.",
   "EFSA's 2011 re-evaluation reached a similar view: the rat thyroid tumours stem from effects on thyroid function, not DNA damage, and are of limited relevance to humans. It kept a low safe daily intake of 0.1 mg per kg of body weight, and found current exposure raised no safety concern.",
   "Food use must end by 15 January 2027 (ingested drugs 18 January 2028). Products made earlier can stay on shelves. California's separate food law (AB 418) also bars it from 2027, and West Virginia's dye law covers it."
  ],
  "regulation": "US food approval ends 15 January 2027 (FDA, under the Delaney Clause). It is still authorised in the EU for a small number of uses, under a low safe daily intake. Check your own country's rules.",
  "topics": [
   "Thyroid tumours in male rats (basis for the US withdrawal; not shown in people)"
  ],
  "contested": "FDA's own statement says the animal finding is not expected to occur in people, so the US withdrawal is a legal step as much as a safety finding. Consumer groups such as CSPI have long asked for it to be banned and rate it among the dyes to avoid. EFSA regards the rat effect as of limited human relevance. We list it as restricted because a major regulator is withdrawing it, but the underlying evidence is animal-only.",
  "sources": [
   {
    "text": "FDA. Revoking authorization for Red No. 3 in food and ingested drugs, 2025",
    "url": "https://www.fda.gov/food/hfp-constituent-updates/fda-revoke-authorization-use-red-no-3-food-and-ingested-drugs"
   }
  ]
 },
 {
  "id": "e128",
  "code": "E128",
  "name": "Red 2G",
  "kind": "Colour (red)",
  "found": "Formerly breakfast sausages and burger meat in the EU. No longer permitted.",
  "level": "restricted",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "Suspended in the EU in 2007 after EFSA raised a cancer concern about aniline, a substance the body can form from it. It is not an approved food colour.",
  "research": [
   "In July 2007 EFSA re-evaluated Red 2G. It was only permitted in breakfast sausages with some cereal and in burger meat with some vegetable or cereal content.",
   "EFSA drew on an EU risk assessment of aniline, which the body can form from this dye. That assessment said aniline should be treated as a carcinogen for which a DNA-damaging mechanism cannot be excluded. The concern is based on chemistry and animal work, not on cases in people.",
   "The European Commission suspended its use as an emergency measure (Regulation 884/2007) in July 2007."
  ],
  "regulation": "Suspended in the EU since 2007 and not on the EU list of authorised food colours. Reported as not permitted in several other countries; check your own country's rules.",
  "topics": [
   "Possible DNA damage via aniline (EFSA, lab and animal basis)"
  ],
  "contested": "Consumer apps often show it as high risk, which matches the regulatory position. The evidence is indirect (a breakdown product), so we mark it as weak evidence even though it is restricted.",
  "sources": [
   {
    "text": "FoodNavigator. EFSA condemns Red 2G colour as carcinogen, 2007",
    "url": "https://www.foodnavigator.com/Article/2007/07/10/efsa-condemns-red-2g-colour-as-carcinogen/"
   }
  ]
 },
 {
  "id": "e129",
  "code": "E129",
  "name": "Allura red AC",
  "labelName": "Red 40",
  "highRisk": true,
  "also": "Red 40 in the US",
  "kind": "Colour",
  "found": "Sweets, drinks, cereals and snack foods.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Linked to hyperactivity and inattention in some children. A California state review (2021) concluded synthetic dyes can affect children's behaviour, the EU requires a warning label, and US regulators are asking industry to phase them out.",
  "research": [
   "A 2007 randomised, double-blind trial in the UK (McCann et al.) gave children drinks containing a mix of artificial colours plus sodium benzoate. Some groups showed a small rise in hyperactive behaviour compared with a placebo drink. The effect was small and came from mixtures, so it cannot be pinned on one colour.",
   "EFSA reviewed this study and judged it could not be used to change the safe daily intake of this colour. EFSA's 2009 re-evaluation also said a small number of people may react to colours of this type.",
   "In 2021 the California Office of Environmental Health Hazard Assessment (OEHHA) reviewed 27 clinical trials in children, 25 of them challenge studies. It concluded that synthetic food dyes can affect behaviour in some children, and that children differ in how sensitive they are. In a journal review by the same group, 16 of the 25 challenge studies (64%) found some association with hyperactivity or inattention, and 13 (52%) found a statistically significant one. The effects were small on average, and not every study found them.",
   "EFSA's safe daily intake (ADI) for this colour is 7 mg per kg of body weight per day. In 2009 intake in children aged 1 to 10 could exceed it. EFSA's refined assessment later found no group above the ADI. In 2013 EFSA looked at a mouse genotoxicity study and said it was not enough to change the ADI, and asked for more data on related azo dyes."
  ],
  "careIf": "Children, and families who notice a link between brightly coloured foods and behaviour. The EU label rule names children's activity and attention.",
  "regulation": "In the EU, foods with this colour must carry the warning that it \"may have an adverse effect on activity and attention in children\" (Regulation 1333/2008, Annex V).  In the US, FDA has asked industry to phase out the remaining petroleum-based colours by the end of 2026. This is voluntary, not a ban. Some states have acted on their own: West Virginia restricts seven dyes in school meals (from August 2025) and in food sales (from 2028), and California's school food law (AB 2316) covers six dyes from the end of 2027.",
  "topics": [
   "Children's attention and activity (challenge trials, small effects)",
   "Label warning required in the EU",
   "Sensitivity reactions in a small number of people"
  ],
  "contested": "We rate this dye a notable concern, a step above most other additives, because of the state-agency review, the EU warning label and the US phase-out request. Regulators have not banned it: EFSA kept its safe daily intake and the FDA's phase-out is voluntary. The evidence is real but the effect is small on average and concentrated in sensitive children, and the trials used mixtures of dyes, so one dye can't be singled out. Consumer groups such as CSPI go further and urge avoiding artificial dyes altogether. Where views differ: Rated high risk to match Yuka. Its test found 5 of 13 products tested exceeded California OEHHA's daily safety level for children in one serving. OEHHA reviewed over 300 studies and said the safe daily amount could be up to 100 times lower than the current US limit. EFSA's 2015 refined assessment found estimated intakes under its own, higher limit, and no regulator has banned it for sale.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment for Allura red AC (E 129)",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4007"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "CSPI. CSPI urges FDA to ban artificial food dyes linked to behavior problems",
    "url": "https://www.cspinet.org/node/2617"
   },
   {
    "text": "OEHHA (California). Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://oehha.ca.gov/sites/default/files/media/downloads/risk-assessment/report/healthefftsassess041621.pdf"
   },
   {
    "text": "Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence. Environmental Health, 2022",
    "url": "https://link.springer.com/article/10.1186/s12940-022-00849-9"
   },
   {
    "text": "CSPI: FDA's plan to remove food dyes (advocacy group summary)",
    "url": "https://www.cspi.org/cspi-news/fdas-plan-remove-food-dyes-industry-understanding"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e131",
  "code": "E131",
  "name": "Patent blue V",
  "kind": "Colour (blue)",
  "found": "Some sweets, drinks and Scotch eggs in the EU.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA lowered its safe daily intake in 2013. At maximum permitted levels, toddlers and children with high intake could exceed it, so it is worth keeping to a small part of the diet.",
  "research": [
   "EFSA re-evaluated Patent blue V in 2013 and set a safe daily intake (ADI) of 5 mg per kg of body weight, based on a mouse study. The older EU figure was 15.",
   "The Panel found no concern about cancer or DNA damage. At maximum permitted use levels, high-intake toddlers and children could be above the ADI, while adults were unlikely to be.",
   "Allergic reactions have been reported with this dye in rare cases; we did not find a regulator limit based on this in food. Our searches could not confirm EFSA's wording on that point."
  ],
  "regulation": "Authorised in the EU. Not approved in several other countries, reportedly including the US, Canada, Australia and Japan; check your own country's rules.",
  "topics": [
   "Intake above the safe level for some children at maximum permitted levels (estimate)"
  ],
  "contested": "Some apps flag this dye because several countries do not allow it. The reason given in the press is possible allergic reactions. We found no regulator conclusion of harm at current EU use, so we rate it low concern with weak evidence.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of Patent Blue V (E 131) as a food additive, 2013",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2818"
   }
  ]
 },
 {
  "id": "e132",
  "code": "E132",
  "name": "Indigo carmine",
  "labelName": "Blue 2",
  "also": "Indigotine",
  "kind": "Colour (blue)",
  "found": "Sweets, ice cream, biscuits and some drinks.",
  "level": "little",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA confirmed a safe daily intake of 5 mg per kg of body weight in 2014 and again in 2023, after a study checking an earlier worry about the testes did not repeat it.",
  "research": [
   "EFSA re-evaluated indigo carmine in 2014 and kept the JECFA safe daily intake (ADI) of 5 mg/kg. The only adverse finding was in the testes of animals in a single old study, which EFSA judged flawed. It asked for new data.",
   "In 2023 EFSA reviewed a new 56-day study using 88% pure colour. It did not confirm the earlier testis effects, and EFSA confirmed the ADI and tightened the specifications.",
   "At maximum permitted levels, high-intake toddlers and children could exceed the ADI. Estimates using real use data did not show an exceedance."
  ],
  "regulation": "Authorised in the EU, and approved in the US as FD&C Blue No. 2. Check your own country's rules.",
  "topics": [
   "Testis effects in one old animal study (not confirmed in 2023)"
  ],
  "contested": "CSPI advises avoiding artificial dyes in general, and its summaries cite the 2021 California OEHHA review linking synthetic dyes to behaviour problems in some children. The OEHHA review covered the dyes used in US food and did not single out this one. EFSA found no behaviour signal for this colour specifically, so we keep it at a low level.",
  "sources": [
   {
    "text": "EFSA. Follow-up of the re-evaluation of indigo carmine (E 132), 2023",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/8103"
   },
   {
    "text": "EFSA. Re-evaluation of indigo carmine (E 132), 2014",
    "url": "https://www.efsa.europa.eu/it/efsajournal/pub/3768"
   }
  ]
 },
 {
  "id": "e133",
  "code": "E133",
  "name": "Brilliant blue FCF",
  "labelName": "Blue 1",
  "also": "Blue 1 in the US",
  "kind": "Colour (blue)",
  "found": "Sweets, ice cream, drinks, cake icing and mouth-rinse products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily intake of 6 mg per kg of body weight in 2010. Intake was under it in the refined estimate.",
  "research": [
   "EFSA re-evaluated brilliant blue FCF in 2010 and set a safe daily intake (ADI) of 6 mg/kg from a rat study. JECFA later set the same value.",
   "In the first, rough estimate, children at the 95th percentile were above the ADI. The refined estimate using reported use levels was below it.",
   "We found no recent human study singling out this colour. It is included in the 2021 California review of synthetic dyes and children's behaviour."
  ],
  "regulation": "Authorised in the EU and approved in the US as FD&C Blue No. 1. Check your own country's rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "CSPI advises avoiding artificial dyes in general, and its summaries cite the 2021 California OEHHA review linking synthetic dyes to behaviour problems in some children. The OEHHA review covered the dyes used in US food and did not single out this one. EFSA found no behaviour signal for this colour specifically, so we keep it at a low level.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of brilliant blue FCF (E 133), 2010",
    "url": "https://efsa.europa.eu/sv/efsajournal/pub/1853"
   },
   {
    "text": "California OEHHA. Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children, 2021",
    "url": "https://www.oehha.ca.gov/risk-assessment/report/health-effects-assessment-potential-neurobehavioral-effects-synthetic-food-dyes-children"
   },
   {
    "text": "CSPI. Chemical Cuisine: artificial colorings (synthetic food dyes)",
    "url": "https://www.cspinet.org/article/artificial-colorings-synthetic-food-dyes"
   }
  ]
 },
 {
  "id": "e140",
  "code": "E140",
  "name": "Chlorophylls",
  "also": "Chlorophyllins (E140ii)",
  "kind": "Colour (green)",
  "found": "Sweets, ice cream, drinks, sauces and pasta.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Chlorophyll is the green pigment of plants. Safety work on the chlorophyllin forms is still open at EFSA.",
  "research": [
   "Chlorophylls are green plant pigments that people eat daily in vegetables. EFSA lists work on chlorophylls and chlorophyllins (E140, E141) as ongoing, including a request about chlorophyllins.",
   "We could not retrieve the text of the EFSA opinion on plain chlorophylls (E140i), so this entry does not state an ADI. The related copper complexes (E141) have more data gaps; see that entry."
  ],
  "regulation": "Authorised in the EU (E140) and, in some forms, in the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Consumer databases generally rate plain chlorophyll as low concern. Chlorophyllins and copper complexes get more caution because of data gaps.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of chlorophylls and copper complexes (EFSA Journal, 2015)",
    "url": "https://www.efsa.europa.eu/ga/efsajournal/pub/4151"
   },
   {
    "text": "EFSA. Update on the working group on re-evaluation, July 2026 (annex)",
    "url": "https://www.efsa.europa.eu/sites/default/files/2026-07/Annex%20VI_12.3%20Update%20on%20the%20WG%20re-evaluation-Follow-up_%201-2%20July%202026_0.pdf"
   }
  ]
 },
 {
  "id": "e141",
  "code": "E141",
  "name": "Copper complexes of chlorophylls and chlorophyllins",
  "kind": "Colour (green)",
  "found": "Sweets, ice cream, drinks, sauces and some canned vegetables.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA said in 2015 that safety could not be assessed because reliable studies were missing. This is a data gap, not a proven harm.",
  "research": [
   "EFSA re-evaluated the copper complexes in 2015. It noted that their manufacturing means they cannot be treated as natural compounds.",
   "Very few studies exist on the copper chlorophylls. EFSA found data on absorption, genotoxicity, long-term effects, cancer and reproduction lacking or inadequate, and did not set an ADI.",
   "EFSA has further work open on the chlorophyllin forms. Because the data are missing, the rating reflects uncertainty rather than a confirmed effect."
  ],
  "regulation": "Authorised in the EU (E141) and for limited uses in the US.",
  "topics": [
   "Safety could not be assessed (data gaps)"
  ],
  "contested": "Some consumer apps and groups rate this more strictly than plain chlorophyll because EFSA could not conclude. That is fair, since the problem is missing data, but it does not show that harm occurs.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of copper complexes of chlorophylls (E 141(i)) and chlorophyllins (E 141(ii)) as food additives. EFSA Journal, 2015",
    "url": "https://www.efsa.europa.eu/ga/efsajournal/pub/4151"
   }
  ]
 },
 {
  "id": "e142",
  "code": "E142",
  "name": "Green S",
  "kind": "Colour (green)",
  "found": "Sweets, mint sauce, canned peas and some desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA kept the safe daily intake of 5 mg per kg of body weight in 2010 but noted that its DNA-damage data were thin.",
  "research": [
   "EFSA re-evaluated Green S in 2010 and kept the safe daily intake (ADI) of 5 mg/kg set in 1984. JECFA has never set a permanent ADI for it.",
   "The genotoxicity data were judged inadequate. EFSA considered that negative cancer and reproduction studies offset this gap.",
   "At the first, rough estimates, high-intake children were above the ADI. The refined estimate was not."
  ],
  "regulation": "Authorised in the EU. Check your own country's rules.",
  "topics": [
   "Thin DNA-damage data (EFSA data gap)"
  ],
  "contested": "Apps that rate it higher usually count it among the synthetic azo-type dyes. EFSA kept its intake limit and found no cancer signal, so we rate it low concern with a data gap.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of Green S (E 142), 2010 (record)",
    "url": "https://cris.unibo.it/handle/11585/93176"
   }
  ]
 },
 {
  "id": "e150a",
  "code": "E150a",
  "name": "Plain caramel colour",
  "labelName": "Caramel color",
  "kind": "Colour (brown)",
  "found": "Whisky, sauces, baked goods and some sweets.",
  "level": "little",
  "evidence": "None",
  "summary": "Plain caramel is made by heating sugar without ammonia or sulfites. It sits under EFSA's group safe intake for caramel colours.",
  "research": [
   "EFSA's 2011 review covered all four caramel types (E150a to d) and set a group ADI of 300 mg per kg of body weight.",
   "EFSA noted that high consumers could exceed some of the limits at maximum reported use levels. In 2012 it refined the estimates with new industry data and found intake considerably lower than first thought.",
   "E150a is made without ammonia, so it does not carry the 4-MEI by-product issue of E150c and E150d."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "contested": "CSPI's concern focuses on the ammonia types (E150c, E150d). Plain caramel is generally seen as the least problematic type.",
  "sources": [
   {
    "text": "EFSA. Scientific Opinion on the re-evaluation of caramel colours (E 150 a,b,c,d) as food additives. EFSA Journal, 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2004"
   },
   {
    "text": "EFSA. Caramel colours reviewed (news release). EFSA, 2011",
    "url": "https://www.efsa.europa.eu/en/press/news/ans110308"
   },
   {
    "text": "EFSA. Caramel colours: consumer exposure lower than previously estimated. EFSA, 2012",
    "url": "https://www.efsa.europa.eu/en/press/news/121219"
   }
  ]
 },
 {
  "id": "e150b",
  "code": "E150b",
  "name": "Caustic sulfite caramel colour",
  "labelName": "Caramel color",
  "kind": "Colour (brown)",
  "found": "Sherry, some spirits and vinegars, and some sauces.",
  "level": "little",
  "evidence": "None",
  "summary": "Made with sulfites but no ammonia. It sits under EFSA's group safe intake, with estimated intake below it.",
  "research": [
   "EFSA's 2011 review set a group ADI of 300 mg per kg of body weight for caramel colours E150a to d.",
   "E150b is made without ammonia, so it is not a significant source of 4-MEI. Estimated intake for this type was below the group limit.",
   "It is made with sulfite compounds. Residual sulfite is low, but people with sulfite sensitivity may notice labels."
  ],
  "careIf": "People with sulfite-sensitive asthma may want to check labels.",
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "contested": "CSPI's caramel concern centres on the ammonia types. E150b is not usually singled out.",
  "sources": [
   {
    "text": "EFSA. Scientific Opinion on the re-evaluation of caramel colours (E 150 a,b,c,d) as food additives. EFSA Journal, 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2004"
   },
   {
    "text": "EFSA. Caramel colours reviewed (news release). EFSA, 2011",
    "url": "https://www.efsa.europa.eu/en/press/news/ans110308"
   },
   {
    "text": "EFSA. Caramel colours: consumer exposure lower than previously estimated. EFSA, 2012",
    "url": "https://www.efsa.europa.eu/en/press/news/121219"
   }
  ]
 },
 {
  "id": "e150c",
  "code": "E150c",
  "name": "Ammonia caramel colour",
  "labelName": "Caramel color",
  "kind": "Colour (brown)",
  "found": "Baked goods, beer, soy sauce and some sauces.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA gave this type its own lower safe daily intake because of uncertainty about immune effects. It can contain 4-MEI, which IARC lists as possibly carcinogenic from animal studies.",
  "research": [
   "EFSA's 2011 review set a lower limit of 100 mg per kg of body weight for E150c, inside the 300 mg group limit. The reason was possible effects of a by-product called THI on white blood cell counts in rats.",
   "In 2012 EFSA found intake was lower than first estimated. Some toddlers and adults who eat a lot of it, mostly from bakery products and alcoholic drinks, could still go over the E150c limit.",
   "Ammonia caramel can contain 4-methylimidazole (4-MEI). IARC lists 4-MEI as possibly carcinogenic to humans (Group 2B) based on lung tumours in mice, with no human data. EFSA judged the highest possible 4-MEI intake from E150c and E150d not a concern and kept the existing limits."
  ],
  "regulation": "Authorised in the EU and the US. California lists 4-MEI under Proposition 65 (listed 2011, 29 micrograms per day safe harbour level).",
  "topics": [
   "Immune system (animal studies, one by-product)",
   "Intake can exceed the limit for some toddlers and adults",
   "4-MEI: possibly carcinogenic (IARC 2B, animal studies only)"
  ],
  "contested": "The Center for Science in the Public Interest (CSPI) has long pushed to limit ammonia-process caramel colours because of 4-MEI. A Boston University summary of CSPI's guide lists caramel colouring among additives to avoid. EFSA was less concerned: it judged the highest possible 4-MEI intake from E150c and E150d not to be a concern and kept the existing limits on 4-MEI in the specifications. The difference is partly about precaution. The rodent findings are real but come from high doses, and no human cancer data link 4-MEI to disease.",
  "sources": [
   {
    "text": "EFSA. Scientific Opinion on the re-evaluation of caramel colours (E 150 a,b,c,d) as food additives. EFSA Journal, 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2004"
   },
   {
    "text": "EFSA. Caramel colours reviewed (news release). EFSA, 2011",
    "url": "https://www.efsa.europa.eu/en/press/news/ans110308"
   },
   {
    "text": "EFSA. Caramel colours: consumer exposure lower than previously estimated. EFSA, 2012",
    "url": "https://www.efsa.europa.eu/en/press/news/121219"
   },
   {
    "text": "OEHHA (California). 4-Methylimidazole findings and Proposition 65 no significant risk level, 2011",
    "url": "https://oehha.ca.gov/media/100711_4MEIfindings.pdf"
   }
  ]
 },
 {
  "id": "e150d",
  "code": "E150d",
  "name": "Sulfite ammonia caramel colour",
  "labelName": "Caramel color",
  "kind": "Colour (brown)",
  "found": "Colas, soft drinks, soy sauce, vinegars, sauces and baked goods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "The caramel colour used in most colas. It can contain 4-MEI, which IARC lists as possibly carcinogenic based on animal studies only.",
  "research": [
   "Sulfite ammonia caramel can contain 4-methylimidazole (4-MEI), mostly in soft drinks. IARC lists 4-MEI as possibly carcinogenic to humans (Group 2B) based on lung tumours in mice. The US NTP found clear evidence in mice. There are no human cancer data.",
   "California added 4-MEI to its Proposition 65 list in 2011, with a safe harbour level of 29 micrograms per day. Products above that level need a warning. Many soft drink makers lowered 4-MEI in their caramel colour after that.",
   "EFSA's 2011 review set a group ADI of 300 mg per kg of body weight and judged the highest possible 4-MEI exposure from E150c and E150d not a concern. In 2012 EFSA found intakes considerably lower than first thought.",
   "A 2015 risk assessment looked at how much 4-MEI people take in from soft drinks."
  ],
  "regulation": "Authorised in the EU and the US. 4-MEI is on California's Proposition 65 list.",
  "topics": [
   "4-MEI by-product: possibly carcinogenic (IARC 2B, animal studies only)"
  ],
  "contested": "The Center for Science in the Public Interest (CSPI) has long pushed to limit ammonia-process caramel colours because of 4-MEI. A Boston University summary of CSPI's guide lists caramel colouring among additives to avoid. EFSA was less concerned: it judged the highest possible 4-MEI intake from E150c and E150d not to be a concern and kept the existing limits on 4-MEI in the specifications. The difference is partly about precaution. The rodent findings are real but come from high doses, and no human cancer data link 4-MEI to disease.",
  "sources": [
   {
    "text": "EFSA. Scientific Opinion on the re-evaluation of caramel colours (E 150 a,b,c,d) as food additives. EFSA Journal, 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2004"
   },
   {
    "text": "EFSA. Caramel colours reviewed (news release). EFSA, 2011",
    "url": "https://www.efsa.europa.eu/en/press/news/ans110308"
   },
   {
    "text": "EFSA. Caramel colours: consumer exposure lower than previously estimated. EFSA, 2012",
    "url": "https://www.efsa.europa.eu/en/press/news/121219"
   },
   {
    "text": "Caramel color in soft drinks and exposure to 4-methylimidazole: a quantitative risk assessment. PLoS One, 2015",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4333292/"
   },
   {
    "text": "OEHHA (California). 4-Methylimidazole findings and Proposition 65 no significant risk level, 2011",
    "url": "https://oehha.ca.gov/media/100711_4MEIfindings.pdf"
   }
  ]
 },
 {
  "id": "e151",
  "code": "E151",
  "name": "Brilliant black BN",
  "kind": "Colour (black)",
  "found": "Sauces, desserts, sweets, drinks and fish roe.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA kept a safe daily intake of 5 mg per kg of body weight. Some DNA-damage signals were seen in cell tests but not in long-term animal studies.",
  "research": [
   "EFSA re-evaluated it in 2010 and kept the safe daily intake (ADI) of 5 mg/kg. It was positive in cell-based micronucleus and comet tests, but negative in long-term cancer studies.",
   "In 2010, 95th-percentile intake in children under 10 could reach about 6.9 mg/kg. A later refined EFSA assessment (2015) found mean and high intake below the ADI under refined scenarios."
  ],
  "regulation": "Authorised in the EU. Not approved in the US food supply. Check your own country's rules.",
  "topics": [
   "DNA-damage signals in cell tests only"
  ],
  "contested": "Apps that flag it often cite the cell-test findings. These were not seen in long-term animal studies, so we keep a low level with weak evidence.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment for brilliant black BN (E 151), 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/3960"
   },
   {
    "text": "EFSA. EFSA publishes safety assessments of three food colours (news), 2010",
    "url": "https://www.efsa.europa.eu/en/press/news/ans100421"
   }
  ]
 },
 {
  "id": "e153",
  "code": "E153",
  "name": "Vegetable carbon",
  "also": "Carbon black from plants",
  "kind": "Colour (black)",
  "found": "Liquorice, sweets, cheese rind and cake decorations.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A black colour made from burnt plant material. EFSA reviewed it in 2012 and again in 2026 to tighten limits on impurities.",
  "research": [
   "EFSA re-evaluated vegetable carbon in 2012. It flagged gaps in how the impurities and particles are described.",
   "In January 2026 EFSA reviewed new analyses of metals, polycyclic aromatic hydrocarbons (PAHs) and particle size. It found the margins of exposure above the level of concern, but recommended lower limits for benzo[a]pyrene, a new PAH4 limit and tighter limits for several metals.",
   "EFSA also said the 2012 assessment should be supplemented with nanoscale considerations."
  ],
  "regulation": "Authorised in the EU (E153). Not permitted as a colour additive in food in the US.",
  "topics": [
   "Impurities (PAHs and metals, specification limits tightened)"
  ],
  "contested": "Consumer apps sometimes rate E153 cautiously because of possible PAH contamination. EFSA's 2026 view is that the margins of exposure are adequate but the specifications need tightening.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the amendment of the specifications for vegetable carbon (E 153) as a food additive. EFSA Journal, 2026",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12848909/"
   }
  ]
 },
 {
  "id": "e155",
  "code": "E155",
  "name": "Brown HT",
  "kind": "Colour (brown)",
  "found": "Chocolate cakes, biscuits, sauces and some sweets.",
  "level": "some",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA halved its safe daily intake in 2010 to 1.5 mg per kg of body weight. A later estimate still showed high-intake groups above it in some scenarios.",
  "research": [
   "EFSA re-evaluated Brown HT in 2010 and halved the safe daily intake (ADI) to 1.5 mg/kg, because a mouse study showed slightly reduced weight gain at lower doses than earlier reviews had used.",
   "In 2010 the high-percentile intake in adults and children aged 1 to 10 could be slightly above the ADI. As an example EFSA said a 15 kg child drinking more than about 1.1 litres a day of soft drink containing it would exceed the ADI.",
   "A refined EFSA assessment (2014) found 95th-percentile exposure above the ADI for all age groups except the elderly in the first two scenarios, though lower than the earlier estimate. We found no human study that points to harm."
  ],
  "regulation": "Authorised in the EU. Not on the US list for food. Check your own country's rules.",
  "topics": [
   "Intake above the safe level for high consumers (EFSA estimate)"
  ],
  "contested": "Apps that mark it as a concern may be reacting to the intake estimates above the ADI. This is an exposure issue for high consumers, not a harm shown in people, so we rate the evidence weak.",
  "sources": [
   {
    "text": "EFSA. EFSA publishes safety assessments of three food colours (news), 2010",
    "url": "https://www.efsa.europa.eu/en/press/news/ans100421"
   }
  ]
 },
 {
  "id": "e160a",
  "code": "E160a",
  "name": "Carotenes",
  "labelName": "Beta-carotene",
  "also": "Beta-carotene, mixed carotenes",
  "kind": "Colour (orange)",
  "found": "Margarine, juices, cheese, baked goods and drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Beta-carotene from food use is not a concern for the general population. High-dose supplements have raised lung cancer rates in smokers.",
  "research": [
   "EFSA re-evaluated mixed carotenes and beta-carotene in 2012. The earlier ADI had been withdrawn after supplement trials in smokers and asbestos workers found more lung cancer with 20 to 30 mg of beta-carotene a day.",
   "A 2012 EFSA statement concluded that beta-carotene intake from additive and supplement use below 15 mg a day does not raise concern, including for heavy smokers. German BfR noted that figure is not a formal upper limit.",
   "JECFA in 2019 could not reach a conclusion on heavy smokers, but did not expect the estimated additive intake to be a concern for the general population.",
   "Origin note: carotenes can come from plants, algae or fermentation, and some forms are made synthetically."
  ],
  "careIf": "Smokers and people exposed to asbestos should be cautious about high-dose beta-carotene supplements. This is about supplements, not colour use.",
  "regulation": "Authorised in the EU (E160a) and the US.",
  "topics": [
   "Lung cancer in smokers (high-dose supplement trials)"
  ],
  "contested": "CSPI rates beta-carotene 'Safe' as an additive and places the risk with large supplement doses. That matches the regulators.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of mixed carotenes (E 160a(i)) and beta-carotene (E 160a(ii)). EFSA Journal, 2012",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2593"
   },
   {
    "text": "EFSA. Statement on the safety of beta-carotene use in heavy smokers. EFSA Journal, 2012",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2953"
   },
   {
    "text": "CSPI. Chemical Cuisine: beta-carotene",
    "url": "https://www.cspi.org/chemical-cuisine/beta-carotene"
   }
  ]
 },
 {
  "id": "e160b",
  "code": "E160b",
  "name": "Annatto",
  "also": "Bixin, norbixin",
  "kind": "Colour (yellow to orange)",
  "found": "Cheese, butter, snacks, cereals, smoked fish and baked goods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Annatto comes from seeds of the achiote tree. EFSA set low safe intakes in 2016. Some children's intakes of norbixin may exceed it, and allergy cases have been reported.",
  "research": [
   "EFSA set an ADI of 6 mg per kg of body weight for bixin and 0.3 mg per kg for norbixin in 2016. It said the safety of some extracts could not be assessed because of missing data, and later accepted one form (Annatto E) after more genotoxicity data.",
   "EFSA's exposure assessment found that high consumers (95th percentile) among toddlers and children could exceed the norbixin ADI.",
   "Annatto allergy is rare but documented. Case reports describe hives, swelling and, in at least one case, anaphylaxis. A 1978 study found that about a quarter of people with chronic hives reacted to annatto in challenge tests, though that is an older, specialised group.",
   "Origin note: annatto is plant-derived, from the seed coat of Bixa orellana. It can appear on US labels as 'colour added'."
  ],
  "careIf": "Toddlers and children with high intakes (per EFSA), and people with a known annatto allergy or chronic hives.",
  "regulation": "Authorised in the EU (E160b) and the US (annatto extract, exempt from certification).",
  "topics": [
   "Intake above ADI for some children (norbixin)",
   "Allergic reactions (case reports)"
  ],
  "contested": "Consumer groups often list annatto as a possible allergen or hives trigger, more strictly than regulators. The reports are real but mostly single cases and an older challenge study, so the true rate is unknown.",
  "sources": [
   {
    "text": "EFSA. Exposure assessment of annatto colouring principles bixin and norbixin (E 160b). EFSA Journal, 2019",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5626"
   },
   {
    "text": "Anaphylaxis to annatto dye: a case report. Ann Allergy, 1991",
    "url": "https://pubmed.ncbi.nlm.nih.gov/1994783/"
   },
   {
    "text": "An allergy to goldfish? Highlighting labeling laws for food additives. World Allergy Organ J",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2805955/"
   }
  ]
 },
 {
  "id": "e160c",
  "code": "E160c",
  "name": "Paprika extract",
  "also": "Capsanthin, capsorubin",
  "kind": "Colour (orange-red)",
  "found": "Sausages, cheese, sauces, snacks and sweets.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A colour from red peppers. EFSA re-evaluated it in 2015. We could not retrieve the details, so the evidence here is thin.",
  "research": [
   "EFSA published a re-evaluation of paprika extract (E160c) in 2015. We could not retrieve the opinion text, so no ADI or exposure figure is given here.",
   "Paprika is a common food, and no credible human harm signal was found. A Belgian consumer group notes possible ADI exceedance for heavy consumers, without a figure we could verify."
  ],
  "regulation": "Authorised in the EU (E160c) and the US (paprika and paprika oleoresin).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Consumer groups rate it as acceptable. We could not confirm the EFSA details, so review the 2015 opinion before relying on this entry.",
  "sources": [
   {
    "text": "JECFA/IPCS. Paprika oleoresin evaluation",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_1820.htm"
   }
  ]
 },
 {
  "id": "e160d",
  "code": "E160d",
  "name": "Lycopene",
  "kind": "Colour (red)",
  "found": "Sauces, soups, sweets, meat products and drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "The red pigment of tomatoes. EFSA set an ADI of 0.5 mg per kg of body weight, lower than JECFA's view of no limit needed.",
  "research": [
   "EFSA set a group ADI of 0.5 mg per kg of body weight in 2008. It used liver enzyme rises in a one-year rat study with a 100-fold uncertainty factor.",
   "In 2010 EFSA reviewed the question again after JECFA moved to 'not specified' in 2009. It kept the ADI, because the two bodies read the liver enzyme findings differently, not because of different data.",
   "A 2017 EFSA opinion on extending uses noted that intake at the maximum permitted levels could exceed the ADI."
  ],
  "regulation": "Authorised in the EU (E160d) and the US (lycopene extract, tomato lycopene).",
  "topics": [
   "Liver enzymes (animal studies)"
  ],
  "contested": "Regulators disagree mildly with each other. JECFA sees no need for a limit, EFSA keeps one. Consumer apps typically rate lycopene as low concern.",
  "sources": [
   {
    "text": "BfR. EFSA opinion on the safety of lycopene oleoresin from tomatoes",
    "url": "https://mobil.bfr.bund.de/cm/343/efsa_opinion_on_the_safety_of_lycopene_oleoresin_from_tomatoes.pdf"
   }
  ]
 },
 {
  "id": "e160e",
  "code": "E160e",
  "name": "Beta-apo-8'-carotenal",
  "kind": "Colour (orange-red)",
  "found": "Sauces, cheese, baked goods and drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A carotenoid colour. EFSA first set a very low ADI, then raised it sixfold after re-reading the same kidney slides.",
  "research": [
   "EFSA's 2012 re-evaluation set an ADI of 0.05 mg per kg of body weight based on kidney findings in rats. Some intake estimates exceeded it.",
   "EFSA later reconsidered the ADI after a re-examination of the original kidney slides. It set a new ADI of 0.3 mg per kg of body weight and concluded that reported uses were not a safety concern.",
   "The change came from re-interpreting the same animal data, not from a new study."
  ],
  "regulation": "Authorised in the EU (E160e) and the US.",
  "topics": [
   "Kidney findings (animal studies)"
  ],
  "contested": "Consumer apps usually rate it low. The history of a revised ADI is worth knowing, but the final regulator view finds no concern at reported uses.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of beta-apo-8'-carotenal (E 160e) as a food additive. EFSA Journal, 2012",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2499"
   }
  ]
 },
 {
  "id": "e161b",
  "code": "E161b",
  "name": "Lutein",
  "kind": "Colour (yellow)",
  "found": "Drinks, baked goods, dairy desserts, sweets and supplements.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A yellow pigment from marigold flowers. EFSA set an ADI of 1 mg per kg of body weight in 2010.",
  "research": [
   "EFSA's 2010 re-evaluation set an ADI of 1 mg per kg of body weight, using the highest dose tested in a 90-day rat study and an uncertainty factor of 200 because long-term data were missing.",
   "The first intake estimates were above the ADI at the upper end. A later EFSA statement used corrected industry data and found adult intake of 0.1 mg per kg at the mean and 0.3 mg per kg at the high end.",
   "EFSA said in 2011 that the ADI cannot be assumed to apply to lutein preparations of lower purity or from other sources."
  ],
  "regulation": "Authorised in the EU (E161b) and the US (marigold extract).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Consumer apps usually rate lutein as low concern. EFSA's data gaps are modest.",
  "sources": [
   {
    "text": "EFSA. Statement on the safety assessment of the exposure to lutein preparations based on new data on use levels. 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2589"
   }
  ]
 },
 {
  "id": "e162",
  "code": "E162",
  "name": "Beetroot red",
  "also": "Betanin",
  "kind": "Colour (red, from beets)",
  "found": "Ice cream, yoghurts, sauces and sweets.",
  "level": "little",
  "evidence": "None",
  "summary": "A red pigment from beetroot. It is a food-derived colour and no credible safety signal was found.",
  "research": [
   "EFSA published a re-evaluation of beetroot red in 2015. We could not retrieve its conclusion, so no figure is given.",
   "Beetroot red can turn urine or stools pink in some people. That is harmless."
  ],
  "regulation": "Authorised in the EU (E162) and the US (dehydrated beets).",
  "topics": [],
  "contested": "Consumer databases generally rate beetroot red as low concern.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of beetroot red (E 162) as a food additive. EFSA Journal, 2015 (listing)",
    "url": "https://www.efsa.europa.eu/sites/default/files/event/151027-m.pdf"
   },
   {
    "text": "JECFA/IPCS. Beet red evaluation",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_174.htm"
   }
  ]
 },
 {
  "id": "e163",
  "code": "E163",
  "name": "Anthocyanins",
  "also": "Grape skin extract, blackcurrant extract",
  "kind": "Colour (red to purple)",
  "found": "Drinks, sweets and jams.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Red-purple pigments from fruit and vegetables. EFSA could not set a numerical ADI but saw no concern at current uses of the best-studied extracts.",
  "research": [
   "EFSA's 2013 re-evaluation said safety data were too limited to set a numerical ADI.",
   "For aqueous grape skin and blackcurrant extracts, the main sources with data, estimated exposure was unlikely to be a concern.",
   "Anthocyanins from other sources or made with non-water extraction were not characterised well enough to apply the earlier conclusion."
  ],
  "regulation": "Authorised in the EU (E163) and the US (grape skin extract, grape colour extract).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Consumer apps generally rate anthocyanins as low concern. They are common in fruit and vegetables.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of anthocyanins (E 163) as a food additive. EFSA Journal, 2013",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/3145"
   },
   {
    "text": "WHO JECFA database. Grape skin extract",
    "url": "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1445"
   }
  ]
 },
 {
  "id": "e170",
  "code": "E170",
  "name": "Calcium carbonate",
  "also": "Chalk, limestone",
  "kind": "Colour (white) and acidity regulator",
  "found": "Sweets, chewing gum coatings, baked goods, calcium-fortified foods and antacid tablets.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA found no safety concern at food-additive levels in 2011 and again in 2023 for infant foods. It is also a common calcium supplement and antacid.",
  "research": [
   "EFSA's 2011 re-evaluation agreed with the group safe daily intake of 'not specified' for carbonates. It said the safety-study data were limited but did not raise concern, and that effects reported at high intakes were similar to other calcium salts.",
   "EFSA estimated total calcium intake from all sources, including supplements and fortification, stayed below the upper limit of 2,500 mg a day set in 2003. Trace nano-sized material in ordinary calcium carbonate was judged not of concern.",
   "A 2023 EFSA opinion covered use in foods for infants under 16 weeks and followed up the general re-evaluation. We did not find a credible new safety signal. It is not the same as titanium dioxide (E171), which the EU banned in 2022."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Scientific opinion on re-evaluation of calcium carbonate (E 170) as a food additive, 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2318"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of calcium carbonate (E 170) as a food additive in foods for infants below 16 weeks of age, 2023",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/8106"
   }
  ]
 },
 {
  "id": "e171",
  "code": "E171",
  "name": "Titanium dioxide",
  "kind": "Colour (white)",
  "found": "White coatings on sweets and chewing gum, some baked goods, sauces and supplements; now removed from EU food.",
  "level": "restricted",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "In 2021 EFSA concluded it can no longer be considered safe as a food additive, because a risk of DNA damage could not be ruled out. No harm has been shown in people.",
  "research": [
   "EFSA's 2021 review found that titanium dioxide particles can cause DNA strand breaks and chromosome damage in lab tests, but not gene mutations. It found no clear link between particle features and results, so a concern about DNA damage could not be ruled out and no safe daily intake could be set.",
   "Absorption after eating it is low, but particles may build up in the body over time. Very small particles (under 30 nm) were under 1% of particles by number. General toxicity studies in rats and mice found little effect.",
   "The concern is about what could not be excluded, not about harm shown in people. In 2023 JECFA (WHO and FAO) reviewed it and kept a 'not specified' intake limit. So expert bodies disagree on how to read the same data."
  ],
  "regulation": "Removed from the EU's list of authorised food additives in early 2022, with a short phase-out. Rules in other countries differ.",
  "topics": [
   "Possible DNA damage (EFSA; lab studies, uncertainty not resolved)"
  ],
  "contested": "JECFA took a more relaxed view in 2023 and some scientists argue EFSA gave too little weight to low absorption and rodent studies. Consumer apps and CSPI-type groups tend to follow EFSA's caution. We list it as restricted because the EU withdrew it, with weak evidence of actual harm.",
  "sources": [
   {
    "text": "EFSA. Titanium dioxide (E171) no longer considered safe as a food additive, 2021",
    "url": "https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive"
   },
   {
    "text": "EFSA. Safety assessment of titanium dioxide (E171) as a food additive. EFSA Journal, 2021",
    "url": "https://pubmed.ncbi.nlm.nih.gov/33976718/"
   },
   {
    "text": "WHO. Evaluation of certain food additives, 97th JECFA meeting report",
    "url": "https://www.who.int/publications/i/item/9789240098886"
   }
  ]
 },
 {
  "id": "e172",
  "code": "E172",
  "name": "Iron oxides and hydroxides",
  "also": "Iron oxide",
  "kind": "Colour (yellow, red, black, brown)",
  "found": "Sweets, pet food, fish paste, tablet coatings and some supplements.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Iron oxides are mineral colours with a long record of use. EFSA's formal re-evaluation has asked for more data on particle size, so the picture is not fully closed.",
  "research": [
   "JECFA gave iron oxide black a safe daily intake of up to 0.5 mg per kg of body weight in 1979.",
   "EFSA's re-evaluation was still being discussed in 2015, and an industry presentation from 2023 described a 2022 EFSA request for more detail on particle size and nanoparticles. We could not find a final EFSA intake limit for it, so we cannot say what EFSA concluded.",
   "We found no human study linking iron oxide colours to harm."
  ],
  "regulation": "Authorised in the EU and the US. Check your own country's rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Most consumer apps treat iron oxides as low risk. The only open question is the small-particle fraction that EFSA has asked about, so we keep weak evidence rather than 'none'.",
  "sources": [
   {
    "text": "EFSA. ANS Panel minutes, Oct 2015 (E 172 draft discussed)",
    "url": "https://www.efsa.europa.eu/sites/default/files/event/151027-m.pdf"
   },
   {
    "text": "JECFA. Iron oxide black evaluation (INCHEM)",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_1134.htm"
   }
  ]
 },
 {
  "id": "e173",
  "code": "E173",
  "name": "Aluminium",
  "also": "Aluminium powder",
  "kind": "Colour (silvery)",
  "found": "Silvery decorations on cakes and sugar confectionery.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A metal colour allowed in the EU only for external decoration of sugar confectionery. We did not find an EFSA review specific to this colour.",
  "research": [
   "EU rules limit it to the outer coating of sugar confectionery for decorating cakes and pastries, so exposure is expected to be low.",
   "We found no EFSA re-evaluation specific to E 173 in our searches. EFSA did review other aluminium additives in 2018 and found no concern at their very small use, but that does not cover this colour.",
   "We found no recent human study linking aluminium decorations in food to harm."
  ],
  "regulation": "Authorised in the EU only for the external coating of sugar confectionery for cake decoration. Check your own country's rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Some databases tell people to avoid it, mainly because it is a metal. We found no regulator finding of harm at these decorative amounts, but we also found no dedicated review, so we keep weak evidence.",
  "sources": [
   {
    "text": "EU Regulation (EC) No 1333/2008 on food additives",
    "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32008R1333"
   }
  ]
 },
 {
  "id": "e174",
  "code": "E174",
  "name": "Silver",
  "kind": "Colour (silver)",
  "found": "Decoration on chocolates and liqueurs, cake decorations.",
  "level": "some",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA said in 2016 and again in 2025 that data were too limited to conclude it is safe, especially for its tiny-particle (nano) form.",
  "research": [
   "EFSA's 2016 re-evaluation found the data too limited to assess safety. It flagged gaps in how the additive is characterised, including how many nano-sized particles it holds and how much silver ion it releases.",
   "A 2025 follow-up looked at new data from one company: limited particle data, two genotoxicity studies and one subchronic study. EFSA judged them inadequate and again could not conclude on safety.",
   "This is a data gap, not a shown harm. The European Commission is considering next steps."
  ],
  "regulation": "Authorised in the EU in very limited uses, under review. Check your own country's rules.",
  "topics": [
   "Safety not established, nano-form unclear (EFSA, data gap)"
  ],
  "contested": "Some apps rate it high risk, which fits EFSA's refusal to confirm safety. Others rate it low because of the tiny amounts. EFSA's wording supports caution about the unknowns, not a claim of harm.",
  "sources": [
   {
    "text": "EFSA. Follow-up of the re-evaluation of silver (E 174), 2025",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12015561/"
   },
   {
    "text": "RIVM. EFSA's re-evaluation of silver as food additive is inconclusive, 2025",
    "url": "https://www.rivm.nl/en/weblog/efsas-re-evaluation-of-silver-as-food-additive-is-inconclusive"
   }
  ]
 },
 {
  "id": "e175",
  "code": "E175",
  "name": "Gold",
  "kind": "Colour (gold)",
  "found": "Gold leaf on chocolates, liqueurs and cake decorations.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Gold is very insoluble, and EFSA expected no effects inside the body, but said there were too few data for a full risk assessment.",
  "research": [
   "EFSA's 2016 re-evaluation set no safe daily intake because the data were too limited. It concluded that gold in this form would not be expected to get into the body and cause effects, because it barely dissolves.",
   "EFSA estimated intake at up to 1.32 micrograms per kg of body weight a day in a worst case, and 0.33 in a refined scenario. It asked for particle-size data, including nano-sized particles."
  ],
  "regulation": "Authorised in the EU for decoration. EFSA follow-up work is on the programme. Check your own country's rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "Apps tend to rate gold leaf low risk, which fits EFSA's view. The data gap is why we keep weak evidence.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of gold (E 175) as a food additive, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4362"
   }
  ]
 },
 {
  "id": "e180",
  "code": "E180",
  "name": "Litholrubine BK",
  "also": "Pigment rubine",
  "kind": "Colour (red)",
  "found": "Cheese rind only.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA said in 2010 that the safety data were too limited to keep or set a safe daily intake. Its use is limited to cheese rind, which people rarely eat.",
  "research": [
   "EFSA re-evaluated it in 2010. JECFA had never been able to set an intake limit, and the EU scientific committee had set one in 1983 (0 to 1.5 mg per kg of body weight).",
   "EFSA could not find enough data to keep that limit or to set a new one, and could not say whether it can cause hypersensitivity. This is a gap, not a finding of harm.",
   "Only cheese rind is permitted, so exposure is expected to be very low."
  ],
  "regulation": "Authorised in the EU only for cheese rind. Check your own country's rules.",
  "topics": [
   "Safety data too limited (EFSA data gap)"
  ],
  "contested": "Few apps or consumer groups rate it in detail. Our rating comes from EFSA's data-gap conclusion, balanced by the very narrow use.",
  "sources": [
   {
    "text": "EFSA. EFSA publishes safety assessments of three food colours (news), 2010",
    "url": "https://www.efsa.europa.eu/en/press/news/ans100421"
   }
  ]
 },
 {
  "id": "e200",
  "code": "E200",
  "name": "Sorbic acid",
  "also": "Sorbate",
  "kind": "Preservative",
  "found": "Cheese, wine, baked goods, dried fruit, jams and drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators see no safety concern at current uses. Some lab studies on cells found DNA changes at high doses, and it can react with nitrite, so we call the evidence weak rather than none.",
  "research": [
   "In 2015 EFSA re-evaluated the sorbates and set a temporary group acceptable daily intake (ADI) of 3 mg per kg of body weight, because a rat reproduction study was missing. In 2019 it reviewed that new study and replaced the temporary figure with a group ADI of 11 mg of sorbic acid per kg of body weight for sorbic acid (E 200) and potassium sorbate (E 202). The new limit is higher than the old temporary one.",
   "EFSA found no evidence that sorbic acid or potassium sorbate damages DNA in the studies it reviewed.",
   "Some lab studies point the other way. A 2010 study on human blood cells in a dish found potassium sorbate raised chromosome changes and DNA breaks at high concentrations, but not micronuclei. Earlier animal tests of oral sorbate were negative. Findings from cells in a dish at high doses do not show a risk from food.",
   "Sorbic acid can react with nitrite, which is used in meat preserved with nitrite, and make small amounts of compounds that are mutagenic in lab tests (ethylnitrolic acid and a nitro-pyrrole). We found no study that measured these in real foods, so the real-world importance is unknown. Ascorbic acid is reported to block part of this reaction, but We only saw that second-hand."
  ],
  "careIf": "People who notice skin rashes after contact with sorbates may wish to check labels.",
  "regulation": "Authorised in the EU with food-by-food limits (limits for some metals were tightened in 2024). Generally recognised as safe (GRAS) in the US.",
  "topics": [
   "DNA changes in cell studies (lab only)",
   "Reaction with nitrite (lab chemistry)"
  ],
  "contested": "CSPI rates sorbic acid and potassium sorbate as Safe, in line with regulators. Some consumer apps rate them higher-risk. Their concern appears to rest on the lab findings above, which regulators weighed and did not find convincing for food use. We reflect them as a small, unconfirmed signal.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbic acid (E 200), potassium sorbate (E 202) and calcium sorbate (E 203) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4144"
   },
   {
    "text": "EFSA FAF Panel. Opinion on the follow-up of the re-evaluation of sorbic acid (E 200) and potassium sorbate (E 202) as food additives. EFSA Journal, 2019",
    "url": "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2019.5625"
   },
   {
    "text": "CSPI. Chemical Cuisine index (sorbic acid, potassium sorbate rated Safe)",
    "url": "https://cspinet.org/node/7383"
   }
  ]
 },
 {
  "id": "e202",
  "code": "E202",
  "name": "Potassium sorbate",
  "also": "Sorbic acid potassium salt",
  "kind": "Preservative",
  "found": "Wine, cheese, dried fruit, baked goods, drinks and many sauces.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators see no safety concern at current uses. Some lab studies on cells found DNA changes at high doses, and it can react with nitrite, so we call the evidence weak rather than none.",
  "research": [
   "In 2015 EFSA re-evaluated the sorbates and set a temporary group acceptable daily intake (ADI) of 3 mg per kg of body weight, because a rat reproduction study was missing. In 2019 it reviewed that new study and replaced the temporary figure with a group ADI of 11 mg of sorbic acid per kg of body weight for sorbic acid (E 200) and potassium sorbate (E 202). The new limit is higher than the old temporary one.",
   "EFSA found no evidence that sorbic acid or potassium sorbate damages DNA in the studies it reviewed.",
   "Some lab studies point the other way. A 2010 study on human blood cells in a dish found potassium sorbate raised chromosome changes and DNA breaks at high concentrations, but not micronuclei. Earlier animal tests of oral sorbate were negative. Findings from cells in a dish at high doses do not show a risk from food.",
   "Sorbic acid can react with nitrite, which is used in meat preserved with nitrite, and make small amounts of compounds that are mutagenic in lab tests (ethylnitrolic acid and a nitro-pyrrole). We found no study that measured these in real foods, so the real-world importance is unknown. Ascorbic acid is reported to block part of this reaction, but We only saw that second-hand."
  ],
  "careIf": "People who notice skin rashes after contact with sorbates may wish to check labels.",
  "regulation": "Authorised in the EU with food-by-food limits (limits for some metals were tightened in 2024). Generally recognised as safe (GRAS) in the US.",
  "topics": [
   "DNA changes in cell studies (lab only)",
   "Reaction with nitrite (lab chemistry)"
  ],
  "contested": "CSPI rates potassium sorbate as Safe, in line with regulators. Some consumer apps rate it high-risk. Their concern appears to rest on the lab findings above, which regulators weighed and did not find convincing for food use. We reflect them as a small, unconfirmed signal.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbic acid (E 200), potassium sorbate (E 202) and calcium sorbate (E 203) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4144"
   },
   {
    "text": "EFSA FAF Panel. Opinion on the follow-up of the re-evaluation of sorbic acid (E 200) and potassium sorbate (E 202) as food additives. EFSA Journal, 2019",
    "url": "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2019.5625"
   },
   {
    "text": "CSPI. Chemical Cuisine index (sorbic acid, potassium sorbate rated Safe)",
    "url": "https://cspinet.org/node/7383"
   }
  ]
 },
 {
  "id": "e203",
  "code": "E203",
  "name": "Calcium sorbate",
  "kind": "Preservative",
  "found": "Previously cheese, baked goods and drinks; now rarely used in the EU.",
  "level": "some",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA could not include it in the safe-intake group for sorbates because genotoxicity data were missing. Check its current EU authorisation.",
  "research": [
   "In 2015 EFSA left calcium sorbate out of the group ADI for sorbic acid and potassium sorbate. It said genotoxicity data on calcium sorbate were lacking and that there were positive results for sodium sorbate, a close relative.",
   "EFSA said studies on calcium sorbate would be needed before it could be added to the group. Because of this gap, there is no safe daily intake for calcium sorbate.",
   "EU additive lists were amended for calcium sorbate in 2018. Check the current EU list for its exact status.",
   "The concern is a missing-data concern, based on lab results on a related salt. It is not a finding of harm in people."
  ],
  "regulation": "Check the current EU list. EFSA's 2015 opinion left it without a safe intake, and its authorisation has been changing.",
  "topics": [
   "No safe intake set (data gap)",
   "Related sorbate positive in lab tests"
  ],
  "contested": "Consumer apps that flag sorbates as risky usually cite lab genotoxicity findings. For calcium sorbate specifically, the regulator itself said data were missing, so a cautious rating is fair. For sorbic acid and potassium sorbate, EFSA did not reach that view.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbic acid (E 200), potassium sorbate (E 202) and calcium sorbate (E 203) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4144"
   },
   {
    "text": "Commission Regulation (EU) 2018/98 amending Annexes II and III to Regulation (EC) No 1333/2008 as regards calcium sorbate (E 203)",
    "url": "https://www.legislation.gov.uk/eur/2018/98/data.html"
   }
  ]
 },
 {
  "id": "e210",
  "code": "E210",
  "name": "Benzoic acid",
  "kind": "Preservative",
  "found": "Fizzy drinks, squashes, pickles, sauces and salad dressings.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA found no genotoxicity concern but said children's intake from drinks could exceed its safe daily limit. It can form traces of benzene with vitamin C.",
  "research": [
   "In 2016 EFSA re-evaluated benzoic acid and its salts and set a group ADI of 5 mg per kg of body weight per day, expressed as benzoic acid, from a four-generation rat study. It found no concern about genotoxicity and no sign of carcinogenic potential.",
   "EFSA estimated that intake could exceed the ADI in toddlers and children who regularly drink flavoured drinks that contain benzoates. With benzoate carried over from other ingredients, the estimates rose further. These are modelled estimates, not measurements of harm.",
   "In a 2007 UK trial (the Southampton or McCann study), mixes of colours with sodium benzoate were linked to a small rise in activity and attention problems in some children. The trial tested mixtures, so it cannot say whether benzoate was the cause. EFSA judged the evidence limited and did not change any ADI because of it.",
   "Benzoate can react with vitamin C in acidic drinks and form traces of benzene. FDA tested drinks, and levels found did not raise a safety concern.",
   "A 2011 lab study on human blood cells found chromosome damage with sodium and potassium benzoate in a dish. This was at concentrations far from the diet and has not been confirmed in people."
  ],
  "careIf": "Children who drink a lot of benzoate-preserved drinks. People with asthma, hives or other sensitivities have also been named by CSPI as a group that may react.",
  "regulation": "Authorised in the EU with limits by food type. Used in the US under GRAS rules.",
  "topics": [
   "Exposure above the safe limit in some children (estimate)",
   "Hyperactivity in children (mixtures, limited evidence)",
   "Benzene formation with vitamin C (traces)",
   "DNA damage in cell studies (lab only)"
  ],
  "contested": "CSPI rates benzoates 'Certain people should avoid', mainly because of the benzene point and reactions in sensitive people. That is close to our view. Some apps go further and rate them as high-risk mainly on the lab genotoxicity findings. EFSA reviewed those and did not find a genotoxicity concern, so we treat them as weak evidence.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific Opinion on the re-evaluation of benzoic acid (E 210), sodium benzoate (E 211), potassium benzoate (E 212) and calcium benzoate (E 213) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4433"
   },
   {
    "text": "FDA. Questions and answers on the occurrence of benzene in soft drinks and other beverages",
    "url": "https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "EFSA. Press release on the 2008 opinion on the Southampton study of colours and sodium benzoate",
    "url": "https://www.efsa.europa.eu/en/press/news/080314"
   },
   {
    "text": "CSPI. Chemical Cuisine: sodium benzoate, benzoic acid",
    "url": "https://www.cspi.org/chemical-cuisine/sodium-benzoate-benzoic-acid"
   }
  ]
 },
 {
  "id": "e211",
  "code": "E211",
  "name": "Sodium benzoate",
  "kind": "Preservative",
  "found": "Fizzy drinks, squashes, pickles, sauces and salad dressings.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA found no genotoxicity concern but said children's intake from drinks could exceed its safe daily limit. It can form traces of benzene with vitamin C.",
  "research": [
   "In 2016 EFSA re-evaluated benzoic acid and its salts and set a group ADI of 5 mg per kg of body weight per day, expressed as benzoic acid, from a four-generation rat study. It found no concern about genotoxicity and no sign of carcinogenic potential.",
   "EFSA estimated that intake could exceed the ADI in toddlers and children who regularly drink flavoured drinks that contain benzoates. With benzoate carried over from other ingredients, the estimates rose further. These are modelled estimates, not measurements of harm.",
   "In a 2007 UK trial (the Southampton or McCann study), mixes of colours with sodium benzoate were linked to a small rise in activity and attention problems in some children. The trial tested mixtures, so it cannot say whether benzoate was the cause. EFSA judged the evidence limited and did not change any ADI because of it.",
   "Benzoate can react with vitamin C in acidic drinks and form traces of benzene. FDA tested drinks, and levels found did not raise a safety concern.",
   "A 2011 lab study on human blood cells found chromosome damage with sodium and potassium benzoate in a dish. This was at concentrations far from the diet and has not been confirmed in people."
  ],
  "careIf": "Children who drink a lot of benzoate-preserved drinks. People with asthma, hives or other sensitivities have also been named by CSPI as a group that may react.",
  "regulation": "Authorised in the EU with limits by food type. Used in the US under GRAS rules.",
  "topics": [
   "Exposure above the safe limit in some children (estimate)",
   "Hyperactivity in children (mixtures, limited evidence)",
   "Benzene formation with vitamin C (traces)",
   "DNA damage in cell studies (lab only)"
  ],
  "contested": "CSPI rates benzoates 'Certain people should avoid', mainly because of the benzene point and reactions in sensitive people. That is close to our view. Some apps go further and rate them as high-risk mainly on the lab genotoxicity findings. EFSA reviewed those and did not find a genotoxicity concern, so we treat them as weak evidence.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific Opinion on the re-evaluation of benzoic acid (E 210), sodium benzoate (E 211), potassium benzoate (E 212) and calcium benzoate (E 213) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4433"
   },
   {
    "text": "FDA. Questions and answers on the occurrence of benzene in soft drinks and other beverages",
    "url": "https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "EFSA. Press release on the 2008 opinion on the Southampton study of colours and sodium benzoate",
    "url": "https://www.efsa.europa.eu/en/press/news/080314"
   },
   {
    "text": "CSPI. Chemical Cuisine: sodium benzoate, benzoic acid",
    "url": "https://www.cspi.org/chemical-cuisine/sodium-benzoate-benzoic-acid"
   }
  ]
 },
 {
  "id": "e212",
  "code": "E212",
  "name": "Potassium benzoate",
  "kind": "Preservative",
  "found": "Fizzy drinks, squashes, pickles and sauces.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA found no genotoxicity concern but said children's intake from drinks could exceed its safe daily limit. It can form traces of benzene with vitamin C.",
  "research": [
   "In 2016 EFSA re-evaluated benzoic acid and its salts and set a group ADI of 5 mg per kg of body weight per day, expressed as benzoic acid, from a four-generation rat study. It found no concern about genotoxicity and no sign of carcinogenic potential.",
   "EFSA estimated that intake could exceed the ADI in toddlers and children who regularly drink flavoured drinks that contain benzoates. With benzoate carried over from other ingredients, the estimates rose further. These are modelled estimates, not measurements of harm.",
   "In a 2007 UK trial (the Southampton or McCann study), mixes of colours with sodium benzoate were linked to a small rise in activity and attention problems in some children. The trial tested mixtures, so it cannot say whether benzoate was the cause. EFSA judged the evidence limited and did not change any ADI because of it.",
   "Benzoate can react with vitamin C in acidic drinks and form traces of benzene. FDA tested drinks, and levels found did not raise a safety concern.",
   "A 2011 lab study on human blood cells found chromosome damage with sodium and potassium benzoate in a dish. This was at concentrations far from the diet and has not been confirmed in people."
  ],
  "careIf": "Children who drink a lot of benzoate-preserved drinks. People with asthma, hives or other sensitivities have also been named by CSPI as a group that may react.",
  "regulation": "Authorised in the EU with limits by food type. Used in the US under GRAS rules.",
  "topics": [
   "Exposure above the safe limit in some children (estimate)",
   "Hyperactivity in children (mixtures, limited evidence)",
   "Benzene formation with vitamin C (traces)",
   "DNA damage in cell studies (lab only)"
  ],
  "contested": "CSPI rates benzoates 'Certain people should avoid', mainly because of the benzene point and reactions in sensitive people. That is close to our view. Some apps go further and rate them as high-risk mainly on the lab genotoxicity findings. EFSA reviewed those and did not find a genotoxicity concern, so we treat them as weak evidence.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific Opinion on the re-evaluation of benzoic acid (E 210), sodium benzoate (E 211), potassium benzoate (E 212) and calcium benzoate (E 213) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4433"
   },
   {
    "text": "FDA. Questions and answers on the occurrence of benzene in soft drinks and other beverages",
    "url": "https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "EFSA. Press release on the 2008 opinion on the Southampton study of colours and sodium benzoate",
    "url": "https://www.efsa.europa.eu/en/press/news/080314"
   },
   {
    "text": "CSPI. Chemical Cuisine: sodium benzoate, benzoic acid",
    "url": "https://www.cspi.org/chemical-cuisine/sodium-benzoate-benzoic-acid"
   }
  ]
 },
 {
  "id": "e213",
  "code": "E213",
  "name": "Calcium benzoate",
  "kind": "Preservative",
  "found": "Pickles, sauces and some drinks. Less common than the sodium salt.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA found no genotoxicity concern but said children's intake from drinks could exceed its safe daily limit. It can form traces of benzene with vitamin C.",
  "research": [
   "In 2016 EFSA re-evaluated benzoic acid and its salts and set a group ADI of 5 mg per kg of body weight per day, expressed as benzoic acid, from a four-generation rat study. It found no concern about genotoxicity and no sign of carcinogenic potential.",
   "EFSA estimated that intake could exceed the ADI in toddlers and children who regularly drink flavoured drinks that contain benzoates. With benzoate carried over from other ingredients, the estimates rose further. These are modelled estimates, not measurements of harm.",
   "In a 2007 UK trial (the Southampton or McCann study), mixes of colours with sodium benzoate were linked to a small rise in activity and attention problems in some children. The trial tested mixtures, so it cannot say whether benzoate was the cause. EFSA judged the evidence limited and did not change any ADI because of it.",
   "Benzoate can react with vitamin C in acidic drinks and form traces of benzene. FDA tested drinks, and levels found did not raise a safety concern.",
   "A 2011 lab study on human blood cells found chromosome damage with sodium and potassium benzoate in a dish. This was at concentrations far from the diet and has not been confirmed in people."
  ],
  "careIf": "Children who drink a lot of benzoate-preserved drinks. People with asthma, hives or other sensitivities have also been named by CSPI as a group that may react.",
  "regulation": "Authorised in the EU with limits by food type.",
  "topics": [
   "Exposure above the safe limit in some children (estimate)",
   "Hyperactivity in children (mixtures, limited evidence)",
   "Benzene formation with vitamin C (traces)",
   "DNA damage in cell studies (lab only)"
  ],
  "contested": "CSPI rates benzoates 'Certain people should avoid', mainly because of the benzene point and reactions in sensitive people. That is close to our view. Some apps go further and rate them as high-risk mainly on the lab genotoxicity findings. EFSA reviewed those and did not find a genotoxicity concern, so we treat them as weak evidence.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific Opinion on the re-evaluation of benzoic acid (E 210), sodium benzoate (E 211), potassium benzoate (E 212) and calcium benzoate (E 213) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4433"
   },
   {
    "text": "FDA. Questions and answers on the occurrence of benzene in soft drinks and other beverages",
    "url": "https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages"
   },
   {
    "text": "McCann D et al. Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children. Lancet, 2007",
    "url": "https://doi.org/10.1016/S0140-6736(07)61306-3"
   },
   {
    "text": "EFSA. Press release on the 2008 opinion on the Southampton study of colours and sodium benzoate",
    "url": "https://www.efsa.europa.eu/en/press/news/080314"
   },
   {
    "text": "CSPI. Chemical Cuisine: sodium benzoate, benzoic acid",
    "url": "https://www.cspi.org/chemical-cuisine/sodium-benzoate-benzoic-acid"
   }
  ]
 },
 {
  "id": "e214",
  "code": "E214",
  "name": "Ethylparaben",
  "also": "Ethyl p-hydroxybenzoate",
  "kind": "Preservative",
  "found": "A few sauces, dried and meat preserved with nitrites, jelly coatings and some imported foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily intake for this group in 2004. Some agencies and consumer groups worry about hormone-like effects seen in lab and animal studies.",
  "research": [
   "EFSA's 2004 opinion set a group ADI of 0 to 10 mg per kg of body weight for methyl and ethyl parabens and their sodium salts. It found no hormone-related effects in rats for these two at the highest doses tested.",
   "EFSA kept propylparaben out of that group, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found. The EU then removed propylparaben (E 216, E 217) from the food list in 2006. The entries here are the methyl and ethyl forms, which remain.",
   "The French agency ANSES has been reported to say since 2021 that methyl and ethyl parabens may act as endocrine (hormone) disruptors. We saw this only through a French consumer group's summary and did not read the ANSES text. Most research on parabens and hormones concerns skin products rather than food.",
   "No newer EFSA opinion on these forms turned up in our search. Parabens are used in only a few foods in the EU, so the amount people eat is usually small."
  ],
  "careIf": "People who want to limit hormone-active chemicals may prefer to avoid parabens in food and skin products.",
  "regulation": "Allowed in the EU only in a short list of foods, with limits (check the current list). Propyl forms E 216 and E 217 were removed in 2006. Methylparaben is used in the US under GRAS rules.",
  "topics": [
   "Hormone effects (animal and lab studies)"
  ],
  "contested": "Consumer apps and French consumer groups rate parabens more strictly than EFSA, because of endocrine-disruption findings in lab and animal studies and the ANSES view. EFSA's 2004 review found no such effects for methyl and ethyl forms at the highest doses tested. The stronger worry was for propylparaben, which the EU has already removed from food. We treat this as a weak, unresolved signal.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "EC Scientific Committee on Consumer Products. Extended opinion on the safety evaluation of parabens",
    "url": "https://ec.europa.eu/health/ph_risk/committees/04_sccp/docs/sccp_o_019.pdf"
   }
  ]
 },
 {
  "id": "e215",
  "code": "E215",
  "name": "Sodium ethyl para-hydroxybenzoate",
  "also": "Sodium ethylparaben",
  "kind": "Preservative",
  "found": "A few sauces, dried and meat preserved with nitrites and some imported foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily intake for this group in 2004. Some agencies and consumer groups worry about hormone-like effects seen in lab and animal studies.",
  "research": [
   "EFSA's 2004 opinion set a group ADI of 0 to 10 mg per kg of body weight for methyl and ethyl parabens and their sodium salts. It found no hormone-related effects in rats for these two at the highest doses tested.",
   "EFSA kept propylparaben out of that group, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found. The EU then removed propylparaben (E 216, E 217) from the food list in 2006. The entries here are the methyl and ethyl forms, which remain.",
   "The French agency ANSES has been reported to say since 2021 that methyl and ethyl parabens may act as endocrine (hormone) disruptors. We saw this only through a French consumer group's summary and did not read the ANSES text. Most research on parabens and hormones concerns skin products rather than food.",
   "No newer EFSA opinion on these forms turned up in our search. Parabens are used in only a few foods in the EU, so the amount people eat is usually small."
  ],
  "careIf": "People who want to limit hormone-active chemicals may prefer to avoid parabens in food and skin products.",
  "regulation": "Allowed in the EU only in a short list of foods, with limits (check the current list). Propyl forms E 216 and E 217 were removed in 2006. Methylparaben is used in the US under GRAS rules.",
  "topics": [
   "Hormone effects (animal and lab studies)"
  ],
  "contested": "Consumer apps and French consumer groups rate parabens more strictly than EFSA, because of endocrine-disruption findings in lab and animal studies and the ANSES view. EFSA's 2004 review found no such effects for methyl and ethyl forms at the highest doses tested. The stronger worry was for propylparaben, which the EU has already removed from food. We treat this as a weak, unresolved signal.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "EC Scientific Committee on Consumer Products. Extended opinion on the safety evaluation of parabens",
    "url": "https://ec.europa.eu/health/ph_risk/committees/04_sccp/docs/sccp_o_019.pdf"
   }
  ]
 },
 {
  "id": "e216",
  "code": "E216",
  "name": "Propylparaben",
  "labelName": "Propylparaben",
  "highRisk": true,
  "also": "Propyl p-hydroxybenzoate",
  "kind": "Preservative",
  "found": "Some baked goods and tortillas sold in the US. Not allowed in EU food.",
  "level": "restricted",
  "evidence": "Moderate",
  "summary": "A preservative the EU removed from its food list in 2006. EFSA found it affected sex hormones and male reproductive organs in young rats, and couldn't identify an amount with no effect.",
  "research": [
   "EFSA's 2004 opinion left propylparaben out of the group limit set for methyl and ethyl parabens, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found.",
   "The EU removed propylparaben (E 216, E 217) from the food list in 2006. Yuka reports it is also banned in China, and that California decided in 2023 to ban it, from January 2027, while it is still allowed in the US as 'generally recognised as safe'."
  ],
  "careIf": "People who are pregnant or trying to conceive, and parents of young children, may want to avoid it; it is mainly found in some US baked goods.",
  "regulation": "Removed from the EU food list in 2006. Still allowed in the US; California has decided to ban it from January 2027, according to Yuka.",
  "topics": [
   "Effects on hormones and reproduction (animal studies)",
   "Removed from the EU food list in 2006"
  ],
  "contested": "Where views differ: rated high risk to match Yuka, which cites the EFSA finding that no safe level could be set. The evidence is from animal studies; the US still allows it.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   }
  ]
 },
 {
  "id": "e217",
  "code": "E217",
  "name": "Sodium propylparaben",
  "labelName": "Sodium propylparaben",
  "highRisk": true,
  "also": "Sodium propyl p-hydroxybenzoate",
  "kind": "Preservative",
  "found": "Some baked goods and tortillas sold in the US. Not allowed in EU food.",
  "level": "restricted",
  "evidence": "Moderate",
  "summary": "A preservative the EU removed from its food list in 2006. EFSA found it affected sex hormones and male reproductive organs in young rats, and couldn't identify an amount with no effect.",
  "research": [
   "EFSA's 2004 opinion left propylparaben out of the group limit set for methyl and ethyl parabens, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found.",
   "The EU removed propylparaben (E 216, E 217) from the food list in 2006. Yuka reports it is also banned in China, and that California decided in 2023 to ban it, from January 2027, while it is still allowed in the US as 'generally recognised as safe'."
  ],
  "careIf": "People who are pregnant or trying to conceive, and parents of young children, may want to avoid it; it is mainly found in some US baked goods.",
  "regulation": "Removed from the EU food list in 2006. Still allowed in the US; California has decided to ban it from January 2027, according to Yuka.",
  "topics": [
   "Effects on hormones and reproduction (animal studies)",
   "Removed from the EU food list in 2006"
  ],
  "contested": "Where views differ: rated high risk to match Yuka, which cites the EFSA finding that no safe level could be set. The evidence is from animal studies; the US still allows it.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   }
  ]
 },
 {
  "id": "e218",
  "code": "E218",
  "name": "Methylparaben",
  "also": "Methyl p-hydroxybenzoate",
  "kind": "Preservative",
  "found": "A few sauces, dried and meat preserved with nitrites, jelly coatings and some imported foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily intake for this group in 2004. Some agencies and consumer groups worry about hormone-like effects seen in lab and animal studies.",
  "research": [
   "EFSA's 2004 opinion set a group ADI of 0 to 10 mg per kg of body weight for methyl and ethyl parabens and their sodium salts. It found no hormone-related effects in rats for these two at the highest doses tested.",
   "EFSA kept propylparaben out of that group, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found. The EU then removed propylparaben (E 216, E 217) from the food list in 2006. The entries here are the methyl and ethyl forms, which remain.",
   "The French agency ANSES has been reported to say since 2021 that methyl and ethyl parabens may act as endocrine (hormone) disruptors. We saw this only through a French consumer group's summary and did not read the ANSES text. Most research on parabens and hormones concerns skin products rather than food.",
   "No newer EFSA opinion on these forms turned up in our search. Parabens are used in only a few foods in the EU, so the amount people eat is usually small."
  ],
  "careIf": "People who want to limit hormone-active chemicals may prefer to avoid parabens in food and skin products.",
  "regulation": "Allowed in the EU only in a short list of foods, with limits (check the current list). Propyl forms E 216 and E 217 were removed in 2006. Methylparaben is used in the US under GRAS rules.",
  "topics": [
   "Hormone effects (animal and lab studies)"
  ],
  "contested": "Consumer apps and French consumer groups rate parabens more strictly than EFSA, because of endocrine-disruption findings in lab and animal studies and the ANSES view. EFSA's 2004 review found no such effects for methyl and ethyl forms at the highest doses tested. The stronger worry was for propylparaben, which the EU has already removed from food. We treat this as a weak, unresolved signal.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "EC Scientific Committee on Consumer Products. Extended opinion on the safety evaluation of parabens",
    "url": "https://ec.europa.eu/health/ph_risk/committees/04_sccp/docs/sccp_o_019.pdf"
   }
  ]
 },
 {
  "id": "e219",
  "code": "E219",
  "name": "Sodium methyl para-hydroxybenzoate",
  "also": "Sodium methylparaben",
  "kind": "Preservative",
  "found": "A few sauces, dried and meat preserved with nitrites and some imported foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily intake for this group in 2004. Some agencies and consumer groups worry about hormone-like effects seen in lab and animal studies.",
  "research": [
   "EFSA's 2004 opinion set a group ADI of 0 to 10 mg per kg of body weight for methyl and ethyl parabens and their sodium salts. It found no hormone-related effects in rats for these two at the highest doses tested.",
   "EFSA kept propylparaben out of that group, because it affected sex hormones and male reproductive organs in young rats and no clear no-effect level was found. The EU then removed propylparaben (E 216, E 217) from the food list in 2006. The entries here are the methyl and ethyl forms, which remain.",
   "The French agency ANSES has been reported to say since 2021 that methyl and ethyl parabens may act as endocrine (hormone) disruptors. We saw this only through a French consumer group's summary and did not read the ANSES text. Most research on parabens and hormones concerns skin products rather than food.",
   "No newer EFSA opinion on these forms turned up in our search. Parabens are used in only a few foods in the EU, so the amount people eat is usually small."
  ],
  "careIf": "People who want to limit hormone-active chemicals may prefer to avoid parabens in food and skin products.",
  "regulation": "Allowed in the EU only in a short list of foods, with limits (check the current list). Propyl forms E 216 and E 217 were removed in 2006. Methylparaben is used in the US under GRAS rules.",
  "topics": [
   "Hormone effects (animal and lab studies)"
  ],
  "contested": "Consumer apps and French consumer groups rate parabens more strictly than EFSA, because of endocrine-disruption findings in lab and animal studies and the ANSES view. EFSA's 2004 review found no such effects for methyl and ethyl forms at the highest doses tested. The stronger worry was for propylparaben, which the EU has already removed from food. We treat this as a weak, unresolved signal.",
  "sources": [
   {
    "text": "EFSA AFC Panel. Opinion on para-hydroxybenzoates (E 214-219), EFSA Journal 83, 2004",
    "url": "https://efsa.europa.eu/lv/efsajournal/pub/83"
   },
   {
    "text": "EFSA. EFSA advises on the safety of paraben usage in food",
    "url": "https://www.efsa.europa.eu/en/news/efsa-advises-safety-paraben-usage-food"
   },
   {
    "text": "EC Scientific Committee on Consumer Products. Extended opinion on the safety evaluation of parabens",
    "url": "https://ec.europa.eu/health/ph_risk/committees/04_sccp/docs/sccp_o_019.pdf"
   }
  ]
 },
 {
  "id": "e220",
  "code": "E220",
  "name": "Sulfur dioxide",
  "kind": "Preservative and antioxidant",
  "found": "Dried fruit, wine, fruit juices, jams, dried potato products and some sausages.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e221",
  "code": "E221",
  "name": "Sodium sulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, dried fruit, processed potatoes and some sauces.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e222",
  "code": "E222",
  "name": "Sodium bisulfite",
  "also": "Sodium hydrogen sulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, dried fruit, processed potatoes and some sauces.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e223",
  "code": "E223",
  "name": "Sodium metabisulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, dried fruit, biscuits, jams and processed potato products.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e224",
  "code": "E224",
  "name": "Potassium metabisulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, cider, dried fruit and some fruit products.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e226",
  "code": "E226",
  "name": "Calcium sulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, cider and some fruit products.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e227",
  "code": "E227",
  "name": "Calcium bisulfite",
  "also": "Calcium hydrogen sulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, cider and some fruit products.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e228",
  "code": "E228",
  "name": "Potassium bisulfite",
  "also": "Potassium hydrogen sulfite",
  "kind": "Preservative and antioxidant",
  "found": "Wine, cider and dried fruit.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Sulfites can trigger breathing problems and other reactions in some people, especially people with asthma. EFSA also withdrew its safe daily intake in 2022 because of gaps in the data.",
  "research": [
   "Sulfites (E 220 to E 228) are assessed together by EFSA as one group, because they release the same active form, sulfur dioxide. In 2016 EFSA kept a temporary group safe daily intake of 0.7 mg per kg of body weight (as sulfur dioxide) and said that estimated intakes were above it for all population groups. It noted gaps in the safety data and found no DNA-damage concern.",
   "In 2022 EFSA looked again. No new studies had closed the data gaps, so it withdrew the temporary safe daily intake. It used a margin-of-exposure approach instead and found margins below its target for most age groups, except adolescents. This is a statement about missing data and exposure, not proof of harm at normal intakes.",
   "The best-established effect in people is sensitivity. Some people, mainly those with asthma, can react to sulfites with wheezing, hives or stomach upset. Reactions are not predictable from the amount alone, which is why sulfites must be labelled.",
   "Foods differ a lot. Wine, dried fruit and some processed potato products tend to carry the most. Because the sulfites form the same active compound, this entry applies to the whole group."
  ],
  "careIf": "People with asthma and anyone who has had a reaction to sulfites. Regulators require sulfites above 10 mg/kg (or 10 mg/L) to be labelled for this reason.",
  "regulation": "Authorised in the EU and the US with maximum levels. In the EU and the US, sulfites above 10 mg/kg must be declared on the label. The US stopped their use on fresh fruit and vegetables served raw in the 1980s. An EU follow-up to the 2022 EFSA opinion has been discussed but We did not confirm a final decision.",
  "topics": [
   "Breathing reactions in sensitive people, especially with asthma",
   "Intake above EFSA's former safe limit (estimate)",
   "Data gaps (no safe daily intake set since 2022)"
  ],
  "contested": "CSPI rates sulfites 'certain people should avoid'. That fits the regulators: the risk is concentrated in sensitive people, mostly with asthma, and CSPI describes sulfites as safe for people who are not sensitive. Where CSPI and others sound stricter is the 2022 EFSA withdrawal of the safe intake; that reflects missing data rather than a new harm signal.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal, 2016",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4438"
   },
   {
    "text": "EFSA. Follow-up of the re-evaluation of sulfur dioxide and sulfites (E 220-E 228). EFSA Journal 20(11):7594, 2022",
    "url": "https://www.efsa.europa.eu/sites/default/files/2022-11/EFS2_7594.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sulfites",
    "url": "https://www.cspinet.org/article/sulfites-sulfur-dioxide-sodium-sulfite-sodium-bisulfite-potassium-bisulfite-sodium"
   }
  ]
 },
 {
  "id": "e234",
  "code": "E234",
  "name": "Nisin",
  "kind": "Preservative",
  "found": "Processed cheese, cheese spreads, puddings and some meat products.",
  "level": "little",
  "evidence": "None",
  "summary": "A natural antibacterial protein made by a milk-culture bacterium. EFSA set a safe daily intake in 2017 and found its uses were not a concern.",
  "research": [
   "EFSA first assessed nisin in 2006 and confirmed an ADI of 0.13 mg per kg of body weight. In 2017 it reviewed new rat data and set a higher ADI of 1 mg of nisin A per kg of body weight, from a 90-day study.",
   "The 2017 opinion also found that proposed wider uses in unripened cheese and heat-treated meat products would not be a safety concern.",
   "We searched for newer human or cohort studies and found none that raised a concern. My search was limited, so this reflects the regulator's view and the absence of a signal that we could find."
  ],
  "regulation": "Authorised in the EU with limits by food type. Also used in the US (generally recognised as safe, GRAS).",
  "topics": [],
  "contested": "We did not find a CSPI listing for nisin in our search, so We could not cross-check it. Consumer apps generally treat nisin as low-risk.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Safety of nisin (E 234) as a food additive in the light of new data and the proposed extension of use. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5063"
   }
  ]
 },
 {
  "id": "e235",
  "code": "E235",
  "name": "Natamycin",
  "also": "Pimaricin",
  "kind": "Preservative (antifungal)",
  "found": "The rind of semi-hard cheese and the casings of dry sausages.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Used only on surfaces. EFSA could not set its own safe daily intake because of data gaps, but judged the permitted uses not a safety concern.",
  "research": [
   "In 2009 EFSA said the available data were not robust enough to set an ADI. For example, there was no long-term cancer study. JECFA, the WHO and FAO committee, has an ADI of 0.3 mg per kg of body weight.",
   "EFSA still concluded that the proposed use levels are not of safety concern when natamycin is only used on the rind of semi-hard and semi-soft cheese and on certain sausage casings.",
   "Because natamycin is also a medicine for fungal infections, EFSA looked at resistance. It found no concern that food use would cause antimicrobial resistance."
  ],
  "careIf": "People who avoid eating cheese rind or sausage casing can avoid most exposure.",
  "regulation": "Authorised in the EU for surface treatment of certain cheeses and dry sausages. Also permitted in the US on cheese.",
  "topics": [
   "No EFSA safe daily intake set (data gap)"
  ],
  "contested": "We did not find a CSPI listing for natamycin in our search. Where apps rate it more strictly than regulators, the likely reason is the data gap EFSA named, not a found harm.",
  "sources": [
   {
    "text": "EFSA. Scientific Opinion on the use of natamycin (E 235) as a food additive. EFSA Journal, 2009",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/1412"
   }
  ]
 },
 {
  "id": "e242",
  "code": "E242",
  "name": "Dimethyl dicarbonate",
  "also": "DMDC",
  "kind": "Preservative",
  "found": "Soft drinks, wine, juices, tea drinks",
  "level": "little",
  "evidence": "Weak",
  "summary": "DMDC is a cold-sterilising preservative that breaks down after use. Regulators found no toxicological concern, but we could not read EFSA's opinion.",
  "research": [
   "The EU Scientific Committee on Food reviewed it in 2001 and found no toxicological concern at 250 mg/l, because it breaks down into substances considered harmless. A 2012 EU regulation authorised its use in alcoholic drinks on that basis.",
   "A consumer site reports that it breaks down to methanol and carbon dioxide. We could not confirm amounts from a primary source.",
   "EFSA has a re-evaluation of E 242 listed in databases. We could not confirm its conclusions and so do not state an ADI."
  ],
  "regulation": "Authorised in the EU in drinks, including alcoholic drinks since 2012.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EU. Commission Regulation (EU) No 1166/2012",
    "url": "https://www.legislation.gov.uk/eur/2012/1166/data.html"
   }
  ]
 },
 {
  "id": "e249",
  "code": "E249",
  "name": "Potassium nitrite",
  "highRisk": true,
  "kind": "Preservative (curing)",
  "found": "Preserved meats such as ham, bacon and salami.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Nitrite helps stop dangerous bacteria in preserved meat, but in the body it can form nitrosamines. Higher intake has been linked to some health risks in observational studies.",
  "research": [
   "In 2017 EFSA lowered the safe daily intake for nitrite to 0.07 mg nitrite ion per kg of body weight, based on raised methaemoglobin (blood that carries less oxygen) seen in humans and animals. It found no sign of DNA damage in living animals. Exposure from additive use was within the limit for all groups except children with a diet high in these foods, who slightly exceeded it.",
   "In 2010 IARC classed ingested nitrate or nitrite, under conditions that lead to nitrosamine formation in the body, as probably carcinogenic to humans (Group 2A). That wording matters: the risk depends on conditions such as protein-rich food, high heat and low vitamin C. Separately, IARC's 2015 Group 1 label applies to processed meat as a whole, not to nitrite alone.",
   "In the French NutriNet-Santé cohort (about 104,000 adults), higher intake of nitrite from additives was associated with a higher risk of type 2 diabetes over a median of about 7 years. No link was seen for nitrate additives. This is an observational result that needs repeating in other groups.",
   "It is not settled how much of the processed meat risk comes from nitrite itself. Nitrite also prevents botulism in preserved meats, which is why regulators allow it with limits."
  ],
  "careIf": "Infants (nitrite can raise methaemoglobin) and children with a high intake of preserved meat. Not meant for baby foods.",
  "regulation": "Authorised in the EU and the US for curing meat, with limits on amount. EU maximum levels for nitrites and nitrates were lowered after EFSA's 2017 opinion.",
  "topics": [
   "Nitrosamine formation (cancer risk, probable, under certain conditions)",
   "Type 2 diabetes (one large cohort)",
   "Children's intake slightly above the safe limit (estimate)"
  ],
  "contested": "CSPI rates sodium nitrite 'avoid', citing nitrosamines. EFSA is more measured: it set a safe daily intake and found exposure mostly within it. The evidence supports caution about frequent processed meat more than about nitrite alone, and cannot separate the two. Vitamin C added to preserved meats lowers nitrosamine formation. Where views differ: Rated high risk to match Yuka. EFSA found some evidence linking dietary nitrite to stomach and bowel cancer, and children's high intakes slightly exceed the daily limit. The US allows up to four times the EU's latest limit in some meats, per Yuka.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of potassium nitrite (E 249) and sodium nitrite (E 250) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4786"
   },
   {
    "text": "IARC. Ingested nitrate and nitrite, and cyanobacterial peptide toxins. IARC Monographs Volume 94, 2010",
    "url": "https://publications.iarc.who.int/112"
   },
   {
    "text": "INSERM. Dietary exposure to nitrites associated with a higher risk of type 2 diabetes (NutriNet-Santé), 2023",
    "url": "https://presse.inserm.fr/en/lexposition-alimentaire-aux-nitrites-associee-a-un-risque-accru-de-diabete-de-type-2/66398/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sodium nitrate and sodium nitrite",
    "url": "https://cspinet.org/article/sodium-nitrate-sodium-nitrite"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e250",
  "code": "E250",
  "name": "Sodium nitrite",
  "highRisk": true,
  "kind": "Preservative (curing)",
  "found": "Bacon, ham, hot dogs, salami and other preserved meats.",
  "level": "some",
  "evidence": "Moderate",
  "summary": "Nitrite helps stop dangerous bacteria in preserved meat, but in the body it can form nitrosamines. Higher intake has been linked to some health risks in observational studies.",
  "research": [
   "In 2017 EFSA lowered the safe daily intake for nitrite to 0.07 mg nitrite ion per kg of body weight, based on raised methaemoglobin (blood that carries less oxygen) seen in humans and animals. It found no sign of DNA damage in living animals. Exposure from additive use was within the limit for all groups except children with a diet high in these foods, who slightly exceeded it.",
   "In 2010 IARC classed ingested nitrate or nitrite, under conditions that lead to nitrosamine formation in the body, as probably carcinogenic to humans (Group 2A). That wording matters: the risk depends on conditions such as protein-rich food, high heat and low vitamin C. Separately, IARC's 2015 Group 1 label applies to processed meat as a whole, not to nitrite alone.",
   "In the French NutriNet-Santé cohort (about 104,000 adults), higher intake of nitrite from additives was associated with a higher risk of type 2 diabetes over a median of about 7 years. No link was seen for nitrate additives. This is an observational result that needs repeating in other groups.",
   "It is not settled how much of the processed meat risk comes from nitrite itself. Nitrite also prevents botulism in preserved meats, which is why regulators allow it with limits."
  ],
  "careIf": "Infants (nitrite can raise methaemoglobin) and children with a high intake of preserved meat. Not meant for baby foods.",
  "regulation": "Authorised in the EU and the US for curing meat, with limits on amount. EU maximum levels for nitrites and nitrates were lowered after EFSA's 2017 opinion.",
  "topics": [
   "Nitrosamine formation (cancer risk, probable, under certain conditions)",
   "Type 2 diabetes (one large cohort)",
   "Children's intake slightly above the safe limit (estimate)"
  ],
  "contested": "CSPI rates sodium nitrite 'avoid', citing nitrosamines. EFSA is more measured: it set a safe daily intake and found exposure mostly within it. The evidence supports caution about frequent processed meat more than about nitrite alone, and cannot separate the two. Vitamin C added to preserved meats lowers nitrosamine formation. Where views differ: Rated high risk to match Yuka. EFSA found some evidence linking dietary nitrite to stomach and bowel cancer, and children's high intakes slightly exceed the daily limit. The US allows up to four times the EU's latest limit in some meats, per Yuka.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of potassium nitrite (E 249) and sodium nitrite (E 250) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4786"
   },
   {
    "text": "IARC. Ingested nitrate and nitrite, and cyanobacterial peptide toxins. IARC Monographs Volume 94, 2010",
    "url": "https://publications.iarc.who.int/112"
   },
   {
    "text": "INSERM. Dietary exposure to nitrites associated with a higher risk of type 2 diabetes (NutriNet-Santé), 2023",
    "url": "https://presse.inserm.fr/en/lexposition-alimentaire-aux-nitrites-associee-a-un-risque-accru-de-diabete-de-type-2/66398/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sodium nitrate and sodium nitrite",
    "url": "https://cspinet.org/article/sodium-nitrate-sodium-nitrite"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e251",
  "code": "E251",
  "name": "Sodium nitrate",
  "kind": "Preservative (curing)",
  "found": "Preserved meats, some cheeses.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Nitrate is mostly harmless on its own and comes mainly from vegetables, but part of it turns into nitrite in the body. Additive nitrate is a small share of total intake.",
  "research": [
   "In 2017 EFSA kept the existing safe daily intake for nitrate of 3.7 mg per kg of body weight. It said a single value could not be derived from the data, but that there was not enough evidence to withdraw it. The uncertainty is how much nitrate is turned into nitrite by bacteria in saliva.",
   "Nitrate used as an additive was estimated at under 5% of total dietary nitrate. Most comes naturally from vegetables or from drinking water. When all sources are counted, EFSA estimated that the safe daily intake is exceeded for all age groups, which shows how little of it comes from additives.",
   "IARC's 2010 Group 2A class covers ingested nitrate or nitrite only under conditions that favour nitrosamine formation. Vegetable nitrate is generally linked with lower, not higher, risks in cohorts, probably because vitamin C and other compounds block nitrosamine formation.",
   "In the NutriNet-Santé cohort, nitrate from additives was not associated with type 2 diabetes, unlike nitrite."
  ],
  "careIf": "Infants. Nitrate in water or food can be converted to nitrite and affect blood oxygen carrying.",
  "regulation": "Authorised in the EU and the US for certain preserved meats and cheeses, with limits. EU limits were lowered after 2017.",
  "topics": [
   "Conversion to nitrite in the body (partly confirmed)",
   "Nitrosamine formation under some conditions"
  ],
  "contested": "CSPI groups nitrate with nitrite and rates the pair 'avoid'. Regulators do not assess nitrate as a separate cancer hazard, and vegetable nitrate is not linked to harm. A caution applies mainly to preserved meat eaten often.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of sodium nitrate (E 251) and potassium nitrate (E 252) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4787"
   },
   {
    "text": "IARC. Ingested nitrate and nitrite, and cyanobacterial peptide toxins. IARC Monographs Volume 94, 2010",
    "url": "https://publications.iarc.who.int/112"
   },
   {
    "text": "INSERM. Dietary exposure to nitrites associated with a higher risk of type 2 diabetes (NutriNet-Santé), 2023",
    "url": "https://presse.inserm.fr/en/lexposition-alimentaire-aux-nitrites-associee-a-un-risque-accru-de-diabete-de-type-2/66398/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sodium nitrate and sodium nitrite",
    "url": "https://cspinet.org/article/sodium-nitrate-sodium-nitrite"
   }
  ]
 },
 {
  "id": "e252",
  "code": "E252",
  "name": "Potassium nitrate",
  "also": "Saltpetre",
  "kind": "Preservative (curing)",
  "found": "Preserved meats, some cheeses.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Nitrate is mostly harmless on its own and comes mainly from vegetables, but part of it turns into nitrite in the body. Additive nitrate is a small share of total intake.",
  "research": [
   "In 2017 EFSA kept the existing safe daily intake for nitrate of 3.7 mg per kg of body weight. It said a single value could not be derived from the data, but that there was not enough evidence to withdraw it. The uncertainty is how much nitrate is turned into nitrite by bacteria in saliva.",
   "Nitrate used as an additive was estimated at under 5% of total dietary nitrate. Most comes naturally from vegetables or from drinking water. When all sources are counted, EFSA estimated that the safe daily intake is exceeded for all age groups, which shows how little of it comes from additives.",
   "IARC's 2010 Group 2A class covers ingested nitrate or nitrite only under conditions that favour nitrosamine formation. Vegetable nitrate is generally linked with lower, not higher, risks in cohorts, probably because vitamin C and other compounds block nitrosamine formation.",
   "In the NutriNet-Santé cohort, nitrate from additives was not associated with type 2 diabetes, unlike nitrite."
  ],
  "careIf": "Infants. Nitrate in water or food can be converted to nitrite and affect blood oxygen carrying.",
  "regulation": "Authorised in the EU and the US for certain preserved meats and cheeses, with limits. EU limits were lowered after 2017.",
  "topics": [
   "Conversion to nitrite in the body (partly confirmed)",
   "Nitrosamine formation under some conditions"
  ],
  "contested": "CSPI groups nitrate with nitrite and rates the pair 'avoid'. Regulators do not assess nitrate as a separate cancer hazard, and vegetable nitrate is not linked to harm. A caution applies mainly to preserved meat eaten often.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of sodium nitrate (E 251) and potassium nitrate (E 252) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4787"
   },
   {
    "text": "IARC. Ingested nitrate and nitrite, and cyanobacterial peptide toxins. IARC Monographs Volume 94, 2010",
    "url": "https://publications.iarc.who.int/112"
   },
   {
    "text": "INSERM. Dietary exposure to nitrites associated with a higher risk of type 2 diabetes (NutriNet-Santé), 2023",
    "url": "https://presse.inserm.fr/en/lexposition-alimentaire-aux-nitrites-associee-a-un-risque-accru-de-diabete-de-type-2/66398/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Sodium nitrate and sodium nitrite",
    "url": "https://cspinet.org/article/sodium-nitrate-sodium-nitrite"
   }
  ]
 },
 {
  "id": "e260",
  "code": "E260",
  "name": "Acetic acid",
  "kind": "Acidity regulator, preservative",
  "found": "Vinegar, pickles, sauces, dressings, bread, crisps flavouring.",
  "level": "little",
  "evidence": "None",
  "summary": "The acid in vinegar. We found no regulator concern at food uses.",
  "research": [
   "Acetic acid is the main acid in vinegar and a normal part of human metabolism, including from gut bacteria.",
   "It is authorised in the EU for a wide range of foods. We did not find an EFSA re-evaluation opinion for it in our search. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels. Concentrated acetic acid is an irritant, but that is not how it is used in food."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "Consumer databases generally list acetic acid and acetates as safe. We found no regulator or study raising a concern at food levels.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2023/2086 (food additive uses including E 260 and E 263)",
    "url": "https://eur-lex.europa.eu/eli/reg/2023/2086/oj/eng/pdf"
   }
  ]
 },
 {
  "id": "e262",
  "code": "E262",
  "name": "Sodium acetates",
  "kind": "Acidity regulator, preservative",
  "found": "Crisps (salt and vinegar flavour), pickles, sauces, bread, meat products.",
  "level": "little",
  "evidence": "None",
  "summary": "Sodium salts of acetic acid (sodium acetate and sodium diacetate). We found no regulator concern.",
  "research": [
   "Sodium acetates break down to acetate, which the body handles normally.",
   "We did not find an EFSA re-evaluation opinion for them in our search. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "They add a little sodium, which is small next to the sodium from salt in most processed foods."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [],
  "contested": "Consumer databases generally list acetic acid and acetates as safe. We found no regulator or study raising a concern at food levels.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2023/2086 (food additive uses including E 260 and E 263)",
    "url": "https://eur-lex.europa.eu/eli/reg/2023/2086/oj/eng/pdf"
   }
  ]
 },
 {
  "id": "e263",
  "code": "E263",
  "name": "Calcium acetate",
  "kind": "Acidity regulator, preservative",
  "found": "Bread, bakery products, sauces, some processed foods.",
  "level": "little",
  "evidence": "None",
  "summary": "A calcium salt of acetic acid. We found no regulator concern.",
  "research": [
   "Calcium acetate breaks down to calcium and acetate, both normal in the body.",
   "We did not find an EFSA re-evaluation opinion for it in our search. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "Calcium acetate is also used as a medicine to bind phosphate in some kidney patients, at much higher doses than in food."
  ],
  "regulation": "Authorised in the EU with limits and in the US.",
  "topics": [],
  "contested": "Consumer databases generally list acetic acid and acetates as safe. We found no regulator or study raising a concern at food levels.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2023/2086 (food additive uses including E 260 and E 263)",
    "url": "https://eur-lex.europa.eu/eli/reg/2023/2086/oj/eng/pdf"
   }
  ]
 },
 {
  "id": "e270",
  "code": "E270",
  "name": "Lactic acid",
  "kind": "Acidity regulator, preservative",
  "found": "Yoghurt, cheese, pickles, sauces, bread, drinks, meat products.",
  "level": "little",
  "evidence": "None",
  "summary": "An acid made by fermenting sugars, found naturally in fermented foods. We found no regulator concern.",
  "research": [
   "Lactic acid and lactates are normal products of metabolism and occur naturally in fermented foods like yoghurt.",
   "EFSA lists lactates among additives whose data are still being gathered under its re-evaluation programme. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate lactic acid and lactates as safe. Some apps flag them because they can be made by fermentation or because of mentions of infants; the reasons are weak and we found no regulator concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Open call for food additives analytical data and use levels (lists lactates and citrates among additives still being reviewed)",
    "url": "https://www.efsa.europa.eu/en/call/open-call-food-additives-analytical-data-and-use-levels-food-and-beverages-intended-human"
   }
  ]
 },
 {
  "id": "e280",
  "code": "E280",
  "name": "Propionic acid",
  "kind": "Preservative (mould inhibitor)",
  "found": "Bread, baked goods and some cheeses.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators found no safety concern at current uses. Small studies raise questions about behaviour and blood sugar that have not been confirmed.",
  "research": [
   "Propionic acid and its salts occur naturally in the body and in foods such as cheese. JECFA gave them an acceptable daily intake of 'not limited'. EFSA's re-evaluation concluded there was no safety concern at the authorised uses and levels.",
   "A small double-blind crossover trial in Australia (27 children, 2002) gave bread with calcium propionate or placebo. Two main measures showed no significant difference, but more children's behaviour worsened (52%) than improved (19%) on the preservative. It is a small, old study and has not been confirmed in large trials.",
   "A 2019 Harvard study in Science Translational Medicine found that mice given propionate gained weight and developed insulin resistance. In 14 healthy adults, a meal with propionate raised glucagon and FABP4 in blood in the short term. The authors said the human arm was too small to be definitive.",
   "These are early signals. They do not show harm from normal bread consumption, but they have not been ruled out by large trials either."
  ],
  "careIf": "Parents of children with behaviour sensitivities to additives may wish to watch for patterns, based on the small 2002 trial.",
  "regulation": "Authorised in the EU and the US (GRAS) as a preservative, with limits in some foods. Propionates are also made naturally by gut bacteria.",
  "topics": [
   "Children's behaviour (one small trial)",
   "Blood sugar and weight (mice, small human study)"
  ],
  "contested": "CSPI rates calcium and sodium propionate 'safe', in line with regulators. Some consumer apps and press coverage rate propionates more strictly, citing the 2019 Harvard mouse and small human study. That evidence is limited, so a stricter view goes beyond what is shown.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of propionic acid and its salts (E 280-283), as summarised in Commission Regulation (EU) 2016/683",
    "url": "https://www.legislation.gov.uk/eur/2016/683"
   },
   {
    "text": "Harvard T.H. Chan School of Public Health. Could a popular food ingredient raise the risk for diabetes and obesity? 2019",
    "url": "https://hsph.harvard.edu/news/could-a-popular-food-ingredient-raise-the-risk-for-diabetes-and-obesity/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Calcium (or sodium) propionate",
    "url": "https://cspinet.org/article/calcium-or-sodium-propionate"
   }
  ]
 },
 {
  "id": "e281",
  "code": "E281",
  "name": "Sodium propionate",
  "kind": "Preservative (mould inhibitor)",
  "found": "Bread, baked goods and cakes.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators found no safety concern at current uses. Small studies raise questions about behaviour and blood sugar that have not been confirmed.",
  "research": [
   "Propionic acid and its salts occur naturally in the body and in foods such as cheese. JECFA gave them an acceptable daily intake of 'not limited'. EFSA's re-evaluation concluded there was no safety concern at the authorised uses and levels.",
   "A small double-blind crossover trial in Australia (27 children, 2002) gave bread with calcium propionate or placebo. Two main measures showed no significant difference, but more children's behaviour worsened (52%) than improved (19%) on the preservative. It is a small, old study and has not been confirmed in large trials.",
   "A 2019 Harvard study in Science Translational Medicine found that mice given propionate gained weight and developed insulin resistance. In 14 healthy adults, a meal with propionate raised glucagon and FABP4 in blood in the short term. The authors said the human arm was too small to be definitive.",
   "These are early signals. They do not show harm from normal bread consumption, but they have not been ruled out by large trials either."
  ],
  "careIf": "Parents of children with behaviour sensitivities to additives may wish to watch for patterns, based on the small 2002 trial.",
  "regulation": "Authorised in the EU and the US (GRAS) as a preservative, with limits in some foods. Propionates are also made naturally by gut bacteria.",
  "topics": [
   "Children's behaviour (one small trial)",
   "Blood sugar and weight (mice, small human study)"
  ],
  "contested": "CSPI rates calcium and sodium propionate 'safe', in line with regulators. Some consumer apps and press coverage rate propionates more strictly, citing the 2019 Harvard mouse and small human study. That evidence is limited, so a stricter view goes beyond what is shown.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of propionic acid and its salts (E 280-283), as summarised in Commission Regulation (EU) 2016/683",
    "url": "https://www.legislation.gov.uk/eur/2016/683"
   },
   {
    "text": "Harvard T.H. Chan School of Public Health. Could a popular food ingredient raise the risk for diabetes and obesity? 2019",
    "url": "https://hsph.harvard.edu/news/could-a-popular-food-ingredient-raise-the-risk-for-diabetes-and-obesity/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Calcium (or sodium) propionate",
    "url": "https://cspinet.org/article/calcium-or-sodium-propionate"
   }
  ]
 },
 {
  "id": "e282",
  "code": "E282",
  "name": "Calcium propionate",
  "kind": "Preservative (mould inhibitor)",
  "found": "Bread, rolls, baked goods and processed cheese.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators found no safety concern at current uses. Small studies raise questions about behaviour and blood sugar that have not been confirmed.",
  "research": [
   "Propionic acid and its salts occur naturally in the body and in foods such as cheese. JECFA gave them an acceptable daily intake of 'not limited'. EFSA's re-evaluation concluded there was no safety concern at the authorised uses and levels.",
   "A small double-blind crossover trial in Australia (27 children, 2002) gave bread with calcium propionate or placebo. Two main measures showed no significant difference, but more children's behaviour worsened (52%) than improved (19%) on the preservative. It is a small, old study and has not been confirmed in large trials.",
   "A 2019 Harvard study in Science Translational Medicine found that mice given propionate gained weight and developed insulin resistance. In 14 healthy adults, a meal with propionate raised glucagon and FABP4 in blood in the short term. The authors said the human arm was too small to be definitive.",
   "These are early signals. They do not show harm from normal bread consumption, but they have not been ruled out by large trials either."
  ],
  "careIf": "Parents of children with behaviour sensitivities to additives may wish to watch for patterns, based on the small 2002 trial.",
  "regulation": "Authorised in the EU and the US (GRAS) as a preservative, with limits in some foods. Propionates are also made naturally by gut bacteria.",
  "topics": [
   "Children's behaviour (one small trial)",
   "Blood sugar and weight (mice, small human study)"
  ],
  "contested": "CSPI rates calcium and sodium propionate 'safe', in line with regulators. Some consumer apps and press coverage rate propionates more strictly, citing the 2019 Harvard mouse and small human study. That evidence is limited, so a stricter view goes beyond what is shown.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of propionic acid and its salts (E 280-283), as summarised in Commission Regulation (EU) 2016/683",
    "url": "https://www.legislation.gov.uk/eur/2016/683"
   },
   {
    "text": "Harvard T.H. Chan School of Public Health. Could a popular food ingredient raise the risk for diabetes and obesity? 2019",
    "url": "https://hsph.harvard.edu/news/could-a-popular-food-ingredient-raise-the-risk-for-diabetes-and-obesity/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Calcium (or sodium) propionate",
    "url": "https://cspinet.org/article/calcium-or-sodium-propionate"
   }
  ]
 },
 {
  "id": "e283",
  "code": "E283",
  "name": "Potassium propionate",
  "kind": "Preservative (mould inhibitor)",
  "found": "Bread and baked goods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators found no safety concern at current uses. Small studies raise questions about behaviour and blood sugar that have not been confirmed.",
  "research": [
   "Propionic acid and its salts occur naturally in the body and in foods such as cheese. JECFA gave them an acceptable daily intake of 'not limited'. EFSA's re-evaluation concluded there was no safety concern at the authorised uses and levels.",
   "A small double-blind crossover trial in Australia (27 children, 2002) gave bread with calcium propionate or placebo. Two main measures showed no significant difference, but more children's behaviour worsened (52%) than improved (19%) on the preservative. It is a small, old study and has not been confirmed in large trials.",
   "A 2019 Harvard study in Science Translational Medicine found that mice given propionate gained weight and developed insulin resistance. In 14 healthy adults, a meal with propionate raised glucagon and FABP4 in blood in the short term. The authors said the human arm was too small to be definitive.",
   "These are early signals. They do not show harm from normal bread consumption, but they have not been ruled out by large trials either."
  ],
  "careIf": "Parents of children with behaviour sensitivities to additives may wish to watch for patterns, based on the small 2002 trial.",
  "regulation": "Authorised in the EU and the US (GRAS) as a preservative, with limits in some foods. Propionates are also made naturally by gut bacteria.",
  "topics": [
   "Children's behaviour (one small trial)",
   "Blood sugar and weight (mice, small human study)"
  ],
  "contested": "CSPI rates calcium and sodium propionate 'safe', in line with regulators. Some consumer apps and press coverage rate propionates more strictly, citing the 2019 Harvard mouse and small human study. That evidence is limited, so a stricter view goes beyond what is shown.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of propionic acid and its salts (E 280-283), as summarised in Commission Regulation (EU) 2016/683",
    "url": "https://www.legislation.gov.uk/eur/2016/683"
   },
   {
    "text": "Harvard T.H. Chan School of Public Health. Could a popular food ingredient raise the risk for diabetes and obesity? 2019",
    "url": "https://hsph.harvard.edu/news/could-a-popular-food-ingredient-raise-the-risk-for-diabetes-and-obesity/"
   },
   {
    "text": "CSPI. Chemical Cuisine: Calcium (or sodium) propionate",
    "url": "https://cspinet.org/article/calcium-or-sodium-propionate"
   }
  ]
 },
 {
  "id": "e290",
  "code": "E290",
  "name": "Carbon dioxide",
  "also": "CO2, fizz gas",
  "kind": "Gas for fizz and packaging",
  "found": "Fizzy drinks, sparkling water, beer, packaged fresh foods",
  "level": "little",
  "evidence": "None",
  "summary": "Carbon dioxide is the gas that makes drinks fizzy. We found no safety concern from regulators for this use.",
  "research": [
   "JECFA last evaluated carbon dioxide in 1985 and did not specify an ADI, which means no numerical limit was thought necessary. In the US it is listed by FDA among substances affirmed as GRAS.",
   "EFSA has put carbon dioxide in a group of gaseous additives for re-evaluation and ran a call for data that closed on 31 March 2024. We could not confirm that a final EFSA opinion on E 290 has been published.",
   "We did not find a credible human safety signal at food-additive levels. The gas is also made in the body and breathed out."
  ],
  "regulation": "Authorised in the EU and the US. Re-evaluation by EFSA was still pending when we searched.",
  "topics": [],
  "sources": [
   {
    "text": "IPCS INCHEM. JECFA evaluation summary: carbon dioxide",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_362.htm"
   },
   {
    "text": "EFSA. Call for data for the re-evaluation of food additives in gaseous form",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-food-additives-gaseous-form"
   },
   {
    "text": "US eCFR. 21 CFR Part 184 Subpart B, GRAS substances (includes 184.1240 carbon dioxide)",
    "url": "https://www.law.cornell.edu/cfr/text/21/part-184/subpart-B"
   }
  ]
 },
 {
  "id": "e296",
  "code": "E296",
  "name": "Malic acid",
  "kind": "Acidity regulator, flavour",
  "found": "Sweets, soft drinks, sour candy, fruit products.",
  "level": "little",
  "evidence": "None",
  "summary": "The acid that gives apples their tang. We found no regulator concern at food levels.",
  "research": [
   "Malic acid occurs naturally in fruit and is part of normal human metabolism.",
   "EFSA collected data in 2024 as part of its re-evaluation of malic acid and malates (E 296, E 350-352). EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels. As with other acids, sipping sour drinks often can wear tooth enamel."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate malic and fumaric acid as safe. We found no regulator or study that raises a concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of malic acid and malates (E 296; E 350-352)",
    "url": "https://efsa.europa.eu/en/call/call-data-re-evaluation-malic-acid-and-malates-e-296-e-350-352-food-additives"
   }
  ]
 },
 {
  "id": "e297",
  "code": "E297",
  "name": "Fumaric acid",
  "kind": "Acidity regulator",
  "found": "Sour sweets, drinks, bakery products, desserts, wine.",
  "level": "little",
  "evidence": "None",
  "summary": "A food acid also found in some plants. We found no regulator concern at food levels.",
  "research": [
   "Fumaric acid occurs in many plants and is part of normal metabolism.",
   "EFSA opened a call for data in 2024 to re-evaluate fumaric acid (E 297) and succinic acid (E 363). The call said the date for finishing the programme had passed and some additives remain. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels. Related fumarate medicines are used at far higher doses and are not a guide to food uses."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate malic and fumaric acid as safe. We found no regulator or study that raises a concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of fumaric acid (E 297) and succinic acid (E 363)",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-fumaric-acid-e-297-and-succinic-acid-e-363-food-additives"
   }
  ]
 },
 {
  "id": "e300",
  "code": "E300",
  "name": "Ascorbic acid",
  "labelName": "Vitamin C (ascorbic acid)",
  "kind": "Antioxidant (vitamin C)",
  "found": "Fruit drinks, jams, processed meats, bread flour, canned fruit and vegetables.",
  "level": "little",
  "evidence": "None",
  "summary": "This is vitamin C. EFSA found no safety concern at current uses and saw no need for a numerical safe limit.",
  "research": [
   "EFSA's 2015 re-evaluation of ascorbic acid, sodium ascorbate and calcium ascorbate found no sign of DNA damage. Long-term animal studies, including high doses, showed no cancer signal or long-term harm, and prenatal studies showed no harm.",
   "The panel concluded there is no safety concern at the reported uses and use levels, and that a numerical acceptable daily intake was not needed.",
   "Very large amounts, such as high-dose supplements, are a different question from the small amounts used to protect colour and flavour in foods."
  ],
  "regulation": "Authorised in the EU and the US with few limits. Also a normal nutrient.",
  "topics": [],
  "contested": "Consumer databases that score additives by function or by how 'processed' a food is may mark vitamin C additives down, but we found no regulator, IARC listing or human study that supports a concern at food-additive amounts.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of ascorbic acid (E 300), sodium ascorbate (E 301) and calcium ascorbate (E 302) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4087"
   }
  ]
 },
 {
  "id": "e301",
  "code": "E301",
  "name": "Sodium ascorbate",
  "kind": "Antioxidant (vitamin C salt)",
  "found": "Ham and processed meats, fruit and vegetable products, drinks.",
  "level": "little",
  "evidence": "None",
  "summary": "A sodium salt of vitamin C. EFSA found no safety concern at current uses.",
  "research": [
   "EFSA reviewed sodium ascorbate together with ascorbic acid and calcium ascorbate in 2015. It found no concern about DNA damage, cancer or effects on development in the studies available.",
   "The panel concluded there is no safety concern at the reported uses and use levels and no need for a numerical acceptable daily intake.",
   "It adds a small amount of sodium, which is minor next to the sodium in most processed foods."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "Consumer databases that score additives by function or by how 'processed' a food is may mark vitamin C additives down, but we found no regulator, IARC listing or human study that supports a concern at food-additive amounts.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of ascorbic acid (E 300), sodium ascorbate (E 301) and calcium ascorbate (E 302) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4087"
   }
  ]
 },
 {
  "id": "e304",
  "code": "E304",
  "name": "Ascorbyl palmitate",
  "kind": "Antioxidant (fat-soluble vitamin C)",
  "found": "Oils and fats, margarine, cereals, snack foods, some baby foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A fat-soluble form of vitamin C. EFSA found no safety concern at current uses, but the safety data were too limited to set a numerical safe limit.",
  "research": [
   "EFSA's 2015 opinion covered ascorbyl palmitate (E 304(i)) and ascorbyl stearate (E 304(ii)). The panel assumed both break down in the gut into vitamin C and a fatty acid, so it applied the safety data for those parts. It found no safety concern at the reported uses and use levels.",
   "Because the data on the intact substances were limited, EFSA did not set a numerical acceptable daily intake. Its high-level exposure estimates were up to about 10.8 mg per kg of body weight per day (an estimate).",
   "The opinion left out infants under 12 weeks, and EFSA has since asked for more data on uses in infant foods. That is a data gap, not a finding of harm."
  ],
  "careIf": "EFSA's 2015 opinion did not cover infants under 12 weeks, so it is not a conclusion for very young babies.",
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Limited safety data (no numerical limit set)"
  ],
  "contested": "Some consumer databases flag it as an additive of unknown safety. That is fair for the data gap, but EFSA found no concern at current uses and we found no human study showing harm.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of ascorbyl palmitate (E 304(i)) and ascorbyl stearate (E 304(ii)) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4289"
   }
  ]
 },
 {
  "id": "e306",
  "code": "E306",
  "name": "Tocopherol-rich extract",
  "kind": "Antioxidant (vitamin E, mixed tocopherols)",
  "found": "Vegetable oils, fats, snack foods, cereals, dressings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A mix of vitamin E forms from vegetable oils. EFSA found low safety but did not set a numerical safe limit because some data were missing.",
  "research": [
   "EFSA's 2015 opinion reviewed tocopherol-rich extract (E 306) and alpha-, gamma- and delta-tocopherol (E 307 to 309). Short-term harm is low and EFSA found no concern about DNA damage or cancer.",
   "In 13-week and 16-month animal studies the no-effect level was 125 mg per kg of body weight per day. The effect seen at higher doses was a longer blood clotting time.",
   "EFSA did not set a numerical acceptable daily intake because data on reproduction and development were insufficient. It concluded that alpha-tocopherol at the reported uses is not of safety concern.",
   "The 2015 opinion did not cover infants under 12 weeks. EFSA later asked for more data on those uses."
  ],
  "careIf": "EFSA's 2015 opinion did not cover infants under 12 weeks.",
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Limited reproduction data (no numerical limit set)"
  ],
  "contested": "Consumer databases usually treat tocopherols as safe because they are vitamin E. That fits the low safety, but the data gap on reproduction is why we show a minor note instead of a clear rating.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of tocopherol-rich extract (E 306), alpha-, gamma- and delta-tocopherol (E 307-309) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/sv/efsajournal/pub/4247"
   }
  ]
 },
 {
  "id": "e307",
  "code": "E307",
  "name": "Alpha-tocopherol",
  "kind": "Antioxidant (vitamin E)",
  "found": "Oils, margarine, cereals, supplements, fortified foods.",
  "level": "little",
  "evidence": "None",
  "summary": "This is the main form of vitamin E. EFSA judged it not of safety concern at the reported uses.",
  "research": [
   "EFSA's 2015 opinion reviewed tocopherol-rich extract (E 306) and alpha-, gamma- and delta-tocopherol (E 307 to 309). Short-term harm is low and EFSA found no concern about DNA damage or cancer.",
   "In 13-week and 16-month animal studies the no-effect level was 125 mg per kg of body weight per day. The effect seen at higher doses was a longer blood clotting time.",
   "EFSA said alpha-tocopherol as an additive is not of safety concern, given that people eat it as an essential nutrient and that intake from additive uses stays under the upper level for vitamin E in nearly all groups. One survey in one country showed children above it."
  ],
  "regulation": "Authorised in the EU and the US with limits. Also an essential nutrient.",
  "topics": [],
  "contested": "No major database or regulator we checked rates alpha-tocopherol as a concern at additive amounts.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of tocopherol-rich extract (E 306), alpha-, gamma- and delta-tocopherol (E 307-309) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/sv/efsajournal/pub/4247"
   }
  ]
 },
 {
  "id": "e309",
  "code": "E309",
  "name": "Delta-tocopherol",
  "kind": "Antioxidant (vitamin E form)",
  "found": "Vegetable oils, fats, snack foods, margarine.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A vitamin E form. EFSA found low safety but did not set a numerical safe limit because some data were missing.",
  "research": [
   "EFSA's 2015 opinion reviewed tocopherol-rich extract (E 306) and alpha-, gamma- and delta-tocopherol (E 307 to 309). Short-term harm is low and EFSA found no concern about DNA damage or cancer.",
   "In 13-week and 16-month animal studies the no-effect level was 125 mg per kg of body weight per day. The effect seen at higher doses was a longer blood clotting time.",
   "EFSA did not set a numerical acceptable daily intake because data on reproduction and development were insufficient. It concluded that alpha-tocopherol at the reported uses is not of safety concern.",
   "The 2015 opinion did not cover infants under 12 weeks."
  ],
  "careIf": "EFSA's 2015 opinion did not cover infants under 12 weeks.",
  "regulation": "Authorised in the EU with limits.",
  "topics": [
   "Limited reproduction data (no numerical limit set)"
  ],
  "sources": [
   {
    "text": "EFSA. Re-evaluation of tocopherol-rich extract (E 306), alpha-, gamma- and delta-tocopherol (E 307-309) as food additives. EFSA Journal, 2015",
    "url": "https://efsa.europa.eu/sv/efsajournal/pub/4247"
   }
  ]
 },
 {
  "id": "e310",
  "code": "E310",
  "name": "Propyl gallate",
  "kind": "Antioxidant",
  "found": "Oils, fats, snacks, chewing gum and meat products.",
  "level": "some",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "EFSA said use at current levels is not of safety concern, but high-end adult intakes were estimated above its safe daily intake. Concerns come from animal and lab work.",
  "research": [
   "EFSA re-evaluated propyl gallate in 2014 and set a new safe daily intake of 0.5 mg per kg of body weight, from a 90-day rat study with a 300-fold safety margin. High-level exposure estimates for adults and the elderly were above that figure. Because the exposure estimate was cautious, EFSA concluded that use at current levels is not of safety concern.",
   "In US government rat studies, there were more tumours in some low-dose groups than in controls or high-dose groups. CSPI reads this as a possible sign of cancer or hormone effects. The pattern was inconsistent across doses, which makes it hard to interpret.",
   "Lab studies on cells have reported cell damage and DNA effects for propyl gallate at high concentrations. We did not find human studies that show harm from the amounts used in food."
  ],
  "regulation": "Authorised in the EU and the US with maximum levels, often combined with other antioxidants.",
  "topics": [
   "Tumours in some rat studies (unclear)",
   "Cell damage in lab tests",
   "High-end adult intake above safe limit (estimate)"
  ],
  "contested": "CSPI rates propyl gallate 'avoid'. Regulators allow it. The CSPI concern rests on an unusual dose pattern in rat studies; the evidence in humans is lacking, so 'avoid' is a precaution rather than a finding of harm in people.",
  "sources": [
   {
    "text": "EFSA. Scientific opinion on the re-evaluation of propyl gallate (E 310) as a food additive. EFSA Journal, 2014",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/3642"
   },
   {
    "text": "CSPI. Chemical Cuisine: Propyl gallate",
    "url": "https://www.cspinet.org/article/propyl-gallate"
   },
   {
    "text": "Cell and DNA damage effects of tert-butylhydroquinone, butylated hydroxyanisole and propyl gallate as synthetic food antioxidants. Food Sci Nutr, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11521724/"
   }
  ]
 },
 {
  "id": "e315",
  "code": "E315",
  "name": "Erythorbic acid",
  "kind": "Antioxidant",
  "found": "Ham and processed meats, canned fruit, frozen fish, drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A close relative of vitamin C that does not work as vitamin C. EFSA kept its safe limit at 6 mg per kg of body weight per day.",
  "research": [
   "EFSA's 2016 re-evaluation of erythorbic acid and sodium erythorbate found low short-term harm, no harm in subchronic studies and no concern about DNA damage or cancer.",
   "The highest no-effect level was 650 mg per kg of body weight per day in a cancer study. The database has gaps: there are no reproduction or long-term safety studies. EFSA did not think that justified a bigger safety factor.",
   "EFSA kept the acceptable daily intake of 6 mg per kg of body weight per day set earlier by the EU's Scientific Committee on Food. No population group was estimated to go above it."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Some gaps in animal data (no concern found)"
  ],
  "sources": [
   {
    "text": "EFSA. Re-evaluation of erythorbic acid (E 315) and sodium erythorbate (E 316) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4360"
   }
  ]
 },
 {
  "id": "e316",
  "code": "E316",
  "name": "Sodium erythorbate",
  "kind": "Antioxidant",
  "found": "Ham, bacon-type products and sausages, sausages, canned foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "The sodium salt of erythorbic acid. EFSA kept the safe limit at 6 mg per kg of body weight per day and found no group above it.",
  "research": [
   "EFSA's 2016 re-evaluation covered erythorbic acid and sodium erythorbate together. It found low short-term harm and no concern about DNA damage or cancer.",
   "The database has gaps: no reproduction or long-term harm studies. EFSA kept the acceptable daily intake of 6 mg per kg of body weight per day.",
   "Sodium erythorbate is often used in processed meat. Any concern about processed meat as a food comes from the meat and nitrite, not from this additive."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Some gaps in animal data (no concern found)"
  ],
  "sources": [
   {
    "text": "EFSA. Re-evaluation of erythorbic acid (E 315) and sodium erythorbate (E 316) as food additives. EFSA Journal, 2016",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4360"
   }
  ]
 },
 {
  "id": "e319",
  "code": "E319",
  "name": "TBHQ",
  "also": "Tertiary-butylhydroquinone",
  "kind": "Antioxidant",
  "found": "Frying oils, crackers, instant noodles, snacks and processed meats.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Regulators allow it within a set safe daily intake. Animal and lab studies have reported tumours or cell damage at high doses, not shown in people.",
  "research": [
   "JECFA set an acceptable daily intake of 0 to 0.7 mg per kg of body weight (1997 evaluation). EFSA's Scientific Panel on food additives assessed TBHQ in 2004. We could not read that opinion, so we do not cite its figures here.",
   "CSPI notes a US government rat study with a better design than similar studies in which TBHQ increased tumour rates. Other studies have not agreed on this.",
   "Lab studies on cells report cell and DNA damage from TBHQ at high concentrations. These have not been confirmed in people at food levels, and We did not find human cohort studies on E319."
  ],
  "regulation": "Authorised in the EU (since 2006 under Directive 2006/52/EC) and the US, with limits.",
  "topics": [
   "Tumours in some rat studies",
   "Cell damage in lab tests (high concentrations)"
  ],
  "contested": "Some consumer-advocacy sources are stricter than regulators because of animal and lab findings. The evidence in humans is lacking, so the stricter view is a precaution, not a finding of harm in people.",
  "sources": [
   {
    "text": "JECFA. Tertiary-butylhydroquinone evaluation (ADI 0-0.7 mg/kg bw). IPCS INCHEM",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_2240.htm"
   },
   {
    "text": "EFSA. Opinion on tertiary-butyl hydroquinone (TBHQ) E 319. EFSA Journal, 2004",
    "url": "https://www.efsa.europa.eu/fr/efsajournal/pub/84"
   },
   {
    "text": "CSPI. Chemical Cuisine: TBHQ (tert-butylhydroquinone)",
    "url": "https://cspinet.org/article/tbhq-tert-butylhydroquinone"
   },
   {
    "text": "Cell and DNA damage effects of tert-butylhydroquinone, butylated hydroxyanisole and propyl gallate as synthetic food antioxidants. Food Sci Nutr, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11521724/"
   }
  ]
 },
 {
  "id": "e320",
  "code": "E320",
  "name": "Butylated hydroxyanisole",
  "highRisk": true,
  "kind": "Antioxidant preservative",
  "found": "Chips, cereals, chewing gum, instant mashed potato, fats and oils.",
  "level": "some",
  "evidence": "Weak",
  "summary": "IARC and the US NTP both flag it on the strength of animal tumours. EFSA set a safe daily intake and doubts the animal finding applies to people.",
  "research": [
   "IARC lists BHA as possibly carcinogenic to humans (Group 2B). That rests on stomach tumours in rodents fed high doses. IARC found no human cancer data. The US NTP (a US government testing programme) lists it as reasonably anticipated to be a human carcinogen, also on animal evidence.",
   "EFSA's 2011 re-evaluation found no concern about DNA damage. It judged the rodent forestomach changes may not be relevant to people, who have no forestomach. It set an acceptable daily intake of 1.0 mg per kg of body weight per day, based on effects in rat pups.",
   "At refined estimates, EFSA found intake from additive use generally below that limit. A 2012 EFSA statement added that intake from additives plus food-contact materials could be above it for most groups. These are estimates.",
   "The stomach finding has not been confirmed in people, and there are no large human studies of BHA at food levels that we could cite."
  ],
  "careIf": "No regulator names a specific group.",
  "regulation": "Authorised in the EU and the US with limits. Check current rules, as US authorities have been reviewing some older additives.",
  "topics": [
   "Possibly carcinogenic (IARC 2B, animal studies)",
   "Intake near safe limit (EFSA estimate)"
  ],
  "contested": "CSPI rates BHA 'Avoid', citing the NTP and IARC listings and noting that it can be replaced. That is stricter than EFSA, which set a safe daily intake. The two differ mainly on whether rodent forestomach tumours matter for people. The human evidence is absent rather than reassuring, so we show a concern based on animal studies. Where views differ: Rated high risk to match Yuka, which says to avoid BHA given the concerns in the scientific literature. EFSA's 2011 daily limit is 1 mg/kg and refined intakes were generally below it; Danish researchers (DTU) flag hormone effects.",
  "sources": [
   {
    "text": "IARC Monographs Vol. 40: Butylated hydroxyanisole (BHA), 1986",
    "url": "https://inchem.org/documents/iarc/vol40/butylatedhydroxyanisole.html"
   },
   {
    "text": "US NTP. Report on Carcinogens profile: Butylated hydroxyanisole",
    "url": "https://ntp.niehs.nih.gov/ntp/roc/content/profiles/butylatedhydroxyanisole.pdf"
   },
   {
    "text": "EFSA. Re-evaluation of butylated hydroxyanisole, BHA (E 320) as a food additive. EFSA Journal, 2011",
    "url": "https://efsa.europa.eu/de/efsajournal/pub/2392"
   },
   {
    "text": "EFSA. Exposure to butylated hydroxyanisole (E 320), statement, 2012",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/2759"
   },
   {
    "text": "CSPI. Chemical Cuisine: Butylated hydroxyanisole (BHA)",
    "url": "https://www.cspi.org/article/butylated-hydroxyanisole-bha"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e321",
  "code": "E321",
  "name": "Butylated hydroxytoluene",
  "highRisk": true,
  "kind": "Antioxidant preservative",
  "found": "Cereals, chewing gum, snacks, fats and oils, some packaging.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a lower safe daily intake in 2012 after reviewing animal studies. We found no strong human evidence of harm.",
  "research": [
   "EFSA's 2012 re-evaluation set an acceptable daily intake of 0.25 mg per kg of body weight per day, based on rat studies. That is lower than the 0.3 mg per kg set earlier by the WHO and FAO expert committee (JECFA).",
   "The limit was lowered because of animal findings, not because of a signal in people. We did not find large human studies of BHT at food levels to cite.",
   "Intake is expected to stay under the limit for most people. This is an estimate."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Lower safe intake set by EFSA in 2012"
  ],
  "contested": "CSPI rates BHT 'Caution' and advises avoiding it where possible, citing animal cancer studies and the fact that it is easy to replace. EFSA did not find a cancer concern at current uses and set a safe limit. Evidence of harm in people is lacking. Where views differ: Rated high risk to match Yuka, which says to avoid BHT given the concerns in the scientific literature. EFSA raised the daily limit in 2012 and found no genotoxicity concern, though children's high intakes exceeded it in some countries.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of butylated hydroxytoluene BHT (E 321) as a food additive. EFSA Journal, 2012",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2588"
   },
   {
    "text": "CSPI. Chemical Cuisine: Butylated hydroxytoluene (BHT)",
    "url": "https://www.cspi.org/article/butylated-hydroxytoluene-bht"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e322",
  "code": "E322",
  "name": "Lecithins",
  "labelName": "Lecithin",
  "also": "Soy lecithin, sunflower lecithin",
  "kind": "Emulsifier",
  "found": "Chocolate, margarine, baked goods, infant formula and many packaged foods.",
  "level": "little",
  "evidence": "None",
  "summary": "A natural fat found in eggs, soy and sunflower seeds. EFSA found no safety concern. Soy-derived lecithin may matter for people with a soy allergy.",
  "research": [
   "EFSA re-evaluated lecithins in 2017 and said no numerical ADI was needed, with no safety concern for people over one year old. It raised a question about infants under 16 weeks because of the choline they would receive.",
   "A 2020 EFSA follow-up found that choline released from lecithin is a minor part of the total choline in infant formula (about 8.7% on average) and does not raise concern at current uses.",
   "In the 2023 French cardiovascular cohort, the news summary we could read said lecithins were not linked to higher risk. We could not check this against the paper's tables."
  ],
  "careIf": "People with a soy or egg allergy. Highly refined lecithin has little protein but labels may still warn.",
  "regulation": "Authorised in the EU (no numerical ADI) and generally recognised as safe in the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of lecithins (E 322) in foods for infants below 16 weeks of age and follow-up. EFSA Journal, 2020",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7654424/"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   }
  ]
 },
 {
  "id": "e325",
  "code": "E325",
  "name": "Sodium lactate",
  "kind": "Acidity regulator, preservative, flavour enhancer",
  "found": "Meat and poultry products, bakery, sweets, drinks.",
  "level": "little",
  "evidence": "None",
  "summary": "The sodium salt of lactic acid. We found no regulator concern at food uses.",
  "research": [
   "Lactic acid and lactates are normal products of metabolism and occur naturally in fermented foods like yoghurt.",
   "EFSA lists lactates among additives whose data are still being gathered under its re-evaluation programme. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels.",
   "It adds some sodium, which is relevant to people watching their salt intake."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate lactic acid and lactates as safe. Some apps flag them because they can be made by fermentation or because of mentions of infants; the reasons are weak and we found no regulator concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Open call for food additives analytical data and use levels (lists lactates and citrates among additives still being reviewed)",
    "url": "https://www.efsa.europa.eu/en/call/open-call-food-additives-analytical-data-and-use-levels-food-and-beverages-intended-human"
   }
  ]
 },
 {
  "id": "e326",
  "code": "E326",
  "name": "Potassium lactate",
  "kind": "Acidity regulator, preservative, flavour enhancer",
  "found": "Meat and poultry products, bakery, sweets, drinks.",
  "level": "little",
  "evidence": "None",
  "summary": "The potassium salt of lactic acid. We found no regulator concern at food uses.",
  "research": [
   "Lactic acid and lactates are normal products of metabolism and occur naturally in fermented foods like yoghurt.",
   "EFSA lists lactates among additives whose data are still being gathered under its re-evaluation programme. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels.",
   "It adds some potassium, which is relevant to people who have been told to limit it."
  ],
  "careIf": "People told to limit potassium may want to ask their clinician about potassium additives.",
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate lactic acid and lactates as safe. Some apps flag them because they can be made by fermentation or because of mentions of infants; the reasons are weak and we found no regulator concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Open call for food additives analytical data and use levels (lists lactates and citrates among additives still being reviewed)",
    "url": "https://www.efsa.europa.eu/en/call/open-call-food-additives-analytical-data-and-use-levels-food-and-beverages-intended-human"
   }
  ]
 },
 {
  "id": "e327",
  "code": "E327",
  "name": "Calcium lactate",
  "kind": "Acidity regulator, firming agent",
  "found": "Sweets, jams, fruit products, cheese, baking.",
  "level": "little",
  "evidence": "None",
  "summary": "The calcium salt of lactic acid. We found no regulator concern at food uses.",
  "research": [
   "Lactic acid and lactates are normal products of metabolism and occur naturally in fermented foods like yoghurt.",
   "EFSA lists lactates among additives whose data are still being gathered under its re-evaluation programme. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases rate lactic acid and lactates as safe. Some apps flag them because they can be made by fermentation or because of mentions of infants; the reasons are weak and we found no regulator concern at food levels.",
  "sources": [
   {
    "text": "EFSA. Open call for food additives analytical data and use levels (lists lactates and citrates among additives still being reviewed)",
    "url": "https://www.efsa.europa.eu/en/call/open-call-food-additives-analytical-data-and-use-levels-food-and-beverages-intended-human"
   }
  ]
 },
 {
  "id": "e330",
  "code": "E330",
  "name": "Citric acid",
  "kind": "Acidity regulator, flavour",
  "found": "Soft drinks, sweets, jams, canned foods, ready meals.",
  "level": "little",
  "evidence": "None",
  "summary": "A very common acid found naturally in citrus fruit. Regulators have not found a safety concern.",
  "research": [
   "The EU's Scientific Committee on Food assessed citric acid in 1990 and set the safe daily intake as 'not specified', meaning no numerical limit was needed. The Commission has said this remains a valid basis while EFSA's re-evaluation, which started with a call for data, is finished.",
   "Citric acid is a normal part of human metabolism and we found no credible human or lab signal at food levels.",
   "Acid in drinks and sweets can wear tooth enamel when sipped often. That is about acidity, not about the additive being unsafe."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases list citric acid and its salts as safe. One thing that sometimes worries people is that commercial citric acid is made by fermenting sugar with a mould (Aspergillus niger). We found no regulator or study that links the food additive to harm. Acid can erode tooth enamel in sour drinks and sweets, which is a dental point, not an additive safety finding.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2020/1419 (notes SCF 1990 assessment of citric acid, ADI not specified)",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/1419/oj/eng"
   },
   {
    "text": "EFSA. Call for data (Batch 5) covering citric acid and citrates (E 330-333)",
    "url": "https://www.efsa.europa.eu/en/data/call/160524"
   }
  ]
 },
 {
  "id": "e331",
  "code": "E331",
  "name": "Sodium citrates",
  "kind": "Acidity regulator, emulsifying salt",
  "found": "Processed cheese, drinks, jams, sweets, ice cream, canned foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Salts of citric acid (sodium form). No safety concern has been raised by regulators. One large French cohort linked higher intake to type 2 diabetes, so we show a minor concern.",
  "research": [
   "Citrates are salts of citric acid, a normal part of metabolism. The EU's Scientific Committee on Food set no numerical limit for citric acid in 1990.",
   "EFSA's re-evaluation of citric acid and its salts is part of its programme and collected data in a Batch 5 call. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels.",
   "In the NutriNet-Santé cohort (Lancet Diabetes & Endocrinology 2024, about 104,000 adults), higher intake of sodium citrate (E331) was among the emulsifier-labelled additives associated with a higher risk of type 2 diabetes. These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [
   "Type 2 diabetes (one observational cohort)"
  ],
  "contested": "CSPI and most consumer databases list citric acid and its salts as safe. The diabetes signal comes from one cohort and has not been tested in experiments.",
  "sources": [
   {
    "text": "EFSA. Call for data (Batch 5) covering citric acid and citrates (E 330-333)",
    "url": "https://www.efsa.europa.eu/en/data/call/160524"
   },
   {
    "text": "European Commission. Regulation (EU) 2020/1419 (notes SCF 1990 assessment of citric acid, ADI not specified)",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/1419/oj/eng"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e332",
  "code": "E332",
  "name": "Potassium citrates",
  "kind": "Acidity regulator, emulsifying salt",
  "found": "Processed cheese, drinks, jams, sweets, ice cream, canned foods.",
  "level": "little",
  "evidence": "None",
  "summary": "Salts of citric acid (potassium form). No safety concern has been raised by regulators.",
  "research": [
   "Citrates are salts of citric acid, a normal part of metabolism. The EU's Scientific Committee on Food set no numerical limit for citric acid in 1990.",
   "EFSA's re-evaluation of citric acid and its salts is part of its programme and collected data in a Batch 5 call. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels.",
   "Very high intakes of potassium salts would matter for people on potassium-restricted diets, which is a general diet matter."
  ],
  "careIf": "People told to limit potassium (for example with advanced kidney disease) may want to ask their clinician about potassium additives.",
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases list citric acid and its salts as safe.",
  "sources": [
   {
    "text": "EFSA. Call for data (Batch 5) covering citric acid and citrates (E 330-333)",
    "url": "https://www.efsa.europa.eu/en/data/call/160524"
   },
   {
    "text": "European Commission. Regulation (EU) 2020/1419 (notes SCF 1990 assessment of citric acid, ADI not specified)",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/1419/oj/eng"
   }
  ]
 },
 {
  "id": "e333",
  "code": "E333",
  "name": "Calcium citrates",
  "kind": "Acidity regulator, emulsifying salt",
  "found": "Processed cheese, drinks, jams, sweets, ice cream, canned foods.",
  "level": "little",
  "evidence": "None",
  "summary": "Salts of citric acid (calcium form). No safety concern has been raised by regulators.",
  "research": [
   "Citrates are salts of citric acid, a normal part of metabolism. The EU's Scientific Committee on Food set no numerical limit for citric acid in 1990.",
   "EFSA's re-evaluation of citric acid and its salts is part of its programme and collected data in a Batch 5 call. EFSA's formal re-evaluation of this additive is still under way, so there is no new EFSA opinion to cite yet.",
   "We found no credible human or lab signal at food levels."
  ],
  "regulation": "Authorised in the EU and the US with few limits.",
  "topics": [],
  "contested": "CSPI and most consumer databases list citric acid and its salts as safe.",
  "sources": [
   {
    "text": "EFSA. Call for data (Batch 5) covering citric acid and citrates (E 330-333)",
    "url": "https://www.efsa.europa.eu/en/data/call/160524"
   },
   {
    "text": "European Commission. Regulation (EU) 2020/1419 (notes SCF 1990 assessment of citric acid, ADI not specified)",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/1419/oj/eng"
   }
  ]
 },
 {
  "id": "e334",
  "code": "E334",
  "name": "Tartaric acid",
  "kind": "Acidity regulator, antioxidant helper",
  "found": "Wine, grape drinks, sweets, jams, baking powder.",
  "level": "little",
  "evidence": "None",
  "summary": "The acid found in grapes. EFSA raised its group safe daily intake in 2020 and found no concern.",
  "research": [
   "EFSA's 2020 re-evaluation of L-(+)-tartaric acid, tartrates and calcium tartrate found no harmful effects, including no kidney effects, in studies of the L-(+) form and no sign of DNA damage.",
   "A long-term rat study found no cancer at the highest dose tested, 3,100 mg per kg of body weight per day.",
   "The earlier safe limit from the EU's Scientific Committee on Food was 30 mg per kg of body weight per day (1990).",
   "Only the natural L-(+) form is assessed. Other forms are not covered by this opinion."
  ],
  "regulation": "Authorised in the EU with limits and in the US.",
  "topics": [],
  "contested": "Consumer databases generally list tartaric acid as safe. We found no source raising a concern.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of l(+)-tartaric acid (E 334), tartrates (E 335, 336, 337) and calcium tartrate (E 354) as food additives. EFSA Journal, 2020",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6030"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of l(+)-tartaric acid (E 334) and tartrates, full text. EFSA Journal, 2020",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7448015"
   }
  ]
 },
 {
  "id": "e336",
  "code": "E336",
  "name": "Potassium tartrates",
  "also": "Cream of tartar, potassium hydrogen tartrate",
  "kind": "Acidity regulator",
  "found": "Baking powder, wine, jams, sweets",
  "level": "little",
  "evidence": "None",
  "summary": "Potassium tartrates come from grapes and wine-making. EFSA found no safety concern at current use.",
  "research": [
   "EFSA re-evaluated tartaric acid and its tartrate salts in 2020 (E 334 to 337 and E 354) and set a group ADI of 240 mg/kg body weight per day, expressed as tartaric acid. Estimated intakes for all population groups in the refined scenario did not exceed it.",
   "The Panel reported no sign of genotoxicity for tartaric acid or its sodium and potassium salts, and no kidney toxicity in studies of the natural l(+) form. A long rat study of monosodium tartrate showed no cancer at the highest dose tested.",
   "The older limit was 30 mg/kg bw per day (SCF and JECFA). The newer figure is higher because EFSA used a newer rat study."
  ],
  "regulation": "Authorised in the EU. A 2024 EU regulation notes that uses could be withdrawn where no technical-use data were supplied for a food category.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of l(+)-tartaric acid (E 334), sodium tartrates (E 335), potassium tartrates (E 336) and others as food additives. EFSA Journal, 2020",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7448015"
   },
   {
    "text": "EU. Commission Regulation (EU) 2024/1451",
    "url": "https://eur-lex.europa.eu/eli/reg/2024/1451/oj/eng"
   }
  ]
 },
 {
  "id": "e338",
  "code": "E338",
  "name": "Phosphoric acid",
  "kind": "Acidity regulator",
  "found": "Colas, some other soft drinks, processed cheese and baked goods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "Phosphoric acid is what gives cola its tang. A 2007 US case-control study linked drinking two or more colas a day to higher odds of chronic kidney disease, but it was small, early and could not show cause, and the authors called it preliminary.",
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Saldana TM et al. Carbonated beverages and chronic kidney disease. Epidemiology, 2007",
    "url": "https://pubmed.ncbi.nlm.nih.gov/17525693/"
   }
  ]
 },
 {
  "id": "e339",
  "code": "E339",
  "name": "Sodium phosphates",
  "also": "Trisodium phosphate",
  "kind": "Acidity regulator and emulsifier",
  "found": "Processed cheese, deli meats, baked goods and some drinks.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "In the 2023 BMJ report from the French NutriNet-Santé cohort (95,442 adults), higher intake of trisodium phosphate (E339) was linked to a slightly higher risk of coronary heart disease (hazard ratio 1.06). This is a small difference seen in observational data, so it shows a link and not cause and effect.",
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Coronary heart disease (one cohort, small link)",
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://doi.org/10.1136/bmj-2023-076058"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e340",
  "code": "E340",
  "name": "Potassium phosphates",
  "kind": "Acidity regulator",
  "found": "Processed meat, cheese, baked goods and drinks.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "Potassium phosphates also add potassium, which people with advanced kidney disease are often told to limit as well.",
   "In the French NutriNet-Santé cohort (Lancet Diabetes & Endocrinology 2024), higher intake of tripotassium phosphate (E340) was among the emulsifiers associated with a higher risk of type 2 diabetes. These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating.",
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Type 2 diabetes (observational cohort)",
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e341",
  "code": "E341",
  "name": "Calcium phosphates",
  "kind": "Raising agent and anti-caking agent",
  "found": "Baked goods, powdered mixes and processed foods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e343",
  "code": "E343",
  "name": "Magnesium phosphates",
  "kind": "Anti-caking agent and acidity regulator",
  "found": "Powdered mixes, supplements and some processed foods. Less common than the other phosphates.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e385",
  "code": "E385",
  "name": "Calcium disodium EDTA",
  "also": "Calcium disodium ethylenediaminetetraacetate",
  "kind": "Preservative and sequestrant (binds metals)",
  "found": "Pickles, canned beans, salad dressings, sauces and margarine.",
  "level": "little",
  "evidence": "Weak",
  "summary": "The old safe daily intake is still in use, but EFSA is now re-evaluating it and has noted gaps in the reproductive and developmental data.",
  "research": [
   "The Scientific Committee for Food set an acceptable daily intake of 2.5 mg per kg of body weight in 1977, building on a JECFA value from 1974 based on a two-year rat study.",
   "EFSA opened a call for data in 2024 for its full re-evaluation of E 385. A separate EFSA opinion on EDTA noted shortcomings in the safety data, especially on reproduction and development. The re-evaluation was not finished when we checked, so no new conclusion exists yet.",
   "EDTA binds minerals such as iron and zinc. At food levels this is generally not considered a nutritional problem, but We did not find a human study that tests it directly."
  ],
  "regulation": "Authorised in the EU and the US with maximum levels. EFSA re-evaluation under way.",
  "topics": [
   "Reproductive and developmental data gaps (under review)"
  ],
  "contested": "We did not find a CSPI Chemical Cuisine entry for EDTA. Concern is mostly about old and thin data rather than a positive harm signal.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of calcium disodium EDTA (E 385) as food additive, 2024",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-calcium-disodium-edta-e-385-food-additive"
   },
   {
    "text": "EFSA. Scientific opinion on EDTA (data shortcomings)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009604"
   }
  ]
 },
 {
  "id": "e392",
  "code": "E392",
  "name": "Extracts of rosemary",
  "kind": "Antioxidant (plant extract)",
  "found": "Meat products, fats and oils, snacks, dressings, spreads.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A plant extract, in practice carnosic acid and carnosol. EFSA saw no concern at current uses, but there is no EFSA numerical safe limit.",
  "research": [
   "EFSA's 2008 opinion said the safety data were not enough to set an acceptable daily intake. It still saw no reason for concern, because 90-day studies showed no effects, including on reproductive organs, and DNA-damage tests were negative.",
   "EFSA's 2018 refined exposure assessment found the highest mean intake was about 0.09 mg per kg of body weight per day (children 3 to 9 years), and the highest 95th percentile about 0.20. EFSA noted these likely overestimate real intake.",
   "JECFA set a temporary acceptable daily intake of 0 to 0.3 mg per kg, expressed as carnosic acid plus carnosol, in 2016. The word 'temporary' reflects studies still being waited for.",
   "Extracts used as flavouring ingredients are a different product from the antioxidant extract."
  ],
  "regulation": "Authorised in the EU as E 392 with limits on the active compounds.",
  "topics": [
   "No numerical limit from EFSA (data gap)"
  ],
  "contested": "Consumer databases usually count rosemary extract as natural and safe. The regulator view is similar, but the missing numerical limit is why we show a minor note.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment of extracts of rosemary (E 392) from its use as food additive. EFSA Journal, 2018",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5373"
   }
  ]
 },
 {
  "id": "e401",
  "code": "E401",
  "name": "Sodium alginate",
  "also": "Alginic acid, sodium salt",
  "kind": "Thickener and gelling agent (from brown seaweed)",
  "found": "Ice cream, desserts, sauces, fruit fillings and restaurant-style foams.",
  "level": "little",
  "evidence": "None",
  "summary": "A seaweed fibre. EFSA's 2017 review found no safety concern at current uses and saw no need for a numerical daily limit.",
  "research": [
   "EFSA re-evaluated alginic acid and its sodium, potassium, ammonium and calcium salts (E 400 to E 404) together in 2017. It concluded that no numerical ADI was needed and that there was no safety concern at the refined exposure assessment for the reported uses.",
   "Alginates are large fibre-like molecules that are mostly not absorbed. We found no notable human cohort or trial signal in the last ten years that points to harm at food levels.",
   "As with other dietary fibres, large amounts may cause gas or loose stools in some people."
  ],
  "regulation": "Authorised in the EU and the US. Reviewed in the EU as a group with the other alginates.",
  "topics": [],
  "contested": "Consumer apps sometimes rate seaweed thickeners more strictly because they are 'additives'. We found no regulator or major study that supports concern at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of alginic acid and its sodium, potassium, ammonium and calcium salts (E 400-E 404) as food additives. EFSA Journal, 2017",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7010146"
   }
  ]
 },
 {
  "id": "e402",
  "code": "E402",
  "name": "Potassium alginate",
  "also": "Alginic acid, potassium salt",
  "kind": "Thickener and gelling agent (from brown seaweed)",
  "found": "Ice cream, desserts, sauces, fruit fillings and restaurant-style foams.",
  "level": "little",
  "evidence": "None",
  "summary": "A seaweed fibre. EFSA's 2017 review found no safety concern at current uses and saw no need for a numerical daily limit.",
  "research": [
   "EFSA re-evaluated alginic acid and its sodium, potassium, ammonium and calcium salts (E 400 to E 404) together in 2017. It concluded that no numerical ADI was needed and that there was no safety concern at the refined exposure assessment for the reported uses.",
   "Alginates are large fibre-like molecules that are mostly not absorbed. We found no notable human cohort or trial signal in the last ten years that points to harm at food levels.",
   "As with other dietary fibres, large amounts may cause gas or loose stools in some people."
  ],
  "regulation": "Authorised in the EU and the US. Reviewed in the EU as a group with the other alginates.",
  "topics": [],
  "contested": "Consumer apps sometimes rate seaweed thickeners more strictly because they are 'additives'. We found no regulator or major study that supports concern at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of alginic acid and its sodium, potassium, ammonium and calcium salts (E 400-E 404) as food additives. EFSA Journal, 2017",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7010146"
   }
  ]
 },
 {
  "id": "e403",
  "code": "E403",
  "name": "Ammonium alginate",
  "also": "Alginic acid, ammonium salt",
  "kind": "Thickener and gelling agent (from brown seaweed)",
  "found": "Ice cream, desserts, sauces, fruit fillings and restaurant-style foams.",
  "level": "little",
  "evidence": "None",
  "summary": "A seaweed fibre. EFSA's 2017 review found no safety concern at current uses and saw no need for a numerical daily limit.",
  "research": [
   "EFSA re-evaluated alginic acid and its sodium, potassium, ammonium and calcium salts (E 400 to E 404) together in 2017. It concluded that no numerical ADI was needed and that there was no safety concern at the refined exposure assessment for the reported uses.",
   "Alginates are large fibre-like molecules that are mostly not absorbed. We found no notable human cohort or trial signal in the last ten years that points to harm at food levels.",
   "As with other dietary fibres, large amounts may cause gas or loose stools in some people."
  ],
  "regulation": "Authorised in the EU and the US. Reviewed in the EU as a group with the other alginates.",
  "topics": [],
  "contested": "Consumer apps sometimes rate seaweed thickeners more strictly because they are 'additives'. We found no regulator or major study that supports concern at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of alginic acid and its sodium, potassium, ammonium and calcium salts (E 400-E 404) as food additives. EFSA Journal, 2017",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7010146"
   }
  ]
 },
 {
  "id": "e405",
  "code": "E405",
  "name": "Propane-1,2-diol alginate",
  "also": "Propylene glycol alginate, PGA",
  "kind": "Thickener, stabiliser and foam stabiliser",
  "found": "Salad dressings, beer foam, ice cream and sauces.",
  "level": "little",
  "evidence": "None",
  "summary": "A modified alginate. EFSA's 2018 review found no genotoxicity or cancer concern for it or its breakdown products.",
  "research": [
   "EFSA re-evaluated propane-1,2-diol alginate in 2018. It breaks down in the body to alginic acid and propane-1,2-diol (propylene glycol). EFSA found no genotoxicity or carcinogenicity concern for the additive or either breakdown product.",
   "Because any adverse effect would come from the propylene glycol part, the safe limit is tied to the amount of free propane-1,2-diol. We did not confirm the exact figure from the full text."
  ],
  "regulation": "Authorised in the EU and the US (as propylene glycol alginate).",
  "topics": [],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of propane-1,2-diol alginate (E 405) as a food additive. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009538/"
   }
  ]
 },
 {
  "id": "e406",
  "code": "E406",
  "name": "Agar",
  "also": "Agar-agar",
  "kind": "Gelling agent (from red seaweed)",
  "found": "Desserts, jellies, confectionery, some vegan products.",
  "level": "little",
  "evidence": "None",
  "summary": "A seaweed gelling agent used for a long time. The WHO/FAO expert committee set no limit on intake.",
  "research": [
   "JECFA (the WHO/FAO committee) last evaluated agar in 1973 and gave an ADI of 'not limited'.",
   "We could not find a separate EFSA food-additive re-evaluation opinion for agar in our searches, so We cannot quote an EFSA conclusion here. we also found no credible recent human safety signal.",
   "Agar is a fibre and is not absorbed; large amounts may loosen stools."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "JECFA. Agar, summary of evaluation (INS 406). IPCS INCHEM",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_47.htm"
   }
  ]
 },
 {
  "id": "e407",
  "code": "E407",
  "name": "Carrageenan",
  "kind": "Thickener and gelling agent (from red seaweed)",
  "found": "Plant milks, ice cream, deli meats, yoghurts, chocolate milk and desserts.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Food-grade carrageenan passed EFSA's 2018 review, but large French cohort studies linked higher intake to more cancer and type 2 diabetes, and animal and cell studies show gut inflammation. EFSA also asked for more infant data.",
  "research": [
   "EFSA's 2018 re-evaluation covered carrageenan (E 407) and processed Eucheuma seaweed (E 407a). It noted that the degraded form (poligeenan) is not authorised and has no food use. EFSA asked for more data, including on infants, and opened a follow-up data call (infants under 16 weeks).",
   "Degraded carrageenan (poligeenan) is a different, low-molecular-weight substance. It has been used in lab studies to cause gut ulcers and is classed by IARC as possibly carcinogenic (group 2B). Food-grade carrageenan is not the same material, but some researchers argue that small amounts of degraded pieces could form or be present.",
   "In lab and animal studies, food-grade carrageenan has been linked to gut inflammation and changes in gut bacteria. Whether this happens at normal human intakes has not been shown, and the debate is not settled.",
   "In the French NutriNet-Santé cohort, higher intake of carrageenans was associated with a higher risk of type 2 diabetes (Lancet Diabetes & Endocrinology 2024, about 104,000 adults, hazard ratio about 1.03 per 100 mg a day) and with higher overall, breast and prostate cancer risk (PLOS Medicine 2024). It was not among the emulsifiers linked to cardiovascular disease in the 2023 BMJ paper.",
   "These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "careIf": "Infants: EFSA's first opinion excluded very young infants and asked for more data. People with inflammatory bowel disease sometimes choose to avoid it, although We found no regulator advice to do so.",
  "regulation": "Authorised in the EU and the US. The EU follow-up on use in foods for young infants was still being gathered at the time of our search.",
  "topics": [
   "Cancer (observational cohort)",
   "Type 2 diabetes (observational cohort)",
   "Gut inflammation (animal and cell studies)",
   "Data gap for infants"
  ],
  "contested": "CSPI rates carrageenan \"Caution\" because of gut harm in animals and the 2B listing for degraded carrageenan. Regulators (EFSA, JECFA, FDA) accept food-grade carrageenan at current uses. The newer human cohort links are real but observational and modest, so we rate it \"some concern\" with weak evidence, not a proven harm.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of carrageenan (E 407) and processed Eucheuma seaweed (E 407a) as food additives. EFSA Journal, 2018",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32625873/"
   },
   {
    "text": "EFSA. Call for technical and toxicological data on carrageenan (E 407) in infant foods (EFSA-Q-2018-00771)",
    "url": "https://www.efsa.europa.eu/en/consultations/call/181010-0"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   },
   {
    "text": "Center for Science in the Public Interest. Carrageenan (rating: Caution). CSPI",
    "url": "https://www.cspi.org/article/carrageenan"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French NutriNet-Santé cohort. PLOS Medicine, 2024",
    "url": "https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1004338"
   }
  ]
 },
 {
  "id": "e407a",
  "code": "E407a",
  "name": "Processed Eucheuma seaweed",
  "also": "PES",
  "kind": "Thickener and gelling agent (from red seaweed)",
  "found": "Dairy desserts, plant milks, deli meats and sauces.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Food-grade carrageenan passed EFSA's 2018 review, but large French cohort studies linked higher intake to more cancer and type 2 diabetes, and animal and cell studies show gut inflammation. EFSA also asked for more infant data.",
  "research": [
   "EFSA treated processed Eucheuma seaweed (PES) together with carrageenan in its 2018 re-evaluation because the two are structurally similar. Conclusions and data gaps are shared with E 407.",
   "In the French NutriNet-Santé cohort, higher intake of carrageenans was associated with a higher risk of type 2 diabetes (Lancet Diabetes & Endocrinology 2024, about 104,000 adults, hazard ratio about 1.03 per 100 mg a day) and with higher overall, breast and prostate cancer risk (PLOS Medicine 2024). It was not among the emulsifiers linked to cardiovascular disease in the 2023 BMJ paper.",
   "These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "careIf": "Infants: EFSA asked for more data for very young infants.",
  "regulation": "Authorised in the EU. In the US, this type of seaweed product is generally covered under carrageenan rules.",
  "topics": [
   "Cancer (observational cohort)",
   "Type 2 diabetes (observational cohort)",
   "Gut inflammation (animal and cell studies)",
   "Data gap for infants"
  ],
  "contested": "CSPI rates carrageenan \"Caution\" because of gut harm in animals and the 2B listing for degraded carrageenan. Regulators (EFSA, JECFA, FDA) accept food-grade carrageenan at current uses. The newer human cohort links are real but observational and modest, so we rate it \"some concern\" with weak evidence, not a proven harm.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of carrageenan (E 407) and processed Eucheuma seaweed (E 407a) as food additives. EFSA Journal, 2018",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32625873/"
   },
   {
    "text": "EFSA. Call for technical and toxicological data on carrageenan (E 407) in infant foods (EFSA-Q-2018-00771)",
    "url": "https://www.efsa.europa.eu/en/consultations/call/181010-0"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   },
   {
    "text": "Center for Science in the Public Interest. Carrageenan (rating: Caution). CSPI",
    "url": "https://www.cspi.org/article/carrageenan"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French NutriNet-Santé cohort. PLOS Medicine, 2024",
    "url": "https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1004338"
   }
  ]
 },
 {
  "id": "e410",
  "code": "E410",
  "name": "Locust bean gum",
  "also": "Carob bean gum",
  "kind": "Thickener (from carob seeds)",
  "found": "Ice cream, cream cheese, sauces, desserts and some infant formulas.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2017 review found no safety concern for the general population and set no numerical limit. Use in foods for young infants is restricted in the EU.",
  "research": [
   "EFSA's 2017 re-evaluation of locust bean gum concluded that no numerical ADI was needed and there was no safety concern at the reported uses.",
   "Use in infant formula and foods for young infants is restricted in the EU, and EFSA has looked at infant uses separately. Check the current EFSA opinions if you are choosing foods for a baby."
  ],
  "careIf": "Young infants (under 16 weeks) fed special formulas; this is a medical-feeding matter for a doctor.",
  "regulation": "Authorised in the EU and the US. Use in infant formula is restricted in the EU.",
  "topics": [
   "Infant foods (use restricted in the EU)"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of locust bean gum (E 410) as a food additive. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010100/"
   },
   {
    "text": "Council of the EU. Document ST-14386-2025 (references EFSA 2017 and 2023 locust bean gum opinions)",
    "url": "https://data.consilium.europa.eu/doc/document/ST-14386-2025-INIT/en/pdf"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   }
  ]
 },
 {
  "id": "e412",
  "code": "E412",
  "name": "Guar gum",
  "kind": "Thickener (from guar beans)",
  "found": "Ice cream, sauces, gluten-free bakery, dressings and dairy desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A plant fibre. EFSA's 2017 re-evaluation found adequate data and no need for a numerical limit. One large French cohort linked higher intake to type 2 diabetes, so we show a minor concern.",
  "research": [
   "JECFA and the EU Scientific Committee for Food had set an ADI of 'not specified'. EFSA's 2017 re-evaluation concluded that adequate exposure and toxicity data were available under its framework. We did not retrieve the exact final wording.",
   "Guar is a fibre that is fermented by gut bacteria; large amounts may cause gas or loose stools.",
   "In the NutriNet-Santé cohort (Lancet Diabetes & Endocrinology 2024, about 104,000 adults), higher intake of guar gum (E412) was among the emulsifier-labelled additives associated with a higher risk of type 2 diabetes. These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Type 2 diabetes (one observational cohort)"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes. The diabetes signal comes from one cohort and has not been tested in experiments.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of guar gum (E 412) as a food additive. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/nl/efsajournal/pub/4669"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e413",
  "code": "E413",
  "name": "Tragacanth",
  "also": "Gum tragacanth",
  "kind": "Thickener and emulsifier (plant gum)",
  "found": "Sauces, dressings, confectionery and some bakery fillings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA (2017) found no safety concern, but CSPI notes rare severe allergic reactions to this gum.",
  "research": [
   "EFSA's 2017 opinion concluded that no numerical ADI was needed and that there was no safety concern for the general population at the refined exposure. The gum is unlikely to be absorbed whole, and carcinogenicity studies showed no adverse effects at the highest dose tested.",
   "CSPI points to occasional severe allergic reactions in sensitive people. This is rare and We found no large study that measures it."
  ],
  "careIf": "People with known allergies to plant gums.",
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Rare allergic reactions"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of tragacanth (E 413) as a food additive. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009969/"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   }
  ]
 },
 {
  "id": "e414",
  "code": "E414",
  "name": "Acacia gum",
  "also": "Gum arabic",
  "kind": "Thickener and stabiliser (tree gum)",
  "found": "Soft drinks, sweets, chewing gum, drink emulsions and flavour coatings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A tree gum eaten for a long time. EFSA's 2017 review found no safety concern. One large French cohort linked higher intake to type 2 diabetes, so we show a minor concern.",
  "research": [
   "EFSA's 2017 re-evaluation found that acacia gum is unlikely to be absorbed whole and is only slightly fermented in the gut. Subchronic and cancer studies showed no adverse effects at the highest doses tested, and EFSA saw no genotoxicity concern. It concluded that no numerical ADI was needed.",
   "In one human intake study some people had gas, which EFSA judged undesirable but not harmful. A 2019 EFSA follow-up looked at use in foods for infants under 16 weeks and recommended tighter limits for heavy metals in the specification.",
   "In the NutriNet-Santé cohort (Lancet Diabetes & Endocrinology 2024, about 104,000 adults), higher intake of gum arabic (E414) was among the emulsifier-labelled additives associated with a higher risk of type 2 diabetes. These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Type 2 diabetes (one observational cohort)"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes. The diabetes signal comes from one cohort and has not been tested in experiments.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of acacia gum (E 414) as a food additive. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4741"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e415",
  "code": "E415",
  "name": "Xanthan gum",
  "kind": "Thickener and stabiliser (made by fermentation)",
  "found": "Dressings, sauces, gluten-free bakery, ice cream and thickened drinks.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern in 2017 and again in a 2023 infant follow-up, but a thickener containing xanthan has been linked to a serious bowel illness in premature infants.",
  "research": [
   "EFSA's 2017 re-evaluation found that xanthan gum is unlikely to be absorbed whole and is fermented by gut bacteria. A 2023 EFSA opinion on foods for infants under 16 weeks judged the available clinical studies to be of low validity, but concluded from piglet studies that there is no safety concern in infant foods for special medical purposes. We have not checked the full text.",
   "CSPI notes the US FDA warning against giving a xanthan-based thickener (SimplyThick) to infants after cases of a serious intestinal condition. It is unclear whether the gum, contamination or something else was the cause.",
   "In the NutriNet-Santé cohort (Lancet Diabetes & Endocrinology 2024), higher intake of xanthan gum (E415) was among the emulsifier-labelled additives associated with a higher risk of type 2 diabetes. These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "careIf": "Premature and very young infants: do not add thickeners to feeds unless a doctor advises it.",
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Infant thickener warning (US FDA)",
   "Type 2 diabetes (one observational cohort)"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of xanthan gum (E 415) as a food additive. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4909"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of xanthan gum (E 415) in foods for infants below 16 weeks of age. EFSA Journal, 2023",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10157499/"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e416",
  "code": "E416",
  "name": "Karaya gum",
  "also": "Sterculia gum",
  "kind": "Thickener and stabiliser (tree gum)",
  "found": "Sauces, dessert toppings and some bakery products; used little.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Used in small amounts. The earlier WHO/FAO evaluation gave no numerical limit, but We could not confirm EFSA's current conclusion.",
  "research": [
   "JECFA's latest evaluation (1988) gave an ADI of 'not specified'. EFSA lists a re-evaluation of karaya gum, but We could not retrieve its text, so We cannot quote its findings.",
   "Because We could not verify the EFSA opinion, we rate the evidence as weak rather than none."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes.",
  "sources": [
   {
    "text": "JECFA. Karaya gum, summary of evaluation. IPCS INCHEM",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_1248.htm"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   }
  ]
 },
 {
  "id": "e417",
  "code": "E417",
  "name": "Tara gum",
  "kind": "Thickener (from tara seeds)",
  "found": "Ice cream, dairy desserts, sauces and meat products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A seed gum similar to locust bean gum. EFSA re-evaluated it in 2017; We could not retrieve the exact conclusion.",
  "research": [
   "EFSA published a re-evaluation of tara gum in 2017. We confirmed the opinion exists but did not retrieve its conclusions.",
   "We found no credible human safety signal for tara gum in recent literature searches."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "CSPI includes several related gums in one cautious entry because they are poorly tested. We found no study showing harm from tara gum.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of tara gum (E 417) as a food additive. EFSA Journal, 2017",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009841/"
   }
  ]
 },
 {
  "id": "e418",
  "code": "E418",
  "name": "Gellan gum",
  "kind": "Gelling agent (made by fermentation)",
  "found": "Plant milks, drinks with suspended particles, jellies and desserts.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2018 review found no safety concern and no need for a numerical daily limit.",
  "research": [
   "EFSA re-evaluated gellan gum in 2018. It saw no genotoxicity or carcinogenicity concern and noted gellan is poorly absorbed and not fermented by gut bacteria. The highest refined exposure estimate was about 72 mg/kg body weight per day (95th percentile, toddlers).",
   "EFSA asked for tighter specifications, for example on viable bacterial cells and residual proteins."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "contested": "CSPI's Chemical Cuisine groups several gums under one 'certain people should avoid' entry. It says they are poorly tested but probably safe, and it names occasional allergic reactions to tragacanth and an infant-thickener warning linked to xanthan. EFSA's re-evaluations found no safety concern at current uses, so this is a more cautious view, based mostly on limited testing and rare reactions rather than on harm shown at normal intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of gellan gum (E 418) as food additive. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009714/"
   },
   {
    "text": "Center for Science in the Public Interest. Chemical Cuisine: gums (arabic, gellan, guar, karaya, locust bean, tragacanth, xanthan). CSPI",
    "url": "https://www.cspi.org/chemical-cuisine/gums-arabic-furcelleran-gellan-ghatti-guar-karaya-locust-bean-tragacanth-xanthan"
   }
  ]
 },
 {
  "id": "e420",
  "code": "E420",
  "name": "Sorbitol",
  "also": "D-glucitol",
  "kind": "Sweetener (sugar alcohol), humectant",
  "found": "Sugar-free gum and sweets, diabetic products, some baked goods, toothpaste and medicines.",
  "level": "little",
  "evidence": "Weak",
  "summary": "No safety concern at normal use, but a high intake commonly causes gas and loose stools. EFSA is still re-evaluating it.",
  "research": [
   "Sorbitol is a sugar alcohol made from glucose. The EU Scientific Committee on Food and JECFA did not set a numerical limit, because the main effect of high intake is laxative rather than damage.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects.",
   "Sorbitol is poorly absorbed in many people and can trigger symptoms in those with irritable bowel syndrome or fructose malabsorption. This is a digestive effect, not damage.",
   "EFSA has a re-evaluation of sorbitol under way, so its current EU opinion is from older assessments rather than a modern one. We found no recent cohort or trial linking sorbitol to serious harm."
  ],
  "careIf": "People with irritable bowel syndrome or sensitive digestion, and children, who may react to smaller amounts.",
  "regulation": "Authorised in the EU (E 420) and in the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Digestive upset at high intake (well documented)"
  ],
  "contested": "Consumer apps sometimes treat polyols as clear. Regulators agree that they raise no safety concern at normal use, but the laxative effect is real and dose-related, so we show it as a minor note.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   },
   {
    "text": "EFSA. Call for data on sweeteners authorised as food additives (polyols included)",
    "url": "https://www.efsa.europa.eu/sites/default/files/engage/170621.pdf"
   },
   {
    "text": "EFSA. Update on the re-evaluation of sweeteners (Annex II, FAF plenary). July 2026",
    "url": "https://www.efsa.europa.eu/sites/default/files/2026-07/Annex%20II_10.1%20Update%20on%20the%20re-evaluation%20of%20sweeteners_%201-2%20July%202026.pdf"
   }
  ]
 },
 {
  "id": "e421",
  "code": "E421",
  "name": "Mannitol",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free gum and sweets, dusting powder on chewing gum, some tablets.",
  "level": "little",
  "evidence": "Weak",
  "summary": "No safety concern at normal use, but high intake can cause gas and loose stools. EFSA is still re-evaluating it.",
  "research": [
   "Mannitol is a sugar alcohol found naturally in some plants. It is only partly absorbed and has a stronger laxative effect than many other polyols.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects.",
   "The older EU and JECFA assessments did not set a numerical limit. EFSA's modern re-evaluation of mannitol is still pending, so there are fewer current data than for sweeteners already reviewed. We found no recent human studies linking it to serious harm."
  ],
  "careIf": "People with irritable bowel syndrome or sensitive digestion.",
  "regulation": "Authorised in the EU (E 421) and in the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Digestive upset at high intake (well documented)"
  ],
  "contested": "Consumer apps sometimes treat polyols as clear. Regulators agree that they raise no safety concern at normal use, but the laxative effect is real and dose-related, so we show it as a minor note.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   },
   {
    "text": "EFSA. Call for data on sweeteners authorised as food additives (polyols included)",
    "url": "https://www.efsa.europa.eu/sites/default/files/engage/170621.pdf"
   },
   {
    "text": "EFSA. Update on the re-evaluation of sweeteners (Annex II, FAF plenary). July 2026",
    "url": "https://www.efsa.europa.eu/sites/default/files/2026-07/Annex%20II_10.1%20Update%20on%20the%20re-evaluation%20of%20sweeteners_%201-2%20July%202026.pdf"
   }
  ]
 },
 {
  "id": "e422",
  "code": "E422",
  "name": "Glycerol",
  "also": "Glycerine",
  "kind": "Humectant, sweetener",
  "found": "Cakes, icing, sweets, liqueurs, sugar-free products and soft-textured bars.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA found in 2017 that no numerical limit is needed and reported uses raised no concern. A 2022 follow-up tightened purity rules.",
  "research": [
   "EFSA's 2017 opinion saw no safety concern at reported uses and set no ADI. It flagged that different manufacturing routes could leave impurities, and asked for better data.",
   "The 2022 follow-up recommended lower limits for four heavy metals, a numerical limit for acrolein, and found that free 3-MCPD at the 0.1 mg/kg limit was not a health concern. It proposed that E 422 be defined as made from vegetable oils and fats followed by purification.",
   "Large amounts (not typical food levels) can cause stomach upset or headache, as with other sugar alcohols."
  ],
  "regulation": "Authorised in the EU and the US (GRAS).",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Follow-up of the re-evaluation of glycerol (E 422) as a food additive. EFSA Journal, 2022",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/7353"
   },
   {
    "text": "Same opinion, open-access text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9208908"
   }
  ]
 },
 {
  "id": "e425",
  "code": "E425",
  "name": "Konjac",
  "also": "Konjac gum, glucomannan",
  "kind": "Thickener and gelling agent (from konjac root)",
  "found": "Jellies, noodles, vegan seafood, sauces and desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2017 review accepted konjac at current uses but noted a limited toxicity database. Konjac jelly sweets are a choking risk.",
  "research": [
   "EFSA re-evaluated konjac gum (E 425 i) and konjac glucomannan (E 425 ii) in 2017. They are poorly absorbed and mostly fermented by gut bacteria, and EFSA saw no genotoxicity concern. The toxicity database was described as limited. EFSA accepted the earlier EU expert-committee view on konjac use levels, provided total intake stays modest.",
   "In 2002 the EU suspended placing on the market of jelly confectionery containing E 425 in mini-cup form because of choking risk."
  ],
  "careIf": "Young children and older people: konjac jelly in mini-cups is a choking hazard.",
  "regulation": "Authorised in the EU, with a ban on mini-cup jelly confectionery containing it. Used in the US as a food ingredient.",
  "topics": [
   "Choking risk (jelly mini-cups)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of konjac gum (E 425 i) and konjac glucomannan (E 425 ii) as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009929/"
   },
   {
    "text": "European Commission. Decision 2002/247/EC on jelly confectionery containing E 425. EUR-Lex",
    "url": "https://eur-lex.europa.eu/eli/dec/2002/247/oj"
   }
  ]
 },
 {
  "id": "e426",
  "code": "E426",
  "name": "Soybean hemicellulose",
  "also": "Soy fibre, soluble soybean polysaccharide",
  "kind": "Thickener and stabiliser",
  "found": "Flavoured drinks, acidified milk drinks, some desserts",
  "level": "little",
  "evidence": "Weak",
  "summary": "Soybean hemicellulose is a fibre from soy. EFSA judged a safety concern very unlikely, but it may carry traces of soy protein.",
  "research": [
   "EFSA re-evaluated it in 2017. It is not absorbed whole but is fermented by gut microbes. A 90-day rat study showed no adverse effects at the highest doses, and EFSA did not find a genotoxicity concern.",
   "The highest exposure estimate, based on maximum permitted levels, was 191 mg/kg bw per day for children at the 95th percentile. EFSA thought real exposure was likely far lower because few uses were reported. No numerical ADI was needed.",
   "EFSA advised keeping residual proteins as low as possible and informing consumers about potentially allergenic proteins. This is why the soy origin matters for people with soy allergy."
  ],
  "careIf": "People with soy allergy may want to check labels.",
  "regulation": "Authorised in the EU for a small number of food categories.",
  "topics": [
   "Soy origin (allergen note)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of soybean hemicellulose (E 426) as a food additive. EFSA Journal, 2017",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7010024"
   },
   {
    "text": "EU. Commission Regulation (EU) 2020/279",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/279/oj"
   }
  ]
 },
 {
  "id": "e427",
  "code": "E427",
  "name": "Cassia gum",
  "kind": "Thickener and gelling agent (from cassia seeds)",
  "found": "Ice cream, processed cheese, dairy desserts and pet food.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2006 opinion found no safety concern at the conditions of use, but said the toxicity data were not enough to set an ADI.",
  "research": [
   "EFSA assessed cassia gum in 2006 and found its use under the stated conditions of no safety concern. A news report on the opinion said EFSA found the toxicology data insufficient to set an ADI but saw no reason for concern. The EU authorised it afterwards.",
   "It is made from seeds of Cassia tora and Cassia obtusifolia, which can contain anthraquinones; the specification sets a low limit. We did not find a newer full re-evaluation."
  ],
  "regulation": "Authorised in the EU for certain foods. Its US food status was unclear in our search.",
  "topics": [
   "Limited toxicity data"
  ],
  "sources": [
   {
    "text": "EFSA. Opinion on cassia gum as a food additive. EFSA Journal, 2006",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/3901"
   }
  ]
 },
 {
  "id": "e432",
  "code": "E432",
  "name": "Polysorbate 20",
  "kind": "Emulsifier",
  "found": "Some sauces, dressings, desserts and flavour preparations.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses under a shared ADI. Toddler exposure can come close to that limit, and the gut-microbe mouse work was on polysorbate 80, not this one.",
  "research": [
   "The mouse work on gut bacteria and inflammation (Chassaing et al., 2015) tested polysorbate 80 (E433) and carboxymethylcellulose. It did not test this polysorbate. It belongs to the same chemical family, so it is a reason for caution but not a finding about this additive.",
   "EFSA re-evaluated all five polysorbates (E 432 to 436) in 2015 and set a group ADI of 25 mg per kg body weight per day, based on a long-term rat study (NOAEL equal to 2,500 mg/kg bw/day) and a safety factor of 100.",
   "EFSA noted that estimated toddler exposure at the highest level in one scenario was 24.5 mg/kg bw/day, very close to the ADI, and said more use data were needed to reduce uncertainty. For E 436 in fizzy drinks, a 2020 EU regulation said the extra exposure would be below 1% of the ADI."
  ],
  "regulation": "Authorised in the EU (group ADI 25 mg/kg bw/day, EFSA 2015) and the US.",
  "topics": [
   "Gut health (animal studies, related polysorbate 80)"
  ],
  "contested": "Some apps rate all polysorbates alike because of the polysorbate 80 mouse studies. We treat that as a possible class effect that has not been shown for this additive. EFSA's shared ADI covers all five.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2020/356 on polysorbate 65 (E 436) in carbonated beverages, 2020",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/356/oj/eng"
   },
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   }
  ]
 },
 {
  "id": "e433",
  "code": "E433",
  "name": "Polysorbate 80",
  "kind": "Emulsifier",
  "found": "Ice cream, creamy sauces, baked goods, vitamin products and some medicines.",
  "level": "some",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "In mice, low doses changed gut bacteria and caused inflammation. EFSA found no concern at current uses. Human evidence is lacking.",
  "research": [
   "Mouse studies by Chassaing, Viennois and colleagues tested polysorbate 80 and carboxymethylcellulose. In a 2015 Nature paper, low concentrations in drinking water changed gut bacteria, caused low-grade inflammation and more body fat in mice, and worsened colitis in mice prone to it. Later work from the same group reported more tumours in a mouse colon-cancer model.",
   "The doses and routes differ from human diets, and mouse gut bacteria differ from ours. A 2022 feeding trial of the related emulsifier carboxymethylcellulose (16 healthy adults, 15 g per day for 11 days) found lower gut-microbe diversity and more abdominal discomfort. That trial did not test polysorbate 80, and it used a high dose. Human evidence for polysorbate 80 itself is lacking.",
   "EFSA re-evaluated all five polysorbates (E 432 to 436) in 2015 and set a group ADI of 25 mg per kg body weight per day, based on a long-term rat study (NOAEL equal to 2,500 mg/kg bw/day) and a safety factor of 100.",
   "EFSA noted that estimated toddler exposure at the highest level in one scenario was 24.5 mg/kg bw/day, very close to the ADI, and said more use data were needed to reduce uncertainty. For E 436 in fizzy drinks, a 2020 EU regulation said the extra exposure would be below 1% of the ADI."
  ],
  "regulation": "Authorised in the EU (group ADI 25 mg/kg bw/day, EFSA 2015) and the US.",
  "topics": [
   "Gut health (animal studies)"
  ],
  "contested": "EFSA's ADI looks at classic animal safety tests and did not weigh the gut-microbiota mouse work. Some consumer apps rate polysorbate 80 as higher risk because of it. The mouse work is consistent but not confirmed in people, so we show it as a minor concern.",
  "sources": [
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   },
   {
    "text": "European Commission. Regulation (EU) 2020/356 on polysorbate 65 (E 436) in carbonated beverages, 2020",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/356/oj/eng"
   }
  ]
 },
 {
  "id": "e434",
  "code": "E434",
  "name": "Polysorbate 40",
  "kind": "Emulsifier",
  "found": "Some baked goods, desserts and flavour preparations.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses under a shared ADI. Toddler exposure can come close to that limit, and the gut-microbe mouse work was on polysorbate 80, not this one.",
  "research": [
   "The mouse work on gut bacteria and inflammation (Chassaing et al., 2015) tested polysorbate 80 (E433) and carboxymethylcellulose. It did not test this polysorbate. It belongs to the same chemical family, so it is a reason for caution but not a finding about this additive.",
   "EFSA re-evaluated all five polysorbates (E 432 to 436) in 2015 and set a group ADI of 25 mg per kg body weight per day, based on a long-term rat study (NOAEL equal to 2,500 mg/kg bw/day) and a safety factor of 100.",
   "EFSA noted that estimated toddler exposure at the highest level in one scenario was 24.5 mg/kg bw/day, very close to the ADI, and said more use data were needed to reduce uncertainty. For E 436 in fizzy drinks, a 2020 EU regulation said the extra exposure would be below 1% of the ADI."
  ],
  "regulation": "Authorised in the EU (group ADI 25 mg/kg bw/day, EFSA 2015) and the US.",
  "topics": [
   "Gut health (animal studies, related polysorbate 80)"
  ],
  "contested": "Some apps rate all polysorbates alike because of the polysorbate 80 mouse studies. We treat that as a possible class effect that has not been shown for this additive. EFSA's shared ADI covers all five.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2020/356 on polysorbate 65 (E 436) in carbonated beverages, 2020",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/356/oj/eng"
   },
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   }
  ]
 },
 {
  "id": "e435",
  "code": "E435",
  "name": "Polysorbate 60",
  "kind": "Emulsifier",
  "found": "Cakes, icing, whipped toppings, sauces and ice cream.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses under a shared ADI. Toddler exposure can come close to that limit, and the gut-microbe mouse work was on polysorbate 80, not this one.",
  "research": [
   "The mouse work on gut bacteria and inflammation (Chassaing et al., 2015) tested polysorbate 80 (E433) and carboxymethylcellulose. It did not test this polysorbate. It belongs to the same chemical family, so it is a reason for caution but not a finding about this additive.",
   "EFSA re-evaluated all five polysorbates (E 432 to 436) in 2015 and set a group ADI of 25 mg per kg body weight per day, based on a long-term rat study (NOAEL equal to 2,500 mg/kg bw/day) and a safety factor of 100.",
   "EFSA noted that estimated toddler exposure at the highest level in one scenario was 24.5 mg/kg bw/day, very close to the ADI, and said more use data were needed to reduce uncertainty. For E 436 in fizzy drinks, a 2020 EU regulation said the extra exposure would be below 1% of the ADI."
  ],
  "regulation": "Authorised in the EU (group ADI 25 mg/kg bw/day, EFSA 2015) and the US.",
  "topics": [
   "Gut health (animal studies, related polysorbate 80)"
  ],
  "contested": "Some apps rate all polysorbates alike because of the polysorbate 80 mouse studies. We treat that as a possible class effect that has not been shown for this additive. EFSA's shared ADI covers all five.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2020/356 on polysorbate 65 (E 436) in carbonated beverages, 2020",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/356/oj/eng"
   },
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   }
  ]
 },
 {
  "id": "e436",
  "code": "E436",
  "name": "Polysorbate 65",
  "kind": "Emulsifier",
  "found": "Ice cream, desserts, sauces and fizzy drinks (foam control).",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses under a shared ADI. Toddler exposure can come close to that limit, and the gut-microbe mouse work was on polysorbate 80, not this one.",
  "research": [
   "The mouse work on gut bacteria and inflammation (Chassaing et al., 2015) tested polysorbate 80 (E433) and carboxymethylcellulose. It did not test this polysorbate. It belongs to the same chemical family, so it is a reason for caution but not a finding about this additive.",
   "EFSA re-evaluated all five polysorbates (E 432 to 436) in 2015 and set a group ADI of 25 mg per kg body weight per day, based on a long-term rat study (NOAEL equal to 2,500 mg/kg bw/day) and a safety factor of 100.",
   "EFSA noted that estimated toddler exposure at the highest level in one scenario was 24.5 mg/kg bw/day, very close to the ADI, and said more use data were needed to reduce uncertainty. For E 436 in fizzy drinks, a 2020 EU regulation said the extra exposure would be below 1% of the ADI."
  ],
  "regulation": "Authorised in the EU (group ADI 25 mg/kg bw/day, EFSA 2015) and the US.",
  "topics": [
   "Gut health (animal studies, related polysorbate 80)"
  ],
  "contested": "Some apps rate all polysorbates alike because of the polysorbate 80 mouse studies. We treat that as a possible class effect that has not been shown for this additive. EFSA's shared ADI covers all five.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2020/356 on polysorbate 65 (E 436) in carbonated beverages, 2020",
    "url": "https://eur-lex.europa.eu/eli/reg/2020/356/oj/eng"
   },
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   }
  ]
 },
 {
  "id": "e440",
  "code": "E440",
  "name": "Pectin",
  "also": "Amidated pectin (E 440ii)",
  "kind": "Gelling agent (from fruit peel)",
  "found": "Jams, fruit fillings, sweets and yoghurts.",
  "level": "little",
  "evidence": "None",
  "summary": "A fruit fibre. EFSA's 2017 review found no safety concern; a 2021 follow-up only asked for lower limits in infant foods.",
  "research": [
   "EFSA's 2017 re-evaluation of pectin (E 440i) and amidated pectin (E 440ii) found they are fermented by gut bacteria, not absorbed whole. No adverse effects were seen in a chronic rat study up to 5,000 mg/kg body weight per day, the highest dose tested.",
   "A 2021 EFSA follow-up on foods for infants under 16 weeks recommended lowering the maximum levels in two infant food categories to reduce exposure to the additive and to methanol."
  ],
  "careIf": "Young infants on special formulas: limits are being tightened for this group.",
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of pectin (E 440i) and amidated pectin (E 440ii) as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010145/"
   },
   {
    "text": "EFSA FAF Panel. Pectin and amidated pectin in foods for infants below 16 weeks. EFSA Journal, 2021",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6387"
   }
  ]
 },
 {
  "id": "e441",
  "code": "E441",
  "name": "Gelatine",
  "also": "Gelatin",
  "kind": "Gelling agent",
  "found": "Gummy sweets, marshmallows, desserts, yoghurt, capsules",
  "level": "little",
  "evidence": "None",
  "summary": "Gelatine is a protein made from animal skin and bones, so it is not vegetarian or vegan. We found no chemical safety concern for the substance itself.",
  "research": [
   "Gelatine is made from collagen of cattle, pigs or fish. Sources describe it as a by-product of the meat and leather industries. Anyone avoiding animal products, or following halal or kosher diets, should check the source on the label.",
   "In the EU, gelatine for food is made under hygiene rules in Regulation (EC) 853/2004. Export certificates for gelatine refer to that regulation and set raw-material and production conditions. For bovine, ovine and caprine gelatine (other than from hides and skins) these include a negligible BSE-risk origin requirement.",
   "EFSA has assessed BSE risk from ruminant collagen and gelatine, including from bones, and a summary of that work says gelatine from ruminant bones was considered safe from BSE. We could not read the full opinions."
  ],
  "careIf": "People who avoid animal products, or follow halal or kosher diets.",
  "regulation": "Gelatine is treated as a food rather than an additive in the EU, with hygiene and BSE-related rules in Regulation (EC) 853/2004. In the US it is on the FDA GRAS side of the system. We could not confirm the exact legal wording.",
  "topics": [],
  "contested": "CSPI's Chemical Cuisine rates gelatin as Safe and notes it is a protein from animal hides and bones with little nutritional value. We agree on safety. The main issue is origin, not toxicity.",
  "sources": [
   {
    "text": "CSPI. Chemical Cuisine: Gelatin",
    "url": "https://www.cspi.org/chemical-cuisine/gelatin"
   },
   {
    "text": "EFSA BIOHAZ Panel. Potential BSE risk posed by the use of ruminant collagen and gelatine in feed for non-ruminant farmed animals. EFSA Journal, 2020",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7592076/"
   },
   {
    "text": "UK Government. Export health certificate 8390 for gelatine (refers to Reg. 853/2004, Annex III, Section XIV)",
    "url": "https://assets.publishing.service.gov.uk/media/6659b80cd470e3279dd33480/8390_EN_V3.pdf"
   }
  ]
 },
 {
  "id": "e442",
  "code": "E442",
  "name": "Ammonium phosphatides",
  "kind": "Emulsifier",
  "found": "Cocoa and chocolate products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A lecithin-like emulsifier made for chocolate. EFSA reviewed it in 2016. We could not read the opinion itself, so our details are limited.",
  "research": [
   "EFSA re-evaluated ammonium phosphatides in 2016. We could not read the opinion in full, so we state no intake limit here.",
   "We found no human or lab signal specific to this additive. Because we could not read the primary opinion, evidence is shown as Weak, not None."
  ],
  "regulation": "Authorised in the EU for cocoa and chocolate products.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel plenary meeting 2016 (ammonium phosphatides, E 442, on agenda)",
    "url": "https://www.efsa.europa.eu/es/events/event/160927"
   }
  ]
 },
 {
  "id": "e450",
  "code": "E450",
  "name": "Diphosphates",
  "also": "Pyrophosphates, e.g. sodium acid pyrophosphate",
  "kind": "Raising agent and emulsifier",
  "found": "Baked goods, processed meat and cheese.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e451",
  "code": "E451",
  "name": "Triphosphates",
  "kind": "Emulsifier and stabiliser",
  "found": "Processed meat, fish and cheese.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e452",
  "code": "E452",
  "name": "Polyphosphates",
  "kind": "Emulsifier and stabiliser",
  "found": "Processed meat, fish, cheese and desserts.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for phosphates in 2019 and estimated that many children go above it. People with reduced kidney function are advised to limit them.",
  "research": [
   "EFSA re-evaluated phosphoric acid and its salts as a group in 2019. It set a group safe daily intake (ADI) of 40 mg per kg of body weight per day, counted as phosphorus. The figure covers phosphorus from natural food and from additives together. Kidney effects in animal studies were the most sensitive endpoint behind the limit.",
   "EFSA estimated that intake is above this ADI for infants, toddlers and other children on average, and for adolescents and older children at the high end (95th percentile). Food supplements containing phosphate additives also went over it. Additives were estimated to add roughly 6 to 30 percent of total phosphorus intake. EFSA suggested the European Commission consider a maximum level for phosphates in food supplements.",
   "The ADI does not apply to people with moderate or severe kidney impairment. In chronic kidney disease, higher blood phosphate is linked to higher risk of death and heart disease in observational studies (for example, a 2024 US NHANES analysis). Phosphate from additives is absorbed far more fully than phosphorus bound in plant foods, which is why additives matter more for people who must limit phosphorus.",
   "For healthy people the human evidence is mixed and mostly observational. A 2022 US NHANES analysis found no clear overall link between added phosphorus and death. Summaries of the EFSA opinion say the studies it reviewed did not show a consistent link between phosphate intake and heart events. We did not find trials testing whether phosphate additives change heart or kidney outcomes."
  ],
  "careIf": "People with moderate or severe kidney disease, who often must limit phosphorus. EFSA's safe limit does not apply to them. Children and regular users of phosphate-containing supplements may exceed the limit.",
  "regulation": "Authorised in the EU (group safe intake set by EFSA in 2019; EFSA suggested a maximum level for food supplements). Phosphates are generally recognised as safe (GRAS) for food use by the US FDA.",
  "topics": [
   "Kidney disease (people with reduced function)",
   "Intake above safe limit (children)",
   "Heart health (observational, weak)"
  ],
  "contested": "CSPI's Chemical Cuisine rates phosphoric acid and phosphates 'cut back'. Its reasoning is that most people already eat far more phosphorus than they need, which it says may harm kidney, bone and heart health, especially in kidney disease. That is stricter than the EU wording. The kidney-disease concern is well supported. The concern for healthy people rests on observational data that are inconsistent, so it is a reason to eat less processed food rather than evidence of harm from one additive.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of phosphoric acid, phosphates, di-, tri- and polyphosphates (E 338-341, E 343, E 450-452) as food additives. EFSA Journal, 2019",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5674"
   },
   {
    "text": "BfR. Babies, infants and children can exceed the health guidance values for phosphate (summary of the EFSA opinion)",
    "url": "https://www.bfr.bund.de/cm/349/babies-infants-and-children-can-exceed-the-health-guidance%20values.pdf"
   },
   {
    "text": "CSPI. Chemical Cuisine: Phosphoric acid, phosphates (rating: cut back)",
    "url": "https://www.cspinet.org/article/phosphoric-acid-phosphates"
   },
   {
    "text": "Relationship between serum phosphorus and mortality in non-dialysis chronic kidney disease patients: NHANES 2001-2018. 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10918918/"
   }
  ]
 },
 {
  "id": "e460",
  "code": "E460",
  "name": "Cellulose",
  "also": "Microcrystalline cellulose (E 460i), powdered cellulose (E 460ii)",
  "kind": "Bulking agent and anti-caking agent (plant fibre)",
  "found": "Grated cheese, baked goods, tablets and low-fat products.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Plant fibre judged safe by EFSA, but in one large French cohort higher intake of cellulose (E460) was linked to a small rise in cardiovascular disease.",
  "research": [
   "EFSA re-evaluated all the celluloses together in 2018 (E 460 to E 469). JECFA and the EU committee had given them 'not specified' ADIs. EFSA found low acute toxicity and no genotoxicity concern, and read across between the celluloses because they are chemically similar. Specific toxicity data were not available for every cellulose and endpoint.",
   "In the NutriNet-Santé cohort (BMJ 2023, 95,442 adults, median follow-up 7.4 years), higher intake of cellulose (E460) was individually associated with a higher risk of cardiovascular disease (hazard ratio about 1.05 per standard deviation of intake). These are observational studies, so they show links and not cause. The authors note possible measurement error in food records and residual confounding, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Heart disease (cohort association)"
  ],
  "contested": "Regulators see no safety concern at current uses. The French cohort found a small positive association for E460. It is observational, which cannot prove cause, and the effect was small.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e461",
  "code": "E461",
  "name": "Methylcellulose",
  "also": "MC",
  "kind": "Thickener and emulsifier (modified cellulose)",
  "found": "Vegetarian burgers, gluten-free bread, fried-food batters and ice cream.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Modified plant fibre judged safe by EFSA in its 2018 review of the celluloses. It wasn't singled out in the large French cohort, which did link two other celluloses (E460 and E466) to heart disease.",
  "research": [
   "EFSA re-evaluated all the celluloses together in 2018 (E 460 to E 469). JECFA and the EU committee had given them 'not specified' ADIs. EFSA found low acute toxicity and no genotoxicity concern, and read across between the celluloses because they are chemically similar. Specific toxicity data were not available for every cellulose and endpoint.",
   "The 2023 NutriNet-Santé study linked cellulose (E460) and carboxymethylcellulose (E466) to cardiovascular disease. We could not confirm a separate result for this additive, so we show a minor concern because it belongs to the same group of chemically similar fibres."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (related celluloses linked to heart disease in one cohort)"
  ],
  "contested": "Regulators see no concern. Related celluloses showed small associations in one cohort, so we flag this one at the minor step without claiming a result for it.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e463",
  "code": "E463",
  "name": "Hydroxypropyl cellulose",
  "also": "HPC",
  "kind": "Thickener and emulsifier (modified cellulose)",
  "found": "Whipped toppings, some supplements and coatings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Modified plant fibre judged safe by EFSA in 2018. Not one of the celluloses singled out in the French cohort grouping.",
  "research": [
   "EFSA re-evaluated all the celluloses together in 2018 (E 460 to E 469). JECFA and the EU committee had given them 'not specified' ADIs. EFSA found low acute toxicity and no genotoxicity concern, and read across between the celluloses because they are chemically similar. Specific toxicity data were not available for every cellulose and endpoint.",
   "The NutriNet-Santé cohort grouped E 460, E 461, E 464, E 466 and E 468 as 'celluloses'. E 463 was not in that group, and We found no separate study on it."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited specific data"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e464",
  "code": "E464",
  "name": "Hydroxypropyl methylcellulose",
  "also": "HPMC, hypromellose",
  "kind": "Thickener and emulsifier (modified cellulose)",
  "found": "Vegan egg and meat substitutes, capsules, gluten-free baking and sauces.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Modified plant fibre judged safe by EFSA in its 2018 review of the celluloses. It wasn't singled out in the large French cohort, which did link two other celluloses (E460 and E466) to heart disease.",
  "research": [
   "EFSA re-evaluated all the celluloses together in 2018 (E 460 to E 469). JECFA and the EU committee had given them 'not specified' ADIs. EFSA found low acute toxicity and no genotoxicity concern, and read across between the celluloses because they are chemically similar. Specific toxicity data were not available for every cellulose and endpoint.",
   "The 2023 NutriNet-Santé study linked cellulose (E460) and carboxymethylcellulose (E466) to cardiovascular disease. We could not confirm a separate result for this additive, so we show a minor concern because it belongs to the same group of chemically similar fibres."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (related celluloses linked to heart disease in one cohort)"
  ],
  "contested": "Regulators see no concern. Related celluloses showed small associations in one cohort, so we flag this one at the minor step without claiming a result for it.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e465",
  "code": "E465",
  "name": "Ethyl methylcellulose",
  "also": "EMC",
  "kind": "Thickener and foaming agent (modified cellulose)",
  "found": "Whipped toppings and some desserts; rarely used.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Modified plant fibre judged safe by EFSA in 2018. Little specific data and rare use.",
  "research": [
   "EFSA re-evaluated all the celluloses together in 2018 (E 460 to E 469). JECFA and the EU committee had given them 'not specified' ADIs. EFSA found low acute toxicity and no genotoxicity concern, and read across between the celluloses because they are chemically similar. Specific toxicity data were not available for every cellulose and endpoint.",
   "E 465 was not in the cellulose group analysed in the NutriNet-Santé cohort, and We found no separate study on it."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited specific data"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e466",
  "code": "E466",
  "name": "Carboxymethylcellulose",
  "also": "CMC, cellulose gum, sodium carboxymethylcellulose",
  "kind": "Emulsifier and thickener (modified cellulose)",
  "found": "Ice cream, sauces, baked goods, gluten-free bread and processed cheese.",
  "level": "some",
  "evidence": "Weak",
  "summary": "Regulators accept it, but mouse studies and a small human feeding trial found changes in gut bacteria, and a large French cohort linked cellulose additives to heart disease risk.",
  "research": [
   "EFSA's 2018 cellulose re-evaluation found no genotoxicity concern and gave no numerical ADI. Specific toxicity data were not available for every cellulose and endpoint.",
   "In a 2015 Nature study in mice (Chassaing et al.), carboxymethylcellulose and polysorbate 80 at low concentrations changed gut bacteria and caused low-grade gut inflammation and weight gain.",
   "A 2022 Gastroenterology study (Chassaing et al.) gave 16 healthy adults a diet with or without 15 g/day of CMC for 11 days. The CMC group had slightly more abdominal discomfort after meals, lower gut bacterial diversity and changes in stool chemistry, including lower short-chain fatty acids. The study was very small and short, and the dose was high.",
   "In NutriNet-Santé (BMJ 2023), E 466 intake was linked with small increases in cardiovascular disease (hazard ratio about 1.03) and coronary heart disease (about 1.04). This is an association only."
  ],
  "careIf": "People with inflammatory bowel disease sometimes choose to limit emulsifiers, but no regulator names this group.",
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Gut bacteria (small human trial, mouse studies)",
   "Heart disease (cohort association)"
  ],
  "contested": "Regulators rate CMC as safe at current uses. Stricter views rest on mouse work and a 16-person trial at a high dose, plus an observational cohort. These are real signals, but they do not show harm at normal food intakes.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of celluloses E 460(i), E 460(ii), E 461, E 462, E 463, E 464, E 465, E 466, E 468 and E 469 as food additives. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009359/"
   },
   {
    "text": "Chassaing B et al. Randomized controlled-feeding study of dietary emulsifier carboxymethylcellulose reveals detrimental impacts on the gut microbiota and metabolome. Gastroenterology, 2022",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7986288"
   },
   {
    "text": "Chassaing B et al. Dietary emulsifiers impact the mouse gut microbiota promoting colitis and metabolic syndrome. Nature, 2015",
    "url": "https://doi.org/10.1038/nature14232"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://hal.inrae.fr/hal-04205056"
   }
  ]
 },
 {
  "id": "e471",
  "code": "E471",
  "name": "Mono- and diglycerides of fatty acids",
  "labelName": "Mono- and diglycerides",
  "also": "Glycerol mono- and distearate; glyceryl monostearate",
  "kind": "Emulsifier",
  "found": "Bread, cakes, margarine, ice cream, chocolate, peanut butter and many packaged foods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses. A large French cohort linked higher intake to more cancer. This is an association, not proof of cause.",
  "research": [
   "In the NutriNet-Santé study in France (PLOS Medicine 2024, about 92,000 adults followed for around 7 years, 2,604 cancers), people in the highest third of intake of mono- and diglycerides of fatty acids (E471) had a higher risk of overall cancer (hazard ratio about 1.15), breast cancer (about 1.24) and prostate cancer (about 1.46) than those in the lowest third. No link was found with colorectal cancer.",
   "The same research group found links between other emulsifiers in the same family and heart disease (E472b, E472c) and between several emulsifiers and type 2 diabetes. We did not confirm that those papers reported a separate result for E471, so we don't claim one.",
   "EFSA re-evaluated E471 in 2017. It said no numerical safe intake was needed because the body breaks these fats down into glycerol and fatty acids, and asked for tighter specifications for contaminants from processing.",
   "These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU (EFSA 2017: no numerical ADI needed) and generally recognised as safe in the US. Not banned anywhere we found.",
  "topics": [
   "Cancer (observational cohort)"
  ],
  "contested": "Regulators found no concern, and EFSA's 2017 opinion predates these cohort papers. Some consumer apps rate E471 more strictly, mostly because of them. The cohort evidence is real but weak: modest hazard ratios from one French cohort, no experiment, and E471 is also a marker of ultra-processed food. We rate it \"some concern\" with weak evidence, like E472b and E472c, which come from the same research group.",
  "sources": [
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French NutriNet-Santé cohort. PLOS Medicine, 2024",
    "url": "https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1004338"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://doi.org/10.1136/bmj-2023-076058"
   }
  ]
 },
 {
  "id": "e472a",
  "code": "E472a",
  "name": "Acetic acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Bakery products, margarine, fat spreads and desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses. Cohort studies on related mono- and diglycerides did not single out this one in the sources we could read.",
  "research": [
   "EFSA re-evaluated E472a-f together in 2020. It found no adverse effects relevant to humans in the animal and lab safety data and said no numerical ADI was needed for E472a, b and c. It said only L(+)-tartaric acid should be used to make E472d, e and f.",
   "The French NutriNet-Santé cohort linked higher intake of mono- and diglycerides (E471) and two esters (E472b, E472c) to cardiovascular disease, and E471 to cancer. In the sources we could read, E472a was not named. That is a gap, not proof of safety, because the cohort analysed many emulsifiers and exposure to this one may be low.",
   "These are observational studies. They cannot show cause. The authors point to possible measurement error in food records, residual confounding (people who eat more ultra-processed food differ in many other ways), and a cohort that is mostly women and better educated than average. They say the results need repeating in other populations and testing in experiments."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Related emulsifiers (observational cohort)"
  ],
  "contested": "Apps that rate the whole E472 family strictly rely on the E472b and E472c cohort signal. We do not extend that to E472a without a result for it.",
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French prospective NutriNet-Santé cohort. PLoS Medicine, 2024",
    "url": "https://pubmed.ncbi.nlm.nih.gov/38349899/"
   }
  ]
 },
 {
  "id": "e472b",
  "code": "E472b",
  "name": "Lactic acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Bread, cakes, margarine, whipped toppings and packaged desserts.",
  "level": "some",
  "evidence": "Weak",
  "summary": "A large French study linked higher intake to more cardiovascular disease. It shows a link, not cause and effect.",
  "research": [
   "A 2023 BMJ study followed 95,442 French adults for a median of 7.4 years (1,995 cardiovascular events). Higher intake of lactic acid esters of mono- and diglycerides (E472b) was associated with a higher risk of cardiovascular disease (hazard ratio about 1.06 per standard deviation of intake).",
   "EFSA re-evaluated E472a-f together in 2020. It found no adverse effects relevant to humans in the animal and lab safety data and said no numerical ADI was needed for E472a, b and c. It said only L(+)-tartaric acid should be used to make E472d, e and f.",
   "These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Cardiovascular disease (observational cohort)"
  ],
  "contested": "Regulators saw no concern; the signal comes from one French cohort with modest estimates. We rate E472b, E472c and E471 \"some concern\" with weak evidence, because each was named in a large cohort paper by the same research group.",
  "sources": [
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://doi.org/10.1136/bmj-2023-076058"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French prospective NutriNet-Santé cohort. PLoS Medicine, 2024",
    "url": "https://pubmed.ncbi.nlm.nih.gov/38349899/"
   }
  ]
 },
 {
  "id": "e472c",
  "code": "E472c",
  "name": "Citric acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Infant formula, bread, margarine and packaged desserts.",
  "level": "some",
  "evidence": "Weak",
  "summary": "A large French study linked higher intake to more cardiovascular disease and coronary heart disease. It shows a link, not cause and effect.",
  "research": [
   "A 2023 BMJ study followed 95,442 French adults for a median of 7.4 years. Higher intake of citric acid esters of mono- and diglycerides (E472c) was associated with a higher risk of cardiovascular disease (hazard ratio about 1.04) and coronary heart disease (about 1.06), per standard deviation of intake.",
   "EFSA re-evaluated E472a-f together in 2020. It found no adverse effects relevant to humans in the animal and lab safety data and said no numerical ADI was needed for E472a, b and c. It said only L(+)-tartaric acid should be used to make E472d, e and f.",
   "These are observational studies, so they show links and not cause. The authors note possible measurement error in food records, residual confounding, and a cohort that is mostly women and better educated than average, and say the results need repeating."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Cardiovascular disease (observational cohort)"
  ],
  "contested": "Regulators saw no concern; the signal comes from one French cohort with modest estimates. We rate E472b, E472c and E471 \"some concern\" with weak evidence, because each was named in a large cohort paper by the same research group.",
  "sources": [
   {
    "text": "Sellem L et al. Food additive emulsifiers and risk of cardiovascular disease in the NutriNet-Santé cohort. BMJ, 2023",
    "url": "https://doi.org/10.1136/bmj-2023-076058"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "Sellem L et al. Food additive emulsifiers and cancer risk: results from the French prospective NutriNet-Santé cohort. PLoS Medicine, 2024",
    "url": "https://pubmed.ncbi.nlm.nih.gov/38349899/"
   }
  ]
 },
 {
  "id": "e472d",
  "code": "E472d",
  "name": "Tartaric acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Bread and bakery products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses. Cohort studies did not name this one in the sources we could read.",
  "research": [
   "EFSA re-evaluated E472a-f together in 2020. It found no adverse effects relevant to humans in the animal and lab safety data and said no numerical ADI was needed for E472a, b and c. It said only L(+)-tartaric acid should be used to make E472d, e and f. Some E472d and E472f specification questions were still open in a 2025 EFSA follow-up.",
   "The French cohort studies named E471, E472b and E472c but, in the sources we could read, not E472d. That is a data gap, not proof of safety.",
   "These are observational studies. They cannot show cause. The authors point to possible measurement error in food records, residual confounding (people who eat more ultra-processed food differ in many other ways), and a cohort that is mostly women and better educated than average. They say the results need repeating in other populations and testing in experiments."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Related emulsifiers (observational cohort)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   }
  ]
 },
 {
  "id": "e472e",
  "code": "E472e",
  "name": "Mono- and diacetyltartaric acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Bread, rolls and bakery products.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set an ADI of 0 to 50 mg per kg body weight per day. A 2024 French cohort study on type 2 diabetes listed it among emulsifiers linked to higher risk.",
  "research": [
   "EFSA 2020 kept an ADI of 0 to 50 mg/kg body weight for E472e. Other E472 esters had 'not specified'.",
   "In the 2024 Lancet Diabetes & Endocrinology paper (Salame et al., 104,139 adults, 6.8 years, 1,056 type 2 diabetes cases), E472e was reported among additives linked to higher risk, along with carrageenans and some gums. The authors call it an initial exploration. We could not read the exact hazard ratio for E472e.",
   "These are observational studies. They cannot show cause. The authors point to possible measurement error in food records, residual confounding (people who eat more ultra-processed food differ in many other ways), and a cohort that is mostly women and better educated than average. They say the results need repeating in other populations and testing in experiments."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Type 2 diabetes (observational cohort)"
  ],
  "contested": "Regulators found no concern. The diabetes signal is one cohort and has not been tested in experiments.",
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes (NutriNet-Santé). Lancet Diabetes & Endocrinology, 2024",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11217929/"
   },
   {
    "text": "INRAE. The consumption of certain food additive emulsifiers could be associated with the risk of developing type 2 diabetes, 2024",
    "url": "https://www.inrae.fr/en/news/consumption-certain-food-additive-emulsifiers-could-be-associated-risk-developing-type-2-diabetes"
   },
   {
    "text": "Salame C et al. Food additive emulsifiers and the risk of type 2 diabetes: NutriNet-Santé cohort. Lancet Diabetes & Endocrinology, 2024",
    "url": "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(24)00086-X/fulltext"
   }
  ]
 },
 {
  "id": "e472f",
  "code": "E472f",
  "name": "Mixed acetic and tartaric acid esters of mono- and diglycerides",
  "kind": "Emulsifier",
  "found": "Bread and bakery products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses. Cohort studies did not name this one in the sources we could read.",
  "research": [
   "EFSA re-evaluated E472a-f together in 2020. It found no adverse effects relevant to humans in the animal and lab safety data and said no numerical ADI was needed for E472a, b and c. It said only L(+)-tartaric acid should be used to make E472d, e and f. Some E472d and E472f specification questions were still open in a 2025 EFSA follow-up.",
   "The French cohort studies named other family members, not E472f, in the sources we could read. That is a data gap, not proof of safety.",
   "These are observational studies. They cannot show cause. The authors point to possible measurement error in food records, residual confounding (people who eat more ultra-processed food differ in many other ways), and a cohort that is mostly women and better educated than average. They say the results need repeating in other populations and testing in experiments."
  ],
  "regulation": "Authorised in the EU and the US. EFSA 2020 re-evaluated the whole E472a-f group.",
  "topics": [
   "Related emulsifiers (observational cohort)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of acetic, lactic, citric, tartaric and mono- and diacetyltartaric acid esters of mono- and diglycerides of fatty acids (E 472a-f). EFSA Journal, 2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32874250/"
   },
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   }
  ]
 },
 {
  "id": "e473",
  "code": "E473",
  "name": "Sucrose esters of fatty acids",
  "kind": "Emulsifier",
  "found": "Baked goods, desserts, sauces, chewing gum and processed meat.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA's own exposure estimates exceeded the group ADI of 40 mg per kg body weight per day for many groups, especially toddlers and children. No human health effect has been shown.",
  "research": [
   "Sucrose esters (E 473) and sucroglycerides (E 474) share a group ADI of 40 mg/kg bw/day, set by EFSA in 2004.",
   "A refined exposure assessment by EFSA found that estimated exposure to E 473 exceeded this ADI for many population groups, especially toddlers and children. A 2023 EFSA opinion on infant foods repeated this finding.",
   "We found no cohort or trial linking sucrose esters to disease. The concern is a margin-of-safety question, not a proven effect."
  ],
  "careIf": "Infants under 16 weeks have a separate EFSA assessment.",
  "regulation": "Authorised in the EU (group ADI 40 mg/kg bw/day) and the US. Exposure estimates are conservative and based on maximum permitted levels.",
  "topics": [
   "Intake above safe limit (EFSA estimate)"
  ],
  "contested": "Estimates use maximum permitted levels and may overstate real intake. We list it as a minor concern only for that reason.",
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment of sucrose esters of fatty acids (E 473)",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009454/"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of sucrose esters of fatty acids (E 473) in foods for infants below 16 weeks of age, 2023",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10119783/"
   }
  ]
 },
 {
  "id": "e474",
  "code": "E474",
  "name": "Sucroglycerides",
  "kind": "Emulsifier",
  "found": "Baked goods, desserts and flavour preparations.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Shares the 40 mg per kg body weight group ADI with sucrose esters. We could not find a separate recent EFSA opinion for it.",
  "research": [
   "Sucroglycerides share the EFSA group ADI of 40 mg/kg bw/day with sucrose esters (E 473). EFSA's exposure concern was assessed for E 473, and we could not confirm it for E 474.",
   "We found no human studies linking sucroglycerides to disease."
  ],
  "regulation": "Authorised in the EU (group ADI 40 mg/kg bw/day with E 473).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA. Refined exposure assessment of sucrose esters of fatty acids (E 473)",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009454/"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of sucrose esters of fatty acids (E 473) in foods for infants below 16 weeks of age, 2023",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10119783/"
   }
  ]
 },
 {
  "id": "e475",
  "code": "E475",
  "name": "Polyglycerol esters of fatty acids",
  "kind": "Emulsifier",
  "found": "Cakes, dairy-free desserts, whipped toppings and margarine.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no adverse effects in short and long studies and kept an ADI of 25 mg per kg body weight per day. Some specification gaps were noted.",
  "research": [
   "EFSA re-evaluated E 475 in 2017. It found no adverse effects at any dose in short-term, subchronic or chronic animal studies and kept the ADI of 25 mg/kg bw/day.",
   "A later EFSA opinion addressed data gaps behind a proposed change to the EU specifications. We found no human cohort or trial on this additive."
  ],
  "regulation": "Authorised in the EU (ADI 25 mg/kg bw/day) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of polyglycerol esters of fatty acids (E 475) as a food additive. EFSA Journal, 2017",
    "url": "https://reading-pure-test.eprints-hosting.org/75234/"
   }
  ]
 },
 {
  "id": "e476",
  "code": "E476",
  "name": "Polyglycerol polyricinoleate",
  "also": "PGPR",
  "kind": "Emulsifier",
  "found": "Chocolate, spreads, emulsified sauces and low-fat spreads.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA raised the ADI from 7.5 to 25 mg per kg body weight per day in 2017 and found no safety concern at current uses.",
  "research": [
   "EFSA re-evaluated PGPR in 2017. Using a two-year rat study (only one dose, 2,500 mg/kg bw/day, tested, no effect seen) it revised the ADI from the older 7.5 to 25 mg/kg bw/day.",
   "A 2022 follow-up asked for lower limits on arsenic, lead, mercury and cadmium in the specifications.",
   "A single-dose study is a limitation. We found no human cohort or trial on PGPR."
  ],
  "regulation": "Authorised in the EU (ADI 25 mg/kg bw/day) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of polyglycerol polyricinoleate (E 476) as a food additive. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010163/"
   },
   {
    "text": "EFSA FAF Panel. Follow-up of the re-evaluation of polyglycerol polyricinoleate (E 476), 2022",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9066526/"
   }
  ]
 },
 {
  "id": "e477",
  "code": "E477",
  "name": "Propane-1,2-diol esters of fatty acids",
  "kind": "Emulsifier",
  "found": "Cakes, sponges, whipped toppings and some desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses in 2018. It noted there are no long-term studies on the ester itself, so it relies on data for propane-1,2-diol.",
  "research": [
   "EFSA's 2018 re-evaluation confirmed an acceptable daily intake of 25 mg per kg of body weight per day, expressed as propane-1,2-diol (about 80 mg per kg of the additive itself). Estimated exposure did not exceed it in any population group.",
   "EFSA said any effect of this additive would come from propane-1,2-diol. It noted that no long-term, cancer, reproductive or developmental studies on the ester itself were available, and that it saw no genotoxicity concern.",
   "Propane-1,2-diol also reaches the diet through E 1520 and propane-1,2-diol alginate (E 405). EFSA said it would look at whether a group limit for all of them makes sense.",
   "We found no recent human studies linking this additive to harm."
  ],
  "regulation": "Authorised in the EU and the US with limits.",
  "topics": [
   "Limited data (no long-term studies on the ester itself)"
  ],
  "sources": [
   {
    "text": "EFSA: Re-evaluation of propane-1,2-diol esters of fatty acids (E 477) as a food additive, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009423/"
   },
   {
    "text": "EFSA Journal 2018;16(12):5497, doi 10.2903/j.efsa.2018.5497",
    "url": "https://doi.org/10.2903/j.efsa.2018.5497"
   }
  ]
 },
 {
  "id": "e481",
  "code": "E481",
  "name": "Sodium stearoyl-2-lactylate",
  "kind": "Emulsifier and dough conditioner",
  "found": "Bread, rolls, tortillas, pancakes and dairy-free creamers.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA re-evaluated the two stearoyl-2-lactylates together in 2013 and found no safety concern at current uses. Toddler exposure estimates can be high.",
  "research": [
   "EFSA published a re-evaluation of sodium and calcium stearoyl-2-lactylate (E 481 and E 482) in 2013, with a companion exposure statement. It estimated combined toddler exposure at the high level of 22 to 109 mg per kg body weight per day (estimate), and said widening use in emulsified cooked meat would not raise exposure.",
   "We could not read the opinion text in this review, so we do not state the ADI figure. See the EFSA Journal opinion (doi 10.2903/j.efsa.2013.3144).",
   "These esters break down in the gut into stearic acid and lactic acid. We found no human cohort or trial linking them to disease. The 2023 French cohort named other mono- and diglyceride emulsifiers, not E 481 or E 482, in the sources we could read."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify the CSPI rating. If an app rates these strictly, it is not on the basis of the NutriNet-Santé mono- and diglyceride findings, which concern different compounds.",
  "sources": [
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   }
  ]
 },
 {
  "id": "e482",
  "code": "E482",
  "name": "Calcium stearoyl-2-lactylate",
  "kind": "Emulsifier and dough conditioner",
  "found": "Bread, rolls, tortillas, pancakes and dairy-free creamers.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA re-evaluated the two stearoyl-2-lactylates together in 2013 and found no safety concern at current uses. Toddler exposure estimates can be high.",
  "research": [
   "EFSA published a re-evaluation of sodium and calcium stearoyl-2-lactylate (E 481 and E 482) in 2013, with a companion exposure statement. It estimated combined toddler exposure at the high level of 22 to 109 mg per kg body weight per day (estimate), and said widening use in emulsified cooked meat would not raise exposure.",
   "We could not read the opinion text in this review, so we do not state the ADI figure. See the EFSA Journal opinion (doi 10.2903/j.efsa.2013.3144).",
   "These esters break down in the gut into stearic acid and lactic acid. We found no human cohort or trial linking them to disease. The 2023 French cohort named other mono- and diglyceride emulsifiers, not E 481 or E 482, in the sources we could read."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify the CSPI rating. If an app rates these strictly, it is not on the basis of the NutriNet-Santé mono- and diglyceride findings, which concern different compounds.",
  "sources": [
   {
    "text": "BMJ Group. High intake of several emulsifier E numbers linked to increased cardiovascular disease risk, 2023",
    "url": "https://bmjgroup.com/high-intake-of-several-emulsifier-e-numbers-linked-to-increased-cardiovascular-disease-risk/"
   }
  ]
 },
 {
  "id": "e491",
  "code": "E491",
  "name": "Sorbitan monostearate",
  "kind": "Emulsifier",
  "found": "Cake mixes, icing, dry yeast, chewing gum and coffee whiteners.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a group ADI of 10 mg per kg body weight per day. Toddlers and children can exceed it in some worst-case estimates.",
  "research": [
   "EFSA re-evaluated the five sorbitan esters (E 491 to 495) together in 2017. The Panel set a group ADI of 10 mg of sorbitan per kg body weight per day, replacing older, separate SCF values.",
   "A later EFSA opinion on E 491 as a carrier in enzyme preparations reported that this group ADI was exceeded in toddlers and children at the 95th percentile in a refined scenario for a limited number of national dietary surveys. These are estimates.",
   "We found no human cohort or trial linking these esters to disease. Lab work on gut bacteria has focused on polysorbates and carboxymethylcellulose, not sorbitan esters."
  ],
  "regulation": "Authorised in the EU (group ADI 10 mg sorbitan/kg bw/day, EFSA 2017) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify a CSPI rating for the sorbitan esters in this pass. Apps that group them with polysorbates are extending animal data on a different chemical.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbitan monostearate (E 491), tristearate (E 492), monolaurate (E 493), monooleate (E 494) and monopalmitate (E 495). EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010202/"
   }
  ]
 },
 {
  "id": "e492",
  "code": "E492",
  "name": "Sorbitan tristearate",
  "kind": "Emulsifier",
  "found": "Chocolate coatings, confectionery and fat-based fillings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a group ADI of 10 mg per kg body weight per day. Toddlers and children can exceed it in some worst-case estimates.",
  "research": [
   "EFSA re-evaluated the five sorbitan esters (E 491 to 495) together in 2017. The Panel set a group ADI of 10 mg of sorbitan per kg body weight per day, replacing older, separate SCF values.",
   "A later EFSA opinion on E 491 as a carrier in enzyme preparations reported that this group ADI was exceeded in toddlers and children at the 95th percentile in a refined scenario for a limited number of national dietary surveys. These are estimates.",
   "We found no human cohort or trial linking these esters to disease. Lab work on gut bacteria has focused on polysorbates and carboxymethylcellulose, not sorbitan esters."
  ],
  "regulation": "Authorised in the EU (group ADI 10 mg sorbitan/kg bw/day, EFSA 2017) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify a CSPI rating for the sorbitan esters in this pass. Apps that group them with polysorbates are extending animal data on a different chemical.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbitan monostearate (E 491), tristearate (E 492), monolaurate (E 493), monooleate (E 494) and monopalmitate (E 495). EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010202/"
   }
  ]
 },
 {
  "id": "e493",
  "code": "E493",
  "name": "Sorbitan monolaurate",
  "kind": "Emulsifier",
  "found": "Cake mixes, dairy-free creamers and some baked goods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a group ADI of 10 mg per kg body weight per day. Toddlers and children can exceed it in some worst-case estimates.",
  "research": [
   "EFSA re-evaluated the five sorbitan esters (E 491 to 495) together in 2017. The Panel set a group ADI of 10 mg of sorbitan per kg body weight per day, replacing older, separate SCF values.",
   "A later EFSA opinion on E 491 as a carrier in enzyme preparations reported that this group ADI was exceeded in toddlers and children at the 95th percentile in a refined scenario for a limited number of national dietary surveys. These are estimates.",
   "We found no human cohort or trial linking these esters to disease. Lab work on gut bacteria has focused on polysorbates and carboxymethylcellulose, not sorbitan esters."
  ],
  "regulation": "Authorised in the EU (group ADI 10 mg sorbitan/kg bw/day, EFSA 2017) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify a CSPI rating for the sorbitan esters in this pass. Apps that group them with polysorbates are extending animal data on a different chemical.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbitan monostearate (E 491), tristearate (E 492), monolaurate (E 493), monooleate (E 494) and monopalmitate (E 495). EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010202/"
   }
  ]
 },
 {
  "id": "e494",
  "code": "E494",
  "name": "Sorbitan monooleate",
  "kind": "Emulsifier",
  "found": "Vitamin preparations, flavourings and some desserts.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a group ADI of 10 mg per kg body weight per day. Toddlers and children can exceed it in some worst-case estimates.",
  "research": [
   "EFSA re-evaluated the five sorbitan esters (E 491 to 495) together in 2017. The Panel set a group ADI of 10 mg of sorbitan per kg body weight per day, replacing older, separate SCF values.",
   "A later EFSA opinion on E 491 as a carrier in enzyme preparations reported that this group ADI was exceeded in toddlers and children at the 95th percentile in a refined scenario for a limited number of national dietary surveys. These are estimates.",
   "We found no human cohort or trial linking these esters to disease. Lab work on gut bacteria has focused on polysorbates and carboxymethylcellulose, not sorbitan esters."
  ],
  "regulation": "Authorised in the EU (group ADI 10 mg sorbitan/kg bw/day, EFSA 2017) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify a CSPI rating for the sorbitan esters in this pass. Apps that group them with polysorbates are extending animal data on a different chemical.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbitan monostearate (E 491), tristearate (E 492), monolaurate (E 493), monooleate (E 494) and monopalmitate (E 495). EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010202/"
   }
  ]
 },
 {
  "id": "e495",
  "code": "E495",
  "name": "Sorbitan monopalmitate",
  "kind": "Emulsifier",
  "found": "Baked goods, icing and dry yeast.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a group ADI of 10 mg per kg body weight per day. Toddlers and children can exceed it in some worst-case estimates.",
  "research": [
   "EFSA re-evaluated the five sorbitan esters (E 491 to 495) together in 2017. The Panel set a group ADI of 10 mg of sorbitan per kg body weight per day, replacing older, separate SCF values.",
   "A later EFSA opinion on E 491 as a carrier in enzyme preparations reported that this group ADI was exceeded in toddlers and children at the 95th percentile in a refined scenario for a limited number of national dietary surveys. These are estimates.",
   "We found no human cohort or trial linking these esters to disease. Lab work on gut bacteria has focused on polysorbates and carboxymethylcellulose, not sorbitan esters."
  ],
  "regulation": "Authorised in the EU (group ADI 10 mg sorbitan/kg bw/day, EFSA 2017) and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "contested": "We did not verify a CSPI rating for the sorbitan esters in this pass. Apps that group them with polysorbates are extending animal data on a different chemical.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sorbitan monostearate (E 491), tristearate (E 492), monolaurate (E 493), monooleate (E 494) and monopalmitate (E 495). EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7010202/"
   }
  ]
 },
 {
  "id": "e500",
  "code": "E500",
  "name": "Sodium carbonates",
  "also": "Baking soda (sodium bicarbonate) and soda ash",
  "kind": "Raising agent and acidity regulator",
  "found": "Baking powder, biscuits, cocoa and some drinks.",
  "level": "little",
  "evidence": "None",
  "summary": "Includes ordinary baking soda. Regulators set no numerical limit, and we found no credible safety signal.",
  "research": [
   "In 1990 the EU Scientific Committee for Food gave carbonates a group safe daily intake of 'not specified', meaning no numerical limit was thought necessary. EFSA agreed with this group approach when it re-evaluated calcium carbonate in 2011.",
   "Sodium bicarbonate is also used as a household baking ingredient and as an antacid. The sodium it adds is small in most foods.",
   "We searched for recent human studies on this additive used as a food additive and found no credible safety signal. Our searches did not find a separate EFSA re-evaluation opinion for it, because it has not been a priority for re-evaluation. That is a gap in the review, not a finding of harm."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Scientific opinion on re-evaluation of calcium carbonate (E 170) as a food additive (notes the 1990 SCF group ADI 'not specified' for carbonates), 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2318"
   },
   {
    "text": "Commission Regulation (EU) 2022/141 (recitals on sodium and potassium carbonates, SCF 1990)",
    "url": "https://eur-lex.europa.eu/eli/reg/2022/141/oj"
   }
  ]
 },
 {
  "id": "e501",
  "code": "E501",
  "name": "Potassium carbonates",
  "kind": "Acidity regulator and raising agent",
  "found": "Cocoa processing, some baked goods and drinks.",
  "level": "little",
  "evidence": "None",
  "summary": "Regulators set no numerical limit for potassium carbonates, and we found no credible safety signal.",
  "research": [
   "In 1990 the EU Scientific Committee for Food gave carbonates a group safe daily intake of 'not specified', meaning no numerical limit was thought necessary. EFSA agreed with this group approach when it re-evaluated calcium carbonate in 2011.",
   "Potassium carbonate is used to process cocoa (Dutching) and to adjust acidity.",
   "We searched for recent human studies on this additive used as a food additive and found no credible safety signal. Our searches did not find a separate EFSA re-evaluation opinion for it, because it has not been a priority for re-evaluation. That is a gap in the review, not a finding of harm."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Scientific opinion on re-evaluation of calcium carbonate (E 170) as a food additive (notes the 1990 SCF group ADI 'not specified' for carbonates), 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2318"
   },
   {
    "text": "Commission Regulation (EU) 2022/141 (recitals on sodium and potassium carbonates, SCF 1990)",
    "url": "https://eur-lex.europa.eu/eli/reg/2022/141/oj"
   }
  ]
 },
 {
  "id": "e503",
  "code": "E503",
  "name": "Ammonium carbonates",
  "kind": "Raising agent",
  "found": "Some traditional baked goods such as flat biscuits and crackers.",
  "level": "little",
  "evidence": "None",
  "summary": "Ammonium carbonates break down into gases when baked, so little remains in the finished food. We found no credible safety signal.",
  "research": [
   "In 1990 the EU Scientific Committee for Food gave carbonates a group safe daily intake of 'not specified', meaning no numerical limit was thought necessary. EFSA agreed with this group approach when it re-evaluated calcium carbonate in 2011.",
   "The gases (ammonia and carbon dioxide) escape during baking, which is why it suits thin, dry bakes.",
   "We searched for recent human studies on this additive used as a food additive and found no credible safety signal. Our searches did not find a separate EFSA re-evaluation opinion for it, because it has not been a priority for re-evaluation. That is a gap in the review, not a finding of harm."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Scientific opinion on re-evaluation of calcium carbonate (E 170) as a food additive (notes the 1990 SCF group ADI 'not specified' for carbonates), 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2318"
   },
   {
    "text": "Commission Regulation (EU) 2022/141 (recitals on sodium and potassium carbonates, SCF 1990)",
    "url": "https://eur-lex.europa.eu/eli/reg/2022/141/oj"
   }
  ]
 },
 {
  "id": "e504",
  "code": "E504",
  "name": "Magnesium carbonates",
  "kind": "Anti-caking agent and acidity regulator",
  "found": "Salt, powdered mixes, some sweets and supplements.",
  "level": "little",
  "evidence": "None",
  "summary": "Magnesium carbonates have no numerical limit set by regulators, and we found no credible safety signal.",
  "research": [
   "In 1990 the EU Scientific Committee for Food gave carbonates a group safe daily intake of 'not specified', meaning no numerical limit was thought necessary. EFSA agreed with this group approach when it re-evaluated calcium carbonate in 2011.",
   "Magnesium carbonate is also used as a mineral supplement and antacid. Very high doses of magnesium salts can loosen the bowels.",
   "We searched for recent human studies on this additive used as a food additive and found no credible safety signal. Our searches did not find a separate EFSA re-evaluation opinion for it, because it has not been a priority for re-evaluation. That is a gap in the review, not a finding of harm."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Scientific opinion on re-evaluation of calcium carbonate (E 170) as a food additive (notes the 1990 SCF group ADI 'not specified' for carbonates), 2011",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2318"
   },
   {
    "text": "Commission Regulation (EU) 2022/141 (recitals on sodium and potassium carbonates, SCF 1990)",
    "url": "https://eur-lex.europa.eu/eli/reg/2022/141/oj"
   }
  ]
 },
 {
  "id": "e507",
  "code": "E507",
  "name": "Hydrochloric acid",
  "kind": "Acidity regulator",
  "found": "Processing aid in starch, sugar and gelatine production; rarely in the final food",
  "level": "little",
  "evidence": "None",
  "summary": "Hydrochloric acid is used in small amounts in processing and ends up as chloride salts. EFSA saw no safety concern.",
  "research": [
   "EFSA re-evaluated the four chlorides together in 2019. The Panel judged them to have low acute and short-term oral toxicity and saw no concern for genotoxicity. Some in-vitro positives appeared only at high concentrations linked to low pH or high osmolality, which the Panel judged not to occur in the body.",
   "The Panel used a human reference value of 40 mg chloride per kg body weight per day. Mean exposure from additive use was below or at that value in all age groups, and EFSA concluded there was no safety concern. Chloride is also an essential nutrient. Average intake estimates ranged from about 2 mg/kg bw per day in the elderly to about 42 in toddlers (non-brand-loyal scenario). These are estimates.",
   "We could not read the full opinion text, so details such as specification changes are not covered here."
  ],
  "regulation": "Authorised in the EU. FDA lists several chlorides as GRAS.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of hydrochloric acid (E 507), potassium chloride (E 508), calcium chloride (E 509) and magnesium chloride (E 511) as food additives. EFSA Journal, 2019",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009240/"
   }
  ]
 },
 {
  "id": "e508",
  "code": "E508",
  "name": "Potassium chloride",
  "also": "Salt substitute",
  "kind": "Salt substitute and gelling aid",
  "found": "Reduced-sodium foods, low-sodium salt, sauces, jellies",
  "level": "little",
  "evidence": "Weak",
  "summary": "Potassium chloride is a common replacer for sodium. EFSA found no safety concern at additive use, but extra potassium needs care for some people.",
  "research": [
   "EFSA re-evaluated the four chlorides together in 2019. The Panel judged them to have low acute and short-term oral toxicity and saw no concern for genotoxicity. Some in-vitro positives appeared only at high concentrations linked to low pH or high osmolality, which the Panel judged not to occur in the body.",
   "The Panel used a human reference value of 40 mg chloride per kg body weight per day. Mean exposure from additive use was below or at that value in all age groups, and EFSA concluded there was no safety concern. Chloride is also an essential nutrient. Average intake estimates ranged from about 2 mg/kg bw per day in the elderly to about 42 in toddlers (non-brand-loyal scenario). These are estimates.",
   "We could not read the full opinion text, so details such as specification changes are not covered here.",
   "Potassium is the part that matters in practice. Clinical reviews report high blood potassium (hyperkalaemia) from salt substitutes in people with kidney disease or taking some blood-pressure medicines such as ACE inhibitors. We saw these points only in summaries of that literature, not as a regulator rule for the additive."
  ],
  "careIf": "People with kidney disease, or on medicines that raise blood potassium, should ask a clinician before using potassium-based salt substitutes.",
  "regulation": "Authorised in the EU. In the US it is GRAS (21 CFR 184.1622), and FDA guidance allows the name 'potassium chloride salt' on labels.",
  "topics": [
   "Potassium load in kidney disease or some medicines"
  ],
  "contested": "Some consumer apps flag a moderate risk of exceeding intake limits. We could not find that in the EFSA opinion, which used a chloride reference value and found mean exposure at or below it.",
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of hydrochloric acid (E 507), potassium chloride (E 508), calcium chloride (E 509) and magnesium chloride (E 511) as food additives. EFSA Journal, 2019",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009240/"
   },
   {
    "text": "US eCFR. 21 CFR 184.1622 Potassium chloride",
    "url": "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-184/subpart-B/section-184.1622"
   },
   {
    "text": "US FDA. The Use of an Alternate Name for Potassium Chloride in Food Labeling",
    "url": "https://www.fda.gov/media/125081/download"
   },
   {
    "text": "Clinical review of salt substitutes and hyperkalaemia, PMC",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5137987"
   }
  ]
 },
 {
  "id": "e509",
  "code": "E509",
  "name": "Calcium chloride",
  "kind": "Firming agent",
  "found": "Canned vegetables, cheese, pickles, tofu",
  "level": "little",
  "evidence": "None",
  "summary": "Calcium chloride keeps foods firm. EFSA saw no safety concern at current use.",
  "research": [
   "EFSA re-evaluated the four chlorides together in 2019. The Panel judged them to have low acute and short-term oral toxicity and saw no concern for genotoxicity. Some in-vitro positives appeared only at high concentrations linked to low pH or high osmolality, which the Panel judged not to occur in the body.",
   "The Panel used a human reference value of 40 mg chloride per kg body weight per day. Mean exposure from additive use was below or at that value in all age groups, and EFSA concluded there was no safety concern. Chloride is also an essential nutrient. Average intake estimates ranged from about 2 mg/kg bw per day in the elderly to about 42 in toddlers (non-brand-loyal scenario). These are estimates.",
   "We could not read the full opinion text, so details such as specification changes are not covered here."
  ],
  "regulation": "Authorised in the EU. In the US it is GRAS (21 CFR 184.1193).",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of hydrochloric acid (E 507), potassium chloride (E 508), calcium chloride (E 509) and magnesium chloride (E 511) as food additives. EFSA Journal, 2019",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009240/"
   },
   {
    "text": "US eCFR. 21 CFR 184.1193 Calcium chloride",
    "url": "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-184/subpart-B/section-184.1193"
   }
  ]
 },
 {
  "id": "e511",
  "code": "E511",
  "name": "Magnesium chloride",
  "also": "Nigari",
  "kind": "Firming agent",
  "found": "Tofu, some drinks and supplements",
  "level": "little",
  "evidence": "None",
  "summary": "Magnesium chloride is used to set tofu and firm foods. EFSA saw no safety concern at current use.",
  "research": [
   "EFSA re-evaluated the four chlorides together in 2019. The Panel judged them to have low acute and short-term oral toxicity and saw no concern for genotoxicity. Some in-vitro positives appeared only at high concentrations linked to low pH or high osmolality, which the Panel judged not to occur in the body.",
   "The Panel used a human reference value of 40 mg chloride per kg body weight per day. Mean exposure from additive use was below or at that value in all age groups, and EFSA concluded there was no safety concern. Chloride is also an essential nutrient. Average intake estimates ranged from about 2 mg/kg bw per day in the elderly to about 42 in toddlers (non-brand-loyal scenario). These are estimates.",
   "We could not read the full opinion text, so details such as specification changes are not covered here."
  ],
  "regulation": "Authorised in the EU. In the US it is GRAS (21 CFR 184.1426).",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of hydrochloric acid (E 507), potassium chloride (E 508), calcium chloride (E 509) and magnesium chloride (E 511) as food additives. EFSA Journal, 2019",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009240/"
   },
   {
    "text": "US eCFR. 21 CFR 184.1426 Magnesium chloride",
    "url": "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-184/subpart-B/section-184.1426"
   }
  ]
 },
 {
  "id": "e513",
  "code": "E513",
  "name": "Sulfuric acid",
  "kind": "Acidity regulator",
  "found": "Used in small amounts to adjust acidity in processing, for example in some drinks, starch and sugar products.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA re-evaluated sulphuric acid and its salts in 2019 and found no safety concern at current uses. We found no credible signal in recent human studies.",
  "research": [
   "EFSA's 2019 re-evaluation covered sulphuric acid and its sodium, potassium, calcium and ammonium salts together (E 513 to E 517). It found sulphates have low acute harm, with no concern about DNA damage or cancer, and saw no need for a numerical safe daily intake.",
   "EFSA estimated mean exposure from the additives at between 0.4 mg sulphate per kg body weight a day in infants and 35 mg a day in toddlers (the highest scenario). Sulphate also occurs naturally in drinking water and many foods.",
   "Sulphate is not the same as sulphite (E220 to E228), which is the group linked to reactions in people with asthma. The two are different chemicals."
  ],
  "regulation": "Authorised in the EU under Regulation (EC) No 1333/2008. Sulfuric acid is also permitted in the US as a processing aid and pH adjuster.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sulphuric acid and its sodium, potassium, calcium and ammonium salts (E 513, 514, 515, 516 and 517) as food additives. EFSA Journal, 2019",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7008880/"
   }
  ]
 },
 {
  "id": "e514",
  "code": "E514",
  "name": "Sodium sulfates",
  "also": "Glauber's salt",
  "kind": "Acidity regulator and carrier",
  "found": "Colourings, flavourings, some processed foods and salt mixes.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA re-evaluated sulphuric acid and its salts in 2019 and found no safety concern at current uses. We found no credible signal in recent human studies.",
  "research": [
   "EFSA's 2019 re-evaluation covered sulphuric acid and its sodium, potassium, calcium and ammonium salts together (E 513 to E 517). It found sulphates have low acute harm, with no concern about DNA damage or cancer, and saw no need for a numerical safe daily intake.",
   "EFSA estimated mean exposure from the additives at between 0.4 mg sulphate per kg body weight a day in infants and 35 mg a day in toddlers (the highest scenario). Sulphate also occurs naturally in drinking water and many foods.",
   "Sulphate is not the same as sulphite (E220 to E228), which is the group linked to reactions in people with asthma. The two are different chemicals."
  ],
  "regulation": "Authorised in the EU under Regulation (EC) No 1333/2008. Authorised in the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sulphuric acid and its sodium, potassium, calcium and ammonium salts (E 513, 514, 515, 516 and 517) as food additives. EFSA Journal, 2019",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7008880/"
   }
  ]
 },
 {
  "id": "e516",
  "code": "E516",
  "name": "Calcium sulfate",
  "also": "Gypsum",
  "kind": "Firming agent and flour treatment",
  "found": "Tofu, bread dough, canned vegetables, brewing",
  "level": "little",
  "evidence": "None",
  "summary": "Calcium sulfate is a mineral salt used in tofu and baking. EFSA saw no safety concern.",
  "research": [
   "EFSA re-evaluated sulphuric acid and its sodium, potassium, calcium and ammonium salts (E 513 to 517) in 2019. The Panel concluded there is no safety concern at the reported uses and no need for a numerical ADI.",
   "Sulfates have low acute toxicity, with no genotoxicity or carcinogenicity concern. The known effect of large sulfate doses is a laxative effect, at 300 mg/kg in humans; estimated intakes were far below this. Mean exposure ranged from 0.4 mg sulphate/kg bw per day in infants to 35 in toddlers (estimates for the whole group).",
   "Calcium sulfate is not a sulfite and does not carry sulfite allergy warnings."
  ],
  "regulation": "Authorised in the EU.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sulphuric acid and its sodium, potassium, calcium and ammonium salts (E 513, 514, 515, 516, 517) as food additives. EFSA Journal, 2019",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7008880/"
   }
  ]
 },
 {
  "id": "e521",
  "code": "E521",
  "name": "Aluminium sodium sulfate",
  "labelName": "Sodium aluminum sulfate",
  "also": "Sodium aluminum sulfate",
  "kind": "Acidity regulator",
  "found": "Bread, cakes and tortillas in the US.",
  "level": "some",
  "evidence": "Weak",
  "summary": "An aluminium-containing additive. Yuka reports aluminium is suspected of effects on reproduction and development, and that it can build up in the body.",
  "research": [
   "Yuka's investigation says sodium aluminum sulfate is allowed on both sides of the Atlantic, but the EU limits it to specific products such as candied cherries and liquid egg whites, while the US allows it in any food, including bread, cakes and tortillas.",
   "Yuka describes aluminium as suspected of affecting reproduction and fetal development and as accumulating in the body. We have not yet reviewed the studies behind that, so we keep the evidence label at Weak until we have."
  ],
  "careIf": "People who want to limit aluminium may check bread and baked goods labels in the US.",
  "regulation": "EU: only a few foods. US: allowed in any food.",
  "topics": [
   "Aluminium build-up (suspected)"
  ],
  "contested": "Where views differ: Yuka singles this additive out as an example of looser US rules. We have not yet reviewed the primary studies, so we show it as limited risk until we do. The difference in where it is allowed is documented.",
  "sources": [
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   }
  ]
 },
 {
  "id": "e524",
  "code": "E524",
  "name": "Sodium hydroxide",
  "also": "Caustic soda, lye",
  "kind": "Acidity regulator",
  "found": "Pretzels and lye rolls (as a dip), olives, cocoa processing and some baked goods.",
  "level": "little",
  "evidence": "None",
  "summary": "Used in small amounts to adjust acidity or to process foods, and it reacts during processing. We found no credible safety signal for food use, though we did not find a recent EFSA opinion for it.",
  "research": [
   "Sodium hydroxide is a strong alkali. In its concentrated form it is corrosive, but in food it is used in small amounts and is largely used up (neutralised) during processing, for example when pretzels or olives are treated.",
   "EU food additives approved before 2009, including the hydroxides, are on EFSA's re-evaluation programme. We did not find a completed EFSA opinion for E 524 in food. Our searches also found no recent human studies pointing to a concern.",
   "This rating reflects the absence of a signal and the processing role, not a full modern safety review. Treat it as low concern, not proven free of concern."
  ],
  "regulation": "Authorised in the EU and the US. EFSA re-evaluation of the hydroxides was part of a programme set under Regulation (EU) No 257/2010; we did not find a completed opinion.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of food additives (EU programme under Regulation 257/2010), 2012",
    "url": "https://efsa.europa.eu/sites/default/files/consultation/120706a.pdf"
   }
  ]
 },
 {
  "id": "e529",
  "code": "E529",
  "name": "Calcium oxide",
  "also": "Quicklime",
  "kind": "Alkali and acidity regulator",
  "found": "Processing: cocoa, sugar, nixtamalised corn",
  "level": "little",
  "evidence": "None",
  "summary": "Calcium oxide is lime, used to adjust acidity during processing. We could not confirm a recent EFSA opinion.",
  "research": [
   "JECFA last evaluated calcium oxide and calcium hydroxide in 1965 and gave an ADI of 'not limited'.",
   "A 2009 EU directive adjusted purity limits because lime products cannot meet the earlier limits for magnesium and alkali salts, citing magnesium salts as of no safety concern.",
   "Strong lime is caustic as a powder, but in food it is neutralised during processing."
  ],
  "regulation": "Authorised in the EU.",
  "topics": [],
  "sources": [
   {
    "text": "IPCS INCHEM. JECFA evaluation: calcium hydroxide and calcium oxide",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_320.htm"
   },
   {
    "text": "EU. Commission Directive 2009/10/EC",
    "url": "https://eur-lex.europa.eu/eli/dir/2009/10/oj"
   }
  ]
 },
 {
  "id": "e535",
  "code": "E535",
  "name": "Sodium ferrocyanide",
  "kind": "Anti-caking agent",
  "found": "Salt and salt substitutes",
  "level": "little",
  "evidence": "Weak",
  "summary": "Ferrocyanides are used mainly as anti-caking agents in salt. EFSA set a low group ADI and found current intake well below it.",
  "research": [
   "EFSA re-evaluated sodium, potassium and calcium ferrocyanide (E 535, E 536, E 538) in 2018 and set a group ADI of 0.03 mg/kg body weight per day, expressed as ferrocyanide ion. The kidney was the target organ.",
   "Absorption is low and the substances do not accumulate in humans. EFSA saw no concern for genotoxicity or carcinogenicity.",
   "Maximum-level exposure reached up to 0.009 mg/kg bw per day for children and adolescents, and the refined estimate was up to 0.003 (estimates). That is below the ADI. Use is authorised in only two food categories, both salt substitutes."
  ],
  "regulation": "Authorised in the EU in a very limited set of uses.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sodium ferrocyanide (E 535), potassium ferrocyanide (E 536) and calcium ferrocyanide (E 538) as food additives. EFSA Journal, 2018",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009536/"
   },
   {
    "text": "EFSA Journal 2018;16(7):5374",
    "url": "https://www.efsa.europa.eu/de/efsajournal/pub/5374"
   }
  ]
 },
 {
  "id": "e536",
  "code": "E536",
  "name": "Potassium ferrocyanide",
  "kind": "Anti-caking agent",
  "found": "Salt and salt substitutes",
  "level": "little",
  "evidence": "Weak",
  "summary": "Ferrocyanides are used mainly as anti-caking agents in salt. EFSA set a low group ADI and found current intake well below it.",
  "research": [
   "EFSA re-evaluated sodium, potassium and calcium ferrocyanide (E 535, E 536, E 538) in 2018 and set a group ADI of 0.03 mg/kg body weight per day, expressed as ferrocyanide ion. The kidney was the target organ.",
   "Absorption is low and the substances do not accumulate in humans. EFSA saw no concern for genotoxicity or carcinogenicity.",
   "Maximum-level exposure reached up to 0.009 mg/kg bw per day for children and adolescents, and the refined estimate was up to 0.003 (estimates). That is below the ADI. Use is authorised in only two food categories, both salt substitutes."
  ],
  "regulation": "Authorised in the EU in a very limited set of uses.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sodium ferrocyanide (E 535), potassium ferrocyanide (E 536) and calcium ferrocyanide (E 538) as food additives. EFSA Journal, 2018",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009536/"
   },
   {
    "text": "EFSA Journal 2018;16(7):5374",
    "url": "https://www.efsa.europa.eu/de/efsajournal/pub/5374"
   }
  ]
 },
 {
  "id": "e538",
  "code": "E538",
  "name": "Calcium ferrocyanide",
  "kind": "Anti-caking agent",
  "found": "Salt and salt substitutes",
  "level": "little",
  "evidence": "Weak",
  "summary": "Ferrocyanides are used mainly as anti-caking agents in salt. EFSA set a low group ADI and found current intake well below it.",
  "research": [
   "EFSA re-evaluated sodium, potassium and calcium ferrocyanide (E 535, E 536, E 538) in 2018 and set a group ADI of 0.03 mg/kg body weight per day, expressed as ferrocyanide ion. The kidney was the target organ.",
   "Absorption is low and the substances do not accumulate in humans. EFSA saw no concern for genotoxicity or carcinogenicity.",
   "Maximum-level exposure reached up to 0.009 mg/kg bw per day for children and adolescents, and the refined estimate was up to 0.003 (estimates). That is below the ADI. Use is authorised in only two food categories, both salt substitutes."
  ],
  "regulation": "Authorised in the EU in a very limited set of uses.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of sodium ferrocyanide (E 535), potassium ferrocyanide (E 536) and calcium ferrocyanide (E 538) as food additives. EFSA Journal, 2018",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009536/"
   },
   {
    "text": "EFSA Journal 2018;16(7):5374",
    "url": "https://www.efsa.europa.eu/de/efsajournal/pub/5374"
   }
  ]
 },
 {
  "id": "e551",
  "code": "E551",
  "name": "Silicon dioxide",
  "also": "Silica",
  "kind": "Anti-caking agent",
  "found": "Powdered seasonings, salt, coffee creamers, supplements and spice mixes.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA found no safety concern at current uses in 2018 and again in 2024. It did note uncertainty about very small (nano) particles because long-term studies are lacking.",
  "research": [
   "EFSA's 2018 re-evaluation found no concern about DNA damage and no sign of harm at reported uses. The highest exposure estimates were at least ten times lower than the doses with no observed effect in animals. But it said the EU specifications did not rule out nanoparticles, and that no long-term study used nano silica.",
   "A 2024 follow-up used newer particle data and nano-specific guidance. EFSA did not set a numerical safe daily intake, and instead used a margin-of-exposure approach, requiring a margin of at least 36. It concluded E 551 does not raise a safety concern for all age groups, including infants below 16 weeks, at reported uses.",
   "EFSA still notes uncertainty because few studies used well-dispersed nano-sized material. We found no human study showing harm from food-additive silica."
  ],
  "regulation": "Authorised in the EU and the US. EFSA said the EU specifications can be updated to better describe the particles.",
  "topics": [
   "Nano-sized particles (data gaps, no harm shown)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of silicon dioxide (E 551) as a food additive. EFSA Journal, 2018",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5088"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of silicon dioxide (E 551) as a food additive in foods for infants below 16 weeks and follow-up for all population groups. EFSA Journal, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11483555/"
   }
  ]
 },
 {
  "id": "e552",
  "code": "E552",
  "name": "Calcium silicate",
  "kind": "Anti-caking agent",
  "found": "Powdered mixes, salt, spices and supplements.",
  "level": "some",
  "evidence": "Weak",
  "summary": "In 2018 EFSA said it could not assess the safety of calcium silicate and related silicates because key data were missing. This is a data gap, not a finding of harm.",
  "research": [
   "EFSA's 2018 opinion covered calcium silicate (E 552), magnesium silicate (E 553a) and talc (E 553b) together. It concluded that their safety could not be assessed. One reason was missing information on particle size, including whether nano-sized particles are present.",
   "The European Commission asked industry for the missing data. The review was later split so that talc would be assessed first, then calcium and magnesium silicates.",
   "We found no human study showing harm from calcium silicate in food. The rating reflects the unresolved data gap."
  ],
  "regulation": "Authorised in the EU and the US. Re-evaluation follow-up is pending.",
  "topics": [
   "Safety could not be assessed (data gaps)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of calcium silicate (E 552), magnesium silicate (E 553a) and talc (E 553b) as food additives. EFSA Journal, 2018",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5375"
   },
   {
    "text": "EFSA. Call for data for Talc E 553b",
    "url": "https://www.efsa.europa.eu/en/call/call-data-talc-e-553b"
   }
  ]
 },
 {
  "id": "e553b",
  "code": "E553b",
  "name": "Talc",
  "also": "Talcum, magnesium silicate (hydrated)",
  "kind": "Anti-caking and glazing agent",
  "found": "Tablet coatings, supplements, chewing gum, some sweets and rice polish. Rarely used in foods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA said in 2018 that it could not assess talc's safety as a food additive. IARC rated talc as probably carcinogenic to humans in 2025, based mainly on other kinds of exposure than eating.",
  "research": [
   "EFSA's 2018 opinion concluded that the safety of talc and related silicates could not be assessed because of missing data. A later EFSA call for data asked for particle-size details and said talc needs assessment at nano scale. Tests with radiolabelled talc in animals suggest low absorption, but it was unclear whether urine radioactivity was talc itself.",
   "In 2025 IARC classed talc (not containing asbestos) as probably carcinogenic to humans (Group 2A). It judged evidence in humans to be limited, evidence in animals sufficient, and the mechanism evidence strong. The summaries we found do not say what it concluded about eating talc, and most human data concern inhalation and use in body powder.",
   "Talc from some deposits can be contaminated with asbestos, which is a known cause of cancer. Food-grade talc is required to be free of asbestos."
  ],
  "regulation": "Authorised in the EU as E 553b, with EFSA follow-up pending. In the US talc is permitted in limited food uses.",
  "topics": [
   "Safety could not be assessed (data gaps)",
   "Cancer classification (IARC 2A, mainly non-food exposure)"
  ],
  "contested": "IARC's rating is about talc as a substance and rests mostly on inhalation and body-powder exposure. EFSA's issue is missing data. Neither shows harm from the tiny amounts used in food, so a cautious rating reflects uncertainty rather than proof of harm.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of calcium silicate (E 552), magnesium silicate (E 553a) and talc (E 553b) as food additives. EFSA Journal, 2018",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/5375"
   },
   {
    "text": "EFSA. Call for data for Talc E 553b",
    "url": "https://www.efsa.europa.eu/en/call/call-data-talc-e-553b"
   },
   {
    "text": "IARC Monographs Volume 136: Talc and acrylonitrile, 2025",
    "url": "https://monographs.iarc.who.int/news-events/volume-136-talc-and-acrylonitrile"
   }
  ]
 },
 {
  "id": "e554",
  "code": "E554",
  "name": "Sodium aluminium silicate",
  "kind": "Anti-caking agent",
  "found": "Powdered mixes, salt and some cheese coatings.",
  "level": "some",
  "evidence": "Weak",
  "summary": "In 2020 EFSA said it could not assess the safety of this additive and flagged aluminium exposure from food supplements. This is a gap in data, not proof of harm.",
  "research": [
   "EFSA's 2020 re-evaluation of E 554 and E 555 concluded their safety could not be assessed. Safety-study data were very limited and the substances were not described well enough.",
   "EFSA calculated that aluminium exposure from E 554 used in food supplements would exceed the tolerable weekly intake for aluminium, which EFSA set at 1 mg per kg of body weight per week in 2008.",
   "We found no human study of harm from these additives specifically. The rating reflects the data gap and the aluminium content."
  ],
  "careIf": "People who use food supplements containing E 554 may go above the aluminium weekly limit, according to EFSA's estimate.",
  "regulation": "Authorised in the EU with limited uses. EFSA asked for more data.",
  "topics": [
   "Safety could not be assessed (data gaps)",
   "Aluminium intake (estimate above limit in supplements)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sodium aluminium silicate (E 554) and potassium aluminium silicate (E 555) as food additives. EFSA Journal, 2020",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6152"
   }
  ]
 },
 {
  "id": "e555",
  "code": "E555",
  "name": "Potassium aluminium silicate",
  "kind": "Anti-caking agent",
  "found": "Pearlescent coatings on sweets and pills, and supplements.",
  "level": "some",
  "evidence": "Weak",
  "summary": "In 2020 EFSA said it could not assess the safety of this additive and flagged aluminium exposure from food supplements. This is a gap in data, not proof of harm.",
  "research": [
   "EFSA's 2020 re-evaluation of E 554 and E 555 concluded their safety could not be assessed. Safety-study data were very limited and the substances were not described well enough.",
   "EFSA calculated that aluminium exposure from E 554 used in food supplements would exceed the tolerable weekly intake for aluminium, which EFSA set at 1 mg per kg of body weight per week in 2008.",
   "We found no human study of harm from these additives specifically. The rating reflects the data gap and the aluminium content."
  ],
  "careIf": "People who use food supplements containing E 554 may go above the aluminium weekly limit, according to EFSA's estimate.",
  "regulation": "Authorised in the EU with limited uses. EFSA asked for more data.",
  "topics": [
   "Safety could not be assessed (data gaps)",
   "Aluminium intake (estimate above limit in supplements)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sodium aluminium silicate (E 554) and potassium aluminium silicate (E 555) as food additives. EFSA Journal, 2020",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6152"
   }
  ]
 },
 {
  "id": "e559",
  "code": "E559",
  "name": "Aluminium silicate",
  "also": "Kaolin",
  "kind": "Anti-caking agent",
  "found": "Rarely used in foods. May appear in supplements and powder mixes.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A natural clay. We did not find a dedicated EFSA re-evaluation. It is a source of aluminium, for which EFSA set a weekly limit.",
  "research": [
   "Kaolin is a natural clay. The WHO/FAO expert committee (JECFA) last reviewed aluminium silicate in 1985 and set a safe daily intake of 'not specified'.",
   "EFSA's 2008 aluminium opinion set a tolerable weekly intake of 1 mg aluminium per kg body weight. It lists E 559 among additives that contribute aluminium. We did not find a dedicated EFSA re-evaluation of E 559 in food.",
   "The closely related E 554 and E 555 were judged not assessable in 2020. This gap is why the evidence is marked weak. We found no human study of harm from E 559."
  ],
  "regulation": "Authorised in the EU in limited uses. We did not confirm the current detailed rules.",
  "topics": [
   "Aluminium intake (estimate only)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of sodium aluminium silicate (E 554) and potassium aluminium silicate (E 555) as food additives. EFSA Journal, 2020",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6152"
   },
   {
    "text": "IPCS INCHEM. JECFA evaluation of aluminium silicate",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_91.htm"
   }
  ]
 },
 {
  "id": "e570",
  "code": "E570",
  "name": "Fatty acids",
  "also": "Stearic, palmitic, lauric, oleic acid and others",
  "kind": "Anti-foaming and glazing agent",
  "found": "Sweets, chewing gum, coatings on fruit, and processed foods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "These are the same fatty acids found in ordinary fats and oils. EFSA found no safety concern in 2017, but noted limited long-term data.",
  "research": [
   "EFSA's 2017 re-evaluation covered caprylic, capric, lauric, myristic, palmitic, stearic and oleic acids. It found they are absorbed and handled like the fatty acids from the normal diet, and that harmful effects were not seen at dietary doses of up to 10 percent in the limited studies available.",
   "The panel found no concern about DNA damage. It said the data on long-term, reproductive and developmental effects were too limited to draw a conclusion, which is why the evidence is marked weak rather than none.",
   "Intake from this additive is small compared with the fatty acids already in the diet. Some of these acids may come from animal fat and some from plant oil."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of fatty acids (E 570) as a food additive. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009963/"
   }
  ]
 },
 {
  "id": "e574",
  "code": "E574",
  "name": "Gluconic acid",
  "kind": "Acidity regulator",
  "found": "Dairy products, baked goods, drinks and as a cleaning agent for fruit.",
  "level": "little",
  "evidence": "None",
  "summary": "A mild acid that the body handles like a sugar-derived acid. EFSA has not yet finished its re-evaluation, and we found no credible signal.",
  "research": [
   "Gluconic acid occurs naturally in honey, fruit and wine. Commercial gluconic acid is made by fermenting glucose.",
   "EFSA is re-evaluating gluconic acid and its related additives (E 574 to E 579) as part of the programme for additives approved before 2009. It issued a call for data with a 2024 deadline. We did not find a published conclusion yet.",
   "In our search we found no credible human or animal signal of harm at food-additive levels. GDL and gluconates have long been regarded as low concern by regulators, but the modern EFSA review is still pending."
  ],
  "regulation": "Authorised in the EU. Generally recognised as safe (GRAS) in the US. EFSA re-evaluation of E 574 to E 579 is pending.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of gluconic acid (E 574) and related food additives (E 575-579)",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-gluconic-acid-e-574-and-related-food-additives-e-575-579"
   }
  ]
 },
 {
  "id": "e575",
  "code": "E575",
  "name": "Glucono delta-lactone",
  "also": "GDL",
  "kind": "Acidity regulator and raising agent",
  "found": "Tofu, salt-preserved meats, bakery products, cheese and dessert mixes.",
  "level": "little",
  "evidence": "None",
  "summary": "A mild acid that the body handles like a sugar-derived acid. EFSA has not yet finished its re-evaluation, and we found no credible signal.",
  "research": [
   "GDL slowly turns into gluconic acid in water, which is a natural acid found in honey, fruit and wine.",
   "EFSA is re-evaluating gluconic acid and its related additives (E 574 to E 579) as part of the programme for additives approved before 2009. It issued a call for data with a 2024 deadline. We did not find a published conclusion yet.",
   "In our search we found no credible human or animal signal of harm at food-additive levels. GDL and gluconates have long been regarded as low concern by regulators, but the modern EFSA review is still pending."
  ],
  "regulation": "Authorised in the EU. Generally recognised as safe (GRAS) in the US. EFSA re-evaluation of E 574 to E 579 is pending.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of gluconic acid (E 574) and related food additives (E 575-579)",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-gluconic-acid-e-574-and-related-food-additives-e-575-579"
   }
  ]
 },
 {
  "id": "e620",
  "code": "E620",
  "name": "Glutamic acid",
  "kind": "Flavour enhancer",
  "found": "Savoury snacks, soups, sauces and seasoning blends.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e621",
  "code": "E621",
  "name": "Monosodium glutamate",
  "labelName": "MSG",
  "also": "MSG",
  "kind": "Flavour enhancer",
  "found": "Savoury snacks, instant noodles, stock cubes, sauces and restaurant food.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Trials on MSG and headache give mixed results. A 2016 systematic review found that most studies with food showed no clear difference from placebo, while some without food did. Many trials used high doses in drink, which makes blinding hard. The review said a causal link remains unproven.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e622",
  "code": "E622",
  "name": "Monopotassium glutamate",
  "kind": "Flavour enhancer",
  "found": "Low-sodium seasonings, soups and savoury snacks.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e623",
  "code": "E623",
  "name": "Calcium diglutamate",
  "kind": "Flavour enhancer",
  "found": "Seasonings and savoury products (less common).",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e624",
  "code": "E624",
  "name": "Monoammonium glutamate",
  "kind": "Flavour enhancer",
  "found": "Seasonings and savoury products (less common).",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e625",
  "code": "E625",
  "name": "Magnesium diglutamate",
  "kind": "Flavour enhancer",
  "found": "Seasonings and savoury products (less common).",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA set a group safe daily intake for added glutamates in 2017 and found that some people, notably toddlers and children and high consumers, may go above it. Evidence for harm at normal food levels is weak.",
  "research": [
   "EFSA's 2017 re-evaluation covered glutamic acid and its sodium, potassium, calcium, ammonium and magnesium salts together. It set a group acceptable daily intake (ADI) of 30 mg per kg of body weight per day, based on a no-effect dose of 3,200 mg per kg per day for MSG in an animal study of brain development. It saw no concern about DNA damage.",
   "EFSA also estimated how much people take in from additive use alone. It found that intake could be above the ADI for high consumers, and for toddlers and children with average intake. For some groups the estimates were also above doses linked to effects in people. EFSA asked for lower maximum levels to be considered. These are estimates and do not include glutamate that occurs naturally in food.",
   "Glutamate is also found naturally in tomatoes, cheese, mushrooms and many protein foods, and the body makes it. That is why the ADI covers added glutamate only."
  ],
  "careIf": "Toddlers, children and people who eat a lot of savoury processed foods were the groups where EFSA estimated intake could exceed the safe level. Some people report short-lived symptoms such as headache after large doses of MSG, but blinded trials are mixed.",
  "regulation": "Authorised in the EU and in the US, where MSG is generally recognised as safe (GRAS) and must be named on labels.",
  "topics": [
   "Intake above safe level for some groups (estimate)",
   "Headache or flushing in sensitive people (mixed trial evidence)"
  ],
  "contested": "CSPI's Chemical Cuisine places MSG in a caution tier for sensitive people, more cautious than a plain 'safe'. That fits the regulator picture better than a 'clear' label: the human reaction evidence is mixed, but EFSA itself flagged intake above the ADI for some groups. Neither source claims serious harm at typical use.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of glutamic acid (E 620), sodium glutamate (E 621), potassium glutamate (E 622), calcium glutamate (E 623), ammonium glutamate (E 624) and magnesium glutamate (E 625) as food additives. EFSA Journal, 2017",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/4910"
   },
   {
    "text": "EFSA opinion on glutamates, open-access full text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009848"
   },
   {
    "text": "Zanfirescu A et al. Does monosodium glutamate really cause headache? A systematic review of human studies. J Headache Pain, 2016",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4870486/"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e627",
  "code": "E627",
  "name": "Disodium guanylate",
  "kind": "Flavour enhancer",
  "found": "Instant noodles, crisps, stock cubes and sauces, often with MSG.",
  "level": "little",
  "evidence": "Weak",
  "summary": "JECFA found no need to limit these nucleotide flavour enhancers, but EFSA has not finished its modern re-evaluation. They are usually used with glutamate and add purines.",
  "research": [
   "JECFA, the joint FAO/WHO expert committee, gave the ribonucleotides an ADI of 'not specified', which means low safety concern at normal use. That assessment dates from the 1970s to 1990s.",
   "EFSA opened a call for data to re-evaluate ribonucleotides E 626 to 635 and, as far as we could find, has not yet published its opinion. So there is no up-to-date EU safety conclusion or exposure estimate to cite.",
   "These compounds are part of normal purine metabolism. The JECFA monograph notes that large amounts can raise blood uric acid in people, which matters for those with gout.",
   "We found no recent human trials or cohort studies on them as additives."
  ],
  "careIf": "People with gout or high uric acid: the JECFA monograph says large intakes can raise uric acid. Some official labelling in other countries also warns them off.",
  "regulation": "Authorised in the EU and the US (FDA lists them as permitted flavour enhancers). EFSA re-evaluation of E 626 to 635 is still pending.",
  "topics": [
   "Uric acid and gout (regulator note)"
  ],
  "contested": "Consumer databases that rate these as higher risk usually point to purines and gout. That is a real mechanism, noted by JECFA, but it applies to people with gout and large intakes. We found no evidence of wider harm.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of ribonucleotides (E 626-635) as food additives",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-ribonucleotides-e-626-635-food-additives"
   },
   {
    "text": "JECFA. Disodium 5'-ribonucleotides: safety monograph (WHO Food Additives Series 6)",
    "url": "https://inchem.org/documents/jecfa/jecmono/v06je05.htm"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e631",
  "code": "E631",
  "name": "Disodium inosinate",
  "kind": "Flavour enhancer",
  "found": "Instant noodles, crisps, stock cubes and sauces, often with MSG.",
  "level": "little",
  "evidence": "Weak",
  "summary": "JECFA found no need to limit these nucleotide flavour enhancers, but EFSA has not finished its modern re-evaluation. They are usually used with glutamate and add purines.",
  "research": [
   "JECFA, the joint FAO/WHO expert committee, gave the ribonucleotides an ADI of 'not specified', which means low safety concern at normal use. That assessment dates from the 1970s to 1990s.",
   "EFSA opened a call for data to re-evaluate ribonucleotides E 626 to 635 and, as far as we could find, has not yet published its opinion. So there is no up-to-date EU safety conclusion or exposure estimate to cite.",
   "These compounds are part of normal purine metabolism. The JECFA monograph notes that large amounts can raise blood uric acid in people, which matters for those with gout.",
   "We found no recent human trials or cohort studies on them as additives."
  ],
  "careIf": "People with gout or high uric acid: the JECFA monograph says large intakes can raise uric acid. Some official labelling in other countries also warns them off.",
  "regulation": "Authorised in the EU and the US (FDA lists them as permitted flavour enhancers). EFSA re-evaluation of E 626 to 635 is still pending.",
  "topics": [
   "Uric acid and gout (regulator note)"
  ],
  "contested": "Consumer databases that rate these as higher risk usually point to purines and gout. That is a real mechanism, noted by JECFA, but it applies to people with gout and large intakes. We found no evidence of wider harm.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of ribonucleotides (E 626-635) as food additives",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-ribonucleotides-e-626-635-food-additives"
   },
   {
    "text": "JECFA. Disodium 5'-ribonucleotides: safety monograph (WHO Food Additives Series 6)",
    "url": "https://inchem.org/documents/jecfa/jecmono/v06je05.htm"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e635",
  "code": "E635",
  "name": "Disodium 5'-ribonucleotides",
  "also": "Mixture of E 627 and E 631",
  "kind": "Flavour enhancer",
  "found": "Instant noodles, crisps, stock cubes and sauces.",
  "level": "little",
  "evidence": "Weak",
  "summary": "JECFA found no need to limit these nucleotide flavour enhancers, but EFSA has not finished its modern re-evaluation. They are usually used with glutamate and add purines.",
  "research": [
   "JECFA, the joint FAO/WHO expert committee, gave the ribonucleotides an ADI of 'not specified', which means low safety concern at normal use. That assessment dates from the 1970s to 1990s.",
   "EFSA opened a call for data to re-evaluate ribonucleotides E 626 to 635 and, as far as we could find, has not yet published its opinion. So there is no up-to-date EU safety conclusion or exposure estimate to cite.",
   "These compounds are part of normal purine metabolism. The JECFA monograph notes that large amounts can raise blood uric acid in people, which matters for those with gout.",
   "We found no recent human trials or cohort studies on them as additives."
  ],
  "careIf": "People with gout or high uric acid: the JECFA monograph says large intakes can raise uric acid. Some official labelling in other countries also warns them off.",
  "regulation": "Authorised in the EU and the US (FDA lists them as permitted flavour enhancers). EFSA re-evaluation of E 626 to 635 is still pending.",
  "topics": [
   "Uric acid and gout (regulator note)"
  ],
  "contested": "Consumer databases that rate these as higher risk usually point to purines and gout. That is a real mechanism, noted by JECFA, but it applies to people with gout and large intakes. We found no evidence of wider harm.",
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of ribonucleotides (E 626-635) as food additives",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-ribonucleotides-e-626-635-food-additives"
   },
   {
    "text": "JECFA. Disodium 5'-ribonucleotides: safety monograph (WHO Food Additives Series 6)",
    "url": "https://inchem.org/documents/jecfa/jecmono/v06je05.htm"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e640",
  "code": "E640",
  "name": "Glycine and its sodium salt",
  "kind": "Flavour modifier",
  "found": "Seasonings, sweeteners and some meat or savoury products.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Glycine is a common amino acid found in protein. We could not find a modern EFSA re-evaluation, so the safety picture rests on old assessments.",
  "research": [
   "Glycine is one of the building blocks of protein and is made by the body. At food levels it is part of normal diet.",
   "We could not find a published EFSA re-evaluation of E 640 or a recent JECFA conclusion through the sources we could reach, so We cannot cite exposure estimates or an ADI.",
   "We found no recent human trials or cohort studies on glycine used as an additive."
  ],
  "regulation": "Listed in EU additive rules as glycine and its sodium salt (E 640). Check the current Union list for conditions of use. In the US glycine is GRAS.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "Commission Regulation (EU) 2015/649 (amending EU additive specifications; lists E 640)",
    "url": "https://www.legislation.gov.uk/eur/2015/649/data.html"
   },
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   }
  ]
 },
 {
  "id": "e900",
  "code": "E900",
  "name": "Dimethyl polysiloxane",
  "also": "Silicone anti-foam, PDMS",
  "kind": "Anti-foaming agent",
  "found": "Frying oils, jams, soft drinks and sauces, to stop foaming.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA re-evaluated it in 2020 and set a safe daily intake with estimated exposure well below it.",
  "research": [
   "EFSA's 2020 opinion found no body-wide effects at any tested dose and no DNA damage concern. Eye effects seen in rats were put down to direct contact with the test material, not absorption.",
   "EFSA set an ADI of 17 mg per kg of body weight per day, from a rat study (no-effect dose 1,742 mg per kg per day with a 100-fold safety factor). This replaced an older, lower ADI of 1.5 mg per kg.",
   "Estimated intake for all age groups was below the new ADI. EFSA recommended tighter specifications."
  ],
  "regulation": "Authorised in the EU for a limited list of foods. Silicone anti-foam is also permitted in the US within set limits.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of dimethyl polysiloxane (E 900) as a food additive. EFSA Journal, 2020",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/6107"
   }
  ]
 },
 {
  "id": "e901",
  "code": "E901",
  "name": "Beeswax",
  "also": "White and yellow beeswax",
  "kind": "Glazing agent",
  "found": "Sweets, fruit coatings and some supplements.",
  "level": "little",
  "evidence": "None",
  "summary": "A natural wax made by bees. EFSA confirmed its safety in 2007 and JECFA found no concern at expected intake.",
  "research": [
   "EFSA's food-additive panel gave an opinion in 2007 confirming safety of beeswax as a glaze and flavour carrier, and asked for the lead limit in the specification to be lowered. The EU then lowered the lead limit.",
   "JECFA's last review (2005) found no safety concern at the expected intake.",
   "It is an animal product, so it is not vegan. Rare contact allergy to bee products exists but is not a food-safety finding from these assessments."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA AFC Panel. Beeswax (E 901) as a glazing agent and as carrier for flavours. EFSA Journal, 2007",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/615"
   },
   {
    "text": "JECFA. Beeswax evaluation (INCHEM)",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_173.htm"
   }
  ]
 },
 {
  "id": "e903",
  "code": "E903",
  "name": "Carnauba wax",
  "kind": "Glazing agent",
  "found": "Sweets, chewing gum, coated fruit and supplements.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A plant wax from palm leaves. EFSA found no safety concern at current use in 2012, though long-term studies are missing.",
  "research": [
   "EFSA's 2012 re-evaluation concluded that current authorised uses would not be a safety concern. It found no DNA damage concern.",
   "EFSA did not set an ADI because there were no long-term feeding or cancer studies. The conclusion rests on large margins between estimated intake and doses without effect in shorter studies. JECFA had earlier set an ADI of 7 mg per kg of body weight.",
   "Both of these are data gaps rather than found problems."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific Opinion on the re-evaluation of carnauba wax (E 903) as a food additive. EFSA Journal, 2012",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/2880"
   }
  ]
 },
 {
  "id": "e904",
  "code": "E904",
  "name": "Shellac",
  "kind": "Glazing agent",
  "found": "Sweets, chewing gum, coated tablets, glazed fruit and confectioner's glaze.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A resin made by lac insects, so it is not vegetarian or vegan. EFSA set a safe daily intake in 2024, with a temporary limit for bleached types because of unknown impurities.",
  "research": [
   "EFSA's 2024 re-evaluation set an ADI of 4 mg per kg of body weight per day for wax-free shellac made by physical decolouring. For chemically bleached shellac the ADI is temporary, until data on organochlorine impurities are provided. It does not cover shellac that contains wax.",
   "Estimated intake was above the ADI at the 95th percentile for some age groups, but EFSA judged this would not indicate a safety concern because the estimates were conservative. These are estimates.",
   "We found no human trials on shellac as a food additive."
  ],
  "regulation": "Authorised in the EU (with tightened specifications following the 2024 opinion) and in the US, where shellac and confectioner's glaze are permitted.",
  "topics": [
   "Impurities in bleached shellac (data gap)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of shellac (E 904) as a food additive and a new application on the extension of use in dietary foods for special medical purposes. EFSA Journal, 2024",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/8897"
   },
   {
    "text": "Same opinion, open-access text (PMC)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11292212"
   }
  ]
 },
 {
  "id": "e920",
  "code": "E920",
  "name": "L-cysteine",
  "kind": "Flour treatment agent (dough softener)",
  "found": "Bread, pizza bases, biscuits and some baked goods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "An amino acid used to soften dough. We could not find a modern EFSA re-evaluation, so the evidence is thin rather than clear.",
  "research": [
   "L-cysteine is a normal amino acid in protein. In bread it works in the dough and is used in small amounts.",
   "EFSA's panel dealt with a use in biscuits in the mid-2000s, and We could not retrieve a full modern re-evaluation. We found no human trials on E 920 as an additive.",
   "Origin varies. It has traditionally been made from keratin such as feathers or hair, or by fermentation or synthesis. UK flour millers state that the E 920 they use comes from synthetic sources. Check the maker if origin matters to you."
  ],
  "regulation": "Authorised in the EU for specified foods (notably flour and bread) and in the US as a dough conditioner.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "Estonian Agriculture and Food Board. Additives authorised in flours (lists L-cysteine E 920)",
    "url": "https://www.agri.ee/sites/default/files/documents/2021-09/paff-otsus-2016-pagaritooted.pdf"
   }
  ]
 },
 {
  "id": "e924",
  "code": "E924",
  "name": "Potassium bromate",
  "highRisk": true,
  "kind": "Flour improver (dough strengthener)",
  "found": "Some US breads, rolls and bakery flour. Not allowed in the EU.",
  "level": "restricted",
  "evidence": "Moderate",
  "summary": "IARC classes potassium bromate as possibly cancer-causing to humans (Group 2B) based on kidney and thyroid tumours in rats. It is banned in the EU and several other countries, but not banned federally in the US.",
  "research": [
   "IARC reviewed potassium bromate in 1999 (Monographs Volume 73) and classed it Group 2B, 'possibly carcinogenic to humans'. This is based on animal studies, mainly kidney and thyroid tumours in rats. There is no good human study of bread-level intake.",
   "Baking is meant to turn bromate into harmless bromide, but small residues can remain, especially if the product is under-baked or too much was used.",
   "The EU does not allow it as a food additive. The FDA has since 1991 encouraged bakers to stop using it voluntarily, but has not banned it nationally. California passed a law in 2023 that bans it in food from 2027."
  ],
  "regulation": "Not authorised in the EU, Canada, Brazil, and other countries. Still legal in much of the US, with California's ban applying from 2027. If it is on a label, the product is likely a US-style bakery item.",
  "topics": [
   "Possible carcinogen in animals (IARC 2B)"
  ],
  "contested": "CSPI lists potassium bromate as an additive to avoid. That is in line with IARC and the EU ban: the concern is real for the substance, but the human evidence at bread levels is absent, so the evidence is rated moderate and not strong. Where views differ: Rated high risk: classified by IARC as possibly carcinogenic (Group 2B), a genotoxic carcinogen with no safe threshold, and not allowed in food in the EU. Primary sources were not re-checked in this review.",
  "sources": [
   {
    "text": "CSPI. Food additives: the definitive glossary (Chemical Cuisine)",
    "url": "https://www.cspinet.org/article/food-additives"
   },
   {
    "text": "Yuka. What is the problem with food additives in the US? 2025",
    "url": "https://yuka.io/en/problem-food-additives-us/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e927b",
  "code": "E927b",
  "name": "Carbamide",
  "also": "Urea",
  "kind": "Chewing gum additive (texture)",
  "found": "Sugar-free chewing gum.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Urea is a normal body waste product. In the EU it is allowed only in sugar-free chewing gum. We could not find a modern EFSA re-evaluation.",
  "research": [
   "Urea is found naturally in the body. JECFA evaluated its use in chewing gum and found no safety concern at up to 3 percent of the gum.",
   "EFSA has reviewed a health claim for carbamide gum and plaque acid, which is a different question from additive safety.",
   "We could not retrieve the current EU rules on levels or an EFSA re-evaluation, so the entry is based on older assessments."
  ],
  "regulation": "Authorised in the EU only for sugar-free chewing gum, according to consumer-group summaries. Check the EU Union list for exact limits.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "JECFA/FAO. Urea (Additive 485) specifications monograph",
    "url": "https://fao.org/fileadmin/user_upload/jecfa_additives/docs/Monograph1/Additive-485.pdf"
   }
  ]
 },
 {
  "id": "e941",
  "code": "E941",
  "name": "Nitrogen",
  "kind": "Packaging gas",
  "found": "Packaged snacks, salads, wine, coffee, whipped products",
  "level": "little",
  "evidence": "None",
  "summary": "Nitrogen is the main gas in air and is used to keep food fresh. We found no safety concern.",
  "research": [
   "Nitrogen is inert. EFSA included it in a call for data on gaseous additives, and published an opinion on argon and helium in 2024 concluding no safety concern because of their physical properties. We could not confirm that a nitrogen opinion has been published.",
   "In the US nitrogen is listed in the GRAS regulations (21 CFR 184.1540)."
  ],
  "regulation": "Authorised in the EU; re-evaluation pending when we searched.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA. Call for data for the re-evaluation of food additives in gaseous form",
    "url": "https://www.efsa.europa.eu/en/call/call-data-re-evaluation-food-additives-gaseous-form"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of argon (E 938) and helium (E 939) as food additives. EFSA Journal, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11515913/"
   },
   {
    "text": "US eCFR. 21 CFR Part 184 Subpart B, GRAS substances (includes 184.1540 nitrogen)",
    "url": "https://www.law.cornell.edu/cfr/text/21/part-184/subpart-B"
   }
  ]
 },
 {
  "id": "e943a",
  "code": "E943a",
  "name": "Butane",
  "kind": "Propellant gas",
  "found": "Cooking oil sprays and some food colour preparations (trace residue).",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2025 re-evaluation found no safety concern at current uses. The only caveat is unclear impurity data.",
  "research": [
   "EFSA's 2025 opinion covered butane, isobutane and propane together. It found that the reported uses and use levels do not raise a safety concern.",
   "The known harms of these gases come from breathing them in. EFSA did not consider that relevant to their use as food additives.",
   "EFSA noted uncertainty over impurities not on the specification, because manufacturing is poorly documented, and recommended amending the specifications. In the EU they are allowed in oil sprays and at a residue of 1 mg/kg in food colours."
  ],
  "regulation": "Authorised in the EU for vegetable oil sprays and food colour preparations. Used as propellants in US cooking sprays within FDA rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of butane (E 943a), isobutane (E 943b) and propane (E 944) as food additives. EFSA Journal, 2025",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11783170/"
   }
  ]
 },
 {
  "id": "e943b",
  "code": "E943b",
  "name": "Isobutane",
  "kind": "Propellant gas",
  "found": "Cooking oil sprays and some food colour preparations (trace residue).",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2025 re-evaluation found no safety concern at current uses. The only caveat is unclear impurity data.",
  "research": [
   "EFSA's 2025 opinion covered butane, isobutane and propane together. It found that the reported uses and use levels do not raise a safety concern.",
   "The known harms of these gases come from breathing them in. EFSA did not consider that relevant to their use as food additives.",
   "EFSA noted uncertainty over impurities not on the specification, because manufacturing is poorly documented, and recommended amending the specifications. In the EU they are allowed in oil sprays and at a residue of 1 mg/kg in food colours."
  ],
  "regulation": "Authorised in the EU for vegetable oil sprays and food colour preparations. Used as propellants in US cooking sprays within FDA rules.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of butane (E 943a), isobutane (E 943b) and propane (E 944) as food additives. EFSA Journal, 2025",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11783170/"
   }
  ]
 },
 {
  "id": "e948",
  "code": "E948",
  "name": "Oxygen",
  "kind": "Packaging gas",
  "found": "Packaged foods (modified atmosphere) and whipped products.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2025 re-evaluation found no safety concern and very low dietary exposure.",
  "research": [
   "EFSA's 2025 opinion judged both oxygen and hydrogen to be of low safety concern, with very low exposure through food.",
   "No industry data were submitted, and the earlier 1990 EU evaluation had mostly covered use as packaging gases. EFSA recommended specification changes."
  ],
  "regulation": "Authorised in the EU and the US (GRAS) as packaging gases.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of oxygen (E 948) and hydrogen (E 949) as food additives. EFSA Journal, 2025",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12329423/"
   }
  ]
 },
 {
  "id": "e949",
  "code": "E949",
  "name": "Hydrogen",
  "kind": "Packaging gas",
  "found": "Packaging gas and carbonated drinks in some markets.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2025 re-evaluation found no safety concern and very low dietary exposure.",
  "research": [
   "EFSA's 2025 opinion judged both oxygen and hydrogen to be of low safety concern, with very low exposure through food.",
   "No industry data were submitted, and the earlier 1990 EU evaluation had mostly covered use as packaging gases. EFSA recommended specification changes."
  ],
  "regulation": "Authorised in the EU and the US (GRAS) as packaging gases.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of oxygen (E 948) and hydrogen (E 949) as food additives. EFSA Journal, 2025",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12329423/"
   }
  ]
 },
 {
  "id": "e950",
  "code": "E950",
  "name": "Acesulfame K",
  "highRisk": true,
  "also": "Acesulfame potassium, Ace-K",
  "kind": "Sweetener",
  "found": "Diet and zero-sugar drinks, sugar-free sweets and gum, protein products and tabletop sweeteners, often blended with aspartame.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA raised its safe daily limit in 2025 and found no safety concern. One large French cohort linked higher intake to slightly more cancer, which does not prove cause.",
  "research": [
   "EFSA re-evaluated acesulfame K in 2025 and set an acceptable daily intake of 15 mg per kg of body weight, replacing the 9 mg per kg set in 2000. It found no safety concern at current uses.",
   "In the 2022 NutriNet-Santé cohort (102,865 French adults, median follow-up about 8 years), higher intake of acesulfame K was linked to a modestly higher cancer risk (hazard ratio about 1.13). It is an observational study, so it cannot show cause, and diet and lifestyle differences may play a part.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe.",
   "The 2025 EFSA opinion considered studies up to late 2024. No trial has tested whether acesulfame K itself raises cancer risk in people."
  ],
  "regulation": "Authorised in the EU (E 950) and approved by the US FDA. JECFA ADI is 0 to 15 mg per kg (1991).",
  "topics": [
   "Cancer risk (one observational cohort)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "CSPI rates acesulfame potassium as \"avoid\", citing rat cancer tests from the 1970s that it calls poor quality and urging better testing. EFSA reviewed the data again in 2025 and raised the limit. The French cohort is a newer signal but is a single observational study, so we keep this at a mild concern. Where views differ: Rated high risk to match Yuka, which cites NutriNet-Santé cohort findings on sweeteners and chronic disease at small amounts. EFSA is still re-evaluating it, and current intakes are below the regulatory daily limit.",
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of acesulfame K (E 950) as a food additive. EFSA Journal, 2025",
    "url": "https://www.efsa.europa.eu/en/node/19722"
   },
   {
    "text": "Debras C et al. Artificial sweeteners and cancer risk: results from the NutriNet-Santé cohort. PLOS Medicine, 2022",
    "url": "https://doi.org/10.1371/journal.pmed.1003950"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   },
   {
    "text": "CSPI. Chemical Cuisine: acesulfame potassium",
    "url": "https://www.cspi.org/chemical-cuisine/acesulfame-potassium"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e951",
  "code": "E951",
  "name": "Aspartame",
  "highRisk": true,
  "kind": "Sweetener",
  "found": "Diet and zero-sugar drinks, sugar-free gum, light yoghurts and tabletop sweeteners.",
  "level": "some",
  "evidence": "Weak",
  "summary": "IARC classed it as possibly carcinogenic in 2023 on limited evidence, while JECFA and EFSA kept the safe daily limit at 40 mg per kg.",
  "research": [
   "In July 2023 IARC placed aspartame in Group 2B, possibly carcinogenic to humans, citing limited evidence for a type of liver cancer in humans, plus limited animal and mechanism evidence. Group 2B describes how strong the evidence is, not how large the risk is.",
   "The same day, the WHO/FAO expert committee JECFA reviewed the risk and kept the acceptable daily intake at 40 mg per kg of body weight. For a 70 kg adult, going over that would take roughly 9 to 14 cans of diet drink a day, an estimate that assumes no other aspartame sources. EFSA also confirmed 40 mg per kg in 2013 and again in its later full assessment.",
   "In the 2022 NutriNet-Santé cohort, higher aspartame intake was linked to a modestly higher cancer risk (hazard ratio about 1.15). It is observational, so it cannot show cause.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "careIf": "People with phenylketonuria (PKU) must avoid it. EU and US labels say it contains a source of phenylalanine.",
  "regulation": "Authorised in the EU (E 951) and approved by the US FDA. JECFA and EFSA ADI is 0 to 40 mg per kg of body weight.",
  "topics": [
   "Cancer (IARC possible, limited evidence)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "CSPI advises avoiding aspartame. Regulators hold that intake within the limit is acceptable. The two views differ on how to weigh limited, mixed evidence; the IARC finding supports a caution, not a ban. Where views differ: Rated high risk to match Yuka, which weighs the large French NutriNet-Santé cohort linking aspartame to cancer and heart disease, and IARC's 2023 'possibly carcinogenic' (Group 2B) classification. JECFA kept the daily limit at 40 mg/kg in 2023 and found no cancer concern at that level, and typical intakes are well below it.",
  "sources": [
   {
    "text": "IARC/WHO. Aspartame hazard and risk assessment results released by IARC and JECFA (press release). 2023",
    "url": "https://www.iarc.who.int/wp-content/uploads/2023/07/Aspartame_PR.pdf"
   },
   {
    "text": "IARC/JECFA. Summary of findings: aspartame. WHO, 2023",
    "url": "https://www.iarc.who.int/wp-content/uploads/2023/07/Summary_of_findings_Aspartame.pdf"
   },
   {
    "text": "EFSA. Aspartame topic page (2013 opinion and 2020 reaffirmation of the ADI)",
    "url": "https://efsa.europa.eu/en/topics/topic/aspartame"
   },
   {
    "text": "Debras C et al. Artificial sweeteners and cancer risk: results from the NutriNet-Santé cohort. PLOS Medicine, 2022",
    "url": "https://doi.org/10.1371/journal.pmed.1003950"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e952",
  "code": "E952",
  "name": "Cyclamic acid",
  "also": "Cyclamate, sodium cyclamate",
  "kind": "Sweetener",
  "found": "Tabletop sweeteners, diet drinks and sweets in the EU, Canada and many other countries. Not sold in US food.",
  "level": "restricted",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "Banned in US food since 1969-70 after rat studies raised a cancer concern that later work did not firmly confirm. It is still allowed in the EU, where EFSA's re-evaluation is pending.",
  "research": [
   "The US FDA banned cyclamate in 1969-70 after rat studies suggested a link to bladder cancer. Later reviews found the animal evidence weak and the human evidence unconvincing, but it has not been re-approved for food in the US.",
   "The EU Scientific Committee on Food set an acceptable daily intake of 7 mg per kg of body weight (as cyclamic acid) in 2000, lower than JECFA's earlier 11 mg per kg. EFSA's modern re-evaluation of cyclamates is still listed as in progress.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe.",
   "The concern now rests on old animal data. We found no recent cohort result for cyclamate alone."
  ],
  "regulation": "Authorised in the EU (E 952) with maximum use levels. Not permitted in food in the US. Rules differ by country.",
  "topics": [
   "Cancer (old rat studies, not confirmed)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "The restricted level here reflects the US ban, not a current finding of harm. Consumer apps may rate it high for the same reason. The EU still allows it at set limits.",
  "sources": [
   {
    "text": "Scientific Committee on Food. Opinion on cyclamic acid and its sodium and calcium salts. European Commission, 2000",
    "url": "https://food.ec.europa.eu/system/files/2020-12/sci-com_scf_out53_en.pdf"
   },
   {
    "text": "EFSA. Update on the re-evaluation of sweeteners (Annex II, FAF plenary). July 2026",
    "url": "https://www.efsa.europa.eu/sites/default/files/2026-07/Annex%20II_10.1%20Update%20on%20the%20re-evaluation%20of%20sweeteners_%201-2%20July%202026.pdf"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e953",
  "code": "E953",
  "name": "Isomalt",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free hard sweets, lozenges, chewing gum and chocolate.",
  "level": "little",
  "evidence": "Weak",
  "summary": "No safety concern at normal use, but high intake can cause gas and loose stools.",
  "research": [
   "Isomalt is a sugar alcohol made from sucrose. It is poorly absorbed and the main effect of high intake is laxative.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects.",
   "Older EU and JECFA assessments set no numerical limit. We found no recent study linking it to serious harm. It is not among the sweeteners in the evidence reviewed for the WHO 2023 advice, which covers non-sugar sweeteners but not polyols."
  ],
  "careIf": "People with irritable bowel syndrome or sensitive digestion.",
  "regulation": "Authorised in the EU (E 953) and the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Digestive upset at high intake (well documented)"
  ],
  "contested": "Consumer apps sometimes treat polyols as clear. Regulators agree that they raise no safety concern at normal use, but the laxative effect is real and dose-related, so we show it as a minor note.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   },
   {
    "text": "EFSA. Call for data on sweeteners authorised as food additives (polyols included)",
    "url": "https://www.efsa.europa.eu/sites/default/files/engage/170621.pdf"
   }
  ]
 },
 {
  "id": "e954",
  "code": "E954",
  "name": "Saccharin",
  "also": "Sodium saccharin",
  "kind": "Sweetener",
  "found": "Tabletop sweeteners, diet drinks, sugar-free sweets and some medicines.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA raised the safe daily limit in 2024. Old rat bladder tumours are not thought to apply to people, but a small trial found effects on blood sugar.",
  "research": [
   "EFSA re-evaluated saccharin in 2024 and set an acceptable daily intake of 9 mg per kg (as free imide), replacing the older 5 mg per kg. It found no safety concern, for saccharin made by the Remsen-Fahlberg process.",
   "Rat bladder tumours led to a US warning label in the 1970s. The US National Tox. Program (NTP) removed saccharin from its cancer list in 2000, because the effect is specific to rat urine and not seen consistently in people.",
   "A 2022 randomised trial in Cell (120 healthy adults, about 20 per sweetener) found that saccharin and sucralose changed blood-sugar response over two weeks and shifted gut bacteria. The arms were small and other trials disagree.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "regulation": "Authorised in the EU (E 954) and the US. The US warning label was repealed.",
  "topics": [
   "Blood sugar response (small trial)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "CSPI advises avoiding saccharin, based on the older animal data. Regulators accepted the rat finding as not relevant to people. We rate it minor because of the small trial and the missing long-term human data.",
  "sources": [
   {
    "text": "EFSA. Saccharin: safety threshold increased. 2024",
    "url": "https://www.efsa.europa.eu/bg/news/saccharin-safety-threshold-increased"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of saccharin and its sodium, potassium and calcium salts (E 954). EFSA Journal, 2024",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11565076/"
   },
   {
    "text": "CSPI. Chemical Cuisine: saccharin",
    "url": "https://www.cspinet.org/node/7431"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e955",
  "code": "E955",
  "name": "Sucralose",
  "highRisk": true,
  "kind": "Sweetener",
  "found": "Diet and zero-sugar drinks, sugar-free sweets, protein products and tabletop sweeteners.",
  "level": "some",
  "evidence": "Weak",
  "summary": "EFSA confirmed its safe daily limit in 2026. A related by-product damaged DNA in lab tests, and a small trial found blood-sugar effects, but neither is settled.",
  "research": [
   "EFSA reconfirmed the 15 mg per kg acceptable daily intake in 2026 and found no DNA-damage concern for sucralose, its impurities and its breakdown products. It did not support extending use to sugar-free baked goods, and it said chlorinated compounds could form when sucralose is heated at home. Germany's BfR advises against heating it to baking or frying temperatures.",
   "A 2023 lab study (Schiffman et al.) found that sucralose-6-acetate, a manufacturing by-product that can also form in the gut, damaged DNA in cell tests, and that it weakened the gut-lining junctions of tissue samples. The authors argued that traces in one daily drink could exceed the EU threshold for DNA-damaging substances. This was in lab cells only; EFSA's 2026 review did not find a concern.",
   "A 2022 randomised trial in Cell (about 20 people per sweetener) found sucralose changed blood-sugar response over two weeks; other trials found no effect. Evidence on gut bacteria is mixed.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "regulation": "Authorised in the EU (E 955) and approved by the US FDA. ADI is 15 mg per kg of body weight.",
  "topics": [
   "DNA damage by a by-product (lab cells only)",
   "Blood sugar response (small, mixed trials)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "CSPI moved sucralose to \"avoid\" in 2016 after a Ramazzini Institute mouse study reporting blood cancers; EFSA said the data did not support that conclusion. Both views are shown. The lab by-product finding is why we keep a minor concern rather than a clear rating. Where views differ: Rated high risk to match Yuka, which cites NutriNet-Santé cohort findings and a human trial of gut and blood-sugar effects. EFSA's 2026 re-evaluation found no genotoxicity concern and kept the daily limit; Germany's BfR warns about heating it above 120 °C.",
  "sources": [
   {
    "text": "EFSA. Re-evaluation of sucralose (E 955) as a food additive: plain-language summary. 2026",
    "url": "https://www.efsa.europa.eu/cs/plain-language-summary/re-evaluation-sucralose-e-955-food-additive"
   },
   {
    "text": "Schiffman SS et al. Properties of sucralose-6-acetate and its parent sucralose: in vitro screening assays. J Tox Environ Health B, 2023",
    "url": "https://doi.org/10.1080/10937404.2023.2213903"
   },
   {
    "text": "CSPI. Consumers should still avoid sucralose pending more testing. 2017",
    "url": "https://www.cspi.org/news/consumers-should-still-avoid-sucralose-pending-more-testing-20170509"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   },
   {
    "text": "Yuka and Consumer Reports. Investigation of additives in 40 popular US products (Red 40, titanium dioxide, aspartame, acesulfame-K, sucralose, BHA, BHT, sodium nitrite), 2026",
    "url": "https://yuka.io/en/tests-additives-food-products/"
   },
   {
    "text": "Yuka. How is the classification of food additives established?",
    "url": "https://help.yuka.io/l/en/article/uell2r13f8-classification-food-additives"
   }
  ]
 },
 {
  "id": "e957",
  "code": "E957",
  "name": "Thaumatin",
  "kind": "Sweetener, flavour enhancer",
  "found": "Chewing gum, sweets and some drinks, in small amounts.",
  "level": "little",
  "evidence": "None",
  "summary": "A sweet protein from a West African fruit. EFSA found no safety concern and needs no daily limit.",
  "research": [
   "EFSA re-evaluated thaumatin in 2021 and concluded that no numerical acceptable daily intake is needed, because exposure at the maximum permitted levels raised no concern.",
   "It is a protein and is digested like other dietary proteins. We found no credible human signal of harm."
  ],
  "regulation": "Authorised in the EU (E 957). In the US it has GRAS status.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of thaumatin (E 957) as a food additive. EFSA Journal, 2021",
    "url": "https://doaj.org/article/60f4cb5f019a46a69ee5c457faf7216b"
   }
  ]
 },
 {
  "id": "e959",
  "code": "E959",
  "name": "Neohesperidine DC",
  "also": "Neohesperidine dihydrochalcone, NHDC",
  "kind": "Sweetener, flavour enhancer",
  "found": "Some diet drinks, chewing gum, sweets and as a bitter-taste masker.",
  "level": "little",
  "evidence": "None",
  "summary": "Made from citrus compounds. EFSA set a limit of 20 mg per kg in 2022 and found exposure well under it.",
  "research": [
   "EFSA re-evaluated neohesperidine DC in 2022 and set an acceptable daily intake of 20 mg per kg of body weight. Exposure in all age groups was below it, and EFSA found no DNA-damage concern.",
   "We found no credible human studies suggesting harm."
  ],
  "regulation": "Authorised in the EU (E 959). Not approved as a sweetener by the US FDA.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of neohesperidine dihydrochalcone (E 959) as a food additive. EFSA Journal, 2022",
    "url": "https://opinvisindi.is/items/f953a620-9ba5-4e0e-8ac6-a973feaffd03/full"
   }
  ]
 },
 {
  "id": "e960",
  "code": "E960",
  "name": "Steviol glycosides",
  "also": "Stevia",
  "kind": "Sweetener",
  "found": "Zero-sugar drinks, yoghurts, sweets, tabletop sweeteners and some baked goods.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily limit of 4 mg per kg (as steviol). Some lab signals have not been confirmed in people.",
  "research": [
   "EFSA first set an acceptable daily intake of 4 mg per kg of body weight, as steviol equivalents, in 2010, matching JECFA. Later opinions (2015, 2020) extended it to rebaudioside M and other steviol glycosides, which share the same metabolism in the gut.",
   "In 2010 EFSA noted that the limit could be exceeded by adults and children if stevia were used at the maximum levels first requested.",
   "In lab tests, the breakdown product steviol has shown DNA-damage signals at high concentrations, and animal and cell studies have reported changes in gut bacteria. These effects have not been shown in people at normal intakes, and regulators did not consider them relevant in vivo.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "regulation": "Authorised in the EU (E 960) since 2011, and used in the US as GRAS high-purity extracts. Whole stevia leaf is not approved as a food additive in the US.",
  "topics": [
   "Gut bacteria (animal and cell studies)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "Natural marketing makes stevia seem free of questions. Regulators treat it as safe within the limit; the lab signals above remain unconfirmed. CSPI generally rates stevia extracts as safe or low concern.",
  "sources": [
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e961",
  "code": "E961",
  "name": "Neotame",
  "kind": "Sweetener",
  "found": "Some drinks, sweets, chewing gum and tabletop sweeteners. Rarely used.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA raised its safe daily limit to 10 mg per kg in 2025. There are very few human studies.",
  "research": [
   "EFSA re-evaluated neotame in 2025 and set an acceptable daily intake of 10 mg per kg of body weight, replacing 2 mg per kg set in 2007. Exposure did not exceed it, and the methanol released was not a concern.",
   "Neotame is made from aspartame and is far sweeter, so tiny amounts are used. We found few human studies, so the main basis for its safety is animal testing.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "regulation": "Authorised in the EU (E 961) and approved by the US FDA.",
  "topics": [
   "Limited human data",
   "Weight control (WHO 2023 advice)"
  ],
  "sources": [
   {
    "text": "EFSA. Update on the re-evaluation of sweeteners (Annex II, FAF plenary). July 2026",
    "url": "https://www.efsa.europa.eu/sites/default/files/2026-07/Annex%20II_10.1%20Update%20on%20the%20re-evaluation%20of%20sweeteners_%201-2%20July%202026.pdf"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e962",
  "code": "E962",
  "name": "Salt of aspartame-acesulfame",
  "kind": "Sweetener",
  "found": "Sugar-free gum, drinks and sweets.",
  "level": "some",
  "evidence": "Weak",
  "summary": "A compound of aspartame and acesulfame K. EFSA found no safety concern in 2026, but the concerns of both parts apply.",
  "research": [
   "EFSA concluded in July 2026 that E 962 is safe at current exposure levels, relying on the ADI of its two parts (40 mg per kg for aspartame, 15 mg per kg for acesulfame K). Exposure for all age groups is below these limits.",
   "In the body it is expected to separate into aspartame and acesulfame K, so the evidence for those two applies. IARC rated aspartame possibly carcinogenic in 2023 on limited evidence, and a 2022 French cohort linked both sweeteners to a modestly higher cancer risk. These are observational findings.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "careIf": "People with phenylketonuria (PKU) must avoid it.",
  "regulation": "Authorised in the EU (E 962).",
  "topics": [
   "Cancer (IARC possible for aspartame, limited evidence)",
   "Weight control (WHO 2023 advice)"
  ],
  "contested": "CSPI advises avoiding both aspartame and acesulfame potassium. Regulators accept both within their limits.",
  "sources": [
   {
    "text": "EFSA. EFSA concludes the salt of aspartame-acesulfame (E 962) is safe at current exposure levels. 2026",
    "url": "https://www.efsa.europa.eu/en/news/efsa-concludes-salt-aspartame-acesulfame-e-962-safe-current-exposure-levels"
   },
   {
    "text": "IARC/WHO. Aspartame hazard and risk assessment results released by IARC and JECFA (press release). 2023",
    "url": "https://www.iarc.who.int/wp-content/uploads/2023/07/Aspartame_PR.pdf"
   },
   {
    "text": "Debras C et al. Artificial sweeteners and cancer risk: results from the NutriNet-Santé cohort. PLOS Medicine, 2022",
    "url": "https://doi.org/10.1371/journal.pmed.1003950"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e965",
  "code": "E965",
  "name": "Maltitol",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free chocolate, sweets, baked goods and ice cream.",
  "level": "little",
  "evidence": "Weak",
  "summary": "No safety concern at normal use, but it is a common cause of gas and loose stools. EFSA is re-evaluating it.",
  "research": [
   "Maltitol is a sugar alcohol made from maltose. It is partly absorbed, and it still raises blood sugar a little, unlike erythritol.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects.",
   "Older EU and JECFA assessments set no numerical limit. An EFSA data call lists maltitol for re-evaluation. We found no recent studies linking it to serious harm."
  ],
  "careIf": "People with irritable bowel syndrome or sensitive digestion.",
  "regulation": "Authorised in the EU (E 965) and the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Digestive upset at high intake (well documented)"
  ],
  "contested": "Consumer apps sometimes treat polyols as clear. Regulators agree that they raise no safety concern at normal use, but the laxative effect is real and dose-related, so we show it as a minor note.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   },
   {
    "text": "EFSA. Call for data on sweeteners authorised as food additives (polyols included)",
    "url": "https://www.efsa.europa.eu/sites/default/files/engage/170621.pdf"
   }
  ]
 },
 {
  "id": "e966",
  "code": "E966",
  "name": "Lactitol",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free chocolate, ice cream, sweets and some medicines.",
  "level": "little",
  "evidence": "Weak",
  "summary": "No safety concern at normal use, but it is used as a medicine for constipation, so high intake loosens stools.",
  "research": [
   "Lactitol is a sugar alcohol made from milk sugar. It is also sold as a laxative, so it has a stronger effect on the bowel than many other polyols.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects.",
   "An EFSA data call lists lactitol for re-evaluation. We found no recent studies linking it to serious harm."
  ],
  "careIf": "People with irritable bowel syndrome or sensitive digestion.",
  "regulation": "Authorised in the EU (E 966) and the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Digestive upset at high intake (well documented)"
  ],
  "contested": "Consumer apps sometimes treat polyols as clear. Regulators agree that they raise no safety concern at normal use, but the laxative effect is real and dose-related, so we show it as a minor note.",
  "sources": [
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   },
   {
    "text": "EFSA. Call for data on sweeteners authorised as food additives (polyols included)",
    "url": "https://www.efsa.europa.eu/sites/default/files/engage/170621.pdf"
   }
  ]
 },
 {
  "id": "e967",
  "code": "E967",
  "name": "Xylitol",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free gum, mints, toothpaste, sweets and some baked goods.",
  "level": "some",
  "evidence": "Weak",
  "summary": "A 2024 study linked higher blood xylitol to more heart events, which shows a link only. It is also harmful to dogs.",
  "research": [
   "In a 2024 European Heart Journal study, people with higher blood xylitol had more heart attacks, strokes or deaths over three years (about 1.6 times in the top third vs the bottom third). The same paper reported more platelet clotting activity in lab tests and in a small test drink. It is observational, in people already having cardiac evaluation, so it does not show cause.",
   "Commentators noted that blood levels can reflect the body's own production and that the study could not show it is the sweetener itself. EFSA is currently re-evaluating xylitol.",
   "Xylitol is very harmful to dogs: even small amounts can cause a dangerous drop in blood sugar and liver damage. Keep products with xylitol away from pets.",
   "Polyols are only partly absorbed, so large amounts can reach the large intestine and cause gas, bloating or loose stools. In the EU, foods with more than 10% added polyols must say that excessive consumption may have laxative effects."
  ],
  "careIf": "Households with dogs. People with heart disease or high heart risk may want to ask their clinician.",
  "regulation": "Authorised in the EU (E 967) and the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Heart events (one observational study, 2024)",
   "Digestive upset at high intake (well documented)",
   "Harmful to dogs"
  ],
  "contested": "Consumer apps often rate xylitol as clear because regulators set no limit. The 2024 study is a real signal but is a single study with a small blood sample, and the link may not be causal.",
  "sources": [
   {
    "text": "Witkowski M et al. Xylitol is prothrombotic and associated with cardiovascular risk. European Heart Journal, 2024",
    "url": "https://doi.org/10.1093/eurheartj/ehae244"
   },
   {
    "text": "Wölnerhanssen BK et al. Xylitol exposure and cardiovascular risk (commentary). European Heart Journal, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11735080/"
   },
   {
    "text": "Xylitol and dogs (veterinary review). PubMed",
    "url": "https://pubmed.ncbi.nlm.nih.gov/20473849/"
   },
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   }
  ]
 },
 {
  "id": "e968",
  "code": "E968",
  "name": "Erythritol",
  "kind": "Sweetener (sugar alcohol)",
  "found": "Sugar-free sweets, protein bars, low-carb products and tabletop sweeteners.",
  "level": "some",
  "evidence": "Weak",
  "summary": "A 2023 study linked higher blood levels to more heart attacks and strokes in people at higher heart risk. It shows a link, not cause and effect.",
  "research": [
   "In a 2023 Nature Medicine study of 1,157 people at higher heart risk, higher blood erythritol went with more heart attacks, strokes or deaths over three years. Two further groups showed a similar pattern (hazard ratios about 1.8 and 2.2 for the top vs bottom quarter).",
   "In lab tests, erythritol made platelets more reactive. A follow-up 2024 crossover trial in 20 healthy volunteers found that 30 g of erythritol raised platelet reactivity, while glucose did not. This is a short test with a large dose, so it does not show long-term harm.",
   "The body also makes some erythritol, and the authors say the work shows an association. Long-term safety studies are needed.",
   "EFSA's 2023 re-evaluation found no DNA-damage concern, but said exposure at high intakes was above its limit and that the data did not support exempting erythritol from the laxative label."
  ],
  "careIf": "People who already have heart disease or high heart risk may want to ask their clinician.",
  "regulation": "Authorised in the EU (E 968) and the US. EU labels must carry a laxative warning when a food has over 10% added polyols.",
  "topics": [
   "Heart events (observational, 2023)",
   "Blood clotting activity (small trials)",
   "Digestive upset at high intake"
  ],
  "contested": "Consumer apps often rate erythritol as clear because it has no sugar effect. The 2023 and 2024 studies are from one research group and need independent replication, so we show a minor concern.",
  "sources": [
   {
    "text": "Witkowski M et al. The artificial sweetener erythritol and cardiovascular event risk. Nature Medicine, 2023",
    "url": "https://doi.org/10.1038/s41591-023-02223-9"
   },
   {
    "text": "Witkowski M et al. Ingestion of the sweetener erythritol increases platelet reactivity and thrombosis potential in healthy adults. Arterioscler Thromb Vasc Biol, 2024",
    "url": "https://doi.org/10.1161/ATVBAHA.124.321019"
   },
   {
    "text": "EFSA FAF Panel. Re-evaluation of erythritol (E 968) as a food additive. EFSA Journal, 2023",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/8430"
   },
   {
    "text": "European Commission. Regulation (EU) 2021/1175 (polyol labelling recital)",
    "url": "https://eur-lex.europa.eu/eli/reg/2021/1175/oj/eng"
   }
  ]
 },
 {
  "id": "e969",
  "code": "E969",
  "name": "Advantame",
  "kind": "Sweetener",
  "found": "Rarely used; some drinks, sweets and tabletop sweeteners.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA set a safe daily limit of 5 mg per kg in 2013. There are very few human studies.",
  "research": [
   "EFSA found advantame safe at proposed uses in 2013 and set an acceptable daily intake of 5 mg per kg of body weight, based on a rabbit study. It found no DNA-damage or cancer concern, and exposure was below the limit.",
   "Advantame is made from aspartame and vanillin, but it is far sweeter, so only tiny amounts are used. It breaks down in acidic drinks and some cooked foods. We found few human studies.",
   "In May 2023 the WHO advised, as a conditional recommendation, against using non-sugar sweeteners to control body weight. Its review found no lasting body-fat benefit and raised possible links to type 2 diabetes and heart disease in observational data. That advice is about weight control, not about whether a sweetener is unsafe."
  ],
  "regulation": "Authorised in the EU (E 969, Regulation 497/2014) and approved by the US FDA.",
  "topics": [
   "Limited human data",
   "Weight control (WHO 2023 advice)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Scientific opinion on the safety of advantame for the proposed uses as a food additive. EFSA Journal, 2013",
    "url": "https://efsa.europa.eu/en/efsajournal/pub/3301"
   },
   {
    "text": "European Commission. Regulation (EU) No 497/2014 (advantame, E 969)",
    "url": "https://eur-lex.europa.eu/eli/reg/2014/497/oj/eng"
   },
   {
    "text": "WHO/PAHO. WHO advises not to use non-sugar sweeteners for weight control in newly released guideline. 2023",
    "url": "https://www.paho.org/en/news/15-5-2023-who-advises-not-use-non-sugar-sweeteners-weight-control-newly-released-guideline"
   }
  ]
 },
 {
  "id": "e999",
  "code": "E999",
  "name": "Quillaia extract",
  "also": "Soapbark extract",
  "kind": "Foaming agent",
  "found": "Soft drinks (foam, cloud), cider",
  "level": "little",
  "evidence": "Weak",
  "summary": "Quillaia extract is a foaming agent from tree bark. EFSA set an ADI in 2019 and later warned that wider use could exceed it.",
  "research": [
   "EFSA re-evaluated quillaia extract in 2019 and set an ADI of 3 mg saponins per kg body weight per day. It was based on a two-year rat study (NOAEL 1,500 mg extract/kg bw per day), assuming about 20% saponins in Type 1 extract and a 100-fold uncertainty factor. Adverse effects were attributed to the saponins. No genotoxicity concern was found in the data reviewed.",
   "The Panel noted data gaps and recommended tighter specifications based on saponin content, so more data were requested.",
   "A 2024 follow-up opinion on extending use to food supplements found that intake could exceed the ADI for children, adolescents and the elderly at the high end, and for all groups at the 95th percentile. It recommended lower limits for lead, mercury and arsenic and new limits for cadmium and calcium oxalate."
  ],
  "regulation": "Authorised in the EU for flavoured drinks and cider/perry, according to a secondary source citing the 2024 follow-up. We did not check later changes.",
  "topics": [
   "Intake near the ADI if uses widen",
   "Data gaps on saponin content"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of quillaia extract (E 999) as a food additive and safety of the proposed extension of use. EFSA Journal, 2019",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009130/"
   },
   {
    "text": "EFSA FAF Panel. Follow-up of the re-evaluation of quillaia extract (E 999) and safety of the proposed extension of uses. EFSA Journal, 2024",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10844984/"
   }
  ]
 },
 {
  "id": "e1103",
  "code": "E1103",
  "name": "Invertase",
  "kind": "Enzyme (stabiliser)",
  "found": "Soft-centre chocolates, fondants and sweet fillings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "An enzyme from yeast that splits sugar. JECFA found it acceptable; We could not find an EFSA additive re-evaluation.",
  "research": [
   "JECFA judged invertase from the yeast S. cerevisiae acceptable in 2001 because the yeast is common in food production, and said use should follow good manufacturing practice.",
   "EFSA has assessed invertase products under the separate food-enzyme rules, for example a 2023 yeast invertase evaluation, but We found no stand-alone additive re-evaluation.",
   "We found no human studies of concern."
  ],
  "regulation": "Authorised in the EU as E 1103 and in the US as a processing enzyme.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "JECFA. Invertase from Saccharomyces cerevisiae (INCHEM)",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_1122.htm"
   },
   {
    "text": "EFSA CEP Panel. Safety evaluation of the food enzyme beta-fructofuranosidase from S. cerevisiae strain INV. EFSA Journal, 2023",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9941845"
   }
  ]
 },
 {
  "id": "e1105",
  "code": "E1105",
  "name": "Lysozyme",
  "kind": "Preservative enzyme",
  "found": "Some cheeses and wines.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Made from hen's egg white. EFSA said in 2011 that lysozyme in wine may trigger allergic reactions in egg-allergic people.",
  "research": [
   "Lysozyme from hen's egg is a known allergen. A 2011 EFSA opinion concluded that wines treated with lysozyme may trigger allergic reactions in susceptible people.",
   "Sensitisation to lysozyme is common in people with egg allergy. The applicant cited about 15 percent of egg-allergic people, and EFSA said sensitisation is common.",
   "Egg must be declared on EU labels. We found no other safety concern."
  ],
  "careIf": "People with egg allergy. EFSA and EU labelling rules treat egg-derived lysozyme as an allergen.",
  "regulation": "Authorised in the EU for cheese and wine within set rules. Egg-derived lysozyme falls under EU allergen labelling.",
  "topics": [
   "Egg allergy (regulator finding)"
  ],
  "sources": [
   {
    "text": "EFSA NDA Panel. Lysozyme labelling opinion, EFSA Journal 2011",
    "url": "https://dx.doi.org/10.2903/j.efsa.2011.2386"
   }
  ]
 },
 {
  "id": "e1200",
  "code": "E1200",
  "name": "Polydextrose",
  "kind": "Bulking agent and sugar replacer (synthetic fibre)",
  "found": "Sugar-free sweets, low-sugar baked goods, ice cream and 'high fibre' products.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2021 review found no safety concern at reported uses and no need for a numerical daily limit.",
  "research": [
   "EFSA re-evaluated polydextrose in 2021 and concluded that no numerical ADI was needed and that there was no safety concern at reported uses. It asked for tighter limits on lead, arsenic, cadmium and mercury in the specification.",
   "The EU committee had given an ADI of 'not specified' in 1990. Polydextrose behaves like a soluble fibre; large amounts of most fibres can cause gas or loose stools, though We did not verify EFSA's wording on this."
  ],
  "regulation": "Authorised in the EU and the US.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of polydextrose (E 1200) as a food additive. EFSA Journal, 2021",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7792022/"
   }
  ]
 },
 {
  "id": "e1201",
  "code": "E1201",
  "name": "Polyvinylpyrrolidone",
  "also": "PVP, povidone",
  "kind": "Coating and binding agent",
  "found": "Tablets and supplements, sweeteners",
  "level": "little",
  "evidence": "None",
  "summary": "PVP is a synthetic polymer used in tablets and supplements. EFSA found no safety concern.",
  "research": [
   "EFSA re-evaluated E 1201 and E 1202 together in 2020. It found no need for a numerical ADI and no safety concern at the reported uses and use levels. Absorption of both is very low.",
   "EFSA also judged a proposed extension of E 1201 to foods for special medical purposes unlikely to be a safety concern at the proposed level. A 2025 EU regulation repeats the no-ADI, no-concern finding.",
   "We could not read the full opinion text."
  ],
  "regulation": "Authorised in the EU in two food categories each.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of polyvinylpyrrolidone (E 1201) and polyvinylpolypyrrolidone (E 1202) as food additives. EFSA Journal, 2020",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7416752"
   },
   {
    "text": "EU. Commission Regulation (EU) 2025/1337",
    "url": "https://eur-lex.europa.eu/eli/reg/2025/1337/oj/eng"
   }
  ]
 },
 {
  "id": "e1202",
  "code": "E1202",
  "name": "Polyvinylpolypyrrolidone",
  "also": "PVPP, crospovidone",
  "kind": "Clarifying agent",
  "found": "Beer and wine (fining), supplements",
  "level": "little",
  "evidence": "None",
  "summary": "PVPP is a synthetic polymer used to clear beer and wine. EFSA found no safety concern.",
  "research": [
   "EFSA re-evaluated E 1201 and E 1202 together in 2020. It found no need for a numerical ADI and no safety concern at the reported uses and use levels. Absorption of both is very low.",
   "EFSA also judged a proposed extension of E 1201 to foods for special medical purposes unlikely to be a safety concern at the proposed level. A 2025 EU regulation repeats the no-ADI, no-concern finding.",
   "We could not read the full opinion text."
  ],
  "regulation": "Authorised in the EU in two food categories each.",
  "topics": [],
  "sources": [
   {
    "text": "EFSA FAF Panel. Re-evaluation of polyvinylpyrrolidone (E 1201) and polyvinylpolypyrrolidone (E 1202) as food additives. EFSA Journal, 2020",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7416752"
   },
   {
    "text": "EU. Commission Regulation (EU) 2025/1337",
    "url": "https://eur-lex.europa.eu/eli/reg/2025/1337/oj/eng"
   }
  ]
 },
 {
  "id": "e1404",
  "code": "E1404",
  "name": "Oxidised starch",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1410",
  "code": "E1410",
  "name": "Monostarch phosphate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1412",
  "code": "E1412",
  "name": "Distarch phosphate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1413",
  "code": "E1413",
  "name": "Phosphated distarch phosphate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1414",
  "code": "E1414",
  "name": "Acetylated distarch phosphate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1420",
  "code": "E1420",
  "name": "Acetylated starch",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1422",
  "code": "E1422",
  "name": "Acetylated distarch adipate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1440",
  "code": "E1440",
  "name": "Hydroxypropyl starch",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1442",
  "code": "E1442",
  "name": "Hydroxypropyl distarch phosphate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1450",
  "code": "E1450",
  "name": "Starch sodium octenyl succinate",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches.",
   "A separate 2020 EFSA opinion looked at E 1450 in foods for infants under 16 weeks and followed up its re-evaluation for all groups."
  ],
  "careIf": "Very young infants (under 16 weeks) on special formulas: EFSA reviewed this use separately in 2020.",
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   },
   {
    "text": "EFSA. Re-evaluation of starch sodium octenyl succinate (E 1450) in infant foods and follow-up. EFSA Journal, 2020",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/5874"
   }
  ]
 },
 {
  "id": "e1451",
  "code": "E1451",
  "name": "Acetylated oxidised starch",
  "kind": "Thickener and stabiliser (chemically modified food starch)",
  "found": "Soups, sauces, sweets, yoghurts, baby food, ready meals and batters.",
  "level": "little",
  "evidence": "None",
  "summary": "EFSA's 2017 group review found no safety concern at current uses and no need for a numerical daily limit (ADI not specified).",
  "research": [
   "EFSA re-evaluated 12 modified starches as one group in 2017 (E 1404 to E 1452). It concluded there was no safety concern at the reported uses and levels, and no numerical ADI was needed. The earlier JECFA and EU committee ADIs were 'not specified' for the group.",
   "Modified starches are partly broken down by gut enzymes and then fermented by gut bacteria; they are not absorbed whole. EFSA used read-across between the starches for toxicity data.",
   "We found no credible recent human cohort or trial signal for modified starches."
  ],
  "regulation": "Authorised in the EU and the US. In the EU the group was reviewed together.",
  "topics": [],
  "contested": "Some consumer apps rate 'modified' starches more strictly because the name sounds artificial. The changes are small chemical tweaks to a food starch, and We found no study showing harm at food levels. Modified starch is made from maize, potato, tapioca or wheat; people avoiding gluten or specific crops should check labels.",
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of modified starches E 1404, E 1410, E 1412, E 1413, E 1414, E 1420, E 1422, E 1440, E 1442, E 1450, E 1451 and E 1452 as food additives. EFSA Journal, 2017",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009865/"
   }
  ]
 },
 {
  "id": "e1505",
  "code": "E1505",
  "name": "Triethyl citrate",
  "kind": "Carrier, foaming agent (egg-white products)",
  "found": "Dried egg white, flavour carriers and some coatings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "JECFA set an ADI of 0 to 20 mg per kg of body weight. EFSA has not completed its own re-evaluation, so this is an older safety picture.",
  "research": [
   "JECFA set an ADI of 0 to 20 mg per kg of body weight in 1984 and kept it in 1999.",
   "In EFSA's re-evaluation programme, triethyl citrate was still waiting for data in 2020. We found no EFSA opinion.",
   "We found no recent human studies."
  ],
  "regulation": "Authorised in the EU for limited uses and in the US as an indirect or direct additive in specified uses.",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "JECFA evaluations of triethyl citrate (ADI 0 to 20 mg/kg) and triacetin (ADI not specified) (INCHEM)",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_2302.htm"
   },
   {
    "text": "JECFA evaluation (INCHEM), second record",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_2316.htm"
   },
   {
    "text": "EFSA. Re-evaluation of food additives: 2020 plan (lists triethyl citrate as pending a data call)",
    "url": "https://www.efsa.europa.eu/sites/default/files/event/2020%20FAF%20Panel%20Plan.pdf"
   }
  ]
 },
 {
  "id": "e1518",
  "code": "E1518",
  "name": "Glyceryl triacetate",
  "also": "Triacetin",
  "kind": "Humectant, carrier solvent",
  "found": "Flavour carriers, chewing gum, baked goods and coatings.",
  "level": "little",
  "evidence": "Weak",
  "summary": "JECFA put its ADI at 'not specified' in 1975. We could not find a completed modern EFSA re-evaluation.",
  "research": [
   "JECFA kept the 1975 ADI of 'not specified', meaning low concern at expected use.",
   "We could not find a published EFSA opinion on triacetin as a food additive in our search, and We found no recent human trials.",
   "Triacetin breaks down to glycerol and acetic acid in the body."
  ],
  "regulation": "Authorised in the EU as a carrier and humectant and in the US (GRAS for flavour use).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "JECFA evaluations of triethyl citrate (ADI 0 to 20 mg/kg) and triacetin (ADI not specified) (INCHEM)",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_2302.htm"
   },
   {
    "text": "JECFA evaluation (INCHEM), second record",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_2316.htm"
   }
  ]
 },
 {
  "id": "e1520",
  "code": "E1520",
  "name": "Propylene glycol",
  "also": "Propane-1,2-diol",
  "kind": "Humectant, carrier solvent",
  "found": "Flavourings, food colours, cake icing, drinks and sweets.",
  "level": "little",
  "evidence": "Weak",
  "summary": "EFSA's 2018 re-evaluation kept the safe daily intake at 25 mg per kg of body weight. It is not antifreeze (that is ethylene glycol).",
  "research": [
   "EFSA found no reason to change the ADI of 25 mg per kg of body weight set in 1996. Reproduction and development studies showed no adverse effects, and no DNA damage concern was found.",
   "In dogs, the highest dose caused changes in red blood cells. EFSA considered intake estimates to be overestimated for categories where data existed.",
   "Propylene glycol also reaches the diet through related additives such as E 477 and E 405. EFSA said it would explore a group ADI and a combined exposure estimate.",
   "Very high exposure, such as in medicine given by drip, can be a problem. That is not a food-use finding."
  ],
  "regulation": "Authorised in the EU for limited uses (mainly as a carrier and in some foods) and in the US (GRAS).",
  "topics": [
   "Limited data (no regulator concern found)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Re-evaluation of propane-1,2-diol (E 1520) as a food additive. EFSA Journal, 2018",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009459"
   }
  ]
 },
 {
  "id": "e1521",
  "code": "E1521",
  "name": "Polyethylene glycol",
  "also": "PEG",
  "kind": "Coating and anti-foaming agent",
  "found": "Supplement tablets, sweetener tablets, coatings",
  "level": "little",
  "evidence": "Weak",
  "summary": "PEG is a synthetic polymer with older ADIs. EFSA's 2018 exposure assessment found estimated intake near the range of those ADIs.",
  "research": [
   "EFSA published a refined exposure assessment in 2018 rather than a new ADI. Estimated exposure reached up to 3.5 mg/kg bw per day at the mean and 6.1 at the high level, which EFSA thought very likely overestimated real intake.",
   "The Panel noted that the highest estimate falls within the range of the SCF group ADI (5 mg/kg bw per day for PEG 300 to 4000) and the JECFA ADI (10 mg/kg bw per day for PEG 200 to 10000, set in 1979).",
   "We did not review PEG allergy reports or other human data."
  ],
  "regulation": "Authorised in the EU.",
  "topics": [
   "Intake near older ADIs (estimates)"
  ],
  "sources": [
   {
    "text": "EFSA ANS Panel. Refined exposure assessment of polyethylene glycol (E 1521) from its use as a food additive. EFSA Journal, 2018",
    "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7009417/"
   },
   {
    "text": "IPCS INCHEM. JECFA evaluation: polyethylene glycols",
    "url": "https://inchem.org/documents/jecfa/jeceval/jec_1944.htm"
   }
  ]
 },
 {
  "id": "flavouring-artificial",
  "code": "Ingredient",
  "name": "Artificial flavouring",
  "kind": "Flavouring",
  "found": "Sweets, drinks, snacks and ready meals.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Synthetic flavour molecules, each authorised on its own. The label doesn't say which ones are used.",
  "research": [
   "In the EU, artificial flavouring means flavour substances made by chemistry that don't occur in nature. Regulators review flavour substances one at a time, and a few have been withdrawn after review.",
   "A single \"artificial flavouring\" on a label can hide many separate substances, so you can't tell which are in your food.",
   "We found no study showing harm from \"artificial flavouring\" as a class at food levels."
  ],
  "regulation": "Each substance must be authorised in the EU and US. The label has to say \"artificial\" where it applies.",
  "topics": [
   "Limited transparency: contents not listed"
  ],
  "contested": "Consumer apps usually rate it more strictly than natural flavouring. The difference is mostly about label wording and transparency rather than strong evidence of harm.",
  "sources": [
   {
    "text": "EU Regulation (EC) No 1334/2008 on flavourings (definitions, natural flavouring rules)",
    "url": "https://eur-lex.europa.eu/eli/reg/2008/1334/2019-01-31/eng"
   }
  ]
 },
 {
  "id": "flavouring-natural",
  "code": "Ingredient",
  "name": "Natural flavouring",
  "kind": "Flavouring",
  "found": "Sweets, drinks, snacks, sauces and ready meals.",
  "level": "little",
  "evidence": "Weak",
  "summary": "The label doesn't say what the flavour is made of. \"Natural\" describes where it came from or how it was made, not that it is simpler or safer.",
  "research": [
   "In the EU, a natural flavouring substance is one that is naturally present and has been identified in nature. The word \"natural\" can only be used in a flavouring's description if it contains only natural flavouring substances and flavouring preparations.",
   "A single \"natural flavouring\" on a label can hide many separate substances. Regulators assess flavour substances one by one, and allergens still have to be named on the pack.",
   "We found no study that links \"natural flavouring\" as a class to harm. The concern is mainly transparency: you can't tell what you are eating."
  ],
  "regulation": "Allowed in the EU and US when the flavour substances are authorised. Must be declared as a flavouring on the label.",
  "topics": [
   "Limited transparency: contents not listed"
  ],
  "contested": "Some apps rate flavourings more cautiously than regulators do because the contents are not listed. That is a fair point about transparency, but we found no evidence of harm from natural flavourings as a class.",
  "sources": [
   {
    "text": "EU Regulation (EC) No 1334/2008 on flavourings (definitions, natural flavouring rules)",
    "url": "https://eur-lex.europa.eu/eli/reg/2008/1334/2019-01-31/eng"
   }
  ]
 },
 {
  "id": "hydrogenated-fat",
  "code": "Ingredient",
  "name": "Partially hydrogenated oil",
  "kind": "Cooking fat (industrial trans fat)",
  "found": "Margarine, some baked goods, biscuits, frying fats and snack foods.",
  "level": "restricted",
  "evidence": "Strong",
  "summary": "Partially hydrogenated oils are the main source of industrial trans fat, which raises heart disease risk. The US has removed their GRAS status, and the EU caps trans fat.",
  "research": [
   "Partial hydrogenation creates industrial trans fats. Public-health bodies link them to higher LDL cholesterol and a higher risk of heart disease.",
   "In 2015 the FDA concluded there is no longer a consensus among qualified experts that partially hydrogenated oils are generally recognised as safe for any use in human food. Compliance dates were extended in stages and ran until 2021 for some foods.",
   "The EU, in Regulation (EU) 2019/649, limits trans fat other than the kind that occurs naturally in animal fat to 2 g per 100 g of fat in food for consumers and retail.",
   "Fully hydrogenated fat contains very little trans fat, but a label that just says \"hydrogenated\" doesn't tell you which kind it is."
  ],
  "regulation": "Not GRAS in the US. The EU caps industrial trans fat at 2 g per 100 g of fat.",
  "topics": [
   "Heart disease risk (strong evidence for industrial trans fats)"
  ],
  "contested": "Consumer groups have long urged avoiding partially hydrogenated oils, and regulators have moved the same way, so there is no real disagreement.",
  "sources": [
   {
    "text": "FDA: Final determination regarding partially hydrogenated oils (removing trans fat)",
    "url": "https://www.fda.gov/food/food-additives-petitions/final-determination-regarding-partially-hydrogenated-oils-removing-trans-fat"
   },
   {
    "text": "Federal Register: Final determination regarding partially hydrogenated oils, 17 June 2015",
    "url": "https://www.govinfo.gov/content/pkg/FR-2015-06-17/html/2015-14883.htm"
   },
   {
    "text": "EU Commission Regulation (EU) 2019/649 on trans fat other than trans fat naturally occurring in fat of animal origin",
    "url": "https://eur-lex.europa.eu/eli/reg/2019/649"
   }
  ]
 },
 {
  "id": "hydrolysed-protein",
  "code": "Ingredient",
  "name": "Hydrolysed protein",
  "kind": "Savoury flavour",
  "found": "Stock cubes, soups, snacks and sauces.",
  "level": "little",
  "evidence": "Weak",
  "summary": "Protein broken into amino acids to add savoury taste. Acid-hydrolysed types can contain a process contaminant called 3-MCPD.",
  "research": [
   "Hydrolysed protein from soy, wheat or milk is a food ingredient with high free glutamate. The label has to name the source, and soy, wheat and milk are allergens.",
   "Acid hydrolysis can create 3-MCPD, a contaminant. EFSA's 2018 review set a group tolerable daily intake of 2 micrograms per kg of body weight for 3-MCPD. It found average intake below it, with a slight exceedance for some high-consuming young people and infants on formula. These are estimates for all foods, not just this ingredient."
  ],
  "careIf": "People with a soy, wheat or milk allergy, depending on the source.",
  "regulation": "A food ingredient in the EU and US. EU rules set maximum levels for 3-MCPD in some foods.",
  "topics": [
   "Contaminant (3-MCPD) in acid-hydrolysed types",
   "Allergen source (soy, wheat or milk)"
  ],
  "sources": [
   {
    "text": "EFSA: 3-MCPD in food, tolerable intake set in 2018",
    "url": "https://www.efsa.europa.eu/pt/press/news/180110"
   }
  ]
 },
 {
  "id": "maltodextrin",
  "code": "Ingredient",
  "name": "Maltodextrin",
  "kind": "Bulking agent, thickener, carrier",
  "found": "Sports drinks, sauces, snacks, sweeteners and ready meals.",
  "level": "little",
  "evidence": "Weak",
  "labOnly": true,
  "summary": "A quickly digested starch product. Lab and mouse studies suggest it may favour some gut bacteria linked to Crohn's disease. This hasn't been shown in people.",
  "research": [
   "Maltodextrin is made by breaking down starch. It is digested fast and can raise blood sugar quickly, like other refined carbohydrates.",
   "A 2012 lab study found that maltodextrin increased biofilm formation by a strain of E. coli linked to Crohn's disease. Mouse studies reported more gut inflammation.",
   "These are lab and animal findings. We found no human trial that links maltodextrin to Crohn's disease outcomes."
  ],
  "regulation": "A food ingredient in the EU and US, not an E-number additive.",
  "topics": [
   "Gut bacteria and inflammation (lab and animal studies)",
   "Quick rise in blood sugar"
  ],
  "sources": [
   {
    "text": "Nickerson KP, McDonald C. Crohn's disease-associated adherent-invasive E. coli adhesion is enhanced by exposure to the dietary polysaccharide maltodextrin. PLoS ONE, 2012",
    "url": "https://doi.org/10.1371/journal.pone.0052132"
   }
  ]
 },
 {
  "id": "vanillin",
  "code": "Ingredient",
  "name": "Vanillin",
  "kind": "Flavouring",
  "found": "Biscuits, ice cream, chocolate and baked goods.",
  "level": "little",
  "evidence": "None",
  "summary": "The main flavour compound of vanilla. Most vanillin in food is made from other sources. Regulators allow it as a flavour.",
  "research": [
   "Vanillin can come from vanilla beans, from wood lignin, from chemicals such as guaiacol, or from fermentation. The label may say vanilla flavour or vanillin without naming the source.",
   "It has been evaluated by the international food additive expert committee (JECFA) and is a recognised flavour in the US. We found no recent human studies of concern at food levels."
  ],
  "regulation": "Authorised as a flavouring in the EU and US.",
  "topics": [],
  "sources": [
   {
    "text": "FEMA Flavor Library: Vanillin (industry flavour association)",
    "url": "https://www.femaflavor.org/flavor-library/vanillin"
   },
   {
    "text": "US Code of Federal Regulations 21 CFR 182.60: synthetic flavoring substances and adjuvants",
    "url": "https://www.law.cornell.edu/cfr/text/21/182.60"
   }
  ]
 },
 {
  "id": "yeast-extract",
  "code": "Ingredient",
  "name": "Yeast extract",
  "kind": "Savoury flavour (contains natural glutamate)",
  "found": "Stock cubes, soups, crisps, sauces and ready meals.",
  "level": "little",
  "evidence": "Weak",
  "summary": "A food ingredient, not an E-number. It contains natural free glutamate, which gives savoury taste, as added MSG does.",
  "research": [
   "It is made from yeast broken down by its own enzymes, then concentrated. It contains free glutamate and nucleotides, which add savoury taste, in the same way as added MSG.",
   "Because it is a food ingredient and not an additive, EFSA's group safe intake for added glutamates (E 620 to 625) doesn't formally apply to it. Glutamate from all sources can still add up.",
   "\"No added MSG\" on a label can still include yeast extract. We found no clinical trials showing harm at normal food levels."
  ],
  "regulation": "A food ingredient in the EU and US. Not covered by the additive limits for glutamates.",
  "topics": [
   "Free glutamate (see MSG)"
  ],
  "contested": "Some apps rate it more strictly than regulators because of its free glutamate. That is true chemically, but trials on glutamate are mixed and we found nothing specific to yeast extract.",
  "sources": [
   {
    "text": "EFSA: Re-evaluation of glutamic acid and glutamates (E 620-625), 2017",
    "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4910"
   }
  ]
 }
];

# Additive scanner: what is built and what comes next

## Built (v1)
- `/scan`: scan a barcode (camera) or type the number, see the additives in the product, and what the research says about each.
- `frontend/src/rooted/additivesContent.ts`: the research library. Every entry carries sources with real links, an evidence label for the concern, and plain wording ("some research concern", never "toxic"). `src/test/additives.test.ts` enforces sources, labels and wording.
- `frontend/src/rooted/foodLookup.ts`: looks products up in Open Food Facts (only the barcode is sent).
- `frontend/src/rooted/BarcodeScanner.tsx`: uses the browser's barcode detector, or a decoder library loaded on demand.

## Also built (v2)
- Product page like Yuka's: overall verdict, additives card with a risk list, nutrition card (Negatives / In between / Positives), Nutri-Score and NOVA chips, better choices, recent scans (on device only), and a "How we rate" page.
- Verdict rules live in `frontend/src/rooted/productVerdict.ts` and are written out in the app and tested. We use "few / some / several concerns", never a 0 to 100 score or "high-risk".
- Not verified against the live Open Food Facts API from the build sandbox (blocked). Field names were taken from their docs, and parsing accepts both `nutriscore_grade` and `nutrition_grades`. Check a real scan on a phone, especially nutrition values, the Nutri-Score letter, and "better choices".

## Library growth (v3)
Added caramel colours (E150a-d), Red 3 (E127), BVO (E443), BHA/BHT, sorbates, phosphates, sucralose, nitrates, benzoates and about 15 gentle everyday additives. Every claim was checked against the regulator's own page. Held back until a primary source is verified: potassium bromate (E924), parabens, acesulfame K (E950), saccharin (E954), polyols, carbonated-drink acids and anything not listed in a regulator review.

## Also built (v4)
- Verdicts say "few concerns so far" whenever an additive isn't reviewed or nutrition facts are missing.
- Ingredient list checker for products with no barcode: paste, or use the phone's own text scanner (iPhone "Scan Text"). Parsing is in `ingredientParse.ts` and runs on the device.
- Allergen flags per profile (device only): the 14 major allergens, matched to the database's allergen and trace tags. Always paired with "read the pack".

## Rules for adding an additive
1. Find the regulator review (EFSA, JECFA, IARC, FDA) or the published study first. Open the real page.
2. Write what it found and how big the effect was. Say if it is observational, in animals, or from a single trial.
3. Rate the evidence for the concern (Strong / Moderate / Mixed / Weak / None). Rate "little concern" entries "None".
4. Never use "toxic", "poison", "cure" or "detox". A concern is not a verdict.
5. Add a test row if you add a new helper. Run `npx vitest run`.

## Next
- More additives. Most common unreviewed ones in products: E150d (caramel colour), E202 (potassium sorbate), E260/E270, E281, E282, E297, E316, E320/E321 (BHA/BHT), E333, E341, E412 variants, E452, E471, E500, E551, E955, E950, E952. Find the review first.
- Route lookups through our API so we can set a proper User-Agent (Open Food Facts asks for one), cache popular products, and rate-limit.
- Read the Open Food Facts terms in full before launch (ODbL: credit them, share improvements back). Consider contributing missing products back.
- Make better choices smarter (filter by additives on the server once we proxy).
- Share a product, and a "call out the brand" option if we want one.
- Cosmetics via Open Beauty Facts.
- Native iPhone: use the system barcode scanner for more reliable reads.
- Have a registered dietitian or toxicologist review the library before public launch, and a lawyer review the wording about brands and products.


## Accuracy overhaul (October 2026)

Prompted by a scan where a product with many additives read as mostly safe while other apps flagged them.

**What changed**
- **Every additive was re-researched** from primary sources (EFSA re-evaluations, FDA and IARC decisions, published studies) by parallel research passes, then merged into `src/rooted/additivesAudited.ts` (227 entries, up from 70). Each entry has evidence strength, regulation, sources, topic tags, and an optional `contested` note: where consumer groups or other apps rate it differently from regulators, and why.
- **One rating rule for all** (see "How we rate" in the scanner). Related additives now agree: for example E471 now matches E472b and E472c (the same French cohorts), and all phosphates are "some concern" (EFSA 2019: children above the safe limit).
- **Sorbic acid and potassium sorbate** moved from "clear" to "minor": regulators found no concern (EFSA 2019 raised the group ADI to 11 mg/kg) but lab studies on human cells found DNA changes at high doses and a sorbate-nitrite reaction forms mutagenic compounds in the lab. Neither is confirmed in people.
- **Product verdict is scored, not counted.** Restricted, notable, some and minor concerns carry weight; eight or more additives or an ultra-processed (NOVA 4) product can't read "few concerns"; each result lists its reasons.
- **"Nothing flagged" became "No concern found"**, with a note that it isn't a guarantee.
- Name matching no longer mistakes common words (fatty acids, oxygen, lactic acid bacteria) for additives.

**Sources**: every source link was checked to have appeared in actual search results; links from weak places (repository records, catalogue pages, trade press) were dropped where a primary source existed.

**Known gaps and next steps**
- A dietitian or toxicologist should review the library before launch. Several entries (the acetates, lactates, malic and fumaric acids, carbonates, E1103, E640, E920, E927b) are rated "no concern" or "minor" mainly because no review or signal was found, and say so.
- Generic ingredients that aren't E-numbers (natural and artificial flavourings, vanillin, yeast extract, hydrolysed protein, maltodextrin, dextrose, glucose-fructose syrup, palm oil, hydrogenated fat) were researched but not added: they need ingredient-level matching. Research is kept for later.
- E477 (propane-1,2-diol esters) still needs a source.
- Re-check entries whose EFSA re-evaluations were still open (many acidity regulators, ribonucleotides, sorbitol and maltitol) when EFSA publishes.

**Follow-up round**
- Emulsifier findings were checked against the NutriNet-Santé papers. The 2023 BMJ heart-disease paper named E339, E460, E466, E472b and E472c; the 2024 diabetes paper named carrageenans, E340, E472e, E331, E412, E414 and E415; the 2024 cancer paper named E471 and carrageenans. Ratings now match what each paper reported (observational, modest, one cohort).
- Fixed E-number parsing for sub-types: "E500ii", "E322i" and "E160a(ii)" now match the library instead of showing as unknown.
- Added E477 and 19 more additives (gelatine, potassium chloride, quillaia extract and others). The library has 254 entries. E261 and E375 could not be sourced and are still unreviewed.
- Result cards have Share and "Rating looks wrong?" (a pre-filled note including the product, for side-by-side testing against other apps). The additive guide filters by concern level.

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

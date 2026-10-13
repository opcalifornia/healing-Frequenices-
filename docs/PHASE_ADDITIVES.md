# Additive scanner: what is built and what comes next

## Built (v1)
- `/scan`: scan a barcode (camera) or type the number, see the additives in the product, and what the research says about each.
- `frontend/src/rooted/additivesContent.ts`: the research library. Every entry carries sources with real links, an evidence label for the concern, and plain wording ("some research concern", never "toxic"). `src/test/additives.test.ts` enforces sources, labels and wording.
- `frontend/src/rooted/foodLookup.ts`: looks products up in Open Food Facts (only the barcode is sent).
- `frontend/src/rooted/BarcodeScanner.tsx`: uses the browser's barcode detector, or a decoder library loaded on demand.

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
- "Better choices": suggest similar products without the flagged additives.
- Cosmetics via Open Beauty Facts.
- Native iPhone: use the system barcode scanner for more reliable reads.
- Have a registered dietitian or toxicologist review the library before public launch, and a lawyer review the wording about brands and products.

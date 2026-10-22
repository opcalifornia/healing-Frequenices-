# Nourish: what's left for later

Written after the Market Stall redesign and the "make it complete" round. These are the things that could not be finished from the build environment, with what each one needs.

## Needs a person or an outside decision
| Item | Why it isn't done | What it needs |
|---|---|---|
| Real food photography | Dishes use drawn bowls (`DishArt.tsx`). Photos must be shot or licensed. | Decide: shoot, license (e.g. a stock library with commercial terms), or commission. Then add an `img` field per recipe and show it in `.rcard__art` and `.rdetail__art`. |
| Dietitian review | Recipe, nutrition and cuisine notes were researched by search. Not every cited source was opened and read in full. | A registered dietitian reads all 190 dishes, the Learn sections, and the scanner explainers. Fix or remove anything they flag. |
| Toxicologist / food-scientist check | Additive explanations follow Yuka's published method plus named sources. | Review the additive list, especially entries marked unverified. |

## Needs infrastructure
| Item | Why it isn't done | What it needs |
|---|---|---|
| Cross-device sync | Backend sync exists (`sync.ts`, `STATE_KEYS` in `app/routers/state.py`) but no server is deployed for the live site. | Deploy the FastAPI backend, set the API URL for the build, test sign-in and a round trip for mealPlan, foodLog, recipeBox, kitchen. |
| Searchable recipe pages | The app is a single page with hash routes, so search engines can't index individual recipes. Recipe links (`#/nourish?recipe=ID`) work for people only. | Pre-render one static page per recipe (title, ingredients, steps, JSON-LD `Recipe`) at build time, linked from a sitemap. |
| Real-phone testing | Only desktop Chromium was available. | On an iPhone and an Android phone: barcode camera and photo fallback, globe drag and pinch, wake lock in Cook mode, timer beep and vibration (iOS has no vibration), offline use, Add to Home Screen. |

## Needs data we don't have
| Item | Why it isn't done | What it needs |
|---|---|---|
| Per-dish nutrient numbers | No food composition data in the app, and invented numbers would break the "honest, evidence-labelled" rule. | Map ingredients to USDA FoodData Central (or similar) and compute per serving. Keep the no-calorie, no-body-size rule: show fiber, protein, sodium, not energy. |
| Scanner colours not verified against Yuka | Yuka's per-additive ratings are only visible inside its app. | Scan products containing Blue 1, E471, E407 and E521 in Yuka and match our colours. |
| Region-aware additive notes | Only US rules are verified. | Add verified EU, UK, Canada notes with sources; user is in the US and wants EU-style standards shown. |

## Smaller follow-ups
- Pantry: "running low" flags and quantity tracking in My kitchen.
- Cook now currently covers the core recipes only, not the 190 world dishes.
- More dishes in the biggest cuisines beyond 9 to 10 each, and cuisines still missing.
- Accessibility: a screen-reader and contrast audit of the Market Stall skin (focus rings and reduced motion are done).
- Scale buttons repeat a number when a recipe serves 1 (0.5x and 1x both show 1).
- Add Nourish guide content to the GAIA content index.

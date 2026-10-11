# Rooted

Rooted is an evidence-based wellness app. Every health claim in it carries an
evidence rating and a linked source. It has these sections:

- **Home** (`/`): a Today strip and section cards that zoom open.
- **Healing Light** (`/light`): an interactive spectrum from UV to
  near-infrared, diagrams of how light sets the body clock and how deep each
  band reaches into skin, a night light and sunrise screen, a light box
  timer, a daily light plan from your bedtime, and evidence on light
  therapy, blue light, red light, UV and tanning beds.
- **Healing Frequencies** (`/healing`): the binaural streaming section
  described below.
- **Breathe** (`/breathe`): six guided techniques with a full-screen pacer,
  chimes and haptics, 5-4-3-2-1 grounding, and progressive muscle relaxation.
- **Nourish** (`/nourish`): diet findings, a plate builder, a water tracker,
  fasting guidance, myth checks, and a Pantry of foods, herbs and teas that
  feeds a downloadable shopping list.
- **Move** (`/move`): follow-along walking, stretching, yoga, tai chi and
  qigong with an animated figure, evidence cards and sauna safety.
- **Combos** (`/combos`): one-tap guided flows that chain breathing, movement,
  habits, a written reflection and a closing frequency session. Steps are
  swapped automatically for someone's health considerations.
- **Garden & Apothecary** (`/garden`): a planner that matches herbs to your
  space and light, a My Garden harvest tracker, food-safe tea and remedy
  recipes that add their ingredients to the shopping list, safety rules,
  and small-space growing basics.
- **Spirit & Ritual** (`/spirit`): synthesized singing bowls, chimes and gong,
  an auto-playing sound bath, a meditation timer, a gratitude journal, and
  traditions (chakras, crystals, grounding, forest bathing, smudging, faith)
  with honest evidence notes.
- **Support** (`/support`): crisis lines (988 and more), a Stanley-Brown
  safety plan, how to help someone, therapies and practitioners. A heart
  button in the nav opens crisis help from any screen.
- **Learn** (`/learn`): guides to the brain, sleep and frequency safety.
- **About you** (`/welcome`, `/about-you`): goals, activity level, daily time
  and optional health considerations. `frontend/src/rooted/plan.ts` turns
  these into a daily plan on Home and hides or flags practices that aren't
  advised (for example, power breathing in pregnancy).

Wellness content lives in `frontend/src/rooted/*Content.ts`. Per-profile data
(shopping list, water, practice log) is stored on the device in
`frontend/src/store/nourish.ts` and `practice.ts`.

Planned phases are written up in `docs/`. The AI Coach phase, a chat coach
that builds a personal daily routine from the app's content, is in
[`docs/PHASE_AI_COACH.md`](docs/PHASE_AI_COACH.md).

## Healing Frequencies

A streaming-style section for frequency-based audio. Every sound is generated
live in the browser with the Web Audio API, and every piece of artwork is
painted procedurally on canvas. There are no audio or image files.

- **Front end:** Vite + React + TypeScript, React Router, Framer Motion, one
  player store at the app root, installable PWA with Media Session controls.
- **Back end:** FastAPI + MongoDB. Catalog API, search, accounts (JWT),
  multiple profiles, favorites, continue listening and saved custom sessions.
  Stripe and Cloudflare R2 hooks are in place but switched off.
- **Content:** 69 sessions (including 8 Deep Sync programs), 22 coming-soon
  shows and 6 Learn articles, all in `backend/app/seed/`.

> Sessions may support relaxation, focus, or sleep. They are not medical
> treatment. Headphones required; keep the volume low; never listen while
> driving; if you have epilepsy or a seizure disorder, check with a doctor first.

```
backend/            FastAPI app, seed content, tests
  app/seed/         sessions.py, shows.py, articles.py, build.py (rails), validate.py
  app/routers/      catalog, auth, profiles (+ library), billing, media
  app/services/     catalog, billing (Stripe), storage (R2), entitlements
frontend/           Vite React app
  src/audio/        engine.ts (Web Audio graph), noise.ts, program.ts
  src/art/          painter.ts (procedural artwork), useArt.ts
  src/learn/        Inside Your Brain guide: content + SVG diagrams
  src/store/        player.ts (root player), user.ts, catalog.ts
  src/data/         catalog.json, exported from the seed (do not hand-edit)
  e2e/              audio-channels.mjs (real-browser signal test)
render.yaml         Render blueprint for the API
docs/RECORDING_GUIDE.md  how to record your own tone sessions and nature beds
```

## Run it locally

### Front end only (no back end needed)

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Without `VITE_API_URL` the app runs in **local mode**. It uses the bundled
catalog and keeps profiles, My Stuff and custom sessions in `localStorage`.

### Full stack

```bash
# API
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env          # set MONGO_URL, or use MONGO_URL=mongomock://local for an in-memory DB
uvicorn app.main:app --reload # http://localhost:8000/docs

# Front end, pointed at the API
cd frontend
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
```

The API seeds MongoDB on first start if the catalog is empty
(`SEED_ON_STARTUP=true`). To reseed at any time, run `python -m app.seed`.

### Tests

```bash
cd backend  && pytest                 # catalog, search, auth, profiles, library
cd frontend && npm test               # audio graph unit tests (vitest)
cd frontend && npm run test:audio     # renders the engine in headless Chromium and
                                      # measures each channel: right - left == beat
cd frontend && npm run typecheck && npm run build
```

`npm run test:audio` needs a Playwright Chromium. Install one with
`npx playwright install chromium`. CI (`.github/workflows/ci.yml`) runs all of
the above. It also fails if `frontend/src/data/catalog.json` is out of date
with the seed.

## How the audio works

`frontend/src/audio/engine.ts` builds this graph:

```
leftOsc  (carrier)        -> gain -> ChannelMerger input 0 (left ear)
rightOsc (carrier + beat) -> gain -> ChannelMerger input 1 (right ear)
isochronic tone (square LFO at the beat rate, low-passed for soft edges)
solfeggio tone (174-963 Hz)
pink / brown noise (generated buffer, seamless loop)
        -> session bus (slow fade-in) -> master fader (pause / stop / timer fade-out) -> volume
        -> MediaStream <audio> element (lock-screen controls, background play) or the speakers
```

- Audio starts only from a tap. The first play shows the safety notice, and its
  confirm button is the gesture that starts the sound.
- Every gain change ramps, so there are no clicks. Switching sessions
  crossfades.
- Deep Sync programs step through stages (`stages: [{at, beat, label}]`) with
  20-second glides between stages.
- The player store lives at the app root, so audio keeps playing while you
  navigate.
- The visualizer pulses at the beat rate by moving shape, not brightness. The
  pulse gets shallower as the beat gets faster. It freezes under
  `prefers-reduced-motion` or the player's "Calm visuals" toggle.

## Deploy

### API on Render or Railway

You need a MongoDB database. MongoDB Atlas has a free tier; copy its
connection string.

**Render:** "New → Blueprint", then pick this repo. `render.yaml` creates the
service from `backend/`. Set `MONGO_URL` and `CORS_ORIGINS` (your Vercel URL,
comma-separated if there are several). `JWT_SECRET` is generated for you.

**Railway:** create a service from this repo with root directory `backend`.
`railway.json` builds the Dockerfile and health-checks `/api/health`. Set
`MONGO_URL`, `JWT_SECRET`, `CORS_ORIGINS` and `ENVIRONMENT=production`.

The API refuses to start with `ENVIRONMENT=production` unless `JWT_SECRET`
is at least 32 random characters. Render's blueprint generates one for you.
On the free tier the API sleeps when idle. The front end waits 6 seconds for
it, then shows the bundled catalog (same content) while it wakes.

### Single-file preview

`npm run build:artifact` (in `frontend/`) makes
`dist-artifact/healing-frequencies.html`: the whole app in one page, with hash
routing, inlined fonts and no service worker. It runs in local mode, which is
handy for sharing a preview without any hosting.

### Front end on Vercel

Import the repo and set **Root Directory** to `frontend`. Vercel detects Vite;
`vercel.json` handles SPA rewrites and caching. Add the environment variable
`VITE_API_URL=https://<your-api-host>` and deploy. Then add the Vercel domain
to the API's `CORS_ORIGINS`. Outside production, `*.vercel.app` preview URLs
are also allowed.

## Adding content

All content lives in `backend/app/seed/`. Adding a title is a data change.

1. **A session:** add a tuple to `SESSIONS` in `sessions.py`:
   `(id, name, goal, carrier, beat, minutes, noise, solfeggio, iso, tagline, description, flags)`.
   The band is derived from the beat. Flags can set `featured`, `isNew` and
   `topRank`.
2. **A Deep Sync program:** add a dict to `PROGRAMS` with `stages` as
   `(minute, beat, label)` tuples.
3. **A show:** add a dict to `SHOWS` in `shows.py`. `seasons` is a list of
   episode-name lists.
4. **An article:** add to `ARTICLES` in `articles.py`. Paragraphs starting with
   `## ` become subheadings.
5. **A rail:** add a `_rail(...)` line to a section in `build.py`. Rails are
   filters (`goal`, `band`, `kind`, `category`, `flag`, `maxDuration`,
   `sort`, `limit`), so every matching title appears automatically.

Then run:

```bash
cd backend
python -m app.seed check      # validates ids, bands, carriers, stages, solfeggio tones
python -m app.seed export     # refreshes frontend/src/data/catalog.json
python -m app.seed            # upserts into MongoDB (or restart with an empty DB)
```

Artwork is generated from each title's `art` (`hue`, `pattern`), which is
assigned automatically from the goal or category.

The **Frequencies & Your Health** guide (`/learn/safety`) keeps its claims,
evidence labels and linked sources in `frontend/src/learn/safetyContent.ts`.

The **Better Sleep** guide (`/learn/sleep`) keeps its tips, evidence labels
and sources in `frontend/src/learn/sleepContent.ts`. The **Bedtime** routine
(`/bedtime`) stores each profile's plan and streak on the device
(`frontend/src/store/bedtime.ts`).

The interactive **Inside Your Brain** guide (`/learn/brain`) keeps its copy in
`frontend/src/learn/brainContent.ts` (regions, bands, sleep stages, body
rhythms, evidence table and sources). Its diagrams are SVG components in
`frontend/src/learn/diagrams/`. Keep claims in line with the listed sources.

## Next steps: subscriptions and hosted media

- **Stripe:** `app/services/billing.py` and `app/routers/billing.py` already
  have plans, Checkout and a webhook that flips `user.plan`. To turn it on,
  `pip install stripe`, set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` and
  `STRIPE_WEBHOOK_SECRET`, then gate titles in
  `app/services/entitlements.py`.
- **Cloudflare R2:** add `media: {"audio": "...", "video": "..."}` to a title
  and set the `R2_*` variables (plus `pip install boto3`).
  `GET /api/media/{title}/{kind}` then returns a signed URL, checked against
  entitlements.

## Design notes

The layout follows the familiar streaming-app pattern. A fixed top nav turns
solid on scroll. A full-bleed hero cross-fades every 8 seconds, with progress
dots and a pause control. Horizontal rails page with edge arrows and arrow
keys, and Top 10 uses oversized numerals. Hovering a tile (after 450 ms)
reveals a larger card. The title page has Episodes, More Like This and Details
tabs. There is a "Who's Listening?" profile picker and a full-screen player.
The font is Figtree (SIL Open Font License). The logo and all artwork are
original. Phones get a bottom tab bar, and everything is keyboard navigable.

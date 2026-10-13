# Garden: tools roadmap

## What popular gardening apps do (researched October 2026)
Mostly vendor blogs and app-store listings, so treat as patterns, not facts.
- **Plant-care apps (Planta, Leafy and similar):** a per-plant schedule built from species, then adjusted for pot, light, season and sometimes weather or the person's own history. Reminders for watering, feeding, misting, repotting. Plant ID and advanced reminders are usually paid.
- **Journal apps (Gardenize):** a diary of the garden over time, recurring reminders, a calendar of to-dos, notes on where things were planted.
- **Planners (GrowVeg, Almanac, Garden Plan Pro):** to-scale beds with automatic spacing, local frost dates, sowing and planting reminders, planting calendars.

## Built
- Plan: kind filter, space and light fit, "good to plant now" by month and hemisphere, planting windows, nutrients each food gives.
- My garden: today's care list (check water, feed) with Done and Not yet; per-plant rhythm the person can change; journal and harvest log; add any plant of your own; repeating calendar alarms (.ics) for every task, worded "check" so people test the soil first.
- Why garden (evidence-rated) and soil-lead safety.

## Next ideas, in priority order
1. Bed and pot layout planner (to-scale grid, spacing, companion notes labelled by evidence).
2. Seed-starting calendar from a frost date the person enters (or a lookup).
3. Frost and heat alerts (needs a weather source and notifications from the native app).
4. Plant ID from a photo (needs a vision service and a privacy review).
5. Harvest-to-kitchen: link harvests to Pantry recipes and the shopping list.
6. Pest and problem guide (organic first, with evidence labels).

## Cannabis
Not included. Federal law, state law, age limits, app-store rules and liability differ widely, and Rooted has family profiles. If it is ever added: opt-in, 21+, location-aware, general horticulture only (no sourcing, sales or health claims), after a lawyer's review.

## Reminders (built)
One card, four steps: what for (watering, nutrients), how often (every day, or when each plant needs it), what time, and where. Where = the phone's calendar (repeating alarms in an .ics file, work with the app closed) and/or Rooted's own reminder (a banner when the app is open at or after the chosen time, plus a system notification where the browser allows it). True push when the app is fully closed needs the native app or a push server.

## Idea: Pro photo help (not built)
Take a photo of a plant; AI explains likely problems and what to try, with tips for each stage of growing.
- Fits the Rooted Plus tier and the GAIA setup (server-side Claude vision calls, rate limits, no key on the phone).
- Guardrails to design first: say "likely causes and things to try", never a certain diagnosis; no identifying wild plants or mushrooms to eat; no pesticide or chemical doses beyond the product label; strip photo location data and delete photos after the answer; label as guidance, with the confidence stated; test on a set of real plant-problem photos before launch.
- Cost: image calls cost more than text. Measure real cost per diagnosis before setting a free allowance and a price.

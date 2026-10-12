# Rooted growth plan: marketing built into the product

Great products fail when nobody hears about them. The goal is a system where
using Rooted naturally spreads Rooted, so growth doesn't depend only on ad
spend. Paid ads are fuel; these loops are the engine.

## The five growth loops

### 1. Share loop (built)
Users share a beautiful card of their week or a finished program, and their
friends see the Rooted brand.
- **Built:**
  - Share cards on Your week and finished programs, in post and story shapes.
  - "Join me" invite links (`/join`): a welcome page that drops the friend
    straight into the same program. Each account has an invite code, and the
    Account page shows how many friends joined (a count only, never who).
- **Next:**
  - Cards for streak milestones (7, 30 and 100 days) and for completing the
    nature dose.
  - A monthly "Rooted Wrapped".
- **Measure:** shares per active user, and sign-ups from shared links.

### 2. Friends and Circles loop
Wellness sticks better with company. Inviting is the feature, not an ad.
- Invite a friend or family member to do a program together, with gentle
  check-ins and no public feed.
- Give a month of Rooted Plus, get a month (referral program).
- **Measure:** invites sent, invite acceptance rate, and retention of invited
  users compared with others (it's usually higher).

### 3. Professional loop (Rooted Pros)
Every yoga teacher, dietitian or breathwork coach who publishes a program
brings their own clients and followers.
- Give each pro a page and a referral link (see `PHASE_PRO_PARTNERS.md`).
- Founding Pros get free hosting and a badge in exchange for one program and
  promoting it to their audience.
- **Measure:** sign-ups attributed to each pro, and program completions.

### 4. Content and search loop
People search "how to sleep better", "box breathing" and "what is burdock
root" every day. Rooted already has evidence-rated answers.
- Publish the Learn guides, Pantry entries, recipes and breathing techniques
  as public web pages, so they show up in Google.
- Every page ends with "Try it in Rooted".
- Turn the diagrams and charts into short videos for TikTok, Reels and
  Shorts: "What box breathing does to your heart rate, in 30 seconds."
- **Measure:** search traffic, and sign-ups from content.

### 5. Workplace loop (B2B)
One HR deal brings hundreds of users at once, and employees then tell their
families.
- The work calendar feature is the pitch: "Protect 10 minutes between
  meetings."
- Offer a pilot: 50 employees free for 60 days, with an anonymous
  participation report (never individual health data).
- **Measure:** pilots started, pilots converted to paid, and active employees.

## The brand story

**Position:** *"Small, proven habits for body and mind, with the evidence
shown."* Most wellness apps oversell. Rooted is honest: every claim carries an
evidence label. That honesty is the brand.

**Voice:** warm, plain-spoken, never preachy, never "cures".

**Pillars for social content:**
1. *Proof:* one study, one chart, one takeaway.
2. *Practice:* a 60-second guided breath or stretch.
3. *Myth vs fact:* "Do detox teas work?" (with the evidence label).
4. *Real people:* beta users' share cards and stories, with permission.
5. *Giving back:* Earth & Give Back moments and community cleanups.

## Launch sequence

| When | What |
|---|---|
| Weeks 1–2 (beta) | 20–50 users, collect stories and share cards, fix rough edges |
| Week 3 | Recruit 5 Founding Pros; set up the referral program |
| Week 4 (public launch) | Launch post plus pro co-posts on the same day; Product Hunt; local press angle ("local founder builds honest wellness app") |
| Month 2 | Publish public web pages for search; start short videos 3x a week |
| Month 3 | First workplace pilot; monthly Rooted Wrapped share cards |

## Guardrails (protecting the brand)

- No fear-based or before-and-after weight marketing, and no "cures" or
  "detox" claims. These keep us out of trouble with the FTC and keep trust.
- Influencer and pro posts must disclose paid partnerships (FTC rules).
- Never use anyone's health data in marketing without explicit permission.
- Testimonials describe experiences, not medical outcomes.

## What to measure weekly

- **Activation:** % of new users who finish one practice on day one.
- **Retention:** % still active after 7 and 30 days.
- **Virality:** shares and invites per active user, and sign-ups per share.
- **Revenue (once paid launches):** trial to paid conversion, and churn.


## Static SEO guides (prerendered)

The app is a SPA, which search engines crawl poorly. `npm run build` (in `frontend/`) therefore runs
`scripts/build-seo.mjs` after `vite build`. It bundles the content modules with esbuild and writes plain HTML,
readable with no JavaScript, into `dist/`:

- `/guides/` index, `/guides/breathing/<id>/`, `/guides/foods/<id>/`, `/guides/recipes/<id>/`,
  `/guides/nutrition/<id>/`, `/guides/light/<id>/` (one page per item in the content files).
- `sitemap.xml` (guides plus the main app routes) and `robots.txt`.

Each page has a unique title and description, canonical URL, Open Graph/Twitter tags, JSON-LD (Article, FAQ, Recipe),
the app's evidence badge, sources, the safety cautions from the content data, the "Wellness education, not medical
advice" line, and a "Try it in Rooted" button linking into the app with `utm_source=guides`.

## Operating notes

- Set `SITE_URL` (default `https://rooted.app`) in the Vercel project so canonicals and the sitemap use the real domain.
  Also update the `Sitemap:` line in `frontend/public/robots.txt` if the domain differs (the build overwrites `dist/robots.txt` with `SITE_URL`).
- New content is picked up automatically on the next build. Copy stays honest: the generator drops any sentence that
  uses cure, detox, miracle or guaranteed (even in a debunking sentence), and never invents claims or doses.
- `vercel.json` excludes `/guides` from the SPA rewrite so the static files are served first.
- After launch, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and track `utm_source=guides` signups.
- Tests: `frontend/src/test/seo.test.ts` runs the generator on the real content.

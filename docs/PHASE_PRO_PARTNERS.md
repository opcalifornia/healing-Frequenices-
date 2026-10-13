# Phase: Rooted Pros (professional partners and training modules)

**Status:** planned. Logged so it can be built in steps.

## The idea

Each section of Rooted maps to a real profession. We recruit professionals
from those fields to create **training modules** inside the app: short,
guided programs that teach people and "put them on game".

| Section | Professionals |
|---|---|
| Move | Yoga teachers, tai chi and qigong instructors, physical therapists, personal trainers |
| Nourish | Registered dietitians (RD/RDN), nutrition scientists, chefs |
| Garden & Apothecary | Clinical herbalists, master gardeners, farmers |
| Breathe | Breathwork instructors, respiratory therapists, meditation teachers |
| Spirit & Ritual | Sound healers, meditation and mindfulness teachers, chaplains |
| Healing Light | Sleep specialists, dermatologists, optometrists |
| Healing Frequencies | Sound designers, music therapists |
| Support | Licensed therapists (LPC, LCSW, psychologists), massage therapists, acupuncturists, chiropractors |

**Why it's strong:**
- Professionals bring their own clients, so distribution grows without ad
  spend.
- Their credentials add trust.
- Their content fills the library faster than we could alone.

## How it works for each side

**For members**
- Every section gets a "Programs" rail.
- A program is a series of short lessons, for example "Yoga for back pain,
  14 days" by a named, verified instructor.
- Lessons mix:
  - video or audio
  - a guided practice that uses our existing players (Move figure, Breathe
    pacer, sound bath, combos)
  - a short quiz or check-in
  - an action like "add these to your shopping list"
- Progress, streaks and a completion badge.
- Programs feed the daily plan and, later, the AI Coach.

**For professionals ("Rooted Pros")**
- **Apply:** license or certification number, specialty and region.
  Credentials are verified before anything goes live.
- **Build:** a module builder for lessons, with video upload, text, quiz
  questions, and practice blocks picked from the app's library.
- **Review:** every module passes content review against the Rooted
  evidence standard before it's published (see Guardrails).
- **Earn:** revenue share on paid programs, plus referral links so
  professionals can bring their own clients in.
- **Pro profile page:** bio, credentials badge, programs, and a "work with
  me" link to their own practice.

## Business model options

1. **Revenue share:** the member pays per program or through Rooted Plus,
   and the professional gets a share. This is how course marketplaces
   typically work.
2. **Pro subscription:** professionals pay a monthly fee to host branded
   programs for their own clients inside Rooted. It's a white-label client
   app for a yoga studio, dietitian or therapist.
3. **Continuing education (CE):** offer programs professionals can take
   for CE credits. This is a big pull for recruitment, but each field has
   its own accrediting body, so start with one. Examples:
   - Yoga Alliance continuing education
   - NCCAOM for acupuncturists
   - Commission on Dietetic Registration for dietitians

**Recommendation:** start with option 2 plus a small set of
in-house-reviewed paid programs. It pays from day one, professionals
recruit their own clients, and we avoid a cold-start marketplace.

## Guardrails (this is what keeps Rooted trustworthy)

1. **Credential verification.** Verify licenses against state boards where
   a license exists:
   - therapists, dietitians, PTs, acupuncturists, massage therapists,
     chiropractors
   - show the credential and state on the profile
2. **Scope of practice.** Professionals may only teach within their scope:
   - A yoga teacher can teach yoga for back pain, but can't diagnose it.
   - "Nutritionist" isn't a protected title in many states, but RD/RDN is.
     Label the difference clearly.
   - Herbalists aren't licensed in the US. Their programs must follow the
     Pantry rules: no dosing claims, interactions shown.
3. **Evidence standard.** Health claims in modules carry the same evidence
   labels as the rest of the app. No "cure" or "treat" language, and no
   unsupported claims (for example, chakra modules are framed as tradition).
4. **Safety screening carries over.** The member's health considerations
   (pregnancy, heart conditions, etc.) flag or block unsuitable lessons
   automatically, just like Breathe and Combos.
5. **Crisis protocol.** Any program touching mental health shows the help
   button and safety plan. Therapists offering real care must do it through
   proper telehealth channels. If Rooted ever facilitates therapy sessions
   or stores clinical notes, HIPAA likely applies.
6. **Liability.** Professional agreements require the pro's own liability
   insurance. Rooted's terms make clear modules are education, not
   individual care. A lawyer should draft the pro agreement and member
   terms.
7. **Reviews and reporting.** Member ratings, plus a way to report unsafe
   content. Moderation turnaround is part of the content review process.

## How it builds on what exists

| Existing piece | Used for |
|---|---|
| Move figure player, Breathe pacer, sound bath, combo player | Practice blocks inside lessons |
| Evidence labels and source links | Required on every health claim in a module |
| Health flags (`store/wellness.ts`) | Auto-flag unsuitable lessons |
| Practice log and streaks | Program progress and completion |
| Shopping list and Pantry | "Add to list" actions inside lessons |
| Crisis sheet | Always present in mental-health programs |
| Daily plan engine | Schedules today's lesson |
| AI Coach (phase doc) | Recommends programs that fit the member's goals |

## Build order

1. **Program player (in-app):**
   - lessons, steps, quizzes, progress
   - first with two or three in-house programs to prove the format, for
     example "7 days of better sleep" and "Yoga basics, 10 days"
2. **Accounts and sync:** member progress tied to accounts (today it's
   on-device).
3. **Pro applications and verification:** application form, license
   lookup, admin review queue.
4. **Module builder:** web dashboard for professionals, video hosting
   (Cloudflare R2 or Stream is already stubbed in the back end), and draft,
   review and publish states.
5. **Payments:** Stripe Connect for payouts to professionals (Stripe is
   already stubbed); Rooted Plus subscriptions.
6. **Pro profiles, programs rails and search.**
7. **CE accreditation:** with one professional body first.

## Recruiting the first professionals

- Start local and personal: your own network of yoga teachers, massage
  therapists, dietitians and herbalists.
- Offer early partners free hosting for a year, a "founding pro" badge, and
  a say in the module builder.
- Ask each founding pro for one short program and to invite their clients.
  That gives a real test of quality and of client growth.

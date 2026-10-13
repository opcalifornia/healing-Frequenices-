# Launch checklist: Rooted on its own website

Everything in the code is ready. These steps need your own accounts, so they
are done by you (or someone you trust) in a browser. Plan on about an hour.
Free tiers cover a beta.

## What you'll set up

| Piece | Service | Cost to start |
|---|---|---|
| Database | MongoDB Atlas | Free (M0) |
| API (back end) | Render | Free tier (sleeps when idle), about $7/month to stay awake |
| Website (front end) | Vercel | Free (Hobby) for a beta; Pro ($20/month) once commercial |
| Domain, for example rooted.app | Any registrar (Cloudflare, Namecheap, Google) | About $10–20/year |

## Step 1. Database (MongoDB Atlas)

1. Sign up at mongodb.com/atlas and create a free **M0** cluster.
2. **Database Access:** add a user with a long random password.
3. **Network Access:** allow `0.0.0.0/0` (Render's IPs change on the free tier).
4. **Connect → Drivers:** copy the connection string. It looks like
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net`. This is your
   `MONGO_URL`. Keep it secret.

## Step 2. API (Render)

1. Sign up at render.com with your GitHub account.
2. **New → Blueprint**, pick this repository. Render reads `render.yaml`.
3. Fill in the settings it asks for:
   - `MONGO_URL`: from step 1
   - `CORS_ORIGINS`: your website address, for example `https://rooted.app`
     (add the Vercel address too until your domain is live)
   - `APP_URL`: your website address, for example `https://rooted.app`
   - `API_PUBLIC_URL`: the Render address, for example
     `https://healing-frequencies-api.onrender.com`
   - `JWT_SECRET` is generated for you.
4. Deploy. Open `<API address>/api/health`. It should say `{"status":"ok"}`.

## Step 3. Website (Vercel)

1. Sign up at vercel.com with GitHub. **Add New → Project**, pick this
   repository.
2. Set **Root Directory** to `frontend`. Vercel detects Vite.
3. Add the environment variable `VITE_API_URL` = your Render API address.
4. Deploy. Open the Vercel address and create an account to test sign-up.

## Step 4. Your domain

1. Buy the domain.
2. In Vercel: **Project → Settings → Domains**, add it, and follow the DNS
   instructions (usually one or two records at your registrar).
3. Update Render's `CORS_ORIGINS` and `APP_URL` to the new domain and redeploy.
4. Optional: an `api.` subdomain for Render (Render → Settings → Custom
   Domain), then update `API_PUBLIC_URL` and Vercel's `VITE_API_URL`.

## Step 5. Before you invite anyone

- [ ] **Lawyer review** of the Privacy policy, Terms and Health disclaimer
      (`/privacy`, `/terms`, `/disclaimer`). They are written to match how the
      app works today, but they are drafts.
- [ ] Replace the placeholder contact email in
      `frontend/src/pages/Legal.tsx` (`CONTACT`) with a real inbox you check.
- [ ] Turn on Atlas **backups** (paid tiers) or schedule exports.
- [ ] Check the crisis lines on `/support` are current.
- [ ] Test on your own iPhone: add to Home Screen, run a breathing session,
      add a calendar event and send it to Apple Calendar, try the live
      calendar link.
- [ ] Ask your clinical advisor to skim the content.

## Step 6. Beta

- Invite 20–50 people. Ask them to use it for 2 weeks.
- A short weekly survey: what did you use, what confused you, what would make
  you pay?
- Watch for errors in Render's logs.

## Step 7. iPhone app (next)

The iPhone app wraps this same website. The steps are in
[`PHASE_NATIVE_APP.md`](PHASE_NATIVE_APP.md). You'll need a Mac with Xcode
and an Apple Developer account ($99/year). The App Store asks for the
privacy policy URL and an account-deletion option; both exist.

## If something breaks

| Symptom | Likely cause |
|---|---|
| Sign-up fails with a network error | `VITE_API_URL` is wrong, or the website's address is missing from `CORS_ORIGINS` |
| First request is slow | The free Render tier was asleep. The app shows bundled content while it wakes |
| The live calendar link points to the wrong place | `API_PUBLIC_URL` isn't set on Render |
| "Open in Rooted" links in calendar events go to localhost | `APP_URL` isn't set on Render |

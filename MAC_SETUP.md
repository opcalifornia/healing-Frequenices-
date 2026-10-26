# Moving Rooted to your MacBook

Everything is on GitHub: **https://github.com/opcalifornia/healing-Frequenices-** (note the dash at the end of the name). The `main` branch has all the work so far. Nothing lives only on the cloud machine except old screenshots and my scratch scripts.

## 1. One-time setup (about 15 minutes)
Open **Terminal** and run these one at a time.

1. **Command line tools and Homebrew**
   ```
   xcode-select --install
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Node 22 and Git**
   ```
   brew install node@22 git
   ```
   If `node -v` doesn't say v22, run `brew link --overwrite node@22`.
3. **Sign in to GitHub** (so you can push)
   ```
   brew install gh
   gh auth login
   ```
   Choose GitHub.com, HTTPS, and log in through the browser. Then tell Git who you are:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "opcalifornia23@icloud.com"
   ```
4. **Get the code**
   ```
   cd ~/Documents
   git clone https://github.com/opcalifornia/healing-Frequenices-.git
   cd healing-Frequenices-/frontend
   npm install
   ```

## 2. Run it
```
cd ~/Documents/healing-Frequenices-/frontend
npm run dev
```
Open the address it prints (usually http://localhost:5173). Edits show up instantly.

Handy checks:
```
npm run typecheck     # catches mistakes in the code
npm test              # 340 tests, takes about 10 seconds
```

## 3. Publish a change to the live site
The live site is a single built file that GitHub Pages serves from `main`.
```
git checkout -b my-change        # work on a branch, not main
# ...make your edits...
cd ..                            # back to the repo root
./scripts/publish-site.sh        # checks, tests, builds, copies the site files
git add -A
git commit -m "Describe what changed"
git push -u origin my-change
gh pr create --fill              # opens a pull request
gh pr merge --squash             # merges it; the site updates in 1 to 2 minutes
```
Then open https://opcalifornia.github.io/healing-Frequenices-/?v=NAME in your browser and check it loads. (Change `NAME` each time to skip any cached copy.)

## 4. The backend (optional, needed only for accounts, sync and the AI helper)
The site works without it. To run it locally:
```
cd ~/Documents/healing-Frequenices-/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload     # http://localhost:8000/docs
```
It needs a MongoDB address (`MONGO_URL`). The README has the full list and the Render and Railway deploy steps.

## 5. Working with Claude on the Mac
- The Claude app on your Mac can open this same session or start a new one pointed at the GitHub repo.
- To work in the terminal instead, install Claude Code (see Anthropic's docs for the current install command), then run `claude` inside the `healing-Frequenices-` folder.
- Tell it to read `README.md`, `NOURISH_LATER.md`, `BREATHE_REFERENCES.md` and `NATIVE_HEART_PLAN.md` first. They hold what was decided and what is left.

## 6. For the iPhone and Apple Watch app later
Needs **Xcode** (free, from the App Store, about 15 GB) and an **Apple Developer account** (99 USD a year). The plan is in `NATIVE_HEART_PLAN.md` and `docs/PHASE_NATIVE_APP.md`. Your Mac is the right machine for it.

## Rules we've been following
- Evidence labels and linked sources on every health claim.
- No medical advice, and never the word "calm" in the app (Rituals' "Calm" is the one exception you chose).
- Nothing in the shareable site may mention the tools used to build it. `publish-site.sh` checks this.
- Show a screenshot before changing a design, and check the live page in a real browser before saying something is live.

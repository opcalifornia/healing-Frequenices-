#!/bin/bash
# Build the single-file site and put it where GitHub Pages serves it.
# Run from anywhere:  ./scripts/publish-site.sh
# Then commit index.html and docs/index.html and push to main (or merge a pull request).
set -euo pipefail
cd "$(dirname "$0")/../frontend"

echo "1/4 Type check"
npx tsc --noEmit -p .

echo "2/4 Tests"
npx vitest run

echo "3/4 Build"
npm run build:preview

echo "4/4 Copy to the site folders"
cp dist-preview/index.html ../index.html
cp dist-preview/index.html ../docs/index.html

# The shareable site must not mention the tools used to build it.
if grep -qi "claude" ../index.html; then echo "Found a forbidden word in index.html"; exit 2; fi

echo "Done. Now:  git add index.html docs/index.html && git commit -m 'Rebuild site' && git push"

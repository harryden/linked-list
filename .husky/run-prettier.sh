#!/usr/bin/env bash
set -euo pipefail

PATTERNS='**/*.{js,jsx,ts,tsx,css,scss,html,json,yaml,yml}'

echo "🔎 Checking Prettier formatting..."
npx prettier --check $PATTERNS || {
  echo "❌ Formatting issues found. Applying fixes…"
  npx prettier --write $PATTERNS
  echo "✨ Prettier wrote changes locally."
  echo "➡️  Please add & commit the changes, then push again."
  exit 1
}

echo "✅ Prettier formatting OK — pushing."

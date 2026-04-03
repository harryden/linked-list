#!/usr/bin/env bash
set -euo pipefail

PATTERNS='**/*.{js,jsx,ts,tsx,css,scss,html,json,yaml,yml}'

echo "🔎 Checking Prettier formatting..."
npx prettier --check $PATTERNS || {
  echo "❌ Formatting issues found. Applying fixes…"
  npx prettier --write $PATTERNS
  echo ""
  echo "✨ Prettier wrote changes locally."
  echo "➡️  For each commit that introduced formatting issues, create a fixup:"
  echo "      git add <files> && git commit -m 'fixup! <that commit message>'"
  echo "   Then squash with: git rebase -i --autosquash main"
  exit 1
}

echo "✅ Prettier formatting OK — pushing."

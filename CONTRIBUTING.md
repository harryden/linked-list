# Contributing

## Workflow

1. Create a feature branch from `main`:
   `git checkout main && git pull && git checkout -b feature/<ticket-or-topic>`
2. Make focused commits. While iterating, use fixups:
   `git commit --fixup <commit>` and later:
   `git rebase -i --autosquash main`
3. Keep history clean in the feature branch (atomic commits, no WIP).
4. Rebase your branch on the latest `main` before opening/merging the PR:
   `git fetch origin && git rebase origin/main`
5. Open a Pull Request into `main`. Title: concise, imperative.

## Before requesting review

- Rebased on latest `main` (no conflicts).
- Fixups squashed (`--autosquash`) so each commit is atomic and meaningful.
- CI is green (lint / typecheck / tests / build).
- Update docs/README if behavior changes.

## Review & merge policy

- At least **1 passing review** required.
- **Integration method:** Use a **merge commit** when merging to `main`.
  - We keep commit hygiene via fixups+squash **inside the branch**; do **not** squash on GitHub.
- **Up-to-date requirement:** Rebase onto latest `main` right before merge.
- All required checks must pass and all review conversations be resolved.
- No direct pushes to `main`.

## Commit message guidelines

- Imperative mood: “Add X”, “Fix Y”.
- Reference issues/tickets: `LIN-15: …`.
- Keep commits scoped and testable.

## Local quick refs

```bash
# fix up an earlier commit, then autosquash
git add -A
git commit --fixup <sha>
git rebase -i --autosquash main

# rebase onto latest main before pushing / merging
git fetch origin
git rebase origin/main
git push -u origin feature/<topic>
```

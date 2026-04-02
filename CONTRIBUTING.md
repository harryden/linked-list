# Contributing

## Workflow

1. Branch from latest main: `feature/<descriptive-name>` or `chore/<descriptive-name>`
2. Make focused, atomic commits. Use fixups while iterating; squash before opening a PR.
3. Rebase on latest main before opening a PR.
4. Open a Pull Request into `main`.

## Before requesting review

- Rebased on latest main, no conflicts
- Fixups squashed — each commit is atomic and meaningful
- CI is green (lint / typecheck / tests / build)
- Docs updated if behavior changes

## Review & merge policy

- At least 1 approving review required
- Merge commits only — do not squash on GitHub
- All required checks must pass and all review conversations be resolved
- No direct pushes to main

## Commit messages

- Imperative mood: "Add X", "Fix Y"
- No type prefixes (`fix:`, `feat:`, etc.)
- Keep commits scoped and testable

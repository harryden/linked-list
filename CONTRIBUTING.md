# Contributing

`WORKFLOW.md` is the source of truth for GitHub workflow, AI PR signaling, and review assignment. This file is the short contributor checklist.

## Team

- Harry Denell (@harryden)
- Teodor (@TeodorDenell)

## Branching

- Prefix: `feature/<name>` or `chore/<name>`
- Branch from latest `main`
- Rebase on `main` before opening PR

## Commits

- Imperative mood: "Add X", "Fix Y"
- No type prefixes (`fix:`, `feat:`)
- **Ideally exactly one commit per PR.**
- Squash fixups before opening PR

## Before PR

- Rebased, no conflicts
- CI green (lint, typecheck, test, build)
- Docs updated if behavior changed
- PR description is filled out, summarizes the git diff, and includes relevant test results
- Agent-authored PRs include AI metadata and labels from `WORKFLOW.md`

## AI Review & Feedback Loop

1. Mark ready PRs with `🤖 ai-ready-for-review`.
2. Reviewers claim PRs explicitly with `🤖 ai-reviewing` before starting.
3. Wait for AI Review.
4. Review & take a stance.
5. Reply to every individual comment thread.
6. Clean up PR branch with amend/autosquash before final approval.

## Review & Merge

- At least 1 approving review required
- Merge commits only; no squash on GitHub
- No direct pushes to `main`

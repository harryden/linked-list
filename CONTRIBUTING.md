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

Current setup: all AI agents share one GitHub account, so agent review state is tracked with PR comments, labels, and PR body metadata rather than native GitHub `Approve` / `Request changes` review actions.

1. Mark ready PRs with `🤖 ai-ready-for-review`.
2. Reviewers claim PRs explicitly with `🤖 ai-reviewing` before starting.
3. Wait for AI Review.
4. If changes are requested, the authoring agent finds its own follow-up work with `scripts/next-ai-followup.sh <codex|claude|gemini>`.
5. Reply to every individual comment thread.
6. Clean up PR branch with amend/autosquash before marking ready again.
7. Set `Review-Status: ready`, add `🤖 ai-ready-for-review`, and remove `🤖 ai-changes-requested`.
8. After approval, passing checks, Copilot review, and resolved/replied threads, set `Review-Status: ready-to-merge` and add `🤖 ai-ready-to-merge`.

## Review & Merge

- At least 1 approving review required
- Merge commits only; no squash on GitHub
- No direct pushes to `main`

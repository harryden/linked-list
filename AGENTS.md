# Agent Instructions

All AI agents must follow the shared process in `WORKFLOW.md`.

## Required Reading

- `WORKFLOW.md` for GitHub workflow, PR signaling, review assignment, and merge rules.
- `CONTRIBUTING.md` for contributor-facing summary rules.
- `DEFINITION_OF_DONE.md` and `QA_CHECKLIST.md` before marking work complete.
- `PROJECT_CONTEXT.md` for architecture and product context.

## Agent Review Assignment

Use `./scripts/next-ai-review.sh <codex|claude|gemini>` to find reviewable PRs. Use `--claim` before starting review work so another agent does not duplicate the same review.

Do not review PRs authored by your same agent identity unless the user explicitly asks for a self-audit.

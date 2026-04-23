# AI Agent Guidelines

Shared GitHub workflow, PR signaling, review assignment, and merge rules live in `WORKFLOW.md`. Follow that file first when rules overlap.

## Branching

- **NO DIRECT COMMITS TO MAIN:** Under no circumstances should any code be committed directly to the `main` branch.
- All changes must originate from a `feature/` or `chore/` branch and be merged via a Pull Request.
- Branch from latest main: `feature/<descriptive-name>` or `chore/<descriptive-name>`
- **One Atomic Commit per PR:** Ideally, a feature branch should have exactly **one** logical, atomic commit when the PR is opened. This makes the PR the single unit of revertibility.
- Use fixup commits while iterating; squash with `git rebase -i --autosquash main` into a single commit before opening a PR
- Rebase on latest main before pushing

## Commit Messages

- Capital first letter, imperative mood: "Add feature" not "Added feature"
- No type prefixes (`fix:`, `feat:`, `chore:` etc.)
- Be specific: "Add email validation to registration form" not "Update form"

## PR Titles

- Feature: `[feature/<name>] Brief description`
- Everything else: `[chore] Brief description`

## PR Strategy

- **No Dependent PRs:** Do not split related changes across multiple PRs (e.g. adding a component in one and using it in another).
- **Atomic at PR Level:** Related additions, migrations, and cleanups should go in a single PR so the build remains green and the entire change can be reverted in one step.
- **Independence:** Every PR must pass CI independently without depending on another open PR.

## PR Descriptions

Always use `.github/pull_request_template.md`. When using `gh pr create`, do not pass `--body` — let GitHub auto-populate the template, then fill in every section.

PR descriptions must not be empty. They must summarize the git diff and relevant test results. Agent-authored PRs must fill in `Author-Agent`, `Review-Status`, and `Review-Claimed-By` metadata from `WORKFLOW.md`.

## AI Review Assignment

- Use `./scripts/next-ai-review.sh claude` to find the next open PR Claude can review.
- Use `./scripts/next-ai-review.sh claude --claim` before starting review work.
- Do not self-review Claude-authored PRs unless the user explicitly asks for a self-audit.
- A claim means adding `🤖 ai-reviewing` and setting `Review-Status: claimed` with `Review-Claimed-By: claude`.

## Before Opening a PR

- [ ] Rebased on latest main, no conflicts
- [ ] All fixup commits squashed (history is clean)
- [ ] Tests, linting, and type checking pass locally
- [ ] Build succeeds
- [ ] No `console.log` or commented-out code
- [ ] Docs updated if behavior changed

## Merging & Finalization Protocol

- Merge commits only (no squash, no rebase merge)
- 1 approving review required
- **Wait for Copilot Review:** Do not merge until Copilot has finished its review.
  - **MANDATORY AI AUDIT TRAIL:** You MUST address all findings and reply to **every individual comment thread** directly using the GitHub API (for PR review replies, use `gh api repos/OWNER/REPO/pulls/comments -X POST -f body="..." -F in_reply_to=<comment_id>`) BEFORE executing any merge commands.
  - Address all findings and reply to **every individual comment thread** directly.
  - Do not use top-level summary comments as a substitute for threaded replies.
- **No Admin Merge:** Do not use admin privileges to bypass CI or review requirements unless explicitly instructed by the user.
- All conversations must be resolved
- All required checks must pass (test, check-fixup)

## Code Quality

- No comments in code — code must be self-documentary
- Prefer explicit over clever
- Follow existing patterns in the codebase
- Don't remove code you don't understand — ask first
- Add tests for new features; update tests when changing behavior
- Don't mix refactoring with feature changes in the same commit

## Efficiency Mandates

- **Silent Execution:** All shell commands (`npm run test`, etc.) MUST be run in silent mode (redirecting success output to /dev/null). If a command fails, output the error logs immediately for debugging.
- **Summary-Only Reporting:** For all successful tool executions, provide only a one-sentence summary. Avoid pasting long logs or file contents unless strictly necessary for the user's review.
- **Token-Efficient Interaction:** Minimize context usage by strictly avoiding unnecessary file reads and repetitive data in responses.

## When to Ask First

- Changes affecting security or critical systems
- Breaking changes
- Large refactors — confirm scope before starting
- Anything you're unsure about — ask rather than guess

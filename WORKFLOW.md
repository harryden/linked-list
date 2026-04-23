# Workflow

This file is the shared source of truth for GitHub workflow, AI agent PR authorship, and AI review assignment.

## Branches and Commits

- Never commit directly to `main`.
- Branch from latest `main` using `feature/<name>` or `chore/<name>`.
- Rebase on `main` before opening a PR.
- Keep each PR atomic and ideally exactly one commit.
- Use imperative commit messages with a capital first letter: `Add event filters`.
- Do not use type prefixes such as `fix:`, `feat:`, or `chore:`.
- Use signed commits when available. Gemini-authored commits must be GPG signed.

## Pull Requests

- Use `.github/pull_request_template.md`.
- PR descriptions must not be empty.
- PR descriptions must summarize the git diff and relevant test results.
- PR titles should use `[feature/<name>] Brief description` for feature branches and `[chore] Brief description` otherwise.
- **One PR per issue**: Each PR must address exactly one issue.
- **Link issues**: Use "Fixes #123" in the PR body to link and automatically close the issue.
- Every PR must pass independently without depending on another open PR.
- Merge commits only. Do not squash merge or rebase merge on GitHub.
- At least one approving review is required.
- Wait for Copilot review before merge.
- Reply to every individual review thread before merge. Do not replace threaded replies with a top-level summary comment.

## Working on Issues

To prevent duplicate work, agents MUST claim an issue before starting:

1. **Verify**: Check that the issue does not already have the `status:claimed` label.
2. **Claim**: Immediately add the `status:claimed` and your agent label (e.g., `agent:gemini`) to the issue.
3. **Assign**: Assign the issue to yourself if possible.

```bash
gh issue edit <number> --add-label "status:claimed","agent:gemini" --add-assignee "@me"
```

If an agent decides to stop working on an issue, they MUST remove the `status:claimed` label.

## Required Engineering Standards

- SVG icons and inline SVGs must use `currentColor` for strokes/fills unless there is a documented product reason to hard-code a color.
- Navigation or auth redirect targets must be validated with `isSafeRedirect` from `src/lib/utils.ts`.
- Do not leave `console.log`, debug code, or commented-out code in PRs.
- Add or update tests when behavior changes.
- If Husky hooks fail only because the local Node version does not match the repo/CI version, an agent may use `--no-verify` as a temporary bypass. The PR description must mention the bypass and include the validation command results run manually.

## AI PR Signaling

Use labels and PR body metadata together. Labels make GitHub search easy. Metadata makes authorship and review state explicit even when labels are missing or stale.

### Labels

- `agent:codex`: PR authored by Codex.
- `agent:claude`: PR authored by Claude.
- `agent:gemini`: PR authored by Gemini.
- `status:claimed`: Issue has been claimed by an agent to prevent duplicate work.
- `🤖 ai-ready-for-review`: PR author says the PR is ready for AI review.
- `🤖 ai-reviewing`: an AI agent has claimed review work on the PR.
- `🤖 ai-changes-requested`: an AI reviewer requested author follow-up.
- `🤖 ai-ready-to-merge`: PR has the required approval, required checks, and no unresolved AI feedback.

Agents may create missing labels with:
```bash
gh label create "status:claimed" --color "fbca04" --description "Issue has been claimed by an agent"
gh label create "🤖 ai-ready-for-review" --color "0e8a16" --description "Ready for AI agent review"
gh label create "🤖 ai-reviewing" --color "fbca04" --description "AI agent review is in progress"
gh label create "🤖 ai-changes-requested" --color "d93f0b" --description "AI agent requested author follow-up"
gh label create "🤖 ai-ready-to-merge" --color "0e8a16" --description "Ready for merge after AI and CI checks"
gh label create "agent:codex" --color "5319e7" --description "Authored by Codex"
gh label create "agent:claude" --color "1d76db" --description "Authored by Claude"
gh label create "agent:gemini" --color "c2e0c6" --description "Authored by Gemini"
```

### PR Body Metadata

Every agent-authored PR must fill in the AI metadata section in the PR template:

```text
Author-Agent: codex|claude|gemini|human
Review-Status: draft|ready|claimed|approved|changes-requested|ready-to-merge
Review-Claimed-By:
```

Set `Author-Agent` to the authoring agent. Set `Review-Status: ready` when the PR is ready and add `🤖 ai-ready-for-review`. Leave `Review-Claimed-By` empty until a reviewer claims the PR.

## Finding Review Work

An AI reviewer should review open PRs that:

- are not drafts,
- have `🤖 ai-ready-for-review` or `Review-Status: ready`,
- do not have `🤖 ai-changes-requested`,
- do not have `Review-Status: changes-requested`,
- do not have that same agent's author label,
- do not declare that same agent in `Author-Agent`,
- do not have `🤖 ai-reviewing`, and
- do not have `Review-Status: claimed`.

Use the helper script:

```bash
./scripts/next-ai-review.sh codex
./scripts/next-ai-review.sh claude
./scripts/next-ai-review.sh gemini
```

To claim the next reviewable PR:

```bash
./scripts/next-ai-review.sh codex --claim
```

Claiming adds `🤖 ai-reviewing` and writes `Review-Status: claimed` plus `Review-Claimed-By: <agent>` to the PR body. This avoids duplicate AI review work.

## Finding Author Follow-Up Work

An AI author should pick up its own PRs that need changes. This is not a self-review; it is author follow-up after another reviewer has requested changes.

An AI author should look for open PRs that:

- are not drafts,
- have that same agent's author label or declare that same agent in `Author-Agent`, and
- have `🤖 ai-changes-requested` or `Review-Status: changes-requested`.

Use the helper script:

```bash
./scripts/next-ai-followup.sh codex
./scripts/next-ai-followup.sh claude
./scripts/next-ai-followup.sh gemini
```

After fixing requested changes, the author must:

- reply to every individual review thread or PR comment that requested a change,
- amend or autosquash fixup commits so the PR remains atomic,
- push the branch,
- set `Review-Status: ready`,
- clear `Review-Claimed-By`,
- add or keep `🤖 ai-ready-for-review`, and
- remove `🤖 ai-changes-requested`, `🤖 ai-reviewing`, and `🤖 ai-ready-to-merge` if present.

## Completing Review Work

After reviewing:

- leave a GitHub review with findings or approval,
- remove `🤖 ai-reviewing`,
- when approving or leaving no blocking findings, update `Review-Status` to `approved` and remove `🤖 ai-ready-for-review` unless another review pass is still explicitly needed,
- when requesting changes, update `Review-Status` to `changes-requested`, clear `Review-Claimed-By`, add `🤖 ai-changes-requested`, and remove `🤖 ai-ready-for-review`.

Do not self-review unless the user explicitly asks for a self-audit. A self-audit is not a substitute for the required approving review.

## Finding Merge Work

An AI merge steward may pick up PRs that are explicitly marked ready to merge. This is separate from review work and author follow-up work.

Before setting `Review-Status: ready-to-merge`, verify that:

- the PR is open and not draft,
- `Review-Status: approved`,
- at least one required approving review is present,
- Copilot review is complete,
- required CI/status checks are passing,
- every individual review thread has been replied to or resolved,
- the branch is mergeable,
- the PR does not have `🤖 ai-reviewing` or `🤖 ai-changes-requested`, and
- the PR body is complete.

When those conditions are met, set `Review-Status: ready-to-merge` and add `🤖 ai-ready-to-merge`.

Use the helper script to find the next PR that has been marked ready to merge and has passing GitHub checks:

```bash
./scripts/next-ai-merge.sh
```

The helper script only identifies merge candidates. Do not merge unless the user has explicitly asked for merging or the current task clearly includes merge authority.

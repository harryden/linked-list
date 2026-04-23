---
name: github-pr-protocol
description: Maintain and review GitHub PRs according to the project's AI review and contribution guidelines. Use when checking PR status, reviewing comments from Tusk/Copilot, or verifying compliance with commit signing and atomicity rules.
---

# GitHub PR Protocol

## Overview

This skill ensures all contributions follow the linked-list project's strict PR maintenance and review lifecycle. `WORKFLOW.md` is the source of truth for GitHub signaling, AI review assignment, labels, PR body metadata, and merge rules.

## PR Maintenance Workflow

### 1. Status Check

Gather the full picture of open pull requests.

```bash
gh pr list
gh pr view <number> --json reviewDecision,statusCheckRollup,reviews
./scripts/next-ai-review.sh gemini
```

### 2. Feedback Retrieval

Read every comment, especially those from bots like Tusk or Copilot.

```bash
gh api repos/harryden/linked-list/pulls/<number>/comments --paginate
```

### 3. Verification & Compliance

Check for adherence to core mandates:

- **Atomicity**: `git log --oneline -n 5` to ensure exactly one commit per PR branch.
- **Signing**: Verify commits are signed.
- **Mood**: Ensure messages use imperative mood without type prefixes (e.g., "Add X" not "feat: Add X").

### 4. AI Review Protocol

When addressing feedback:

1. **Claim**: Run `./scripts/next-ai-review.sh gemini --claim` before starting review work.
2. **Analyze**: Review every individual comment thread.
3. **Reply**: Use threaded replies for every thread that needs a response.
4. **Refine**: Clean up the PR branch using `git commit --amend` or `git rebase -i` to maintain a single commit.
5. **Sign**: Ensure the final amended commit is signed.

## Key Constraints

- **No Squash-Merge**: Never use the GitHub UI to squash-merge.
- **Merge Commits Only**: Standard merge commits are the only allowed way to bring code into `main`.
- **Docs**: Always check if behavior changes require documentation updates in `README.md` or `CLAUDE.md`.
- **No Self-Review**: Do not review Gemini-authored PRs unless the user explicitly asks for a self-audit.

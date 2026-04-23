---
name: github-pr-protocol
description: Maintain and review GitHub PRs according to the project's AI review and contribution guidelines. Use when checking PR status, reviewing comments from Tusk/Copilot, or verifying compliance with commit signing and atomicity rules.
---

# GitHub PR Protocol

## Overview

This skill ensures all contributions follow the linked-list project's strict PR maintenance and review lifecycle. It prioritizes single-commit atomicity, mandatory signing, and the "Reply to Every Thread" AI review protocol.

## PR Maintenance Workflow

### 1. Status Check

Gather the full picture of open pull requests.

```bash
gh pr list
gh pr view <number> --json reviewDecision,statusCheckRollup,reviews
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

1. **Analyze**: Review every individual comment thread.
2. **Reply**: Use `gh pr comment <number> --body "..."` to acknowledge or resolve every thread.
3. **Refine**: Clean up the PR branch using `git commit --amend` or `git rebase -i` to maintain a single commit.
4. **Sign**: Ensure the final amended commit is signed.

## Key Constraints

- **No Squash-Merge**: Never use the GitHub UI to squash-merge.
- **Merge Commits Only**: Standard merge commits are the only allowed way to bring code into `main`.
- **Docs**: Always check if behavior changes require documentation updates in `README.md` or `CLAUDE.md`.

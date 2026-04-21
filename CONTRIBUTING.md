# Contributing

## Our Team

This project is a collaborative effort by:

- **Harry Denell** (@harryden) - Lead Developer & Architect
- **Teodor** (@Teodor) - Core Contributor

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

## AI Review & Feedback Loop

This project utilizes AI-powered code reviews (e.g., GitHub Copilot) to maintain high code quality and consistency.

1. **Wait for AI Review:** After opening a PR, wait for the AI reviewer to post its initial feedback.
2. **Review & Take a Stance:** Thoroughly evaluate every comment. Do not blindly apply changes, but do not ignore them without a technical rationale.
3. **Reply & Close the Loop:** For every comment thread:
   - If you apply the change: Reply explaining that it has been fixed.
   - If you disagree or the suggestion is incorrect: Reply with a technical explanation of why the current implementation is preferred.
4. **Iterative Refinement:** If feedback requires code changes during review, push follow-up commits as needed. If you need to clean up the PR branch history, do so with amend/autosquash before requesting final approval. This refers to rewriting the PR branch history, not using GitHub's squash-merge.

## Review & merge policy

- At least 1 approving review required
- Merge commits only — do not squash on GitHub
- All required checks must pass and all review conversations be resolved
- No direct pushes to main

## Commit messages

- Imperative mood: "Add X", "Fix Y"
- No type prefixes (`fix:`, `feat:`, etc.)
- Keep commits scoped and testable

Claude.md – AI Agent Development Guidelines

This document provides structured guidelines for AI agents (like Claude Code) contributing to this repository.

---

## Pull Request Workflow

### 1. Branch Creation

git checkout main && git pull
git checkout -b feature/<descriptive-name>

### 2. Making Changes

- Make focused, atomic commits.
- Each commit should represent a single logical change.
- While iterating, use fixup commits:

git commit --fixup <commit-sha>

### 3. Before Opening PR

# Squash all fixup commits

git rebase -i --autosquash main

# Rebase on latest main

git fetch origin && git rebase origin/main

# Verify everything passes

# Run tests, linting, type checking locally before pushing

# Push branch

git push -u origin feature/<branch-name>

### 4. Open Pull Request

IMPORTANT:
This repository has a pull request template at .github/pull_request_template.md.
When you open a PR, GitHub will automatically populate the description with this template.
Always follow the template structure.

# The template will auto-populate when you create the PR

gh pr create --title "[feature/<name>] What is changing"

# Or open PR in browser where the template will appear automatically

gh pr create --web

Do not write custom PR descriptions that deviate from the template. Fill in each section of the template completely.

---

## Commit Message Format

### Structure

Capitalize first letter and describe what the commit does

Optional longer description explaining what is changing and why.
Can span multiple paragraphs if needed.

### Rules

- No prefixes like "chore:", "fix:", "feat:"
- Start with a capital letter
- Use imperative mood: "Add feature" not "Added feature"
- Be specific: "Add validation for email fields" not "Update form"

### Examples

Good:
Add email validation to registration form

Validates email format and checks for duplicate addresses
before allowing registration. Prevents invalid emails from
entering the system.

Bad:
fix: updated stuff

---

## PR Title Format

### Feature Changes

[feature/<name>] Brief description of what is changing
Example: [feature/add-user-auth] Add user authentication system

### Non-feature Changes (chores, refactoring, etc.)

[chore] Brief description of what is changing
Example: [chore] Update dependencies to latest versions

---

## PR Description

Always use the template from .github/pull_request_template.md

When opening a PR via GitHub’s web interface or CLI, the template will automatically populate.
Fill in each section:

- What is changing: Clear description of the changes – what files, what functionality
- Why: The reason/motivation for these changes – what problem does it solve
- Testing: How was this tested? What scenarios were covered
- Notes: Additional context, breaking changes, migration steps, etc.

Do not skip sections or deviate from the template structure.

---

## Before Requesting Review Checklist

Run through this checklist before marking a PR as ready:

- [ ] Rebased on latest "main" with no conflicts
- [ ] All fixup commits squashed (history is clean)
- [ ] Each commit is atomic and meaningful
- [ ] All tests pass locally
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Documentation updated if behavior changed
- [ ] No console.log or debugging code
- [ ] No commented-out code blocks
- [ ] PR follows .github/pull_request_template.md

---

## AI Agent Specific Guidelines

### When to Ask for Human Input

- Before committing: If unsure about scope or correctness
- Before opening PR: If changes affect critical systems or security
- Breaking changes: Always confirm with a human
- Large refactors: Get approval for scope before implementing

### Code Quality Standards

- Prefer explicit over clever code
- Add comments for complex logic
- Follow existing patterns
- Don’t remove code you don’t understand — ask first

### Testing Requirements

- Add tests for new features
- Update tests when changing behavior
- Cover edge cases
- Run full test suite before committing

### File Organization

- Group related changes in the same commit
- Don’t mix refactoring with feature changes
- Keep formatting-only changes separate

---

## Quick Reference Commands

# Create fixup commit for earlier commit

git add -A
git commit --fixup <sha>

# Squash all fixups before pushing

git rebase -i --autosquash main

# Update branch with latest main

git fetch origin
git rebase origin/main

# Force push after rebase (be careful!)

git push --force-with-lease origin <branch-name>

# Open PR (template will auto-populate)

gh pr create --title "[feature/<name>] Title"

# or

gh pr create --web

---

## Integration to Main

- PRs are merged using merge commits (not squash)
- Keep branch history clean using fixups + autosquash
- Rebase onto latest main right before merge
- All required checks must pass (tests, fixup check, etc.)
- At least one approving review required
- All conversations must be resolved

---

## Remember

- Clean commits matter – Each commit should be a complete, working change
- Context is king – Explain the "why," not just the "what"
- Test everything – Don’t rely on CI to catch basic issues
- Follow the template – Always use .github/pull_request_template.md
- Ask when uncertain – Better to ask than to guess

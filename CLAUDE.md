# AI Agent Guidelines

## Branching

- Branch from latest main: `feature/<descriptive-name>` or `chore/<descriptive-name>`
- Make focused, atomic commits — one logical change per commit
- Use fixup commits while iterating; squash with `git rebase -i --autosquash main` before opening a PR
- Rebase on latest main before pushing

## Commit Messages

- Capital first letter, imperative mood: "Add feature" not "Added feature"
- No type prefixes (`fix:`, `feat:`, `chore:` etc.)
- Be specific: "Add email validation to registration form" not "Update form"

## PR Titles

- Feature: `[feature/<name>] Brief description`
- Everything else: `[chore] Brief description`

## PR Descriptions

Always use `.github/pull_request_template.md`. When using `gh pr create`, do not pass `--body` — let GitHub auto-populate the template, then fill in every section.

## Before Opening a PR

- [ ] Rebased on latest main, no conflicts
- [ ] All fixup commits squashed (history is clean)
- [ ] Tests, linting, and type checking pass locally
- [ ] Build succeeds
- [ ] No `console.log` or commented-out code
- [ ] Docs updated if behavior changed

## Merging

- Merge commits only (no squash, no rebase merge)
- 1 approving review required
- All conversations must be resolved
- All required checks must pass (test, check-fixup)

## Code Quality

- Prefer explicit over clever
- Follow existing patterns in the codebase
- Don't remove code you don't understand — ask first
- Add tests for new features; update tests when changing behavior
- Don't mix refactoring with feature changes in the same commit

## When to Ask First

- Changes affecting security or critical systems
- Breaking changes
- Large refactors — confirm scope before starting
- Anything you're unsure about — ask rather than guess

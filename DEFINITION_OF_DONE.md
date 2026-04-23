# Definition of Done (DoD)

This document defines the requirements that must be met before any feature or bug fix is considered "Done."

## 1. Code Quality
- [ ] Code follows project conventions (no comments, self-documentary).
- [ ] No `console.log` or debug statements remain.
- [ ] Types are explicit; no `any` used.
- [ ] Rebased on latest `main`; ideally squashed into a single atomic commit.

## 2. Testing & Validation
- [ ] **Unit/Smoke Tests:** All existing tests pass (`npm test`).
- [ ] **E2E Tests:** Relevant Playwright tests pass (`npx playwright test`).
- [ ] **Manual QA:** The feature has been verified against the `QA_CHECKLIST.md`.
- [ ] **Regression Check:** Unrelated core flows (Auth, Event Creation) still function.

## 3. Documentation
- [ ] `README.md` or `PROJECT_CONTEXT.md` updated if architecture changed.
- [ ] PR description follows the template and explains the "Why."

## 4. UI/UX & A11y
- [ ] UI matches design specs (spacing, colors, typography).
- [ ] Responsive: Tested on Mobile (375px) and Desktop (1440px).
- [ ] A11y: Passed `axe` sanity check.

## 5. Security
- [ ] RLS policies are in place for any new tables.
- [ ] No secrets or keys committed.

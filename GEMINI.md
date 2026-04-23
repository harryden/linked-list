See `WORKFLOW.md` for shared GitHub workflow, PR signaling, review assignment, and merge rules. See `CLAUDE.md` for additional AI agent guidelines.

## AI Agent Mandates

- **Always Sign Commits**: Use GPG signing for every commit to ensure authenticity and maintain verified status in GitHub.

## AI Review Assignment

- Use `./scripts/next-ai-review.sh gemini` to find the next open PR Gemini can review.
- Use `./scripts/next-ai-review.sh gemini --claim` before starting review work.
- Do not self-review Gemini-authored PRs unless the user explicitly asks for a self-audit.

## Efficiency Mandates

- **Silent Execution:** All shell commands (`npm run test`, etc.) MUST be run in silent mode (redirecting success output to /dev/null). If a command fails, output the error logs immediately for debugging.
- **Summary-Only Reporting:** For all successful tool executions, provide only a one-sentence summary. Avoid pasting long logs or file contents unless strictly necessary for the user's review.
- **Token-Efficient Interaction:** Minimize context usage by strictly avoiding unnecessary file reads and repetitive data in responses.

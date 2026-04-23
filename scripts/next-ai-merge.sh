#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0" >&2
}

if [[ $# -ne 0 ]]; then
  usage
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

jq_filter='
  def label_names: [.labels[].name];
  def metadata($key):
    (.body // "" | capture("(?im)^" + $key + ":\\s*(?<value>[^\\r\\n]*)").value? // "");
  def normalized($value): ($value // "" | ascii_downcase | gsub("^\\s+|\\s+$"; ""));
  def successful_check:
    if .__typename == "CheckRun" then
      (.status == "COMPLETED" and (.conclusion | IN("SUCCESS", "NEUTRAL", "SKIPPED")))
    elif .__typename == "StatusContext" then
      (.state == "SUCCESS")
    else
      false
    end;
  def checks_pass:
    (.statusCheckRollup // []) as $checks
    | ($checks | length) > 0 and all($checks[]; successful_check);

  [
    .[]
    | .labelNames = label_names
    | .reviewStatus = normalized(metadata("Review-Status"))
    | select(.isDraft | not)
    | select((.labelNames | index("🤖 ai-ready-to-merge")) or .reviewStatus == "ready-to-merge")
    | select((.labelNames | index("🤖 ai-reviewing") | not) and (.labelNames | index("🤖 ai-changes-requested") | not))
    | select(.mergeable == "MERGEABLE")
    | select(.reviewDecision == "APPROVED")
    | select(checks_pass)
  ]
  | sort_by(.updatedAt)
  | reverse
  | .[0]
  | if . == null then empty else
      {
        number,
        title,
        url,
        headRefName,
        author: .author.login,
        reviewStatus,
        reviewDecision,
        mergeable,
        mergeStateStatus,
        labels: .labelNames
      }
    end
'

candidate="$(
  gh pr list \
    --state open \
    --limit 100 \
    --json number,title,url,headRefName,isDraft,labels,body,author,updatedAt,reviewDecision,mergeable,mergeStateStatus,statusCheckRollup \
    --jq "$jq_filter"
)"

if [[ -z "$candidate" ]]; then
  echo "No ready-to-merge PR found."
  exit 0
fi

printf '%s\n' "$candidate"

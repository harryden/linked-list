#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <codex|claude|gemini>" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 2
fi

agent="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

case "$agent" in
  codex | claude | gemini) ;;
  *)
    usage
    exit 2
    ;;
esac

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

  [
    .[]
    | .labelNames = label_names
    | .authorAgent = normalized(metadata("Author-Agent"))
    | .reviewStatus = normalized(metadata("Review-Status"))
    | select(.isDraft | not)
    | select((.labelNames | index("agent:'"$agent"'")) or .authorAgent == "'"$agent"'")
    | select((.labelNames | index("🤖 ai-changes-requested")) or .reviewStatus == "changes-requested")
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
        authorAgent,
        reviewStatus,
        labels: .labelNames
      }
    end
'

candidate="$(
  gh pr list \
    --state open \
    --limit 100 \
    --json number,title,url,headRefName,isDraft,labels,body,author,updatedAt \
    --jq "$jq_filter"
)"

if [[ -z "$candidate" ]]; then
  echo "No author follow-up PR found for $agent."
  exit 0
fi

printf '%s\n' "$candidate"

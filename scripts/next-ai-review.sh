#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <codex|claude|gemini> [--claim]" >&2
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 2
fi

agent="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"
claim="${2:-}"

case "$agent" in
  codex | claude | gemini) ;;
  *)
    usage
    exit 2
    ;;
esac

if [[ -n "$claim" && "$claim" != "--claim" ]]; then
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

  [
    .[]
    | .labelNames = label_names
    | .authorAgent = normalized(metadata("Author-Agent"))
    | .reviewStatus = normalized(metadata("Review-Status"))
    | select(.isDraft | not)
    | select((.labelNames | index("agent:'"$agent"'") | not) and (.authorAgent != "'"$agent"'"))
    | select((.labelNames | index("🤖 ai-ready-for-review")) or .reviewStatus == "ready")
    | select((.labelNames | index("🤖 ai-changes-requested") | not) and .reviewStatus != "changes-requested")
    | select((.labelNames | index("🤖 ai-reviewing") | not) and .reviewStatus != "claimed")
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
  echo "No reviewable PR found for $agent."
  exit 0
fi

number="$(
  printf '%s\n' "$candidate" | node -e '
    let input = "";
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => {
      const candidate = JSON.parse(input);
      process.stdout.write(String(candidate.number));
    });
  '
)"

if [[ "$claim" == "--claim" ]]; then
  body="$(gh pr view "$number" --json body --jq '.body // ""')"
  updated_body="$(
    printf '%s' "$body" | awk -v agent="$agent" '
      BEGIN {
        saw_status = 0
        saw_claimed_by = 0
      }
      /^Review-Status:[[:space:]]*/ {
        print "Review-Status: claimed"
        saw_status = 1
        next
      }
      /^Review-Claimed-By:[[:space:]]*/ {
        print "Review-Claimed-By: " agent
        saw_claimed_by = 1
        next
      }
      { print }
      END {
        if (!saw_status) print "Review-Status: claimed"
        if (!saw_claimed_by) print "Review-Claimed-By: " agent
      }
    '
  )"

  body_file="$(mktemp)"
  json_file="$(mktemp)"
  trap 'rm -f "$body_file" "$json_file"' EXIT

  printf '%s' "$updated_body" >"$body_file"
  jq -n --rawfile body "$body_file" '{body:$body}' >"$json_file"

  gh api --method PATCH "repos/{owner}/{repo}/pulls/$number" --input "$json_file" >/dev/null
  gh api --method POST "repos/{owner}/{repo}/issues/$number/labels" -f 'labels[]=🤖 ai-reviewing' >/dev/null
  echo "Claimed PR #$number for $agent review."
fi

printf '%s\n' "$candidate"

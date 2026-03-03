#!/usr/bin/env bash
set -euo pipefail

# Script purpose:
# - Create/update a clear team branch structure for 6 members
# - Push branches to origin (optional)

BASE_BRANCH="${1:-develop}"
PUSH_REMOTE="${2:-no}"

BRANCHES=(
  "feature/member-1-auth-users"
  "feature/member-2-services-bookings"
  "feature/member-3-helper-module"
  "feature/member-4-payment-review"
  "feature/member-5-admin-report-coupon"
  "feature/member-6-frontend-integration"
)

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Not inside a git repository"
  exit 1
fi

echo "🔄 Fetching latest branches..."
git fetch --all --prune

if ! git show-ref --verify --quiet "refs/heads/${BASE_BRANCH}"; then
  echo "ℹ️ Local ${BASE_BRANCH} not found, trying to track origin/${BASE_BRANCH}"
  git checkout -b "${BASE_BRANCH}" "origin/${BASE_BRANCH}" || {
    echo "❌ Cannot find base branch: ${BASE_BRANCH}"
    exit 1
  }
else
  git checkout "${BASE_BRANCH}"
fi

echo "🔄 Updating ${BASE_BRANCH}..."
git pull --ff-only origin "${BASE_BRANCH}" || true

for branch in "${BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    echo "♻️  Branch exists, rebasing: ${branch}"
    git checkout "${branch}"
    git rebase "${BASE_BRANCH}" || {
      echo "⚠️ Rebase conflict on ${branch}. Resolve manually."
      exit 1
    }
  else
    echo "✅ Creating branch: ${branch}"
    git checkout -b "${branch}" "${BASE_BRANCH}"
  fi

  if [[ "${PUSH_REMOTE}" == "push" ]]; then
    git push -u origin "${branch}"
  fi
done

git checkout "${BASE_BRANCH}"

echo "🎉 Team branches are ready from ${BASE_BRANCH}."
echo "Usage:"
echo "  ./scripts/init-team-branches.sh                # create/rebase from develop"
echo "  ./scripts/init-team-branches.sh develop push   # create/rebase and push"

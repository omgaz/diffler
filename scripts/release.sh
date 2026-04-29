#!/usr/bin/env bash
set -euo pipefail

OVERRIDE="${1:-}"

if [[ -n "$OVERRIDE" && ! "$OVERRIDE" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: npm run release [-- patch|minor|major]"
  echo "  Omit argument to auto-detect from conventional commits."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working directory is not clean. Commit or stash changes first."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "master" ]]; then
  echo "Switch to master before running release."
  exit 1
fi

git pull --ff-only origin master

if [[ -n "$OVERRIDE" ]]; then
  BUMP="$OVERRIDE"
else
  LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
  if [[ -n "$LAST_TAG" ]]; then
    RANGE="${LAST_TAG}..HEAD"
  else
    RANGE="HEAD"
  fi

  BUMP=""
  while IFS= read -r subject; do
    [[ -z "$subject" ]] && continue
    if [[ "$subject" =~ ^[a-z]+(\(.+\))?!: ]]; then
      BUMP="major"; break
    fi
    if [[ "$BUMP" != "minor" && "$subject" =~ ^feat(\(.+\))?: ]]; then
      BUMP="minor"
    fi
    if [[ -z "$BUMP" && "$subject" =~ ^fix(\(.+\))?: ]]; then
      BUMP="patch"
    fi
  done < <(git log "$RANGE" --format="%s" --no-merges)

  if [[ -z "$BUMP" ]]; then
    echo "No releasable commits found since ${LAST_TAG:-the beginning}."
    echo "Use 'npm run release -- patch|minor|major' to override."
    exit 0
  fi

  echo "Auto-detected bump: $BUMP"
fi

npm version "$BUMP" --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")
BRANCH="release/v${VERSION}"

git checkout -b "$BRANCH"
git add package.json package-lock.json
git commit -m "chore(release): v${VERSION}"
git push -u origin "$BRANCH"

gh pr create \
  --base master \
  --head "$BRANCH" \
  --title "chore(release): v${VERSION}" \
  --body "Bumps version to \`${VERSION}\` (${BUMP}).

Merging will tag and publish to npm automatically."

echo ""
echo "PR created. Merge it to publish v${VERSION} to npm."

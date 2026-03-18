#!/bin/bash
# Sync manef-db into vendor/manef-db
# Run this after any changes to manef-db
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
SRC="$ROOT/../manef-db"
DEST="$ROOT/vendor/manef-db"

echo "Syncing manef-db → vendor/manef-db..."
rsync -av --exclude='.git' --exclude='node_modules' "$SRC/" "$DEST/"
echo "Done. Verifying..."
DIFF=$(diff -rq --exclude='node_modules' --exclude='.next' "$SRC" "$DEST" | grep -v "^Only in $SRC: .git" || true)
if [ -z "$DIFF" ]; then
  echo "✓ vendor/manef-db is fully in sync."
else
  echo "⚠ Differences remaining:"
  echo "$DIFF"
fi

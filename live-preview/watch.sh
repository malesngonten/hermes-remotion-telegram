#!/usr/bin/env bash
# watch.sh — re-render a SMALL preview clip when remotion/src changes.
# Keeps the MP4 ≤ ~1MB so it loads instantly inside Telegram's browser
# over a free tunnel (no 10MB dev bundle, no Studio IDE embed).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/remotion/src"
DEST="$ROOT/live-preview/result.mp4"
LAST=$(find "$SRC" -type f -newermt "-1 hour" | md5sum | cut -d' ' -f1)
render() {
  echo ">> re-rendering preview clip..."
  cd "$ROOT/remotion"
npx remotion render src/index.tsx "$COMP" "$DEST" \
    --frames 0-59 --scale 0.5 --crf 28 --overwrite || echo "render failed"
}
render
while :; do
  NOW=$(find "$SRC" -type f | md5sum | cut -d' ' -f1)
  if [ "$NOW" != "$LAST" ]; then
    LAST="$NOW"; render
  fi
  sleep 4
done

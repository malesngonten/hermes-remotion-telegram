#!/usr/bin/env bash
# hermes render-and-publish
# Renders a Remotion composition on THIS device, commits the MP4 to the repo,
# and pushes so the GitHub Pages player picks the new video up automatically.
set -euo pipefail
COMP="${1:-MotionScene}"      # Composition id
FRAMES="${2:-0-59}"           # frame range (default 2s preview)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/remotion/output/result.mp4"

echo ">> Rendering $COMP frames=$FRAMES -> $OUT"
cd "$ROOT/remotion"
npx remotion render src/index.tsx "$COMP" "$OUT" --frames "$FRAMES" --crf 23 --overwrite

# make the file available at the public path Pages reads
rm -f "$OUT".* 2>/dev/null || true
git -C "$ROOT" add "remotion/output/result.mp4"
git -C "$ROOT" commit -q -m "chore: publish render ($COMP $FRAMES)" || { echo "nothing changed"; exit 0; }
git -C "$ROOT" push
echo ">> Published. GitHub Pages player will auto-update within ~10s."

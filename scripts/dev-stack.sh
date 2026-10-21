#!/usr/bin/env bash
# dev-stack.sh — Nyalakan Remotion Studio dev server + tunnel publik untuk Telegram Web App.
# Semua source & asset tetap ada di device ini; tidak ada upload ke cloud.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STUDIO_PORT="${STUDIO_PORT:-3000}"
LOG_DIR="${ROOT}/logs"
mkdir -p "$LOG_DIR"

echo ">> Mematikan proses dev-stack lama (jika ada)..."
pkill -f "remotion preview --port ${STUDIO_PORT}" 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://127.0.0.1:${STUDIO_PORT}" 2>/dev/null || true
sleep 2

echo ">> Menjalankan Remotion Studio di http://127.0.0.1:${STUDIO_PORT} ..."
cd "$ROOT/remotion"
CLI="./node_modules/.bin/remotion"
if [ ! -x "$CLI" ]; then CLI="node node_modules/@remotion/cli/remotion-cli.js"; fi
nohup "$CLI" preview --port "${STUDIO_PORT}" > "$LOG_DIR/studio.log" 2>&1 &
STUDIO_PID=$!
echo "   Studio PID: $STUDIO_PID"

echo ">> Menunggu Studio siap..."
for i in $(seq 1 30); do
  if curl -s -m 3 -o /dev/null "http://127.0.0.1:${STUDIO_PORT}/" 2>/dev/null; then
    echo "   Studio siap."
    break
  fi
  sleep 1
done

echo ">> Menyalakan tunnel cloudflared ke https ..."
CLOUDFLARED="${ROOT}/tools/cloudflared"
if [ ! -x "$CLOUDFLARED" ]; then
  echo "   cloudflared belum ada di $CLOUDFLARED. Unduh dulu:"
  echo "   curl -sL -o $CLOUDFLARED https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 && chmod +x $CLOUDFLARED"
  exit 1
fi

nohup "$CLOUDFLARED" tunnel --url "http://127.0.0.1:${STUDIO_PORT}" --no-autoupdate > "$LOG_DIR/tunnel.log" 2>&1 &
TUNNEL_PID=$!
echo "   Tunnel PID: $TUNNEL_PID"

sleep 8
echo ""
echo "=============================="
echo "   DEV STACK SIAP"
echo "=============================="
echo "   Lokal  : http://127.0.0.1:${STUDIO_PORT}"
echo "   Publik : Lihat $LOG_DIR/tunnel.log (baris 'https://...trycloudflare.com')"
echo "   Buka publik URL di dalam Telegram (in-app browser) = Remotion Studio asli."
echo "   Edit file di remotion/src/* lalu Studio akan hot-reload otomatis."
echo "=============================="

---
name: remotion-telegram-render
description: "Use this skill to render a Remotion composition to an MP4 video and return the output path (or a public URL) so the clip can be shared inside Telegram. Triggers on: render a video, make a motion graphic, generate a <Composition> clip, render <comp> with remotion, create a telegram video."
tags: ["remotion", "video", "motion-graphics", "telegram", "render"]
---

# Remotion → Telegram render skill

Lets the **Hermes Agent** generate a video from a Remotion composition and
deliver it in-chat (or via a CDN link the Telegram Web App can play).

## 1. Locate the project
- The Remotion project lives at `remotion/` (see repo root).
- Entry point: `remotion/src/index.tsx` (calls `registerRoot`).
- Registered compositions: `MotionScene` (120f @ 30fps, 1920×1080) and
  `HelloWorld` (60f @ 30fps).

## 2. Render a composition from the agent
Run via the project's local CLI (Chromium headless-shell is cached by Remotion
on first run; on ARM64/PRoot ensure the apt Chrome deps are installed — see
repo root README):

```bash
cd /root/hermes-remotion-telegram/remotion
npx remotion render src/index.tsx <CompositionId> output/<name>.mp4 \
  --frames 0-59 --crf 23 --overwrite
```

- `--frames 0-59` → render only the first 2s (fast preview).
- `--overwrite` → allow re-running without prompt.
- Output is a valid H.264 MP4; validate with `ffprobe`.

## 3. Deliver into Telegram
Option A — **inline**: attach `output/<name>.mp4` (MEDIA path) directly in the
reply so the user sees the clip instantly.

Option B — **Web App link**: upload the MP4 to stable storage (e.g. GitHub
release asset / S3), then reply with the URL; the Telegram Web App
(`web/app/page.tsx`) accepts `?video=<url>` and plays it in-app.

## 4. Typical agent workflow
```
1. parse user intent → choose CompositionId (default MotionScene).
2. run remotion render (see step 2).
3. confirm output exists + ffprobe shows h264 1920x1080 N frames.
4. deliver: attach file inline OR upload + send Web App link.
```

## 5. Gotchas
- Never `remotion preview`/`studio` and block on a server the user can't reach —
  prefer rendering a short clip and delivering it.
- If Chromium fails to launch with `libnspr4.so` etc., the host needs the apt
  Chrome deps; render will also fail — install them then retry.
- ARM64 hosts: Remotion ships `compositor-linux-arm64-gnu`; the headless-shell
  download is automatic but needs the system libs above.

# hermes-remotion-telegram

Open-source template: **render Remotion motion-graphics videos and view them
inside Telegram**, with the [Hermes Agent](https://hermes-agent.nousresearch.com)
able to drive the pipeline.

- 🎞️ **Remotion studio** (`remotion/`) — React compositions that render to MP4
  using Chromium headless-shell (ARM64 / x64 friendly).
- 💬 **Telegram Web App** (`web/`) — a Next.js player page opened from a bot
  `web_app` button; shows the latest rendered video with an inline `<video>`
  player so the result is visible **directly inside Telegram**.
- 🤖 **Bot** (`bot/`) — tiny Telegraf bot that posts the `web_app` button and
  proxies render requests to Hermes.
- 🧠 **Hermes skill** (`hermes/SKILL.md`) — `/remotion render <comp>` from any
  chat so the agent itself generates the clip.
- 🚀 **CI** (`.github/workflows/`) — renders a sample on every push; deploys the
  Web App to Vercel on release.

## What you get

| Layer | File | Purpose |
|-------|------|---------|
| remotion/render | `remotion/src/MotionScene.tsx` | animated composition |
| telegram web app | `web/app/page.tsx` | in-app video player |
| bot | `bot/src/bot.ts` | `web_app` button + `/render` command |
| agent | `hermes/SKILL.md` | Hermes skill to render on demand |

## Quick start (local)

```bash
git clone <this-repo>
cd hermes-remotion-telegram

# 1. remotion studio (preview + render)
cd remotion && npm install && npm run preview   # http://localhost:3000

# 2. web player (local)
cd ../web && npm install && npm run dev         # http://localhost:3000

# 3. bot (needs BOT_TOKEN + WEBAAP_URL)
cd ../bot && npm install && BOT_TOKEN=... npm start
```

## Telegram → Hermes flow (deployed)

1. User opens the bot → bot sends a **Web App** button whose URL is the Vercel
   player (HTTPS, registered in @BotFather).
2. User taps the button → Telegram opens your `web/` app **in its in-app browser**.
3. The player shows the latest uploaded MP4; tapping **Render** sends a
   `web_app` data-update to the bot.
4. The bot forwards the request to the **Hermes Agent** (via the skill in
   `hermes/SKILL.md`), which runs `remotion render ...`, then uploads the MP4
   to a CDN/storage URL that the player polls.

## Credentials

- GitHub PAT — to create / push the repo (ask the owner once).
- Vercel — `vercel login` (or `vercel_mcp` OAuth) to deploy `web/`.
- Telegram `BOT_TOKEN` — for `bot/` and Web App domain verification.

See each subdirectory's README / docs for exact commands.

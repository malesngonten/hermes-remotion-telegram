/**
 * Minimal Telegraf bot.
 * - /start  -> sends a Web App button (opens the Vercel player inside Telegram)
 * - /render -> asks Hermes to render a composition (stub: logs the request)
 */
import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Set BOT_TOKEN and WEBAPP_URL env vars.");
  process.exit(1);
}
const webappUrl = process.env.WEBAPP_URL ?? "https://your-vercel-app.vercel.app/";

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply("Hermes Remotion Studio 🎬", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "Buka Studio",
          web_app: { url: webappUrl },
        },
      ]],
    },
  })
);

// Receives data sent from the Telegram Web App (via tg.sendData).
bot.on("web_app_data", async (ctx) => {
  const data = JSON.parse(ctx.webApp?.data ?? "{}");
  console.log("web_app_data:", data);
  // TODO: forward `data` to Hermes to trigger a render, then reply with the video URL.
  await ctx.answerCbQuery("Permintaan render diterima!");
});

bot.command("render", (ctx) =>
  ctx.reply("📽️ Hermes akan me-render. Panggil /render <Composition> via Hermes skill, atau tekan tombol di atas.")
);

bot.launch();
console.log("Bot running. Web App URL:", webappUrl);

"use client";
import { useEffect, useState } from "react";

// Telegram Web App bridge (available when opened inside Telegram's in-app browser).
const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : undefined;

const DEFAULT_VIDEO = "https://raw.githubusercontent.com/malesngonten/hermes-remotion-telegram/main/remotion/output/result.mp4";

export default function page() {
  const [video, setVideo] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(
    "Tekan Render untuk menghasilkan video lewat Hermes Agent."
  );

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.MainButton.setText("🔴 Render via Hermes").show();
      // When the user taps the main button, send data back to the bot.
      tg.MainButton.onClick(() => {
        setStatus("⏳ Hermes sedang me-render…");
        tg.sendData(JSON.stringify({ action: "render", composition: "MotionScene" }));
      });
    }
    // Allow ?video=<url> to deep-link a freshly rendered clip.
    const q = new URLSearchParams(window.location.search);
    const v = q.get("video");
    if (v) setVideo(v); else setVideo(DEFAULT_VIDEO);
  }, []);

  return (
    <main style={{ background: "#0f172a", minHeight: "100vh", color: "#e2e8f0", padding: 16 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>🎬 Hermes Remotion Studio</h2>
      <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 12 }}>{status}</p>
      <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        <video
          src={video ?? undefined}
          controls
          autoPlay
          muted
          loop
          style={{ width: "100%", height: "auto", display: "block" }}
          poster="https://github.com/malesngonten/hermes-remotion-telegram/raw/main/.github/preview-card.png"
        />
      </div>
      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 12 }}>
        Video disajikan sebagai Web App Telegram — dijalankan langsung di Telegram.
      </p>
    </main>
  );
}

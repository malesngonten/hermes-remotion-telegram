---
name: remotion-telegram-studio
description: "Use this skill to open Remotion Studio inside Telegram, edit source files on this device via the Hermes agent, and see changes in real-time via hot-reload. Triggers on: buka studio remotion di telegram, edit komposisi remotion, ubah warna/animasi remotion, live preview remotion, studio remotion lewat telegram."
tags: ["remotion", "studio", "telegram", "live-preview", "hot-reload", "edit-source"]
---

# Remotion Studio → Telegram (Live, Device-Local)

## Arsitektur
Semua file sumber dan asset Remotion **tetap ada di device ini**. Tidak ada upload ke Vercel / GitHub Pages / cloud. Studio dev server (`remotion preview`) di-expose ke publik via cloudflared tunnel HTTPS, lalu dibuka sebagai Telegram Web App / in-app browser.

```
[Device ini]
  remotion preview   →  localhost:3000
     └─ cloudflared  →  https://<acak>.trycloudflare.com  ← dibuka di Telegram
```

Setiap kali Hermes agent mengedit file di `remotion/src/*`, Studio otomatis **hot-reload** (WebSocket lewat tunnel) → perubahan terlihat real-time di Telegram.

## 1. Nyalakan stack (jalankan sekali di device)

```bash
cd /root/hermes-remotion-telegram
bash scripts/dev-stack.sh
```

Output akan menampilkan URL publik, misalnya:
```
Publik : https://encouraged-graphs-goes-cave.trycloudflare.com
```

Buka URL tersebut **di dalam aplikasi Telegram** (in-app browser). Remotion Studio asli akan muncul (bundle dev 10 MB, muat pertama kali butuh ~1–2 menit tergantung jaringan).

## 2. Edit lewat Hermes agent (dari chat Telegram)

Ketik perintah seperti ini ke Hermes di Telegram:

- `"Ubah warna kotak di MotionScene jadi hijau"` → Hermes edit `remotion/src/MotionScene.tsx`, simpan, Studio hot-reload.
- `"Ubah tulisan HERMES jadi REMOTION LIVE"` → Hermes edit teks di komposisi.
- `"Tambahkan animasi rotasi pada judul"` → Hermes tambahkan kode animasi.
- `"Buka file MotionScene.tsx"` → Hermes baca isi file untuk kamu review.

Hermes akan:
1. Baca file yang relevan di `remotion/src/`
2. Terapkan perubahan yang kamu minta
3. Simpan file di device (tidak perlu commit/push)
4. Studio dev server mendeteksi file berubah → hot-reload otomatis
5. Kamu lihat hasilnya langsung di Telegram tanpa refresh manual

## 3. URL Publik (non-permanen)

URL trycloudflare.com adalah acak dan berubah setiap kali cloudflared di-restart. Jika mau URL tetap, butuh domain sendiri + reverse proxy. Untuk sementara, setiap kali kamu nyalakan `dev-stack.sh`, ambil URL baru dari `logs/tunnel.log` dan buka di Telegram.

## 4. File yang terlibat

| File | Fungsi |
|------|--------|
| `remotion/src/index.tsx` | Entry point, `registerRoot`, daftar komposisi |
| `remotion/src/MotionScene.tsx` | Komposisi utama (120 frame, 1920×1080) |
| `remotion/src/HelloWorld.tsx` | Komposisi contoh kedua |
| `remotion/remotion.config.ts` | Konfigurasi CLI (kosong, default) |
| `scripts/dev-stack.sh` | Nyalakan Studio + tunnel |

## 5. Catatan

- Bundle dev Remotion adalah 10 MB. Saat pertama kali membuka URL publik di Telegram, layar mungkin putih beberapa menit sambil bundle diunduh. Setelah ter-load, setiap edit muncul dalam hitungan detik.
- Tidak perlu `vercel`, `git push`, atau upload asset ke mana pun. Semua operasi edit bersifat lokal di device.
- Untuk menutup: `pkill -f "remotion preview" && pkill -f "cloudflared tunnel"`.

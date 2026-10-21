/*
 * Live preview server for Telegram.
 * Serves a tiny HTML player + the latest small rendered MP4.
 * No framework deps — pure Node http.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname);     // live-preview/
const PORT = Number(process.env.PORT || 3002);

const ctype = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".json": "application/json; charset=utf-8",
};

function serve(filePath, res) {
  fs.stat(filePath, (e) => {
    if (e) { res.writeHead(404); return res.end("not found"); }
    const ct = ctype[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "content-type": ct, "cache-control": "no-store" });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === "/") return serve(path.join(ROOT, "index.html"), res);
  if (url.pathname === "/api/now") {
    // returns the mtime of result.mp4 so the player reloads when it changes
    fs.stat(path.join(ROOT, "result.mp4"), (e, s) => {
      const stamp = e ? "none" : String(s.mtimeMs);
      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify({ stamp }));
    });
    return;
  }
  if (url.pathname === "/result.mp4") return serve(path.join(ROOT, "result.mp4"), res);
  res.writeHead(404); res.end("not found");
});

server.listen(PORT, () => console.log(`live-preview server :${PORT}`));

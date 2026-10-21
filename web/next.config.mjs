/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static-ish player; video served via /api/video or a storage URL.
  images: { unoptimized: true },
  output: "standalone",
};
module.exports = nextConfig;

const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const nextDevDir = path.join(rootDir, ".next", "dev");
const publicDir = path.join(rootDir, "public");
const swPath = path.join(publicDir, "sw.js");
const enablePwaInDev = process.env.NEXT_PUBLIC_ENABLE_PWA_DEV === "true";

const placeholderScript = `const NOOP_PWA_PLACEHOLDER = "NOOP_PWA_PLACEHOLDER";
const APP_MANAGED_CACHE_PREFIXES = [
  "start-url",
  "app-pages",
  "repo-content",
  "next-data",
  "static-image-assets",
  "static-audio-assets",
  "static-video-assets",
  "static-style-assets",
  "static-js-assets",
  "static-data-assets",
  "next-image",
  "apis",
  "others",
  "cross-origin",
  "google-fonts-webfonts",
  "google-fonts-stylesheets",
];

const shouldDeleteCache = (cacheName) =>
  APP_MANAGED_CACHE_PREFIXES.some(
    (prefix) => cacheName === prefix || cacheName.startsWith(prefix + "-")
  ) || cacheName.startsWith("workbox-");

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("caches" in self) {
        const cacheNames = await caches.keys().catch(() => []);
        await Promise.all(
          cacheNames
            .filter(shouldDeleteCache)
            .map((cacheName) => caches.delete(cacheName).catch(() => false))
        );
      }

      await self.clients.claim();
      await self.registration.unregister().catch(() => false);
    })()
  );
});

self.addEventListener("fetch", () => {});
`;

fs.rmSync(nextDevDir, { recursive: true, force: true });

if (enablePwaInDev) {
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(swPath, placeholderScript, "utf8");

for (const entry of fs.readdirSync(publicDir)) {
  if (/^workbox-.*\.js$/i.test(entry)) {
    fs.rmSync(path.join(publicDir, entry), { force: true });
  }
}

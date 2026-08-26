const PWA_SCRIPT_URL = "/sw.js";
const PWA_PLACEHOLDER_MARKER = "NOOP_PWA_PLACEHOLDER";
const INVALID_PWA_SCRIPT_MARKERS = [
  PWA_PLACEHOLDER_MARKER,
  "registration.unregister",
  "client.navigate(",
  'cacheName": "dev"',
  'cacheName:"dev"',
  "workbox.NetworkOnly",
];

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

const shouldDeleteCache = (cacheName: string) =>
  APP_MANAGED_CACHE_PREFIXES.some(
    (prefix) => cacheName === prefix || cacheName.startsWith(`${prefix}-`)
  ) || cacheName.startsWith("workbox-");

const isInvalidPwaScript = (scriptText: string) =>
  !scriptText ||
  INVALID_PWA_SCRIPT_MARKERS.some((marker) => scriptText.includes(marker));

export const registerPwaServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const response = await fetch(PWA_SCRIPT_URL, {
    cache: "no-store",
    headers: { "Cache-Control": "no-store" },
  }).catch(() => null);

  if (!response?.ok) {
    return;
  }

  const scriptText = await response.text().catch(() => "");
  if (isInvalidPwaScript(scriptText)) {
    return;
  }

  await navigator.serviceWorker.register(PWA_SCRIPT_URL, {
    updateViaCache: "none",
  });
};

export const teardownDisabledPwa = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return { shouldReload: false };
  }

  const hadController = Boolean(navigator.serviceWorker.controller);
  const registrations = await navigator.serviceWorker
    .getRegistrations()
    .catch(() => []);

  const unregisterResults = await Promise.all(
    registrations.map(async (registration) => {
      await registration.update().catch(() => undefined);
      return registration.unregister().catch(() => false);
    })
  );

  if ("caches" in window) {
    const cacheNames = await caches.keys().catch(() => []);
    await Promise.all(
      cacheNames
        .filter((cacheName) => shouldDeleteCache(cacheName))
        .map((cacheName) => caches.delete(cacheName).catch(() => false))
    );
  }

  return { shouldReload: hadController && unregisterResults.some(Boolean) };
};

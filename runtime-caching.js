const defaultRuntimeCaching = require("next-pwa/cache");

const ONE_DAY = 24 * 60 * 60;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;
const APP_PAGES_CACHE = "app-pages-v2";
const NEXT_DATA_CACHE = "next-data-v2";

const OMITTED_DEFAULT_CACHES = new Set([
  "start-url",
  "apis",
  "next-data",
  "others",
]);

const contentRuntimeCaching = [
  {
    // GitHub-backed content should refresh while online and fall back to cache offline.
    urlPattern: ({ sameOrigin, url }) =>
      sameOrigin &&
      (url.pathname.startsWith("/api/content/") || url.pathname.startsWith("/api/proxy")),
    handler: "NetworkFirst",
    options: {
      cacheName: "repo-content",
      expiration: {
        maxEntries: 2000,
        maxAgeSeconds: ONE_MONTH,
      },
      cacheableResponse: {
        statuses: [200],
      },
    },
  },
  {
    // Next.js route data is safe to cache except for auth entry pages,
    // whose payload changes based on current session state.
    urlPattern: ({ sameOrigin, url }) => {
      if (!sameOrigin) return false;

      const match = url.pathname.match(/^\/_next\/data\/[^/]+\/(.+)\.json$/i);
      if (!match) return false;

      const rawPath = `/${match[1]}`.replace(/\/+/g, "/");
      const routePath =
        rawPath === "/index"
          ? "/"
          : rawPath.endsWith("/index")
            ? rawPath.slice(0, -"/index".length) || "/"
            : rawPath;

      return routePath !== "/login" && routePath !== "/signup";
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: NEXT_DATA_CACHE,
      expiration: {
        maxEntries: 500,
        maxAgeSeconds: ONE_WEEK,
      },
      cacheableResponse: {
        statuses: [200],
      },
    },
  },
  {
    // Static images use stale-while-revalidate for instant repeat display.
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)(?:\?.*)?$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 1000,
        maxAgeSeconds: ONE_YEAR,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // Audio is cache-first so playback works immediately offline.
    urlPattern: /\.(?:mp3|wav|ogg|m4a|aac|flac|opus)(?:\?.*)?$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-audio-assets",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: ONE_YEAR,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // Video is cache-first with range request support.
    urlPattern: /\.(?:mp4|m4v|mov|webm|ogv)(?:\?.*)?$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-video-assets",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: ONE_YEAR,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // HTML pages prefer the network so auth and redirects stay current.
    // Login/signup stay uncached to avoid stale session-dependent screens.
    // Do not set a network timeout here: timing out to cached HTML while
    // online can hydrate an old page shell against a newer JS bundle.
    urlPattern: ({ request, sameOrigin, url }) =>
      sameOrigin &&
      request.mode === "navigate" &&
      !url.pathname.startsWith("/api/") &&
      url.pathname !== "/login" &&
      url.pathname !== "/signup",
    handler: "NetworkFirst",
    options: {
      cacheName: APP_PAGES_CACHE,
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: ONE_MONTH,
      },
      cacheableResponse: {
        statuses: [200],
      },
    },
  },
];

module.exports = [
  ...contentRuntimeCaching,
  ...defaultRuntimeCaching.filter(
    (entry) => !OMITTED_DEFAULT_CACHES.has(entry?.options?.cacheName)
  ),
];

const path = require("path");
const runtimeCaching = require("./runtime-caching");
const { clear } = require("console");

const enablePwaInDev = process.env.NEXT_PUBLIC_ENABLE_PWA_DEV === "true";
const shouldDisablePwa =
  process.env.NODE_ENV !== "production" && !enablePwaInDev;

const devWatchIgnored = [
  "**/.git/**",
  "**/.next/**",
  "**/node_modules/**",
  "**/*.log",
  "**/*.tsbuildinfo",
  "**/next-env.d.ts",
  "**/public/sw.js",
  "**/public/workbox-*.js",
  "**/data/users.json",
  "**/data/favorites.json",
  "**/data/offline-subjects.json",
];

const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: shouldDisablePwa,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: false,
  reloadOnOnline: false,
  buildExcludes: [/dynamic-css-manifest\.json$/],
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {},

  // Enable gzip / brotli compression for all responses
  compress: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],

    /*
     * Images served directly from external repositories.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],

    /*
     * The universal shell loads company branding through:
     *
     *   /api/proxy?url=<company repository asset>
     *
     * Next.js Image requires the local proxy URL and its
     * query parameter to be explicitly allowed.
     */
    localPatterns: [
      {
        pathname: "/api/proxy",
      },
    ],

    // Cache optimized images for 1 year
    minimumCacheTTL: 365 * 24 * 60 * 60,

    // Limit concurrent optimization to keep the server responsive
    deviceSizes: [640, 828, 1080, 1200, 1920],

    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Performance-oriented webpack tweaks
  webpack(config, { isServer, dev }) {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: devWatchIgnored,
      };
    }

    if (!dev && !isServer) {
      // Split react-syntax-highlighter (large) into its own chunk
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...(config.optimization.splitChunks?.cacheGroups || {}),

          syntaxHighlighter: {
            test:
              /[\\/]node_modules[\\/](react-syntax-highlighter)[\\/]/,
            name: "syntax-highlighter",
            chunks: "all",
            priority: 20,
          },

          reactIcons: {
            test:
              /[\\/]node_modules[\\/](react-icons)[\\/]/,
            name: "react-icons",
            chunks: "all",
            priority: 15,
          },
        },
      };
    }

    return config;
  },

  // Add cache headers for public assets and auth-sensitive pages.
  async headers() {
    return [
      {
        // Public directory assets (icons, manifest, etc.)
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },

      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },

      {
        source: "/login",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },

      {
        source: "/signup",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },

      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
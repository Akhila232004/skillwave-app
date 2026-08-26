// File: src/lib/readme-utils.ts
import { notifyCacheStorageUpdated } from "./cache-events";
import { writeContentAvailability } from "./content-availability";

export type ParsedTopic = {
  topic_name: string;
  md_url: string;
  bullets?: string[];
  section_markdown?: string;
};

export type ParsedTopicSection = {
  heading: string;
  level: number; // 2 | 3 | 4
  content: string;
};

export type MainCatalogSubjectLink = {
  subject: string;
  readme_url: string;
};

export const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const REPO_CONTENT_CACHE = "repo-content";
const markdownMemoryCache = new Map<string, string>();
const inflightMarkdownRequests = new Map<string, Promise<string>>();

export type RepoTextRequestOptions = {
  strategy?: "cache-first" | "network-first";
  revalidateOnCacheHit?: boolean;
};

export const toRawGithub = (u: string) => {
  const m = (u || "").match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
  );
  if (!m) return u;
  const [, owner, repo, branch, path] = m;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
};

export const buildGithubProxyUrl = (url: string) =>
  `/api/proxy?url=${encodeURIComponent(String(url || ""))}`;

const toAbsoluteRequestUrl = (url: string) => {
  if (typeof window === "undefined") return url;

  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
};

const getRepoTextCacheKeys = (url: string) => {
  const rawUrl = toRawGithub(String(url || "").trim());
  const proxyUrl = buildGithubProxyUrl(rawUrl);

  return Array.from(
    new Set([rawUrl, proxyUrl, toAbsoluteRequestUrl(proxyUrl)].filter(Boolean))
  );
};

export const toGithubProxyUrl = (url: string) => {
  const rawUrl = toRawGithub(String(url || "").trim());
  if (!rawUrl) return "";

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:") {
      return buildGithubProxyUrl(rawUrl);
    }
  } catch {
    return rawUrl;
  }

  return rawUrl;
};

const cleanTitle = (s: string) =>
  (s || "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s*\*\s*https?:\/\/.*$/i, "")
    .replace(/\s*https?:\/\/.*$/i, "")
    .trim();

const stripMdSyntax = (s: string) =>
  (s || "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .trim();

const resolveMaybeRelativeUrl = (url: string, baseUrl?: string) => {
  if (!url) return "";
  const v = url.trim();

  if (/^https?:\/\//i.test(v)) return toRawGithub(v);

  if (baseUrl) {
    try {
      return toRawGithub(new URL(v, baseUrl).toString());
    } catch {
      return v;
    }
  }

  return v;
};

export const resolveMarkdownAssetUrl = (url: string, baseUrl?: string) =>
  resolveMaybeRelativeUrl(url, baseUrl);

const extractMarkdownLinkAnywhere = (
  text: string,
  baseUrl?: string
): { title: string; url: string } | null => {
  const m = (text || "").match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!m) return null;

  const title = cleanTitle(m[1]);
  const url = resolveMaybeRelativeUrl(m[2], baseUrl);

  if (!url) return null;
  return { title, url };
};

const parseBulletsFromSection = (sectionText: string): string[] => {
  const bullets: string[] = [];
  const lines = (sectionText || "").split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line === "---") continue;

    let m = line.match(/^[-*+]\s+(.+)$/);
    if (m) {
      bullets.push(stripMdSyntax(m[1].trim()));
      continue;
    }

    m = line.match(/^\d+\.\s+(.+)$/);
    if (m) {
      bullets.push(stripMdSyntax(m[1].trim()));
      continue;
    }
  }

  return bullets;
};

/**
 * Normalize markdown so inline headings become real lines.
 * Example:
 * "... ## CONTENTS ### [A](a.md) ### [B](b.md)"
 * =>
 * "... \n## CONTENTS\n### [A](a.md)\n### [B](b.md)"
 */
export const normalizeMarkdownForHeadingParsing = (md: string): string => {
  return (md || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Insert newline before inline heading tokens (## / ### / ####...) if not already at line start
    .replace(/([^\n])\s+((?:[-*+]\s+)?#{1,6}\s+)/g, "$1\n$2")
    .replace(/\n{3,}/g, "\n\n");
};

// ✅ Parses main app catalog README (subject list)
// Supports headings like ## [Next JS](...README.md) and inline/minified variants.
export function parseMainCatalogReadme(md: string): MainCatalogSubjectLink[] {
  const normalizedMd = normalizeMarkdownForHeadingParsing(md);

  const lines = normalizedMd
    .split("\n")
    .map((l) => l.trim());

  const results: MainCatalogSubjectLink[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)$/);
    if (!h2) continue;

    const link = extractMarkdownLinkAnywhere(h2[1].trim());
    if (!link) continue;

    const key = `${normalize(link.title)}|${link.url}`;
    if (seen.has(key)) continue;

    results.push({
      subject: link.title,
      readme_url: toRawGithub(link.url),
    });
    seen.add(key);
  }

  return results;
}

/**
 * ✅ Subject README topic parser
 * Supports topic headings with 2 / 3 / 4 hashes:
 * - ## [Topic](./topic.md)
 * - ### [Topic](./topic.md)
 * - #### [Topic](./topic.md)
 * - * ### [Topic](./topic.md)
 * - * #### [Topic](./topic.md)
 *
 * Rules:
 * - Heading must contain markdown link to an .md file
 * - Works even if README is single-line/minified (inline headings)
 */
export function parseSubjectTopicsFromReadme(
  md: string,
  subjectReadmeUrl?: string
): ParsedTopic[] {
  const rawMd = (md || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = rawMd.split("\n");
  const normalizedMd = normalizeMarkdownForHeadingParsing(rawMd);
  const lines = rawLines.length > 1 ? rawLines : normalizedMd.split("\n");

  type Hit = {
    index: number;
    level: number; // 2 | 3 | 4
    indent: number;
    title: string;
    url: string;
  };

  const hits: Hit[] = [];
  const seen = new Set<string>();

  // ✅ CHANGED: #{2,3} -> #{2,4}
  const TOPIC_HEADING_RE = /^(?:[-*+]\s+)?(#{2,4})\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] || "";
    const line = rawLine.trim();
    if (!line) continue;

    const h = line.match(TOPIC_HEADING_RE);
    if (!h) continue;

    const level = h[1].length; // 2 / 3 / 4
    const indent = (rawLine.match(/^\s*/) || [""])[0].length;
    const headingBody = h[2].trim();

    const mdLink = extractMarkdownLinkAnywhere(headingBody, subjectReadmeUrl);
    if (!mdLink) continue;

    const title = cleanTitle(mdLink.title);
    const url = toRawGithub(mdLink.url);

    // only markdown links
    if (!title || !url || !/\.md(\?|#|$)/i.test(url)) continue;

    const key = `${normalize(title)}|${url}`;
    if (seen.has(key)) continue;

    seen.add(key);
    hits.push({
      index: i,
      level,
      indent,
      title,
      url,
    });
  }

  if (!hits.length) return [];

  const topics: ParsedTopic[] = [];

  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const start = hit.index + 1;
    let end = lines.length;

    for (let j = i + 1; j < hits.length; j++) {
      const nextHit = hits[j];

      // Nested indented headings belong to the current parent section.
      if (nextHit.indent > hit.indent) continue;
      if (nextHit.level > hit.level) continue;

      end = nextHit.index;
      break;
    }

    const sectionContent = lines.slice(start, end).join("\n").trim();
    const bullets = parseBulletsFromSection(sectionContent);

    topics.push({
      topic_name: hit.title,
      md_url: hit.url,
      bullets,
      section_markdown: sectionContent,
    });
  }

  return topics;
}

/**
 * ✅ Topic page section parser (for rendering sub-sections / TOC)
 * Supports headings with 2 / 3 / 4 hashes.
 *
 * If no 2/3/4 headings are found, returns the full content as one section
 * so inconsistent markdown files are still rendered from the source content.
 */
export function parseTopicSectionsFromMarkdown(md: string): ParsedTopicSection[] {
  const normalizedMd = normalizeMarkdownForHeadingParsing(md);
  const lines = normalizedMd.split("\n");

  type Hit = {
    index: number;
    level: number;
    heading: string;
  };

  const hits: Hit[] = [];

  // ✅ CHANGED: #{2,3} -> #{2,4}
  const HEADING_RE = /^(#{2,4})\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] || "").trim();
    if (!line) continue;

    const m = line.match(HEADING_RE);
    if (!m) continue;

    const level = m[1].length;
    const heading = stripMdSyntax(cleanTitle(m[2]));

    if (!heading) continue;

    hits.push({ index: i, level, heading });
  }

  // No headings: render the full GitHub markdown as one content section.
  if (!hits.length) {
    const full = normalizedMd.trim();
    return full
      ? [
          {
            heading: "Content",
            level: 2,
            content: full,
          },
        ]
      : [];
  }

  const sections: ParsedTopicSection[] = [];

  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const start = hit.index + 1;
    const end = i + 1 < hits.length ? hits[i + 1].index : lines.length;

    sections.push({
      heading: hit.heading,
      level: hit.level,
      content: lines.slice(start, end).join("\n").trim(),
    });
  }

  return sections;
}

export const extractMarkdownAssetUrls = (md: string, baseUrl?: string): string[] => {
  const urls = new Set<string>();
  const source = md || "";

  const addUrl = (value: string) => {
    const resolved = resolveMaybeRelativeUrl(value, baseUrl);
    if (!resolved || resolved.startsWith("data:")) return;
    urls.add(resolved);
  };

  const markdownImageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;

  let match: RegExpExecArray | null = null;

  while ((match = markdownImageRegex.exec(source))) {
    const rawTarget = String(match[1] || "")
      .trim()
      .replace(/\s+["'][^"']*["']\s*$/, "")
      .replace(/^<|>$/g, "");
    addUrl(rawTarget);
  }

  while ((match = htmlImageRegex.exec(source))) {
    addUrl(match[1] || "");
  }

  return Array.from(urls);
};

const getRepoAssetCacheName = (url: string) => {
  if (typeof window === "undefined") return REPO_CONTENT_CACHE;

  try {
    const absoluteUrl = new URL(toAbsoluteRequestUrl(url));
    if (absoluteUrl.origin === window.location.origin && absoluteUrl.pathname.startsWith("/api/proxy")) {
      return REPO_CONTENT_CACHE;
    }
  } catch {
    // keep GitHub assets in the repo-content cache by default
  }

  return REPO_CONTENT_CACHE;
};

const cacheMarkdownAssetUrls = async (md: string, baseUrl: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return;

  const assetUrls = extractMarkdownAssetUrls(md, baseUrl)
    .map((url) => toGithubProxyUrl(url))
    .filter(Boolean);

  await Promise.allSettled(
    Array.from(new Set(assetUrls)).map(async (url) => {
      const absoluteUrl = toAbsoluteRequestUrl(url);
      const response = await fetch(absoluteUrl, {
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Cache-Control": "no-store",
        },
      });

      if (!response.ok) return;

      const cacheName = getRepoAssetCacheName(url);
      const cache = await caches.open(cacheName);
      await cache.put(absoluteUrl, response.clone());
      notifyCacheStorageUpdated({ cacheName, url: absoluteUrl });
    })
  );
};

export const readCachedRepoText = async (url: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return null;

  try {
    const cache = await caches.open(REPO_CONTENT_CACHE);
    for (const key of getRepoTextCacheKeys(url)) {
      const cached = await cache.match(key, { ignoreSearch: false });
      if (!cached?.ok) {
        continue;
      }

      const text = await cached.text();
      if (text) {
        return text;
      }
    }
  } catch {
    return null;
  }

  return null;
};

const ASSET_CACHE_NAMES = ["repo-content", "static-image-assets"];

const getAssetCacheKeys = (url: string) => {
  const proxyUrl = toGithubProxyUrl(String(url || "").trim());

  return Array.from(
    new Set([proxyUrl, toAbsoluteRequestUrl(proxyUrl)].filter(Boolean))
  );
};

export const hasCachedMarkdownAssetUrls = async (md: string, baseUrl?: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return false;

  const assetUrls = extractMarkdownAssetUrls(md, baseUrl);
  if (assetUrls.length === 0) return true;

  for (const assetUrl of assetUrls) {
    const keys = getAssetCacheKeys(assetUrl);
    let matched = false;

    for (const cacheName of ASSET_CACHE_NAMES) {
      const cache = await caches.open(cacheName);

      for (const key of keys) {
        const cached = await cache.match(key, { ignoreSearch: false });
        if (cached && (cached.ok || cached.type === "opaque")) {
          matched = true;
          break;
        }
      }

      if (matched) break;
    }

    if (!matched) return false;
  }

  return true;
};

const writeCachedRepoText = async (url: string, response: Response) => {
  if (typeof window === "undefined" || !("caches" in window) || !response.ok) return;

  try {
    const cache = await caches.open(REPO_CONTENT_CACHE);
    const textForAssets = await response.clone().text().catch(() => "");
    if (textForAssets) {
      await cacheMarkdownAssetUrls(textForAssets, url);
    }

    await Promise.all(
      getRepoTextCacheKeys(url).map((key) => cache.put(key, response.clone()))
    );
    notifyCacheStorageUpdated({ cacheName: REPO_CONTENT_CACHE, url });
  } catch {
    // ignore cache write failures
  }
};

export const cacheRepoTextValue = async (url: string, text: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return;

  try {
    const cache = await caches.open(REPO_CONTENT_CACHE);
    await cacheMarkdownAssetUrls(text, url);

    const response = new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

    await Promise.all(
      getRepoTextCacheKeys(url).map((key) => cache.put(key, response.clone()))
    );
    notifyCacheStorageUpdated({ cacheName: REPO_CONTENT_CACHE, url });
  } catch {
    // ignore cache write failures
  }
};

const fetchRepoTextFromNetwork = async (url: string, signal?: AbortSignal) => {
  const proxyUrl = buildGithubProxyUrl(url);
  const response = await fetch(proxyUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-store",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Fetch failed (HTTP ${response.status}) for ${proxyUrl}`);
  }

  await writeCachedRepoText(url, response);
  const text = await response.text();
  markdownMemoryCache.set(proxyUrl, text);
  return text;
};

const requestRepoTextFromNetwork = (url: string, signal?: AbortSignal) => {
  const proxyUrl = buildGithubProxyUrl(url);
  const existing = inflightMarkdownRequests.get(proxyUrl);
  if (existing) {
    return existing;
  }

  const request = fetchRepoTextFromNetwork(url, signal).finally(() => {
    inflightMarkdownRequests.delete(proxyUrl);
  });

  inflightMarkdownRequests.set(proxyUrl, request);
  return request;
};

const revalidateRepoText = (url: string) => {
  if (
    typeof window === "undefined" ||
    !navigator.onLine
  ) {
    return;
  }

  void requestRepoTextFromNetwork(url).catch(async (error) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    const cachedText = await readCachedRepoText(url);
    if (cachedText) {
      markdownMemoryCache.set(buildGithubProxyUrl(toRawGithub(url)), cachedText);
      writeContentAvailability(true);
    }
  });
};

export async function fetchTextStrict(
  url: string,
  signal?: AbortSignal,
  options?: RepoTextRequestOptions
): Promise<string> {
  const rawUrl = toRawGithub(url);
  const proxyUrl = buildGithubProxyUrl(rawUrl);
  const strategy = options?.strategy || "network-first";
  const revalidateOnCacheHit = options?.revalidateOnCacheHit ?? true;

  if (strategy === "cache-first") {
    const memoized = markdownMemoryCache.get(proxyUrl);
    if (typeof memoized === "string") {
      if (revalidateOnCacheHit) {
        revalidateRepoText(rawUrl);
      }
      return memoized;
    }

    const cachedText = await readCachedRepoText(rawUrl);
    if (cachedText) {
      markdownMemoryCache.set(proxyUrl, cachedText);
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        writeContentAvailability(true);
      }
      if (revalidateOnCacheHit) {
        revalidateRepoText(rawUrl);
      }
      return cachedText;
    }
  }

  try {
    return await requestRepoTextFromNetwork(rawUrl, signal);
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      const cachedText = await readCachedRepoText(rawUrl);
      if (cachedText) {
        markdownMemoryCache.set(proxyUrl, cachedText);
        writeContentAvailability(true);
        return cachedText;
      }
    }

    throw error;
  }
}

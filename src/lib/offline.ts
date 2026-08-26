import { normalizeLibraryUserKey } from "./library";
import { notifyCacheStorageUpdated } from "./cache-events";
import {
  cacheRepoTextValue,
  extractMarkdownAssetUrls,
  toGithubProxyUrl,
  toRawGithub,
} from "./readme-utils";

export const CACHE_NAME = "repo-content";
const STATIC_IMAGE_CACHE = "static-image-assets";

const OFFLINE_SUBJECTS_STORAGE_PREFIX = "offline_subjects_";
const OFFLINE_SUBJECTS_STORAGE_FALLBACK = "offline_subjects";
const LEGACY_OFFLINE_SUBJECT_PREFIX = "offline_subject_";

type OfflineTopic = {
  topic_name: string;
  md_url: string;
  bullets?: string[];
  section_markdown?: string;
};

export type OfflineSubjectMeta = {
  subject: string;
  savedAt: number;
  topicCount: number;
  topics: OfflineTopic[];
  subject_readme_url?: string;
};

type CacheProgressListener = (done: number, total: number) => void;

const toAbsoluteUrl = (href: string) => new URL(href, window.location.origin).toString();

const getImageCacheName = (url: string) => {
  try {
    const absoluteUrl = new URL(toAbsoluteUrl(url));
    if (absoluteUrl.origin === window.location.origin && absoluteUrl.pathname.startsWith("/api/proxy")) {
      return CACHE_NAME;
    }
  } catch {
    // fall through to the static image cache
  }

  return STATIC_IMAGE_CACHE;
};

const cacheStaticAsset = async (url: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return;

  const absoluteUrl = toAbsoluteUrl(url);
  const targetUrl = new URL(absoluteUrl);
  const sameOrigin = targetUrl.origin === window.location.origin;

  const response = await fetch(
    absoluteUrl,
    sameOrigin
      ? {
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            "Cache-Control": "no-store",
          },
        }
      : {
          cache: "no-store",
          credentials: "omit",
          mode: "no-cors",
        }
  );

  if (!response.ok && response.type !== "opaque") {
    throw new Error(`Failed to cache asset ${absoluteUrl} (${response.status})`);
  }

  const cacheName = getImageCacheName(url);
  const cache = await caches.open(cacheName);
  await cache.put(absoluteUrl, response.clone());
  notifyCacheStorageUpdated({ cacheName, url: absoluteUrl });
};

export const cacheAssetUrls = async (urls: string[]) => {
  const uniqueUrls = Array.from(
    new Set(urls.map((url) => toGithubProxyUrl(String(url || "").trim())).filter(Boolean))
  );

  const savedAssetUrls: string[] = [];
  const failedAssetUrls: string[] = [];

  if (typeof window === "undefined" || !("caches" in window)) {
    return { savedAssetUrls, failedAssetUrls: uniqueUrls };
  }

  for (const url of uniqueUrls) {
    try {
      await cacheStaticAsset(url);
      savedAssetUrls.push(url);
    } catch {
      failedAssetUrls.push(url);
    }
  }

  return { savedAssetUrls, failedAssetUrls };
};

const resolveOfflineSubjectsStorageKey = (accountKey?: string) => {
  const normalized = normalizeLibraryUserKey(accountKey);
  return normalized
    ? `${OFFLINE_SUBJECTS_STORAGE_PREFIX}${normalized}`
    : OFFLINE_SUBJECTS_STORAGE_FALLBACK;
};

const normalizeOfflineTopic = (value: unknown): OfflineTopic | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const topic_name = String(record.topic_name || "").trim();
  const md_url = String(record.md_url || "").trim();

  if (!topic_name || !md_url) {
    return null;
  }

  return {
    topic_name,
    md_url,
    bullets: Array.isArray(record.bullets)
      ? record.bullets.filter((item): item is string => typeof item === "string")
      : undefined,
    section_markdown:
      typeof record.section_markdown === "string" ? record.section_markdown : undefined,
  };
};

const normalizeOfflineSubjectMeta = (value: unknown): OfflineSubjectMeta | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const subject = String(record.subject || "").trim();
  const savedAt = Number(record.savedAt);
  const topicCount = Number(record.topicCount);
  const topics = Array.isArray(record.topics)
    ? record.topics
        .map((item) => normalizeOfflineTopic(item))
        .filter((item): item is OfflineTopic => Boolean(item))
    : [];

  if (!subject || !Number.isFinite(savedAt)) {
    return null;
  }

  return {
    subject,
    savedAt,
    topicCount: Number.isFinite(topicCount) ? topicCount : topics.length,
    topics,
    subject_readme_url:
      typeof record.subject_readme_url === "string" ? record.subject_readme_url : undefined,
  };
};

const readOfflineSubjects = (accountKey?: string): OfflineSubjectMeta[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(resolveOfflineSubjectsStorageKey(accountKey));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => normalizeOfflineSubjectMeta(entry))
      .filter((entry): entry is OfflineSubjectMeta => Boolean(entry))
      .sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
};

const writeOfflineSubjects = (items: OfflineSubjectMeta[], accountKey?: string) => {
  if (typeof window === "undefined") return [];

  const normalized = items
    .map((entry) => normalizeOfflineSubjectMeta(entry))
    .filter((entry): entry is OfflineSubjectMeta => Boolean(entry))
    .sort((a, b) => b.savedAt - a.savedAt);

  localStorage.setItem(
    resolveOfflineSubjectsStorageKey(accountKey),
    JSON.stringify(normalized)
  );

  return normalized;
};

export const readOfflineSubjectMeta = (subject: string, accountKey?: string) => {
  const normalizedSubject = String(subject || "")
    .trim()
    .toLowerCase();

  if (!normalizedSubject) return null;

  return (
    readOfflineSubjects(accountKey).find(
      (entry) => entry.subject.trim().toLowerCase() === normalizedSubject
    ) || null
  );
};

export const writeOfflineSubjectMeta = (meta: OfflineSubjectMeta, accountKey?: string) => {
  const normalized = normalizeOfflineSubjectMeta(meta);
  if (!normalized) return readOfflineSubjects(accountKey);

  const next = [
    normalized,
    ...readOfflineSubjects(accountKey).filter(
      (entry) => entry.subject.trim().toLowerCase() !== normalized.subject.trim().toLowerCase()
    ),
  ];

  return writeOfflineSubjects(next, accountKey);
};

export const hydrateOfflineSubjectsForAccount = (
  items: OfflineSubjectMeta[],
  accountKey?: string
) => writeOfflineSubjects(items, accountKey);

export const migrateLegacyOfflineSubjects = (accountKey?: string) => {
  if (typeof window === "undefined") return;

  const legacyKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith(LEGACY_OFFLINE_SUBJECT_PREFIX)
  );

  if (legacyKeys.length === 0) return;

  const migrated = [...readOfflineSubjects(accountKey)];

  for (const key of legacyKeys) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      const normalized = normalizeOfflineSubjectMeta(parsed);
      if (!normalized) continue;

      migrated.push(normalized);
      localStorage.removeItem(key);
    } catch {
      // ignore malformed legacy entries
    }
  }

  writeOfflineSubjects(migrated, accountKey);
};

export const cacheTextUrls = async (
  urls: string[],
  fetcher: (url: string) => Promise<string>,
  onProgress?: CacheProgressListener
) => {
  const uniqueUrls = Array.from(
    new Set(
      urls
        .map((url) => toRawGithub(String(url || "").trim()))
        .filter(Boolean)
    )
  );

  const savedUrls: string[] = [];
  const failedUrls: string[] = [];
  const discoveredAssetUrls = new Set<string>();
  const savedAssetUrls: string[] = [];
  const failedAssetUrls: string[] = [];
  let done = 0;

  if (typeof window === "undefined" || !("caches" in window)) {
    return { savedUrls, failedUrls: uniqueUrls, savedAssetUrls, failedAssetUrls };
  }

  for (const url of uniqueUrls) {
    try {
      const text = await fetcher(url);
      await cacheRepoTextValue(url, text);
      savedUrls.push(url);

      extractMarkdownAssetUrls(text, url).forEach((assetUrl) => {
        const normalizedAssetUrl = toGithubProxyUrl(assetUrl);
        if (normalizedAssetUrl) {
          discoveredAssetUrls.add(normalizedAssetUrl);
        }
      });
    } catch {
      failedUrls.push(url);
    } finally {
      done += 1;
      onProgress?.(done, uniqueUrls.length);
    }
  }

  const assetResult = await cacheAssetUrls(Array.from(discoveredAssetUrls));
  savedAssetUrls.push(...assetResult.savedAssetUrls);
  failedAssetUrls.push(...assetResult.failedAssetUrls);

  return {
    savedUrls,
    failedUrls,
    savedAssetUrls,
    failedAssetUrls,
  };
};

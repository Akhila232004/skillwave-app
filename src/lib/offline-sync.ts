import type { NextRouter } from "next/router";

import {
  fetchCbtCollections,
  fetchContentRepoStatus,
  fetchCourseSubjects,
  fetchDashboardCards,
  fetchDesignConfig,
  fetchInterviewQuestion,
  fetchInterviewQuestions,
  fetchMediaItem,
  fetchSlideshow,
  fetchTickerItems,
  hasCachedContentUrl,
} from "./content-client";
import { notifyCacheStorageUpdated } from "./cache-events";
import {
  extractMarkdownAssetUrls,
  fetchTextStrict,
  hasCachedMarkdownAssetUrls,
  readCachedRepoText,
  toGithubProxyUrl,
} from "./readme-utils";

const APP_PAGES_CACHE = "app-pages-v2";
const REPO_CONTENT_CACHE = "repo-content";
const STATIC_IMAGE_CACHE = "static-image-assets";
const STATIC_AUDIO_CACHE = "static-audio-assets";
const STATIC_VIDEO_CACHE = "static-video-assets";
const OFFLINE_SYNC_STATE_KEY = "tinitiate.offline.sync-state";
const OFFLINE_SYNC_VERSION = 3;
export const OFFLINE_SYNC_STATE_EVENT = "tinitiate:offline-sync-state";
const CORE_SECTION_ROUTES = ["/dashboard", "/courses", "/interview", "/cbt"] as const;
const CORE_SECTION_CONTENT_URLS = [
  "/api/content/design",
  "/api/content/courses",
  "/api/content/interview",
  "/api/content/cbt",
  "/api/content/dashboard-cards",
] as const;

type OfflineSyncState = {
  version?: number;
  syncedAt: number;
  contentUpdatedAt: string | null;
  contentCommitSha: string | null;
  routeCount: number;
  markdownCount: number;
  detailCount: number;
  status: "ready" | "failed";
  error?: string;
};

let activeSync: Promise<void> | null = null;
const ROUTE_SYNC_CONCURRENCY = 4;
const DETAIL_SYNC_CONCURRENCY = 3;
const ASSET_SYNC_CONCURRENCY = 4;

const toAbsoluteUrl = (href: string) => new URL(href, window.location.origin).toString();
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown sync error";

const hasCurrentOfflineWorkspace = (
  existingState: OfflineSyncState | null,
  statusInfo: { updatedAt: string | null; commitSha: string | null }
) => {
  if (!existingState || existingState.status !== "ready") {
    return false;
  }

  if (existingState.version !== OFFLINE_SYNC_VERSION) {
    return false;
  }

  if (statusInfo.commitSha && existingState.contentCommitSha) {
    return existingState.contentCommitSha === statusInfo.commitSha;
  }

  if (statusInfo.updatedAt && existingState.contentUpdatedAt) {
    return existingState.contentUpdatedAt === statusInfo.updatedAt;
  }

  return false;
};

const getImageCacheName = (url: string) => {
  if (typeof window === "undefined") return STATIC_IMAGE_CACHE;

  try {
    const absoluteUrl = new URL(toAbsoluteUrl(url));
    if (absoluteUrl.origin === window.location.origin && absoluteUrl.pathname.startsWith("/api/proxy")) {
      return REPO_CONTENT_CACHE;
    }
  } catch {
    // ignore malformed URLs and use the normal image cache
  }

  return STATIC_IMAGE_CACHE;
};

const writeOfflineSyncState = (state: OfflineSyncState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(OFFLINE_SYNC_STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(OFFLINE_SYNC_STATE_EVENT, { detail: state }));
};

export const readOfflineSyncState = (): OfflineSyncState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(OFFLINE_SYNC_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OfflineSyncState;
  } catch {
    return null;
  }
};

const runWithConcurrency = async <T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  concurrency = 6
) => {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (typeof item === "undefined") return;
      await worker(item);
    }
  });

  await Promise.all(runners);
};

const cacheRouteHtml = async (href: string) => {
  if (typeof window === "undefined" || !("caches" in window)) return;

  const absoluteUrl = toAbsoluteUrl(href);
  const response = await fetch(absoluteUrl, {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "Cache-Control": "no-store",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to cache route ${href} (${response.status})`);
  }

  const cache = await caches.open(APP_PAGES_CACHE);
  await cache.put(absoluteUrl, response.clone());
  notifyCacheStorageUpdated({ cacheName: APP_PAGES_CACHE, url: absoluteUrl });
};

const cacheStaticAsset = async (url: string, cacheName: string) => {
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

  const cache = await caches.open(cacheName);
  await cache.put(absoluteUrl, response.clone());
  notifyCacheStorageUpdated({ cacheName, url: absoluteUrl });
};

const hasCachedRequestInCaches = async (url: string, cacheNames: string[]) => {
  if (typeof window === "undefined" || !("caches" in window)) return false;

  const urls = Array.from(new Set([url, toAbsoluteUrl(url)].filter(Boolean)));

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);

    for (const cacheUrl of urls) {
      const cached = await cache.match(cacheUrl, { ignoreSearch: false });
      if (cached && (cached.ok || cached.type === "opaque")) {
        return true;
      }
    }
  }

  return false;
};

const verifyOfflineWorkspaceCaches = async ({
  routeHrefs,
  contentUrls,
  markdownUrls,
  imageUrls,
  audioUrls,
  videoUrls,
}: {
  routeHrefs: Set<string>;
  contentUrls: Set<string>;
  markdownUrls: Set<string>;
  imageUrls: Set<string>;
  audioUrls: Set<string>;
  videoUrls: Set<string>;
}) => {
  if (typeof window === "undefined" || !("caches" in window)) {
    throw new Error("Cache Storage is not available.");
  }

  const missing: string[] = [];
  const appCache = await caches.open(APP_PAGES_CACHE);

  for (const href of routeHrefs) {
    const cached = await appCache.match(toAbsoluteUrl(href), { ignoreSearch: false });
    if (!cached?.ok) {
      missing.push(`route ${href}`);
    }
  }

  for (const url of contentUrls) {
    if (!(await hasCachedContentUrl(url))) {
      missing.push(`content ${url}`);
    }
  }

  for (const url of markdownUrls) {
    const cachedText = await readCachedRepoText(url);
    if (!cachedText) {
      missing.push(`markdown ${url}`);
      continue;
    }

    if (!(await hasCachedMarkdownAssetUrls(cachedText, url))) {
      missing.push(`markdown assets ${url}`);
    }
  }

  for (const url of imageUrls) {
    if (!(await hasCachedRequestInCaches(url, [REPO_CONTENT_CACHE, STATIC_IMAGE_CACHE]))) {
      missing.push(`image ${url}`);
    }
  }

  for (const url of audioUrls) {
    if (!(await hasCachedRequestInCaches(url, [STATIC_AUDIO_CACHE]))) {
      missing.push(`audio ${url}`);
    }
  }

  for (const url of videoUrls) {
    if (!(await hasCachedRequestInCaches(url, [STATIC_VIDEO_CACHE]))) {
      missing.push(`video ${url}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing cached workspace items: ${missing.slice(0, 5).join(" | ")}`);
  }
};

const prefetchRoute = async (router: NextRouter | null, href: string) => {
  if (!router?.prefetch) return;

  try {
    await router.prefetch(href);
  } catch {
    // ignore route prefetch failures
  }
};

const verifyCoreOfflineSections = async () => {
  const missingContentUrls: string[] = [];

  for (const url of CORE_SECTION_CONTENT_URLS) {
    const cached = await hasCachedContentUrl(url);
    if (!cached) {
      missingContentUrls.push(url);
    }
  }

  if (missingContentUrls.length > 0) {
    throw new Error(`Missing cached core content: ${missingContentUrls.join(", ")}`);
  }

  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  const cache = await caches.open(APP_PAGES_CACHE);
  const missingRoutes: string[] = [];

  for (const href of CORE_SECTION_ROUTES) {
    const match = await cache.match(toAbsoluteUrl(href), { ignoreSearch: false });
    if (!match?.ok) {
      missingRoutes.push(href);
    }
  }

  if (missingRoutes.length > 0) {
    throw new Error(`Missing cached core routes: ${missingRoutes.join(", ")}`);
  }
};

export async function syncCoreOfflineSections(router?: NextRouter | null) {
  if (
    typeof window === "undefined" ||
    !navigator.onLine
  ) {
    return;
  }

  await Promise.all([
    fetchDesignConfig(undefined, { strategy: "network-first" }),
    fetchCourseSubjects(undefined, { strategy: "network-first" }),
    fetchInterviewQuestions(undefined, { strategy: "network-first" }),
    fetchCbtCollections(undefined, { strategy: "network-first" }),
    fetchDashboardCards(undefined, { strategy: "network-first" }),
  ]);

  await Promise.allSettled([
    fetchTickerItems(undefined, { strategy: "network-first" }),
    fetchContentRepoStatus(undefined, { strategy: "network-first" }),
  ]);

  await runWithConcurrency(
    [...CORE_SECTION_ROUTES],
    async (href) => {
      await prefetchRoute(router || null, href);
      await cacheRouteHtml(href);
    },
    CORE_SECTION_ROUTES.length
  );

  await verifyCoreOfflineSections();
}

export async function syncOfflineWorkspace(router?: NextRouter | null) {
  if (typeof window !== "undefined" && !navigator.onLine) {
    return;
  }

  if (activeSync) {
    return activeSync;
  }

  activeSync = (async () => {
    const syncFailures: string[] = [];
    const syncWarnings: string[] = [];
    const rememberFailure = (label: string, error: unknown) => {
      syncFailures.push(`${label}: ${getErrorMessage(error)}`);
    };
    const rememberWarning = (label: string, error: unknown) => {
      syncWarnings.push(`${label}: ${getErrorMessage(error)}`);
    };
    let statusInfo = {
      updatedAt: null as string | null,
      commitSha: null as string | null,
    };

    try {
      const nextStatusInfo = await fetchContentRepoStatus(undefined, { strategy: "network-first" });
      statusInfo = {
        updatedAt: nextStatusInfo.updatedAt,
        commitSha: nextStatusInfo.commitSha,
      };
    } catch (error) {
      rememberWarning("Content repo status", error);
    }

    if (hasCurrentOfflineWorkspace(readOfflineSyncState(), statusInfo)) {
      return;
    }

    await fetchTickerItems(undefined, { strategy: "network-first" }).catch((error) => {
      rememberWarning("Ticker", error);
    });

    let design: Awaited<ReturnType<typeof fetchDesignConfig>>;
    let courses: Awaited<ReturnType<typeof fetchCourseSubjects>>;
    let interviewSummaries: Awaited<ReturnType<typeof fetchInterviewQuestions>>;
    let cbtCollections: Awaited<ReturnType<typeof fetchCbtCollections>>;
    let dashboardCards: Awaited<ReturnType<typeof fetchDashboardCards>>;

    try {
      [design, courses, interviewSummaries, cbtCollections, dashboardCards] = await Promise.all([
        fetchDesignConfig(undefined, { strategy: "network-first" }),
        fetchCourseSubjects(undefined, { strategy: "network-first" }),
        fetchInterviewQuestions(undefined, { strategy: "network-first" }),
        fetchCbtCollections(undefined, { strategy: "network-first" }),
        fetchDashboardCards(undefined, { strategy: "network-first" }),
      ]);
    } catch (error) {
      writeOfflineSyncState({
        version: OFFLINE_SYNC_VERSION,
        syncedAt: Date.now(),
        contentUpdatedAt: statusInfo.updatedAt,
        contentCommitSha: statusInfo.commitSha,
        routeCount: 0,
        markdownCount: 0,
        detailCount: 0,
        status: "failed",
        error:
          syncWarnings.length > 0
            ? `${syncWarnings.slice(0, 5).join(" | ")} | ${getErrorMessage(error)}`
            : getErrorMessage(error),
      });

      throw error;
    }

    const routeHrefs = new Set<string>([
      "/",
      "/login",
      "/signup",
      "/dashboard",
      "/courses",
      "/interview",
      "/cbt",
    ]);
    const markdownUrls = new Set<string>();
    const imageUrls = new Set<string>();
    const audioUrls = new Set<string>();
    const videoUrls = new Set<string>();
    const contentUrls = new Set<string>(CORE_SECTION_CONTENT_URLS);
    const primaryContentTasks: Array<() => Promise<void>> = [];
    const detailTasks: Array<() => Promise<void>> = [];
    let cachedRouteCount = 0;

    const addImageUrl = (url: string | undefined) => {
      const normalizedUrl = toGithubProxyUrl(String(url || ""));
      if (normalizedUrl) {
        imageUrls.add(normalizedUrl);
      }
    };

    Object.values(design.courseIcons || {}).forEach((entry) => {
      if (entry?.iconUrl) {
        addImageUrl(entry.iconUrl);
      }
    });

    dashboardCards.forEach((topic) => {
      topic.slides.forEach((slide) => addImageUrl(slide.imageUrl));
    });

    for (const course of courses) {
      const readmeUrl = course.readme_url || "";
      const subjectHref = `/subject/${encodeURIComponent(course.subject)}${
        readmeUrl ? `?readme=${encodeURIComponent(readmeUrl)}` : ""
      }`;

      routeHrefs.add(subjectHref);
      if (course.icon_url) {
        addImageUrl(course.icon_url);
      }

      if (readmeUrl) {
        markdownUrls.add(readmeUrl);
        primaryContentTasks.push(async () => {
          try {
            const readmeMarkdown = await fetchTextStrict(readmeUrl, undefined, {
              strategy: "network-first",
            });
            extractMarkdownAssetUrls(readmeMarkdown, readmeUrl).forEach(addImageUrl);
          } catch (error) {
            rememberFailure(`Subject README ${course.subject}`, error);
          }
        });
      }

      for (const topic of course.topics || []) {
        routeHrefs.add(
          `/topic/${encodeURIComponent(topic.topic_name)}?subject=${encodeURIComponent(
            course.subject
          )}${readmeUrl ? `&readme=${encodeURIComponent(readmeUrl)}` : ""}`
        );

        if (!topic.md_url) {
          continue;
        }

        markdownUrls.add(topic.md_url);
        detailTasks.push(async () => {
          try {
            const topicMarkdown = await fetchTextStrict(topic.md_url, undefined, {
              strategy: "network-first",
            });
            extractMarkdownAssetUrls(topicMarkdown, topic.md_url).forEach(addImageUrl);
          } catch (error) {
            rememberFailure(`Topic ${course.subject} / ${topic.topic_name}`, error);
          }
        });
      }
    }

    for (const item of interviewSummaries) {
      routeHrefs.add(`/interview/${encodeURIComponent(item.slug)}`);
      contentUrls.add(`/api/content/interview/${encodeURIComponent(item.slug)}`);
      primaryContentTasks.push(async () => {
        try {
          const detail = await fetchInterviewQuestion(item.slug, undefined, {
            strategy: "network-first",
          });
          extractMarkdownAssetUrls(detail.markdown, detail.markdown_url).forEach(addImageUrl);
        } catch (error) {
          rememberFailure(`Interview detail ${item.slug}`, error);
        }
      });
    }

    for (const deck of cbtCollections.slideshows) {
      routeHrefs.add(`/cbt/slides/${encodeURIComponent(deck.slug)}`);
      contentUrls.add(`/api/content/slideshows/${encodeURIComponent(deck.slug)}`);
      primaryContentTasks.push(async () => {
        try {
          const slideshow = await fetchSlideshow(deck.slug, undefined, {
            strategy: "network-first",
          });
          extractMarkdownAssetUrls(slideshow.markdown, slideshow.markdown_url).forEach(addImageUrl);
        } catch (error) {
          rememberFailure(`Slideshow ${deck.slug}`, error);
        }
      });
    }

    for (const item of cbtCollections.trainingVideos) {
      routeHrefs.add(
        `/cbt/media/${encodeURIComponent(item.slug)}?kind=${encodeURIComponent("training-videos")}`
      );
      contentUrls.add(
        `/api/content/media/${encodeURIComponent("training-videos")}/${encodeURIComponent(
          item.slug
        )}`
      );
      primaryContentTasks.push(async () => {
        try {
          const mediaItem = await fetchMediaItem("training-videos", item.slug, undefined, {
            strategy: "network-first",
          });
          if (mediaItem.mediaUrl) {
            videoUrls.add(mediaItem.mediaUrl);
          }
          if (mediaItem.posterUrl) {
            addImageUrl(mediaItem.posterUrl);
          }
          extractMarkdownAssetUrls(mediaItem.notesMarkdown || "", mediaItem.notesMarkdownUrl).forEach(addImageUrl);
        } catch (error) {
          rememberFailure(`Training video ${item.slug}`, error);
        }
      });
    }

    for (const item of cbtCollections.audioBooks) {
      routeHrefs.add(
        `/cbt/media/${encodeURIComponent(item.slug)}?kind=${encodeURIComponent("audio-books")}`
      );
      contentUrls.add(
        `/api/content/media/${encodeURIComponent("audio-books")}/${encodeURIComponent(item.slug)}`
      );
      primaryContentTasks.push(async () => {
        try {
          const mediaItem = await fetchMediaItem("audio-books", item.slug, undefined, {
            strategy: "network-first",
          });
          if (mediaItem.mediaUrl) {
            audioUrls.add(mediaItem.mediaUrl);
          }
          if (mediaItem.posterUrl) {
            addImageUrl(mediaItem.posterUrl);
          }
          extractMarkdownAssetUrls(mediaItem.notesMarkdown || "", mediaItem.notesMarkdownUrl).forEach(addImageUrl);
        } catch (error) {
          rememberFailure(`Audio item ${item.slug}`, error);
        }
      });
    }

    try {
      const routeSyncPromise = runWithConcurrency(
        Array.from(routeHrefs),
        async (href) => {
          try {
            await prefetchRoute(router || null, href);
            await cacheRouteHtml(href);
            cachedRouteCount += 1;
          } catch (error) {
            rememberFailure(`Route ${href}`, error);
          }
        },
        ROUTE_SYNC_CONCURRENCY
      );

      await runWithConcurrency(
        primaryContentTasks,
        async (task) => {
          await task();
        },
        DETAIL_SYNC_CONCURRENCY
      );

      await routeSyncPromise;

      if (cachedRouteCount === 0) {
        throw new Error("Could not cache any application routes.");
      }

      await runWithConcurrency(
        detailTasks,
        async (task) => {
          await task();
        },
        DETAIL_SYNC_CONCURRENCY
      );

      await runWithConcurrency(
        Array.from(imageUrls),
        async (url) => {
          try {
            await cacheStaticAsset(url, getImageCacheName(url));
          } catch (error) {
            rememberFailure(`Image asset ${url}`, error);
          }
        },
        ASSET_SYNC_CONCURRENCY
      );

      await runWithConcurrency(
        Array.from(audioUrls),
        async (url) => {
          try {
            await cacheStaticAsset(url, STATIC_AUDIO_CACHE);
          } catch (error) {
            rememberFailure(`Audio asset ${url}`, error);
          }
        },
        ASSET_SYNC_CONCURRENCY
      );

      await runWithConcurrency(
        Array.from(videoUrls),
        async (url) => {
          try {
            await cacheStaticAsset(url, STATIC_VIDEO_CACHE);
          } catch (error) {
            rememberFailure(`Video asset ${url}`, error);
          }
        },
        ASSET_SYNC_CONCURRENCY
      );

      if (syncFailures.length > 0) {
        throw new Error(syncFailures.slice(0, 5).join(" | "));
      }

      await verifyOfflineWorkspaceCaches({
        routeHrefs,
        contentUrls,
        markdownUrls,
        imageUrls,
        audioUrls,
        videoUrls,
      });

      writeOfflineSyncState({
        version: OFFLINE_SYNC_VERSION,
        syncedAt: Date.now(),
        contentUpdatedAt: statusInfo.updatedAt,
        contentCommitSha: statusInfo.commitSha,
        routeCount: routeHrefs.size,
        markdownCount: markdownUrls.size,
        detailCount:
          primaryContentTasks.length +
          detailTasks.length +
          imageUrls.size +
          audioUrls.size +
          videoUrls.size,
        status: "ready",
        error: syncWarnings.length > 0 ? syncWarnings.slice(0, 5).join(" | ") : undefined,
      });
    } catch (error) {
      const failureMessage =
        syncFailures.length > 0 ? syncFailures.slice(0, 5).join(" | ") : getErrorMessage(error);
      const warningMessage = syncWarnings.length > 0 ? syncWarnings.slice(0, 5).join(" | ") : "";

      writeOfflineSyncState({
        version: OFFLINE_SYNC_VERSION,
        syncedAt: Date.now(),
        contentUpdatedAt: statusInfo.updatedAt,
        contentCommitSha: statusInfo.commitSha,
        routeCount: routeHrefs.size,
        markdownCount: markdownUrls.size,
        detailCount:
          primaryContentTasks.length +
          detailTasks.length +
          imageUrls.size +
          audioUrls.size +
          videoUrls.size,
        status: "failed",
        error: warningMessage ? `${warningMessage} | ${failureMessage}` : failureMessage,
      });

      throw error;
    }
  })().finally(() => {
    activeSync = null;
  });

  return activeSync;
}

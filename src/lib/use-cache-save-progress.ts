import { useEffect, useMemo, useState } from "react";

import { CACHE_STORAGE_UPDATED_EVENT } from "./cache-events";
import { hasCachedContentUrl } from "./content-client";
import type { CbtCollections, CourseSubject, InterviewQuestionSummary } from "./content-types";
import { hasCachedMarkdownAssetUrls, readCachedRepoText } from "./readme-utils";

export type CacheProgressTarget = {
  key: string;
  kind: "content-json" | "repo-text" | "request";
  url: string;
  urls?: string[];
};

export type CacheSaveProgress = {
  saved: number;
  total: number;
  ready: boolean;
};

const canReadCacheStorage = () =>
  typeof window !== "undefined" && typeof window.caches !== "undefined";

const toAbsoluteRequestUrl = (url: string) => {
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
};

const hasCachedRequestUrl = async (url: string) => {
  if (!url || !canReadCacheStorage()) return false;

  try {
    const absoluteUrl = toAbsoluteRequestUrl(url);
    const cached =
      (await caches.match(absoluteUrl, { ignoreSearch: false })) ||
      (await caches.match(url, { ignoreSearch: false }));

    return Boolean(cached && (cached.ok || cached.type === "opaque"));
  } catch {
    return false;
  }
};

const getTargetUrls = (target: CacheProgressTarget) =>
  Array.from(new Set((target.urls?.length ? target.urls : [target.url]).filter(Boolean)));

const hasCachedRepoTextUrl = async (url: string) => {
  const cachedText = await readCachedRepoText(url);
  if (!cachedText) return false;
  return hasCachedMarkdownAssetUrls(cachedText, url);
};

const hasCachedTarget = async (target: CacheProgressTarget) => {
  const targetUrls = getTargetUrls(target);
  if (targetUrls.length === 0) return false;

  if (target.kind === "repo-text") {
    const results = await Promise.all(targetUrls.map((url) => hasCachedRepoTextUrl(url)));
    return results.every(Boolean);
  }

  if (target.kind === "content-json") {
    const results = await Promise.all(targetUrls.map((url) => hasCachedContentUrl(url)));
    return results.every(Boolean);
  }

  const results = await Promise.all(targetUrls.map((url) => hasCachedRequestUrl(url)));
  return results.every(Boolean);
};

const readCachedTargetKeys = async (targets: CacheProgressTarget[]) => {
  const savedEntries = await Promise.all(
    targets.map(async (target) => ({
      key: target.key,
      saved: await hasCachedTarget(target),
    }))
  );

  return new Set(savedEntries.filter((entry) => entry.saved).map((entry) => entry.key));
};

export const formatCacheSaveProgressLabel = (progress: CacheSaveProgress) => {
  if (progress.total === 0) return "0/0 saved";
  if (progress.ready && progress.saved >= progress.total) {
    return `${progress.saved}/${progress.total} done`;
  }

  return `${progress.saved}/${progress.total} saved`;
};

export const useCacheSaveProgress = (targets: CacheProgressTarget[]) => {
  const [progress, setProgress] = useState<CacheSaveProgress>({
    saved: 0,
    total: targets.length,
    ready: false,
  });

  const targetKey = useMemo(
    () =>
      targets
        .map((target) => `${target.kind}:${target.key}:${getTargetUrls(target).join(",")}`)
        .join("|"),
    [targets]
  );

  useEffect(() => {
    const currentTargets = [...targets];
    const savedKeysRef = { current: new Set<string>() };
    let cancelled = false;
    let frameId: number | null = null;

    const writeProgress = (savedKeys: Set<string>, ready = true) => {
      setProgress({
        saved: savedKeys.size,
        total: currentTargets.length,
        ready,
      });
    };

    const refresh = async () => {
      const savedKeys = await readCachedTargetKeys(currentTargets);
      if (cancelled) return;

      savedKeysRef.current = savedKeys;
      writeProgress(savedKeys);
    };

    const scheduleRefresh = () => {
      if (typeof window === "undefined") return;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        void refresh();
      });
    };

    const handleCacheUpdated = () => {
      scheduleRefresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };

    setProgress((previous) => ({
      saved: Math.min(previous.saved, currentTargets.length),
      total: currentTargets.length,
      ready: false,
    }));

    void refresh();

    if (typeof window !== "undefined") {
      window.addEventListener(CACHE_STORAGE_UPDATED_EVENT, handleCacheUpdated);
      window.addEventListener("focus", scheduleRefresh);
      window.addEventListener("online", scheduleRefresh);
      window.addEventListener("storage", scheduleRefresh);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      cancelled = true;

      if (frameId !== null && typeof window !== "undefined") {
        window.cancelAnimationFrame(frameId);
      }

      if (typeof window !== "undefined") {
        window.removeEventListener(CACHE_STORAGE_UPDATED_EVENT, handleCacheUpdated);
        window.removeEventListener("focus", scheduleRefresh);
        window.removeEventListener("online", scheduleRefresh);
        window.removeEventListener("storage", scheduleRefresh);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [targetKey, targets]);

  return progress;
};

export const buildCourseCacheTargets = (courses: CourseSubject[]): CacheProgressTarget[] =>
  courses.flatMap((course) => {
    const courseKey = course.slug || course.subject;
    const urls = [course.readme_url, ...course.topics.map((topic) => topic.md_url)].filter(Boolean);

    if (urls.length === 0) return [];

    return [
      {
        key: `course:${courseKey}`,
        kind: "repo-text",
        url: urls[0],
        urls,
      },
    ];
  });

export const buildInterviewCacheTargets = (
  items: InterviewQuestionSummary[]
): CacheProgressTarget[] =>
  items.map((item) => ({
    key: item.slug,
    kind: "content-json",
    url: `/api/content/interview/${encodeURIComponent(item.slug)}`,
  }));

export const buildCbtCacheTargets = (collections: CbtCollections | null): CacheProgressTarget[] => {
  if (!collections) return [];

  return [
    ...collections.slideshows.map((deck) => ({
      key: `slideshow:${deck.slug}`,
      kind: "content-json" as const,
      url: `/api/content/slideshows/${encodeURIComponent(deck.slug)}`,
    })),
    ...collections.trainingVideos.map((item) => ({
      key: `training-video:${item.slug}`,
      kind: "content-json" as const,
      url: `/api/content/media/training-videos/${encodeURIComponent(item.slug)}`,
    })),
    ...collections.audioBooks.map((item) => ({
      key: `audio-book:${item.slug}`,
      kind: "content-json" as const,
      url: `/api/content/media/audio-books/${encodeURIComponent(item.slug)}`,
    })),
  ];
};

import type {
  CbtCollections,
  ContentRepoStatus,
  CourseSubject,
  DashboardCardTopic,
  DesignSystem,
  InterviewQuestionDetail,
  InterviewQuestionSummary,
  MediaCollectionItem,
  SlideshowDeck,
  SlideshowSummary,
  TickerItem,
} from "./content-types";

import { notifyCacheStorageUpdated } from "./cache-events";

import {
  CONTENT_AVAILABILITY_EVENT,
  readContentAvailability,
  writeContentAvailability,
} from "./content-availability";

import {
  extractMarkdownAssetUrls,
  normalize,
  toGithubProxyUrl,
} from "./readme-utils";

class HttpStatusError extends Error {}

const CONTENT_API_CACHE = "repo-content";

const CORE_CONTENT_URLS = [
  "/api/content/design",
  "/api/content/ticker",
  "/api/content/status",
  "/api/content/courses",
  "/api/content/interview",
  "/api/content/cbt",
  "/api/content/dashboard-cards",
] as const;

export type ContentRequestOptions = {
  strategy?: "cache-first" | "network-first";
  revalidateOnCacheHit?: boolean;
};

const canUseCacheStorage = () =>
  typeof window !== "undefined" &&
  typeof window.caches !== "undefined";

const jsonMemoryCache = new Map<string, unknown>();

const inflightJsonRequests =
  new Map<string, Promise<unknown>>();

const toAbsoluteRequestUrl = (url: string) => {
  if (typeof window === "undefined") {
    return url;
  }

  return new URL(
    url,
    window.location.origin
  ).toString();
};

const getRequestKey = (url: string) =>
  toAbsoluteRequestUrl(url);

const readCachedJson = async <T>(
  url: string
): Promise<T | null> => {
  if (!canUseCacheStorage()) {
    return null;
  }

  try {
    const absoluteUrl =
      toAbsoluteRequestUrl(url);

    const cached =
      (await caches.match(absoluteUrl, {
        ignoreSearch: false,
      })) ||
      (await caches.match(url, {
        ignoreSearch: false,
      }));

    if (!cached?.ok) {
      return null;
    }

    return (await cached
      .clone()
      .json()) as T;
  } catch {
    return null;
  }
};

const CONTENT_ASSET_CACHE_NAMES = [
  "repo-content",
  "static-image-assets",
];

const getContentAssetMatchUrls = (
  url: string
) => {
  const normalizedUrl = toGithubProxyUrl(
    String(url || "").trim()
  );

  const urls = new Set<string>();

  if (normalizedUrl) {
    urls.add(normalizedUrl);

    urls.add(
      toAbsoluteRequestUrl(
        normalizedUrl
      )
    );
  }

  return Array.from(urls);
};

const hasCachedContentAssetUrl = async (
  url: string
) => {
  if (!canUseCacheStorage()) {
    return false;
  }

  const matchUrls =
    getContentAssetMatchUrls(url);

  if (matchUrls.length === 0) {
    return true;
  }

  for (
    const cacheName of CONTENT_ASSET_CACHE_NAMES
  ) {
    const cache =
      await caches.open(cacheName);

    for (
      const matchUrl of matchUrls
    ) {
      const cached =
        await cache.match(matchUrl, {
          ignoreSearch: false,
        });

      if (
        cached &&
        (cached.ok ||
          cached.type === "opaque")
      ) {
        return true;
      }
    }
  }

  return false;
};

const collectMarkdownAssetUrlsFromPayload = (
  value: unknown,
  inheritedBaseUrl?: string
) => {
  const urls = new Set<string>();

  const visit = (
    entry: unknown,
    baseUrl?: string
  ) => {
    if (
      !entry ||
      typeof entry !== "object"
    ) {
      return;
    }

    if (Array.isArray(entry)) {
      entry.forEach((item) =>
        visit(item, baseUrl)
      );

      return;
    }

    const record =
      entry as Record<string, unknown>;

    const nextBaseUrl =
      typeof record.markdown_url ===
      "string"
        ? record.markdown_url
        : typeof record.notesMarkdownUrl ===
            "string"
          ? record.notesMarkdownUrl
          : typeof record.readme_url ===
              "string"
            ? record.readme_url
            : typeof record.md_url ===
                "string"
              ? record.md_url
              : baseUrl;

    for (
      const [key, fieldValue] of Object.entries(
        record
      )
    ) {
      if (
        typeof fieldValue ===
          "string" &&
        /markdown/i.test(key)
      ) {
        extractMarkdownAssetUrls(
          fieldValue,
          nextBaseUrl
        ).forEach((url) =>
          urls.add(url)
        );

        continue;
      }

      if (
        fieldValue &&
        typeof fieldValue === "object"
      ) {
        visit(
          fieldValue,
          nextBaseUrl
        );
      }
    }
  };

  visit(
    value,
    inheritedBaseUrl
  );

  return Array.from(urls);
};

const hasCachedMarkdownAssetsInPayload =
  async (
    payload: unknown
  ) => {
    const assetUrls =
      collectMarkdownAssetUrlsFromPayload(
        payload
      );

    if (assetUrls.length === 0) {
      return true;
    }

    const results =
      await Promise.all(
        assetUrls.map((url) =>
          hasCachedContentAssetUrl(
            url
          )
        )
      );

    return results.every(Boolean);
  };

export const hasCachedContentUrl =
  async (url: string) => {
    const cached =
      await readCachedJson<unknown>(
        url
      );

    if (cached === null) {
      return false;
    }

    return hasCachedMarkdownAssetsInPayload(
      cached
    );
  };

const writeCachedJson = async (
  url: string,
  response: Response
) => {
  if (
    !canUseCacheStorage() ||
    !response.ok
  ) {
    return;
  }

  try {
    const cache =
      await caches.open(
        CONTENT_API_CACHE
      );

    await cache.put(
      toAbsoluteRequestUrl(url),
      response.clone()
    );

    notifyCacheStorageUpdated({
      cacheName:
        CONTENT_API_CACHE,
      url,
    });
  } catch {
    // ignore cache write failures
  }
};

const readMemoryJson = <T>(
  url: string
): T | null => {
  const key = getRequestKey(url);

  return jsonMemoryCache.has(key)
    ? (jsonMemoryCache.get(
        key
      ) as T)
    : null;
};

const writeMemoryJson = <T>(
  url: string,
  payload: T
) => {
  jsonMemoryCache.set(
    getRequestKey(url),
    payload
  );
};

const fetchJsonFromNetwork =
  async <T>(
    url: string,
    signal?: AbortSignal
  ): Promise<T> => {
    const response = await fetch(
      url,
      {
        cache: "no-store",
        headers: {
          "Cache-Control":
            "no-store",
        },
        signal,
      }
    );

    if (!response.ok) {
      const message =
        await response
          .text()
          .catch(() => "");

      throw new HttpStatusError(
        message ||
          `Failed to fetch ${url} (${response.status})`
      );
    }

    await writeCachedJson(
      url,
      response
    );

    const payload =
      (await response.json()) as T;

    writeMemoryJson(
      url,
      payload
    );

    writeContentAvailability(
      false
    );

    return payload;
  };

const shouldMarkContentOffline = (
  error: unknown
) =>
  !(error instanceof HttpStatusError) &&
  !(
    error instanceof DOMException &&
    error.name === "AbortError"
  );

/*
 * Requests controlled by a caller-owned
 * AbortSignal are intentionally NOT shared.
 *
 * React development mode can mount an effect,
 * clean it up, abort its request, and then
 * mount the effect again.
 *
 * If an aborted request is stored in the
 * shared inflightJsonRequests map, the next
 * effect can receive the already-aborted
 * promise and content loading fails.
 *
 * Pages such as Courses, Interview, Topic,
 * Subject and CBT create AbortControllers
 * inside their effects, so they need
 * independent requests.
 */
const requestJsonFromNetwork = <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  /*
   * Caller-owned AbortSignals must get
   * their own request.
   */
  if (signal) {
    return fetchJsonFromNetwork<T>(
      url,
      signal
    );
  }

  /*
   * Requests without a caller-owned
   * AbortSignal can safely share an
   * in-flight promise.
   */
  const key =
    getRequestKey(url);

  const existing =
    inflightJsonRequests.get(
      key
    ) as
      | Promise<T>
      | undefined;

  if (existing) {
    return existing;
  }

  const request =
    fetchJsonFromNetwork<T>(
      url
    ).finally(() => {
      inflightJsonRequests.delete(
        key
      );
    });

  inflightJsonRequests.set(
    key,
    request as Promise<unknown>
  );

  return request;
};

/*
 * Revalidate an existing cached response
 * in the background.
 *
 * This function is generic so the cached
 * value and network request retain the
 * same T type.
 */
const revalidateCachedJson =
  async <T>(
    url: string
  ): Promise<void> => {
    if (
      typeof window === "undefined" ||
      !navigator.onLine
    ) {
      return;
    }

    try {
      await requestJsonFromNetwork<T>(
        url
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      const cached =
        await readCachedJson<T>(
          url
        );

      if (
        shouldMarkContentOffline(
          error
        )
      ) {
        writeContentAvailability(
          true
        );
      }

      if (cached !== null) {
        writeMemoryJson<T>(
          url,
          cached
        );
      }
    }
  };

const fetchJsonNoStore =
  async <T>(
    url: string,
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<T> => {
    const strategy =
      options?.strategy ||
      "network-first";

    const revalidateOnCacheHit =
      options?.revalidateOnCacheHit ??
      true;

    if (
      strategy === "cache-first"
    ) {
      const memoized =
        readMemoryJson<T>(url);

      if (memoized !== null) {
        if (
          revalidateOnCacheHit
        ) {
          void revalidateCachedJson<T>(
            url
          );
        }

        return memoized;
      }

      const cached =
        await readCachedJson<T>(
          url
        );

      if (cached !== null) {
        writeMemoryJson<T>(
          url,
          cached
        );

        if (
          typeof navigator !==
            "undefined" &&
          !navigator.onLine
        ) {
          writeContentAvailability(
            true
          );
        } else if (
          revalidateOnCacheHit
        ) {
          void revalidateCachedJson<T>(
            url
          );
        }

        return cached;
      }
    }

    try {
      return await requestJsonFromNetwork<T>(
        url,
        signal
      );
    } catch (error) {
      if (
        !(
          error instanceof DOMException &&
          error.name ===
            "AbortError"
        )
      ) {
        const cached =
          await readCachedJson<T>(
            url
          );

        if (
          shouldMarkContentOffline(
            error
          )
        ) {
          writeContentAvailability(
            true
          );
        }

        if (cached !== null) {
          writeMemoryJson<T>(
            url,
            cached
          );

          return cached;
        }
      }

      throw error;
    }
  };

export const warmCoreContent =
  async () => {
    if (
      typeof window ===
        "undefined" ||
      !navigator.onLine
    ) {
      return;
    }

    await Promise.allSettled(
      CORE_CONTENT_URLS.map(
        (url) =>
          requestJsonFromNetwork(
            url,
            undefined
          ).catch(
            () => undefined
          )
      )
    );
  };

export const fetchTickerItems =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<TickerItem[]> =>
    fetchJsonNoStore<
      TickerItem[]
    >(
      "/api/content/ticker",
      signal,
      options
    );

export const fetchDesignConfig =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<DesignSystem> =>
    fetchJsonNoStore<DesignSystem>(
      "/api/content/design",
      signal,
      options
    );

export const fetchContentRepoStatus =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<ContentRepoStatus> =>
    fetchJsonNoStore<ContentRepoStatus>(
      "/api/content/status",
      signal,
      options
    );

export const fetchDashboardCards =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<
    DashboardCardTopic[]
  > =>
    fetchJsonNoStore<
      DashboardCardTopic[]
    >(
      "/api/content/dashboard-cards",
      signal,
      options
    );

export const fetchCourseSubjects =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<CourseSubject[]> =>
    fetchJsonNoStore<CourseSubject[]>(
      "/api/content/courses",
      signal,
      options
    );

export const lookupCourseSubject =
  async (
    subjectName: string,
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ) => {
    const subjects =
      await fetchCourseSubjects(
        signal,
        options
      );

    return (
      subjects.find(
        (subject) =>
          subject.slug ===
            subjectName ||
          normalize(
            subject.subject
          ) ===
            normalize(
              subjectName
            )
      ) || null
    );
  };

export const resolveCourseSubject =
  lookupCourseSubject;

export const fetchInterviewQuestions =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<
    InterviewQuestionSummary[]
  > =>
    fetchJsonNoStore<
      InterviewQuestionSummary[]
    >(
      "/api/content/interview",
      signal,
      options
    );

export const fetchInterviewQuestion =
  async (
    slug: string,
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<
    InterviewQuestionDetail
  > =>
    fetchJsonNoStore<
      InterviewQuestionDetail
    >(
      `/api/content/interview/${encodeURIComponent(
        slug
      )}`,
      signal,
      options
    );

export const fetchCbtCollections =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<CbtCollections> =>
    fetchJsonNoStore<CbtCollections>(
      "/api/content/cbt",
      signal,
      options
    );

export const fetchSlideshows =
  async (
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<
    SlideshowSummary[]
  > => {
    const collections =
      await fetchCbtCollections(
        signal,
        options
      );

    return collections.slideshows;
  };

export const fetchSlideshow =
  async (
    slug: string,
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<SlideshowDeck> =>
    fetchJsonNoStore<SlideshowDeck>(
      `/api/content/slideshows/${encodeURIComponent(
        slug
      )}`,
      signal,
      options
    );

export const fetchMediaItem =
  async (
    kind:
      | "training-videos"
      | "audio-books",
    slug: string,
    signal?: AbortSignal,
    options?: ContentRequestOptions
  ): Promise<
    MediaCollectionItem
  > =>
    fetchJsonNoStore<
      MediaCollectionItem
    >(
      `/api/content/media/${encodeURIComponent(
        kind
      )}/${encodeURIComponent(
        slug
      )}`,
      signal,
      options
    );

export {
  CONTENT_AVAILABILITY_EVENT,
  readContentAvailability,
};
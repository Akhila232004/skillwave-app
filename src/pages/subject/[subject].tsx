// File: src/pages/subject/[subject].tsx

import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import CachedRepoImage from "../../components/content/CachedRepoImage";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FaArrowRight,
  FaArrowLeft,
  FaMoon,
  FaRegStar,
  FaSearch,
  FaStar,
  FaSun,
  FaHome,
} from "react-icons/fa";
import {
  cacheTextUrls,
  hydrateOfflineSubjectsForAccount,
  migrateLegacyOfflineSubjects,
  readOfflineSubjectMeta,
  type OfflineSubjectMeta as SharedOfflineSubjectMeta,
} from "../../lib/offline";
import { lookupCourseSubject } from "../../lib/content-client";
import {
  getLibraryUserKey,
  mergeFavoriteTopics,
  readFavoriteTopics,
  removeFavoriteTopic,
  setActiveLibraryUserKey,
  upsertFavoriteTopic,
  writeFavoriteTopics,
  type SavedFavoriteTopic,
} from "../../lib/library";
import { useProtectedAppSession } from "../../lib/app-session";
import { goBackOr } from "../../lib/navigation";
import { useConnectionStatus } from "../../lib/use-connection-status";
import {
  cacheRepoTextValue,
  fetchTextStrict,
  normalize,
  readCachedRepoText,
  toRawGithub,
  type ParsedTopic,
} from "../../lib/readme-utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Topic = ParsedTopic;

type OfflineSubjectMeta = SharedOfflineSubjectMeta;

// ─── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

const normalizeSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const getSearchTokens = (value: string) =>
  normalizeSearch(value).split(/\s+/).filter(Boolean);

const matchesSearchTokens = (
  tokens: string[],
  ...values: Array<string | undefined>
) => {
  if (tokens.length === 0) return true;

  const haystack = normalizeSearch(
    values.filter(Boolean).join(" ")
  );

  return tokens.every((token) => haystack.includes(token));
};

const accentByCategory = (category: string) => {
  const normalizedCategory = normalizeSearch(category);

  if (normalizedCategory.includes("front")) {
    return {
      background: "var(--course-tone-frontend-background)",
      border: "var(--course-tone-frontend-border)",
      color: "var(--course-tone-frontend-color)",
    };
  }

  if (
    normalizedCategory.includes("data") ||
    normalizedCategory.includes("database")
  ) {
    return {
      background: "var(--course-tone-database-background)",
      border: "var(--course-tone-database-border)",
      color: "var(--course-tone-database-color)",
    };
  }

  if (normalizedCategory.includes("back")) {
    return {
      background: "var(--course-tone-backend-background)",
      border: "var(--course-tone-backend-border)",
      color: "var(--course-tone-backend-color)",
    };
  }

  if (normalizedCategory.includes("full")) {
    return {
      background: "var(--course-tone-full-stack-background)",
      border: "var(--course-tone-full-stack-border)",
      color: "var(--course-tone-full-stack-color)",
    };
  }

  return {
    background: "var(--course-tone-default-background)",
    border: "var(--course-tone-default-border)",
    color: "var(--course-tone-default-color)",
  };
};

const cleanTitle = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s*\*\s*https?:\/\/.*$/i, "")
    .replace(/\s*https?:\/\/.*$/i, "")
    .trim();

const resolveMaybeRelativeUrl = (
  url: string,
  baseUrl?: string
) => {
  if (!url) return "";

  const u = url.trim();

  if (/^https?:\/\//i.test(u)) {
    return toRawGithub(u);
  }

  if (baseUrl) {
    try {
      const resolved = new URL(u, baseUrl).toString();
      return toRawGithub(resolved);
    } catch {
      // Ignore invalid relative URLs.
    }
  }

  return u;
};

const extractMarkdownLinkAnywhere = (
  text: string,
  baseUrl?: string
): { title: string; url: string } | null => {
  const match = text.match(
    /\[([^\]]+)\]\(([^)]+)\)/
  );

  if (!match) {
    return null;
  }

  const title = cleanTitle(match[1]);

  const url = resolveMaybeRelativeUrl(
    match[2].trim(),
    baseUrl
  );

  return url
    ? {
        title,
        url,
      }
    : null;
};

const parseBulletsFromSection = (
  sectionText: string
): string[] => {
  const bullets: string[] = [];

  const lines = (
    sectionText || ""
  ).split("\n");

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      continue;
    }

    let match = line.match(
      /^[-*+]\s+(.+)$/
    );

    if (match) {
      bullets.push(
        match[1].trim()
      );

      continue;
    }

    match = line.match(
      /^\d+\.\s+(.+)$/
    );

    if (match) {
      bullets.push(
        match[1].trim()
      );

      continue;
    }
  }

  return bullets;
};

/**
 * Parses the subject README.
 *
 * Example:
 *
 * ## 📘 [Introduction](./01-introduction.md)
 * - bullet
 * - bullet
 *
 * ## 🚀 [Getting Started](./02-getting-started.md)
 * - bullet
 */
function parseSubjectReadmeTopics(
  md: string,
  subjectReadmeUrl: string
): Topic[] {
  const rawMd = (md || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const normalizedMd = rawMd
    .replace(
      /([^\n])\s+((?:[-*+]\s+)?#{1,6}\s+)/g,
      "$1\n$2"
    )
    .replace(/\n{3,}/g, "\n\n");

  const rawLines = rawMd.split("\n");

  const lines =
    rawLines.length > 1
      ? rawLines
      : normalizedMd.split("\n");

  type Hit = {
    index: number;
    title: string;
    url: string;
    level: number;
    indent: number;
  };

  const hits: Hit[] = [];
  const seen = new Set<string>();

  const TOPIC_HEADING_RE =
    /^(?:[-*+]\s+)?(#{2,4})\s+(.+)$/;

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const rawLine =
      lines[i] || "";

    const line =
      rawLine.trim();

    if (!line) {
      continue;
    }

    const heading =
      line.match(
        TOPIC_HEADING_RE
      );

    if (!heading) {
      continue;
    }

    const level =
      heading[1].length;

    const headingBody =
      heading[2].trim();

    if (
      level < 2 ||
      level > 4
    ) {
      continue;
    }

    const indent =
      (
        rawLine.match(/^\s*/) ||
        [""]
      )[0].length;

    const markdownLink =
      extractMarkdownLinkAnywhere(
        headingBody,
        subjectReadmeUrl
      );

    if (!markdownLink) {
      continue;
    }

    const title =
      cleanTitle(
        markdownLink.title
      );

    const url =
      toRawGithub(
        markdownLink.url
      );

    if (
      !title ||
      !url ||
      !/\.md(\?|#|$)/i.test(url)
    ) {
      continue;
    }

    const key =
      `${normalize(title)}|${url}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    hits.push({
      index: i,
      title,
      url,
      level,
      indent,
    });
  }

  if (!hits.length) {
    return [];
  }

  const topics: Topic[] = [];

  for (
    let idx = 0;
    idx < hits.length;
    idx++
  ) {
    const hit = hits[idx];

    const start =
      hit.index + 1;

    let end =
      lines.length;

    for (
      let j = idx + 1;
      j < hits.length;
      j++
    ) {
      const nextHit =
        hits[j];

      if (
        nextHit.indent >
        hit.indent
      ) {
        continue;
      }

      if (
        nextHit.level >
        hit.level
      ) {
        continue;
      }

      end =
        nextHit.index;

      break;
    }

    const sectionContent =
      lines
        .slice(start, end)
        .join("\n")
        .trim();

    const bullets =
      parseBulletsFromSection(
        sectionContent
      );

    topics.push({
      topic_name:
        hit.title,

      md_url:
        hit.url,

      bullets,

      section_markdown:
        sectionContent,
    });
  }

  return topics;
}

const orderTopics = (
  raw: Topic[]
) => {
  const introIdx =
    raw.findIndex(
      (topic) =>
        normalize(
          topic.topic_name
        ) === "introduction"
    );

  return introIdx > 0
    ? [
        raw[introIdx],
        ...raw.filter(
          (_, index) =>
            index !== introIdx
        ),
      ]
    : raw;
};

// ─── Offline helpers ──────────────────────────────────────────────────────────

const readOfflineMeta = (
  subject: string,
  accountKey?: string
): OfflineSubjectMeta | null =>
  readOfflineSubjectMeta(
    subject,
    accountKey
  );

// ─── GitHub cache loader ──────────────────────────────────────────────────────

async function loadGitHubTextCacheFirst(
  url: string,
  signal: AbortSignal
) {
  const freshPromise =
    (async () => {
      try {
        const fresh =
          await fetchTextStrict(
            url,
            signal,
            {
              strategy:
                "network-first",
            }
          );

        await cacheRepoTextValue(
          url,
          fresh
        );

        return fresh;
      } catch (error) {
        /*
         * Abort is expected when the user navigates away from
         * the subject page. Do not turn it into a real error.
         */
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return null;
        }

        return null;
      }
    })();

  return {
    cached:
      await readCachedRepoText(
        url
      ),

    freshPromise,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubjectPage() {
  const [mounted, setMounted] =
    useState(false);

  const router =
    useRouter();

  const {
    data: session,
    status,
  } =
    useProtectedAppSession();

  const {
    subject,
    readme,
  } =
    router.query;

  const subjectStr =
    String(subject || "");

  const readmeQueryUrl =
    typeof readme === "string"
      ? readme
      : "";

  const accountKey =
    useMemo(
      () =>
        getLibraryUserKey(
          session?.user
        ),
      [session]
    );

  const accountKeyRef =
    useRef(accountKey);

  const {
    theme,
    toggleTheme,
  } =
    useContext(
      ThemeContext
    );

  const [
    topics,
    setTopics,
  ] = useState<Topic[]>([]);

  const [
    subjectReadmeUrl,
    setSubjectReadmeUrl,
  ] = useState<string>("");

  const [
    subjectMeta,
    setSubjectMeta,
  ] = useState<{
    category: string;
    icon_url?: string;
  } | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const isOffline =
    useConnectionStatus();

  const [
    q,
    setQ,
  ] = useState("");

  const loadedSubjectKeyRef =
    useRef("");

  const [
    favorites,
    setFavorites,
  ] = useState<
    SavedFavoriteTopic[]
  >([]);

  // ───────────────────────────────────────────────────────────────────────────
  // Mounted state
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setMounted(true);
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Account key
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    accountKeyRef.current =
      accountKey;
  }, [accountKey]);

  // ───────────────────────────────────────────────────────────────────────────
  // Local favorites / offline state
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (accountKey) {
      setActiveLibraryUserKey(
        accountKey
      );

      migrateLegacyOfflineSubjects(
        accountKey
      );
    }

    setFavorites(
      readFavoriteTopics(
        accountKey
      )
    );
  }, [
    mounted,
    accountKey,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Load locally stored subject metadata
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!subjectStr) {
      return;
    }

    const meta =
      readOfflineMeta(
        subjectStr,
        accountKey
      );

    if (
      meta?.subject_readme_url
    ) {
      setSubjectReadmeUrl(
        meta.subject_readme_url
      );
    }
  }, [
    subjectStr,
    accountKey,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Synchronize server favorites / offline subjects
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      status !==
      "authenticated"
    ) {
      return;
    }

    let cancelled =
      false;

    (async () => {
      try {
        const [
          favoritesRes,
          offlineRes,
        ] =
          await Promise.all([
            fetch(
              "/api/favorites",
              {
                cache:
                  "no-store",

                headers: {
                  "Cache-Control":
                    "no-store",
                },
              }
            ),

            fetch(
              "/api/offline-subjects",
              {
                cache:
                  "no-store",

                headers: {
                  "Cache-Control":
                    "no-store",
                },
              }
            ),
          ]);

        if (
          !cancelled &&
          favoritesRes.ok
        ) {
          const serverFavorites =
            (await favoritesRes.json()) as SavedFavoriteTopic[];

          const mergedFavorites =
            mergeFavoriteTopics(
              readFavoriteTopics(
                accountKey
              ),
              serverFavorites
            );

          writeFavoriteTopics(
            mergedFavorites,
            accountKey
          );

          setFavorites(
            mergedFavorites
          );
        }

        if (
          !cancelled &&
          offlineRes.ok
        ) {
          const serverOfflineSubjects =
            (await offlineRes.json()) as OfflineSubjectMeta[];

          hydrateOfflineSubjectsForAccount(
            serverOfflineSubjects,
            accountKey
          );

          if (subjectStr) {
            const meta =
              readOfflineMeta(
                subjectStr,
                accountKey
              );

            if (
              meta?.subject_readme_url
            ) {
              setSubjectReadmeUrl(
                meta.subject_readme_url
              );
            }
          }
        }
      } catch (error) {
        /*
         * Ignore AbortError and other synchronization failures.
         * Local data remains available.
         */
        console.debug(
          "Subject server synchronization skipped:",
          error
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    status,
    accountKey,
    subjectStr,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Load subject topics
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      !router.isReady ||
      !subjectStr
    ) {
      return;
    }

    const ac =
      new AbortController();

    let cancelled =
      false;

    const loadKey =
      `${subjectStr}|${readmeQueryUrl}`;

    const applyTopicList = (
      nextTopics: Topic[],
      sourceUrl: string
    ) => {
      const ordered =
        orderTopics(
          nextTopics
        );

      setSubjectReadmeUrl(
        sourceUrl
      );

      if (!ordered.length) {
        return false;
      }

      setTopics(
        ordered
      );

      setError("");

      return true;
    };

    const applySubjectReadme = (
      md: string,
      sourceUrl: string
    ) => {
      const parsed =
        parseSubjectReadmeTopics(
          md,
          sourceUrl
        );

      return applyTopicList(
        parsed,
        sourceUrl
      );
    };

    if (
      loadedSubjectKeyRef.current !==
      loadKey
    ) {
      setLoading(true);
      setSubjectMeta(null);
    }

    (async () => {
      try {
        setRefreshing(true);
        setError("");

        const savedSubjectReadmeUrl =
          readOfflineMeta(
            subjectStr,
            accountKeyRef.current
          )?.subject_readme_url ||
          "";

        let resolvedSubjectReadme =
          readmeQueryUrl
            ? toRawGithub(
                readmeQueryUrl
              )
            : savedSubjectReadmeUrl
              ? toRawGithub(
                  savedSubjectReadmeUrl
                )
              : "";

        const subjectLookupPromise =
          (async () => {
            const match =
              await lookupCourseSubject(
                subjectStr,
                ac.signal
              );

            if (cancelled) {
              return null;
            }

            setSubjectMeta(
              match
                ? {
                    category:
                      match.category,

                    icon_url:
                      match.icon_url,
                  }
                : null
            );

            return match;
          })();

        if (
          !resolvedSubjectReadme
        ) {
          const match =
            await subjectLookupPromise;

          if (cancelled) {
            return;
          }

          resolvedSubjectReadme =
            match?.readme_url
              ? toRawGithub(
                  match.readme_url
                )
              : "";
        } else {
          void subjectLookupPromise.catch(
            () => undefined
          );
        }

        if (
          !resolvedSubjectReadme
        ) {
          throw new Error(
            `Subject "${subjectStr}" not found in the GitHub course catalog`
          );
        }

        const {
          cached,
          freshPromise,
        } =
          await loadGitHubTextCacheFirst(
            resolvedSubjectReadme,
            ac.signal
          );

        if (cancelled) {
          return;
        }

        let hasRenderedTopics =
          false;

        // Render cached content immediately.
        if (cached) {
          hasRenderedTopics =
            applySubjectReadme(
              cached,
              resolvedSubjectReadme
            );

          if (
            hasRenderedTopics
          ) {
            setLoading(false);
          }
        }

        // Update from network when available.
        const fresh =
          await freshPromise;

        if (cancelled) {
          return;
        }

        if (
          fresh &&
          fresh !== cached
        ) {
          hasRenderedTopics =
            applySubjectReadme(
              fresh,
              resolvedSubjectReadme
            ) ||
            hasRenderedTopics;
        }

        // Fallback to API-provided topics.
        if (
          !hasRenderedTopics
        ) {
          const match =
            await subjectLookupPromise.catch(
              (error) => {
                /*
                 * A request can be aborted because the user
                 * navigated away. Treat that as no match.
                 */
                if (
                  error instanceof DOMException &&
                  error.name === "AbortError"
                ) {
                  return null;
                }

                return null;
              }
            );

          if (cancelled) {
            return;
          }

          if (
            match?.topics?.length &&
            applyTopicList(
              match.topics,
              resolvedSubjectReadme ||
                (
                  match.readme_url
                    ? toRawGithub(
                        match.readme_url
                      )
                    : ""
                )
            )
          ) {
            hasRenderedTopics =
              true;
          }
        }

        if (
          !hasRenderedTopics
        ) {
          if (
            !cached &&
            !fresh
          ) {
            throw new Error(
              "Subject README fetch returned no data"
            );
          }

          throw new Error(
            `No topics found in subject README for "${subjectStr}".`
          );
        }

        loadedSubjectKeyRef.current =
          loadKey;
      } catch (error) {
        /*
         * IMPORTANT:
         *
         * AbortError is expected when:
         * - user clicks Back
         * - user opens another topic
         * - router changes
         * - component unmounts
         *
         * It should NOT be displayed as:
         * "Failed to load subject..."
         */
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (cancelled) {
          return;
        }

        console.error(
          "Subject load error:",
          error
        );

        setError(
          "Failed to load subject from the GitHub content repo."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();

    return () => {
      cancelled = true;

      /*
       * Cancel all active GitHub/API requests when the
       * subject page is left.
       */
      ac.abort();
    };
  }, [
    router.isReady,
    subjectStr,
    readmeQueryUrl,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Search
  // ───────────────────────────────────────────────────────────────────────────

  const filtered =
    useMemo(() => {
      const tokens =
        getSearchTokens(q);

      if (
        tokens.length === 0
      ) {
        return topics;
      }

      return topics.filter(
        (topic) =>
          matchesSearchTokens(
            tokens,
            topic.topic_name,
            topic.section_markdown,
            ...(topic.bullets || [])
          )
      );
    }, [
      topics,
      q,
    ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Favorites
  // ───────────────────────────────────────────────────────────────────────────

  const toggleFavorite =
    async (
      topic: SavedFavoriteTopic
    ) => {
      const isFavorite =
        favorites.some(
          (favorite) =>
            favorite.slug ===
            topic.slug
        );

      // Remove favorite
      if (isFavorite) {
        const nextFavorites =
          removeFavoriteTopic(
            topic.slug,
            accountKey
          );

        setFavorites(
          nextFavorites
        );

        if (
          status ===
          "authenticated"
        ) {
          try {
            const res =
              await fetch(
                `/api/favorites?slug=${encodeURIComponent(
                  topic.slug
                )}`,
                {
                  method:
                    "DELETE",

                  headers: {
                    "Cache-Control":
                      "no-store",
                  },

                  cache:
                    "no-store",
                }
              );

            if (res.ok) {
              const serverFavorites =
                (await res.json()) as SavedFavoriteTopic[];

              const mergedFavorites =
                mergeFavoriteTopics(
                  nextFavorites,
                  serverFavorites
                );

              writeFavoriteTopics(
                mergedFavorites,
                accountKey
              );

              setFavorites(
                mergedFavorites
              );
            }
          } catch {
            // Keep local state if server synchronization fails.
          }
        }

        return;
      }

      // Save favorite for offline use.
      try {
        const cacheResult =
          await cacheTextUrls(
            [
              ...(topic.subject_readme_url
                ? [
                    topic.subject_readme_url,
                  ]
                : []),

              ...(topic.md_url
                ? [
                    topic.md_url,
                  ]
                : []),
            ],
            fetchTextStrict
          );

        const savedTopicMd =
          !topic.md_url ||
          cacheResult.savedUrls.includes(
            toRawGithub(
              topic.md_url
            )
          );

        const savedSubjectReadme =
          !topic.subject_readme_url ||
          cacheResult.savedUrls.includes(
            toRawGithub(
              topic.subject_readme_url
            )
          );

        if (
          !savedTopicMd ||
          !savedSubjectReadme ||
          cacheResult.failedAssetUrls.length >
            0
        ) {
          throw new Error(
            "Favorite cache is incomplete."
          );
        }
      } catch {
        window.alert(
          "Could not save this favorite for offline use. Please try again while online."
        );

        return;
      }

      const nextFavorite:
        SavedFavoriteTopic = {
        ...topic,
        savedAt:
          topic.savedAt ||
          Date.now(),
      };

      const nextFavorites =
        upsertFavoriteTopic(
          nextFavorite,
          accountKey
        );

      setFavorites(
        nextFavorites
      );

      if (
        status ===
        "authenticated"
      ) {
        try {
          const res =
            await fetch(
              "/api/favorites",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  "Cache-Control":
                    "no-store",
                },

                body: JSON.stringify(
                  nextFavorite
                ),

                cache:
                  "no-store",
              }
            );

          if (res.ok) {
            const serverFavorites =
              (await res.json()) as SavedFavoriteTopic[];

            const mergedFavorites =
              mergeFavoriteTopics(
                nextFavorites,
                serverFavorites
              );

            writeFavoriteTopics(
              mergedFavorites,
              accountKey
            );

            setFavorites(
              mergedFavorites
            );
          }
        } catch {
          // Keep local state if server synchronization fails.
        }
      }
    };

  // ───────────────────────────────────────────────────────────────────────────
  // UI styles
  // ───────────────────────────────────────────────────────────────────────────

  const subjectTone =
    accentByCategory(
      subjectMeta?.category ||
        ""
    );

  const headerCardStyle = {
    background:
      "var(--dashboard-header-bg)",

    border:
      "1px solid var(--dashboard-header-border)",
  };

  const searchCardStyle = {
    background:
      "color-mix(in srgb, var(--surface) 92%, transparent)",

    border:
      "1px solid var(--border)",
  };

  const searchCard =
    "card";

  const topicCardStyle = {
    background:
      "var(--course-card-bg)",

    border:
      `1px solid ${subjectTone.border}`,
  };

  const introCardStyle = {
    ...topicCardStyle,

    boxShadow:
      "var(--shadow-feature)",
  };

  const connectionTone =
    isOffline
      ? {
          label:
            "Offline",

          color:
            "var(--status-offline-color)",

          background:
            "var(--status-offline-background)",

          border:
            "var(--status-offline-border)",
        }
      : {
          label:
            "Online",

          color:
            "var(--status-online-color)",

          background:
            "var(--status-online-background)",

          border:
            "var(--status-online-border)",
        };

  // ───────────────────────────────────────────────────────────────────────────
  // Initial render
  // ───────────────────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="app-shell">
        <main className="page-main">
          <div
            className="card"
            style={{
              padding: 18,
              borderRadius: 24,
            }}
          >
            Loading…
          </div>
        </main>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="app-shell">
      <main className="page-main">

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div
          className="card page-hero-card"
          style={headerCardStyle}
        >
          <div className="page-hero-top">

            <div className="page-hero-brand">

              {subjectMeta?.icon_url ? (
                <div
                  className="course-library-card__icon-shell"
                  style={{
                    border:
                      `1px solid ${subjectTone.border}`,

                    background:
                      subjectTone.background,

                    color:
                      subjectTone.color,
                  }}
                >
                  <CachedRepoImage
                    src={
                      subjectMeta.icon_url
                    }
                    alt={`${subjectStr} icon`}
                    loading="eager"
                  />
                </div>
              ) : null}

              <div className="page-hero-copy">

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color:
                      "var(--muted)",
                  }}
                >
                  COURSE SUBJECT
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 30,
                    fontWeight: 900,
                  }}
                >
                  {subjectStr
                    ? subjectStr.toUpperCase()
                    : "SUBJECT"}
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    flexWrap:
                      "wrap",

                    gap: 8,

                    marginTop: 12,
                  }}
                >
                  <span
                    className="badge"
                    style={{
                      color:
                        connectionTone.color,

                      background:
                        connectionTone.background,

                      borderColor:
                        connectionTone.border,
                    }}
                  >
                    {connectionTone.label}
                  </span>

                  {refreshing ? (
                    <span className="badge">
                      Updating...
                    </span>
                  ) : null}

                  <span className="badge">
                    {topics.length} topics
                  </span>
                </div>
              </div>
            </div>

            <div className="page-hero-actions">

              <button
                className="btn btn-outline"
                onClick={() =>
                  void router.push(
                    "/dashboard"
                  )
                }
                type="button"
                title="Home"
              >
                <FaHome />
              </button>

              <button
                className="btn btn-outline"
                onClick={() =>
                  goBackOr(
                    router,
                    "/courses"
                  )
                }
                type="button"
              >
                <FaArrowLeft />
                Back
              </button>

              <button
                className="btn btn-outline"
                onClick={toggleTheme}
                type="button"
              >
                {theme ===
                "dark" ? (
                  <FaSun />
                ) : (
                  <FaMoon />
                )}

                {theme ===
                "dark"
                  ? "Light"
                  : "Dark"}
              </button>
            </div>
          </div>

          {/* ==============================================================
              SEARCH
          ============================================================== */}

          <div
            className="page-hero-search glass search-bar-elevated subject-topic-search"
            style={searchCardStyle}
          >
            <FaSearch
              style={{
                color:
                  "var(--muted)",
              }}
            />

            <input
              value={q}
              onChange={(event) =>
                setQ(
                  event.target.value
                )
              }
              placeholder="Search topics…"
              style={{
                width:
                  "100%",

                border:
                  "none",

                outline:
                  "none",

                background:
                  "transparent",

                color:
                  "var(--text)",

                fontSize:
                  14,
              }}
            />
          </div>
        </div>

        {/* ================================================================
            LOADING
        ================================================================= */}

        {loading && (
          <div
            className={
              searchCard +
              " p-6"
            }
            style={{
              marginTop: 20,
            }}
          >
            Loading topics...
          </div>
        )}

        {/* ================================================================
            ERROR
        ================================================================= */}

        {!loading &&
          error && (
            <div
              className={
                searchCard +
                " p-6"
              }
              style={{
                marginTop: 20,

                color:
                  "var(--status-offline-color)",
              }}
            >
              {error}
            </div>
          )}

        {/* ================================================================
            TOPICS
        ================================================================= */}

        {!loading &&
          !error && (
            <>
              <div className="subject-topic-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filtered.map(
                  (
                    topicItem,
                    index
                  ) => {

                    const slug =
                      slugify(
                        topicItem.topic_name
                      );

                    const isFav =
                      favorites.some(
                        (
                          favorite
                        ) =>
                          favorite.slug ===
                          slug
                      );

                    const isIntro =
                      normalize(
                        topicItem.topic_name
                      ) ===
                      "introduction";

                    /*
                     * IMPORTANT NAVIGATION FIX
                     *
                     * The README URL is CONTENT DATA.
                     *
                     * It must NOT be added to the application route.
                     *
                     * Correct:
                     * /topic/introduction?subject=java
                     *
                     * Incorrect:
                     * /topic/introduction?subject=java&readme=README.md
                     *
                     * Keeping the README out of this URL prevents
                     * the Topic page from accidentally navigating to:
                     *
                     * /README.md
                     */

                    const hrefObj = {
                      pathname:
                        "/topic/[topic]",

                      query: {
                        topic:
                          topicItem.topic_name,

                        subject:
                          subjectStr,
                      },
                    };

                    return (
                      <div
                        key={`${topicItem.md_url}-${topicItem.topic_name}`}
                        className="subject-topic-card card course-card-hover relative rounded-3xl p-6 transition-all duration-300 cursor-pointer"
                        style={
                          isIntro
                            ? introCardStyle
                            : topicCardStyle
                        }
                        role="button"
                        tabIndex={0}
                        onClick={(
                          event
                        ) => {
                          if (
                            (
                              event.target as HTMLElement
                            ).closest(
                              '[data-no-nav="true"]'
                            )
                          ) {
                            return;
                          }

                          void router.push(
                            hrefObj
                          );
                        }}
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            event.preventDefault();

                            void router.push(
                              hrefObj
                            );
                          }
                        }}
                      >

                        {/* Accent */}
                        <div
                          style={{
                            height:
                              5,

                            borderRadius:
                              999,

                            background:
                              subjectTone.background,

                            marginBottom:
                              16,
                          }}
                        />

                        {/* Favorite */}
                        <button
                          data-no-nav="true"
                          type="button"
                          onPointerDown={(
                            event
                          ) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onClick={(
                            event
                          ) => {
                            event.preventDefault();
                            event.stopPropagation();

                            void toggleFavorite(
                              {
                                slug,

                                topic_name:
                                  topicItem.topic_name,

                                subject:
                                  subjectStr,

                                md_url:
                                  topicItem.md_url,

                                subject_readme_url:
                                  subjectReadmeUrl ||
                                  undefined,

                                savedAt:
                                  Date.now(),
                              }
                            );
                          }}
                          className="subject-topic-card__favorite absolute top-4 right-4 z-50 pointer-events-auto text-xl transition-transform hover:scale-125"
                          style={{
                            color:
                              isFav
                                ? "var(--brand-2)"
                                : "var(--muted)",
                          }}
                          aria-label={
                            isFav
                              ? "Remove topic from favorites"
                              : "Add topic to favorites"
                          }
                          aria-pressed={
                            isFav
                          }
                          title={
                            isFav
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFav ? (
                            <FaStar />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>

                        {/* Topic number */}
                        <div
                          style={{
                            fontSize:
                              12,

                            color:
                              "var(--muted)",
                          }}
                        >
                          {isIntro
                            ? "Start here"
                            : `#${index + 1}`}
                        </div>

                        {/* Topic title */}
                        <div className="mt-2">
                          <h3 className="subject-topic-card__title text-lg font-semibold leading-snug line-clamp-2">
                            {
                              topicItem.topic_name
                            }
                          </h3>
                        </div>

                        {/* Bullet preview */}
                        {!!topicItem
                          .bullets
                          ?.length && (
                          <div className="subject-topic-card__bullets mt-3 space-y-1">
                            {topicItem.bullets
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  bullet,
                                  bulletIndex
                                ) => (
                                  <div
                                    key={
                                      bulletIndex
                                    }
                                    style={{
                                      fontSize:
                                        12,

                                      color:
                                        "var(--muted)",
                                    }}
                                  >
                                    •{" "}
                                    {
                                      bullet
                                    }
                                  </div>
                                )
                              )}
                          </div>
                        )}

                        {/* Open */}
                        <div className="mt-6 flex items-center justify-between">
                          <div
                            style={{
                              fontSize:
                                14,

                              fontWeight:
                                700,

                              color:
                                subjectTone.color,
                            }}
                          >
                            Open{" "}
                            <FaArrowRight
                              style={{
                                display:
                                  "inline",

                                marginLeft:
                                  6,
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {/* No results */}
              {filtered.length ===
                0 && (
                <p
                  style={{
                    marginTop:
                      18,

                    textAlign:
                      "center",

                    color:
                      "var(--muted)",

                    fontSize:
                      14,
                  }}
                >
                  No topics found
                </p>
              )}
            </>
          )}

      </main>
    </div>
  );
}
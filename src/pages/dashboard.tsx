"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { signOut } from "next-auth/react";
import type { IconType } from "react-icons";
import {
  FaArrowRight,
  FaBars,
  FaBookOpen,
  FaDownload,
  FaLayerGroup,
  FaMoon,
  FaSearch,
  FaSignOutAlt,
  FaSun,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";

import TickerBar from "../components/content/TickerBar";
import CachedRepoImage from "../components/content/CachedRepoImage";
import { ThemeContext } from "../context/ThemeContext";
import { clearCachedSessionUser, useProtectedAppSession } from "../lib/app-session";
import { clearBrowserSessionActive } from "../lib/browserSession";
import {
  fetchCbtCollections,
  fetchContentRepoStatus,
  fetchCourseSubjects,
  fetchDashboardCards,
  fetchInterviewQuestions,
  fetchTickerItems,
} from "../lib/content-client";
import type {
  CbtCollections,
  CourseSubject,
  DashboardCardTopic,
  InterviewQuestionSummary,
  TickerItem,
} from "../lib/content-types";
import {
  OFFLINE_SYNC_STATE_EVENT,
  readOfflineSyncState,
} from "../lib/offline-sync";
import { clearAppRouteHistory } from "../lib/navigation";
import { useConnectionStatus } from "../lib/use-connection-status";
import {
  getLibraryUserKey,
  mergeFavoriteTopics,
  readFavoriteTopics,
  type SavedFavoriteTopic,
  writeFavoriteTopics,
} from "../lib/library";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type SectionCard = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: IconType;
  accent: string;
  surfaceLight: string;
  surfaceDark: string;
  keywords: string[];
};

type DashboardSearchResult = {
  key: string;
  kind: string;
  title: string;
  description: string;
  meta: string;
  href: string | { pathname: string; query?: Record<string, string> };
  icon: IconType;
  accent: string;
  tags?: string[];
};

const normalizeSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const getSearchTokens = (value: string) =>
  normalizeSearch(value).split(/\s+/).filter(Boolean);

const matchesSearchTokens = (tokens: string[], ...values: Array<string | undefined>) => {
  if (tokens.length === 0) return true;
  const haystack = normalizeSearch(values.filter(Boolean).join(" "));
  return tokens.every((token) => haystack.includes(token));
};

const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

const favoriteKindLabel = (item: SavedFavoriteTopic) => {
  switch (item.kind) {
    case "interview":
      return "Interview Question";
    case "slideshow":
      return "Slideshow";
    case "training-video":
      return "Training Video";
    case "audio-book":
      return "Audio Book";
    default:
      return "Topic";
  }
};

const favoriteIcon = (item: SavedFavoriteTopic) => {
  if (item.kind === "interview") return FaUserTie;
  if (item.kind === "slideshow" || item.kind === "training-video" || item.kind === "audio-book") {
    return FaLayerGroup;
  }
  return FaBookOpen;
};

const favoriteHref = (item: SavedFavoriteTopic) =>
  item.href || {
    pathname: "/topic/[topic]",
    query: {
      topic: item.topic_name,
      subject: item.subject,
      ...(item.subject_readme_url ? { readme: item.subject_readme_url } : {}),
    },
  };

function DashboardSlideCarousel({ topics = [] }: { topics?: DashboardCardTopic[] }) {
  const pointerStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [topicIndex, setTopicIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const slideTopics = topics;

  useEffect(() => {
    setTopicIndex((current) => Math.max(0, Math.min(current, slideTopics.length - 1)));
    setSlideIndex(0);
  }, [slideTopics.length]);

  if (slideTopics.length === 0) {
    return null;
  }

  const activeTopic = slideTopics[topicIndex] || slideTopics[0];
  const activeSlide = activeTopic.slides[slideIndex] || activeTopic.slides[0];
  const selectedTemplate = activeSlide.template || "text";
  const imagePosition = activeSlide.style?.imagePosition || "left";
  const textAlign = activeSlide.style?.textAlign || "left";
  const showImage = selectedTemplate !== "text" && Boolean(activeSlide.imageUrl);
  const showText = selectedTemplate !== "image" || !showImage;
  const slideStyle = {
    "--dashboard-slide-text-align": textAlign,
    ...(activeSlide.style?.titleSize ? { "--dashboard-slide-title-size": activeSlide.style.titleSize } : {}),
    ...(activeSlide.style?.bodySize ? { "--dashboard-slide-body-size": activeSlide.style.bodySize } : {}),
    ...(activeSlide.style?.eyebrowSize ? { "--dashboard-slide-eyebrow-size": activeSlide.style.eyebrowSize } : {}),
    ...(activeSlide.style?.imageSize ? { "--dashboard-slide-image-size": activeSlide.style.imageSize } : {}),
    ...(activeSlide.style?.mobileImageSize
      ? { "--dashboard-slide-mobile-image-size": activeSlide.style.mobileImageSize }
      : {}),
  } as CSSProperties & Record<string, string>;
  const contentClassName = [
    "dashboard-swipe-card__content",
    `dashboard-swipe-card__content--${selectedTemplate}`,
    selectedTemplate === "imageText" ? `dashboard-swipe-card__content--image-${imagePosition}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const textPaneClassName = [
    "dashboard-swipe-card__text-pane",
    `dashboard-swipe-card__text-pane--${textAlign}`,
  ].join(" ");

  const moveSlide = (direction: number) => {
    setSlideIndex((current) => {
      const total = activeTopic.slides.length;
      return (current + direction + total) % total;
    });
  };

  const moveTopic = (direction: number) => {
    setTopicIndex((current) => (current + direction + slideTopics.length) % slideTopics.length);
    setSlideIndex(0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStartRef.current;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    pointerStartRef.current = null;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const threshold = 42;

    if (absX < threshold && absY < threshold) return;

    if (absX > absY) {
      moveSlide(deltaX < 0 ? 1 : -1);
      return;
    }

    moveTopic(deltaY < 0 ? 1 : -1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") moveSlide(1);
    if (event.key === "ArrowLeft") moveSlide(-1);
    if (event.key === "ArrowDown") moveTopic(1);
    if (event.key === "ArrowUp") moveTopic(-1);
  };

  return (
    <section className="dashboard-slide-carousel" aria-label="Topic slides">
      <article
        className={`card dashboard-slide-card dashboard-swipe-card dashboard-swipe-card--${selectedTemplate}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={slideStyle}
        aria-label={`${activeTopic.title}, slide ${slideIndex + 1} of ${activeTopic.slides.length}`}
      >
        <div className="dashboard-swipe-card__toolbar">
          <div className="dashboard-swipe-card__meta">
            <span>{activeTopic.label}</span>
            <strong>{activeTopic.title}</strong>
            <span>
              {slideIndex + 1}/{activeTopic.slides.length}
            </span>
          </div>
        </div>

        <div className={contentClassName}>
          {showImage && (
            <div
              className="dashboard-swipe-card__image-pane"
              style={{ background: activeTopic.imageSurface }}
            >
              {activeSlide.imageUrl ? (
                <CachedRepoImage
                  src={activeSlide.imageUrl}
                  alt={activeSlide.imageAlt}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              ) : null}
            </div>
          )}

          {showText && (
            <div className={textPaneClassName}>
              <div className="dashboard-swipe-card__eyebrow" style={{ color: activeTopic.accent }}>
                {activeSlide.eyebrow}
              </div>
              <h3 className="dashboard-swipe-card__title">{activeSlide.title}</h3>
              <p className="dashboard-swipe-card__body">{activeSlide.body}</p>
            </div>
          )}
        </div>

        <div className="dashboard-swipe-card__footer">
          <div className="dashboard-swipe-card__dots" aria-label="Topic navigation">
            {slideTopics.map((topic, index) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setTopicIndex(index);
                  setSlideIndex(0);
                }}
                aria-label={`Open ${topic.title}`}
                aria-current={topicIndex === index}
              />
            ))}
          </div>

          <div className="dashboard-swipe-card__dots" aria-label="Slide navigation">
            {activeTopic.slides.map((slide, index) => (
              <button
                key={`${activeTopic.id}-${slide.title}`}
                type="button"
                onClick={() => setSlideIndex(index)}
                aria-label={`Open slide ${index + 1}`}
                aria-current={slideIndex === index}
              />
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const accountKey = useMemo(() => getLibraryUserKey(session?.user), [session]);
  const isOffline = useConnectionStatus();

  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [courses, setCourses] = useState<CourseSubject[]>([]);
  const [interviewItems, setInterviewItems] = useState<InterviewQuestionSummary[]>([]);
  const [cbtCollections, setCbtCollections] = useState<CbtCollections | null>(null);
  const [dashboardTopics, setDashboardTopics] = useState<DashboardCardTopic[]>([]);
  const [q, setQ] = useState("");
  const [syncingContent, setSyncingContent] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [offlineSyncState, setOfflineSyncState] = useState<ReturnType<typeof readOfflineSyncState>>(null);
  const [favoriteTopics, setFavoriteTopics] = useState<SavedFavoriteTopic[]>([]);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installInstalled, setInstallInstalled] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const hasLoadedStatusRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    for (const route of ["/interview", "/courses", "/cbt"]) {
      router.prefetch(route).catch(() => undefined);
    }
  }, [router, status]);

  useEffect(() => {
    const syncLibrary = () => {
      setFavoriteTopics(readFavoriteTopics(accountKey));
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncLibrary();
      }
    };

    syncLibrary();
    window.addEventListener("focus", syncLibrary);
    window.addEventListener("storage", syncLibrary);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", syncLibrary);
      window.removeEventListener("storage", syncLibrary);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [accountKey]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    (async () => {
      try {
        const favoritesRes = await fetch("/api/favorites", {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });

        if (!cancelled && favoritesRes.ok) {
          const serverFavorites = (await favoritesRes.json()) as SavedFavoriteTopic[];
          const mergedFavorites = mergeFavoriteTopics(readFavoriteTopics(accountKey), serverFavorites);
          writeFavoriteTopics(mergedFavorites, accountKey);
          setFavoriteTopics(mergedFavorites);
        }
      } catch {
        // keep local library state when sync fails
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accountKey, status]);

  useEffect(() => {
    const refresh = () => setOfflineSyncState(readOfflineSyncState());
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(OFFLINE_SYNC_STATE_EVENT, refresh as EventListener);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(OFFLINE_SYNC_STATE_EVENT, refresh as EventListener);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone) {
      setInstallInstalled(true);
    }

    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstallInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", captureInstallPrompt as EventListener);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    const controller = new AbortController();
    let pendingRequests = 6;

    const completeRequest = () => {
      pendingRequests -= 1;
      if (!cancelled && pendingRequests <= 0) {
        setSyncingContent(false);
      }
    };

    const requestOptions = {
      strategy: "cache-first" as const,
      revalidateOnCacheHit: true,
    };

    if (!hasLoadedStatusRef.current) {
      setSyncingContent(true);
    }

    fetchDashboardCards(controller.signal, requestOptions)
      .then((items) => {
        if (!cancelled && items.length > 0) {
          setDashboardTopics(items);
        }
      })
      .catch(() => undefined)
      .finally(completeRequest);

    fetchTickerItems(controller.signal, requestOptions)
      .then((items) => {
        if (!cancelled) {
          setTickerItems(items);
        }
      })
      .catch(() => undefined)
      .finally(completeRequest);

    fetchContentRepoStatus(controller.signal, requestOptions)
      .then((repoStatus) => {
        if (!cancelled) {
          setLastSyncedAt(repoStatus.updatedAt ? Date.parse(repoStatus.updatedAt) : null);
        }
      })
      .catch(() => {
        if (!cancelled && !hasLoadedStatusRef.current) {
          setLastSyncedAt(null);
        }
      })
      .finally(completeRequest);

    fetchCourseSubjects(controller.signal, requestOptions)
      .then((items) => {
        if (!cancelled) {
          setCourses(items);
        }
      })
      .catch(() => undefined)
      .finally(completeRequest);

    fetchInterviewQuestions(controller.signal, requestOptions)
      .then((items) => {
        if (!cancelled) {
          setInterviewItems(items);
        }
      })
      .catch(() => undefined)
      .finally(completeRequest);

    fetchCbtCollections(controller.signal, requestOptions)
      .then((items) => {
        if (!cancelled) {
          setCbtCollections(items);
        }
      })
      .catch(() => undefined)
      .finally(completeRequest);

    hasLoadedStatusRef.current = true;

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [status]);

  const handleLogout = async () => {
    clearBrowserSessionActive();
    clearCachedSessionUser();
    clearAppRouteHistory();

    try {
      await signOut({ redirect: false });
    } catch {
      // ignore
    }

    router.replace("/");
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice.catch(() => undefined);
    setInstallPrompt(null);
  };

  const logoSrc = theme === "dark" ? "/TinitiateLogo.png" : "/TinitiateLogoLight.png";
  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] || session?.user?.email?.split("@")[0] || "Learner";
  const accountInitial = firstName.charAt(0).toUpperCase() || "L";
  const accountEmail = session?.user?.email || "";
  const connectionTone = isOffline
    ? {
        label: "Offline",
        color: "var(--status-offline-color)",
        background: "var(--status-offline-background)",
        border: "var(--status-offline-border)",
      }
    : {
        label: "Online",
        color: "var(--status-online-color)",
        background: "var(--status-online-background)",
        border: "var(--status-online-border)",
      };

  const sectionCards = useMemo<SectionCard[]>(
    () => [
      {
        key: "interview",
        title: "Interview Questions",
        description: "Open the interview library and practice concise, high-signal answers.",
        href: "/interview",
        icon: FaUserTie,
        accent: "var(--dashboard-section-interview-accent)",
        surfaceLight: "var(--dashboard-section-interview-surface)",
        surfaceDark: "var(--dashboard-section-interview-surface)",
        keywords: ["interview", "questions", "answers", "practice"],
      },
      {
        key: "courses",
        title: "Courses",
        description: "Browse subjects and open topic readers from the GitHub course catalog.",
        href: "/courses",
        icon: FaBookOpen,
        accent: "var(--dashboard-section-courses-accent)",
        surfaceLight: "var(--dashboard-section-courses-surface)",
        surfaceDark: "var(--dashboard-section-courses-surface)",
        keywords: ["courses", "subjects", "topics", "learning"],
      },
      {
        key: "cbt",
        title: "CBT",
        description: "Jump into slideshows, training videos, and audio books in one place.",
        href: "/cbt",
        icon: FaLayerGroup,
        accent: "var(--dashboard-section-cbt-accent)",
        surfaceLight: "var(--dashboard-section-cbt-surface)",
        surfaceDark: "var(--dashboard-section-cbt-surface)",
        keywords: ["cbt", "slideshows", "videos", "audio", "media"],
      },
    ],
    []
  );

  const filteredSections = useMemo(() => {
    const query = normalizeSearch(q);
    if (!query) return sectionCards;

    return sectionCards.filter((section) => {
      if (normalizeSearch(section.title).includes(query)) return true;
      if (normalizeSearch(section.description).includes(query)) return true;
      return section.keywords.some((keyword) => normalizeSearch(keyword).includes(query));
    });
  }, [q, sectionCards]);

  const filteredFavoriteTopics = useMemo(() => {
    const query = normalizeSearch(q);
    if (!query) return favoriteTopics;

    return favoriteTopics.filter((item) => {
      if (normalizeSearch(item.topic_name).includes(query)) return true;
      if (normalizeSearch(item.subject).includes(query)) return true;
      if (normalizeSearch(item.summary || "").includes(query)) return true;
      return normalizeSearch(favoriteKindLabel(item)).includes(query);
    });
  }, [favoriteTopics, q]);

  const searchResults = useMemo<DashboardSearchResult[]>(() => {
    const tokens = getSearchTokens(q);
    if (tokens.length === 0) return [];

    const results: DashboardSearchResult[] = [];
    const seen = new Set<string>();
    const addResult = (result: DashboardSearchResult) => {
      if (seen.has(result.key)) return;
      seen.add(result.key);
      results.push(result);
    };

    for (const course of courses) {
      if (
        matchesSearchTokens(
          tokens,
          course.subject,
          course.title,
          course.category,
          course.level,
          course.summary,
          ...course.topics.map((topic) => topic.topic_name)
        )
      ) {
        addResult({
          key: `course:${course.slug}`,
          kind: "Course",
          title: course.subject,
          description: course.summary,
          meta: `${course.category} - ${course.level} - ${course.topics.length} topics`,
          href: {
            pathname: "/subject/[subject]",
            query: { subject: course.subject, readme: course.readme_url },
          },
          icon: FaBookOpen,
          accent: "var(--dashboard-section-courses-accent)",
        });
      }

      for (const topic of course.topics) {
        if (
          !matchesSearchTokens(
            tokens,
            topic.topic_name,
            ...(topic.bullets || []),
            topic.section_markdown
          )
        ) {
          continue;
        }

        addResult({
          key: `topic:${course.slug}:${topic.md_url || topic.topic_name}`,
          kind: "Topic",
          title: topic.topic_name,
          description: course.subject,
          meta: "Course topic",
          href: {
            pathname: "/topic/[topic]",
            query: {
              topic: topic.topic_name,
              subject: course.subject,
              ...(course.readme_url ? { readme: course.readme_url } : {}),
            },
          },
          icon: FaBookOpen,
          accent: "var(--dashboard-section-courses-accent)",
        });
      }
    }

    for (const item of interviewItems) {
      if (
        !matchesSearchTokens(
          tokens,
          item.title,
          item.category,
          item.level,
          item.question,
          item.excerpt,
          ...item.tags
        )
      ) {
        continue;
      }

      addResult({
        key: `interview:${item.slug}`,
        kind: "Interview Course",
        title: item.title,
        description: item.excerpt,
        meta: item.questionCount
          ? `${item.category} - ${item.questionCount} ${item.questionCount === 1 ? "question" : "questions"}`
          : `${item.category} - ${item.level}`,
        href: {
          pathname: "/interview/[slug]",
          query: { slug: item.slug },
        },
        icon: FaUserTie,
        accent: "var(--dashboard-section-interview-accent)",
        tags: item.tags,
      });
    }

    for (const deck of cbtCollections?.slideshows || []) {
      if (!matchesSearchTokens(tokens, deck.title, deck.summary, deck.audience, ...deck.tags)) {
        continue;
      }

      addResult({
        key: `slideshow:${deck.slug}`,
        kind: "Slideshow",
        title: deck.title,
        description: deck.summary,
        meta: deck.audience,
        href: {
          pathname: "/cbt/slides/[slug]",
          query: { slug: deck.slug },
        },
        icon: FaLayerGroup,
        accent: "var(--dashboard-section-cbt-accent)",
      });
    }

    for (const item of [
      ...(cbtCollections?.trainingVideos || []).map((entry) => ({ ...entry, kind: "Training Video" })),
      ...(cbtCollections?.audioBooks || []).map((entry) => ({ ...entry, kind: "Audio Book" })),
    ]) {
      if (!matchesSearchTokens(tokens, item.title, item.summary, item.speaker, ...item.tags)) {
        continue;
      }

      addResult({
        key: `media:${item.kind}:${item.slug}`,
        kind: item.kind,
        title: item.title,
        description: item.summary,
        meta: item.speaker,
        href: {
          pathname: "/cbt/media/[slug]",
          query: {
            slug: item.slug,
            kind: item.kind === "Training Video" ? "training-videos" : "audio-books",
          },
        },
        icon: FaLayerGroup,
        accent: "var(--dashboard-section-cbt-accent)",
      });
    }

    for (const item of favoriteTopics) {
      if (!matchesSearchTokens(tokens, item.topic_name, item.subject, item.summary, favoriteKindLabel(item))) {
        continue;
      }

      addResult({
        key: `favorite:${item.kind || "topic"}:${item.slug}`,
        kind: "Favorite",
        title: item.topic_name,
        description: item.summary || item.subject,
        meta: `Saved ${favoriteKindLabel(item)}`,
        href: favoriteHref(item),
        icon: favoriteIcon(item),
        accent: "var(--dashboard-library-favorites-color)",
      });
    }

    return results.slice(0, 12);
  }, [cbtCollections, courses, favoriteTopics, interviewItems, q]);

  const syncStatusText = isOffline
    ? lastSyncedAt
      ? `Last GitHub update ${formatDateTime(lastSyncedAt)}`
      : "Offline mode is active"
    : syncingContent
      ? "Refreshing GitHub content..."
      : lastSyncedAt
        ? `GitHub updated ${formatDateTime(lastSyncedAt)}`
        : "GitHub update time is unavailable right now.";
  const mobileSyncStatusText = isOffline
    ? lastSyncedAt
      ? `GitHub ${formatTime(lastSyncedAt)}`
      : "Offline mode"
    : syncingContent
      ? "Updating GitHub..."
      : lastSyncedAt
        ? `GitHub ${formatTime(lastSyncedAt)}`
        : "GitHub unavailable";

  const secondaryStatusText =
    offlineSyncState?.status === "ready"
      ? isOffline
        ? `Workspace cached ${formatDateTime(offlineSyncState.syncedAt)}.`
        : `Offline workspace updated ${formatDateTime(offlineSyncState.syncedAt)}.`
      : offlineSyncState?.status === "failed"
        ? "Offline workspace needs another refresh."
        : isOffline
          ? "Offline mode is active. This device is waiting for a full online sync."
          : "Preparing the workspace for offline use.";

  const searchPlaceholder = "Search Java, topics, interview questions, videos...";

  const openFavorite = (item: SavedFavoriteTopic) => {
    setLibraryOpen(false);
    router.push(favoriteHref(item));
  };

  return (
    <div className="app-shell app-shell--dashboard">
      <main className="page-main">
        <section
          className="card page-hero-card page-hero-card--dashboard"
          style={{
            marginBottom: 16,
          }}
        >
          <div className="page-hero-top" style={{ gap: 16 }}>
            <div className="page-hero-brand" style={{ gap: 18 }}>
              <Image
                src={logoSrc}
                alt="Tinitiate"
                width={1720}
                height={181}
                style={{ width: 190, maxWidth: "46vw", height: "auto", objectFit: "contain" }}
              />

              <div className="page-hero-copy">
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    color: "var(--text)",
                    fontWeight: 700,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span className="dashboard-sync-text dashboard-sync-text--desktop">{syncStatusText}</span>
                  <span className="dashboard-sync-text dashboard-sync-text--mobile">{mobileSyncStatusText}</span>
                  <span
                    className="dashboard-connection-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 11px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      color: connectionTone.color,
                      background: connectionTone.background,
                      border: `1px solid ${connectionTone.border}`,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: connectionTone.color,
                        display: "inline-block",
                      }}
                    />
                    {connectionTone.label}
                  </span>
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
                  {secondaryStatusText}
                </div>
              </div>
            </div>

            <div className="page-hero-actions">
              {installPrompt && !installInstalled && (
                <button className="btn btn-outline dashboard-action-install" onClick={handleInstall} type="button">
                  <FaDownload />
                  <span className="hide-mobile">Install</span>
                </button>
              )}

              <button
                className="btn btn-outline dashboard-menu-button"
                onClick={() => setLibraryOpen(true)}
                type="button"
                aria-label="Open dashboard library"
              >
                <FaBars />
                <span className="hide-mobile">Library</span>
              </button>

              <button className="btn btn-outline dashboard-action-theme" onClick={toggleTheme} type="button">
                {theme === "dark" ? <FaSun /> : <FaMoon />}
                <span className="hide-mobile">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              <div
                className="btn btn-outline dashboard-profile-btn dashboard-action-profile"
                style={{
                  pointerEvents: "none",
                }}
                title={accountEmail ? `${firstName} (${accountEmail})` : firstName}
              >
                <div className="dashboard-profile-btn__avatar">
                  {accountInitial}
                </div>

                <div className="dashboard-profile-btn__copy">
                  <div className="dashboard-profile-btn__name">{firstName}</div>
                </div>
              </div>

              <button className="btn btn-outline dashboard-action-logout" onClick={handleLogout} type="button">
                <FaSignOutAlt />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          </div>

          <div className="dashboard-search-tools">
            <div className="card search-bar-elevated page-hero-search dashboard-search-tools__search">
              <FaSearch style={{ color: "var(--muted)", fontSize: 16, flexShrink: 0 }} />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: 15,
                }}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  type="button"
                  aria-label="Clear search"
                  style={{
                    background: "var(--border)",
                    border: "none",
                    borderRadius: 999,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "var(--text)",
                    flexShrink: 0,
                  }}
                >
                  x
                </button>
              )}
            </div>

          </div>
        </section>

        {tickerItems.length > 0 && (
          <section className="dashboard-ticker-slot mobile-flat-ticker" style={{ marginBottom: 16 }}>
            <TickerBar items={tickerItems} />
          </section>
        )}

        <DashboardSlideCarousel topics={dashboardTopics} />

        {q.trim() && searchResults.length > 0 && (
          <section className="dashboard-search-results" style={{ marginBottom: 16 }}>
            <div className="dashboard-search-results__heading">
              Best matches
              <span>{searchResults.length} result{searchResults.length === 1 ? "" : "s"}</span>
            </div>

            <div className="dashboard-search-results__grid">
              {searchResults.map((result) => {
                const Icon = result.icon;

                return (
                  <Link
                    key={result.key}
                    href={result.href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="card dashboard-search-result-card">
                      <div
                        className="dashboard-search-result-card__icon"
                        style={{ color: result.accent }}
                      >
                        <Icon />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="dashboard-search-result-card__kind">{result.kind}</div>
                        <div className="dashboard-search-result-card__title">{result.title}</div>
                        <div className="dashboard-search-result-card__description">
                          {result.description}
                        </div>
                        <div className="dashboard-search-result-card__meta">{result.meta}</div>
                        {result.tags?.length ? (
                          <div className="dashboard-search-result-card__tags">
                            {result.tags.slice(0, 4).map((tag) => (
                              <span key={`${result.key}-${tag}`} className="badge">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="dashboard-section-list">
          {filteredSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.key}
                href={section.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card dashboard-section-card"
                  style={{
                    background: theme === "dark" ? section.surfaceDark : section.surfaceLight,
                  }}
                >
                  <div className="dashboard-section-card__main">
                    <div
                      className="dashboard-section-card__icon"
                      style={{
                        background:
                          theme === "dark"
                            ? "color-mix(in srgb, var(--surface) 86%, transparent)"
                            : "color-mix(in srgb, var(--surface) 90%, transparent)",
                        color: section.accent,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div className="dashboard-section-card__title">{section.title}</div>
                      <div className="dashboard-section-card__description">{section.description}</div>
                    </div>
                  </div>

                  <div
                    className="dashboard-section-card__open"
                    style={{ color: section.accent }}
                  >
                    Open
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            );
          })}

          {q.trim() && syncingContent && searchResults.length === 0 && filteredSections.length === 0 && (
            <div className="card" style={{ padding: 22, borderRadius: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                Searching cached content...
              </div>
            </div>
          )}

          {filteredSections.length === 0 && searchResults.length === 0 && !syncingContent && (
            <div className="card" style={{ padding: 22, borderRadius: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                No content matched your search. Try a subject, topic, technology, or question.
              </div>
            </div>
          )}
        </section>
      </main>

      {libraryOpen && (
        <div
          className="dashboard-library-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--dashboard-overlay)",
            backdropFilter: "blur(6px)",
            zIndex: 50,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setLibraryOpen(false)}
        >
          <aside
            className="card dashboard-library-panel"
            style={{
              width: "min(420px, 100vw)",
              height: "100vh",
              borderRadius: 0,
              padding: "22px 18px 18px",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dashboard-menu-header">
              <div className="dashboard-menu-profile">
                <div className="dashboard-menu-avatar">{accountInitial}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="dashboard-menu-title">
                    <span className="dashboard-menu-title__mobile">Menu</span>
                    <span className="dashboard-menu-title__desktop">Library</span>
                  </div>
                  <div className="dashboard-menu-subtitle">
                    {firstName}
                    {accountEmail ? ` - ${accountEmail}` : ""}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-outline dashboard-menu-close"
                type="button"
                onClick={() => setLibraryOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="dashboard-menu-content">
              <section className="dashboard-menu-section dashboard-menu-section--actions">
                <div className="dashboard-menu-section-title">Quick Actions</div>
                <div className="dashboard-menu-action-grid">
                  {installPrompt && !installInstalled ? (
                    <button
                      className="btn btn-outline dashboard-menu-action"
                      type="button"
                      onClick={handleInstall}
                    >
                      <FaDownload />
                      Install App
                    </button>
                  ) : null}
                  <button
                    className="btn btn-outline dashboard-menu-action"
                    type="button"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? <FaSun /> : <FaMoon />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    className="btn btn-outline dashboard-menu-action"
                    type="button"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </section>

              <section>
                <div className="dashboard-menu-section-head">
                  <div>
                    <div className="dashboard-menu-section-title">Favorites</div>
                    <div className="dashboard-menu-section-copy">
                      Saved topics, interview questions, slides, videos, and audio.
                    </div>
                  </div>
                  <span className="badge">{filteredFavoriteTopics.length}</span>
                </div>
                <div className="dashboard-menu-favorites">
                  {filteredFavoriteTopics.length > 0 ? (
                    filteredFavoriteTopics.map((item) => (
                      <button
                        key={`${item.kind || "topic"}-${item.subject}-${item.slug}`}
                        className="btn btn-outline dashboard-menu-favorite"
                        type="button"
                        onClick={() => openFavorite(item)}
                      >
                        <span className="dashboard-menu-favorite__text">
                          <span className="dashboard-menu-favorite__title">{item.topic_name}</span>
                          <span className="dashboard-menu-favorite__meta">
                            {favoriteKindLabel(item)} - {item.subject}
                          </span>
                        </span>
                        <FaArrowRight />
                      </button>
                    ))
                  ) : (
                    <div className="soft dashboard-menu-empty">
                      {q ? "No favorites matched your search." : "No favorites saved yet. Tap the star on content you want to revisit."}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

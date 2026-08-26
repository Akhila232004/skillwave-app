"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaHome, FaMoon, FaRegStar, FaSearch, FaStar, FaSun } from "react-icons/fa";
import CacheProgressBadge from "../../components/content/CacheProgressBadge";
import TickerBar from "../../components/content/TickerBar";
import { ThemeContext } from "../../context/ThemeContext";
import { useProtectedAppSession } from "../../lib/app-session";
import { fetchInterviewQuestions, fetchTickerItems } from "../../lib/content-client";
import type { InterviewQuestionSummary, TickerItem } from "../../lib/content-types";
import {
  getLibraryUserKey,
  isFavoriteItem,
  mergeFavoriteTopics,
  readFavoriteTopics,
  removeFavoriteTopic,
  upsertFavoriteTopic,
  writeFavoriteTopics,
  type SavedFavoriteTopic,
} from "../../lib/library";
import { goBackOr } from "../../lib/navigation";
import { buildInterviewCacheTargets, useCacheSaveProgress } from "../../lib/use-cache-save-progress";
import { useConnectionStatus } from "../../lib/use-connection-status";

const normalizeSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function InterviewIndexPage() {
  const router = useRouter();
  const { data: session, status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const accountKey = useMemo(() => getLibraryUserKey(session?.user), [session]);
  const isOffline = useConnectionStatus();
  const [items, setItems] = useState<InterviewQuestionSummary[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [favorites, setFavorites] = useState<SavedFavoriteTopic[]>([]);
  const hasLoadedItemsRef = useRef(false);

  useEffect(() => {
    const syncLibrary = () => setFavorites(readFavoriteTopics(accountKey));
    const handleVisibility = () => {
      if (document.visibilityState === "visible") syncLibrary();
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
        const res = await fetch("/api/favorites", {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });

        if (!cancelled && res.ok) {
          const serverFavorites = (await res.json()) as SavedFavoriteTopic[];
          const mergedFavorites = mergeFavoriteTopics(readFavoriteTopics(accountKey), serverFavorites);
          writeFavoriteTopics(mergedFavorites, accountKey);
          setFavorites(mergedFavorites);
        }
      } catch {
        // keep local favorites if server sync is unavailable
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accountKey, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        if (!hasLoadedItemsRef.current) {
          setLoading(true);
        }
        setError("");

        const results = await Promise.allSettled([
          fetchInterviewQuestions(controller.signal),
          fetchTickerItems(controller.signal),
        ]);

        if (cancelled) return;

        if (results[0].status === "fulfilled") {
          hasLoadedItemsRef.current = true;
          setItems(results[0].value);
        }
        if (results[1].status === "fulfilled") setTickerItems(results[1].value);

        if (results[0].status === "rejected" && !cancelled) {
          setError("Failed to load interview content. Please try refreshing.");
        }
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load interview content.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [status]);

  const filteredItems = useMemo(() => {
    const query = normalizeSearch(q);
    if (!query) return items;

    return items.filter((item) => {
      if (normalizeSearch(item.title).includes(query)) return true;
      if (normalizeSearch(item.category).includes(query)) return true;
      if (normalizeSearch(item.level).includes(query)) return true;
      if (normalizeSearch(item.question).includes(query)) return true;
      return item.tags.some((tag) => normalizeSearch(tag).includes(query));
    });
  }, [items, q]);
  const cacheTargets = useMemo(() => buildInterviewCacheTargets(items), [items]);
  const cacheProgress = useCacheSaveProgress(cacheTargets);

  const openCourse = (slug: string) => {
    router.push({
      pathname: "/interview/[slug]",
      query: { slug },
    });
  };

  const toggleFavorite = async (item: InterviewQuestionSummary) => {
    const kind = "interview";
    const isFavorite = isFavoriteItem(favorites, item.slug, kind);

    if (isFavorite) {
      const nextFavorites = removeFavoriteTopic(item.slug, accountKey, kind);
      setFavorites(nextFavorites);

      if (status === "authenticated") {
        try {
          const res = await fetch(
            `/api/favorites?slug=${encodeURIComponent(item.slug)}&kind=${encodeURIComponent(kind)}`,
            {
              method: "DELETE",
              headers: { "Cache-Control": "no-store" },
              cache: "no-store",
            }
          );

          if (res.ok) {
            const serverFavorites = (await res.json()) as SavedFavoriteTopic[];
            const mergedFavorites = mergeFavoriteTopics(nextFavorites, serverFavorites);
            writeFavoriteTopics(mergedFavorites, accountKey);
            setFavorites(mergedFavorites);
          }
        } catch {
          // keep local state even if server sync fails
        }
      }

      return;
    }

    const nextFavorite: SavedFavoriteTopic = {
      slug: item.slug,
      topic_name: item.title,
      subject: item.category,
      kind,
      summary: item.excerpt,
      href: {
        pathname: "/interview/[slug]",
        query: { slug: item.slug },
      },
      savedAt: Date.now(),
    };
    const nextFavorites = upsertFavoriteTopic(nextFavorite, accountKey);
    setFavorites(nextFavorites);

    if (status === "authenticated") {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          body: JSON.stringify(nextFavorite),
          cache: "no-store",
        });

        if (res.ok) {
          const serverFavorites = (await res.json()) as SavedFavoriteTopic[];
          const mergedFavorites = mergeFavoriteTopics(nextFavorites, serverFavorites);
          writeFavoriteTopics(mergedFavorites, accountKey);
          setFavorites(mergedFavorites);
        }
      } catch {
        // keep local state even if server sync fails
      }
    }
  };

  return (
    <div className="app-shell">
      <main className="page-main">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                INTERVIEW QNA
              </div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900 }}>
                Choose a course
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                Open a course to read all interview questions and answers in one place.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <span
                  className="badge"
                  style={{
                    color: isOffline
                      ? "var(--status-offline-color)"
                      : "var(--status-online-color)",
                    background: isOffline
                      ? "var(--status-offline-background)"
                      : "var(--status-online-background)",
                    borderColor: isOffline
                      ? "var(--status-offline-border)"
                      : "var(--status-online-border)",
                  }}
                >
                  {isOffline ? "Offline" : "Online"}
                </span>
                {cacheProgress.total > 0 ? <CacheProgressBadge progress={cacheProgress} /> : null}
              </div>
            </div>

            <div className="page-hero-actions">
              <button className="btn btn-outline" onClick={() => goBackOr(router, "/dashboard")} type="button">
                <FaArrowLeft /> Back
              </button>
              <Link href="/dashboard" className="btn btn-outline" title="Home">
                <FaHome />
              </Link>
              <button className="btn btn-outline" onClick={toggleTheme} type="button">
                {theme === "dark" ? <FaSun /> : <FaMoon />}
                <span className="hide-mobile">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>

          {tickerItems.length > 0 && (
            <div className="desktop-ticker-slot" style={{ marginTop: 18 }}>
              <TickerBar items={tickerItems} />
            </div>
          )}
        </div>

        <section style={{ marginTop: 20 }}>
          <div
            className="card page-hero-search"
            style={{ padding: "12px 14px", gap: 10 }}
          >
            <FaSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses, questions, or tags..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--text)",
              }}
            />
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          {loading && (
            <div className="card" style={{ padding: 18, borderRadius: 18 }}>
              Loading interview courses...
            </div>
          )}

          {!loading && error && (
            <div className="card" style={{ padding: 18, borderRadius: 18, color: "var(--status-offline-color)" }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="card" style={{ padding: 18, borderRadius: 18 }}>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                {q ? "No interview course matched your search." : "No interview courses are available right now."}
              </div>
            </div>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <div className="interview-question-list">
              {filteredItems.map((item) => {
                const excerpt = item.excerpt.trim();
                const showQuestion = Boolean(item.question.trim());
                const showExcerpt =
                  excerpt && (!showQuestion || normalizeSearch(excerpt) !== normalizeSearch(item.question));

                return (
                  <div
                    key={item.slug}
                    className="interview-question-link"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest('[data-no-nav="true"]')) return;
                      openCourse(item.slug);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openCourse(item.slug);
                      }
                    }}
                  >
                    <div className="card content-card interview-question-card">
                      <div className="interview-question-card__content">
                        <div className="content-card__title interview-question-card__title">
                          {item.title}
                        </div>

                        {showQuestion ? (
                          <div className="content-card__body interview-question-card__question">
                            {item.question}
                          </div>
                        ) : null}

                        {showExcerpt ? (
                          <div className="content-card__meta interview-question-card__excerpt">
                            {excerpt}
                          </div>
                        ) : null}

                        <div className="content-card__tags interview-question-card__tags">
                          {item.tags.map((tag) => (
                            <span key={tag} className="badge" style={{ fontSize: 10 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        data-no-nav="true"
                        type="button"
                        className="favorite-toggle interview-question-card__favorite"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(item);
                        }}
                        aria-label={
                          isFavoriteItem(favorites, item.slug, "interview")
                            ? "Remove interview course from favorites"
                            : "Add interview course to favorites"
                        }
                        aria-pressed={isFavoriteItem(favorites, item.slug, "interview")}
                        title={
                          isFavoriteItem(favorites, item.slug, "interview")
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {isFavoriteItem(favorites, item.slug, "interview") ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

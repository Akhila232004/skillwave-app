"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaHome,
  FaMoon,
  FaPlayCircle,
  FaRegStar,
  FaStar,
  FaSun,
  FaVolumeUp,
} from "react-icons/fa";
import { MdOutlineSlideshow } from "react-icons/md";
import CacheProgressBadge from "../../components/content/CacheProgressBadge";
import { ThemeContext } from "../../context/ThemeContext";
import { useProtectedAppSession } from "../../lib/app-session";
import { fetchCbtCollections } from "../../lib/content-client";
import type { CbtCollections, MediaCollectionItem, SlideshowSummary } from "../../lib/content-types";
import {
  getLibraryUserKey,
  isFavoriteItem,
  mergeFavoriteTopics,
  readFavoriteTopics,
  removeFavoriteTopic,
  upsertFavoriteTopic,
  writeFavoriteTopics,
  type SavedFavoriteKind,
  type SavedFavoriteTopic,
} from "../../lib/library";
import { goBackOr } from "../../lib/navigation";
import { buildCbtCacheTargets, useCacheSaveProgress } from "../../lib/use-cache-save-progress";
import { useConnectionStatus } from "../../lib/use-connection-status";

type TabKey = "slideshows" | "trainingVideos" | "audioBooks";

const tabOrder: Array<{ key: TabKey; label: string }> = [
  { key: "slideshows", label: "Slideshows" },
  { key: "trainingVideos", label: "Training Videos" },
  { key: "audioBooks", label: "Audio Books" },
];

export default function CbtPage() {
  const router = useRouter();
  const { data: session, status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const accountKey = useMemo(() => getLibraryUserKey(session?.user), [session]);
  const isOffline = useConnectionStatus();
  const [tab, setTab] = useState<TabKey>("slideshows");
  const [data, setData] = useState<CbtCollections | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<SavedFavoriteTopic[]>([]);
  const hasLoadedDataRef = useRef(false);

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
        if (!hasLoadedDataRef.current) {
          setLoading(true);
        }
        setError("");
        const nextData = await fetchCbtCollections(controller.signal);
        hasLoadedDataRef.current = true;
        setData(nextData);
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load CBT content.");
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

  const slideItems = data?.slideshows || [];
  const trainingItems = data?.trainingVideos || [];
  const audioItems = data?.audioBooks || [];
  const cacheTargets = useMemo(() => buildCbtCacheTargets(data), [data]);
  const cacheProgress = useCacheSaveProgress(cacheTargets);

  const slideshowFavorite = (item: SlideshowSummary): SavedFavoriteTopic => ({
    slug: item.slug,
    topic_name: item.title,
    subject: "Slideshow",
    kind: "slideshow",
    summary: item.summary,
    href: {
      pathname: "/cbt/slides/[slug]",
      query: { slug: item.slug },
    },
    savedAt: Date.now(),
  });

  const mediaFavorite = (
    item: MediaCollectionItem,
    mediaKind: "training-videos" | "audio-books"
  ): SavedFavoriteTopic => {
    const isTraining = mediaKind === "training-videos";

    return {
      slug: item.slug,
      topic_name: item.title,
      subject: isTraining ? "Training Video" : "Audio Book",
      kind: isTraining ? "training-video" : "audio-book",
      summary: item.summary,
      href: {
        pathname: "/cbt/media/[slug]",
        query: { slug: item.slug, kind: mediaKind },
      },
      savedAt: Date.now(),
    };
  };

  const toggleFavorite = async (favorite: SavedFavoriteTopic) => {
    const kind: SavedFavoriteKind = favorite.kind || "topic";
    const isFavorite = isFavoriteItem(favorites, favorite.slug, kind);

    if (isFavorite) {
      const nextFavorites = removeFavoriteTopic(favorite.slug, accountKey, kind);
      setFavorites(nextFavorites);

      if (status === "authenticated") {
        try {
          const res = await fetch(
            `/api/favorites?slug=${encodeURIComponent(favorite.slug)}&kind=${encodeURIComponent(kind)}`,
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

    const nextFavorite = { ...favorite, savedAt: Date.now() };
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

  const openCbtItem = (favorite: SavedFavoriteTopic) => {
    if (favorite.href) {
      router.push(favorite.href);
    }
  };

  return (
    <div className="app-shell">
      <main className="page-main">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>CBT HUB</div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900 }}>
                Slideshows, training videos, and audio books
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                Choose the format that fits your study session and continue from the collection you want.
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
        </div>

        <section style={{ marginTop: 18 }}>
          <div
            className="card content-tab-bar"
          >
            {tabOrder.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setTab(entry.key)}
                className={tab === entry.key ? "btn btn-primary" : "btn btn-outline"}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18 }}>
            Loading CBT content...
          </div>
        )}

        {!loading && error && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18, color: "var(--status-offline-color)" }}>
            {error}
          </div>
        )}

        {!loading && !error && tab === "slideshows" && (
          <section
            className="content-grid"
            style={{
              marginTop: 18,
            }}
          >
            {slideItems.map((item) => {
              const favorite = slideshowFavorite(item);
              const isFavorite = isFavoriteItem(favorites, favorite.slug, "slideshow");

              return (
                <div
                  key={item.slug}
                  className="content-card-link"
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest('[data-no-nav="true"]')) return;
                    openCbtItem(favorite);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openCbtItem(favorite);
                    }
                  }}
                >
                  <div className="card content-card content-card--favoritable">
                    <div className="content-card__topline">
                      <div className="content-card__icon">
                        <MdOutlineSlideshow />
                      </div>
                      <button
                        data-no-nav="true"
                        type="button"
                        className="favorite-toggle content-card__favorite"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(favorite);
                        }}
                        aria-label={isFavorite ? "Remove slideshow from favorites" : "Add slideshow to favorites"}
                        aria-pressed={isFavorite}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  <div className="content-card__title" style={{ marginTop: 14 }}>{item.title}</div>
                  <div className="content-card__body">{item.summary}</div>
                  <div className="content-card__meta">
                    Audience: {item.audience}
                  </div>
                  <div className="content-card__tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge" style={{ fontSize: 10 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </section>
        )}

        {!loading && !error && tab !== "slideshows" && (
          <section
            className="content-grid"
            style={{
              marginTop: 18,
            }}
          >
            {(tab === "trainingVideos" ? trainingItems : audioItems).map((item) => {
              const mediaKind = tab === "trainingVideos" ? "training-videos" : "audio-books";
              const favorite = mediaFavorite(item, mediaKind);
              const isFavorite = isFavoriteItem(favorites, favorite.slug, favorite.kind);

              return (
                <div
                  key={item.slug}
                  className="content-card-link"
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest('[data-no-nav="true"]')) return;
                    openCbtItem(favorite);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openCbtItem(favorite);
                    }
                  }}
                >
                  <div className="card content-card content-card--favoritable">
                    <div className="content-card__topline">
                      <div className="content-card__icon">
                        {tab === "trainingVideos" ? <FaPlayCircle /> : <FaVolumeUp />}
                      </div>
                      <button
                        data-no-nav="true"
                        type="button"
                        className="favorite-toggle content-card__favorite"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(favorite);
                        }}
                        aria-label={
                          isFavorite
                            ? `Remove ${favorite.subject.toLowerCase()} from favorites`
                            : `Add ${favorite.subject.toLowerCase()} to favorites`
                        }
                        aria-pressed={isFavorite}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  <div className="content-card__title" style={{ marginTop: 14 }}>{item.title}</div>
                  <div className="content-card__body">{item.summary}</div>
                  <div className="content-card__meta">
                    Speaker: {item.speaker}
                  </div>
                  <div className="content-card__tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge" style={{ fontSize: 10 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

"use client";

import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaMoon, FaSun } from "react-icons/fa";
import RepoMarkdown from "../../../components/content/RepoMarkdown";
import { ThemeContext } from "../../../context/ThemeContext";
import { useProtectedAppSession } from "../../../lib/app-session";
import { fetchMediaItem } from "../../../lib/content-client";
import type { MediaCollectionItem } from "../../../lib/content-types";
import { goBackOr } from "../../../lib/navigation";
import { toGithubProxyUrl } from "../../../lib/readme-utils";

const isMediaKind = (value: string): value is "training-videos" | "audio-books" =>
  value === "training-videos" || value === "audio-books";

export default function MediaDetailPage() {
  const router = useRouter();
  const { slug, kind } = router.query;
  const { status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [item, setItem] = useState<MediaCollectionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedKeyRef = useRef("");

  useEffect(() => {
    if (status !== "authenticated" || typeof slug !== "string" || typeof kind !== "string") {
      return;
    }

    if (!isMediaKind(kind)) {
      setError("Unsupported media type.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const loadKey = `${kind}:${slug}`;

    (async () => {
      try {
        if (loadedKeyRef.current !== loadKey) {
          setLoading(true);
        }
        setError("");

        const nextItem = await fetchMediaItem(kind, slug, controller.signal);
        if (cancelled) return;

        loadedKeyRef.current = loadKey;
        setItem(nextItem);
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load media item.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [kind, slug, status]);

  const pageLabel = kind === "audio-books" ? "Audio Book" : "Training Video";
  const hasNativeMedia = Boolean(item?.mediaUrl);

  return (
    <div className="app-shell">
      <main className="page-main" style={{ maxWidth: 1080 }}>
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>{pageLabel.toUpperCase()}</div>
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>
                {item?.title || "Loading media..."}
              </div>
            </div>

            <div className="page-hero-actions">
              <button className="btn btn-outline" onClick={() => goBackOr(router, "/cbt")} type="button">
                <FaArrowLeft /> Back
              </button>
              <button className="btn btn-outline" onClick={toggleTheme} type="button">
                {theme === "dark" ? <FaSun /> : <FaMoon />}
                <span className="hide-mobile">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18 }}>
            Loading media item...
          </div>
        )}

        {!loading && error && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18, color: "var(--status-offline-color)" }}>
            {error}
          </div>
        )}

        {!loading && item && (
          <>
            <section style={{ marginTop: 18 }}>
              <div className="card reader-card reader-card--compact" style={{ padding: 18, borderRadius: 22 }}>
                <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
                  {item.summary}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
                  Speaker: {item.speaker}
                </div>
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge" style={{ fontSize: 10 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {item.playlistUrl ? (
                    <a
                      href={item.playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Open Source Link
                    </a>
                  ) : null}
                  {item.mediaUrl ? (
                    <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                      Open Media File
                    </a>
                  ) : null}
                </div>
              </div>
            </section>

            {item.mediaUrl && kind === "training-videos" && (
              <section style={{ marginTop: 18 }}>
                <div className="card reader-card reader-card--compact" style={{ padding: 18, borderRadius: 22 }}>
                  <video
                    controls
                    preload="metadata"
                    poster={item.posterUrl ? toGithubProxyUrl(item.posterUrl) : undefined}
                    style={{
                      width: "100%",
                      borderRadius: 18,
                      background: "var(--text)",
                    }}
                  >
                    <source src={item.mediaUrl} type={item.mimeType || undefined} />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
              </section>
            )}

            {item.mediaUrl && kind === "audio-books" && (
              <section style={{ marginTop: 18 }}>
                <div className="card reader-card reader-card--compact" style={{ padding: 18, borderRadius: 22 }}>
                  <audio controls preload="metadata" style={{ width: "100%" }}>
                    <source src={item.mediaUrl} type={item.mimeType || undefined} />
                    Your browser does not support HTML5 audio playback.
                  </audio>
                </div>
              </section>
            )}

            {!hasNativeMedia && item.embedUrl && (
              <section style={{ marginTop: 18 }}>
                <div className="card reader-card reader-card--compact" style={{ padding: 18, borderRadius: 22 }}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      borderRadius: 18,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {item.notesMarkdown && (
              <section style={{ marginTop: 18 }}>
                <div className="card reader-card" style={{ padding: 22, borderRadius: 22 }}>
                  <div className="prose">
                    <RepoMarkdown baseUrl={item.notesMarkdownUrl}>{item.notesMarkdown}</RepoMarkdown>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

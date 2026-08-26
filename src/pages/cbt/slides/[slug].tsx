"use client";

import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaMoon, FaSun } from "react-icons/fa";
import RepoMarkdown from "../../../components/content/RepoMarkdown";
import { ThemeContext } from "../../../context/ThemeContext";
import { useProtectedAppSession } from "../../../lib/app-session";
import { fetchSlideshow } from "../../../lib/content-client";
import type { SlideshowDeck } from "../../../lib/content-types";
import { goBackOr } from "../../../lib/navigation";

export default function SlideshowPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [deck, setDeck] = useState<SlideshowDeck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedSlugRef = useRef("");

  useEffect(() => {
    if (status !== "authenticated" || typeof slug !== "string") return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        if (loadedSlugRef.current !== slug) {
          setLoading(true);
        }
        setError("");
        const nextDeck = await fetchSlideshow(slug, controller.signal);
        if (cancelled) return;

        loadedSlugRef.current = slug;
        setDeck(nextDeck);
        setCurrentIndex(0);
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load slideshow.");
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
  }, [slug, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!deck) return;
      if (event.key === "ArrowRight") {
        setCurrentIndex((index) => Math.min(index + 1, deck.slides.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setCurrentIndex((index) => Math.max(index - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck]);

  const activeSlide = useMemo(() => deck?.slides[currentIndex] || null, [currentIndex, deck]);

  return (
    <div className="app-shell">
      <main className="page-main">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>SLIDESHOW PLAYER</div>
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>
                {deck?.title || "Loading slideshow..."}
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                Use the slide list, arrow buttons, or keyboard arrows to move through the deck.
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
            Loading slideshow...
          </div>
        )}

        {!loading && error && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18, color: "var(--status-offline-color)" }}>
            {error}
          </div>
        )}

        {!loading && deck && activeSlide && (
          <div className="reader-layout" style={{ marginTop: 18 }}>
            <aside className="card reader-layout__sidebar" style={{ padding: 16, borderRadius: 22, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>SLIDES</div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {deck.slides.map((slide) => (
                  <button
                    key={`${slide.index}-${slide.title}`}
                    type="button"
                    onClick={() => setCurrentIndex(slide.index)}
                    className={slide.index === currentIndex ? "btn btn-primary" : "btn btn-outline"}
                    style={{ justifyContent: "flex-start", width: "100%" }}
                  >
                    {slide.index + 1}. {slide.title}
                  </button>
                ))}
              </div>
            </aside>

            <section className="card reader-layout__content reader-card" style={{ padding: 22, borderRadius: 22, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>
                    Slide {currentIndex + 1} of {deck.slides.length}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{activeSlide.title}</div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={currentIndex >= deck.slides.length - 1}
                    onClick={() =>
                      setCurrentIndex((index) => Math.min(index + 1, deck.slides.length - 1))
                    }
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>

              <div className="prose" style={{ minHeight: "60vh" }}>
                <RepoMarkdown baseUrl={deck.markdown_url}>{activeSlide.markdown}</RepoMarkdown>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

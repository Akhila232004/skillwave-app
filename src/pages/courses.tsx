"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHome, FaMoon, FaSearch, FaSun } from "react-icons/fa";

import CacheProgressBadge from "../components/content/CacheProgressBadge";
import CachedRepoImage from "../components/content/CachedRepoImage";
import TickerBar from "../components/content/TickerBar";
import { ThemeContext } from "../context/ThemeContext";
import { useProtectedAppSession } from "../lib/app-session";
import { fetchCourseSubjects, fetchTickerItems } from "../lib/content-client";
import type { CourseSubject, TickerItem } from "../lib/content-types";
import { goBackOr } from "../lib/navigation";
import { buildCourseCacheTargets, useCacheSaveProgress } from "../lib/use-cache-save-progress";
import { useConnectionStatus } from "../lib/use-connection-status";

const normalizeSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const getSearchTokens = (value: string) =>
  normalizeSearch(value).split(/\s+/).filter(Boolean);

const matchesSearchTokens = (tokens: string[], ...values: Array<string | undefined>) => {
  if (tokens.length === 0) return true;
  const haystack = normalizeSearch(values.filter(Boolean).join(" "));
  return tokens.every((token) => haystack.includes(token));
};

const accentByCategory = (category: string) => {
  const normalized = normalizeSearch(category);

  if (normalized.includes("front")) {
    return {
      background: "var(--course-tone-frontend-background)",
      border: "var(--course-tone-frontend-border)",
      color: "var(--course-tone-frontend-color)",
    };
  }

  if (normalized.includes("data") || normalized.includes("database")) {
    return {
      background: "var(--course-tone-database-background)",
      border: "var(--course-tone-database-border)",
      color: "var(--course-tone-database-color)",
    };
  }

  if (normalized.includes("back")) {
    return {
      background: "var(--course-tone-backend-background)",
      border: "var(--course-tone-backend-border)",
      color: "var(--course-tone-backend-color)",
    };
  }

  if (normalized.includes("full")) {
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

export default function CoursesPage() {
  const router = useRouter();
  const { status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isOffline = useConnectionStatus();
  const [courses, setCourses] = useState<CourseSubject[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const hasLoadedCoursesRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        if (!hasLoadedCoursesRef.current) {
          setLoading(true);
        }
        setError("");

        const results = await Promise.allSettled([
          fetchCourseSubjects(controller.signal),
          fetchTickerItems(controller.signal),
        ]);

        if (cancelled) return;

        if (results[0].status === "fulfilled") {
          hasLoadedCoursesRef.current = true;
          setCourses(results[0].value);
        }
        if (results[1].status === "fulfilled") setTickerItems(results[1].value);

        if (results[0].status === "rejected") {
          setError("Failed to load courses. Please try refreshing.");
        }
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load courses.");
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
  }, [status]);

  const filteredCourses = useMemo(() => {
    const tokens = getSearchTokens(q);
    if (tokens.length === 0) return courses;

    return courses.filter((course) => {
      return matchesSearchTokens(
        tokens,
        course.subject,
        course.category,
        course.level,
        course.summary,
        ...course.topics.flatMap((topic) => [
          topic.topic_name,
          topic.section_markdown,
          ...(topic.bullets || []),
        ])
      );
    });
  }, [courses, q]);
  const cacheTargets = useMemo(() => buildCourseCacheTargets(courses), [courses]);
  const cacheProgress = useCacheSaveProgress(cacheTargets);

  return (
    <div className="app-shell">
      <main className="page-main">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                COURSES
              </div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900 }}>
                Browse the subject library
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                Open any subject to continue into its topic reader.
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
            className="card search-bar-elevated page-hero-search"
            style={{ padding: "12px 14px", gap: 10 }}
          >
            <FaSearch />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search subjects, categories, levels, or topics..."
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
              Loading courses...
            </div>
          )}

          {!loading && error && (
            <div className="card" style={{ padding: 18, borderRadius: 18, color: "var(--status-offline-color)" }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="card" style={{ padding: 18, borderRadius: 18 }}>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                {q ? "No course matched your search." : "No courses are available right now."}
              </div>
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="course-library-grid">
              {filteredCourses.map((course) => {
                const tone = accentByCategory(course.category);

                return (
                  <Link
                    key={course.slug}
                    href={{
                      pathname: "/subject/[subject]",
                      query: { subject: course.subject, readme: course.readme_url },
                    }}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="card course-library-card"
                      style={{
                        borderColor: tone.border,
                        background: "var(--course-card-bg)",
                      }}
                    >
                      <div
                        style={{
                          height: 5,
                          borderRadius: 999,
                          background: tone.background,
                        }}
                      />

                      <div className="course-library-card__header">
                        {course.icon_url ? (
                          <div
                            className="course-library-card__icon-shell"
                            style={{
                              border: `1px solid ${tone.border}`,
                              background: tone.background,
                              color: tone.color,
                            }}
                          >
                            <CachedRepoImage src={course.icon_url} alt={`${course.subject} icon`} loading="lazy" />
                          </div>
                        ) : null}

                        <div className="course-library-card__meta">
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: `1px solid ${tone.border}`,
                              background: tone.background,
                              fontSize: 11,
                              fontWeight: 800,
                              color: tone.color,
                            }}
                          >
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "clamp(21px, 2.4vw, 26px)", fontWeight: 900, lineHeight: 1.2 }}>
                          {course.subject}
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                          className="course-library-card__summary"
                        >
                          {course.summary}
                        </div>
                      </div>

                      {course.topics.length > 0 && (
                        <div>
                          <div style={{ marginTop: 12 }} className="course-library-card__topics">
                            {course.topics.slice(0, 3).map((topic) => (
                              <span key={topic.md_url} className="badge" style={{ fontSize: 10 }}>
                                {topic.topic_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="course-library-card__cta">
                        <span className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                          Open Subject <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

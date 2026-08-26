"use client";

import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaMoon, FaSun } from "react-icons/fa";
import RepoMarkdown from "../../components/content/RepoMarkdown";
import { ThemeContext } from "../../context/ThemeContext";
import { useProtectedAppSession } from "../../lib/app-session";
import { fetchInterviewQuestion } from "../../lib/content-client";
import type { InterviewQuestionDetail } from "../../lib/content-types";
import { goBackOr } from "../../lib/navigation";

export default function InterviewDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { status } = useProtectedAppSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [item, setItem] = useState<InterviewQuestionDetail | null>(null);
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

        const nextItem = await fetchInterviewQuestion(slug, controller.signal);
        if (cancelled) return;

        loadedSlugRef.current = slug;
        setItem(nextItem);
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load the interview answer.");
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

  return (
    <div className="app-shell">
      <main className="page-main page-main--narrow">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                INTERVIEW Q&A COURSE
              </div>
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>
                {item?.title || "Loading course..."}
              </div>
            </div>

            <div className="page-hero-actions">
              <button className="btn btn-outline" onClick={() => goBackOr(router, "/interview")} type="button">
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
            Loading interview answers...
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
                <div className="content-card__tags" style={{ marginTop: 0 }}>
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge" style={{ fontSize: 10 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {item.questions && item.questions.length > 0 ? (
              <section style={{ marginTop: 18, display: "grid", gap: 16 }}>
                {item.questions.map((question, index) => (
                  <article
                    key={question.slug}
                    className="card reader-card"
                    style={{ padding: 22, borderRadius: 22 }}
                  >
                    <div className="content-card__tags" style={{ marginTop: 0 }}>
                      <span className="badge">Question {index + 1}</span>
                      <span className="badge">{question.level}</span>
                    </div>

                    <h2
                      style={{
                        margin: "16px 0 8px",
                        fontSize: 24,
                        lineHeight: 1.25,
                        fontWeight: 900,
                      }}
                    >
                      {question.title}
                    </h2>

                    {question.question !== question.title ? (
                      <div style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.65 }}>
                        {question.question}
                      </div>
                    ) : null}

                    <div className="prose">
                      <RepoMarkdown baseUrl={question.markdown_url || item.markdown_url}>
                        {question.markdown}
                      </RepoMarkdown>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <section style={{ marginTop: 18 }}>
                <div className="card reader-card" style={{ padding: 22, borderRadius: 22 }}>
                  <div className="prose">
                    <RepoMarkdown baseUrl={item.markdown_url}>{item.markdown}</RepoMarkdown>
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

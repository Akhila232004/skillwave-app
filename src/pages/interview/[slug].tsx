"use client";

import { useRouter } from "next/router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaMoon,
  FaStar,
  FaRegStar,
  FaSun,
} from "react-icons/fa";

import RepoMarkdown from "../../components/content/RepoMarkdown";
import { ThemeContext } from "../../context/ThemeContext";
import { useProtectedAppSession } from "../../lib/app-session";
import { fetchInterviewQuestion } from "../../lib/content-client";

import type {
  InterviewCourseQuestion,
  InterviewQuestionDetail,
} from "../../lib/content-types";

import { goBackOr } from "../../lib/navigation";

export default function InterviewDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { status } =
    useProtectedAppSession();

  const { theme, toggleTheme } =
    useContext(ThemeContext);

  /*
   * ================================
   * INTERVIEW DATA
   * ================================
   */

  const [item, setItem] =
    useState<InterviewQuestionDetail | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ================================
   * QUESTION NAVIGATION
   * ================================
   */

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const loadedSlugRef =
    useRef("");

  /*
   * Reference to the scrollable
   * question card.
   */
  const questionCardRef =
    useRef<HTMLElement | null>(null);

  /*
   * ================================
   * INDIVIDUAL QUESTION FAVORITES
   * ================================
   *
   * Each question has its own favorite
   * identity.
   *
   * Example:
   *
   * interview-question:
   * java::question-1
   *
   * interview-question:
   * java::question-2
   *
   * Therefore two questions in the
   * same interview course can both
   * independently be favorites.
   */

  const [
    favoriteQuestionSlugs,
    setFavoriteQuestionSlugs,
  ] = useState<Set<string>>(
    new Set()
  );

  const [
    favoriteLoading,
    setFavoriteLoading,
  ] = useState(false);

  /*
   * ================================
   * LOAD INTERVIEW COURSE
   * ================================
   */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      typeof slug !== "string"
    ) {
      return;
    }

    let cancelled = false;

    const controller =
      new AbortController();

    (async () => {
      try {
        if (
          loadedSlugRef.current !== slug
        ) {
          setLoading(true);
          setCurrentQuestion(0);
          setCompleted(false);
          setFavoriteQuestionSlugs(
            new Set()
          );
        }

        setError("");

        /*
         * Load interview content.
         */
        const nextItem =
          await fetchInterviewQuestion(
            slug,
            controller.signal
          );

        if (cancelled) {
          return;
        }

        loadedSlugRef.current =
          slug;

        setItem(nextItem);
        setCurrentQuestion(0);
        setCompleted(false);

        /*
         * Load the user's saved
         * individual interview-question
         * favorites.
         */
        try {
          const favoritesResponse =
            await fetch(
              "/api/favorites",
              {
                method: "GET",
                credentials: "include",
                signal:
                  controller.signal,
              }
            );

          if (
            favoritesResponse.ok
          ) {
            const favorites =
              await favoritesResponse.json();

            if (
              Array.isArray(
                favorites
              )
            ) {
              const questionFavorites =
                favorites
                  .filter(
                    (
                      favorite: {
                        kind?: string;
                        slug?: string;
                      }
                    ) =>
                      favorite.kind ===
                        "interview-question" &&
                      typeof favorite.slug ===
                        "string"
                  )
                  .map(
                    (
                      favorite: {
                        slug?: string;
                      }
                    ) =>
                      String(
                        favorite.slug
                      )
                  )
                  .filter(
                    (
                      favoriteSlug: string
                    ) =>
                      favoriteSlug.startsWith(
                        `${slug}::`
                      )
                  );

              setFavoriteQuestionSlugs(
                new Set(
                  questionFavorites
                )
              );
            }
          }
        } catch (favoriteError) {
          /*
           * Do not prevent the interview
           * from loading if favorites
           * fail.
           */
          if (
            !(
              favoriteError instanceof
                DOMException &&
              favoriteError.name ===
                "AbortError"
            )
          ) {
            console.warn(
              "Failed to load interview question favorites:",
              favoriteError
            );
          }
        }
      } catch (err: unknown) {
        if (
          !cancelled &&
          !(
            err instanceof DOMException &&
            err.name === "AbortError"
          )
        ) {
          setError(
            "Failed to load the interview answer."
          );
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

  /*
   * ================================
   * QUESTIONS
   * ================================
   */

  const questions: InterviewCourseQuestion[] =
    item?.questions ?? [];

  const totalQuestions =
    questions.length;

  const question =
    totalQuestions > 0
      ? questions[currentQuestion]
      : null;

  /*
   * ================================
   * INDIVIDUAL QUESTION FAVORITE ID
   * ================================
   *
   * The course slug and question slug
   * are combined so that questions
   * remain unique.
   */

  const currentQuestionFavoriteSlug =
    useMemo(() => {
      if (
        typeof slug !== "string" ||
        !question
      ) {
        return "";
      }

      const questionSlug =
        String(
          question.slug || ""
        ).trim();

      /*
       * Normally question.slug will
       * already be unique.
       *
       * The index is included as a
       * fallback so that even a content
       * item without a slug remains
       * independently favoritable.
       */
      return questionSlug
        ? `${slug}::${questionSlug}`
        : `${slug}::question-${currentQuestion + 1}`;
    }, [
      slug,
      question,
      currentQuestion,
    ]);

  const isCurrentQuestionFavorite =
    Boolean(
      currentQuestionFavoriteSlug &&
        favoriteQuestionSlugs.has(
          currentQuestionFavoriteSlug
        )
    );

  /*
   * ================================
   * TOGGLE QUESTION FAVORITE
   * ================================
   */

  const toggleQuestionFavorite =
    useCallback(async () => {
      if (
        !currentQuestionFavoriteSlug ||
        !question ||
        typeof slug !== "string" ||
        favoriteLoading
      ) {
        return;
      }

      setFavoriteLoading(true);

      const currentlyFavorite =
        favoriteQuestionSlugs.has(
          currentQuestionFavoriteSlug
        );

      try {
        if (
          currentlyFavorite
        ) {
          /*
           * Remove this individual
           * question from favorites.
           */
          const response =
            await fetch(
              `/api/favorites?slug=${encodeURIComponent(
                currentQuestionFavoriteSlug
              )}&kind=interview-question`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to remove favorite"
            );
          }

          setFavoriteQuestionSlugs(
            (previous) => {
              const next =
                new Set(
                  previous
                );

              next.delete(
                currentQuestionFavoriteSlug
              );

              return next;
            }
          );
        } else {
          /*
           * Save this individual
           * question as a favorite.
           */
          const response =
            await fetch(
              "/api/favorites",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify(
                  {
                    /*
                     * Unique identity:
                     *
                     * course-slug::
                     * question-slug
                     */
                    slug:
                      currentQuestionFavoriteSlug,

                    /*
                     * Display name shown
                     * in the favorites area.
                     */
                    topic_name:
                      question.title,

                    /*
                     * Interview course name.
                     */
                    subject:
                      item?.title ||
                      "Interview",

                    /*
                     * IMPORTANT:
                     *
                     * This distinguishes
                     * question favorites
                     * from course favorites.
                     */
                    kind:
                      "interview-question",

                    summary:
                      question.excerpt ||
                      question.question ||
                      "",

                    href: {
                      pathname:
                        `/interview/${slug}`,
                      query: {
                        question:
                          String(
                            currentQuestion
                          ),
                      },
                    },

                    md_url:
                      question.markdown_url ||
                      item?.markdown_url,

                    subject_readme_url:
                      item?.markdown_url,

                    savedAt:
                      Date.now(),
                  }
                ),
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to add favorite"
            );
          }

          setFavoriteQuestionSlugs(
            (previous) => {
              const next =
                new Set(
                  previous
                );

              next.add(
                currentQuestionFavoriteSlug
              );

              return next;
            }
          );
        }
      } catch (favoriteError) {
        console.error(
          "Failed to update interview question favorite:",
          favoriteError
        );
      } finally {
        setFavoriteLoading(false);
      }
    }, [
      currentQuestionFavoriteSlug,
      question,
      slug,
      favoriteLoading,
      favoriteQuestionSlugs,
      item,
      currentQuestion,
    ]);

  /*
   * ================================
   * CHANGE QUESTION
   * ================================
   *
   * direction:
   *
   *   1  = next
   *  -1  = previous
   */

  const changeQuestion =
    useCallback(
      (direction: number) => {
        if (
          totalQuestions === 0 ||
          isTransitioning
        ) {
          return;
        }

        const nextIndex =
          currentQuestion +
          direction;

        /*
         * If the user is on the last
         * question and clicks Next,
         * finish the interview.
         */
        if (
          direction > 0 &&
          currentQuestion ===
            totalQuestions - 1
        ) {
          setCompleted(true);
          return;
        }

        /*
         * Don't move before question 1.
         */
        if (
          nextIndex < 0
        ) {
          return;
        }

        /*
         * Don't move beyond the
         * final question.
         */
        if (
          nextIndex >=
          totalQuestions
        ) {
          return;
        }

        setIsTransitioning(
          true
        );

        /*
         * Reset scroll position before
         * changing the question.
         */
        if (
          questionCardRef.current
        ) {
          questionCardRef.current.scrollTop =
            0;
        }

        window.setTimeout(() => {
          setCurrentQuestion(
            nextIndex
          );

          /*
           * Small transition delay.
           */
          window.setTimeout(() => {
            setIsTransitioning(
              false
            );
          }, 80);
        }, 120);
      },
      [
        currentQuestion,
        isTransitioning,
        totalQuestions,
      ]
    );

  /*
   * ================================
   * KEYBOARD NAVIGATION
   * ================================
   *
   * Enter       -> Next
   * Arrow Down  -> Next
   * Arrow Up    -> Previous
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        loading ||
        !question
      ) {
        return;
      }

      const target =
        event.target as
          | HTMLElement
          | null;

      /*
       * Don't interfere with
       * form fields.
       */
      if (
        target?.tagName ===
          "INPUT" ||
        target?.tagName ===
          "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * Enter -> Next question.
       */
      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();

        changeQuestion(1);

        return;
      }

      /*
       * Arrow Down -> Next question.
       */
      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();

        changeQuestion(1);

        return;
      }

      /*
       * Arrow Up -> Previous question.
       */
      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();

        changeQuestion(-1);

        return;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    changeQuestion,
    loading,
    question,
  ]);

  /*
   * ================================
   * PROGRESS
   * ================================
   */

  const progress =
    totalQuestions > 0
      ? ((currentQuestion + 1) /
          totalQuestions) *
        100
      : 0;

  /*
   * ================================
   * COMPLETION SCREEN
   * ================================
   */

  if (
    !loading &&
    !error &&
    completed &&
    totalQuestions > 0
  ) {
    return (
      <div className="app-shell">
        <main className="page-main page-main--narrow">

          {/* Header */}
          <div className="card page-hero-card">
            <div className="page-hero-top">

              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color:
                      "var(--muted)",
                  }}
                >
                  INTERVIEW Q&A COURSE
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 28,
                    fontWeight: 900,
                  }}
                >
                  {item?.title ||
                    "Interview Practice"}
                </div>
              </div>

              <div className="page-hero-actions">

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    goBackOr(
                      router,
                      "/interview"
                    )
                  }
                  type="button"
                >
                  <FaArrowLeft />
                  Back
                </button>

                <button
                  className="btn btn-outline"
                  onClick={
                    toggleTheme
                  }
                  type="button"
                >
                  {theme ===
                  "dark" ? (
                    <FaSun />
                  ) : (
                    <FaMoon />
                  )}

                  <span className="hide-mobile">
                    {theme ===
                    "dark"
                      ? "Light"
                      : "Dark"}
                  </span>
                </button>

              </div>
            </div>
          </div>

          {/* Completion content */}
          <section
            style={{
              marginTop: 24,
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <div
              className="card reader-card"
              style={{
                width: "100%",
                padding: 36,
                borderRadius: 26,
                textAlign: "center",
              }}
            >

              {/* Check icon */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin:
                    "0 auto 20px",
                  borderRadius:
                    "50%",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  background:
                    "#22c55e",
                  color:
                    "#ffffff",
                  fontSize: 24,
                }}
              >
                <FaCheck />
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color:
                    "var(--muted)",
                  textTransform:
                    "uppercase",
                }}
              >
                Interview Complete
              </div>

              <h1
                style={{
                  margin:
                    "10px 0",
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                Great job!
              </h1>

              <p
                style={{
                  margin:
                    "0 auto",
                  maxWidth: 560,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color:
                    "var(--muted)",
                }}
              >
                You completed all{" "}
                {totalQuestions}{" "}
                interview questions
                in this course.
              </p>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  gap: 12,
                  flexWrap:
                    "wrap",
                  marginTop: 26,
                }}
              >

                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => {
                    setCurrentQuestion(
                      0
                    );

                    setCompleted(
                      false
                    );

                    window.setTimeout(
                      () => {
                        if (
                          questionCardRef.current
                        ) {
                          questionCardRef.current.scrollTop =
                            0;
                        }
                      },
                      0
                    );
                  }}
                >
                  Review Again
                </button>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() =>
                    goBackOr(
                      router,
                      "/interview"
                    )
                  }
                >
                  <FaArrowLeft />
                  More Interviews
                </button>

              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /*
   * ================================
   * MAIN PAGE
   * ================================
   */

  return (
    <div className="app-shell">

      <main className="page-main page-main--narrow">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <div className="card page-hero-card">

          <div className="page-hero-top">

            <div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color:
                    "var(--muted)",
                }}
              >
                INTERVIEW Q&A COURSE
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 28,
                  fontWeight: 900,
                }}
              >
                {item?.title ||
                  "Loading course..."}
              </div>

            </div>

            <div className="page-hero-actions">

              <button
                className="btn btn-outline"
                onClick={() =>
                  goBackOr(
                    router,
                    "/interview"
                  )
                }
                type="button"
              >
                <FaArrowLeft />
                Back
              </button>

              <button
                className="btn btn-outline"
                onClick={
                  toggleTheme
                }
                type="button"
              >
                {theme ===
                "dark" ? (
                  <FaSun />
                ) : (
                  <FaMoon />
                )}

                <span className="hide-mobile">
                  {theme ===
                  "dark"
                    ? "Light"
                    : "Dark"}
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* =========================
            LOADING
        ========================== */}
        {loading && (
          <div
            className="card"
            style={{
              padding: 22,
              borderRadius: 22,
              marginTop: 20,
            }}
          >
            Loading interview
            answers...
          </div>
        )}

        {/* =========================
            ERROR
        ========================== */}
        {!loading &&
          error && (
            <div
              className="card"
              style={{
                padding: 22,
                borderRadius: 22,
                marginTop: 20,
                color:
                  "var(--status-offline-color)",
              }}
            >
              {error}
            </div>
          )}

        {/* =========================
            INTERVIEW QUESTION
        ========================== */}
        {!loading &&
          !error &&
          item &&
          totalQuestions >
            0 &&
          question && (
            <section
              style={{
                marginTop: 20,
              }}
            >

              {/* =====================
                  COURSE TAGS
              ====================== */}
              <div
                className="card"
                style={{
                  padding: 14,
                  borderRadius: 18,
                  marginBottom: 14,
                }}
              >

                <div
                  className="content-card__tags"
                  style={{
                    marginTop: 0,
                  }}
                >
                  {item.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="badge"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

              </div>

              {/* =====================
                  PROGRESS TEXT
              ====================== */}
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  gap: 12,
                  marginBottom: 8,
                }}
              >

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color:
                      "var(--muted)",
                  }}
                >
                  Question{" "}
                  {currentQuestion +
                    1}{" "}
                  of{" "}
                  {totalQuestions}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color:
                      "var(--primary)",
                  }}
                >
                  {Math.round(
                    progress
                  )}
                  %
                </div>

              </div>

              {/* =====================
                  COLORED PROGRESS BAR
              ====================== */}
              <div
                aria-label={`Interview progress: ${Math.round(
                  progress
                )}%`}
                style={{
                  width: "100%",
                  height: 9,
                  borderRadius:
                    999,
                  overflow:
                    "hidden",
                  background:
                    "var(--border)",
                  marginBottom: 18,
                  boxShadow:
                    "inset 0 1px 2px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    borderRadius:
                      999,

                    background:
                      "linear-gradient(90deg, #22c55e, #16a34a)",

                    transition:
                      "width 300ms ease",

                    minWidth:
                      progress > 0
                        ? "8px"
                        : "0",
                  }}
                />

              </div>

              {/* =====================
                  QUESTION CARD
              ====================== */}
              <article
                ref={
                  questionCardRef
                }
                className="card reader-card"
                style={{
                  padding: 28,
                  borderRadius: 26,

                  height:
                    "calc(100vh - 250px)",

                  minHeight: 420,

                  maxHeight:
                    "calc(100vh - 250px)",

                  overflowY:
                    "auto",

                  overscrollBehaviorY:
                    "contain",

                  opacity:
                    isTransitioning
                      ? 0.35
                      : 1,

                  transform:
                    isTransitioning
                      ? "translateY(8px)"
                      : "translateY(0)",

                  transition:
                    "opacity 120ms ease, transform 120ms ease",

                  scrollbarWidth:
                    "thin",
                }}
              >

                {/* =================
                    QUESTION META
                ================== */}
                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    flexWrap:
                      "wrap",
                  }}
                >

                  <div
                    className="content-card__tags"
                    style={{
                      marginTop: 0,
                    }}
                  >

                    <span className="badge">
                      Question{" "}
                      {currentQuestion +
                        1}
                    </span>

                    {question.level ? (
                      <span className="badge">
                        {
                          question.level
                        }
                      </span>
                    ) : null}

                    {question.tags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="badge"
                          style={{
                            fontSize: 10,
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}

                  </div>

                  {/* =================
                      INDIVIDUAL QUESTION
                      FAVORITE BUTTON
                  ================= */}
                  <button
                    type="button"
                    onClick={
                      toggleQuestionFavorite
                    }
                    disabled={
                      favoriteLoading
                    }
                    aria-label={
                      isCurrentQuestionFavorite
                        ? "Remove question from favorites"
                        : "Add question to favorites"
                    }
                    title={
                      isCurrentQuestionFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    style={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      borderRadius:
                        "50%",
                      border:
                        "1px solid var(--border)",
                      background:
                        "var(--surface)",
                      color:
                        isCurrentQuestionFavorite
                          ? "#f59e0b"
                          : "var(--muted)",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      cursor:
                        favoriteLoading
                          ? "wait"
                          : "pointer",
                      fontSize: 18,
                      transition:
                        "all 150ms ease",
                      opacity:
                        favoriteLoading
                          ? 0.6
                          : 1,
                    }}
                  >
                    {isCurrentQuestionFavorite ? (
                      <FaStar />
                    ) : (
                      <FaRegStar />
                    )}
                  </button>

                </div>

                {/* =================
                    QUESTION TITLE
                ================== */}
                <h1
                  style={{
                    margin:
                      "24px 0 12px",
                    fontSize: 28,
                    lineHeight: 1.3,
                    fontWeight: 900,
                  }}
                >
                  {question.title}
                </h1>

                {/* =================
                    QUESTION TEXT
                ================== */}
                {question.question !==
                question.title ? (
                  <div
                    style={{
                      marginBottom: 22,
                      fontSize: 17,
                      lineHeight: 1.7,
                      color:
                        "var(--text)",
                    }}
                  >
                    {
                      question.question
                    }
                  </div>
                ) : null}

                {/* =================
                    ANSWER
                ================== */}
                <div
                  style={{
                    marginTop: 4,
                    paddingTop: 22,
                    borderTop:
                      "1px solid var(--border)",
                  }}
                >

                  <div
                    style={{
                      marginBottom: 12,
                      fontSize: 12,
                      fontWeight: 900,
                      color:
                        "var(--muted)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        0.6,
                    }}
                  >
                    Answer
                  </div>

                  <div className="prose">

                    <RepoMarkdown
                      baseUrl={
                        question.markdown_url ||
                        item.markdown_url
                      }
                    >
                      {
                        question.markdown
                      }
                    </RepoMarkdown>

                  </div>

                </div>

                {/* =================
                    NAVIGATION
                ================== */}
                <div
                  style={{
                    marginTop: 30,
                    paddingTop: 22,
                    borderTop:
                      "1px solid var(--border)",

                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    flexWrap:
                      "wrap",
                  }}
                >

                  {/* Previous */}
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={
                      currentQuestion ===
                        0 ||
                      isTransitioning
                    }
                    onClick={() =>
                      changeQuestion(
                        -1
                      )
                    }
                  >
                    <FaArrowLeft />
                    Previous
                  </button>

                  {/* Keyboard hint */}
                  <div
                    style={{
                      fontSize: 12,
                      color:
                        "var(--muted)",
                      textAlign:
                        "center",
                    }}
                  >

                    <div>
                      Use keyboard
                      navigation
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                      }}
                    >
                      <strong>
                        Enter
                      </strong>{" "}
                      /{" "}
                      <strong>
                        ↓
                      </strong>{" "}
                      Next
                      {" • "}
                      <strong>
                        ↑
                      </strong>{" "}
                      Previous
                    </div>

                  </div>

                  {/* Next */}
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={
                      isTransitioning
                    }
                    onClick={() =>
                      changeQuestion(
                        1
                      )
                    }
                  >

                    {currentQuestion ===
                    totalQuestions -
                      1
                      ? "Finish"
                      : "Next"}

                    {currentQuestion ===
                    totalQuestions -
                      1 ? (
                      <FaCheck />
                    ) : (
                      <FaArrowRight />
                    )}

                  </button>

                </div>

              </article>

              {/* =====================
                  SCROLL INFORMATION
              ====================== */}
              <div
                style={{
                  marginTop: 10,
                  textAlign:
                    "center",
                  fontSize: 11,
                  color:
                    "var(--muted)",
                }}
              >
                Scroll inside the
                card to read the
                complete answer.
                Scrolling will not
                change the question.
              </div>

            </section>
          )}

        {/* =========================
            FALLBACK
        ========================== */}
        {!loading &&
          !error &&
          item &&
          totalQuestions ===
            0 && (
            <section
              style={{
                marginTop: 20,
              }}
            >

              <article
                className="card reader-card"
                style={{
                  padding: 26,
                  borderRadius: 24,
                }}
              >

                <div
                  className="content-card__tags"
                  style={{
                    marginTop: 0,
                  }}
                >
                  {item.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="badge"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

                <h1
                  style={{
                    margin:
                      "20px 0 14px",
                    fontSize: 28,
                    fontWeight: 900,
                  }}
                >
                  {item.title}
                </h1>

                <div className="prose">

                  <RepoMarkdown
                    baseUrl={
                      item.markdown_url
                    }
                  >
                    {item.markdown}
                  </RepoMarkdown>

                </div>

              </article>

            </section>
          )}

      </main>
    </div>
  );
}
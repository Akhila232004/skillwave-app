"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ReactMarkdown, {
  Components,
} from "react-markdown";

import remarkGfm from "remark-gfm";

import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaMoon,
  FaSearch,
  FaSun,
} from "react-icons/fa";

import CachedRepoImage from "../../components/content/CachedRepoImage";

import { ThemeContext } from "../../context/ThemeContext";

import { useProtectedAppSession } from "../../lib/app-session";

import {
  lookupCourseSubject,
} from "../../lib/content-client";

import {
  getLibraryUserKey,
  setActiveLibraryUserKey,
} from "../../lib/library";

import {
  fetchTextStrict,
  normalize,
  parseSubjectTopicsFromReadme,
  toGithubProxyUrl,
  toRawGithub,
} from "../../lib/readme-utils";

import {
  useConnectionStatus,
} from "../../lib/use-connection-status";


/* =========================================================
   SYNTAX HIGHLIGHTER
========================================================= */

const SyntaxHighlighter = dynamic(
  () =>
    import("react-syntax-highlighter").then(
      (mod) => mod.Prism
    ),
  {
    ssr: false,
  }
);


/* =========================================================
   TYPES
========================================================= */

type CatalogTopic = {
  topic_name: string;
  md_url: string;
  section_markdown?: string;
  bullets?: string[];
};

type CatalogSubject = {
  subject: string;
  topics: CatalogTopic[];
};


/* =========================================================
   HELPERS
========================================================= */

const getSelectedTopic = (
  topics: CatalogTopic[],
  preferredTopicName: string
) =>
  topics.find(
    (topic) =>
      normalize(topic.topic_name) ===
      normalize(preferredTopicName)
  ) ||
  topics[0] ||
  null;


const normalizeSearch = (
  value: string
) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();


const getSearchTokens = (
  value: string
) =>
  normalizeSearch(value)
    .split(/\s+/)
    .filter(Boolean);


const matchesSearchTokens = (
  tokens: string[],
  ...values: Array<string | undefined>
) => {
  if (tokens.length === 0) {
    return true;
  }

  const haystack = normalizeSearch(
    values
      .filter(Boolean)
      .join(" ")
  );

  return tokens.every(
    (token) =>
      haystack.includes(token)
  );
};


/* =========================================================
   PAGE
========================================================= */

export default function TopicPage() {
  const router = useRouter();

  const {
    topic,
    subject,
  } = router.query;


  /* =======================================================
     ROUTE VALUES
  ======================================================= */

  const topicStr =
    typeof topic === "string"
      ? topic
      : "";

  const subjectStr =
    typeof subject === "string"
      ? subject
      : "";


  /* =======================================================
     SESSION
  ======================================================= */

  const {
    data: session,
  } = useProtectedAppSession();


  const accountKey =
    useMemo(
      () =>
        getLibraryUserKey(
          session?.user
        ),
      [session]
    );


  /* =======================================================
     THEME
  ======================================================= */

  const {
    theme,
    toggleTheme,
  } =
    useContext(ThemeContext);


  /* =======================================================
     STATE
  ======================================================= */

  const [
    catalogData,
    setCatalogData,
  ] =
    useState<CatalogSubject | null>(
      null
    );


  const [
    subjectReadmeUrl,
    setSubjectReadmeUrl,
  ] =
    useState("");


  const [
    subjectReadmeOutlineMd,
    setSubjectReadmeOutlineMd,
  ] =
    useState("");


  const [
    content,
    setContent,
  ] =
    useState("");


  const [
    mdBaseUrl,
    setMdBaseUrl,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    q,
    setQ,
  ] =
    useState("");


  const [
    isDesktop,
    setIsDesktop,
  ] =
    useState(false);


  const loadedTopicKeyRef =
    useRef("");


  const isOffline =
    useConnectionStatus();


  /* =======================================================
     DESKTOP DETECTION
  ======================================================= */

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(min-width: 1024px)"
      );

    const apply =
      () => {
        setIsDesktop(
          mediaQuery.matches
        );
      };

    apply();

    mediaQuery.addEventListener?.(
      "change",
      apply
    );

    return () => {
      mediaQuery.removeEventListener?.(
        "change",
        apply
      );
    };
  }, []);


  /* =======================================================
     ACTIVE LIBRARY USER
  ======================================================= */

  useEffect(() => {
    if (!accountKey) {
      return;
    }

    setActiveLibraryUserKey(
      accountKey
    );
  }, [accountKey]);


  /* =======================================================
     LOAD SUBJECT + TOPIC
  ======================================================= */

  useEffect(() => {
    if (
      !router.isReady ||
      !topicStr ||
      !subjectStr
    ) {
      return;
    }

    let cancelled = false;

    const controller =
      new AbortController();

    const loadKey =
      `${subjectStr}|${topicStr}`;

    (async () => {
      try {
        if (
          loadedTopicKeyRef.current !==
          loadKey
        ) {
          setLoading(true);
          setContent("");
          setMdBaseUrl("");
          setSubjectReadmeOutlineMd("");
        }

        setError("");


        /* -------------------------------------------------
           Load subject catalog
        ------------------------------------------------- */

        const subjectMatch =
          await lookupCourseSubject(
            subjectStr,
            controller.signal
          );


        /* -------------------------------------------------
           Catalog fallback topics
        ------------------------------------------------- */

        const fallbackTopics =
          (
            subjectMatch?.topics ||
            []
          ).map((item) => ({
            topic_name:
              item.topic_name,

            md_url:
              item.md_url,

            section_markdown:
              item.section_markdown,

            bullets:
              item.bullets,
          }));


        /* -------------------------------------------------
           Resolve README URL from catalog

           IMPORTANT:

           This is CONTENT DATA ONLY.

           It must never be used as an
           application route.
        ------------------------------------------------- */

        let resolvedSubjectReadmeUrl =
          "";

        if (
          subjectMatch?.readme_url
        ) {
          resolvedSubjectReadmeUrl =
            toRawGithub(
              subjectMatch.readme_url
            );
        }


        if (
          !resolvedSubjectReadmeUrl &&
          fallbackTopics.length === 0
        ) {
          throw new Error(
            "Subject not found in course catalog"
          );
        }


        if (cancelled) {
          return;
        }


        setSubjectReadmeUrl(
          resolvedSubjectReadmeUrl
        );


        /* -------------------------------------------------
           Parse README topics
        ------------------------------------------------- */

        let parsedTopics =
          fallbackTopics;


        if (
          resolvedSubjectReadmeUrl
        ) {
          try {
            const subjectReadmeText =
              await fetchTextStrict(
                resolvedSubjectReadmeUrl,
                controller.signal
              );


            if (
              subjectReadmeText
            ) {
              const nextTopics =
                parseSubjectTopicsFromReadme(
                  subjectReadmeText,
                  resolvedSubjectReadmeUrl
                ).map((item) => ({
                  topic_name:
                    item.topic_name,

                  md_url:
                    item.md_url,

                  section_markdown:
                    item.section_markdown,

                  bullets:
                    item.bullets,
                }));


              if (
                nextTopics.length > 0
              ) {
                parsedTopics =
                  nextTopics;
              }
            }
          } catch {
            /*
             * Keep catalog topics
             * as fallback.
             */
          }
        }


        if (
          parsedTopics.length === 0
        ) {
          throw new Error(
            "No topics found for this subject"
          );
        }


        /* -------------------------------------------------
           Build catalog
        ------------------------------------------------- */

        const catalog: CatalogSubject =
          {
            subject:
              subjectStr,

            topics:
              parsedTopics,
          };


        if (cancelled) {
          return;
        }


        setCatalogData(
          catalog
        );


        /* -------------------------------------------------
           Find selected topic
        ------------------------------------------------- */

        const selectedTopic =
          getSelectedTopic(
            catalog.topics,
            topicStr
          );


        if (!selectedTopic) {
          throw new Error(
            "No topics found for this subject"
          );
        }


        /* -------------------------------------------------
           Outline
        ------------------------------------------------- */

        const outlineMd =
          (
            selectedTopic.section_markdown ||
            ""
          ).trim();


        setSubjectReadmeOutlineMd(
          outlineMd
        );


        /* -------------------------------------------------
           Topic markdown
        ------------------------------------------------- */

        const mdUrl =
          toRawGithub(
            selectedTopic.md_url
          );


        const baseUrl =
          mdUrl.includes("/")
            ? mdUrl.slice(
                0,
                mdUrl.lastIndexOf(
                  "/"
                ) + 1
              )
            : "";


        let topicMd = "";


        try {
          topicMd =
            (
              await fetchTextStrict(
                mdUrl,
                controller.signal
              )
            ).trim();
        } catch {
          topicMd = "";
        }


        if (cancelled) {
          return;
        }


        loadedTopicKeyRef.current =
          loadKey;


        setMdBaseUrl(
          baseUrl
        );


        if (
          !topicMd &&
          !outlineMd
        ) {
          setError(
            "Failed to load topic content."
          );

          setLoading(false);

          return;
        }


        setContent(
          topicMd
        );


        setLoading(false);


        /* -------------------------------------------------
           Normalize topic URL

           IMPORTANT:

           Only keep topic + subject.

           Do not put README.md into
           application navigation.
        ------------------------------------------------- */

        if (
          normalize(
            selectedTopic.topic_name
          ) !==
          normalize(topicStr)
        ) {
          void router.replace(
            {
              pathname:
                "/topic/[topic]",

              query: {
                topic:
                  selectedTopic.topic_name,

                subject:
                  subjectStr,
              },
            },
            undefined,
            {
              shallow: true,
              scroll: false,
            }
          );
        }
      } catch {
        if (!cancelled) {
          setError(
            "Failed to load topic content."
          );

          setLoading(false);
        }
      }
    })();


    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    router,
    router.isReady,
    subjectStr,
    topicStr,
  ]);


  /* =======================================================
     TOPICS
  ======================================================= */

  const topics =
    useMemo(
      () =>
        catalogData?.topics ?? [],
      [catalogData]
    );


  /* =======================================================
     BACK TO CONTENTS URL

     This is deliberately based ONLY on subjectStr.

     subjectReadmeUrl is a GitHub/content URL and is
     never used here.

     Example:

       /topic/introduction?subject=java

     becomes:

       /subject/java
  ======================================================= */

  const subjectHref =
    useMemo(() => {
      if (!subjectStr) {
        return "/dashboard";
      }

      return `/subject/${encodeURIComponent(
        subjectStr
      )}`;
    }, [subjectStr]);


  /* =======================================================
     BACK TO CONTENTS HANDLER

     IMPORTANT:

     Do NOT use:

       subjectReadmeUrl

     Do NOT use:

       router.push(subjectReadmeUrl)

     Do NOT navigate to:

       /README.md

     Always navigate to the real application route.
  ======================================================= */

  const handleBackToContents =
    useCallback(() => {
      if (!subjectStr) {
        void router.push(
          "/dashboard"
        );

        return;
      }

      void router.push(
        subjectHref
      );
    }, [
      router,
      subjectHref,
      subjectStr,
    ]);


  /* =======================================================
     BUILD TOPIC URL

     IMPORTANT:

     We intentionally do NOT include
     subjectReadmeUrl in this URL.

     This prevents README.md from becoming
     part of browser/application navigation.
  ======================================================= */

  const buildTopicHref =
    useCallback(
      (
        topicName: string
      ) => ({
        pathname:
          "/topic/[topic]",

        query: {
          topic:
            topicName,

          subject:
            subjectStr,
        },
      }),
      [
        subjectStr,
      ]
    );


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredTopics =
    useMemo(() => {
      const tokens =
        getSearchTokens(q);

      if (
        tokens.length === 0
      ) {
        return topics;
      }

      return topics.filter(
        (item) =>
          matchesSearchTokens(
            tokens,
            item.topic_name,
            item.section_markdown,
            ...(item.bullets || [])
          )
      );
    }, [
      q,
      topics,
    ]);


  /* =======================================================
     ACTIVE TOPIC
  ======================================================= */

  const activeTopic =
    useMemo(
      () =>
        getSelectedTopic(
          topics,
          topicStr
        ),
      [
        topicStr,
        topics,
      ]
    );


  const activeTopicName =
    activeTopic?.topic_name ||
    topicStr;


  /* =======================================================
     CURRENT INDEX
  ======================================================= */

  const currentIndex =
    useMemo(() => {
      if (!activeTopic) {
        return -1;
      }

      return topics.findIndex(
        (item) =>
          normalize(
            item.topic_name
          ) ===
          normalize(
            activeTopic.topic_name
          )
      );
    }, [
      activeTopic,
      topics,
    ]);


  /* =======================================================
     PREVIOUS TOPIC
  ======================================================= */

  const prevTopic =
    currentIndex > 0
      ? topics[
          currentIndex - 1
        ]
      : null;


  /* =======================================================
     NEXT TOPIC
  ======================================================= */

  const nextTopic =
    currentIndex >= 0 &&
    currentIndex <
      topics.length - 1
      ? topics[
          currentIndex + 1
        ]
      : null;


  /* =======================================================
     IMAGE RESOLUTION
  ======================================================= */

  const resolveImgSrc =
    (
      src: unknown
    ): string => {
      if (
        !src ||
        typeof src !==
          "string"
      ) {
        return "";
      }

      const value =
        src.trim();


      if (
        value.includes(
          "github.com/"
        ) &&
        value.includes(
          "/blob/"
        )
      ) {
        return toGithubProxyUrl(
          value
        );
      }


      if (
        value.startsWith(
          "http"
        )
      ) {
        return toGithubProxyUrl(
          value
        );
      }


      if (
        value.startsWith(
          "/"
        ) ||
        value.startsWith(
          "data:"
        )
      ) {
        return value;
      }


      if (!mdBaseUrl) {
        return value;
      }


      try {
        return toGithubProxyUrl(
          new URL(
            value,
            mdBaseUrl
          ).toString()
        );
      } catch {
        return value;
      }
    };


  /* =======================================================
     MARKDOWN COMPONENTS
  ======================================================= */

  const markdownComponents:
    Components = {

    /* =====================================================
       PARAGRAPH
    ===================================================== */

    p({
      children,
    }) {
      return (
        <p
          style={{
            margin:
              "10px 0",
          }}
        >
          {children}
        </p>
      );
    },


    /* =====================================================
       UNORDERED LIST
    ===================================================== */

    ul({
      children,
    }) {
      return (
        <ul
          style={{
            paddingLeft: 18,
            margin:
              "10px 0",
            listStyle:
              "disc",
          }}
        >
          {children}
        </ul>
      );
    },


    /* =====================================================
       ORDERED LIST
    ===================================================== */

    ol({
      children,
    }) {
      return (
        <ol
          style={{
            paddingLeft: 18,
            margin:
              "10px 0",
            listStyle:
              "decimal",
          }}
        >
          {children}
        </ol>
      );
    },


    /* =====================================================
       LIST ITEM
    ===================================================== */

    li({
      children,
    }) {
      return (
        <li
          style={{
            marginBottom: 6,
          }}
        >
          {children}
        </li>
      );
    },


    /* =====================================================
       IMPORTANT FIX:
       MARKDOWN LINKS
       
       If the content repository contains:

       [Back to Contents](README.md)

       ReactMarkdown normally creates:

       <a href="README.md">

       The browser then navigates to:

       /README.md

       which produces a 404.

       We intercept README.md and send the
       user to the SkillWave subject page.
    ===================================================== */

    a({
      href = "",
      children,
      ...props
    }: any) {
      const rawHref =
        String(
          href || ""
        ).trim();


      const normalizedHref =
        rawHref
          .split("#")[0]
          .split("?")[0]
          .trim()
          .toLowerCase();


      const isReadmeLink =
        normalizedHref ===
          "readme.md" ||
        normalizedHref ===
          "./readme.md" ||
        normalizedHref ===
          "../readme.md" ||
        normalizedHref.endsWith(
          "/readme.md"
        );


      /* ---------------------------------------------------
         README.md means "Back to Contents"
      --------------------------------------------------- */

      if (
        isReadmeLink &&
        subjectStr
      ) {
        return (
          <a
            {...props}
            href={subjectHref}
            onClick={(event) => {
              event.preventDefault();

              handleBackToContents();
            }}
          >
            {children}
          </a>
        );
      }


      /* ---------------------------------------------------
         Normal Markdown links
      --------------------------------------------------- */

      const isExternalLink =
        rawHref.startsWith(
          "http://"
        ) ||
        rawHref.startsWith(
          "https://"
        );


      return (
        <a
          {...props}
          href={href}
          target={
            isExternalLink
              ? "_blank"
              : undefined
          }
          rel={
            isExternalLink
              ? "noreferrer"
              : undefined
          }
        >
          {children}
        </a>
      );
    },


    /* =====================================================
       CODE
    ===================================================== */

    code({
      inline,
      className,
      children,
      ...props
    }: any) {
      const match =
        /language-(\w+)/.exec(
          className || ""
        );


      const rawText =
        typeof children ===
        "string"
          ? children
          : Array.isArray(
              children
            )
          ? children.join("")
          : String(children);


      const raw =
        rawText.replace(
          /\n$/,
          ""
        );


      if (inline) {
        return (
          <code>
            {rawText}
          </code>
        );
      }


      if (match) {
        return (
          <SyntaxHighlighter
            style={
              theme === "dark"
                ? materialDark
                : materialLight
            }
            language={
              match[1]
            }
            PreTag="div"
            wrapLongLines
            customStyle={{
              borderRadius: 14,
              padding: 14,
              fontSize: 13,
              maxWidth:
                "none",
              margin: 0,
            }}
            {...props}
          >
            {raw}
          </SyntaxHighlighter>
        );
      }


      return (
        <div className="md-code-wrapper">
          <pre>
            <code>
              {raw}
            </code>
          </pre>
        </div>
      );
    },


    /* =====================================================
       IMAGE
    ===================================================== */

    img({
      src = "",
      alt = "",
    }: any) {
      const finalSrc =
        resolveImgSrc(
          src
        );


      if (!finalSrc) {
        return null;
      }


      return (
        <div className="md-image-wrapper">
          <CachedRepoImage
            src={finalSrc}
            alt={alt}
            loading="lazy"
          />
        </div>
      );
    },


    /* =====================================================
       TABLE
    ===================================================== */

    table({
      children,
    }) {
      return (
        <div className="md-table-wrapper">
          <table>
            {children}
          </table>
        </div>
      );
    },
  };

  /* =======================================================
     RENDER MARKDOWN
  ======================================================= */

  const renderedMarkdown =
    useMemo(() => {
      const topicMd =
        (
          content || ""
        ).trim();

      const outlineMd =
        (
          subjectReadmeOutlineMd ||
          ""
        ).trim();

      if (
        topicMd &&
        outlineMd
      ) {
        return (
          `## Quick Outline\n\n` +
          `${outlineMd}\n\n` +
          `---\n\n` +
          `${topicMd}`
        );
      }

      if (topicMd) {
        return topicMd;
      }

      if (outlineMd) {
        return (
          `# ${activeTopicName}\n\n` +
          outlineMd
        );
      }

      return "";
    }, [
      activeTopicName,
      content,
      subjectReadmeOutlineMd,
    ]);


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="app-shell">

      <main className="page-main">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

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
                TOPIC READER
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 30,
                  fontWeight: 900,
                }}
              >
                {activeTopicName ||
                  "Loading topic..."}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color:
                    "var(--muted)",
                }}
              >
                {subjectStr} ·{" "}
                {isOffline
                  ? "Offline"
                  : "Online"}
              </div>

            </div>

            <div className="page-hero-actions">

              {/* ==========================================
                  BACK TO CONTENTS
              =========================================== */}

              <button
                className="btn btn-outline"
                onClick={
                  handleBackToContents
                }
                type="button"
              >
                <FaArrowLeft />
                Back to Contents
              </button>

              {/* ==========================================
                  DASHBOARD
              =========================================== */}

              <Link
                href="/dashboard"
                className="btn btn-outline"
              >
                <FaHome />
              </Link>

              {/* ==========================================
                  THEME
              =========================================== */}

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


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="card"
            style={{
              padding: 18,
              borderRadius: 18,
              marginTop: 18,
            }}
          >
            Loading topic content...
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (
            <div
              className="card"
              style={{
                padding: 18,
                borderRadius: 18,
                marginTop: 18,
                color:
                  "var(--status-offline-color)",
              }}
            >
              {error}
            </div>
          )}


        {/* =================================================
            CONTENT
        ================================================= */}

        {!loading &&
          !error && (
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns:
                  isDesktop
                    ? "300px minmax(0, 1fr)"
                    : "1fr",
                gap: 16,
              }}
            >

              {/* ==========================================
                  TOPIC SIDEBAR
              =========================================== */}

              <aside
                className="card reader-layout__sidebar topic-reader-sidebar"
                style={{
                  padding: 16,
                  borderRadius: 22,
                  minWidth: 0,
                }}
              >

                {/* Search */}

                <div
                  className="card"
                  style={{
                    padding:
                      "10px 12px",
                    borderRadius: 16,
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 10,
                    }}
                  >

                    <FaSearch />

                    <input
                      value={q}
                      onChange={(
                        event
                      ) =>
                        setQ(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Search topics..."
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
                      }}
                    />

                  </div>

                </div>


                {/* Topic list */}

                <div
                  style={{
                    marginTop: 12,
                    display:
                      "grid",
                    gap: 8,
                  }}
                >

                  {filteredTopics.map(
                    (item) => {
                      const isActive =
                        normalize(
                          item.topic_name
                        ) ===
                        normalize(
                          activeTopicName
                        );

                      return (
                        <Link
                          key={`${item.topic_name}-${item.md_url}`}
                          href={buildTopicHref(
                            item.topic_name
                          )}
                          className={
                            isActive
                              ? "btn btn-primary"
                              : "btn btn-outline"
                          }
                          style={{
                            justifyContent:
                              "flex-start",
                          }}
                        >
                          {
                            item.topic_name
                          }
                        </Link>
                      );
                    }
                  )}

                </div>

              </aside>


              {/* ==========================================
                  TOPIC CONTENT
              =========================================== */}

              <section
                className="card reader-layout__content reader-card"
                style={{
                  padding: 22,
                  borderRadius: 22,
                  minWidth: 0,
                }}
              >

                {/* Topic header */}

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap:
                      "wrap",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    marginBottom:
                      16,
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color:
                          "var(--muted)",
                      }}
                    >
                      {subjectStr}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 22,
                        fontWeight: 900,
                      }}
                    >
                      {
                        activeTopicName
                      }
                    </div>

                  </div>


                  {/* Previous / Next */}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: 10,
                    }}
                  >

                    <Link
                      href={
                        prevTopic
                          ? buildTopicHref(
                              prevTopic.topic_name
                            )
                          : "#"
                      }
                      className="btn btn-outline"
                      style={{
                        opacity:
                          prevTopic
                            ? 1
                            : 0.45,
                        pointerEvents:
                          prevTopic
                            ? "auto"
                            : "none",
                      }}
                    >
                      <FaChevronLeft />
                      Prev
                    </Link>


                    <Link
                      href={
                        nextTopic
                          ? buildTopicHref(
                              nextTopic.topic_name
                            )
                          : "#"
                      }
                      className="btn btn-outline"
                      style={{
                        opacity:
                          nextTopic
                            ? 1
                            : 0.45,
                        pointerEvents:
                          nextTopic
                            ? "auto"
                            : "none",
                      }}
                    >
                      Next
                      <FaChevronRight />
                    </Link>

                  </div>

                </div>


                {/* Markdown */}

                <div className="prose">

                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                    ]}
                    components={
                      markdownComponents
                    }
                  >
                    {
                      renderedMarkdown
                    }
                  </ReactMarkdown>

                </div>


                {/* ==========================================
                    BACK TO CONTENTS
                    BOTTOM OF EVERY TOPIC
                =========================================== */}

                <div
                  style={{
                    marginTop: 36,
                    paddingTop: 24,
                    paddingBottom: 8,
                    borderTop:
                      "1px solid var(--border)",
                    display:
                      "flex",
                    justifyContent:
                      "center",
                  }}
                >

                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={
                      handleBackToContents
                    }
                  >
                    <FaArrowLeft />
                    Back to Contents
                  </button>

                </div>

              </section>

            </div>
          )}

      </main>

    </div>
  );
}
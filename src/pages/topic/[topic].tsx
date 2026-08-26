"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaMoon,
  FaSearch,
  FaSun,
} from "react-icons/fa";
import { materialDark, materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CachedRepoImage from "../../components/content/CachedRepoImage";
import { ThemeContext } from "../../context/ThemeContext";
import { useProtectedAppSession } from "../../lib/app-session";
import {
  lookupCourseSubject,
} from "../../lib/content-client";
import { getLibraryUserKey, setActiveLibraryUserKey } from "../../lib/library";
import { goBackOr } from "../../lib/navigation";
import {
  fetchTextStrict,
  normalize,
  parseSubjectTopicsFromReadme,
  toGithubProxyUrl,
  toRawGithub,
} from "../../lib/readme-utils";
import { useConnectionStatus } from "../../lib/use-connection-status";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false }
);

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

const getSelectedTopic = (topics: CatalogTopic[], preferredTopicName: string) =>
  topics.find((topic) => normalize(topic.topic_name) === normalize(preferredTopicName)) ||
  topics[0] ||
  null;

const normalizeSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const getSearchTokens = (value: string) =>
  normalizeSearch(value).split(/\s+/).filter(Boolean);

const matchesSearchTokens = (tokens: string[], ...values: Array<string | undefined>) => {
  if (tokens.length === 0) return true;
  const haystack = normalizeSearch(values.filter(Boolean).join(" "));
  return tokens.every((token) => haystack.includes(token));
};

export default function TopicPage() {
  const router = useRouter();
  const { topic, subject, readme } = router.query;
  const topicStr = String(topic || "");
  const subjectStr = String(subject || "");
  const readmeQuery = typeof readme === "string" ? readme : "";
  const { data: session } = useProtectedAppSession();
  const accountKey = useMemo(() => getLibraryUserKey(session?.user), [session]);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [catalogData, setCatalogData] = useState<CatalogSubject | null>(null);
  const [subjectReadmeUrl, setSubjectReadmeUrl] = useState("");
  const [subjectReadmeOutlineMd, setSubjectReadmeOutlineMd] = useState("");
  const [content, setContent] = useState("");
  const [mdBaseUrl, setMdBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const loadedTopicKeyRef = useRef("");
  const isOffline = useConnectionStatus();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);

    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (!accountKey) return;
    setActiveLibraryUserKey(accountKey);
  }, [accountKey]);

  useEffect(() => {
    if (!router.isReady || !topicStr || !subjectStr) return;

    let cancelled = false;
    const controller = new AbortController();
    const loadKey = `${subjectStr}|${topicStr}|${readmeQuery}`;

    (async () => {
      try {
        if (loadedTopicKeyRef.current !== loadKey) {
          setLoading(true);
          setContent("");
          setMdBaseUrl("");
          setSubjectReadmeOutlineMd("");
        }
        setError("");

        let resolvedSubjectReadmeUrl = readmeQuery ? toRawGithub(readmeQuery) : "";
        const subjectMatch = await lookupCourseSubject(subjectStr, controller.signal);
        const fallbackTopics = (subjectMatch?.topics || []).map((item) => ({
          topic_name: item.topic_name,
          md_url: item.md_url,
          section_markdown: item.section_markdown,
          bullets: item.bullets,
        }));

        if (!resolvedSubjectReadmeUrl && subjectMatch?.readme_url) {
          resolvedSubjectReadmeUrl = toRawGithub(subjectMatch.readme_url);
        }

        if (!resolvedSubjectReadmeUrl && fallbackTopics.length === 0) {
          throw new Error("Subject not found in course catalog");
        }

        if (cancelled) return;
        setSubjectReadmeUrl(resolvedSubjectReadmeUrl);

        let parsedTopics = fallbackTopics;

        if (resolvedSubjectReadmeUrl) {
          try {
            const subjectReadmeText = await fetchTextStrict(
              resolvedSubjectReadmeUrl,
              controller.signal
            );

            if (subjectReadmeText) {
              const nextTopics = parseSubjectTopicsFromReadme(
                subjectReadmeText,
                resolvedSubjectReadmeUrl
              ).map((item) => ({
                topic_name: item.topic_name,
                md_url: item.md_url,
                section_markdown: item.section_markdown,
                bullets: item.bullets,
              }));

              if (nextTopics.length > 0) {
                parsedTopics = nextTopics;
              }
            }
          } catch {
            // Keep the already-cached course catalog topics as the offline fallback.
          }
        }

        if (parsedTopics.length === 0) {
          throw new Error("No topics found for this subject");
        }

        const catalog: CatalogSubject = {
          subject: subjectStr,
          topics: parsedTopics,
        };

        if (cancelled) return;
        setCatalogData(catalog);

        const selectedTopic = getSelectedTopic(catalog.topics, topicStr);
        if (!selectedTopic) throw new Error("No topics found for this subject");

        const outlineMd = (selectedTopic.section_markdown || "").trim();
        setSubjectReadmeOutlineMd(outlineMd);

        const mdUrl = toRawGithub(selectedTopic.md_url);
        const baseUrl = mdUrl.includes("/") ? mdUrl.slice(0, mdUrl.lastIndexOf("/") + 1) : "";
        let topicMd = "";

        try {
          topicMd = (await fetchTextStrict(mdUrl, controller.signal)).trim();
        } catch {
          topicMd = "";
        }

        if (cancelled) return;

        loadedTopicKeyRef.current = loadKey;
        setMdBaseUrl(baseUrl);
        if (!topicMd && !outlineMd) {
          setError("Failed to load topic content.");
          setLoading(false);
          return;
        }

        setContent(topicMd);
        setLoading(false);

        if (normalize(selectedTopic.topic_name) !== normalize(topicStr)) {
          void router.replace(
            {
              pathname: "/topic/[topic]",
              query: {
                topic: selectedTopic.topic_name,
                subject: subjectStr,
                ...(resolvedSubjectReadmeUrl ? { readme: resolvedSubjectReadmeUrl } : {}),
              },
            },
            undefined,
            { shallow: true, scroll: false }
          );
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load topic content.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [readmeQuery, router, router.isReady, subjectStr, topicStr]);

  const topics = useMemo(() => catalogData?.topics ?? [], [catalogData]);
  const subjectHref = subjectReadmeUrl
    ? `/subject/${encodeURIComponent(subjectStr)}?readme=${encodeURIComponent(subjectReadmeUrl)}`
    : `/subject/${encodeURIComponent(subjectStr)}`;
  const buildTopicHref = (topicName: string) => ({
    pathname: "/topic/[topic]",
    query: {
      topic: topicName,
      subject: subjectStr,
      ...(subjectReadmeUrl ? { readme: subjectReadmeUrl } : {}),
    },
  });

  const filteredTopics = useMemo(() => {
    const tokens = getSearchTokens(q);
    if (tokens.length === 0) return topics;
    return topics.filter((item) =>
      matchesSearchTokens(
        tokens,
        item.topic_name,
        item.section_markdown,
        ...(item.bullets || [])
      )
    );
  }, [q, topics]);

  const activeTopic = useMemo(() => getSelectedTopic(topics, topicStr), [topicStr, topics]);
  const activeTopicName = activeTopic?.topic_name || topicStr;

  const currentIndex = useMemo(() => {
    if (!activeTopic) return -1;
    return topics.findIndex((item) => normalize(item.topic_name) === normalize(activeTopic.topic_name));
  }, [activeTopic, topics]);

  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const resolveImgSrc = (src: unknown): string => {
    if (!src || typeof src !== "string") return "";
    const value = src.trim();

    if (value.includes("github.com/") && value.includes("/blob/")) {
      return toGithubProxyUrl(value);
    }

    if (value.startsWith("http")) {
      return toGithubProxyUrl(value);
    }

    if (value.startsWith("/") || value.startsWith("data:")) {
      return value;
    }

    if (!mdBaseUrl) return value;

    try {
      return toGithubProxyUrl(new URL(value, mdBaseUrl).toString());
    } catch {
      return value;
    }
  };

  const markdownComponents: Components = {
    p({ children }) {
      return <p style={{ margin: "10px 0" }}>{children}</p>;
    },
    ul({ children }) {
      return <ul style={{ paddingLeft: 18, margin: "10px 0", listStyle: "disc" }}>{children}</ul>;
    },
    ol({ children }) {
      return <ol style={{ paddingLeft: 18, margin: "10px 0", listStyle: "decimal" }}>{children}</ol>;
    },
    li({ children }) {
      return <li style={{ marginBottom: 6 }}>{children}</li>;
    },
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const rawText =
        typeof children === "string"
          ? children
          : Array.isArray(children)
          ? children.join("")
          : String(children);
      const raw = rawText.replace(/\n$/, "");

      if (inline) return <code>{rawText}</code>;

      if (match) {
        return (
          <SyntaxHighlighter
            style={theme === "dark" ? materialDark : materialLight}
            language={match[1]}
            PreTag="div"
            wrapLongLines
            customStyle={{
              borderRadius: 14,
              padding: 14,
              fontSize: 13,
              maxWidth: "none",
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
            <code>{raw}</code>
          </pre>
        </div>
      );
    },
    img({ src = "", alt = "" }: any) {
      const finalSrc = resolveImgSrc(src);
      if (!finalSrc) return null;

      return (
        <div className="md-image-wrapper">
          <CachedRepoImage src={finalSrc} alt={alt} loading="lazy" />
        </div>
      );
    },
    table({ children }) {
      return (
        <div className="md-table-wrapper">
          <table>{children}</table>
        </div>
      );
    },
  };

  const renderedMarkdown = useMemo(() => {
    const topicMd = (content || "").trim();
    const outlineMd = (subjectReadmeOutlineMd || "").trim();

    if (topicMd && outlineMd) {
      return `## Quick Outline\n\n${outlineMd}\n\n---\n\n${topicMd}`;
    }

    if (topicMd) return topicMd;
    if (outlineMd) return `# ${activeTopicName}\n\n${outlineMd}`;

    return "";
  }, [activeTopicName, content, subjectReadmeOutlineMd]);

  return (
    <div className="app-shell">
      <main className="page-main">
        <div className="card page-hero-card">
          <div className="page-hero-top">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>TOPIC READER</div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900 }}>
                {activeTopicName || "Loading topic..."}
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                {subjectStr} · {isOffline ? "Offline" : "Online"}
              </div>
            </div>

            <div className="page-hero-actions">
              <button className="btn btn-outline" onClick={() => goBackOr(router, subjectHref)} type="button">
                <FaArrowLeft /> Back
              </button>
              <Link href="/dashboard" className="btn btn-outline">
                <FaHome />
              </Link>
              <button className="btn btn-outline" onClick={toggleTheme} type="button">
                {theme === "dark" ? <FaSun /> : <FaMoon />}
                <span className="hide-mobile">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18 }}>
            Loading topic content...
          </div>
        )}

        {!loading && error && (
          <div className="card" style={{ padding: 18, borderRadius: 18, marginTop: 18, color: "var(--status-offline-color)" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: isDesktop ? "300px minmax(0, 1fr)" : "1fr",
              gap: 16,
            }}
          >
            <aside className="card reader-layout__sidebar topic-reader-sidebar" style={{ padding: 16, borderRadius: 22, minWidth: 0 }}>
              <div className="card" style={{ padding: "10px 12px", borderRadius: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FaSearch />
                  <input
                    value={q}
                    onChange={(event) => setQ(event.target.value)}
                    placeholder="Search topics..."
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {filteredTopics.map((item) => {
                  const isActive = normalize(item.topic_name) === normalize(activeTopicName);

                  return (
                    <Link
                      key={`${item.topic_name}-${item.md_url}`}
                      href={buildTopicHref(item.topic_name)}
                      className={isActive ? "btn btn-primary" : "btn btn-outline"}
                      style={{ justifyContent: "flex-start" }}
                    >
                      {item.topic_name}
                    </Link>
                  );
                })}
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
                    {subjectStr}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>
                    {activeTopicName}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <Link
                    href={prevTopic ? buildTopicHref(prevTopic.topic_name) : "#"}
                    className="btn btn-outline"
                    style={{ opacity: prevTopic ? 1 : 0.45, pointerEvents: prevTopic ? "auto" : "none" }}
                  >
                    <FaChevronLeft /> Prev
                  </Link>
                  <Link
                    href={nextTopic ? buildTopicHref(nextTopic.topic_name) : "#"}
                    className="btn btn-outline"
                    style={{ opacity: nextTopic ? 1 : 0.45, pointerEvents: nextTopic ? "auto" : "none" }}
                  >
                    Next <FaChevronRight />
                  </Link>
                </div>
              </div>

              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {renderedMarkdown}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
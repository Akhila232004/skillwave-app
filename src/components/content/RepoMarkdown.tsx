"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { ThemeContext } from "../../context/ThemeContext";
import { toGithubProxyUrl } from "../../lib/readme-utils";
import CachedRepoImage from "./CachedRepoImage";

export const resolveRepoImageSrc = (src: unknown, baseUrl?: string) => {
  if (!src || typeof src !== "string") return "";

  const value = src.trim();
  if (!value || value.startsWith("data:")) return value;

  if (/^https?:\/\//i.test(value)) {
    return toGithubProxyUrl(value);
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (!baseUrl) {
    return value;
  }

  try {
    return toGithubProxyUrl(new URL(value, baseUrl).toString());
  } catch {
    return value;
  }
};

const resolveRepoLinkHref = (href: unknown, baseUrl?: string) => {
  if (!href || typeof href !== "string") return "";

  const value = href.trim();
  if (!value || value.startsWith("#") || /^(mailto|tel):/i.test(value)) return value;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (!baseUrl) {
    return value;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
};

type RepoMarkdownProps = {
  children: string;
  baseUrl?: string;
  components?: Components;
};

const getNodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return getNodeText(node.props.children);
  return "";
};

const getCodeLanguage = (className?: string) => {
  const match = /language-([\w-]+)/i.exec(className || "");
  return match?.[1]?.toLowerCase() || "";
};

type MarkdownElementProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

const isMarkdownElement = (node: ReactNode): node is ReactElement<MarkdownElementProps> =>
  isValidElement<MarkdownElementProps>(node);

const isElementTag = (
  node: ReactNode,
  tagName: string
): node is ReactElement<MarkdownElementProps> =>
  isMarkdownElement(node) && node.type === tagName;

const getFirstElementByTag = (nodes: ReactNode, tagName: string) =>
  Children.toArray(nodes).find((node) => isElementTag(node, tagName));

const extractTableHeaders = (children: ReactNode) => {
  const thead = getFirstElementByTag(children, "thead");
  const headerRow = isMarkdownElement(thead)
    ? getFirstElementByTag(thead.props.children, "tr")
    : undefined;

  if (!isMarkdownElement(headerRow)) return [];

  return Children.toArray(headerRow.props.children)
    .filter((child) => isElementTag(child, "th") || isElementTag(child, "td"))
    .map((child, index) => getNodeText(child).replace(/\s+/g, " ").trim() || `Column ${index + 1}`);
};

const annotateTableCells = (node: ReactNode, headers: string[]): ReactNode => {
  if (Array.isArray(node)) {
    return node.map((child) => annotateTableCells(child, headers));
  }

  if (!isMarkdownElement(node)) return node;

  if (node.type === "tr") {
    let cellIndex = 0;
    const children = Children.toArray(node.props.children).map((child) => {
      if (!isMarkdownElement(child)) return child;

      if (child.type === "th") {
        cellIndex += 1;
        return child;
      }

      if (child.type !== "td") return annotateTableCells(child, headers);

      const label = headers[cellIndex] || `Column ${cellIndex + 1}`;
      cellIndex += 1;

      return cloneElement(
        child,
        { "data-label": label } as Partial<MarkdownElementProps>,
        child.props.children
      );
    });

    return cloneElement(node, undefined, children);
  }

  if (node.props.children === undefined) return node;

  return cloneElement(node, undefined, annotateTableCells(node.props.children, headers));
};

const sanitizeAttributes = defaultSchema.attributes || {};
const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "details",
    "summary",
  ],
  attributes: {
    ...sanitizeAttributes,
    "*": [
      ...(sanitizeAttributes["*"] || []),
      "className",
      "id",
      "title",
    ],
    a: [
      ...(sanitizeAttributes.a || []),
      "href",
      "title",
      "target",
      "rel",
    ],
    code: [
      ...(sanitizeAttributes.code || []),
      "className",
    ],
    div: [
      ...(sanitizeAttributes.div || []),
      "className",
    ],
    img: [
      ...(sanitizeAttributes.img || []),
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
    ],
    input: [
      ...(sanitizeAttributes.input || []),
      "checked",
      "disabled",
      ["type", "checkbox"],
    ],
    li: [
      ...(sanitizeAttributes.li || []),
      "className",
    ],
    ol: [
      ...(sanitizeAttributes.ol || []),
      "className",
      "start",
      "type",
    ],
    span: [
      ...(sanitizeAttributes.span || []),
      "className",
    ],
    table: [
      ...(sanitizeAttributes.table || []),
      "className",
    ],
    ul: [
      ...(sanitizeAttributes.ul || []),
      "className",
    ],
  },
};

let mermaidRenderQueue: Promise<void> = Promise.resolve();

const queueMermaidRender = async <T,>(task: () => Promise<T>) => {
  const run = mermaidRenderQueue.then(task, task);
  mermaidRenderQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
};

function MermaidDiagram({ chart }: { chart: string }) {
  const { theme } = useContext(ThemeContext);
  const reactId = useId();
  const renderCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const diagramId = useMemo(() => `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [reactId]);
  const renderChart = useMemo(() => chart.trim(), [chart]);
  const [shouldRender, setShouldRender] = useState(false);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (shouldRender) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const node = containerRef.current;
    if (!node) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    let cancelled = false;

    setSvg("");
    setError("");

    (async () => {
      try {
        const result = await queueMermaidRender(async () => {
          const mermaid = (await import("mermaid")).default;
          const renderId = `${diagramId}-${renderCountRef.current++}`;

          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: theme === "dark" ? "dark" : "default",
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: "basis",
              nodeSpacing: 24,
              rankSpacing: 34,
              diagramPadding: 8,
              wrappingWidth: 150,
            },
          });

          return mermaid.render(renderId, renderChart);
        });

        if (!cancelled) {
          setSvg(result.svg);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to render Mermaid diagram.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [diagramId, renderChart, shouldRender, theme]);

  if (!shouldRender) {
    return (
      <div ref={containerRef} className="mermaid-diagram mermaid-diagram--loading" role="status">
        Diagram will render as it comes into view...
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className="mermaid-diagram mermaid-diagram--error">
        <div className="mermaid-diagram__message">Unable to render architecture diagram.</div>
        <pre>
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div ref={containerRef} className="mermaid-diagram mermaid-diagram--loading" role="status">
        Rendering architecture diagram...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram"
      aria-label="Architecture diagram"
      role="img"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function RepoMarkdown({ children, baseUrl, components }: RepoMarkdownProps) {
  const markdownComponents: Components = {
    ...components,
    a({ href = "", children, ...props }) {
      const finalHref = resolveRepoLinkHref(href, baseUrl);
      const isExternal = /^https?:\/\//i.test(finalHref);

      return (
        <a
          href={finalHref}
          {...props}
          {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    table({ children, ...props }: any) {
      const tableProps = { ...props };
      delete tableProps.node;
      const headers = extractTableHeaders(children);
      const tableChildren = headers.length > 0 ? annotateTableCells(children, headers) : children;

      return (
        <div className="md-table-wrapper">
          <table {...tableProps}>{tableChildren}</table>
        </div>
      );
    },
    pre({ children }) {
      const onlyChild = Children.toArray(children)[0];
      if (
        isValidElement<{ className?: string }>(onlyChild) &&
        getCodeLanguage(onlyChild.props.className) === "mermaid"
      ) {
        return <>{children}</>;
      }

      return (
        <div className="md-code-wrapper">
          <pre>{children}</pre>
        </div>
      );
    },
    code({ inline, className, children, ...props }: any) {
      const language = getCodeLanguage(className);
      const raw = getNodeText(children).replace(/\n$/, "");

      if (!inline && language === "mermaid") {
        return <MermaidDiagram chart={raw} />;
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    img({ src = "", alt = "" }) {
      const finalSrc = resolveRepoImageSrc(src, baseUrl);
      if (!finalSrc) return null;

      return (
        <span className="md-image-wrapper">
          <CachedRepoImage src={finalSrc} alt={alt || ""} loading="lazy" />
        </span>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
}
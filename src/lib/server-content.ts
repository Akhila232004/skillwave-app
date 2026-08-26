import { parse as parseYaml } from "yaml";
import { buildContentRepoRawUrl } from "./content-repo-config";
import { normalize, parseSubjectTopicsFromReadme, toRawGithub, type ParsedTopic } from "./readme-utils";
import {
  readRepoContentSource,
  readRepoContentText,
  readRepoDirectory,
} from "./server-content-source";
import type {
  CbtCollections,
  CourseCatalogEntry,
  CourseSubject,
  DashboardImagePosition,
  DashboardCardTopic,
  DashboardSlideStyle,
  DashboardSlideTemplate,
  DashboardTextAlign,
  InterviewCourseQuestion,
  DesignSystem,
  InterviewQuestionDetail,
  InterviewQuestionSummary,
  MediaCollectionItem,
  SlideshowDeck,
  SlideshowSlide,
  SlideshowSummary,
  TickerItem,
} from "./content-types";

type CoursesCatalogFile = {
  repoName: string;
  subjects: CourseCatalogEntry[];
};

type DesignColorFile = Omit<DesignSystem, "courseIcons">;

type DesignIconFile = {
  repoName: string;
  courses: Record<
    string,
    {
      label: string;
      iconPath: string;
    }
  >;
};

type SlideshowCatalogFile = {
  repoName: string;
  decks: Array<{
    slug: string;
    title: string;
    summary: string;
    audience: string;
    tags: string[];
    contentPath: string;
  }>;
};

type MediaCatalogFile = {
  repoName: string;
  items: Array<{
    slug: string;
    title: string;
    summary: string;
    speaker: string;
    playlistUrl?: string;
    embedUrl?: string;
    mediaPath?: string;
    mediaUrl?: string;
    posterPath?: string;
    posterUrl?: string;
    mimeType?: string;
    tags: string[];
    notesPath?: string;
  }>;
};

type TickerFeedFile = {
  repoName: string;
  items: TickerItem[];
};

type DashboardCardsFile = {
  repoName: string;
  templateFiles?: Array<string | { path: string }>;
  files?: Array<string | { path: string }>;
  cardFiles?: Array<string | { path: string }>;
  defaults?: DashboardSlideStyleInput;
  template?: string;
  imagePosition?: string;
  textAlign?: string;
  titleSize?: string | number;
  bodySize?: string | number;
  eyebrowSize?: string | number;
  imageSize?: string | number;
  mobileImageSize?: string | number;
  topics?: Array<{
    id: string;
    title: string;
    label?: string;
    accent?: string;
    imageSurface?: string;
    imagePath?: string;
    imageUrl?: string;
    defaults?: DashboardSlideStyleInput;
    style?: DashboardSlideStyleInput;
    template?: string;
    imagePosition?: string;
    textAlign?: string;
    titleSize?: string | number;
    bodySize?: string | number;
    eyebrowSize?: string | number;
    imageSize?: string | number;
    mobileImageSize?: string | number;
    slides: Array<{
      eyebrow?: string;
      title: string;
      body?: string;
      imageAlt?: string;
      imagePath?: string;
      imageUrl?: string;
      style?: DashboardSlideStyleInput;
      template?: string;
      imagePosition?: string;
      textAlign?: string;
      titleSize?: string | number;
      bodySize?: string | number;
      eyebrowSize?: string | number;
      imageSize?: string | number;
      mobileImageSize?: string | number;
    }>;
  }>;
};

type DashboardSlideStyleInput = {
  template?: string;
  imagePosition?: string;
  textAlign?: string;
  titleSize?: string | number;
  bodySize?: string | number;
  eyebrowSize?: string | number;
  imageSize?: string | number;
  mobileImageSize?: string | number;
};

const CBT_ROOT_FOLDER = "cbt";
const resolveCbtPath = (...segments: string[]) => [CBT_ROOT_FOLDER, ...segments].join("/");

const fetchRepoText = (filePath: string, preferredRepoName?: string, repoRef?: string) =>
  readRepoContentText(filePath, preferredRepoName, repoRef);

const fetchRepoTextWithSource = (filePath: string, preferredRepoName?: string, repoRef?: string) =>
  readRepoContentSource(filePath, preferredRepoName, repoRef);

/** Run async tasks with bounded concurrency to avoid flooding GitHub. */
const runConcurrent = async <T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 4
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));

  const worker = async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) return;
      results[task.index] = await fn(task.item);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker)
  );
  return results;
};

const resolveOptionalRepoAssetUrl = (
  value: string | undefined,
  repoName: string,
  repoRef?: string
) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return undefined;

  if (/^https?:\/\//i.test(trimmed)) {
    return toRawGithub(trimmed);
  }

  return buildContentRepoRawUrl(trimmed, repoName, repoRef);
};

const dashboardTemplateValues = new Set<DashboardSlideTemplate>(["text", "imageText", "image"]);
const dashboardImagePositions = new Set<DashboardImagePosition>(["left", "right", "top", "bottom"]);
const dashboardTextAlignments = new Set<DashboardTextAlign>(["left", "center", "right"]);

const normalizeDashboardTemplate = (value: string | undefined): DashboardSlideTemplate | undefined => {
  const normalized = String(value || "").trim();
  if (dashboardTemplateValues.has(normalized as DashboardSlideTemplate)) {
    return normalized as DashboardSlideTemplate;
  }

  const compact = normalized.toLowerCase().replace(/[\s_-]+/g, "");
  if (compact === "text") return "text";
  if (compact === "imagetext" || compact === "textimage") return "imageText";
  if (compact === "image") return "image";
  return undefined;
};

const normalizeDashboardImagePosition = (
  value: string | undefined
): DashboardImagePosition | undefined => {
  const normalized = String(value || "").trim().toLowerCase();
  if (dashboardImagePositions.has(normalized as DashboardImagePosition)) {
    return normalized as DashboardImagePosition;
  }

  const compact = normalized.replace(/[\s_-]+/g, "");
  if (compact === "imageleft") return "left";
  if (compact === "imageright") return "right";
  if (compact === "imagetop") return "top";
  if (compact === "imagebottom") return "bottom";
  return undefined;
};

const normalizeDashboardTextAlign = (value: string | undefined): DashboardTextAlign | undefined => {
  const normalized = String(value || "").trim().toLowerCase();
  return dashboardTextAlignments.has(normalized as DashboardTextAlign)
    ? (normalized as DashboardTextAlign)
    : undefined;
};

const normalizeDashboardCssValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) return undefined;
  const normalized = typeof value === "number" ? `${value}px` : String(value).trim();
  if (!normalized) return undefined;
  return normalized.replace(/[;"{}]/g, "");
};

const pickDashboardStyle = (input: DashboardSlideStyleInput | undefined): DashboardSlideStyleInput => {
  const picked: DashboardSlideStyleInput = {};
  if (input?.template !== undefined) picked.template = input.template;
  if (input?.imagePosition !== undefined) picked.imagePosition = input.imagePosition;
  if (input?.textAlign !== undefined) picked.textAlign = input.textAlign;
  if (input?.titleSize !== undefined) picked.titleSize = input.titleSize;
  if (input?.bodySize !== undefined) picked.bodySize = input.bodySize;
  if (input?.eyebrowSize !== undefined) picked.eyebrowSize = input.eyebrowSize;
  if (input?.imageSize !== undefined) picked.imageSize = input.imageSize;
  if (input?.mobileImageSize !== undefined) picked.mobileImageSize = input.mobileImageSize;
  return picked;
};

const mergeDashboardSlideStyle = (
  ...inputs: Array<DashboardSlideStyleInput | undefined>
): { template: DashboardSlideTemplate; style: DashboardSlideStyle } => {
  const merged = inputs.reduce<DashboardSlideStyleInput>(
    (acc, input) => ({
      ...acc,
      ...pickDashboardStyle(input),
    }),
    {}
  );

  return {
    template: normalizeDashboardTemplate(merged.template) || "text",
    style: {
      imagePosition: normalizeDashboardImagePosition(merged.imagePosition) || "left",
      textAlign: normalizeDashboardTextAlign(merged.textAlign) || "left",
      ...(normalizeDashboardCssValue(merged.titleSize)
        ? { titleSize: normalizeDashboardCssValue(merged.titleSize) }
        : {}),
      ...(normalizeDashboardCssValue(merged.bodySize)
        ? { bodySize: normalizeDashboardCssValue(merged.bodySize) }
        : {}),
      ...(normalizeDashboardCssValue(merged.eyebrowSize)
        ? { eyebrowSize: normalizeDashboardCssValue(merged.eyebrowSize) }
        : {}),
      ...(normalizeDashboardCssValue(merged.imageSize)
        ? { imageSize: normalizeDashboardCssValue(merged.imageSize) }
        : {}),
      ...(normalizeDashboardCssValue(merged.mobileImageSize)
        ? { mobileImageSize: normalizeDashboardCssValue(merged.mobileImageSize) }
        : {}),
    },
  };
};

const getDashboardStyleInput = (
  input:
    | (DashboardSlideStyleInput & { style?: DashboardSlideStyleInput; defaults?: DashboardSlideStyleInput })
    | undefined
): DashboardSlideStyleInput => ({
  ...pickDashboardStyle(input?.defaults),
  ...pickDashboardStyle(input),
  ...pickDashboardStyle(input?.style),
});

const getDashboardTemplateFilePaths = (file: DashboardCardsFile) =>
  [...(file.templateFiles || []), ...(file.files || []), ...(file.cardFiles || [])]
    .map((entry) => (typeof entry === "string" ? entry : entry.path))
    .map((path) => String(path || "").trim())
    .filter(Boolean);

const fetchRepoYamlWithSource = async <T>(
  filePath: string,
  preferredRepoName?: string,
  repoRef?: string
) => {
  const source = await fetchRepoTextWithSource(filePath, preferredRepoName, repoRef);
  return {
    ...source,
    data: parseYaml(source.text) as T,
  };
};

const summarizeMarkdown = (markdown: string) => {
  const lines = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const summaryLine = lines.find((line) => !line.startsWith("#"));
  return summaryLine ? summaryLine.replace(/^[-*+]\s+/, "") : "Content available";
};

const extractSlideTitle = (markdown: string, index: number) => {
  const match = markdown.match(/^#{1,6}\s+(.+)$/m);
  return match ? match[1].trim() : `Slide ${index + 1}`;
};

const splitSlides = (markdown: string): SlideshowSlide[] =>
  markdown
    .split(/\n---\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => ({
      index,
      title: extractSlideTitle(chunk, index),
      markdown: chunk,
    }));

const slugify = (value: string, fallback = "item") => {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
};

const titleFromFileName = (fileName: string) =>
  String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();

const stripMarkdownNoise = (value: string) =>
  String(value || "")
    .replace(/^#+\s+/, "")
    .replace(/\*\*/g, "")
    .trim();

const AUTO_TAG_LIMIT = 6;

const AUTO_TAG_STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "add",
  "after",
  "all",
  "also",
  "an",
  "and",
  "answer",
  "answers",
  "any",
  "are",
  "as",
  "at",
  "basic",
  "basics",
  "be",
  "been",
  "before",
  "best",
  "between",
  "by",
  "can",
  "chapter",
  "code",
  "course",
  "courses",
  "define",
  "describe",
  "detail",
  "details",
  "did",
  "difference",
  "do",
  "does",
  "each",
  "example",
  "examples",
  "explain",
  "for",
  "from",
  "get",
  "give",
  "guide",
  "has",
  "have",
  "help",
  "how",
  "important",
  "in",
  "interview",
  "into",
  "is",
  "it",
  "its",
  "key",
  "learn",
  "lesson",
  "level",
  "main",
  "make",
  "module",
  "more",
  "need",
  "new",
  "not",
  "of",
  "on",
  "one",
  "or",
  "overview",
  "part",
  "question",
  "questions",
  "section",
  "show",
  "soon",
  "step",
  "steps",
  "summary",
  "student",
  "students",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "this",
  "to",
  "topic",
  "topics",
  "type",
  "types",
  "understand",
  "use",
  "used",
  "user",
  "users",
  "using",
  "was",
  "what",
  "when",
  "where",
  "which",
  "why",
  "will",
  "with",
  "without",
  "learning",
  "would",
  "you",
]);

const AUTO_TAG_ACRONYM_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "answer",
  "are",
  "as",
  "at",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "of",
  "on",
  "or",
  "question",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "why",
  "would",
  "with",
  "you",
]);

type AutoTagCandidate = {
  label: string;
  score: number;
  firstSeen: number;
};

const cleanupAutoTagText = (value: string) =>
  String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^(title|question|category|course|level|tags?)\s*:\s*.+$/gim, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/&amp;/gi, " and ")
    .replace(/[#>*_~()[\]{}|,;!?]/g, " ");

const tokenizeAutoTagText = (value: string) =>
  (cleanupAutoTagText(value).match(/\.net|[a-z0-9][a-z0-9+#.:-]*/gi) || [])
    .map((token) =>
      token
        .replace(/^[^a-z0-9.]+|[^a-z0-9+#.]+$/gi, "")
        .replace(/\.$/, "")
        .toLowerCase()
    )
    .filter(Boolean);

const isUsefulAutoTagToken = (token: string, allowShort = false) => {
  if (!token || AUTO_TAG_STOP_WORDS.has(token)) return false;
  if (/^\d+$/.test(token)) return false;
  if (token.length >= 3) return true;
  return allowShort || /[+#.]/.test(token);
};

const normalizeAutoTagForCompare = (label: string) =>
  label.replace(/[^a-z0-9]/gi, "").toLowerCase().replace(/s$/, "");

const addAutoTagCandidate = (
  candidates: Map<string, AutoTagCandidate>,
  tokens: string[],
  score: number,
  firstSeen: number,
  displayLabel?: string,
  force = false
) => {
  if (tokens.length === 0) return;
  if (!force && !tokens.every((token) => isUsefulAutoTagToken(token, tokens.length > 1))) return;

  const label = (displayLabel || tokens.join(" ")).replace(/\s+/g, " ").trim();
  if (!label) return;

  const key = normalizeAutoTagForCompare(label);
  if (!key) return;

  const existing = candidates.get(key);
  if (existing) {
    existing.score += score;
    existing.firstSeen = Math.min(existing.firstSeen, firstSeen);
    return;
  }

  candidates.set(key, { label, score, firstSeen });
};

const isContentAcronym = (token: string) => {
  const cleaned = token.replace(/^[^a-z0-9.]+|[^a-z0-9+#.:-]+$/gi, "");
  if (cleaned.length < 2 || AUTO_TAG_STOP_WORDS.has(cleaned.toLowerCase())) return false;
  if (/^\d+$/.test(cleaned)) return false;

  const letters = cleaned.replace(/[^a-z]/gi, "");
  const uppercaseCount = (cleaned.match(/[A-Z]/g) || []).length;

  return (
    /^\.?[A-Z0-9]{2,}[A-Z0-9+#.:-]*s?$/.test(cleaned) ||
    (letters.length >= 3 && uppercaseCount >= 2 && cleaned.length <= 16)
  );
};

const extractContentAcronyms = (value: string) => {
  const acronyms = new Map<string, string>();
  const rawTokens = cleanupAutoTagText(value).match(/\.?[A-Za-z0-9][A-Za-z0-9+#.:-]*/g) || [];

  rawTokens.forEach((token) => {
    const cleaned = token.replace(/^[^a-z0-9.]+|[^a-z0-9+#.:-]+$/gi, "").replace(/\.$/, "");
    if (!isContentAcronym(cleaned)) return;

    const key = normalizeAutoTagForCompare(cleaned);
    if (key && !acronyms.has(key)) {
      acronyms.set(key, cleaned);
    }
  });

  return acronyms;
};

const getAutoTagAcronym = (label: string) => {
  const words = label
    .split(/\s+/)
    .flatMap((token) => token.split(/[-/]+/))
    .map((word) => word.replace(/[^a-z0-9]/gi, "").toLowerCase())
    .filter((word) => word.length >= 2 && !AUTO_TAG_ACRONYM_STOP_WORDS.has(word));

  if (words.length < 2 || words.length > 5) return "";

  const acronym = words.map((word) => word[0]).join("");
  return acronym.length >= 2 ? acronym : "";
};

const addAutoTagAcronymCandidate = (
  candidates: Map<string, AutoTagCandidate>,
  contentAcronyms: Map<string, string>,
  phraseLabel: string,
  score: number,
  firstSeen: number
) => {
  const acronym = getAutoTagAcronym(phraseLabel);
  const displayLabel = contentAcronyms.get(normalizeAutoTagForCompare(acronym));
  if (!displayLabel) return;

  addAutoTagCandidate(candidates, [displayLabel.toLowerCase()], score, firstSeen, displayLabel, true);
};

const autoTagRank = (candidate: AutoTagCandidate) =>
  candidate.score + (candidate.label.split(" ").length - 1) * 12;

const formatAutoTagLabel = (label: string, contentAcronyms: Map<string, string>) =>
  label
    .split(" ")
    .map((token) => contentAcronyms.get(normalizeAutoTagForCompare(token)) || token)
    .join(" ");

const deriveInterviewCourseTags = (markdown: string, courseTitle: string) => {
  const headings = Array.from(markdown.matchAll(/^#{1,6}\s+(.+)$/gm), (match) => match[1]);
  const contentAcronyms = extractContentAcronyms(markdown);
  const sources = [
    { text: courseTitle, weight: 14 },
    { text: headings.join("\n"), weight: 5 },
    { text: markdown, weight: 1 },
  ];
  const candidates = new Map<string, AutoTagCandidate>();
  let position = 0;
  const titleTokens = tokenizeAutoTagText(courseTitle).filter((token) => isUsefulAutoTagToken(token, true));

  if (titleTokens.length > 0 && titleTokens.length <= 3) {
    addAutoTagCandidate(candidates, titleTokens, 80, 0);
    addAutoTagAcronymCandidate(candidates, contentAcronyms, titleTokens.join(" "), 78, 0);
  }

  contentAcronyms.forEach((label, key) => {
    addAutoTagCandidate(candidates, [key], 26, 0, label, true);
  });

  for (const source of sources) {
    const tokens = tokenizeAutoTagText(source.text);

    tokens.forEach((token, index) => {
      addAutoTagCandidate(candidates, [token], source.weight, position + index);
    });

    if (source.weight > 1) {
      for (let index = 0; index < tokens.length; index += 1) {
        for (let size = 2; size <= 3 && index + size <= tokens.length; size += 1) {
          const phraseTokens = tokens.slice(index, index + size);
          addAutoTagCandidate(
            candidates,
            phraseTokens,
            source.weight + size * 1.5,
            position + index
          );
          addAutoTagAcronymCandidate(
            candidates,
            contentAcronyms,
            phraseTokens.join(" "),
            source.weight + size * 1.5 + 10,
            position + index
          );
        }
      }
    }

    position += tokens.length;
  }

  const selected: string[] = [];

  for (const candidate of Array.from(candidates.values()).sort(
    (a, b) =>
      autoTagRank(b) - autoTagRank(a) ||
      b.score - a.score ||
      a.firstSeen - b.firstSeen ||
      a.label.localeCompare(b.label)
  )) {
    const candidateWords = candidate.label.toLowerCase().split(" ");
    const candidateCompare = normalizeAutoTagForCompare(candidate.label);
    const candidateAcronym = getAutoTagAcronym(candidate.label);
    const overlapsExisting = selected.some((tag) => {
      const tagWords = tag.toLowerCase().split(" ");
      const tagCompare = normalizeAutoTagForCompare(tag);
      const tagAcronym = getAutoTagAcronym(tag);

      return (
        candidateWords.every((word) => tagWords.includes(word)) ||
        tagWords.every((word) => candidateWords.includes(word)) ||
        Boolean(candidateAcronym && normalizeAutoTagForCompare(candidateAcronym) === tagCompare) ||
        Boolean(tagAcronym && normalizeAutoTagForCompare(tagAcronym) === candidateCompare)
      );
    });

    if (overlapsExisting) continue;

    selected.push(formatAutoTagLabel(candidate.label, contentAcronyms));
    if (selected.length >= AUTO_TAG_LIMIT) break;
  }

  return selected;
};

const extractInterviewAnswer = (block: string) => {
  const metadata: Record<string, string> = {};
  const answerLines: string[] = [];
  let inFence = false;

  for (const line of block.replace(/\r\n/g, "\n").split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      answerLines.push(line);
      continue;
    }

    if (!inFence) {
      const metadataMatch = trimmed.match(/^(title|question|category|course|level|tags?)\s*:\s*(.+)$/i);
      if (metadataMatch) {
        metadata[metadataMatch[1].toLowerCase()] = metadataMatch[2].trim();
        continue;
      }

      if (/^#{3,6}\s+answer\b/i.test(trimmed)) {
        continue;
      }
    }

    answerLines.push(line);
  }

  return {
    metadata,
    markdown: answerLines.join("\n").replace(/^\s+|\s+$/g, ""),
  };
};

type MarkdownHeading = {
  level: number;
  text: string;
  index: number;
  endIndex: number;
};

type InterviewSectionCandidate = InterviewCourseQuestion & {
  category: string;
  isQuestionLike: boolean;
  hasExplicitQuestionSignal: boolean;
  hasAnswerSignal: boolean;
};

const QUESTION_HEADING_RE =
  /^(?:q(?:uestion)?\s*\d*\s*[:.)-]\s*)?(?:what|why|when|where|which|who|whom|whose|how|can|could|should|would|do|does|did|is|are|was|were|will|shall|explain|describe|define|compare|differentiate|list|name|tell|write)\b/i;
const QUESTION_NUMBER_HEADING_RE = /^(?:q|question)\s*\d+\b/i;
const INLINE_QUESTION_SIGNAL_RE = /^(?:q|question)\s*\d*\s*[:.)-]\s*\S+/im;
const ANSWER_SIGNAL_RE = /^(?:#{3,6}\s*)?(?:answer|a)\s*(?:[:.)-]\s*)?$/im;

const findMarkdownHeadings = (markdown: string): MarkdownHeading[] => {
  const headings: MarkdownHeading[] = [];
  const lines = markdown.match(/.*(?:\n|$)/g) || [];
  let offset = 0;
  let fenceMarker = "";

  for (const rawLine of lines) {
    if (!rawLine) continue;

    const line = rawLine.replace(/\n$/, "");
    const fenceMatch = line.match(/^\s{0,3}(```|~~~)/);

    if (fenceMatch) {
      const marker = fenceMatch[1];
      fenceMarker = fenceMarker && marker === fenceMarker ? "" : marker;
      offset += rawLine.length;
      continue;
    }

    if (!fenceMarker) {
      const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);

      if (headingMatch) {
        headings.push({
          level: headingMatch[1].length,
          text: stripMarkdownNoise(headingMatch[2].replace(/\s+#+\s*$/, "")),
          index: offset,
          endIndex: offset + rawLine.length,
        });
      }
    }

    offset += rawLine.length;
  }

  return headings;
};

const isQuestionLikeHeading = (value: string) => {
  const normalized = stripMarkdownNoise(value).replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  return (
    normalized.endsWith("?") ||
    QUESTION_NUMBER_HEADING_RE.test(normalized) ||
    QUESTION_HEADING_RE.test(normalized)
  );
};

const buildInterviewSectionCandidates = (
  markdown: string,
  headings: MarkdownHeading[],
  headingLevel: number,
  courseTitle: string,
  markdownUrl?: string
): InterviewSectionCandidate[] =>
  headings
    .map((heading, headingIndex) => {
      if (heading.level !== headingLevel) return null;

      const nextHeading = headings
        .slice(headingIndex + 1)
        .find((candidate) => candidate.level <= headingLevel);
      const rawTitle = stripMarkdownNoise(heading.text);
      const block = markdown.slice(heading.endIndex, nextHeading?.index).trim();
      const { metadata, markdown: answerMarkdown } = extractInterviewAnswer(block);
      const title = stripMarkdownNoise(metadata.title || rawTitle);
      const question = stripMarkdownNoise(metadata.question || rawTitle);
      const category = stripMarkdownNoise(metadata.category || metadata.course || courseTitle || "Interview");
      const level = stripMarkdownNoise(metadata.level || "General");
      const markdownBody = answerMarkdown || "Answer content will be added soon.";
      const hasExplicitQuestionSignal = Boolean(metadata.question) || INLINE_QUESTION_SIGNAL_RE.test(block);

      if (!title || !question) return null;

      return {
        slug: slugify(title || question, `question-${headingIndex + 1}`),
        title,
        category,
        level,
        question,
        tags: [] as string[],
        excerpt: summarizeMarkdown(markdownBody),
        markdown: markdownBody,
        ...(markdownUrl ? { markdown_url: markdownUrl } : {}),
        isQuestionLike: isQuestionLikeHeading(question || title),
        hasExplicitQuestionSignal,
        hasAnswerSignal: ANSWER_SIGNAL_RE.test(block),
      };
    })
    .filter((section): section is InterviewSectionCandidate => section !== null);

const selectInterviewQuestionSections = (
  markdown: string,
  headings: MarkdownHeading[],
  courseTitle: string,
  markdownUrl?: string
) => {
  let best:
    | {
        sections: InterviewSectionCandidate[];
        score: number;
      }
    | null = null;

  for (let headingLevel = 2; headingLevel <= 6; headingLevel += 1) {
    const sections = buildInterviewSectionCandidates(
      markdown,
      headings,
      headingLevel,
      courseTitle,
      markdownUrl
    );

    if (sections.length === 0) continue;

    const explicitCount = sections.filter((section) => section.hasExplicitQuestionSignal).length;
    const questionLikeCount = sections.filter((section) => section.isQuestionLike).length;
    const answerSignalCount = sections.filter((section) => section.hasAnswerSignal).length;
    const evidenceCount = sections.filter(
      (section) => section.hasExplicitQuestionSignal || section.isQuestionLike
    ).length;
    const explicitThreshold = Math.max(1, Math.ceil(sections.length * 0.5));
    const questionThreshold = Math.max(1, Math.ceil(sections.length * 0.6));
    const evidenceThreshold = Math.max(1, Math.ceil(sections.length * 0.7));
    const qualifies =
      explicitCount >= explicitThreshold ||
      questionLikeCount >= questionThreshold ||
      evidenceCount >= evidenceThreshold;

    if (!qualifies) continue;

    const score =
      explicitCount * 5 +
      questionLikeCount * 3 +
      answerSignalCount +
      evidenceCount +
      (6 - headingLevel) / 10;

    if (!best || score > best.score) {
      best = { sections, score };
    }
  }

  return best?.sections || [];
};

const getMarkdownOutlineTitles = (headings: MarkdownHeading[]) => {
  const topSections = headings.filter((heading) => heading.level === 2);
  const outline = topSections.length > 0 ? topSections : headings.filter((heading) => heading.level > 1);

  return outline.map((heading) => stripMarkdownNoise(heading.text)).filter(Boolean);
};

const parseInterviewCourseMarkdown = (
  markdown: string,
  fileName: string,
  markdownUrl?: string
): InterviewQuestionDetail | null => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n");
  if (!normalizedMarkdown.trim()) return null;

  const headings = findMarkdownHeadings(normalizedMarkdown);
  const courseTitle =
    headings.find((heading) => heading.level === 1)?.text || titleFromFileName(fileName);
  const courseSlug = slugify(courseTitle || fileName, "interview");
  const questions = selectInterviewQuestionSections(
    normalizedMarkdown,
    headings,
    courseTitle,
    markdownUrl
  );
  const courseTags = deriveInterviewCourseTags(normalizedMarkdown, courseTitle);

  if (questions.length === 0) {
    const outlineTitles = getMarkdownOutlineTitles(headings);
    const sectionCount = outlineTitles.length;

    return {
      slug: courseSlug,
      title: courseTitle,
      category: courseTitle || "Interview",
      level: sectionCount
        ? `${sectionCount} ${sectionCount === 1 ? "Section" : "Sections"}`
        : "Document",
      question: "",
      tags: courseTags,
      excerpt: outlineTitles.slice(0, 4).join(", ") || summarizeMarkdown(normalizedMarkdown),
      markdown: normalizedMarkdown,
      ...(markdownUrl ? { markdown_url: markdownUrl } : {}),
    };
  }

  const seenQuestionSlugs = new Map<string, number>();
  const uniqueQuestions = questions.map((question) => {
    const count = seenQuestionSlugs.get(question.slug) || 0;
    seenQuestionSlugs.set(question.slug, count + 1);

    return count === 0
      ? question
      : {
          ...question,
          slug: `${question.slug}-${count + 1}`,
        };
  });

  const questionCount = uniqueQuestions.length;
  const category = uniqueQuestions[0]?.category || courseTitle || "Interview";
  const questionTitles = uniqueQuestions.map((question) => question.title).slice(0, 4).join(", ");

  return {
    slug: courseSlug,
    title: courseTitle,
    category,
    level: `${questionCount} ${questionCount === 1 ? "Question" : "Questions"}`,
    question: "",
    tags: courseTags,
    excerpt: questionTitles,
    questionCount,
    markdown: normalizedMarkdown,
    ...(markdownUrl ? { markdown_url: markdownUrl } : {}),
    questions: uniqueQuestions,
  };
};

const uniquifyInterviewCourseSlugs = (items: InterviewQuestionDetail[]) => {
  const seen = new Map<string, number>();

  return items.map((item) => {
    const count = seen.get(item.slug) || 0;
    seen.set(item.slug, count + 1);

    return count === 0
      ? item
      : {
          ...item,
          slug: `${item.slug}-${count + 1}`,
        };
  });
};

const getMarkdownInterviewCourses = async (
  repoRef?: string
): Promise<InterviewQuestionDetail[]> => {
  const { entries, repoName } = await readRepoDirectory("interview-qna", undefined, repoRef);
  const markdownFiles = entries
    .filter((entry) => entry.type === "file")
    .filter((entry) => /\.md$/i.test(entry.name) && !/^readme\.md$/i.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (markdownFiles.length === 0) {
    return [];
  }

  const courseFiles = await runConcurrent(
    markdownFiles,
    (entry) => fetchRepoTextWithSource(entry.path, repoName, repoRef),
    4
  );

  return uniquifyInterviewCourseSlugs(
    courseFiles
      .map((source) => {
        const fileName = source.url.split("/").pop() || source.url;
        return parseInterviewCourseMarkdown(source.text, fileName, source.url);
      })
      .filter((course): course is InterviewQuestionDetail => course !== null)
  );
};

const readOptionalMarkdownSource = async (
  filePath: string | undefined,
  repoName: string,
  repoRef?: string
) => {
  if (!filePath) return undefined;
  return fetchRepoTextWithSource(filePath, repoName, repoRef);
};

const loadCourseTopics = async (
  subject: CourseCatalogEntry,
  repoName: string,
  repoRef?: string
): Promise<ParsedTopic[]> => {
  const readmeUrl = buildContentRepoRawUrl(subject.readmePath, repoName, repoRef);
  const readmeText = await fetchRepoText(subject.readmePath, repoName, repoRef);
  return parseSubjectTopicsFromReadme(readmeText, readmeUrl);
};

const getCourseIconRegistry = async (repoRef?: string) => {
  const { data: iconFile, repoName } = await fetchRepoYamlWithSource<DesignIconFile>(
    "design/icon.yaml",
    undefined,
    repoRef
  );

  return Object.fromEntries(
    Object.entries(iconFile.courses || {}).map(([slug, entry]) => [
      slug,
      {
        ...entry,
        iconUrl: buildContentRepoRawUrl(entry.iconPath, repoName, repoRef),
      },
    ])
  );
};

export const getDesignSystem = async (repoRef?: string): Promise<DesignSystem> => {
  const [{ data: colorFile }, courseIcons] = await Promise.all([
    fetchRepoYamlWithSource<DesignColorFile>("design/colour.yaml", undefined, repoRef),
    getCourseIconRegistry(repoRef),
  ]);

  return {
    ...colorFile,
    courseIcons,
  };
};

export const getTickerItems = async (repoRef?: string): Promise<TickerItem[]> => {
  const { data: feed } = await fetchRepoYamlWithSource<TickerFeedFile>(
    "news-ticker/feed.yaml",
    undefined,
    repoRef
  );
  return [...feed.items].sort((a, b) => a.priority - b.priority);
};

export const getDashboardCards = async (repoRef?: string): Promise<DashboardCardTopic[]> => {
  const { data: indexFile, repoName } = await fetchRepoYamlWithSource<DashboardCardsFile>(
    "dashboard/cards.yaml",
    undefined,
    repoRef
  );

  const templateFilePaths = getDashboardTemplateFilePaths(indexFile);
  const sourceFiles =
    templateFilePaths.length > 0
      ? await Promise.all(
          templateFilePaths.map((filePath) =>
            fetchRepoYamlWithSource<DashboardCardsFile>(filePath, repoName, repoRef)
          )
        )
      : [{ data: indexFile, repoName }];

  const topicSources = sourceFiles.flatMap((source) => {
    const topics = Array.isArray(source.data.topics) ? source.data.topics : [];
    const fileStyle = getDashboardStyleInput(source.data);

    return topics.map((topic) => ({
      topic,
      repoName: source.repoName,
      fileStyle,
    }));
  });

  return topicSources
    .map(({ topic, repoName: sourceRepoName, fileStyle }, topicIndex) => {
      const topicStyle = getDashboardStyleInput(topic);
      const slides = (Array.isArray(topic.slides) ? topic.slides : [])
        .map((slide, slideIndex) => {
          const title = String(slide.title || "").trim();
          if (!title) return null;

          const imageUrl =
            resolveOptionalRepoAssetUrl(slide.imagePath || slide.imageUrl, sourceRepoName, repoRef) ||
            resolveOptionalRepoAssetUrl(topic.imagePath || topic.imageUrl, sourceRepoName, repoRef);
          const presentation = mergeDashboardSlideStyle(
            { template: imageUrl ? "imageText" : "text" },
            fileStyle,
            topicStyle,
            getDashboardStyleInput(slide)
          );

          return {
            template: presentation.template,
            eyebrow: String(slide.eyebrow || `Slide ${slideIndex + 1}`).trim(),
            title,
            body: String(slide.body || "").trim(),
            imageAlt: String(slide.imageAlt || `${title} visual`).trim(),
            ...(imageUrl ? { imageUrl } : {}),
            style: presentation.style,
          };
        })
        .filter((slide): slide is DashboardCardTopic["slides"][number] => slide !== null);

      if (slides.length === 0) return null;

      return {
        id: String(topic.id || `dashboard-topic-${topicIndex + 1}`).trim(),
        title: String(topic.title || `Topic ${topicIndex + 1}`).trim(),
        label: String(topic.label || "Dashboard topic").trim(),
        accent: String(topic.accent || "var(--dashboard-section-courses-accent)").trim(),
        imageSurface: String(
          topic.imageSurface ||
            "linear-gradient(135deg, color-mix(in srgb, var(--brand) 14%, var(--surface)), color-mix(in srgb, var(--brand-2) 10%, var(--surface)))"
        ).trim(),
        slides,
      };
    })
    .filter((topic): topic is DashboardCardTopic => topic !== null);
};

export const getInterviewQuestionSummaries = async (
  repoRef?: string
): Promise<InterviewQuestionSummary[]> => {
  const markdownCourses = await getMarkdownInterviewCourses(repoRef);

  return markdownCourses.map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.category,
    level: item.level,
    question: item.question,
    tags: item.tags,
    excerpt: item.excerpt,
    questionCount: item.questionCount,
  }));
};

export const getInterviewQuestionBySlug = async (
  slug: string,
  repoRef?: string
): Promise<InterviewQuestionDetail | null> => {
  const markdownCourses = await getMarkdownInterviewCourses(repoRef);
  const markdownCourse = markdownCourses.find((item) => item.slug === slug);

  return markdownCourse || null;
};

export const getCourseSubjects = async (repoRef?: string): Promise<CourseSubject[]> => {
  // Two parallel requests: catalog + icon registry (independent of each other).
  const [{ data: catalog, repoName }, courseIcons] = await Promise.all([
    fetchRepoYamlWithSource<CoursesCatalogFile>("courses/catalog.yaml", undefined, repoRef),
    getCourseIconRegistry(repoRef),
  ]);

  // Fetch each course README with bounded concurrency (4 at a time).
  // Previously this was Promise.all which fired ALL at once and could hit
  // GitHub rate limits or saturate the connection on large catalogs.
  return runConcurrent(
    catalog.subjects,
    async (entry) => {
      let topics: ParsedTopic[] = [];

      try {
        topics = await loadCourseTopics(entry, repoName, repoRef);
      } catch {
        topics = [];
      }

      return {
        ...entry,
        subject: entry.title,
        readme_url: buildContentRepoRawUrl(entry.readmePath, repoName, repoRef),
        icon_url: courseIcons[entry.slug]?.iconUrl,
        topics,
      };
    },
    4
  );
};

export const getCourseSubjectByName = async (
  subjectName: string,
  repoRef?: string
): Promise<CourseSubject | null> => {
  const subjects = await getCourseSubjects(repoRef);
  return (
    subjects.find(
      (subject) =>
        subject.slug === subjectName || normalize(subject.subject) === normalize(subjectName)
    ) || null
  );
};

const loadMediaCollection = async (
  folderName: "training-videos" | "audio-books",
  includeNotes = false,
  repoRef?: string
): Promise<MediaCollectionItem[]> => {
  const { data: catalog, repoName } = await fetchRepoYamlWithSource<MediaCatalogFile>(
    resolveCbtPath(folderName, "av-metadata.yaml"),
    undefined,
    repoRef
  );

  return Promise.all(
    catalog.items.map(async (item) => {
      const notesSource = includeNotes
        ? await readOptionalMarkdownSource(item.notesPath, repoName, repoRef)
        : undefined;

      return {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        speaker: item.speaker,
        playlistUrl: item.playlistUrl,
        embedUrl: item.embedUrl,
        mediaUrl:
          resolveOptionalRepoAssetUrl(item.mediaPath, repoName, repoRef) ||
          resolveOptionalRepoAssetUrl(item.mediaUrl, repoName, repoRef),
        posterUrl:
          resolveOptionalRepoAssetUrl(item.posterPath, repoName, repoRef) ||
          resolveOptionalRepoAssetUrl(item.posterUrl, repoName, repoRef),
        mimeType: item.mimeType,
        tags: item.tags,
        notesMarkdown: notesSource?.text,
        notesMarkdownUrl: notesSource?.url,
      };
    })
  );
};

export const getSlideshows = async (repoRef?: string): Promise<SlideshowSummary[]> => {
  const { data: catalog } = await fetchRepoYamlWithSource<SlideshowCatalogFile>(
    resolveCbtPath("slideshows", "av-metadata.yaml"),
    undefined,
    repoRef
  );

  return catalog.decks.map((deck) => ({
    slug: deck.slug,
    title: deck.title,
    summary: deck.summary,
    audience: deck.audience,
    tags: deck.tags,
  }));
};

export const getSlideshowBySlug = async (
  slug: string,
  repoRef?: string
): Promise<SlideshowDeck | null> => {
  const { data: catalog, repoName } = await fetchRepoYamlWithSource<SlideshowCatalogFile>(
    resolveCbtPath("slideshows", "av-metadata.yaml"),
    undefined,
    repoRef
  );
  const deck = catalog.decks.find((item) => item.slug === slug);

  if (!deck) return null;

  const markdownSource = await fetchRepoTextWithSource(deck.contentPath, repoName, repoRef);

  return {
    slug: deck.slug,
    title: deck.title,
    summary: deck.summary,
    audience: deck.audience,
    tags: deck.tags,
    markdown: markdownSource.text,
    markdown_url: markdownSource.url,
    slides: splitSlides(markdownSource.text),
  };
};

export const getCbtCollections = async (repoRef?: string): Promise<CbtCollections> => {
  const [slideshows, trainingVideos, audioBooks] = await Promise.all([
    getSlideshows(repoRef),
    loadMediaCollection("training-videos", false, repoRef),
    loadMediaCollection("audio-books", false, repoRef),
  ]);

  return {
    slideshows,
    trainingVideos,
    audioBooks,
  };
};

export const getMediaCollectionByKind = async (
  kind: "training-videos" | "audio-books",
  repoRef?: string
): Promise<MediaCollectionItem[]> => loadMediaCollection(kind, false, repoRef);

export const getMediaItemBySlug = async (
  kind: "training-videos" | "audio-books",
  slug: string,
  repoRef?: string
): Promise<MediaCollectionItem | null> => {
  const { data: catalog, repoName } = await fetchRepoYamlWithSource<MediaCatalogFile>(
    resolveCbtPath(kind, "av-metadata.yaml"),
    undefined,
    repoRef
  );
  const item = catalog.items.find((entry) => entry.slug === slug);

  if (!item) {
    return null;
  }

  const notesSource = await readOptionalMarkdownSource(item.notesPath, repoName, repoRef);

  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    speaker: item.speaker,
    playlistUrl: item.playlistUrl,
    embedUrl: item.embedUrl,
    mediaUrl:
      resolveOptionalRepoAssetUrl(item.mediaPath, repoName, repoRef) ||
      resolveOptionalRepoAssetUrl(item.mediaUrl, repoName, repoRef),
    posterUrl:
      resolveOptionalRepoAssetUrl(item.posterPath, repoName, repoRef) ||
      resolveOptionalRepoAssetUrl(item.posterUrl, repoName, repoRef),
    mimeType: item.mimeType,
    tags: item.tags,
    notesMarkdown: notesSource?.text,
    notesMarkdownUrl: notesSource?.url,
  };
};

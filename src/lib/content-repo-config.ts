const trimSlashes = (value: string) =>
  String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

const splitUrlPath = (value: string) =>
  trimSlashes(String(value || "").split(/[?#]/)[0]).split("/").filter(Boolean);

export const CONTENT_REPO_OWNER =
  process.env.NEXT_PUBLIC_CONTENT_REPO_OWNER ||
  process.env.CONTENT_REPO_OWNER ||
  "tinitiateprime";

export const CONTENT_REPO_NAME =
  process.env.NEXT_PUBLIC_CONTENT_REPO_NAME ||
  process.env.CONTENT_REPO_NAME ||
  "tiai-edu-app";

export const CONTENT_REPO_BRANCH =
  process.env.NEXT_PUBLIC_CONTENT_REPO_BRANCH ||
  process.env.CONTENT_REPO_BRANCH ||
  "main";

export const CONTENT_REPO_BASE_PATH = trimSlashes(
  process.env.NEXT_PUBLIC_CONTENT_REPO_BASE_PATH || process.env.CONTENT_REPO_BASE_PATH || ""
);

export const normalizeContentRepoPath = (filePath: string) => trimSlashes(filePath);

export const stripContentRepoBasePath = (filePath: string) => {
  const normalized = normalizeContentRepoPath(filePath);

  if (!CONTENT_REPO_BASE_PATH) return normalized;
  if (normalized === CONTENT_REPO_BASE_PATH) return "";

  return normalized.startsWith(`${CONTENT_REPO_BASE_PATH}/`)
    ? normalized.slice(CONTENT_REPO_BASE_PATH.length + 1)
    : normalized;
};

export const resolveContentRepoPath = (filePath: string) => {
  const normalized = stripContentRepoBasePath(filePath);
  return [CONTENT_REPO_BASE_PATH, normalized].filter(Boolean).join("/");
};

export const getContentRepoPathCandidates = (filePath: string) => {
  const normalized = stripContentRepoBasePath(filePath);
  const candidates = [[CONTENT_REPO_BASE_PATH, normalized].filter(Boolean).join("/")].filter(Boolean);

  return [...new Set(candidates)];
};

export const getContentRepoNameCandidates = (preferredRepoName?: string) => {
  const repoName = String(preferredRepoName || CONTENT_REPO_NAME || "").trim();
  return repoName ? [repoName] : [];
};

export const buildContentRepoRawUrl = (
  filePath: string,
  repoName = CONTENT_REPO_NAME,
  repoRef = CONTENT_REPO_BRANCH
) =>
  `https://raw.githubusercontent.com/${CONTENT_REPO_OWNER}/${repoName}/${repoRef}/${resolveContentRepoPath(filePath)}`;

export const buildContentRepoBlobUrl = (filePath: string, repoName = CONTENT_REPO_NAME) =>
  `https://github.com/${CONTENT_REPO_OWNER}/${repoName}/blob/${CONTENT_REPO_BRANCH}/${resolveContentRepoPath(filePath)}`;

export const buildContentRepoTreeUrl = (folderPath = "", repoName = CONTENT_REPO_NAME) => {
  const resolvedPath = resolveContentRepoPath(folderPath);
  return resolvedPath
    ? `https://github.com/${CONTENT_REPO_OWNER}/${repoName}/tree/${CONTENT_REPO_BRANCH}/${resolvedPath}`
    : `https://github.com/${CONTENT_REPO_OWNER}/${repoName}/tree/${CONTENT_REPO_BRANCH}`;
};

export const getContentRepoDisplayName = () =>
  [CONTENT_REPO_OWNER, CONTENT_REPO_NAME, CONTENT_REPO_BASE_PATH]
    .filter(Boolean)
    .join("/");

export const parseContentRepoPathFromUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    const parts = splitUrlPath(url.pathname);
    const repoNameCandidates = new Set(getContentRepoNameCandidates());

    if (
      url.hostname === "raw.githubusercontent.com" &&
      parts[0] === CONTENT_REPO_OWNER &&
      repoNameCandidates.has(parts[1]) &&
      parts[2] === CONTENT_REPO_BRANCH
    ) {
      return stripContentRepoBasePath(parts.slice(3).join("/"));
    }

    if (
      url.hostname === "github.com" &&
      parts[0] === CONTENT_REPO_OWNER &&
      repoNameCandidates.has(parts[1]) &&
      parts[2] === "blob" &&
      parts[3] === CONTENT_REPO_BRANCH
    ) {
      return stripContentRepoBasePath(parts.slice(4).join("/"));
    }
  } catch {
    return null;
  }

  return null;
};

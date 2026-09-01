import { skillwaveConfig } from "../config/skillwave.config";

/*
 * ============================================================
 * CONTENT REPOSITORY CONFIGURATION
 * ============================================================
 *
 * This file provides one common interface for accessing the
 * content repository used by the application.
 *
 * The actual company/repository information comes from:
 *
 *   src/config/skillwave.config.ts
 *
 * This means the application code does not need to know which
 * company owns the content repository.
 *
 * Environment variables can still override the configuration
 * when required.
 */

/* ============================================================
   HELPERS
============================================================ */

const trimSlashes = (value: string) =>
  String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

const splitUrlPath = (value: string) =>
  trimSlashes(
    String(value || "").split(/[?#]/)[0]
  )
    .split("/")
    .filter(Boolean);

const normalizeRepoName = (value: string) => {
  const normalized = trimSlashes(value);

  if (!normalized) {
    return "";
  }

  const parts = normalized
    .split("/")
    .filter(Boolean);

  /*
   * Accept either:
   *
   *   tinitiateai-skillwave
   *
   * or:
   *
   *   Akhila232004/tinitiateai-skillwave
   *
   * Internally we only need the repository name.
   */
  return parts.length > 1
    ? parts[parts.length - 1]
    : parts[0];
};

/* ============================================================
   REPOSITORY SETTINGS
============================================================ */

/*
 * Repository owner.
 *
 * Priority:
 *
 * 1. NEXT_PUBLIC_CONTENT_REPO_OWNER
 * 2. CONTENT_REPO_OWNER
 * 3. skillwave.config.ts
 */
export const CONTENT_REPO_OWNER =
  process.env.NEXT_PUBLIC_CONTENT_REPO_OWNER ||
  process.env.CONTENT_REPO_OWNER ||
  skillwaveConfig.contentRepository.owner;

/*
 * Repository name.
 *
 * Priority:
 *
 * 1. NEXT_PUBLIC_CONTENT_REPO_NAME
 * 2. CONTENT_REPO_NAME
 * 3. skillwave.config.ts
 */
export const CONTENT_REPO_NAME =
  normalizeRepoName(
    process.env.NEXT_PUBLIC_CONTENT_REPO_NAME ||
      process.env.CONTENT_REPO_NAME ||
      skillwaveConfig.contentRepository.repository
  );

/*
 * Repository branch.
 *
 * Priority:
 *
 * 1. NEXT_PUBLIC_CONTENT_REPO_BRANCH
 * 2. CONTENT_REPO_BRANCH
 * 3. skillwave.config.ts
 */
export const CONTENT_REPO_BRANCH =
  process.env.NEXT_PUBLIC_CONTENT_REPO_BRANCH ||
  process.env.CONTENT_REPO_BRANCH ||
  skillwaveConfig.contentRepository.branch;

/*
 * Optional base path inside the repository.
 *
 * Example:
 *
 * repository/
 *   learning-content/
 *     courses/
 *
 * Then:
 *
 * CONTENT_REPO_BASE_PATH=learning-content
 */
export const CONTENT_REPO_BASE_PATH =
  trimSlashes(
    process.env.NEXT_PUBLIC_CONTENT_REPO_BASE_PATH ||
      process.env.CONTENT_REPO_BASE_PATH ||
      ""
  );

/* ============================================================
   PATH NORMALIZATION
============================================================ */

export const normalizeContentRepoPath = (
  filePath: string
) => trimSlashes(filePath);

export const stripContentRepoBasePath = (
  filePath: string
) => {
  const normalized =
    normalizeContentRepoPath(filePath);

  if (!CONTENT_REPO_BASE_PATH) {
    return normalized;
  }

  if (
    normalized ===
    CONTENT_REPO_BASE_PATH
  ) {
    return "";
  }

  return normalized.startsWith(
    `${CONTENT_REPO_BASE_PATH}/`
  )
    ? normalized.slice(
        CONTENT_REPO_BASE_PATH.length + 1
      )
    : normalized;
};

export const resolveContentRepoPath = (
  filePath: string
) => {
  const normalized =
    stripContentRepoBasePath(
      filePath
    );

  return [
    CONTENT_REPO_BASE_PATH,
    normalized,
  ]
    .filter(Boolean)
    .join("/");
};

/* ============================================================
   PATH CANDIDATES
============================================================ */

export const getContentRepoPathCandidates = (
  filePath: string
) => {
  const normalized =
    stripContentRepoBasePath(
      filePath
    );

  const candidates = [
    [
      CONTENT_REPO_BASE_PATH,
      normalized,
    ]
      .filter(Boolean)
      .join("/"),
  ].filter(Boolean);

  return [
    ...new Set(candidates),
  ];
};

/* ============================================================
   REPOSITORY NAME CANDIDATES
============================================================ */

export const getContentRepoNameCandidates = (
  preferredRepoName?: string
) => {
  const repoName =
    normalizeRepoName(
      preferredRepoName ||
        CONTENT_REPO_NAME ||
        ""
    );

  return repoName
    ? [repoName]
    : [];
};

/* ============================================================
   RAW GITHUB URL
============================================================ */

export const buildContentRepoRawUrl = (
  filePath: string,
  repoName = CONTENT_REPO_NAME,
  repoRef = CONTENT_REPO_BRANCH
) => {
  const normalizedRepoName =
    normalizeRepoName(repoName);

  if (!CONTENT_REPO_OWNER) {
    throw new Error(
      "Content repository owner is not configured"
    );
  }

  if (!normalizedRepoName) {
    throw new Error(
      "Content repository name is not configured"
    );
  }

  if (!repoRef) {
    throw new Error(
      "Content repository branch is not configured"
    );
  }

  const resolvedPath =
    resolveContentRepoPath(
      filePath
    );

  if (!resolvedPath) {
    throw new Error(
      "Content repository file path is empty"
    );
  }

  return (
    `https://raw.githubusercontent.com/` +
    `${CONTENT_REPO_OWNER}/` +
    `${normalizedRepoName}/` +
    `${repoRef}/` +
    `${resolvedPath}`
  );
};

/* ============================================================
   GITHUB BLOB URL
============================================================ */

export const buildContentRepoBlobUrl = (
  filePath: string,
  repoName = CONTENT_REPO_NAME
) => {
  const normalizedRepoName =
    normalizeRepoName(repoName);

  const resolvedPath =
    resolveContentRepoPath(
      filePath
    );

  if (!normalizedRepoName) {
    throw new Error(
      "Content repository name is not configured"
    );
  }

  if (!CONTENT_REPO_OWNER) {
    throw new Error(
      "Content repository owner is not configured"
    );
  }

  if (!CONTENT_REPO_BRANCH) {
    throw new Error(
      "Content repository branch is not configured"
    );
  }

  return (
    `https://github.com/` +
    `${CONTENT_REPO_OWNER}/` +
    `${normalizedRepoName}/blob/` +
    `${CONTENT_REPO_BRANCH}/` +
    `${resolvedPath}`
  );
};

/* ============================================================
   GITHUB TREE URL
============================================================ */

export const buildContentRepoTreeUrl = (
  folderPath = "",
  repoName = CONTENT_REPO_NAME
) => {
  const normalizedRepoName =
    normalizeRepoName(repoName);

  const resolvedPath =
    resolveContentRepoPath(
      folderPath
    );

  if (!normalizedRepoName) {
    throw new Error(
      "Content repository name is not configured"
    );
  }

  if (!CONTENT_REPO_OWNER) {
    throw new Error(
      "Content repository owner is not configured"
    );
  }

  if (!CONTENT_REPO_BRANCH) {
    throw new Error(
      "Content repository branch is not configured"
    );
  }

  const baseUrl =
    `https://github.com/` +
    `${CONTENT_REPO_OWNER}/` +
    `${normalizedRepoName}/tree/` +
    `${CONTENT_REPO_BRANCH}`;

  return resolvedPath
    ? `${baseUrl}/${resolvedPath}`
    : baseUrl;
};

/* ============================================================
   DISPLAY NAME
============================================================ */

export const getContentRepoDisplayName =
  () =>
    [
      CONTENT_REPO_OWNER,
      CONTENT_REPO_NAME,
      CONTENT_REPO_BASE_PATH,
    ]
      .filter(Boolean)
      .join("/");

/* ============================================================
   PARSE CONTENT REPOSITORY PATH FROM URL
============================================================ */

export const parseContentRepoPathFromUrl = (
  urlString: string
) => {
  try {
    const url =
      new URL(urlString);

    const parts =
      splitUrlPath(
        url.pathname
      );

    const repoNameCandidates =
      new Set(
        getContentRepoNameCandidates()
      );

    /*
     * --------------------------------------------------------
     * RAW GITHUB URL
     *
     * https://raw.githubusercontent.com/
     * OWNER/REPOSITORY/BRANCH/PATH
     * --------------------------------------------------------
     */
    if (
      url.hostname ===
        "raw.githubusercontent.com" &&
      parts[0] ===
        CONTENT_REPO_OWNER &&
      repoNameCandidates.has(
        parts[1]
      ) &&
      parts[2] ===
        CONTENT_REPO_BRANCH
    ) {
      return stripContentRepoBasePath(
        parts
          .slice(3)
          .join("/")
      );
    }

    /*
     * --------------------------------------------------------
     * GITHUB BLOB URL
     *
     * https://github.com/
     * OWNER/REPOSITORY/blob/BRANCH/PATH
     * --------------------------------------------------------
     */
    if (
      url.hostname ===
        "github.com" &&
      parts[0] ===
        CONTENT_REPO_OWNER &&
      repoNameCandidates.has(
        parts[1]
      ) &&
      parts[2] === "blob" &&
      parts[3] ===
        CONTENT_REPO_BRANCH
    ) {
      return stripContentRepoBasePath(
        parts
          .slice(4)
          .join("/")
      );
    }
  } catch {
    return null;
  }

  return null;
};
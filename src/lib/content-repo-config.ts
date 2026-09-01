/*
 * ============================================================
 * CONTENT REPOSITORY CONFIGURATION
 * ============================================================
 *
 * This file provides one common interface for accessing the
 * content repository used by the SkillWave universal shell.
 *
 * IMPORTANT:
 *
 * The shell itself must not contain company-specific
 * application configuration.
 *
 * The repository connection is supplied through environment
 * variables.
 *
 * The connected repository then provides:
 *
 *   skillwave.config.yaml
 *
 * which contains:
 *
 *   company
 *   content
 *   design
 *
 * Example:
 *
 *   CONTENT_REPO_OWNER=Akhila232004
 *   CONTENT_REPO_NAME=tinitiateai-skillwave
 *   CONTENT_REPO_BRANCH=main
 *
 * For another company, only the repository connection needs
 * to change.
 */

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const trimSlashes = (
  value: string
) =>
  String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

const splitUrlPath = (
  value: string
) =>
  trimSlashes(
    String(value || "")
      .split(/[?#]/)[0]
  )
    .split("/")
    .filter(Boolean);

const normalizeRepoName = (
  value: string
) => {
  const normalized =
    trimSlashes(value);

  if (!normalized) {
    return "";
  }

  const parts =
    normalized
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

/*
 * ============================================================
 * REPOSITORY SETTINGS
 * ============================================================
 *
 * These values identify the repository containing the
 * company's SkillWave content.
 *
 * They are deployment-level settings.
 *
 * They are NOT company branding configuration.
 *
 * Priority:
 *
 *   1. NEXT_PUBLIC_CONTENT_REPO_OWNER
 *   2. CONTENT_REPO_OWNER
 *
 * The NEXT_PUBLIC variants are retained for compatibility
 * with existing frontend code.
 *
 * No fallback to skillwave.config.ts is used anymore.
 */

export const CONTENT_REPO_OWNER =
  (
    process.env.NEXT_PUBLIC_CONTENT_REPO_OWNER ||
    process.env.CONTENT_REPO_OWNER ||
    ""
  ).trim();

/*
 * Repository name.
 */

export const CONTENT_REPO_NAME =
  normalizeRepoName(
    process.env.NEXT_PUBLIC_CONTENT_REPO_NAME ||
      process.env.CONTENT_REPO_NAME ||
      ""
  );

/*
 * Repository branch.
 */

export const CONTENT_REPO_BRANCH =
  (
    process.env.NEXT_PUBLIC_CONTENT_REPO_BRANCH ||
    process.env.CONTENT_REPO_BRANCH ||
    "main"
  ).trim();

/*
 * ============================================================
 * OPTIONAL BASE PATH
 * ============================================================
 *
 * This allows a company repository to keep SkillWave content
 * inside a subdirectory.
 *
 * Example:
 *
 *   repository/
 *     learning-content/
 *       courses/
 *
 * Then:
 *
 *   CONTENT_REPO_BASE_PATH=learning-content
 */

export const CONTENT_REPO_BASE_PATH =
  trimSlashes(
    process.env.NEXT_PUBLIC_CONTENT_REPO_BASE_PATH ||
      process.env.CONTENT_REPO_BASE_PATH ||
      ""
  );

/*
 * ============================================================
 * CONFIGURATION VALIDATION
 * ============================================================
 */

export const hasContentRepositoryConfiguration =
  Boolean(
    CONTENT_REPO_OWNER &&
      CONTENT_REPO_NAME &&
      CONTENT_REPO_BRANCH
  );

export const assertContentRepositoryConfiguration =
  () => {
    if (!CONTENT_REPO_OWNER) {
      throw new Error(
        "Content repository owner is not configured. " +
          "Set CONTENT_REPO_OWNER in .env.local."
      );
    }

    if (!CONTENT_REPO_NAME) {
      throw new Error(
        "Content repository name is not configured. " +
          "Set CONTENT_REPO_NAME in .env.local."
      );
    }

    if (!CONTENT_REPO_BRANCH) {
      throw new Error(
        "Content repository branch is not configured. " +
          "Set CONTENT_REPO_BRANCH in .env.local."
      );
    }
  };

/*
 * ============================================================
 * PATH NORMALIZATION
 * ============================================================
 */

export const normalizeContentRepoPath = (
  filePath: string
) =>
  trimSlashes(filePath);

export const stripContentRepoBasePath = (
  filePath: string
) => {
  const normalized =
    normalizeContentRepoPath(
      filePath
    );

  if (
    !CONTENT_REPO_BASE_PATH
  ) {
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

/*
 * ============================================================
 * PATH CANDIDATES
 * ============================================================
 */

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
    ...new Set(
      candidates
    ),
  ];
};

/*
 * ============================================================
 * REPOSITORY NAME CANDIDATES
 * ============================================================
 */

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

/*
 * ============================================================
 * RAW GITHUB URL
 * ============================================================
 */

export const buildContentRepoRawUrl = (
  filePath: string,
  repoName = CONTENT_REPO_NAME,
  repoRef = CONTENT_REPO_BRANCH
) => {
  const normalizedRepoName =
    normalizeRepoName(
      repoName
    );

  assertContentRepositoryConfiguration();

  if (
    !normalizedRepoName
  ) {
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
    `${encodeURIComponent(repoRef)}/` +
    `${resolvedPath}`
  );
};

/*
 * ============================================================
 * GITHUB BLOB URL
 * ============================================================
 */

export const buildContentRepoBlobUrl = (
  filePath: string,
  repoName = CONTENT_REPO_NAME
) => {
  const normalizedRepoName =
    normalizeRepoName(
      repoName
    );

  const resolvedPath =
    resolveContentRepoPath(
      filePath
    );

  assertContentRepositoryConfiguration();

  if (
    !normalizedRepoName
  ) {
    throw new Error(
      "Content repository name is not configured"
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

/*
 * ============================================================
 * GITHUB TREE URL
 * ============================================================
 */

export const buildContentRepoTreeUrl = (
  folderPath = "",
  repoName = CONTENT_REPO_NAME
) => {
  const normalizedRepoName =
    normalizeRepoName(
      repoName
    );

  const resolvedPath =
    resolveContentRepoPath(
      folderPath
    );

  assertContentRepositoryConfiguration();

  if (
    !normalizedRepoName
  ) {
    throw new Error(
      "Content repository name is not configured"
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

/*
 * ============================================================
 * DISPLAY NAME
 * ============================================================
 */

export const getContentRepoDisplayName =
  () =>
    [
      CONTENT_REPO_OWNER,
      CONTENT_REPO_NAME,
      CONTENT_REPO_BASE_PATH,
    ]
      .filter(Boolean)
      .join("/");

/*
 * ============================================================
 * PARSE CONTENT REPOSITORY PATH FROM URL
 * ============================================================
 */

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
      parts[2] ===
        "blob" &&
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
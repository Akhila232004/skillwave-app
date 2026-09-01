import type { ContentRepoStatus } from "./content-types";

import {
  CONTENT_REPO_BRANCH,
  CONTENT_REPO_NAME,
  CONTENT_REPO_OWNER,
  buildContentRepoRawUrl,
  getContentRepoDisplayName,
  getContentRepoNameCandidates,
  normalizeContentRepoPath,
  resolveContentRepoPath,
} from "./content-repo-config";

export type RepoContentSource = {
  repoName: string;
  text: string;
  url: string;
};

export type RepoDirectoryEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
  downloadUrl?: string;
};

type GitHubContentEntry = {
  name?: string;
  path?: string;
  type?: string;
  download_url?: string | null;
  downloadUrl?: string | null;
};

/*
 * ============================================================
 * GITHUB CONFIGURATION
 * ============================================================
 *
 * GITHUB_TOKEN is intentionally read only on the server.
 *
 * Do NOT use NEXT_PUBLIC_GITHUB_TOKEN.
 *
 * The token should exist in .env.local:
 *
 *   GITHUB_TOKEN=github_pat_...
 *
 * It should never be committed to Git.
 */

const githubToken =
  process.env.GITHUB_TOKEN?.trim() || "";

/*
 * ============================================================
 * GITHUB API HEADERS
 * ============================================================
 */

const githubHeaders: HeadersInit = {
  "User-Agent": "SkillWave-App",
  Accept: "application/vnd.github+json",

  ...(githubToken
    ? {
        Authorization: `Bearer ${githubToken}`,
      }
    : {}),
};

/*
 * ============================================================
 * DIRECTORY CACHE
 * ============================================================
 *
 * GitHub directory discovery uses the REST Contents API.
 *
 * Without caching, repeated requests can quickly consume
 * the GitHub API rate limit.
 *
 * Cache duration:
 *
 *   5 minutes
 *
 * There is also an in-flight request cache so multiple
 * simultaneous requests for the same directory reuse
 * one GitHub request.
 */

const DIRECTORY_CACHE_TTL_MS =
  5 * 60 * 1000;

type DirectoryCacheEntry = {
  expiresAt: number;
  entries: GitHubContentEntry[];
};

const directoryCache =
  new Map<string, DirectoryCacheEntry>();

const directoryInFlight =
  new Map<
    string,
    Promise<GitHubContentEntry[]>
  >();

/*
 * ============================================================
 * REPOSITORY CONFIGURATION CACHE
 * ============================================================
 *
 * The company repository contains:
 *
 *   skillwave.config.yaml
 *
 * This file describes:
 *
 *   company
 *   content
 *   design
 *
 * The universal shell reads that configuration instead of
 * storing company-specific branding information inside the
 * shell application.
 *
 * The configuration is cached for the same reason as directory
 * listings: we do not want every page request to call GitHub.
 */

const REPOSITORY_CONFIG_PATH =
  "skillwave.config.yaml";

const REPOSITORY_CONFIG_CACHE_TTL_MS =
  5 * 60 * 1000;

type RepositoryConfigCacheEntry = {
  expiresAt: number;
  config: SkillWaveRepositoryConfig;
};

const repositoryConfigCache =
  new Map<
    string,
    RepositoryConfigCacheEntry
  >();

const repositoryConfigInFlight =
  new Map<
    string,
    Promise<SkillWaveRepositoryConfig>
  >();

/*
 * ============================================================
 * REPOSITORY CONFIGURATION TYPES
 * ============================================================
 *
 * These types describe the configuration contract supplied by
 * a company content repository.
 */

export type SkillWaveRepositoryBranding = {
  logo?: string;
  logoLight?: string;
  logoMark?: string;
};

export type SkillWaveRepositorySocial = {
  linkedin?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
};

export type SkillWaveRepositoryCompany = {
  name?: string;
  legalName?: string;
  shortName?: string;
  description?: string;
  website?: string;
  contactEmail?: string;

  branding?: SkillWaveRepositoryBranding;

  social?: SkillWaveRepositorySocial;
};

export type SkillWaveRepositoryContentItem = {
  enabled?: boolean;
  path?: string;
};

export type SkillWaveRepositoryContent = {
  interview?: SkillWaveRepositoryContentItem;
  courses?: SkillWaveRepositoryContentItem;
  slideshow?: SkillWaveRepositoryContentItem;
  videos?: SkillWaveRepositoryContentItem;
  audio?: SkillWaveRepositoryContentItem;
  cbt?: SkillWaveRepositoryContentItem;
  dashboard?: SkillWaveRepositoryContentItem;
  ticker?: SkillWaveRepositoryContentItem;

  [key: string]:
    | SkillWaveRepositoryContentItem
    | undefined;
};

export type SkillWaveRepositoryDesign = {
  enabled?: boolean;
  colour?: string;
  icons?: string;
};

export type SkillWaveRepositoryConfig = {
  name?: string;
  version?: number;

  company?: SkillWaveRepositoryCompany;

  content?: SkillWaveRepositoryContent;

  design?: SkillWaveRepositoryDesign;
};

/*
 * ============================================================
 * BASIC YAML PARSER
 * ============================================================
 *
 * The repository configuration is intentionally simple YAML.
 *
 * We parse the configuration here without introducing a new
 * runtime dependency.
 *
 * Supported structure:
 *
 *   key: value
 *
 *   parent:
 *     child: value
 *
 *   parent:
 *     child:
 *       grandChild: value
 *
 * Arrays are not required by the current SkillWave
 * configuration contract.
 */

const stripYamlComment = (
  value: string
): string => {
  let insideSingleQuote = false;
  let insideDoubleQuote = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (
      character === "'" &&
      !insideDoubleQuote
    ) {
      insideSingleQuote =
        !insideSingleQuote;
      continue;
    }

    if (
      character === '"' &&
      !insideSingleQuote
    ) {
      insideDoubleQuote =
        !insideDoubleQuote;
      continue;
    }

    if (
      character === "#" &&
      !insideSingleQuote &&
      !insideDoubleQuote
    ) {
      return value
        .slice(0, index)
        .trimEnd();
    }
  }

  return value.trimEnd();
};

const parseYamlScalar = (
  rawValue: string
): unknown => {
  const value =
    stripYamlComment(rawValue).trim();

  if (!value) {
    return {};
  }

  if (
    value.startsWith('"') &&
    value.endsWith('"')
  ) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }

  if (
    value.startsWith("'") &&
    value.endsWith("'")
  ) {
    return value.slice(1, -1);
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (
    value === "null" ||
    value === "~"
  ) {
    return null;
  }

  if (
    /^-?\d+$/.test(value)
  ) {
    return Number(value);
  }

  if (
    /^-?\d+\.\d+$/.test(value)
  ) {
    return Number(value);
  }

  return value;
};

const parseSimpleYaml = (
  text: string
): SkillWaveRepositoryConfig => {
  const root: Record<
    string,
    unknown
  > = {};

  const stack: Array<{
    indent: number;
    object: Record<string, unknown>;
  }> = [
    {
      indent: -1,
      object: root,
    },
  ];

  const lines =
    text.replace(/\r\n/g, "\n")
      .split("\n");

  for (
    let lineNumber = 0;
    lineNumber < lines.length;
    lineNumber += 1
  ) {
    const originalLine =
      lines[lineNumber];

    if (!originalLine.trim()) {
      continue;
    }

    if (
      originalLine.trimStart().startsWith("#")
    ) {
      continue;
    }

    const leadingWhitespace =
      originalLine.match(/^\s*/)?.[0]
        .length || 0;

    const content =
      stripYamlComment(
        originalLine.trim()
      );

    if (!content) {
      continue;
    }

    if (content.startsWith("- ")) {
      throw new Error(
        `Unsupported YAML array at line ${
          lineNumber + 1
        }.`
      );
    }

    const separatorIndex =
      content.indexOf(":");

    if (separatorIndex <= 0) {
      throw new Error(
        `Invalid YAML configuration at line ${
          lineNumber + 1
        }: ${originalLine}`
      );
    }

    const key =
      content
        .slice(0, separatorIndex)
        .trim();

    const rawValue =
      content
        .slice(separatorIndex + 1)
        .trim();

    while (
      stack.length > 1 &&
      leadingWhitespace <=
        stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    const current =
      stack[stack.length - 1].object;

    if (!rawValue) {
      const child: Record<
        string,
        unknown
      > = {};

      current[key] = child;

      stack.push({
        indent: leadingWhitespace,
        object: child,
      });

      continue;
    }

    current[key] =
      parseYamlScalar(rawValue);
  }

  return root as SkillWaveRepositoryConfig;
};

/*
 * ============================================================
 * GITHUB TEXT FETCH
 * ============================================================
 */

const fetchGitHubText = async (
  url: string
): Promise<string> => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: githubHeaders,
  });

  const text =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status}): ${text}`
    );
  }

  return text;
};

/*
 * ============================================================
 * REPOSITORY CONFIGURATION
 * ============================================================
 *
 * Read skillwave.config.yaml from the configured company
 * repository.
 */

const getRepositoryConfigCacheKey = (
  repoName: string,
  repoRef: string
) =>
  [
    CONTENT_REPO_OWNER,
    repoName,
    repoRef,
    REPOSITORY_CONFIG_PATH,
  ].join(":");

const fetchRepositoryConfigUncached =
  async (
    repoName: string,
    repoRef: string
  ): Promise<SkillWaveRepositoryConfig> => {
    const rawUrl =
      buildContentRepoRawUrl(
        REPOSITORY_CONFIG_PATH,
        repoName,
        repoRef
      );

    console.log(
      "SKILLWAVE REPOSITORY CONFIG:",
      rawUrl
    );

    const text =
      await fetchGitHubText(rawUrl);

    const config =
      parseSimpleYaml(text);

    return config;
  };

export async function readRepositoryConfig(
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<SkillWaveRepositoryConfig> {
  const repoName =
    getContentRepoNameCandidates(
      preferredRepoName
    )[0] ||
    CONTENT_REPO_NAME;

  const cacheKey =
    getRepositoryConfigCacheKey(
      repoName,
      repoRef
    );

  const now = Date.now();

  const cached =
    repositoryConfigCache.get(
      cacheKey
    );

  if (
    cached &&
    cached.expiresAt > now
  ) {
    console.log(
      "SKILLWAVE REPOSITORY CONFIG CACHE HIT"
    );

    return cached.config;
  }

  if (cached) {
    repositoryConfigCache.delete(
      cacheKey
    );
  }

  const existingRequest =
    repositoryConfigInFlight.get(
      cacheKey
    );

  if (existingRequest) {
    console.log(
      "SKILLWAVE REPOSITORY CONFIG REQUEST REUSED"
    );

    return existingRequest;
  }

  const request =
    fetchRepositoryConfigUncached(
      repoName,
      repoRef
    )
      .then((config) => {
        repositoryConfigCache.set(
          cacheKey,
          {
            config,
            expiresAt:
              Date.now() +
              REPOSITORY_CONFIG_CACHE_TTL_MS,
          }
        );

        return config;
      })
      .finally(() => {
        repositoryConfigInFlight.delete(
          cacheKey
        );
      });

  repositoryConfigInFlight.set(
    cacheKey,
    request
  );

  return request;
}

/*
 * ============================================================
 * REPOSITORY BRANDING URL
 * ============================================================
 *
 * The company repository owns its branding files.
 *
 * Example:
 *
 *   branding/logo.png
 *
 * becomes:
 *
 *   https://raw.githubusercontent.com/
 *   Akhila232004/tinitiateai-skillwave/
 *   main/branding/logo.png
 */

export function buildRepositoryAssetUrl(
  assetPath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): string {
  const normalizedPath =
    normalizeContentRepoPath(
      assetPath
    );

  if (!normalizedPath) {
    throw new Error(
      "Repository asset path is empty"
    );
  }

  const repoName =
    getContentRepoNameCandidates(
      preferredRepoName
    )[0] ||
    CONTENT_REPO_NAME;

  return buildContentRepoRawUrl(
    normalizedPath,
    repoName,
    repoRef
  );
}

/*
 * ============================================================
 * REPOSITORY CONTENT
 * ============================================================
 *
 * Reads an individual file from the configured content
 * repository.
 */

export async function readRepoContentSource(
  repoFilePath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<RepoContentSource> {
  const normalizedPath =
    normalizeContentRepoPath(
      repoFilePath
    );

  if (!normalizedPath) {
    throw new Error(
      "Content file path is empty"
    );
  }

  const repoName =
    getContentRepoNameCandidates(
      preferredRepoName
    )[0] ||
    CONTENT_REPO_NAME;

  const resolvedPath =
    resolveContentRepoPath(
      normalizedPath
    );

  const rawUrl =
    buildContentRepoRawUrl(
      resolvedPath,
      repoName,
      repoRef
    );

  console.log(
    "SKILLWAVE CONTENT REPO:",
    `${CONTENT_REPO_OWNER}/${repoName}`
  );

  console.log(
    "SKILLWAVE RAW CONTENT URL:",
    rawUrl
  );

  const text =
    await fetchGitHubText(
      rawUrl
    );

  return {
    repoName:
      `${CONTENT_REPO_OWNER}/${repoName}`,
    text,
    url: rawUrl,
  };
}

/*
 * ============================================================
 * READ TEXT ONLY
 * ============================================================
 */

export async function readRepoContentText(
  repoFilePath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
) {
  const source =
    await readRepoContentSource(
      repoFilePath,
      preferredRepoName,
      repoRef
    );

  return source.text;
}

/*
 * ============================================================
 * GITHUB DIRECTORY LISTING
 * ============================================================
 *
 * raw.githubusercontent.com can serve individual files, but
 * it cannot list directory contents.
 *
 * Directory discovery therefore uses GitHub's Contents API.
 *
 * This allows any company to have different filenames inside
 * its configured content directories.
 */

const buildGitHubContentsApiUrl = (
  repoFolderPath: string,
  repoName: string,
  repoRef: string
) => {
  const normalizedPath =
    normalizeContentRepoPath(
      repoFolderPath
    );

  const resolvedPath =
    resolveContentRepoPath(
      normalizedPath
    );

  const encodedOwner =
    encodeURIComponent(
      CONTENT_REPO_OWNER
    );

  const encodedRepo =
    encodeURIComponent(
      repoName
    );

  const baseUrl =
    `https://api.github.com/repos/` +
    `${encodedOwner}/` +
    `${encodedRepo}/contents`;

  const encodedPath =
    resolvedPath
      .split("/")
      .filter(Boolean)
      .map((part) =>
        encodeURIComponent(part)
      )
      .join("/");

  const url =
    encodedPath
      ? `${baseUrl}/${encodedPath}`
      : baseUrl;

  const params =
    new URLSearchParams({
      ref: repoRef,
    });

  return `${url}?${params.toString()}`;
};

/*
 * ============================================================
 * DIRECTORY CACHE KEY
 * ============================================================
 */

const buildDirectoryCacheKey = (
  repoFolderPath: string,
  repoName: string,
  repoRef: string
) =>
  [
    CONTENT_REPO_OWNER,
    repoName,
    repoRef,
    normalizeContentRepoPath(
      repoFolderPath
    ),
  ].join(":");

/*
 * ============================================================
 * GITHUB DIRECTORY FETCH
 * ============================================================
 */

const fetchGitHubDirectoryUncached =
  async (
    repoFolderPath: string,
    repoName: string,
    repoRef: string
  ): Promise<
    GitHubContentEntry[]
  > => {
    const url =
      buildGitHubContentsApiUrl(
        repoFolderPath,
        repoName,
        repoRef
      );

    console.log(
      "SKILLWAVE GITHUB DIRECTORY:",
      url
    );

    const response =
      await fetch(url, {
        cache: "no-store",
        headers:
          githubHeaders,
      });

    const text =
      await response.text();

    if (!response.ok) {
      if (
        response.status ===
          401 ||
        response.status ===
          403
      ) {
        const rateLimitRemaining =
          response.headers.get(
            "x-ratelimit-remaining"
          );

        const rateLimitReset =
          response.headers.get(
            "x-ratelimit-reset"
          );

        let message =
          `GitHub directory request failed (${response.status}).`;

        if (
          response.status ===
          401
        ) {
          message +=
            " GitHub authentication failed. Check GITHUB_TOKEN in .env.local.";
        }

        if (
          response.status ===
          403
        ) {
          message +=
            " GitHub denied the request or the API rate limit was exceeded.";

          if (
            rateLimitRemaining ===
            "0"
          ) {
            message +=
              " The GitHub API rate limit is exhausted.";
          }

          if (
            rateLimitReset
          ) {
            const resetDate =
              new Date(
                Number(
                  rateLimitReset
                ) * 1000
              );

            if (
              !Number.isNaN(
                resetDate.getTime()
              )
            ) {
              message +=
                ` Rate-limit reset: ${resetDate.toISOString()}.`;
            }
          }

          if (
            !githubToken
          ) {
            message +=
              " No GITHUB_TOKEN is configured.";
          }
        }

        message +=
          ` Response: ${text}`;

        throw new Error(
          message
        );
      }

      throw new Error(
        `GitHub directory request failed (${response.status}): ${text}`
      );
    }

    let parsed: unknown;

    try {
      parsed =
        JSON.parse(text);
    } catch {
      throw new Error(
        "GitHub directory response was not valid JSON"
      );
    }

    if (
      !Array.isArray(parsed)
    ) {
      throw new Error(
        "GitHub directory response did not contain a directory listing"
      );
    }

    return parsed as GitHubContentEntry[];
  };

/*
 * ============================================================
 * CACHED GITHUB DIRECTORY FETCH
 * ============================================================
 */

const fetchGitHubDirectory =
  async (
    repoFolderPath: string,
    repoName: string,
    repoRef: string
  ): Promise<
    GitHubContentEntry[]
  > => {
    const cacheKey =
      buildDirectoryCacheKey(
        repoFolderPath,
        repoName,
        repoRef
      );

    const now =
      Date.now();

    const cached =
      directoryCache.get(
        cacheKey
      );

    if (
      cached &&
      cached.expiresAt > now
    ) {
      console.log(
        "SKILLWAVE GITHUB DIRECTORY CACHE HIT:",
        normalizeContentRepoPath(
          repoFolderPath
        )
      );

      return cached.entries;
    }

    if (cached) {
      directoryCache.delete(
        cacheKey
      );
    }

    const existingRequest =
      directoryInFlight.get(
        cacheKey
      );

    if (
      existingRequest
    ) {
      console.log(
        "SKILLWAVE GITHUB DIRECTORY REQUEST REUSED:",
        normalizeContentRepoPath(
          repoFolderPath
        )
      );

      return existingRequest;
    }

    const request =
      fetchGitHubDirectoryUncached(
        repoFolderPath,
        repoName,
        repoRef
      )
        .then(
          (entries) => {
            directoryCache.set(
              cacheKey,
              {
                entries,
                expiresAt:
                  Date.now() +
                  DIRECTORY_CACHE_TTL_MS,
              }
            );

            return entries;
          }
        )
        .finally(
          () => {
            directoryInFlight.delete(
              cacheKey
            );
          }
        );

    directoryInFlight.set(
      cacheKey,
      request
    );

    return request;
  };

/*
 * ============================================================
 * REPOSITORY DIRECTORY
 * ============================================================
 */

export async function readRepoDirectory(
  repoFolderPath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<{
  repoName: string;
  entries: RepoDirectoryEntry[];
}> {
  const normalizedPath =
    normalizeContentRepoPath(
      repoFolderPath
    );

  if (!normalizedPath) {
    throw new Error(
      "Content directory path is empty"
    );
  }

  const repoName =
    getContentRepoNameCandidates(
      preferredRepoName
    )[0] ||
    CONTENT_REPO_NAME;

  const githubEntries =
    await fetchGitHubDirectory(
      normalizedPath,
      repoName,
      repoRef
    );

  const entries:
    RepoDirectoryEntry[] =
    githubEntries
      .filter(
        (entry) =>
          typeof entry.name ===
            "string" &&
          typeof entry.path ===
            "string"
      )
      .map((entry) => {
        const type =
          entry.type ===
          "dir"
            ? "dir"
            : "file";

        return {
          name:
            entry.name as string,

          path:
            entry.path as string,

          type,

          downloadUrl:
            entry.download_url ||
            entry.downloadUrl ||
            undefined,
        };
      });

  return {
    repoName:
      `${CONTENT_REPO_OWNER}/${repoName}`,

    entries,
  };
}

/*
 * ============================================================
 * CONTENT REPOSITORY STATUS
 * ============================================================
 */

export async function readContentRepoStatus(): Promise<ContentRepoStatus> {
  return {
    repoName:
      `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,

    branch:
      CONTENT_REPO_BRANCH,

    source:
      getContentRepoDisplayName(),

    updatedAt:
      null,

    commitSha:
      null,
  };
}

/*
 * ============================================================
 * CONTENT REPOSITORY REACHABILITY
 * ============================================================
 *
 * We test the configured interview directory when interview
 * content is enabled.
 *
 * Otherwise we test courses.
 *
 * Finally, if neither is configured, we test the repository
 * root.
 *
 * The directory result is cached.
 */

export async function checkContentRepoReachability() {
  try {
    const config =
      await readRepositoryConfig();

    const interviewPath =
      config.content
        ?.interview
        ?.path;

    if (
      config.content
        ?.interview
        ?.enabled !== false &&
      interviewPath
    ) {
      await fetchGitHubDirectory(
        interviewPath,
        CONTENT_REPO_NAME,
        CONTENT_REPO_BRANCH
      );

      return true;
    }

    const coursesPath =
      config.content
        ?.courses
        ?.path;

    if (
      config.content
        ?.courses
        ?.enabled !== false &&
      coursesPath
    ) {
      await fetchGitHubDirectory(
        coursesPath,
        CONTENT_REPO_NAME,
        CONTENT_REPO_BRANCH
      );

      return true;
    }

    await fetchGitHubDirectory(
      "",
      CONTENT_REPO_NAME,
      CONTENT_REPO_BRANCH
    );

    return true;
  } catch (error) {
    console.error(
      "SKILLWAVE CONTENT REPOSITORY REACHABILITY CHECK FAILED:",
      error
    );

    return false;
  }
}

/*
 * ============================================================
 * LOCAL CONTENT PATH
 * ============================================================
 *
 * Keep this helper for existing callers that need the resolved
 * path inside the configured repository.
 */

export const resolveLocalContentPath = (
  filePath: string
) =>
  resolveContentRepoPath(
    filePath
  );
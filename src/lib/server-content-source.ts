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

import { skillwaveConfig } from "../config/skillwave.config";

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
 * GitHub API headers.
 *
 * The Authorization header is included only when a token
 * exists. This keeps the application functional for public
 * repositories even when authentication is not configured.
 */
const githubHeaders: HeadersInit = {
  "User-Agent": "SkillWave-App",
  Accept: "application/vnd.github+json",

  ...(githubToken
    ? {
        Authorization:
          `Bearer ${githubToken}`,
      }
    : {}),
};

/*
 * ============================================================
 * DIRECTORY CACHE
 * ============================================================
 *
 * Directory discovery uses GitHub's REST Contents API.
 *
 * Without caching, every request to the interview page can
 * cause another GitHub API request.
 *
 * This cache prevents repeated requests for the same:
 *
 *   repository + branch + directory
 *
 * combination.
 *
 * Cache duration:
 *
 *   5 minutes
 *
 * There is also an in-flight request cache. If several parts
 * of the application ask for the same directory at the same
 * time, only one GitHub request is made.
 */

const DIRECTORY_CACHE_TTL_MS =
  5 * 60 * 1000;

type DirectoryCacheEntry = {
  expiresAt: number;
  entries: GitHubContentEntry[];
};

const directoryCache =
  new Map<
    string,
    DirectoryCacheEntry
  >();

const directoryInFlight =
  new Map<
    string,
    Promise<GitHubContentEntry[]>
  >();

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
 * REPOSITORY CONTENT
 * ============================================================
 *
 * Reads an individual file from the configured content
 * repository.
 *
 * The repository is determined by:
 *
 *   src/config/skillwave.config.ts
 *
 * or environment-variable overrides handled by
 * content-repo-config.ts.
 *
 * There are no company-specific repository names here.
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
 * raw.githubusercontent.com can serve individual files,
 * but it cannot list directory contents.
 *
 * Therefore directory discovery uses the GitHub Contents API.
 *
 * This makes the shell universal because the shell does not
 * need to know the names of individual interview files.
 *
 * Example:
 *
 *   interview/
 *     java.md
 *     python.md
 *     aws.md
 *
 * or another company's repository:
 *
 *   interview/
 *     frontend.md
 *     backend.md
 *     devops.md
 *
 * Both structures work automatically.
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
      !Array.isArray(
        parsed
      )
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
 *
 * This wrapper provides:
 *
 *   1. normal cache hits
 *   2. in-flight request deduplication
 *   3. automatic expiration
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
 *
 * This function is completely generic.
 *
 * It discovers files from whatever directory is supplied by
 * the caller.
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
 * The previous implementation tested a hardcoded file such as:
 *
 *   interview/ai.md
 *
 * That made the shell dependent on a Tinitiate-specific file.
 *
 * We now test the configured directory instead.
 *
 * The directory result is cached, so repeated connectivity
 * checks will not continuously consume GitHub API requests.
 */

export async function checkContentRepoReachability() {
  try {
    const interviewPath =
      skillwaveConfig
        .contentPaths
        .interview;

    /*
     * If interview is enabled, test the configured interview
     * directory.
     */
    if (
      skillwaveConfig
        .features
        .interview &&
      interviewPath
    ) {
      await fetchGitHubDirectory(
        interviewPath,
        CONTENT_REPO_NAME,
        CONTENT_REPO_BRANCH
      );

      return true;
    }

    /*
     * If interviews are disabled, test the configured courses
     * directory instead.
     */
    const coursesPath =
      skillwaveConfig
        .contentPaths
        .courses;

    if (
      skillwaveConfig
        .features
        .courses &&
      coursesPath
    ) {
      await fetchGitHubDirectory(
        coursesPath,
        CONTENT_REPO_NAME,
        CONTENT_REPO_BRANCH
      );

      return true;
    }

    /*
     * If neither feature has a configured directory, test the
     * repository root.
     */
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
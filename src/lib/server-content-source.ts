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

const githubHeaders = {
  "User-Agent": "SkillWave-App",
  Accept: "application/vnd.github+json",
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

  const text = await response.text();

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
};

/*
 * ============================================================
 * GITHUB DIRECTORY LISTING
 * ============================================================
 *
 * raw.githubusercontent.com can serve individual files,
 * but it cannot list directory contents.
 *
 * Therefore, directory discovery uses the GitHub Contents API.
 *
 * This is what makes the shell universal.
 *
 * The shell no longer assumes that a company has files such as:
 *
 *   interview/java.md
 *   interview/python.md
 *   interview/ai.md
 *
 * Instead, it asks GitHub what actually exists in the
 * configured directory.
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
 * GITHUB DIRECTORY FETCH
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

    if (!Array.isArray(parsed)) {
      throw new Error(
        "GitHub directory response did not contain a directory listing"
      );
    }

    return parsed as GitHubContentEntry[];
  };

/*
 * ============================================================
 * REPOSITORY DIRECTORY
 * ============================================================
 *
 * This function is now completely generic.
 *
 * Example:
 *
 * If config says:
 *
 *   contentPaths.interview = "interview"
 *
 * and the repository contains:
 *
 *   interview/
 *     frontend.md
 *     backend.md
 *     devops.md
 *
 * those files are automatically discovered.
 *
 * Another company can have a completely different structure
 * inside its configured interview directory.
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

  const entries: RepoDirectoryEntry[] =
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

    updatedAt: null,

    commitSha: null,
  };
}

/*
 * ============================================================
 * CONTENT REPOSITORY REACHABILITY
 * ============================================================
 *
 * IMPORTANT:
 *
 * The previous implementation tested:
 *
 *   interview/ai.md
 *
 * That made the shell dependent on a Tinitiate-specific file.
 *
 * We now test the repository itself using the GitHub Contents
 * API and the configured content paths.
 */

export async function checkContentRepoReachability() {
  try {
    const interviewPath =
      skillwaveConfig
        .contentPaths
        .interview;

    /*
     * If the interview feature is enabled, test the configured
     * interview directory.
     */
    if (
      skillwaveConfig.features
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
      skillwaveConfig.features
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
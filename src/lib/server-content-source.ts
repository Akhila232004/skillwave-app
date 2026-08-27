import type { ContentRepoStatus } from "./content-types";

import {
  CONTENT_REPO_BRANCH,
  CONTENT_REPO_NAME,
  CONTENT_REPO_OWNER,
  buildContentRepoRawUrl,
  getContentRepoDisplayName,
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

const githubHeaders = {
  "User-Agent": "SkillWave-App",
};

const fetchGitHubText = async (url: string): Promise<string> => {
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

export async function readRepoContentSource(
  repoFilePath: string,
  _preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<RepoContentSource> {
  const normalizedPath = normalizeContentRepoPath(repoFilePath);

  if (!normalizedPath) {
    throw new Error("Content file path is empty");
  }

  const resolvedPath = resolveContentRepoPath(normalizedPath);

  const rawUrl = buildContentRepoRawUrl(
    resolvedPath,
    CONTENT_REPO_NAME,
    repoRef
  );

  console.log(
    "SKILLWAVE RAW CONTENT URL:",
    rawUrl
  );

  const text = await fetchGitHubText(rawUrl);

  return {
    repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,
    text,
    url: rawUrl,
  };
}

export async function readRepoContentText(
  repoFilePath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
) {
  const source = await readRepoContentSource(
    repoFilePath,
    preferredRepoName,
    repoRef
  );

  return source.text;
}

/*
 * GitHub's raw.githubusercontent.com endpoint serves individual files,
 * but it does not provide directory listings.
 *
 * For now, the content repository uses known content directories/files.
 * Interview content is loaded from the known files in the repository.
 */

const KNOWN_INTERVIEW_FILES = [
  "interview/ai.md",
  "interview/interview-aws-points.md",
  "interview/java.md",
  "interview/python.md",
  "interview/system-design.md",
];

export async function readRepoDirectory(
  repoFolderPath: string,
  _preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<{
  repoName: string;
  entries: RepoDirectoryEntry[];
}> {
  const normalizedPath = normalizeContentRepoPath(repoFolderPath);

  if (!normalizedPath) {
    throw new Error("Content directory path is empty");
  }

  /*
   * The interview loader currently needs a directory listing.
   * Raw GitHub does not provide one, so we maintain the known
   * interview markdown files here.
   *
   * Other repository directories can be migrated in the same
   * way when their content is moved to tinitiateai-skillwave.
   */
  if (normalizedPath === "interview") {
    return {
      repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,
      entries: KNOWN_INTERVIEW_FILES.map((filePath) => {
        const name = filePath.split("/").pop() || filePath;

        return {
          name,
          path: filePath,
          type: "file" as const,
          downloadUrl: buildContentRepoRawUrl(
            filePath,
            CONTENT_REPO_NAME,
            repoRef
          ),
        };
      }),
    };
  }

  throw new Error(
    `Directory listing is not available for ${normalizedPath}. ` +
      `Raw GitHub file access should be used for this content directory.`
  );
}

export async function readContentRepoStatus(): Promise<ContentRepoStatus> {
  return {
    repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,
    branch: CONTENT_REPO_BRANCH,
    source: getContentRepoDisplayName(),
    updatedAt: null,
    commitSha: null,
  };
}

export async function checkContentRepoReachability() {
  try {
    const testUrl = buildContentRepoRawUrl(
      "interview/ai.md",
      CONTENT_REPO_NAME,
      CONTENT_REPO_BRANCH
    );

    await fetchGitHubText(testUrl);

    return true;
  } catch {
    return false;
  }
}

export const resolveLocalContentPath = (
  filePath: string
) => resolveContentRepoPath(filePath);
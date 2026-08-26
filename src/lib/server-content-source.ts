import fs from "node:fs/promises";
import path from "node:path";

import {
  CONTENT_REPO_BRANCH,
  CONTENT_REPO_OWNER,
  CONTENT_REPO_NAME,
  getContentRepoDisplayName,
  normalizeContentRepoPath,
  resolveContentRepoPath,
} from "./content-repo-config";

import type { ContentRepoStatus } from "./content-types";

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

/*
 * The application and its content now live in the same repository.
 *
 * Example:
 *
 *   courses/vue-js/README.md
 *
 * resolves to:
 *
 *   <project-root>/courses/vue-js/README.md
 *
 * We intentionally keep the existing function names so the rest of
 * server-content.ts does not need to be rewritten.
 */

const CONTENT_ROOT = process.cwd();

const normalizeLocalPath = (filePath: string) =>
  normalizeContentRepoPath(
    String(filePath || "")
      .replace(/^https?:\/\/[^/]+\/?/i, "")
      .replace(/^\/+/, "")
  );

const getLocalContentPath = (filePath: string) => {
  const normalized = normalizeLocalPath(filePath);

  if (!normalized) {
    throw new Error("Content file path is empty");
  }

  /*
   * Prevent paths such as:
   *
   *   ../../some-file
   *
   * from escaping the application repository.
   */
  const root = path.resolve(CONTENT_ROOT);
  const target = path.resolve(root, normalized);

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Invalid content path: ${filePath}`);
  }

  return target;
};

const buildLocalContentUrl = (filePath: string) => {
  const normalized = normalizeLocalPath(filePath);

  /*
   * This is retained as a stable identifier for existing code.
   *
   * It is NOT a remote GitHub URL anymore.
   */
  return `local-content://${normalized}`;
};

const getLocalDirectoryPath = (folderPath: string) =>
  getLocalContentPath(folderPath);

export async function readRepoContentSource(
  repoFilePath: string,
  _preferredRepoName?: string,
  _repoRef = CONTENT_REPO_BRANCH
): Promise<RepoContentSource> {
  const filePath = getLocalContentPath(repoFilePath);

  try {
    const text = await fs.readFile(filePath, "utf8");

    return {
      repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,
      text,
      url: buildLocalContentUrl(repoFilePath),
    };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : String(error);

    throw new Error(
      `Failed to read local content ${repoFilePath}: ${reason}`
    );
  }
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

export async function readRepoDirectory(
  repoFolderPath: string,
  _preferredRepoName?: string,
  _repoRef = CONTENT_REPO_BRANCH
): Promise<{
  repoName: string;
  entries: RepoDirectoryEntry[];
}> {
  const directoryPath = getLocalDirectoryPath(repoFolderPath);

  let entries;

  try {
    entries = await fs.readdir(directoryPath, {
      withFileTypes: true,
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : String(error);

    throw new Error(
      `Failed to read local content directory ${repoFolderPath}: ${reason}`
    );
  }

  const normalizedFolder = normalizeLocalPath(repoFolderPath);

  return {
    repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,

    entries: entries
      .filter((entry) => entry.name !== ".DS_Store")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => {
        const relativePath = normalizedFolder
          ? `${normalizedFolder}/${entry.name}`
          : entry.name;

        return {
          name: entry.name,
          path: relativePath,
          type: entry.isDirectory() ? "dir" : "file",
          downloadUrl: buildLocalContentUrl(relativePath),
        };
      }),
  };
}

export async function readContentRepoStatus(): Promise<ContentRepoStatus> {
  /*
   * There is no separate content repository anymore.
   *
   * We report the local repository as the content source.
   */
  return {
    repoName: `${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}`,
    branch: CONTENT_REPO_BRANCH,
    source: getContentRepoDisplayName(),
    updatedAt: null,
    commitSha: null,
  };
}

export async function checkContentRepoReachability() {
  /*
   * Content is local, so reachability means that the expected
   * content directories/files exist.
   */
  const requiredPaths = [
    "courses",
    "interview-qna",
    "cbt",
    "news-ticker",
    "dashboard",
    "design",
  ];

  try {
    for (const requiredPath of requiredPaths) {
      const fullPath = getLocalContentPath(requiredPath);
      const stat = await fs.stat(fullPath);

      if (!stat.isDirectory()) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/*
 * Exported only for future local-content consumers.
 *
 * Keeping this helper here makes it easy to resolve the same paths
 * elsewhere without duplicating filesystem/path-safety logic.
 */
export const resolveLocalContentPath = (filePath: string) =>
  getLocalContentPath(resolveContentRepoPath(filePath));
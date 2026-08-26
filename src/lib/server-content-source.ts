import {
  CONTENT_REPO_BASE_PATH,
  CONTENT_REPO_BRANCH,
  CONTENT_REPO_OWNER,
  buildContentRepoRawUrl,
  getContentRepoDisplayName,
  getContentRepoPathCandidates,
  getContentRepoNameCandidates,
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

export async function readRepoContentSource(
  repoFilePath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<RepoContentSource> {
  const pathCandidates = getContentRepoPathCandidates(repoFilePath);
  const repoNameCandidates = getContentRepoNameCandidates(preferredRepoName);
  let lastStatus: number | null = null;

  for (const repoName of repoNameCandidates) {
    for (const pathCandidate of pathCandidates) {
      const remoteUrl = buildContentRepoRawUrl(pathCandidate, repoName, repoRef);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      let response: Response;
      try {
        response = await fetch(remoteUrl, {
          cache: "no-store",
          headers: {
            "User-Agent": "Tinitiate-Edu-App",
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (response.ok) {
        return {
          repoName,
          text: await response.text(),
          url: remoteUrl,
        };
      }

      lastStatus = response.status;
    }
  }

  throw new Error(
    `Failed to fetch ${repoFilePath} from GitHub${lastStatus ? ` (${lastStatus})` : ""}`
  );
}

export async function readRepoContentText(
  repoFilePath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
) {
  const source = await readRepoContentSource(repoFilePath, preferredRepoName, repoRef);
  return source.text;
}

export async function readRepoDirectory(
  repoFolderPath: string,
  preferredRepoName?: string,
  repoRef = CONTENT_REPO_BRANCH
): Promise<{ repoName: string; entries: RepoDirectoryEntry[] }> {
  const pathCandidates = getContentRepoPathCandidates(repoFolderPath);
  const repoNameCandidates = getContentRepoNameCandidates(preferredRepoName);
  let lastStatus: number | null = null;

  for (const repoName of repoNameCandidates) {
    for (const pathCandidate of pathCandidates) {
      const resolvedPath = resolveContentRepoPath(pathCandidate)
        .split("/")
        .filter(Boolean)
        .map(encodeURIComponent)
        .join("/");
      const apiUrl = `https://api.github.com/repos/${CONTENT_REPO_OWNER}/${repoName}/contents/${resolvedPath}?ref=${encodeURIComponent(repoRef)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      let response: Response;
      try {
        response = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "Tinitiate-Edu-App",
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (response.ok) {
        const payload = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error(`${repoFolderPath} is not a GitHub directory`);
        }

        return {
          repoName,
          entries: payload
            .filter((entry): entry is { name: string; path: string; type: string; download_url?: string } =>
              Boolean(entry?.name && entry?.path && entry?.type)
            )
            .map((entry) => ({
              name: entry.name,
              path: entry.path,
              type: entry.type === "dir" ? "dir" : "file",
              ...(entry.download_url ? { downloadUrl: entry.download_url } : {}),
            })),
        };
      }

      lastStatus = response.status;
    }
  }

  throw new Error(
    `Failed to list ${repoFolderPath} from GitHub${lastStatus ? ` (${lastStatus})` : ""}`
  );
}

export async function readContentRepoStatus(): Promise<ContentRepoStatus> {
  const [repoName] = getContentRepoNameCandidates();

  if (!repoName) {
    throw new Error("Content repo name is not configured");
  }

  const params = new URLSearchParams({
    sha: CONTENT_REPO_BRANCH,
    per_page: "1",
  });

  if (CONTENT_REPO_BASE_PATH) {
    params.set("path", CONTENT_REPO_BASE_PATH);
  }

  const statusUrl = `https://api.github.com/repos/${CONTENT_REPO_OWNER}/${repoName}/commits?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;
  try {
    response = await fetch(statusUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Tinitiate-Edu-App",
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch content repo status (${response.status})`);
  }

  const commits = (await response.json()) as Array<{
    sha?: string;
    commit?: {
      author?: { date?: string | null };
      committer?: { date?: string | null };
    };
  }>;

  const latestCommit = commits[0];
  const updatedAt =
    latestCommit?.commit?.committer?.date || latestCommit?.commit?.author?.date || null;

  return {
    repoName,
    branch: CONTENT_REPO_BRANCH,
    source: getContentRepoDisplayName(),
    updatedAt,
    commitSha: latestCommit?.sha || null,
  };
}

export async function checkContentRepoReachability() {
  const [repoName] = getContentRepoNameCandidates();

  if (!repoName) {
    return false;
  }

  // Use raw content instead of the GitHub commits API so browser status is not
  // treated as offline just because the unauthenticated API rate limit is hit.
  for (const filePath of ["design/colour.yaml", "news-ticker/feed.yaml"]) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(buildContentRepoRawUrl(filePath, repoName), {
        cache: "no-store",
        headers: {
          "User-Agent": "Tinitiate-Edu-App",
        },
        signal: controller.signal,
      });

      if (response.ok) {
        return true;
      }
    } catch {
      // try the next lightweight content file before reporting offline
    } finally {
      clearTimeout(timeout);
    }
  }

  return false;
}

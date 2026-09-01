import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import {
  readRepositoryConfig,
} from "../../../lib/server-content-source";

import {
  CONTENT_REPO_BRANCH,
  CONTENT_REPO_NAME,
  CONTENT_REPO_OWNER,
} from "../../../lib/content-repo-config";

import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../lib/server-content-cache";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const config =
      await withContentServerCache(
        "repository-config",
        async () =>
          readRepositoryConfig()
      );

    /*
     * ============================================================
     * UNIVERSAL SHELL REPOSITORY INFORMATION
     * ============================================================
     *
     * The company repository owns:
     *
     *   - company information
     *   - branding
     *   - courses
     *   - interview content
     *   - CBT content
     *   - dashboard content
     *   - ticker
     *   - design configuration
     *
     * The shell must not hardcode a company's repository.
     *
     * These values come from the central content-repository
     * configuration used by the server.
     *
     * Only public repository metadata is returned here.
     *
     * GITHUB_TOKEN is never exposed.
     */

    const responseConfig = {
      ...config,

      repository: {
        owner: CONTENT_REPO_OWNER,
        name: CONTENT_REPO_NAME,
        repository: CONTENT_REPO_NAME,
        branch: CONTENT_REPO_BRANCH,
      },
    };

    setContentNoStoreHeaders(res);

    res.status(200).json(responseConfig);
  } catch (error) {
    console.error(
      "SKILLWAVE REPOSITORY CONFIG LOAD FAILED:",
      error
    );

    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to load SkillWave repository configuration",
    });
  }
}
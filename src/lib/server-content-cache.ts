import type { NextApiResponse } from "next";

import { withServerCache } from "./server-cache";
import { readContentRepoStatus } from "./server-content-source";

const CONTENT_STATUS_CACHE_TTL_MS = 60 * 1000;
const VERSIONED_CONTENT_CACHE_TTL_MS = 10 * 60 * 1000;

export const CONTENT_NO_STORE =
  "no-store, no-cache, must-revalidate, max-age=0";

export const setContentNoStoreHeaders = (res: NextApiResponse) => {
  res.setHeader("Cache-Control", CONTENT_NO_STORE);
};

export const getCachedContentRepoStatus = () =>
  withServerCache("repo-status", readContentRepoStatus, CONTENT_STATUS_CACHE_TTL_MS);

export async function withContentServerCache<T>(
  key: string,
  load: (repoRef?: string) => Promise<T>,
  ttlMs = VERSIONED_CONTENT_CACHE_TTL_MS
): Promise<T> {
  const status = await getCachedContentRepoStatus().catch(() => null);
  const version = status?.commitSha || status?.updatedAt;

  if (!version) {
    return load();
  }

  return withServerCache(`content:${key}:${version}`, () => load(status?.commitSha || undefined), ttlMs);
}

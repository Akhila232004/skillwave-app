import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCachedContentRepoStatus,
  setContentNoStoreHeaders,
} from "../../../lib/server-content-cache";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const status = await getCachedContentRepoStatus();
    setContentNoStoreHeaders(res);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load content repo status",
    });
  }
}

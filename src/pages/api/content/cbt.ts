import type { NextApiRequest, NextApiResponse } from "next";
import { getCbtCollections } from "../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../lib/server-content-cache";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const collections = await withContentServerCache("cbt", getCbtCollections);
    setContentNoStoreHeaders(res);
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load CBT collections",
    });
  }
}

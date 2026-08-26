import type { NextApiRequest, NextApiResponse } from "next";
import { getDesignSystem } from "../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../lib/server-content-cache";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const design = await withContentServerCache("design", getDesignSystem);
    setContentNoStoreHeaders(res);
    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load design config",
    });
  }
}

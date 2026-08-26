import type { NextApiRequest, NextApiResponse } from "next";
import { getDashboardCards } from "../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../lib/server-content-cache";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const cards = await withContentServerCache("dashboard-cards", getDashboardCards);
    setContentNoStoreHeaders(res);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load dashboard cards",
    });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { getInterviewQuestionBySlug } from "../../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../../lib/server-content-cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug || "");

  try {
    const item = await withContentServerCache(
      `interview:${slug}`,
      (repoRef) => getInterviewQuestionBySlug(slug, repoRef)
    );

    if (!item) {
      res.status(404).json({ error: "Interview question not found" });
      return;
    }

    setContentNoStoreHeaders(res);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load interview question",
    });
  }
}

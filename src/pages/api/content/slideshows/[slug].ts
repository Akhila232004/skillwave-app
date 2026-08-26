import type { NextApiRequest, NextApiResponse } from "next";
import { getSlideshowBySlug } from "../../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../../lib/server-content-cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug || "");

  try {
    const deck = await withContentServerCache(
      `slideshow:${slug}`,
      (repoRef) => getSlideshowBySlug(slug, repoRef)
    );

    if (!deck) {
      res.status(404).json({ error: "Slideshow not found" });
      return;
    }

    setContentNoStoreHeaders(res);
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load slideshow",
    });
  }
}

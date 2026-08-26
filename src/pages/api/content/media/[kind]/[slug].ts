import type { NextApiRequest, NextApiResponse } from "next";
import { getMediaItemBySlug } from "../../../../../lib/server-content";
import {
  setContentNoStoreHeaders,
  withContentServerCache,
} from "../../../../../lib/server-content-cache";

const isSupportedKind = (value: string): value is "training-videos" | "audio-books" =>
  value === "training-videos" || value === "audio-books";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const kind = String(req.query.kind || "");
  const slug = String(req.query.slug || "");

  if (!isSupportedKind(kind)) {
    res.status(400).json({ error: "Unsupported media kind" });
    return;
  }

  try {
    const item = await withContentServerCache(
      `media:${kind}:${slug}`,
      (repoRef) => getMediaItemBySlug(kind, slug, repoRef)
    );

    if (!item) {
      res.status(404).json({ error: "Media item not found" });
      return;
    }

    setContentNoStoreHeaders(res);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load media item",
    });
  }
}

// pages/api/favorites.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { addFav, getFavs, removeFav, type FavTopic } from "../../lib/fav";
import { authOptions } from "../../lib/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user as { id?: string; email?: string | null } | undefined;
  const userKey = sessionUser?.id || sessionUser?.email || "";

  if (!userKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // GET /api/favorites
  if (req.method === "GET") {
    return res.status(200).json(await getFavs(userKey));
  }

  // POST /api/favorites  (body: {slug, topic_name, subject, kind?, href?})
  if (req.method === "POST") {
    const body = req.body as Partial<FavTopic>;

    if (!body?.slug || !body?.topic_name || !body?.subject) {
      return res.status(400).json({ error: "slug, topic_name, subject required" });
    }

    const updated = await addFav(userKey, {
      slug: body.slug,
      topic_name: body.topic_name,
      subject: body.subject,
      kind: body.kind,
      summary: body.summary,
      href: body.href,
      md_url: body.md_url,
      subject_readme_url: body.subject_readme_url,
      savedAt: body.savedAt,
    });

    return res.status(200).json(updated);
  }

  // DELETE /api/favorites?slug=xxx
  if (req.method === "DELETE") {
    const slug = String(req.query.slug || "").trim();
    const rawKind = String(req.query.kind || "topic").trim();
    const kind: FavTopic["kind"] =
      rawKind === "interview" ||
      rawKind === "slideshow" ||
      rawKind === "training-video" ||
      rawKind === "audio-book"
        ? rawKind
        : "topic";
    if (!slug) return res.status(400).json({ error: "slug query param required" });

    const updated = await removeFav(userKey, slug, kind);
    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

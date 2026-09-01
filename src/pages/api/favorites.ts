// pages/api/favorites.ts

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import {
  getServerSession,
} from "next-auth/next";

import {
  addFav,
  getFavs,
  removeFav,
  type FavTopic,
} from "../../lib/fav";

import {
  authOptions,
} from "../../lib/authOptions";

const FAVORITE_KINDS: FavTopic["kind"][] =
  [
    "topic",
    "interview",
    "interview-question",
    "slideshow",
    "training-video",
    "audio-book",
  ];

const normalizeKind = (
  value: unknown
): FavTopic["kind"] => {
  const rawKind =
    String(
      value || "topic"
    ).trim();

  return FAVORITE_KINDS.includes(
    rawKind as FavTopic["kind"]
  )
    ? (rawKind as FavTopic["kind"])
    : "topic";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session =
    await getServerSession(
      req,
      res,
      authOptions
    );

  const sessionUser =
    session?.user as
      | {
          id?: string;
          email?: string | null;
        }
      | undefined;

  const userKey =
    sessionUser?.id ||
    sessionUser?.email ||
    "";

  if (!userKey) {
    return res
      .status(401)
      .json({
        error:
          "Unauthorized",
      });
  }

  /*
   * GET /api/favorites
   */
  if (
    req.method ===
    "GET"
  ) {
    const favorites =
      await getFavs(
        userKey
      );

    return res
      .status(200)
      .json(favorites);
  }

  /*
   * POST /api/favorites
   *
   * Body:
   *
   * {
   *   slug,
   *   topic_name,
   *   subject,
   *   kind?,
   *   summary?,
   *   href?,
   *   md_url?,
   *   subject_readme_url?
   * }
   */
  if (
    req.method ===
    "POST"
  ) {
    const body =
      req.body as
        Partial<FavTopic>;

    if (
      !body?.slug ||
      !body?.topic_name ||
      !body?.subject
    ) {
      return res
        .status(400)
        .json({
          error:
            "slug, topic_name, subject required",
        });
    }

    const kind =
      normalizeKind(
        body.kind
      );

    const updated =
      await addFav(
        userKey,
        {
          slug:
            body.slug,

          topic_name:
            body.topic_name,

          subject:
            body.subject,

          kind,

          summary:
            body.summary,

          href:
            body.href,

          md_url:
            body.md_url,

          subject_readme_url:
            body.subject_readme_url,

          savedAt:
            body.savedAt,
        }
      );

    return res
      .status(200)
      .json(updated);
  }

  /*
   * DELETE /api/favorites
   *
   * Query:
   *
   * ?slug=xxx&kind=interview-question
   */
  if (
    req.method ===
    "DELETE"
  ) {
    const slug =
      String(
        req.query.slug ||
          ""
      ).trim();

    const kind =
      normalizeKind(
        req.query.kind
      );

    if (!slug) {
      return res
        .status(400)
        .json({
          error:
            "slug query param required",
        });
    }

    const updated =
      await removeFav(
        userKey,
        slug,
        kind
      );

    return res
      .status(200)
      .json(updated);
  }

  res.setHeader(
    "Allow",
    [
      "GET",
      "POST",
      "DELETE",
    ]
  );

  return res
    .status(405)
    .end(
      `Method ${req.method} Not Allowed`
    );
}
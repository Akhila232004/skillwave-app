import type { NextApiRequest, NextApiResponse } from "next";

import { checkContentRepoReachability } from "../../lib/server-content-source";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  const reachable = await checkContentRepoReachability();
  const payload = {
    reachable,
    checkedAt: new Date().toISOString(),
    source: "github",
  };

  if (reachable) {
    res.status(200).json(payload);
    return;
  }

  res.status(503).json(payload);
}

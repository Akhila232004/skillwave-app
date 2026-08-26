import type { NextApiRequest, NextApiResponse } from "next";

import { getGoogleAuthClientConfig } from "../../../lib/authOptions";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.status(200).json(getGoogleAuthClientConfig());
}

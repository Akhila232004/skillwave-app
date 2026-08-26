import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";

import { authOptions } from "../../../lib/authOptions";

export { authOptions };

const firstForwardedValue = (value: string | string[] | undefined) =>
  String(Array.isArray(value) ? value[0] : value || "")
    .split(",")[0]
    .trim();

const configuredNextAuthUrl = process.env.NEXTAUTH_URL || "";

const isLocalhostUrl = (value: string) => {
  if (!value) {
    return false;
  }

  try {
    const hostname = new URL(value).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
};

const toOrigin = (value: string | undefined) => {
  if (!value) {
    return "";
  }

  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
};

const getRequestOrigin = (req: NextApiRequest) => {
  const host = firstForwardedValue(req.headers["x-forwarded-host"]) || req.headers.host || "";

  if (!host) {
    return "";
  }

  const forwardedProto = firstForwardedValue(req.headers["x-forwarded-proto"]);
  const protocol =
    forwardedProto ||
    (String(host).startsWith("localhost") || String(host).startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
};

const getHostedDeploymentOrigin = () =>
  toOrigin(process.env.URL) ||
  toOrigin(process.env.DEPLOY_PRIME_URL) ||
  toOrigin(process.env.DEPLOY_URL) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

const ensureNextAuthUrl = (req: NextApiRequest) => {
  if (configuredNextAuthUrl && !isLocalhostUrl(configuredNextAuthUrl)) {
    return;
  }

  const origin = getRequestOrigin(req);

  if (origin) {
    process.env.NEXTAUTH_URL = origin;
    return;
  }

  const hostedOrigin = getHostedDeploymentOrigin();

  if (hostedOrigin) {
    process.env.NEXTAUTH_URL = hostedOrigin;
  }
};

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  ensureNextAuthUrl(req);
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  return NextAuth(req, res, authOptions);
}

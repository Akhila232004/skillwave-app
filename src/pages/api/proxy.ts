import { lookup } from "dns/promises";
import { isIP } from "net";
import type { NextApiRequest, NextApiResponse } from "next";

import { withServerCache } from "../../lib/server-cache";
import {
  CONTENT_NO_STORE,
  withContentServerCache,
} from "../../lib/server-content-cache";
import {
  buildContentRepoRawUrl,
  parseContentRepoPathFromUrl,
} from "../../lib/content-repo-config";

const TRUSTED_CONTENT_HOSTS = new Set([
  "raw.githubusercontent.com",
  "github.com",
  "api.github.com",
]);
const MAX_EXTERNAL_IMAGE_BYTES = 10 * 1024 * 1024;
const PROXY_CACHE_TTL_MS = 5 * 60 * 1000;

type ProxyPayload = {
  status: number;
  contentType: string | null;
  body: Buffer;
};

class ProxyHttpError extends Error {
  payload: ProxyPayload;

  constructor(payload: ProxyPayload) {
    super(`GitHub proxy request failed (${payload.status})`);
    this.payload = payload;
  }
}

const isPrivateIpv4 = (address: string) => {
  const parts = address.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
};

const isPrivateIpv6 = (address: string) => {
  const normalized = address.toLowerCase();
  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
};

const isPrivateAddress = (address: string) => {
  const ipKind = isIP(address);
  if (ipKind === 4) return isPrivateIpv4(address);
  if (ipKind === 6) return isPrivateIpv6(address);
  return true;
};

const assertPublicHostname = async (hostname: string) => {
  const normalized = hostname.toLowerCase();
  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local")
  ) {
    throw new Error("Host not allowed");
  }

  const directIpKind = isIP(normalized);
  if (directIpKind) {
    if (isPrivateAddress(normalized)) {
      throw new Error("Host not allowed");
    }
    return;
  }

  const records = await lookup(normalized, { all: true });
  if (!records.length || records.some((record) => isPrivateAddress(record.address))) {
    throw new Error("Host not allowed");
  }
};

const fetchGitHubPayload = async (
  url: string,
  options?: { externalImageOnly?: boolean }
): Promise<ProxyPayload> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "NextProxy" },
      redirect: options?.externalImageOnly ? "error" : "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get("content-type");
  const contentLength = Number(response.headers.get("content-length") || "0");

  if (options?.externalImageOnly) {
    if (!contentType?.toLowerCase().startsWith("image/")) {
      throw new Error("Only image URLs are allowed for external hosts");
    }
    if (contentLength > MAX_EXTERNAL_IMAGE_BYTES) {
      throw new Error("External image is too large");
    }
  }

  const payload = {
    status: response.status,
    contentType,
    body: Buffer.from(await response.arrayBuffer()),
  };

  if (options?.externalImageOnly && payload.body.byteLength > MAX_EXTERNAL_IMAGE_BYTES) {
    throw new Error("External image is too large");
  }

  if (!response.ok) {
    throw new ProxyHttpError(payload);
  }

  return payload;
};

const sendPayload = (res: NextApiResponse, payload: ProxyPayload, cacheControl: string) => {
  if (payload.contentType) {
    res.setHeader("Content-Type", payload.contentType);
  }
  res.setHeader("Cache-Control", cacheControl);
  res.status(payload.status).send(payload.body);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = String(req.query.url || "");

  try {
    const u = new URL(url);
    if (u.protocol !== "https:") {
      return res.status(400).send("Only https URLs allowed");
    }
    const trustedContentHost = TRUSTED_CONTENT_HOSTS.has(u.hostname);
    if (!trustedContentHost) {
      await assertPublicHostname(u.hostname);
    }

    try {
      const contentPath = parseContentRepoPathFromUrl(u.toString());
      const cacheKey = `proxy:${u.toString()}`;
      const loadPayload = (repoRef?: string) =>
        fetchGitHubPayload(
          contentPath !== null && repoRef
            ? buildContentRepoRawUrl(contentPath, undefined, repoRef)
            : u.toString(),
          { externalImageOnly: !trustedContentHost }
        );
      const payload =
        contentPath !== null
          ? await withContentServerCache(cacheKey, loadPayload, PROXY_CACHE_TTL_MS)
          : await withServerCache(cacheKey, loadPayload, PROXY_CACHE_TTL_MS);

      sendPayload(res, payload, CONTENT_NO_STORE);
      return;
    } catch (error) {
      if (error instanceof ProxyHttpError) {
        sendPayload(res, error.payload, "no-store");
        return;
      }

      res.status(502).send("Failed to fetch requested URL");
      return;
    }
  } catch {
    res.status(400).send("Invalid url");
  }
}

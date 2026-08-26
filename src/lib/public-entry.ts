const APP_URL_ORIGIN = "https://tinitiate.local";
const PUBLIC_ENTRY_PATHS = new Set(["/", "/login", "/signup"]);

const toAppRelativeUrl = (value: unknown) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw, APP_URL_ORIGIN);
    if (parsed.origin !== APP_URL_ORIGIN) return "";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return raw.startsWith("/") ? raw : "";
  }
};

export const isPublicEntryPath = (value: unknown) => {
  const nextUrl = toAppRelativeUrl(value);
  if (!nextUrl) return false;

  try {
    return PUBLIC_ENTRY_PATHS.has(new URL(nextUrl, APP_URL_ORIGIN).pathname);
  } catch {
    return false;
  }
};

export const normalizeCallbackUrl = (value: unknown, fallback = "") => {
  const nextUrl = toAppRelativeUrl(value);
  if (!nextUrl || isPublicEntryPath(nextUrl)) {
    return fallback;
  }

  return nextUrl;
};

export const buildPublicEntryUrl = (callbackUrl?: string, reason?: string) => {
  const params = new URLSearchParams();
  const nextPath = normalizeCallbackUrl(callbackUrl);
  const nextReason = String(reason || "").trim();

  if (nextPath) {
    params.set("callbackUrl", nextPath);
  }

  if (nextReason) {
    params.set("reason", nextReason);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
};

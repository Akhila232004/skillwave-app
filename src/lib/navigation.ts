import type { NextRouter } from "next/router";

const APP_ROUTE_HISTORY_KEY = "tinitiate.app-route-history";
const MAX_APP_ROUTE_HISTORY = 40;
const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const getPathname = (href: string) => {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href.split("?")[0] || href;
  }
};

const shouldTrackRoute = (href: string) => {
  const pathname = getPathname(href);
  return !PUBLIC_ROUTES.has(pathname);
};

const readHistory = () => {
  if (!canUseSessionStorage()) return [];

  try {
    const parsed = JSON.parse(sessionStorage.getItem(APP_ROUTE_HISTORY_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
      : [];
  } catch {
    return [];
  }
};

const writeHistory = (items: string[]) => {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(
    APP_ROUTE_HISTORY_KEY,
    JSON.stringify(items.slice(-MAX_APP_ROUTE_HISTORY))
  );
};

export const clearAppRouteHistory = () => {
  if (!canUseSessionStorage()) return;
  sessionStorage.removeItem(APP_ROUTE_HISTORY_KEY);
};

export const recordAppRoute = (href: string) => {
  if (!canUseSessionStorage() || !shouldTrackRoute(href)) return;

  const history = readHistory();
  const last = history[history.length - 1];
  if (last === href) return;

  writeHistory([...history.filter((entry, index) => index === history.length - 1 || entry !== href), href]);
};

export const hasAppBackRoute = (currentHref: string) => {
  const history = readHistory().filter((entry) => entry !== currentHref && shouldTrackRoute(entry));
  return history.length > 0;
};

const popPreviousAppRoute = (currentHref: string) => {
  const history = readHistory();

  while (history.length > 0 && history[history.length - 1] === currentHref) {
    history.pop();
  }

  while (history.length > 0) {
    const previous = history.pop();
    if (previous && previous !== currentHref && shouldTrackRoute(previous)) {
      writeHistory(history);
      return previous;
    }
  }

  writeHistory([]);
  return "";
};

export const goBackOr = (router: NextRouter, fallbackHref = "/dashboard") => {
  const previous = popPreviousAppRoute(router.asPath);
  if (previous) {
    void router.replace(previous, undefined, { scroll: true });
    return;
  }

  void router.push(fallbackHref);
};

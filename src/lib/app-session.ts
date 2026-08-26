import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

import {
  AUTH_BROWSER_SESSION_EVENT,
  clearBrowserSessionActive,
  hasBrowserSessionActive,
} from "./browserSession";
import { buildPublicEntryUrl } from "./public-entry";

const CACHED_SESSION_USER_KEY = "tinitiate.auth.cached-user";

type CachedSessionUser = NonNullable<Session["user"]> & {
  id?: string;
};

const normalizeCachedUser = (value: unknown): CachedSessionUser | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : null;
  const email = typeof record.email === "string" ? record.email : null;
  const image = typeof record.image === "string" ? record.image : null;
  const id = typeof record.id === "string" ? record.id : undefined;

  if (!name && !email && !id) return null;

  return {
    name,
    email,
    image,
    id,
  };
};

export const readCachedSessionUser = (): CachedSessionUser | null => {
  if (typeof window === "undefined") return null;

  try {
    return normalizeCachedUser(
      JSON.parse(
        localStorage.getItem(CACHED_SESSION_USER_KEY) || "null"
      )
    );
  } catch {
    return null;
  }
};

export const writeCachedSessionUser = (
  user?: Session["user"] & { id?: string }
) => {
  if (typeof window === "undefined") return;

  const normalized = normalizeCachedUser(user || null);
  if (!normalized) return;

  localStorage.setItem(
    CACHED_SESSION_USER_KEY,
    JSON.stringify(normalized)
  );
};

export const clearCachedSessionUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CACHED_SESSION_USER_KEY);
};

export const clearLegacyOfflineLibraryData = () => {
  if (typeof window === "undefined") return;

  const keysToDelete = Object.keys(localStorage).filter(
    (key) =>
      key === "favorite_topics" ||
      key === "tinitiate_library_active_user" ||
      key.startsWith("favorite_topics_") ||
      key.startsWith("offline_subject_")
  );

  for (const key of keysToDelete) {
    localStorage.removeItem(key);
  }
};

export function useAppSession() {
  const session = useSession();
  const [isOffline, setIsOffline] = useState(false);
  const [browserSessionActive, setBrowserSessionActive] =
    useState(false);
  const [cachedUser, setCachedUser] =
    useState<CachedSessionUser | null>(null);
  const [clientReady, setClientReady] = useState(false);
  const [allowUnauthenticatedRedirect, setAllowUnauthenticatedRedirect] =
    useState(false);

  useEffect(() => {
    const updateOffline = () =>
      setIsOffline(
        typeof navigator !== "undefined" && !navigator.onLine
      );

    const updateBrowserSession = () =>
      setBrowserSessionActive(hasBrowserSessionActive());

    const updateCachedUser = () =>
      setCachedUser(readCachedSessionUser());

    updateOffline();
    updateBrowserSession();
    updateCachedUser();
    setClientReady(true);

    window.addEventListener("online", updateOffline);
    window.addEventListener("offline", updateOffline);

    window.addEventListener(
      AUTH_BROWSER_SESSION_EVENT,
      updateBrowserSession
    );

    window.addEventListener("focus", updateBrowserSession);
    window.addEventListener("focus", updateCachedUser);

    window.addEventListener("storage", updateBrowserSession);
    window.addEventListener("storage", updateCachedUser);

    return () => {
      window.removeEventListener("online", updateOffline);
      window.removeEventListener("offline", updateOffline);

      window.removeEventListener(
        AUTH_BROWSER_SESSION_EVENT,
        updateBrowserSession
      );

      window.removeEventListener("focus", updateBrowserSession);
      window.removeEventListener("focus", updateCachedUser);

      window.removeEventListener("storage", updateBrowserSession);
      window.removeEventListener("storage", updateCachedUser);
    };
  }, []);

  const cachedUserKey = cachedUser?.id || cachedUser?.email || "";

  const canUseCachedSession =
    clientReady && Boolean(cachedUser) && isOffline;

  useEffect(() => {
    if (!clientReady) {
      setAllowUnauthenticatedRedirect(false);
      return;
    }

    if (session.status !== "unauthenticated" || isOffline) {
      setAllowUnauthenticatedRedirect(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setAllowUnauthenticatedRedirect(true);
    }, browserSessionActive || cachedUserKey ? 1400 : 900);

    return () => window.clearTimeout(timeout);
  }, [
    browserSessionActive,
    cachedUserKey,
    clientReady,
    isOffline,
    session.status,
  ]);

  if (session.status === "authenticated") {
    return {
      ...session,
      offlineFallback: false,
    };
  }

  if (cachedUser && canUseCachedSession) {
    return {
      data: { user: cachedUser } as Session,
      status: "authenticated" as const,
      update: session.update,
      offlineFallback: true,
    };
  }

  if (!clientReady) {
    return {
      ...session,
      status: "loading" as const,
      offlineFallback: false,
    };
  }

  if (
    session.status === "unauthenticated" &&
    !allowUnauthenticatedRedirect
  ) {
    return {
      ...session,
      status: "loading" as const,
      offlineFallback: false,
    };
  }

  return {
    ...session,
    offlineFallback: false,
  };
}

export function useProtectedAppSession(callbackUrl?: string) {
  const router = useRouter();
  const session = useAppSession();
  const redirectStartedRef = useRef(false);

  useEffect(() => {
    if (session.status !== "unauthenticated") {
      redirectStartedRef.current = false;
      return;
    }

    if (!router.isReady || redirectStartedRef.current) {
      return;
    }

    redirectStartedRef.current = true;

    void router.replace(
      buildPublicEntryUrl(callbackUrl || router.asPath)
    );
  }, [
    callbackUrl,
    router.asPath,
    router.isReady,
    router,
    session.status,
  ]);

  return session;
}

export const resetOfflineSessionState = () => {
  clearBrowserSessionActive();
  clearCachedSessionUser();
};
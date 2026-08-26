import { useEffect, useState } from "react";

import {
  CONTENT_AVAILABILITY_EVENT,
  type ContentAvailabilityState,
  writeContentAvailability,
} from "./content-availability";

const CONNECTIVITY_CHECK_URL = "/api/connectivity";
const CONNECTIVITY_CHECK_INTERVAL_MS = 15000;
const CONNECTIVITY_CHECK_TIMEOUT_MS = 4500;

const readBrowserOfflineState = () =>
  typeof navigator !== "undefined" ? !navigator.onLine : false;

const verifyContentReachability = async (externalSignal?: AbortSignal) => {
  if (typeof window === "undefined") return null;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    writeContentAvailability(true);
    return false;
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, CONNECTIVITY_CHECK_TIMEOUT_MS);

  const abortFromExternalSignal = () => controller.abort();
  externalSignal?.addEventListener("abort", abortFromExternalSignal, { once: true });

  try {
    const response = await fetch(`${CONNECTIVITY_CHECK_URL}?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store",
      },
      signal: controller.signal,
    });
    const payload = (await response.clone().json().catch(() => null)) as {
      reachable?: boolean;
    } | null;
    const reachable = response.ok && payload?.reachable !== false;

    writeContentAvailability(!reachable);
    return reachable;
  } catch (error) {
    if (
      !timedOut &&
      externalSignal?.aborted &&
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return null;
    }

    writeContentAvailability(true);
    return false;
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }
};

export const useConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(readBrowserOfflineState);

  useEffect(() => {
    let active = true;
    let verifyRequest: Promise<void> | null = null;
    const controller = new AbortController();

    const update = () => {
      if (!active) return;
      setIsOffline(readBrowserOfflineState());
    };

    const verify = () => {
      update();

      if (verifyRequest) {
        return verifyRequest;
      }

      verifyRequest = verifyContentReachability(controller.signal)
        .then((reachable) => {
          if (!active || reachable === null) return;
          setIsOffline(!reachable || readBrowserOfflineState());
        })
        .finally(() => {
          verifyRequest = null;
        });

      return verifyRequest;
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void verify();
      }
    };

    const handleOffline = () => {
      writeContentAvailability(true);
      if (active) {
        setIsOffline(true);
      }
    };

    const handleContentAvailability = (event: Event) => {
      const payload = (event as CustomEvent<ContentAvailabilityState>).detail;
      if (!active || !payload) return;
      setIsOffline(Boolean(payload.offline) || readBrowserOfflineState());
    };

    update();
    void verify();
    const intervalId = window.setInterval(() => {
      void verify();
    }, CONNECTIVITY_CHECK_INTERVAL_MS);

    window.addEventListener("online", verify);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("focus", verify);
    window.addEventListener("storage", verify);
    window.addEventListener(CONTENT_AVAILABILITY_EVENT, handleContentAvailability);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener("online", verify);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", verify);
      window.removeEventListener("storage", verify);
      window.removeEventListener(CONTENT_AVAILABILITY_EVENT, handleContentAvailability);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return isOffline;
};

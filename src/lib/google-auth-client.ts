import { writeCachedSessionUser } from "./app-session";

export type GoogleAuthClientConfig = {
  enabled: boolean;
  clientId: string;
  oauth: boolean;
  tokenProviderId: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
};

type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    prompt?: string;
    callback: (response: GoogleTokenResponse) => void;
    error_callback?: (error: unknown) => void;
  }) => GoogleTokenClient;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: GoogleOAuth2;
      };
    };
  }
}

const GOOGLE_IDENTITY_SCRIPT_URL = "https://accounts.google.com/gsi/client";

let googleScriptPromise: Promise<void> | null = null;

export const fetchGoogleAuthClientConfig = async () => {
  const res = await fetch(`/api/auth/google-config?ts=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-store" },
  });

  if (!res.ok) {
    throw new Error("Could not load Google sign-in settings.");
  }

  return (await res.json()) as GoogleAuthClientConfig;
};

export const loadGoogleIdentityScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser."));
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          googleScriptPromise = null;
          reject(new Error("Google sign-in failed to load."));
        },
        {
          once: true,
        }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      googleScriptPromise = null;
      reject(new Error("Google sign-in failed to load."));
    };
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export const requestGoogleAccessToken = async (clientId: string) => {
  await loadGoogleIdentityScript();

  const initTokenClient = window.google?.accounts?.oauth2?.initTokenClient;

  if (!initTokenClient) {
    throw new Error("Google sign-in is not ready. Please try again.");
  }

  return new Promise<string>((resolve, reject) => {
    const tokenClient = initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      prompt: "select_account",
      callback: (response) => {
        if (response?.access_token) {
          resolve(response.access_token);
          return;
        }

        reject(
          new Error(
            response?.error_description || response?.error || "Google sign-in was cancelled."
          )
        );
      },
      error_callback: () => reject(new Error("Google sign-in was cancelled.")),
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  });
};

export const cacheCurrentSessionUser = async () => {
  const res = await fetch("/api/auth/session", {
    cache: "no-store",
    headers: { "Cache-Control": "no-store" },
  }).catch(() => null);

  if (!res?.ok) {
    return;
  }

  const session = await res.json().catch(() => null);
  writeCachedSessionUser(session?.user);
};

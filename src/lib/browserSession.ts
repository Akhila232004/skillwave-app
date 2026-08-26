export const AUTH_BROWSER_SESSION_KEY = "tinitiate.auth.browser-session";
export const AUTH_BROWSER_SESSION_EVENT = "tinitiate.auth.browser-session-change";

const notifyBrowserSessionChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_BROWSER_SESSION_EVENT));
};

export function markBrowserSessionActive() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_BROWSER_SESSION_KEY, "1");
  notifyBrowserSessionChange();
}

export function clearBrowserSessionActive() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_BROWSER_SESSION_KEY);
  notifyBrowserSessionChange();
}

export function hasBrowserSessionActive() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(AUTH_BROWSER_SESSION_KEY) === "1";
}

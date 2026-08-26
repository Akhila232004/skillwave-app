export const CONTENT_AVAILABILITY_KEY = "tinitiate.content.availability";
export const CONTENT_AVAILABILITY_EVENT = "tinitiate:content-availability";

export type ContentAvailabilityState = {
  offline: boolean;
  updatedAt: number;
};

export const writeContentAvailability = (offline: boolean) => {
  if (typeof window === "undefined") return;

  const previous = readContentAvailability();
  const payload: ContentAvailabilityState = {
    offline,
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(CONTENT_AVAILABILITY_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }

  if (previous?.offline === offline) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(CONTENT_AVAILABILITY_EVENT, {
      detail: payload,
    })
  );
};

export const readContentAvailability = (): ContentAvailabilityState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONTENT_AVAILABILITY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ContentAvailabilityState;
  } catch {
    return null;
  }
};

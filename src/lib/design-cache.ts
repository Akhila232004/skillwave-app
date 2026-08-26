import type { DesignSystem } from "./content-types";

const DESIGN_CACHE_KEY = "tinitiate.design-config";

type StoredDesignConfig = {
  design: DesignSystem;
  savedAt: number;
};

const isDesignSystem = (value: unknown): value is DesignSystem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.repoName === "string" &&
    typeof record.theme === "object" &&
    record.theme !== null &&
    typeof record.pageBackgrounds === "object" &&
    record.pageBackgrounds !== null &&
    typeof record.dashboard === "object" &&
    record.dashboard !== null &&
    typeof record.courses === "object" &&
    record.courses !== null &&
    typeof record.landing === "object" &&
    record.landing !== null &&
    typeof record.mobile === "object" &&
    record.mobile !== null
  );
};

const normalizeStoredDesign = (value: unknown): DesignSystem | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Partial<StoredDesignConfig>;
  return isDesignSystem(record.design) ? record.design : null;
};

export const readPersistedDesignConfig = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeStoredDesign(
      JSON.parse(window.localStorage.getItem(DESIGN_CACHE_KEY) || "null")
    );
  } catch {
    return null;
  }
};

export const writePersistedDesignConfig = (design: DesignSystem) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredDesignConfig = {
    design,
    savedAt: Date.now(),
  };

  window.localStorage.setItem(DESIGN_CACHE_KEY, JSON.stringify(payload));
};

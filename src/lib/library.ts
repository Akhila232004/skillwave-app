export type SavedFavoriteKind = "topic" | "interview" | "slideshow" | "training-video" | "audio-book";

export type SavedFavoriteHref = {
  pathname: string;
  query?: Record<string, string>;
};

export type SavedFavoriteTopic = {
  slug: string;
  topic_name: string;
  subject: string;
  kind?: SavedFavoriteKind;
  summary?: string;
  href?: SavedFavoriteHref;
  md_url?: string;
  subject_readme_url?: string;
  savedAt: number;
};

const ACTIVE_LIBRARY_USER_KEY = "tinitiate_library_active_user";
const FAVORITES_STORAGE_PREFIX = "favorite_topics_";
const FAVORITES_STORAGE_FALLBACK = "favorite_topics";

export const normalizeLibraryUserKey = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normalizeFavoriteTopic = (value: unknown): SavedFavoriteTopic | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const slug = String(record.slug || "").trim();
  const topic_name = String(record.topic_name || "").trim();
  const subject = String(record.subject || "").trim();
  const savedAt = Number(record.savedAt);
  const rawKind = String(record.kind || "topic").trim();
  const kind: SavedFavoriteKind =
    rawKind === "interview" ||
    rawKind === "slideshow" ||
    rawKind === "training-video" ||
    rawKind === "audio-book"
      ? rawKind
      : "topic";

  if (!slug || !topic_name || !subject) return null;

  const rawHref = record.href as Record<string, unknown> | undefined;
  const rawQuery = rawHref?.query as Record<string, unknown> | undefined;
  const query =
    rawQuery && typeof rawQuery === "object"
      ? Object.fromEntries(
          Object.entries(rawQuery)
            .map(([key, val]) => [key, String(val || "").trim()])
            .filter(([, val]) => val)
        )
      : undefined;
  const href =
    rawHref && typeof rawHref.pathname === "string" && rawHref.pathname.trim()
      ? {
          pathname: rawHref.pathname.trim(),
          ...(query && Object.keys(query).length > 0 ? { query } : {}),
        }
      : undefined;

  return {
    slug,
    topic_name,
    subject,
    kind,
    summary: typeof record.summary === "string" ? record.summary : undefined,
    href,
    md_url: typeof record.md_url === "string" ? record.md_url : undefined,
    subject_readme_url:
      typeof record.subject_readme_url === "string" ? record.subject_readme_url : undefined,
    savedAt: Number.isFinite(savedAt) ? savedAt : Date.now(),
  };
};

const resolveLibraryUserKey = (accountKey?: string) => {
  const normalized = normalizeLibraryUserKey(accountKey);
  if (normalized) return normalized;

  if (typeof window === "undefined") return "";
  return normalizeLibraryUserKey(localStorage.getItem(ACTIVE_LIBRARY_USER_KEY));
};

const getFavoritesStorageKey = (accountKey?: string) => {
  const scope = resolveLibraryUserKey(accountKey);
  return scope ? `${FAVORITES_STORAGE_PREFIX}${scope}` : FAVORITES_STORAGE_FALLBACK;
};

const sortFavorites = (topics: SavedFavoriteTopic[]) =>
  [...topics].sort((a, b) => {
    if (b.savedAt !== a.savedAt) return b.savedAt - a.savedAt;
    return a.topic_name.localeCompare(b.topic_name);
  });

export const getFavoriteIdentity = (item: Pick<SavedFavoriteTopic, "slug" | "kind">) =>
  `${item.kind || "topic"}:${item.slug}`;

export const isFavoriteItem = (
  favorites: SavedFavoriteTopic[],
  slug: string,
  kind: SavedFavoriteKind = "topic"
) => favorites.some((item) => getFavoriteIdentity(item) === `${kind}:${slug}`);

export const getLibraryUserKey = (
  user?: { id?: string | null; email?: string | null } | null
) => normalizeLibraryUserKey(user?.id || user?.email || "");

export const setActiveLibraryUserKey = (accountKey?: string) => {
  if (typeof window === "undefined") return;

  const normalized = normalizeLibraryUserKey(accountKey);
  if (!normalized) return;

  localStorage.setItem(ACTIVE_LIBRARY_USER_KEY, normalized);
};

export const mergeFavoriteTopics = (...lists: Array<SavedFavoriteTopic[] | undefined>) => {
  const bySlug = new Map<string, SavedFavoriteTopic>();

  for (const list of lists) {
    for (const item of list || []) {
      const normalized = normalizeFavoriteTopic(item);
      if (!normalized) continue;

      const identity = getFavoriteIdentity(normalized);
      const existing = bySlug.get(identity);
      if (!existing) {
        bySlug.set(identity, normalized);
        continue;
      }

      bySlug.set(identity, {
        ...existing,
        ...normalized,
        summary: normalized.summary || existing.summary,
        href: normalized.href || existing.href,
        md_url: normalized.md_url || existing.md_url,
        subject_readme_url: normalized.subject_readme_url || existing.subject_readme_url,
        savedAt: Math.max(existing.savedAt || 0, normalized.savedAt || 0),
      });
    }
  }

  return sortFavorites(Array.from(bySlug.values()));
};

export const readFavoriteTopics = (accountKey?: string): SavedFavoriteTopic[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(getFavoritesStorageKey(accountKey));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return sortFavorites(
      parsed
        .map((item) => normalizeFavoriteTopic(item))
        .filter((item): item is SavedFavoriteTopic => Boolean(item))
    );
  } catch {
    return [];
  }
};

export const writeFavoriteTopics = (topics: SavedFavoriteTopic[], accountKey?: string) => {
  if (typeof window === "undefined") return [];

  const normalized = sortFavorites(
    topics
      .map((item) => normalizeFavoriteTopic(item))
      .filter((item): item is SavedFavoriteTopic => Boolean(item))
  );

  localStorage.setItem(getFavoritesStorageKey(accountKey), JSON.stringify(normalized));
  return normalized;
};

export const upsertFavoriteTopic = (topic: SavedFavoriteTopic, accountKey?: string) =>
  writeFavoriteTopics(mergeFavoriteTopics([topic], readFavoriteTopics(accountKey)), accountKey);

export const removeFavoriteTopic = (
  slug: string,
  accountKey?: string,
  kind: SavedFavoriteKind = "topic"
) =>
  writeFavoriteTopics(
    readFavoriteTopics(accountKey).filter((item) => getFavoriteIdentity(item) !== `${kind}:${slug}`),
    accountKey
  );

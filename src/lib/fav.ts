import { promises as fs } from "fs";
import path from "path";

export type FavTopic = {
  slug: string;
  topic_name: string;
  subject: string;
  kind?: "topic" | "interview" | "slideshow" | "training-video" | "audio-book";
  summary?: string;
  href?: {
    pathname: string;
    query?: Record<string, string>;
  };
  md_url?: string;
  subject_readme_url?: string;
  savedAt?: number;
};

type FavoritesFile = {
  byUser: Record<string, FavTopic[]>;
};

const FAVORITES_FILE = path.join(process.cwd(), "data", "favorites.json");

let writeQueue = Promise.resolve();

const normalizeFav = (value: unknown): FavTopic | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const slug = String(record.slug || "").trim();
  const topic_name = String(record.topic_name || "").trim();
  const subject = String(record.subject || "").trim();
  const savedAt = Number(record.savedAt);
  const rawKind = String(record.kind || "topic").trim();
  const kind: FavTopic["kind"] =
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
    savedAt: Number.isFinite(savedAt) ? savedAt : 0,
  };
};

async function ensureFavoritesFile() {
  await fs.mkdir(path.dirname(FAVORITES_FILE), { recursive: true });

  try {
    await fs.access(FAVORITES_FILE);
  } catch {
    await fs.writeFile(FAVORITES_FILE, JSON.stringify({ byUser: {} }, null, 2), "utf8");
  }
}

async function readFavoritesFile(): Promise<FavoritesFile> {
  await ensureFavoritesFile();

  try {
    const raw = await fs.readFile(FAVORITES_FILE, "utf8");
    const parsed = JSON.parse(raw) as { byUser?: Record<string, unknown[]> };

    const byUser = Object.fromEntries(
      Object.entries(parsed?.byUser || {}).map(([userKey, favs]) => [
        userKey,
        Array.isArray(favs)
          ? favs
              .map((entry) => normalizeFav(entry))
              .filter((entry): entry is FavTopic => Boolean(entry))
          : [],
      ])
    );

    return { byUser };
  } catch {
    return { byUser: {} };
  }
}

async function writeFavoritesFile(data: FavoritesFile) {
  await ensureFavoritesFile();
  await fs.writeFile(FAVORITES_FILE, JSON.stringify(data, null, 2), "utf8");
}

function queueWrite<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

const getFavIdentity = (fav: Pick<FavTopic, "slug" | "kind">) => `${fav.kind || "topic"}:${fav.slug}`;

export async function getFavs(userKey: string) {
  const store = await readFavoritesFile();
  return [...(store.byUser[userKey] || [])].sort((a, b) => {
    if ((b.savedAt || 0) !== (a.savedAt || 0)) {
      return (b.savedAt || 0) - (a.savedAt || 0);
    }
    return a.topic_name.localeCompare(b.topic_name);
  });
}

export async function addFav(userKey: string, fav: FavTopic) {
  return queueWrite(async () => {
    const store = await readFavoritesFile();
    const current = store.byUser[userKey] || [];
    const identity = getFavIdentity(fav);
    const existing = current.find((entry) => getFavIdentity(entry) === identity);
    const nextItem: FavTopic = {
      ...existing,
      ...fav,
      kind: fav.kind || existing?.kind || "topic",
      summary: fav.summary || existing?.summary,
      href: fav.href || existing?.href,
      md_url: fav.md_url || existing?.md_url,
      subject_readme_url: fav.subject_readme_url || existing?.subject_readme_url,
      savedAt: Math.max(existing?.savedAt || 0, fav.savedAt || Date.now()),
    };
    const next = [
      nextItem,
      ...current.filter((entry) => getFavIdentity(entry) !== identity),
    ].sort((a, b) => {
      if ((b.savedAt || 0) !== (a.savedAt || 0)) {
        return (b.savedAt || 0) - (a.savedAt || 0);
      }
      return a.topic_name.localeCompare(b.topic_name);
    });

    store.byUser[userKey] = next;
    await writeFavoritesFile(store);

    return next;
  });
}

export async function removeFav(userKey: string, slug: string, kind: FavTopic["kind"] = "topic") {
  return queueWrite(async () => {
    const store = await readFavoritesFile();
    const current = store.byUser[userKey] || [];
    const identity = `${kind || "topic"}:${slug}`;
    const next = current.filter((entry) => getFavIdentity(entry) !== identity);

    store.byUser[userKey] = next;
    await writeFavoritesFile(store);

    return next;
  });
}

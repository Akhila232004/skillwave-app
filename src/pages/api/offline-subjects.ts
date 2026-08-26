import { promises as fs } from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../lib/authOptions";

type OfflineTopic = {
  topic_name: string;
  md_url: string;
  bullets?: string[];
  section_markdown?: string;
};

type OfflineSubjectMeta = {
  subject: string;
  savedAt: number;
  topicCount: number;
  topics: OfflineTopic[];
  subject_readme_url?: string;
};

type OfflineSubjectsFile = {
  byUser: Record<string, OfflineSubjectMeta[]>;
};

const OFFLINE_SUBJECTS_FILE = path.join(process.cwd(), "data", "offline-subjects.json");

let writeQueue = Promise.resolve();

const normalizeOfflineTopic = (value: unknown): OfflineTopic | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const topic_name = String(record.topic_name || "").trim();
  const md_url = String(record.md_url || "").trim();

  if (!topic_name || !md_url) {
    return null;
  }

  return {
    topic_name,
    md_url,
    bullets: Array.isArray(record.bullets)
      ? record.bullets.filter((item): item is string => typeof item === "string")
      : undefined,
    section_markdown:
      typeof record.section_markdown === "string" ? record.section_markdown : undefined,
  };
};

const normalizeOfflineSubjectMeta = (value: unknown): OfflineSubjectMeta | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const subject = String(record.subject || "").trim();
  const savedAt = Number(record.savedAt);
  const topicCount = Number(record.topicCount);
  const topics = Array.isArray(record.topics)
    ? record.topics
        .map((item) => normalizeOfflineTopic(item))
        .filter((item): item is OfflineTopic => Boolean(item))
    : [];

  if (!subject || !Number.isFinite(savedAt)) {
    return null;
  }

  return {
    subject,
    savedAt,
    topicCount: Number.isFinite(topicCount) ? topicCount : topics.length,
    topics,
    subject_readme_url:
      typeof record.subject_readme_url === "string" ? record.subject_readme_url : undefined,
  };
};

async function ensureOfflineSubjectsFile() {
  await fs.mkdir(path.dirname(OFFLINE_SUBJECTS_FILE), { recursive: true });

  try {
    await fs.access(OFFLINE_SUBJECTS_FILE);
  } catch {
    await fs.writeFile(OFFLINE_SUBJECTS_FILE, JSON.stringify({ byUser: {} }, null, 2), "utf8");
  }
}

async function readOfflineSubjectsFile(): Promise<OfflineSubjectsFile> {
  await ensureOfflineSubjectsFile();

  try {
    const raw = await fs.readFile(OFFLINE_SUBJECTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as { byUser?: Record<string, unknown[]> };

    const byUser = Object.fromEntries(
      Object.entries(parsed?.byUser || {}).map(([userKey, items]) => [
        userKey,
        Array.isArray(items)
          ? items
              .map((entry) => normalizeOfflineSubjectMeta(entry))
              .filter((entry): entry is OfflineSubjectMeta => Boolean(entry))
          : [],
      ])
    );

    return { byUser };
  } catch {
    return { byUser: {} };
  }
}

async function writeOfflineSubjectsFile(data: OfflineSubjectsFile) {
  await ensureOfflineSubjectsFile();
  await fs.writeFile(OFFLINE_SUBJECTS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function queueWrite<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function getOfflineSubjects(userKey: string) {
  const store = await readOfflineSubjectsFile();
  return [...(store.byUser[userKey] || [])].sort((a, b) => b.savedAt - a.savedAt);
}

async function upsertOfflineSubject(userKey: string, meta: OfflineSubjectMeta) {
  return queueWrite(async () => {
    const normalized = normalizeOfflineSubjectMeta(meta);
    if (!normalized) {
      throw new Error("Invalid offline subject payload");
    }

    const store = await readOfflineSubjectsFile();
    const current = store.byUser[userKey] || [];
    const next = [
      normalized,
      ...current.filter(
        (entry) => entry.subject.trim().toLowerCase() !== normalized.subject.trim().toLowerCase()
      ),
    ].sort((a, b) => b.savedAt - a.savedAt);

    store.byUser[userKey] = next;
    await writeOfflineSubjectsFile(store);
    return next;
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user as { id?: string; email?: string | null } | undefined;
  const userKey = sessionUser?.id || sessionUser?.email || "";

  if (!userKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    return res.status(200).json(await getOfflineSubjects(userKey));
  }

  if (req.method === "POST") {
    try {
      const updated = await upsertOfflineSubject(userKey, req.body as OfflineSubjectMeta);
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid offline subject payload",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

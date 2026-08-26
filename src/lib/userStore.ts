import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
  provider?: "credentials" | "google" | "facebook";

  whatsappNumber?: string;
  whatsappPremierAccess?: boolean;
  whatsappPremierAccessAt?: string;
};

export type WhatsAppPremierRequest = {
  id: string;
  whatsappNumber: string;
  requestedAt: string;
  userId?: string;
};

type UserStoreFile = {
  users: StoredUser[];
  whatsappPremierRequests: WhatsAppPremierRequest[];
};

type AddUserInput = {
  fullName: string;
  email: string;
  password?: string;
  provider?: "credentials" | "google" | "facebook";
};

export type AddUserResult =
  | {
      ok: true;
      status: 201;
      user: StoredUser;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const USERS_FILE = path.join(
  process.cwd(),
  "data",
  "users.json"
);

const LEGACY_SHA256_RE = /^[a-f0-9]{64}$/i;

const PASSWORD_PREFIX = "scrypt";

const SCRYPT_KEY_LENGTH = 64;

let writeQueue = Promise.resolve();

const normalizeStoredUser = (
  value: unknown
): StoredUser | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  const id = String(
    record.id || ""
  ).trim();

  const fullName = String(
    record.fullName || ""
  ).trim();

  const email = normalizeEmail(
    record.email
  );

  const createdAt = String(
    record.createdAt || ""
  ).trim();

  const passwordHash =
    typeof record.passwordHash === "string" &&
    record.passwordHash.trim()
      ? record.passwordHash.trim()
      : undefined;

  const provider =
    record.provider === "credentials" ||
    record.provider === "google" ||
    record.provider === "facebook"
      ? record.provider
      : passwordHash
      ? "credentials"
      : "google";

  const whatsappNumber =
    typeof record.whatsappNumber === "string" &&
    record.whatsappNumber.trim()
      ? record.whatsappNumber.trim()
      : undefined;

  const whatsappPremierAccess =
    record.whatsappPremierAccess === true;

  const whatsappPremierAccessAt =
    typeof record.whatsappPremierAccessAt ===
      "string" &&
    record.whatsappPremierAccessAt.trim()
      ? record.whatsappPremierAccessAt.trim()
      : undefined;

  if (
    !id ||
    !fullName ||
    !email ||
    !createdAt
  ) {
    return null;
  }

  return {
    id,
    fullName,
    email,
    passwordHash,
    createdAt,
    provider,
    whatsappNumber,
    whatsappPremierAccess,
    whatsappPremierAccessAt,
  };
};

const normalizeWhatsAppNumber = (
  value: string
) => {
  return String(value || "")
    .trim()
    .replace(/[^\d+]/g, "");
};

const normalizePremierRequest = (
  value: unknown
): WhatsAppPremierRequest | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  const id = String(
    record.id || ""
  ).trim();

  const whatsappNumber =
    normalizeWhatsAppNumber(
      String(record.whatsappNumber || "")
    );

  const requestedAt = String(
    record.requestedAt || ""
  ).trim();

  const userId =
    typeof record.userId === "string" &&
    record.userId.trim()
      ? record.userId.trim()
      : undefined;

  if (
    !id ||
    !whatsappNumber ||
    !requestedAt
  ) {
    return null;
  }

  return {
    id,
    whatsappNumber,
    requestedAt,
    userId,
  };
};

async function ensureUsersFile() {
  await fs.mkdir(
    path.dirname(USERS_FILE),
    {
      recursive: true,
    }
  );

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(
      USERS_FILE,
      JSON.stringify(
        {
          users: [],
          whatsappPremierRequests: [],
        },
        null,
        2
      ),
      "utf8"
    );
  }
}

async function readUserStore(): Promise<UserStoreFile> {
  await ensureUsersFile();

  try {
    const raw = await fs.readFile(
      USERS_FILE,
      "utf8"
    );

    const parsed = JSON.parse(raw) as {
      users?: unknown[];
      whatsappPremierRequests?: unknown[];
    };

    const users = Array.isArray(
      parsed?.users
    )
      ? parsed.users
          .map((entry) =>
            normalizeStoredUser(entry)
          )
          .filter(
            (
              entry
            ): entry is StoredUser =>
              Boolean(entry)
          )
      : [];

    const whatsappPremierRequests =
      Array.isArray(
        parsed?.whatsappPremierRequests
      )
        ? parsed.whatsappPremierRequests
            .map((entry) =>
              normalizePremierRequest(entry)
            )
            .filter(
              (
                entry
              ): entry is WhatsAppPremierRequest =>
                Boolean(entry)
            )
        : [];

    return {
      users,
      whatsappPremierRequests,
    };
  } catch {
    return {
      users: [],
      whatsappPremierRequests: [],
    };
  }
}

async function writeUserStore(
  store: UserStoreFile
) {
  await ensureUsersFile();

  await fs.writeFile(
    USERS_FILE,
    JSON.stringify(
      store,
      null,
      2
    ),
    "utf8"
  );
}

function queueWrite<T>(
  task: () => Promise<T>
) {
  const run = writeQueue.then(
    task,
    task
  );

  writeQueue = run.then(
    () => undefined,
    () => undefined
  );

  return run;
}

function hashLegacyPassword(
  password: string
) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export function hashPassword(
  password: string
) {
  const salt =
    crypto.randomBytes(16).toString("hex");

  const derived = crypto
    .scryptSync(
      password,
      salt,
      SCRYPT_KEY_LENGTH
    )
    .toString("hex");

  return `${PASSWORD_PREFIX}:${salt}:${derived}`;
}

export function verifyPassword(
  password: string,
  storedHash?: string | null
) {
  if (!storedHash) {
    return false;
  }

  if (
    storedHash.startsWith(
      `${PASSWORD_PREFIX}:`
    )
  ) {
    const [
      ,
      salt,
      expectedHex,
    ] = storedHash.split(":");

    if (!salt || !expectedHex) {
      return false;
    }

    const derived =
      crypto.scryptSync(
        password,
        salt,
        SCRYPT_KEY_LENGTH
      );

    const expected =
      Buffer.from(
        expectedHex,
        "hex"
      );

    if (
      derived.length !==
      expected.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      derived,
      expected
    );
  }

  if (
    LEGACY_SHA256_RE.test(
      storedHash
    )
  ) {
    const actual =
      Buffer.from(
        hashLegacyPassword(password),
        "hex"
      );

    const expected =
      Buffer.from(
        storedHash,
        "hex"
      );

    if (
      actual.length !==
      expected.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      actual,
      expected
    );
  }

  return false;
}

export async function findUserByEmail(
  email: string
) {
  const normalizedEmail =
    normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const store =
    await readUserStore();

  return (
    store.users.find(
      (user) =>
        user.email ===
        normalizedEmail
    ) || null
  );
}

export async function findUserById(
  userId: string
) {
  const normalizedId =
    String(userId || "").trim();

  if (!normalizedId) {
    return null;
  }

  const store =
    await readUserStore();

  return (
    store.users.find(
      (user) =>
        user.id === normalizedId
    ) || null
  );
}

export async function addUser(
  input: AddUserInput
): Promise<AddUserResult> {
  const fullName = String(
    input.fullName || ""
  ).trim();

  const email =
    normalizeEmail(input.email);

  const password =
    typeof input.password ===
    "string"
      ? input.password
      : "";

  if (!fullName || !email) {
    return {
      ok: false,
      status: 400,
      message:
        "Full name and email are required.",
    };
  }

  return queueWrite(async () => {
    const store =
      await readUserStore();

    const existing =
      store.users.find(
        (user) =>
          user.email === email
      );

    if (existing) {
      return {
        ok: false as const,
        status: 409,
        message:
          "An account with this email already exists.",
      };
    }

    const provider =
      input.provider ||
      (password
        ? "credentials"
        : "google");

    const user: StoredUser = {
      id: crypto.randomUUID(),

      fullName,

      email,

      createdAt:
        new Date().toISOString(),

      provider,

      ...(password
        ? {
            passwordHash:
              hashPassword(password),
          }
        : {}),
    };

    store.users.push(user);

    await writeUserStore(store);

    return {
      ok: true as const,
      status: 201,
      user,
    };
  });
}

/**
 * Save a Premier Access request before
 * the visitor has authenticated.
 *
 * This makes sure the WhatsApp number is
 * not lost if the user has not logged in yet.
 */
export async function createWhatsAppPremierRequest(
  whatsappNumber: string
) {
  const normalizedWhatsAppNumber =
    normalizeWhatsAppNumber(
      whatsappNumber
    );

  if (
    !normalizedWhatsAppNumber
  ) {
    return {
      ok: false as const,
      status: 400,
      message:
        "WhatsApp number is required.",
    };
  }

  const digits =
    normalizedWhatsAppNumber.replace(
      /\D/g,
      ""
    );

  if (
    digits.length < 10 ||
    digits.length > 15
  ) {
    return {
      ok: false as const,
      status: 400,
      message:
        "Please enter a valid WhatsApp number with country code.",
    };
  }

  return queueWrite(async () => {
    const store =
      await readUserStore();

    const existing =
      store.whatsappPremierRequests.find(
        (request) =>
          request.whatsappNumber ===
            normalizedWhatsAppNumber &&
          !request.userId
      );

    if (existing) {
      return {
        ok: true as const,
        status: 200,
        request: existing,
      };
    }

    const request: WhatsAppPremierRequest =
      {
        id: `wa:${crypto.randomUUID()}`,

        whatsappNumber:
          normalizedWhatsAppNumber,

        requestedAt:
          new Date().toISOString(),
      };

    store.whatsappPremierRequests.push(
      request
    );

    await writeUserStore(store);

    return {
      ok: true as const,
      status: 201,
      request,
    };
  });
}

/**
 * Link a Premier Access request
 * to an authenticated user.
 */
export async function saveWhatsAppPremierAccess(
  userId: string,
  whatsappNumber: string
) {
  const normalizedUserId =
    String(userId || "").trim();

  const normalizedWhatsAppNumber =
    normalizeWhatsAppNumber(
      whatsappNumber
    );

  if (!normalizedUserId) {
    return {
      ok: false as const,
      status: 400,
      message:
        "Authenticated user ID is required.",
    };
  }

  if (
    !normalizedWhatsAppNumber
  ) {
    return {
      ok: false as const,
      status: 400,
      message:
        "WhatsApp number is required.",
    };
  }

  const digits =
    normalizedWhatsAppNumber.replace(
      /\D/g,
      ""
    );

  if (
    digits.length < 10 ||
    digits.length > 15
  ) {
    return {
      ok: false as const,
      status: 400,
      message:
        "Please enter a valid WhatsApp number with country code.",
    };
  }

  return queueWrite(async () => {
    const store =
      await readUserStore();

    const userIndex =
      store.users.findIndex(
        (user) =>
          user.id ===
          normalizedUserId
      );

    if (userIndex === -1) {
      return {
        ok: false as const,
        status: 404,
        message:
          "User account was not found.",
      };
    }

    const now =
      new Date().toISOString();

    const updatedUser: StoredUser =
      {
        ...store.users[userIndex],

        whatsappNumber:
          normalizedWhatsAppNumber,

        whatsappPremierAccess:
          true,

        whatsappPremierAccessAt:
          now,
      };

    store.users[userIndex] =
      updatedUser;

    const pendingRequestIndex =
      store.whatsappPremierRequests.findIndex(
        (request) =>
          request.whatsappNumber ===
            normalizedWhatsAppNumber &&
          !request.userId
      );

    if (
      pendingRequestIndex >= 0
    ) {
      store.whatsappPremierRequests[
        pendingRequestIndex
      ] = {
        ...store.whatsappPremierRequests[
          pendingRequestIndex
        ],
        userId:
          normalizedUserId,
      };
    } else {
      store.whatsappPremierRequests.push(
        {
          id: `wa:${crypto.randomUUID()}`,

          whatsappNumber:
            normalizedWhatsAppNumber,

          requestedAt: now,

          userId:
            normalizedUserId,
        }
      );
    }

    await writeUserStore(store);

    return {
      ok: true as const,
      status: 200,
      user: updatedUser,
    };
  });
}

export function normalizeEmail(
  email: unknown
): string {
  return String(email || "")
    .trim()
    .toLowerCase();
}
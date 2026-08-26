import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmail, normalizeEmail, verifyPassword } from "../../../../lib/userStore";

type Success = {
  ok: true;
  user: { id: string; fullName: string; email: string };
};

type Fail = {
  ok: false;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Success | Fail>) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const body = req.body || {};
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Missing fields: email, password" });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ ok: false, message: "No account found. Please sign up first." });
  }

  // If user is Google-only (no passwordHash), block password login
  if (!user.passwordHash) {
    return res.status(401).json({ ok: false, message: "Please sign in with Google." });
  }

  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "Invalid credentials." });
  }

  return res.status(200).json({
    ok: true,
    user: { id: user.id, fullName: user.fullName, email: user.email },
  });
}
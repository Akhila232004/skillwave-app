import { addUser, normalizeEmail } from "../../../../lib/userStore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const body = req.body || {};

  const fullName = String(body.fullName || body.name || "").trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  const missing = [];
  if (!fullName) missing.push("fullName");
  if (!email) missing.push("email");
  if (!password) missing.push("password");

  if (missing.length) {
    return res.status(400).json({
      ok: false,
      message: `Missing fields: ${missing.join(", ")}`,
    });
  }

  const result = await addUser({ fullName, email, password });

  if (!result.ok) {
    return res.status(result.status || 400).json({ ok: false, message: result.message });
  }

  return res.status(result.status).json({
    ok: true,
    user: { id: result.user.id, fullName: result.user.fullName, email: result.user.email },
  });
}

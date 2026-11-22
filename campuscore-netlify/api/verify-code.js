import crypto from "node:crypto";

/**
 * POST /api/verify-code
 * Body: { role: "teacher" | "principal", code: string, branch?: string }
 *
 * The authorization code never exists in the frontend bundle. It is compared
 * against server-only environment variables using a constant-time comparison.
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Allow", "POST");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ authenticated: false, error: "Method not allowed." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ authenticated: false, error: "A JSON request body is required." });
  }

  const { role, code } = body;

  if (typeof role !== "string" || !["teacher", "principal"].includes(role)) {
    return res.status(400).json({ authenticated: false, error: "A valid role is required." });
  }

  if (typeof code !== "string" || code.trim().length === 0) {
    return res.status(400).json({ authenticated: false, error: "An authorization code is required." });
  }

  const expected = role === "teacher" ? process.env.TEACHER_ACCESS_CODE : process.env.PRINCIPAL_ACCESS_CODE;

  if (typeof expected !== "string" || expected.length === 0) {
    return res.status(503).json({
      authenticated: false,
      error: "Authorization is not configured on this deployment.",
    });
  }

  const providedBuffer = Buffer.from(code, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  let authenticated = false;
  if (providedBuffer.length === expectedBuffer.length) {
    authenticated = crypto.timingSafeEqual(providedBuffer, expectedBuffer);
  }

  if (!authenticated) {
    return res.status(401).json({ authenticated: false, error: "Invalid authorization code." });
  }

  return res.status(200).json({ authenticated: true, role });
}

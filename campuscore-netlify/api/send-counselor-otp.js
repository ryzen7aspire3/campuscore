import crypto from "node:crypto";
import nodemailer from "nodemailer";

const OTP_TTL_MS = 5 * 60 * 1000;

const getSecret = () => process.env.OTP_SECRET || process.env.PRINCIPAL_ACCESS_CODE || "";

const sign = (otp, expiresAt, nonce) =>
  crypto.createHmac("sha256", getSecret()).update(`${otp}.${expiresAt}.${nonce}`).digest("hex");

const toBase64Url = (value) => Buffer.from(value, "utf8").toString("base64url");

const fromBase64Url = (value) => Buffer.from(value, "base64url").toString("utf8");

const safeEqual = (left, right) => {
  const a = Buffer.from(String(left), "utf8");
  const b = Buffer.from(String(right), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

function maskEmail(email) {
  const [user, domain] = String(email).split("@");
  if (!user || !domain) return "the registered counselor inbox";
  const visible = user.slice(0, 1);
  return `${visible}${"*".repeat(Math.min(4, Math.max(2, user.length - 1)))}@${domain}`;
}

/**
 * POST /api/send-counselor-otp
 * Body: { action: "send" } | { action: "verify", code: "1234", challengeToken: "..." }
 *
 * The OTP itself is never returned to the client. The challenge token carries
 * only the expiry, a nonce and an HMAC signature, so it cannot be replayed
 * without the emailed 4-digit code.
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Allow", "POST");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ sent: false, verified: false, error: "Method not allowed." });
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
    return res.status(400).json({ sent: false, verified: false, error: "A JSON request body is required." });
  }

  const action = body.action;

  if (action !== "send" && action !== "verify") {
    return res.status(400).json({ sent: false, verified: false, error: "Action must be send or verify." });
  }

  const secret = getSecret();
  if (!secret) {
    return res.status(503).json({
      sent: false,
      verified: false,
      error: "OTP signing is not configured on this deployment.",
    });
  }

  /* ----------------------------------------------------------------
     SEND — generate a 4-digit OTP, email it, return a signed challenge
     ---------------------------------------------------------------- */
  if (action === "send") {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      return res.status(503).json({
        sent: false,
        verified: false,
        error: "Email delivery is not configured on this deployment.",
      });
    }

    const otp = String(crypto.randomInt(1000, 10000));
    const expiresAt = Date.now() + OTP_TTL_MS;
    const nonce = crypto.randomBytes(16).toString("hex");
    const signature = sign(otp, expiresAt, nonce);
    const challengeToken = toBase64Url(`${expiresAt}.${nonce}.${signature}`);
    const recipient = process.env.COUNSELOR_EMAIL || gmailUser;

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPassword },
      });

      await transporter.sendMail({
        from: `CampusCore Security <${gmailUser}>`,
        to: recipient,
        subject: "CampusCore · Counselor Vault Access Code",
        text: [
          "CampusCore — City Montessori School",
          "",
          `Your confidential counselor access code is: ${otp}`,
          "",
          "This code expires in 5 minutes and can be used once.",
          "If you did not request this code, please contact the Principal's office immediately.",
        ].join("\n"),
        html: `
          <div style="background:#06080E;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#E2E8F0;">
            <div style="max-width:520px;margin:0 auto;background:#0B0F19;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;color:#818CF8;text-transform:uppercase;">CampusCore · Confidential</p>
              <h1 style="margin:0 0 18px;font-size:20px;color:#FFFFFF;">Counselor Vault Access Code</h1>
              <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#94A3B8;">Use the code below to unlock the Student Voice confidential vault for this session.</p>
              <div style="background:#06080E;border:1px solid rgba(99,102,241,0.35);border-radius:14px;padding:20px;text-align:center;">
                <span style="font-family:'Courier New',monospace;font-size:38px;font-weight:bold;letter-spacing:12px;color:#A5B4FC;">${otp}</span>
              </div>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#64748B;">This code expires in <strong style="color:#CBD5E1;">5 minutes</strong>. CampusCore never stores or displays this code in the browser.</p>
              <p style="margin:10px 0 0;font-size:11px;line-height:1.6;color:#475569;">If you did not request this code, contact the Principal's office immediately.</p>
            </div>
          </div>
        `,
      });
    } catch {
      return res.status(502).json({
        sent: false,
        verified: false,
        error: "The counselor code could not be delivered. Verify the Gmail SMTP configuration.",
      });
    }

    return res.status(200).json({
      sent: true,
      challengeToken,
      destination: maskEmail(recipient),
      expiresIn: 300,
    });
  }

  /* ----------------------------------------------------------------
     VERIFY — check format, expiry and HMAC signature
     ---------------------------------------------------------------- */
  const { code, challengeToken } = body;

  if (typeof code !== "string" || !/^\d{4}$/.test(code.trim())) {
    return res.status(401).json({ verified: false, error: "A valid 4-digit code is required." });
  }

  if (typeof challengeToken !== "string" || challengeToken.length === 0) {
    return res.status(400).json({ verified: false, error: "A challenge token is required." });
  }

  let decoded;
  try {
    decoded = fromBase64Url(challengeToken);
  } catch {
    return res.status(401).json({ verified: false, error: "Invalid or expired challenge token." });
  }

  const parts = decoded.split(".");
  if (parts.length !== 3) {
    return res.status(401).json({ verified: false, error: "Invalid or expired challenge token." });
  }

  const [expiresAtRaw, nonce, signature] = parts;
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return res.status(401).json({ verified: false, error: "This code has expired. Request a new one." });
  }

  if (!nonce || !signature) {
    return res.status(401).json({ verified: false, error: "Invalid or expired challenge token." });
  }

  const expectedSignature = sign(code.trim(), expiresAt, nonce);

  if (!safeEqual(signature, expectedSignature)) {
    return res.status(401).json({ verified: false, error: "The code is invalid or has expired." });
  }

  return res.status(200).json({ verified: true, role: "counselor" });
}

# CampusCore — CMS Multi-Campus Executive OS

A production-grade, dark glassmorphism operating system for **City Montessori School (CMS), Lucknow** — 18 campuses, 8 executive modules, and a DeepSeek R1 study studio grounded in live web research.

Built with **React + Vite + Tailwind CSS + Lucide React**, deployed on **Vercel** with secure Node.js serverless functions.

---

## Run locally

```bash
npm install
npm run dev          # frontend on http://localhost:5173
```

The frontend alone does **not** serve `/api/*`. To exercise authentication, OTP email and the AI studio locally, install the Vercel CLI and run the full stack:

```bash
npm i -g vercel
vercel dev           # frontend + serverless functions
```

`npm run build` produces the production bundle in `dist/`; `npm run preview` serves it.

---

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `TEACHER_ACCESS_CODE` | Yes | Server-side teacher authorization code |
| `PRINCIPAL_ACCESS_CODE` | Yes | Server-side principal authorization code |
| `OTP_SECRET` | Recommended | HMAC key for counselor OTP challenges (falls back to `PRINCIPAL_ACCESS_CODE`) |
| `GMAIL_USER` | For OTP | Gmail address used by Nodemailer |
| `GMAIL_APP_PASSWORD` | For OTP | 16-character Gmail App Password (not the account password) |
| `COUNSELOR_EMAIL` | Optional | Counselor inbox; defaults to `GMAIL_USER` |
| `OPENROUTER_API_KEY` | Optional | Enables DeepSeek R1 via OpenRouter |

No credential, OTP, or hint exists in the frontend bundle. If a variable is missing, the endpoint fails closed with a clear configuration error.

### Gmail SMTP setup

1. Enable 2-Step Verification on the Gmail account.
2. Create an **App Password** (Google Account → Security → App passwords).
3. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Vercel.

---

## Security model

- `api/verify-code.js` compares codes using `crypto.timingSafeEqual` against server-only environment variables and rejects malformed input with HTTP 400.
- `api/send-counselor-otp.js` generates a cryptographically random 4-digit OTP with `crypto.randomInt`, signs `otp.expiry.nonce` with HMAC-SHA256, and returns only a challenge token — never the OTP. Verification checks the 5-minute expiry and uses a constant-time signature comparison.
- `api/school-assistant.js` performs live Wikipedia research, optionally reasons with `deepseek/deepseek-r1:free` on OpenRouter, and always returns a structured fallback guide with HTTP 200 if the model is missing or rate-limited.
- All eight modules persist state in `localStorage` under `cms_branch_<branchId>`, so each of the 18 campuses maintains an independent ledger.

---

## Modules

1. **ClubConnect** — branch events, category filters, capacity bars, student registration with verifiable digital passes, faculty event publishing.
2. **School Chronicle** — campus news, gold-sealed CISCE/Principal circulars, likes, bookmarks, full reader, faculty publishing.
3. **Student Voice** — zero-knowledge anonymous safety reports with private `SV-XXXX` tokens, student lookup, and an OTP-locked counselor vault with status workflows and confidential replies.
4. **Teachers Report** — automated Red (-20 / principal escalation), Blue (-5), and Green (+10) cards with neon KPIs, filters, search, and faculty issuance.
5. **Digital Library** — shelf-coded catalogue, all-18-campus network search, instant reservation by roll number, faculty acquisitions.
6. **Wall of Fame** — gold/silver/bronze laureate cards for 99%+ board toppers, olympiad medalists, athletes and artists, with applause and faculty induction.
7. **Principal Command** — server-gated executive metrics, red-card closure, critical wellbeing alerts, a pinned broadcast directive, and the 18-campus performance matrix.
8. **School Assistant** — six subject lenses, four study modes, six starter prompts, multi-step reasoning indicator, cited Wikipedia sources, copyable code blocks, per-branch saved vault, and Markdown export.

---

## Deployment

1. Push this repository to GitHub.
2. Import it into Vercel (framework preset: **Vite**).
3. Add the environment variables above.
4. Deploy. `vercel.json` rewrites every non-API route to `index.html` and leaves `/api/*` intact.

**Jai Jagat.**

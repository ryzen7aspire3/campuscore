import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Modal } from "./ui";
import { cx } from "../lib/utils";

const ROLES = [
  {
    id: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    description: "Faculty tools, event publishing and behaviour cards.",
  },
  {
    id: "principal",
    label: "Principal",
    icon: ShieldCheck,
    description: "Executive command, escalations and 18-campus analytics.",
  },
  {
    id: "counselor",
    label: "Counselor",
    icon: HeartHandshake,
    description: "Confidential Student Voice vault, unlocked by emailed OTP.",
  },
];

const SERVICE_UNREACHABLE =
  "The secure authorization service is unreachable. Deploy to Vercel with the required environment variables configured, or run `vercel dev` locally.";

export default function AuthModal({ open, onClose, defaultRole = "teacher", campus, onAuthenticated, toast }) {
  const [role, setRole] = useState(defaultRole);
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [counselorStep, setCounselorStep] = useState("request");
  const [challengeToken, setChallengeToken] = useState("");
  const [otp, setOtp] = useState("");
  const [destination, setDestination] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open) return;
    setRole(defaultRole);
    setCode("");
    setShowCode(false);
    setError("");
    setSubmitting(false);
    setCounselorStep("request");
    setChallengeToken("");
    setOtp("");
    setDestination("");
    setCooldown(0);
  }, [open, defaultRole]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const finish = (grantedRole) => {
    onAuthenticated(grantedRole);
    onClose();
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Enter your authorization code.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, code: code.trim(), branch: campus.id }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (response.ok && data.authenticated) {
        toast(`${role === "principal" ? "Principal" : "Teacher"} clearance granted for ${campus.name}.`, "success");
        finish(role);
      } else if (response.status === 503) {
        setError(data.error || "Authorization is not configured on this deployment.");
      } else {
        setError(data.error || "Invalid authorization code.");
      }
    } catch {
      setError(SERVICE_UNREACHABLE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/send-counselor-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", branch: campus.id }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (response.ok && data.sent && data.challengeToken) {
        setChallengeToken(data.challengeToken);
        setDestination(data.destination || "the registered counselor inbox");
        setCounselorStep("verify");
        setCooldown(30);
        toast("A 4-digit code was emailed to the counselor inbox. It expires in 5 minutes.", "success");
      } else if (response.status === 503) {
        setError(data.error || "Email delivery is not configured on this deployment.");
      } else {
        setError(data.error || "Unable to dispatch the counselor code.");
      }
    } catch {
      setError(SERVICE_UNREACHABLE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{4}$/.test(otp.trim())) {
      setError("Enter the 4-digit code exactly as emailed.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/send-counselor-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: otp.trim(), challengeToken }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (response.ok && data.verified) {
        toast("Counselor vault unlocked for this session.", "success");
        finish("counselor");
      } else {
        setError(data.error || "The code is invalid or has expired.");
      }
    } catch {
      setError(SERVICE_UNREACHABLE);
    } finally {
      setSubmitting(false);
    }
  };

  const activeRole = ROLES.find((item) => item.id === role) || ROLES[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Elevate Access"
      subtitle={`Zero-exposure authorization · ${campus.name}`}
      icon={KeyRound}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-start gap-2 text-[10.5px] leading-relaxed text-slate-500">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
          <p>
            Credentials are verified inside a Vercel serverless function and are never bundled into the browser. No
            access code, OTP or hint is stored in this application.
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <Building2 className="h-4 w-4 text-indigo-300" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Authenticating for campus</p>
            <p className="truncate text-xs font-semibold text-slate-200">
              {campus.name} <span className="font-mono text-[10px] text-slate-500">· {campus.code}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-slate-950/60 p-1">
          {ROLES.map((item) => {
            const Icon = item.icon;
            const active = item.id === role;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setRole(item.id);
                  setError("");
                  setCode("");
                }}
                className={cx(
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-[11px] font-semibold transition",
                  active
                    ? "bg-gradient-to-b from-indigo-500/25 to-indigo-500/5 text-white ring-1 ring-inset ring-indigo-400/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                )}
              >
                <Icon className={cx("h-4 w-4", active ? "text-indigo-300" : "text-slate-500")} />
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="-mt-1 text-center text-[11px] leading-relaxed text-slate-500">{activeRole.description}</p>

        {error ? (
          <div className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-[11.5px] leading-relaxed text-rose-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {role === "counselor" ? (
          counselorStep === "request" ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/[0.06] p-4">
                <div className="flex items-center gap-2 text-indigo-200">
                  <Mail className="h-4 w-4" />
                  <p className="text-xs font-bold">Two-step Gmail OTP</p>
                </div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">
                  A cryptographically generated 4-digit code will be sent to the registered counselor inbox. The code
                  expires after five minutes and is never returned to this browser.
                </p>
              </div>
              <button type="button" onClick={handleSendOtp} disabled={submitting} className="btn-primary w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {submitting ? "Dispatching secure code…" : "Email my 4-digit code"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-emerald-200">
                Code sent to <span className="font-semibold">{destination}</span>. It expires in 5 minutes.
              </div>
              <div>
                <label className="label" htmlFor="counselor-otp">
                  Enter 4-digit code
                </label>
                <input
                  id="counselor-otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 text-center font-mono text-2xl tracking-[0.55em] text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                  aria-label="4-digit counselor OTP"
                />
              </div>
              <button type="submit" disabled={submitting || otp.length !== 4} className="btn-primary w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {submitting ? "Verifying…" : "Unlock confidential vault"}
              </button>
              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setCounselorStep("request");
                    setOtp("");
                    setError("");
                  }}
                  className="text-slate-500 transition hover:text-slate-300"
                >
                  Use a different method
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={cooldown > 0 || submitting}
                  className="font-semibold text-indigo-300 transition hover:text-indigo-200 disabled:text-slate-600"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-3">
            <div>
              <label className="label" htmlFor="access-code">
                {role === "principal" ? "Principal authorization code" : "Teacher authorization code"}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="access-code"
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Enter server-verified code"
                  className="input-base pl-9 pr-10 font-mono text-[13px] tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((value) => !value)}
                  aria-label={showCode ? "Hide code" : "Show code"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-slate-200"
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-500">
                This code is checked strictly against the deployment's encrypted environment configuration.
              </p>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {submitting ? "Verifying with server…" : `Authenticate as ${activeRole.label}`}
              {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        )}

        <div className="divider" />
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-600">
          <Lock className="h-3 w-3" />
          Server-verified · No client-side secrets
        </div>
      </div>
    </Modal>
  );
}

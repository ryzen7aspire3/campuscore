import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  HeartHandshake,
  KeyRound,
  Loader2,
  Lock,
  LockKeyhole,
  Mail,
  MessageSquareWarning,
  Search,
  Send,
  ShieldCheck,
  Unlock,
  Inbox,
} from "lucide-react";
import {
  EmptyState,
  Field,
  SectionHeading,
  StatusPill,
} from "./ui";
import { VOICE_CATEGORIES, VOICE_STATUSES } from "../data/cmsData";
import { copyText, cx, formatDateTime, timeAgo, uid } from "../lib/utils";

const URGENCY_TONE = {
  Low: "slate",
  Medium: "amber",
  High: "rose",
  Critical: "rose",
};

const STATUS_TONE = {
  Received: "slate",
  "Under Review": "amber",
  "Action Taken": "cyan",
  Resolved: "emerald",
};

const SERVICE_UNREACHABLE =
  "The secure OTP service is unreachable. Deploy to Vercel with the required environment variables, or run `vercel dev` locally.";

function StatusTimeline({ status }) {
  const activeIndex = Math.max(0, VOICE_STATUSES.indexOf(status));
  return (
    <div className="flex items-center gap-1">
      {VOICE_STATUSES.map((step, index) => {
        const complete = index <= activeIndex;
        return (
          <div key={step} className="flex flex-1 items-center gap-1">
            <div className="flex flex-1 flex-col items-center gap-1">
              <span
                className={cx(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold",
                  complete
                    ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-slate-600"
                )}
              >
                {complete ? <Check className="h-2.5 w-2.5" /> : index + 1}
              </span>
              <span className={cx("text-center text-[8px] font-semibold uppercase tracking-wide", complete ? "text-emerald-300/80" : "text-slate-600")}>
                {step}
              </span>
            </div>
            {index < VOICE_STATUSES.length - 1 ? (
              <span className={cx("mb-4 h-px flex-1", index < activeIndex ? "bg-emerald-400/40" : "bg-white/10")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function TicketThread({ ticket, compact = false }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] font-bold text-indigo-300">{ticket.token}</span>
        <StatusPill tone={STATUS_TONE[ticket.status] || "slate"}>{ticket.status}</StatusPill>
        <StatusPill tone={URGENCY_TONE[ticket.urgency] || "slate"}>{ticket.urgency}</StatusPill>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-slate-600">{timeAgo(ticket.createdAt)}</span>
      </div>
      <p className={cx("mt-2 whitespace-pre-wrap text-[12px] leading-relaxed text-slate-300", compact && "line-clamp-3")}>
        {ticket.message}
      </p>
      <p className="mt-2 text-[10px] text-slate-500">{ticket.category}</p>

      {ticket.replies.length > 0 ? (
        <div className="mt-3 space-y-2 border-t border-white/[0.07] pt-3">
          {ticket.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-emerald-400/15 bg-emerald-500/[0.05] p-2.5">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-300">
                <HeartHandshake className="h-3 w-3" />
                {reply.author}
                <span className="ml-auto font-mono font-normal normal-case tracking-normal text-slate-500">
                  {timeAgo(reply.at)}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-300">{reply.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 border-t border-white/[0.07] pt-2.5 text-[10.5px] text-slate-500">
          <Clock className="h-3 w-3" />
          Awaiting a confidential counselor response.
        </p>
      )}
    </div>
  );
}

export default function StudentVoice({ app }) {
  const { store, update, campus, role, setRole, toast } = app;

  const [form, setForm] = useState({ category: VOICE_CATEGORIES[0], urgency: "Medium", message: "" });
  const [issued, setIssued] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const [lookupToken, setLookupToken] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [otpStep, setOtpStep] = useState("request");
  const [challengeToken, setChallengeToken] = useState("");
  const [otp, setOtp] = useState("");
  const [destination, setDestination] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [vaultFilter, setVaultFilter] = useState("Open");

  const unlocked = role === "counselor" || localUnlocked;

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Keep the vault in step with the global clearance: locking from the navbar
  // must also relock this pane, even if it was unlocked inline.
  useEffect(() => {
    if (role !== "counselor") setLocalUnlocked(false);
  }, [role]);

  const sortedTickets = [...store.voiceTickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const filteredTickets = sortedTickets.filter((ticket) => {
    if (vaultFilter === "Open") return ticket.status !== "Resolved";
    if (vaultFilter === "Resolved") return ticket.status === "Resolved";
    return true;
  });
  const activeTicket = store.voiceTickets.find((ticket) => ticket.id === selectedId) || filteredTickets[0] || null;
  const liveLookup = lookupResult
    ? store.voiceTickets.find((ticket) => ticket.id === lookupResult.id) || null
    : null;

  const unresolved = store.voiceTickets.filter((ticket) => ticket.status !== "Resolved").length;
  const critical = store.voiceTickets.filter(
    (ticket) => (ticket.urgency === "High" || ticket.urgency === "Critical") && ticket.status !== "Resolved"
  ).length;

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = form.message.trim();
    if (message.length < 25) {
      toast("Please describe the concern in at least 25 characters.", "error");
      return;
    }

    const tokens = new Set(store.voiceTickets.map((ticket) => ticket.token));
    let token = "";
    do {
      token = `SV-${1000 + Math.floor(Math.random() * 9000)}`;
    } while (tokens.has(token));

    const now = new Date().toISOString();
    const ticket = {
      id: uid("TKT"),
      token,
      category: form.category,
      urgency: form.urgency,
      message,
      status: "Received",
      createdAt: now,
      updatedAt: now,
      replies: [],
    };

    update((draft) => {
      draft.voiceTickets.unshift(ticket);
      return draft;
    });

    setIssued({ token, at: now });
    setForm({ category: VOICE_CATEGORIES[0], urgency: "Medium", message: "" });
    setLookupResult(null);
    setLookupError("");
    toast("Anonymous report sealed. Save your token to read the counselor's reply.", "success");
  };

  const copyToken = async (token) => {
    const ok = await copyText(token);
    if (ok) {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 1600);
      toast("Tracking token copied.", "success");
    } else {
      toast("Clipboard access was blocked by the browser.", "error");
    }
  };

  const handleLookup = (event) => {
    event.preventDefault();
    const token = lookupToken.trim().toUpperCase();
    if (!token) {
      setLookupError("Enter the private token you received when you submitted the report.");
      setLookupResult(null);
      return;
    }
    const ticket = store.voiceTickets.find((item) => item.token.toUpperCase() === token);
    if (!ticket) {
      setLookupResult(null);
      setLookupError(`No report was found for ${token} on ${campus.name}. Tokens are campus-specific.`);
      return;
    }
    setLookupResult(ticket);
    setLookupError("");
  };

  const handleSendOtp = async () => {
    setOtpError("");
    setSending(true);
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
        setOtpStep("verify");
        setCooldown(30);
        toast("A 4-digit code was emailed to the counselor inbox.", "success");
      } else if (response.status === 503) {
        setOtpError(data.error || "Email delivery is not configured on this deployment.");
      } else {
        setOtpError(data.error || "Unable to dispatch the counselor code.");
      }
    } catch {
      setOtpError(SERVICE_UNREACHABLE);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setOtpError("");
    if (!/^\d{4}$/.test(otp.trim())) {
      setOtpError("Enter the 4-digit code exactly as emailed.");
      return;
    }
    setVerifying(true);
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
        setLocalUnlocked(true);
        setRole("counselor");
        setOtp("");
        setOtpError("");
        toast("Counselor confidential vault unlocked.", "success");
      } else {
        setOtpError(data.error || "The code is invalid or has expired.");
      }
    } catch {
      setOtpError(SERVICE_UNREACHABLE);
    } finally {
      setVerifying(false);
    }
  };

  const lockVault = () => {
    setLocalUnlocked(false);
    setRole(null);
    setOtpStep("request");
    setChallengeToken("");
    setOtp("");
    setReplyText("");
    toast("Counselor vault locked.", "info");
  };

  const updateStatus = (ticketId, status) => {
    update((draft) => {
      const ticket = draft.voiceTickets.find((item) => item.id === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
      }
      return draft;
    });
    toast(`Ticket status updated to ${status}.`, "info");
  };

  const postReply = () => {
    if (!activeTicket) return;
    const text = replyText.trim();
    if (text.length < 3) {
      toast("Write a reply before posting.", "error");
      return;
    }
    update((draft) => {
      const ticket = draft.voiceTickets.find((item) => item.id === activeTicket.id);
      if (ticket) {
        ticket.replies.push({
          id: uid("REP"),
          author: "CMS Confidential Counselor",
          text,
          at: new Date().toISOString(),
        });
        if (ticket.status === "Received") ticket.status = "Under Review";
        ticket.updatedAt = new Date().toISOString();
      }
      return draft;
    });
    setReplyText("");
    toast(`Confidential reply posted to ${activeTicket.token}.`, "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 03 · Zero-Knowledge Safety"
        title="Student Voice"
        description={`An anonymous safety portal for ${campus.name}. Students receive a private token; only the counselor vault can read and reply — no names, emails or roll numbers are stored.`}
        icon={MessageSquareWarning}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill tone="emerald" pulse>
              {unresolved} open
            </StatusPill>
            {critical > 0 ? <StatusPill tone="rose">{critical} critical</StatusPill> : null}
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---------------- Left: anonymous student portal ---------------- */}
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-[70px]" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">Anonymous Submission</h3>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-400">
                  Your identity is never requested or stored. The only link to your report is the private token generated
                  below.
                </p>
              </div>
            </div>

            {issued ? (
              <div className="relative mt-5 rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-cyan-500/5 p-5 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">Report sealed</p>
                <p className="mt-1 text-[11.5px] text-slate-400">Your private tracking token</p>
                <p className="mt-1 font-mono text-3xl font-bold tracking-[0.18em] text-white">{issued.token}</p>
                <p className="mx-auto mt-2 max-w-sm text-[10.5px] leading-relaxed text-slate-500">
                  Write this token down. It is the only way to read the counselor's confidential reply. It cannot be
                  recovered if lost.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => copyToken(issued.token)} className="btn-secondary flex-1 text-xs">
                    {copiedToken ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                    {copiedToken ? "Token copied" : "Copy token"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLookupToken(issued.token);
                      const ticket = store.voiceTickets.find((item) => item.token === issued.token);
                      setLookupResult(ticket || null);
                      setLookupError("");
                    }}
                    className="btn-primary flex-1 text-xs"
                  >
                    <Search className="h-4 w-4" />
                    Track this report
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIssued(null)}
                  className="mt-3 text-[10.5px] font-semibold text-slate-500 underline-offset-2 transition hover:text-slate-300 hover:underline"
                >
                  Submit another anonymous report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Concern category" required>
                    <select
                      value={form.category}
                      onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                      className="select-base"
                    >
                      {VOICE_CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Urgency" required>
                    <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1">
                      {["Low", "Medium", "High", "Critical"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, urgency: level }))}
                          className={cx(
                            "rounded-lg px-1 py-1.5 text-[9.5px] font-bold uppercase tracking-wide transition",
                            form.urgency === level
                              ? level === "Low"
                                ? "bg-slate-500/25 text-white"
                                : level === "Medium"
                                  ? "bg-amber-500/20 text-amber-200"
                                  : "bg-rose-500/20 text-rose-200"
                              : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <Field
                  label="What happened?"
                  required
                  hint={`${form.message.length}/1200 · Do not include your name, phone number, email or roll number.`}
                >
                  <textarea
                    rows={5}
                    maxLength={1200}
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                    placeholder="Describe the concern, when it happened, and where. Facts are enough — you do not need to identify yourself."
                    className="input-base"
                  />
                </Field>

                <div className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.05] px-3 py-2.5 text-[10.5px] leading-relaxed text-emerald-200/90">
                  <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Zero-knowledge design: this form never asks for identifying details, and the browser stores only the
                  token and the concern text on this campus workspace.
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  Submit Anonymously & Generate Token
                </button>
              </form>
            )}
          </div>

          {/* Token lookup */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-300" />
              <h3 className="font-display text-sm font-bold text-white">Track Your Report</h3>
              <StatusPill tone="indigo">Token lookup</StatusPill>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Enter your private token to read the counselor's reply without revealing who you are.
            </p>
            <form onSubmit={handleLookup} className="mt-3 flex gap-2">
              <input
                value={lookupToken}
                onChange={(event) => setLookupToken(event.target.value.toUpperCase())}
                placeholder="SV-1234"
                className="input-base flex-1 font-mono tracking-widest"
                aria-label="Private tracking token"
              />
              <button type="submit" className="btn-secondary shrink-0">
                <Search className="h-4 w-4" />
                Track
              </button>
            </form>
            {lookupError ? (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {lookupError}
              </p>
            ) : null}
            {liveLookup ? (
              <div className="mt-3 space-y-2">
                <StatusTimeline status={liveLookup.status} />
                <TicketThread ticket={liveLookup} />
              </div>
            ) : null}
          </div>
        </div>

        {/* ---------------- Right: counselor confidential vault ---------------- */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-b from-indigo-500/[0.07] via-slate-900/70 to-slate-900/60 p-5 shadow-glass backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-indigo-500/15 blur-[80px]" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-200">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">Counselor Confidential Vault</h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {unlocked ? "Session unlocked · replies are confidential" : "Locked behind Gmail-verified 4-digit OTP"}
                </p>
              </div>
            </div>
            {unlocked ? (
              <button type="button" onClick={lockVault} className="btn-secondary px-2.5 py-1.5 text-[10px]">
                <Lock className="h-3 w-3" />
                Lock
              </button>
            ) : (
              <StatusPill tone="rose" pulse>
                Locked
              </StatusPill>
            )}
          </div>

          {!unlocked ? (
            <div className="relative mt-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <p className="font-display text-sm font-bold text-white">Protected student disclosures</p>
                <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-slate-400">
                  This vault contains anonymous safety reports. Access requires a one-time 4-digit code emailed to the
                  registered counselor inbox and verified server-side.
                </p>

                {otpError ? (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-left text-[10.5px] leading-relaxed text-rose-200">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    {otpError}
                  </div>
                ) : null}

                {otpStep === "request" ? (
                  <button type="button" onClick={handleSendOtp} disabled={sending} className="btn-primary mt-4 w-full">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    {sending ? "Dispatching secure code…" : "Email 4-digit access code"}
                  </button>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3 text-left">
                    <p className="rounded-lg border border-emerald-400/20 bg-emerald-500/[0.06] px-2.5 py-2 text-center text-[10px] leading-relaxed text-emerald-200">
                      Code sent to <span className="font-semibold">{destination}</span>
                    </p>
                    <input
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="••••"
                      aria-label="4-digit counselor OTP"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 text-center font-mono text-xl tracking-[0.5em] text-white outline-none focus:border-indigo-400/60"
                    />
                    <button type="submit" disabled={verifying || otp.length !== 4} className="btn-primary w-full text-xs">
                      {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
                      {verifying ? "Verifying…" : "Unlock vault"}
                    </button>
                    <div className="flex items-center justify-between text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("request");
                          setOtp("");
                          setOtpError("");
                        }}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={cooldown > 0 || sending}
                        className="font-semibold text-indigo-300 disabled:text-slate-600"
                      >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>
                  </form>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-slate-600">
                  <ShieldCheck className="h-3 w-3" />
                  HMAC-signed · 5-minute expiry · {campus.code}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {["Open", "Resolved", "All"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setVaultFilter(filter)}
                    className={cx(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition",
                      vaultFilter === filter
                        ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                        : "border-white/10 text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {filter}
                  </button>
                ))}
                <span className="ml-auto font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                  {filteredTickets.length} case{filteredTickets.length === 1 ? "" : "s"}
                </span>
              </div>

              {filteredTickets.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No cases in this view"
                  description="Anonymous student reports will appear here the moment they are submitted."
                />
              ) : (
                <>
                  <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                    {filteredTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(ticket.id);
                          setReplyText("");
                        }}
                        className={cx(
                          "w-full rounded-xl border px-3 py-2.5 text-left transition",
                          activeTicket?.id === ticket.id
                            ? "border-indigo-400/40 bg-indigo-500/10"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10.5px] font-bold text-indigo-300">{ticket.token}</span>
                          <StatusPill tone={URGENCY_TONE[ticket.urgency] || "slate"}>{ticket.urgency}</StatusPill>
                          <span className="ml-auto shrink-0 font-mono text-[9px] text-slate-600">{timeAgo(ticket.createdAt)}</span>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-slate-400">{ticket.message}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider text-slate-600">{ticket.category}</span>
                          <span className="ml-auto text-[9px] font-semibold text-slate-500">{ticket.status}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {activeTicket ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{activeTicket.token}</span>
                        <StatusPill tone={STATUS_TONE[activeTicket.status] || "slate"}>{activeTicket.status}</StatusPill>
                        <span className="ml-auto font-mono text-[9px] text-slate-500">
                          {formatDateTime(activeTicket.createdAt)}
                        </span>
                      </div>

                      <StatusTimeline status={activeTicket.status} />

                      <p className="mt-3 whitespace-pre-wrap rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-slate-300">
                        {activeTicket.message}
                      </p>

                      <div className="mt-3 space-y-2">
                        {activeTicket.replies.length === 0 ? (
                          <p className="text-[10.5px] text-slate-500">No counselor reply yet.</p>
                        ) : (
                          activeTicket.replies.map((reply) => (
                            <div key={reply.id} className="rounded-lg border border-emerald-400/15 bg-emerald-500/[0.05] p-2.5">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                                {reply.author} · {timeAgo(reply.at)}
                              </p>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{reply.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                        <select
                          value={activeTicket.status}
                          onChange={(event) => updateStatus(activeTicket.id, event.target.value)}
                          className="select-base py-2 text-xs"
                          aria-label="Update case status"
                        >
                          {VOICE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              Status: {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => updateStatus(activeTicket.id, "Resolved")}
                          disabled={activeTicket.status === "Resolved"}
                          className="btn-secondary px-3 py-2 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Seal resolved
                        </button>
                      </div>

                      <div className="mt-3">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          placeholder={`Write a confidential reply to ${activeTicket.token}…`}
                          className="input-base text-[12px]"
                        />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="flex items-center gap-1 text-[9.5px] text-slate-600">
                            <Lock className="h-3 w-3" />
                            Visible only via this student's token
                          </p>
                          <button type="button" onClick={postReply} className="btn-primary px-3 py-2 text-xs">
                            <Send className="h-3.5 w-3.5" />
                            Post reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-[9.5px] leading-relaxed text-slate-500">
                <KeyRound className="mt-0.5 h-3 w-3 shrink-0" />
                Every reply is written into the campus vault and revealed only when the student presents the matching
                token. No student identity is attached to any case.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

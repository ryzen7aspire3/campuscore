import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  Library,
  Megaphone,
  MessageSquareWarning,
  ShieldAlert,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Field,
  LockedPanel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "./ui";
import { computeHealth, getCampus } from "../data/cmsData";
import { loadAllBranches } from "../lib/storage";
import { cx, formatDateTime, formatNumber, timeAgo } from "../lib/utils";

const SEVERITY_TONES = {
  info: { label: "Information", tone: "indigo", bar: "from-indigo-500 to-cyan-400" },
  urgent: { label: "Urgent", tone: "rose", bar: "from-rose-500 to-pink-400" },
  celebratory: { label: "Celebration", tone: "gold", bar: "from-amber-400 to-yellow-300" },
};

const EMPTY_DIRECTIVE = { title: "", message: "", severity: "info" };

function healthLabel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Stable";
  return "Attention";
}

function scoreTone(score) {
  if (score >= 90) return "emerald";
  if (score >= 80) return "cyan";
  if (score >= 70) return "amber";
  return "rose";
}

export default function PrincipalCommand({ app }) {
  const { store, update, campus, role, openAuth, toast, setTab } = app;
  const [composerOpen, setComposerOpen] = useState(!store.directive);
  const [directiveForm, setDirectiveForm] = useState(EMPTY_DIRECTIVE);

  const health = useMemo(() => computeHealth(store), [store]);
  const unresolvedReds = store.behaviorCards.filter((card) => card.type === "red" && !card.resolved);
  const criticalVoice = store.voiceTickets.filter(
    (ticket) => (ticket.urgency === "High" || ticket.urgency === "Critical") && ticket.status !== "Resolved"
  );

  const network = useMemo(() => {
    const rows = loadAllBranches().map((branchStore) => {
      const meta = getCampus(branchStore.campusId);
      return {
        id: branchStore.campusId,
        name: meta.name,
        code: meta.code,
        accent: meta.accent,
        health: computeHealth(branchStore),
        current: branchStore.campusId === campus.id,
      };
    });
    return rows.sort((a, b) => b.health.score - a.health.score);
  }, [store, campus.id]);

  if (role !== "principal") {
    return (
      <div className="animate-fade-up">
        <SectionHeading
          eyebrow="Module 07 · Executive Command"
          title="Principal Command"
          description="Branch health, red-card escalations, critical wellbeing alerts and the 18-campus performance matrix."
          icon={ShieldAlert}
        />
        <LockedPanel
          icon={ShieldAlert}
          title="Principal Command is sealed"
          description="This module exposes sensitive escalation records and network-wide performance intelligence. Executive clearance is required for every session."
          onUnlock={() => openAuth("principal")}
          unlockLabel="Authenticate as Principal"
          footer="Clearance is verified inside a serverless function. No principal code exists in this browser bundle."
        />
      </div>
    );
  }

  const averageScore = Math.round(network.reduce((sum, row) => sum + row.health.score, 0) / network.length);
  const rank = network.findIndex((row) => row.id === campus.id) + 1;

  const publishDirective = (event) => {
    event.preventDefault();
    if (!directiveForm.title.trim() || !directiveForm.message.trim()) {
      toast("A directive title and message are required.", "error");
      return;
    }
    const directive = {
      id: `DIR-${Date.now().toString(36).toUpperCase()}`,
      title: directiveForm.title.trim(),
      message: directiveForm.message.trim(),
      severity: directiveForm.severity,
      issuedBy: campus.principal,
      issuedAt: new Date().toISOString(),
    };
    update((draft) => {
      draft.directive = directive;
      return draft;
    });
    setComposerOpen(false);
    setDirectiveForm(EMPTY_DIRECTIVE);
    toast("Executive directive pinned across the campus OS.", "success");
  };

  const retractDirective = () => {
    update((draft) => {
      draft.directive = null;
      return draft;
    });
    setComposerOpen(true);
    toast("Executive directive retracted.", "info");
  };

  const resolveRed = (id) => {
    update((draft) => {
      const card = draft.behaviorCards.find((item) => item.id === id);
      if (card) card.resolved = true;
      return draft;
    });
    toast("Red-card escalation marked resolved.", "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 07 · Executive Command"
        title="Principal Command"
        description={`Executive intelligence for ${campus.name}, with live comparison across all 18 CMS campuses.`}
        icon={ShieldAlert}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="gold" pulse>
              Principal · {campus.code}
            </StatusPill>
            <button type="button" onClick={() => setTab("voice")} className="btn-secondary text-xs">
              <MessageSquareWarning className="h-3.5 w-3.5" />
              Student Voice Vault
            </button>
          </div>
        }
      />

      {/* Health */}
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.6fr]">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/[0.12] via-slate-900/70 to-slate-900/60 p-5 shadow-glow-indigo backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/15 blur-[60px]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-indigo-300/80">Branch health index</p>
              <h3 className="mt-1 font-display text-base font-bold text-white">{campus.name}</h3>
            </div>
            <StatusPill tone={scoreTone(health.score)}>{healthLabel(health.score)}</StatusPill>
          </div>

          <div className="mt-5 flex items-center gap-5">
            <div
              className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#818cf8 ${health.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
              }}
            >
              <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-slate-950">
                <span className="metric text-3xl font-bold text-white">{health.score}</span>
                <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-500">of 100</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Network rank</span>
                  <span className="font-mono font-bold text-white">#{rank} / 18</span>
                </div>
                <ProgressBar value={((19 - rank) / 18) * 100} tone="indigo" className="mt-1 h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Network average</span>
                  <span className="font-mono font-bold text-white">{averageScore}</span>
                </div>
                <ProgressBar value={averageScore} tone="cyan" className="mt-1 h-1.5" />
              </div>
              <p className="text-[10px] leading-relaxed text-slate-500">
                Student strength <span className="font-mono text-slate-300">{formatNumber(campus.strength)}</span> ·
                attendance <span className="font-mono text-emerald-300">{campus.attendance}%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <CalendarCheck className="h-3 w-3" /> Attendance
            </p>
            <p className="metric mt-1 text-xl font-bold text-emerald-300">{health.attendance}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <Activity className="h-3 w-3" /> Discipline
            </p>
            <p className="metric mt-1 text-xl font-bold text-cyan-300">{health.disciplineIndex}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <HeartPulse className="h-3 w-3" /> Wellbeing
            </p>
            <p className="metric mt-1 text-xl font-bold text-rose-300">{health.wellbeing}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <Users className="h-3 w-3" /> Club fill
            </p>
            <p className="metric mt-1 text-xl font-bold text-indigo-300">{health.clubParticipation}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <Library className="h-3 w-3" /> Library use
            </p>
            <p className="metric mt-1 text-xl font-bold text-amber-300">{health.libraryUsage}%</p>
          </div>
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-rose-300/80">
              <AlertTriangle className="h-3 w-3" /> Red open
            </p>
            <p className="metric mt-1 text-xl font-bold text-rose-200">{String(health.reds).padStart(2, "0")}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Directive */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300/25 bg-amber-400/10 text-amber-200">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">Executive Broadcast</h3>
                <p className="text-[9.5px] uppercase tracking-wider text-slate-500">Pinned across the OS</p>
              </div>
            </div>
            {store.directive ? <StatusPill tone="emerald" pulse>Live</StatusPill> : <StatusPill tone="slate">No active directive</StatusPill>}
          </div>

          {store.directive && !composerOpen ? (
            <div className="mt-4 rounded-xl border border-amber-300/20 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={SEVERITY_TONES[store.directive.severity]?.tone || "indigo"}>
                  {SEVERITY_TONES[store.directive.severity]?.label || "Information"}
                </StatusPill>
                <span className="font-mono text-[9px] text-slate-500">{timeAgo(store.directive.issuedAt)}</span>
              </div>
              <p className="mt-2 font-display text-[13px] font-bold text-white">{store.directive.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{store.directive.message}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate-600">
                Issued by {store.directive.issuedBy} · {formatDateTime(store.directive.issuedAt)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDirectiveForm({
                      title: store.directive.title,
                      message: store.directive.message,
                      severity: store.directive.severity,
                    });
                    setComposerOpen(true);
                  }}
                  className="btn-secondary px-3 py-1.5 text-[10px]"
                >
                  Replace directive
                </button>
                <button type="button" onClick={retractDirective} className="btn-danger px-3 py-1.5 text-[10px]">
                  <X className="h-3 w-3" />
                  Retract
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={publishDirective} className="mt-4 space-y-3">
              <Field label="Directive title" required>
                <input
                  value={directiveForm.title}
                  onChange={(event) => setDirectiveForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="e.g. Executive Directive: Safety Week"
                  className="input-base text-xs"
                  autoFocus
                />
              </Field>
              <Field label="Message to the campus" required>
                <textarea
                  rows={3}
                  value={directiveForm.message}
                  onChange={(event) => setDirectiveForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="What should students and faculty act on?"
                  className="input-base text-xs"
                />
              </Field>
              <Field label="Severity">
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1">
                  {Object.entries(SEVERITY_TONES).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDirectiveForm((prev) => ({ ...prev, severity: key }))}
                      className={cx(
                        "rounded-lg px-2 py-1.5 text-[9.5px] font-bold uppercase tracking-wide transition",
                        directiveForm.severity === key
                          ? config.tone === "rose"
                            ? "bg-rose-500/20 text-rose-200"
                            : config.tone === "gold"
                              ? "bg-amber-400/20 text-amber-200"
                              : "bg-indigo-500/20 text-indigo-200"
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="flex justify-end gap-2">
                {store.directive ? (
                  <button type="button" onClick={() => setComposerOpen(false)} className="btn-ghost px-3 py-1.5 text-[10px]">
                    Cancel
                  </button>
                ) : null}
                <button type="submit" className="btn-primary px-3 py-1.5 text-[10px]">
                  <Megaphone className="h-3.5 w-3.5" />
                  Publish & Pin Directive
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Critical voice */}
        <div className="rounded-2xl border border-rose-400/20 bg-gradient-to-b from-rose-500/[0.06] to-slate-900/60 p-5 shadow-glass backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-400/25 bg-rose-500/10 text-rose-200">
                <MessageSquareWarning className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">Critical Student Voice</h3>
                <p className="text-[9.5px] uppercase tracking-wider text-slate-500">High & critical · unresolved</p>
              </div>
            </div>
            <StatusPill tone={criticalVoice.length ? "rose" : "emerald"} pulse={criticalVoice.length > 0}>
              {criticalVoice.length} alert{criticalVoice.length === 1 ? "" : "s"}
            </StatusPill>
          </div>

          {criticalVoice.length === 0 ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.05] p-3.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                No unresolved high-severity disclosures. The confidential vault is monitored by the wellness cell.
              </p>
            </div>
          ) : (
            <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
              {criticalVoice.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-rose-400/20 bg-slate-950/40 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10.5px] font-bold text-rose-200">{ticket.token}</span>
                    <StatusPill tone="rose">{ticket.urgency}</StatusPill>
                    <span className="ml-auto text-[9px] text-slate-500">{ticket.category}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-slate-400">{ticket.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-600">{ticket.status}</span>
                    <button
                      type="button"
                      onClick={() => setTab("voice")}
                      className="inline-flex items-center gap-1 text-[9.5px] font-bold text-rose-300 transition hover:text-rose-200"
                    >
                      Open vault
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Red escalations */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-400/25 bg-rose-500/10 text-rose-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Red-Card Escalations</h3>
              <p className="text-[9.5px] uppercase tracking-wider text-slate-500">Automated -20 point cases awaiting executive closure</p>
            </div>
          </div>
          <StatusPill tone={unresolvedReds.length ? "rose" : "emerald"}>
            {unresolvedReds.length} unresolved
          </StatusPill>
        </div>

        {unresolvedReds.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.05] p-3.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
            <p className="text-[11px] text-slate-400">Every red-card escalation has been reviewed and closed.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-2">
            {unresolvedReds.map((card) => (
              <div key={card.id} className="flex flex-col gap-3 rounded-xl border border-rose-400/15 bg-white/[0.02] p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-400/25 bg-rose-500/10 font-mono text-[9px] font-bold text-rose-200">
                    {card.roll.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12px] font-bold text-white">{card.student}</p>
                      <span className="font-mono text-[9px] text-slate-500">
                        {card.className} · {card.roll}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-rose-300">{card.points} pts</span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-400">{card.note}</p>
                    <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-slate-600">
                      {card.issuedBy} · {formatDateTime(card.date)}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => resolveRed(card.id)} className="btn-secondary shrink-0 px-3 py-1.5 text-[10px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 18-campus comparison */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-500/10 text-cyan-200">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">18-Campus Performance Matrix</h3>
              <p className="text-[9.5px] uppercase tracking-wider text-slate-500">Composite health · attendance · discipline · wellbeing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone="cyan">Network avg {averageScore}</StatusPill>
            <StatusPill tone="gold">Rank #{rank}</StatusPill>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {network.map((row, index) => (
            <div
              key={row.id}
              className={cx(
                "flex items-center gap-3 rounded-lg px-2.5 py-1.5",
                row.current ? "border border-indigo-400/25 bg-indigo-500/[0.08]" : "border border-transparent hover:bg-white/[0.02]"
              )}
            >
              <span className="w-6 shrink-0 text-right font-mono text-[9.5px] text-slate-600">{String(index + 1).padStart(2, "0")}</span>
              <span className={cx("h-5 w-0.5 shrink-0 rounded-full bg-gradient-to-b", row.accent)} />
              <span className="w-40 shrink-0 truncate text-[10.5px] font-semibold text-slate-300 sm:w-52">
                {row.name}
                {row.current ? <span className="ml-1.5 text-[8.5px] font-bold uppercase tracking-wider text-indigo-300">You</span> : null}
              </span>
              <div className="min-w-0 flex-1">
                <ProgressBar value={row.health.score} tone={scoreTone(row.health.score)} className="h-1.5" />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[10px] font-bold text-white">{row.health.score}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[9.5px] text-slate-600">
          <TrendingUp className="h-3 w-3" />
          Scores blend attendance (34%), discipline (24%), club participation (18%), wellbeing (16%) and library usage (8%).
        </p>
      </div>
    </div>
  );
}

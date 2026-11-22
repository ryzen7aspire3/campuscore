import { useEffect, useRef, useState } from "react";
import {
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  KeyRound,
  Lock,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { cx, formatNumber, timeAgo } from "../lib/utils";
import { StatusPill } from "./ui";

const ROLE_META = {
  teacher: { label: "Teacher", clearance: "Faculty Clearance", tone: "cyan", icon: UserCheck },
  principal: { label: "Principal", clearance: "Executive Clearance", tone: "gold", icon: ShieldCheck },
  counselor: { label: "Counselor", clearance: "Confidential Clearance", tone: "indigo", icon: UserCheck },
};

const DIRECTIVE_STYLES = {
  urgent: {
    wrapper: "border-rose-400/25 bg-gradient-to-r from-rose-500/15 via-rose-500/[0.04] to-transparent",
    icon: "border-rose-400/30 bg-rose-500/15 text-rose-200",
    label: "text-rose-300",
    tag: "URGENT",
  },
  celebratory: {
    wrapper: "border-amber-300/25 bg-gradient-to-r from-amber-400/15 via-amber-400/[0.04] to-transparent",
    icon: "border-amber-300/30 bg-amber-400/15 text-amber-200",
    label: "text-amber-300",
    tag: "CELEBRATION",
  },
  info: {
    wrapper: "border-indigo-400/25 bg-gradient-to-r from-indigo-500/15 via-indigo-500/[0.04] to-transparent",
    icon: "border-indigo-400/30 bg-indigo-500/15 text-indigo-200",
    label: "text-indigo-300",
    tag: "DIRECTIVE",
  },
};

function CampusSwitcher({ campuses, campus, onCampusChange, fullWidth = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const onDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const filtered = campuses.filter((item) => {
    const haystack = `${item.name} ${item.zone} ${item.code}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div ref={containerRef} className={cx("relative", fullWidth ? "w-full" : "w-[248px]")}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/25 to-cyan-500/10 text-indigo-200 ring-1 ring-inset ring-white/10">
          <Building2 className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Active Campus</span>
          <span className="block truncate text-[13px] font-semibold text-white">{campus.name}</span>
        </span>
        <ChevronDown className={cx("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-scale-in">
          <div className="border-b border-white/10 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search 18 campuses…"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto p-1.5" role="listbox" aria-label="CMS campuses">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-slate-500">No campus matches that search.</p>
            ) : (
              filtered.map((item) => {
                const active = item.id === campus.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onCampusChange(item.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition",
                      active ? "bg-indigo-500/15 text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    <span className={cx("h-7 w-1 rounded-full bg-gradient-to-b", item.accent)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold">{item.name}</span>
                      <span className="block truncate font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                        {item.code} · {item.zone}
                      </span>
                    </span>
                    {active ? <Check className="h-4 w-4 shrink-0 text-indigo-300" /> : null}
                  </button>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-[10px] text-slate-500">
            <span className="font-mono uppercase tracking-wider">18 campuses · Lucknow</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Network live
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone = "text-white", pulse = false, mono = true }) {
  return (
    <div className="flex items-center gap-2 px-3 first:pl-0 last:pr-0">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span>
        <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <span className={cx("flex items-center gap-1.5 text-[12.5px] font-bold", mono && "metric", tone)}>
          {value}
          {pulse ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> : null}
        </span>
      </span>
    </div>
  );
}

export default function Navbar({
  campus,
  campuses,
  onCampusChange,
  role,
  onOpenAuth,
  onLock,
  activeClubs,
  directive,
  onDismissDirective,
}) {
  const roleMeta = role ? ROLE_META[role] : null;
  const RoleIcon = roleMeta?.icon;
  const directiveStyle = DIRECTIVE_STYLES[directive?.severity] || DIRECTIVE_STYLES.info;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-obsidian-900/85 backdrop-blur-2xl">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-indigo-500/10 to-cyan-500/20 shadow-glow-indigo">
              <ShieldCheck className="h-5 w-5 text-indigo-200" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-obsidian-900 bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[17px] font-extrabold leading-none tracking-tight text-white">
                  Campus<span className="text-indigo-300">Core</span>
                </h1>
                <span className="hidden rounded border border-indigo-400/25 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-indigo-300 sm:inline">
                  OS v2
                </span>
              </div>
              <p className="mt-1 hidden truncate text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
                City Montessori School · Executive Network
              </p>
            </div>
          </div>

          {/* Desktop campus switcher */}
          <div className="hidden lg:block">
            <CampusSwitcher campuses={campuses} campus={campus} onCampusChange={onCampusChange} />
          </div>

          {/* KPI telemetry */}
          <div className="hidden items-center divide-x divide-white/[0.07] xl:flex">
            <Kpi icon={Users} label="Students" value={formatNumber(campus.strength)} />
            <Kpi icon={CalendarCheck} label="Attendance" value={`${campus.attendance}%`} tone="text-emerald-300" />
            <Kpi icon={Sparkles} label="Active Clubs" value={String(activeClubs).padStart(2, "0")} tone="text-cyan-300" />
            <Kpi icon={ShieldCheck} label="Security" value="SECURE" tone="text-emerald-300" pulse />
          </div>

          {/* Clearance */}
          <div className="flex shrink-0 items-center gap-2">
            {roleMeta ? (
              <>
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
                  <RoleIcon className="h-4 w-4 text-indigo-300" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {roleMeta.clearance}
                    </p>
                    <p className="text-[12px] font-bold leading-tight text-white">{roleMeta.label}</p>
                  </div>
                </div>
                <button type="button" onClick={onLock} className="btn-secondary px-3 py-2 text-xs" title="Lock clearance">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              </>
            ) : (
              <button type="button" onClick={() => onOpenAuth()} className="btn-primary px-3.5 py-2 text-xs sm:text-sm">
                <KeyRound className="h-4 w-4" />
                <span className="hidden sm:inline">Elevate Access</span>
                <span className="sm:hidden">Access</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile campus switcher + KPIs */}
        <div className="pb-3 lg:hidden">
          <CampusSwitcher campuses={campuses} campus={campus} onCampusChange={onCampusChange} fullWidth />
        </div>
        <div className="grid grid-cols-2 gap-2 pb-3 sm:grid-cols-4 xl:hidden">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Students</p>
            <p className="metric mt-0.5 text-[12px] font-bold text-white">{formatNumber(campus.strength)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Attendance</p>
            <p className="metric mt-0.5 text-[12px] font-bold text-emerald-300">{campus.attendance}%</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Active Clubs</p>
            <p className="metric mt-0.5 text-[12px] font-bold text-cyan-300">{String(activeClubs).padStart(2, "0")}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Security</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure
            </p>
          </div>
        </div>

        {/* Executive broadcast banner */}
        {directive ? (
          <div className={cx("relative mb-3 overflow-hidden rounded-xl border px-3.5 py-2.5 animate-fade-up", directiveStyle.wrapper)}>
            <div className="flex items-start gap-3">
              <span className={cx("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", directiveStyle.icon)}>
                <Megaphone className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={cx("font-mono text-[8.5px] font-bold uppercase tracking-[0.18em]", directiveStyle.label)}>
                    {directiveStyle.tag}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <p className="text-[12.5px] font-bold text-white">{directive.title}</p>
                  <span className="hidden font-mono text-[9px] text-slate-500 sm:inline">
                    {directive.issuedBy} · {timeAgo(directive.issuedAt)}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-slate-400">{directive.message}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <StatusPill tone={directive.severity === "urgent" ? "rose" : directive.severity === "celebratory" ? "gold" : "indigo"}>
                  Live
                </StatusPill>
                <button
                  type="button"
                  onClick={onDismissDirective}
                  aria-label="Dismiss broadcast banner"
                  className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

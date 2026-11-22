import { useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  ClipboardList,
  GraduationCap,
  Lock,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";
import {
  CategoryChip,
  EmptyState,
  Field,
  Modal,
  SectionHeading,
  StatusPill,
} from "./ui";
import { BEHAVIOR_CATEGORIES, CARD_RULES } from "../data/cmsData";
import { cx, formatDate, initials, uid } from "../lib/utils";

const TYPE_CONFIG = {
  red: {
    label: "Red Card",
    icon: AlertOctagon,
    border: "border-rose-400/25",
    bg: "bg-gradient-to-br from-rose-500/[0.09] via-slate-900/60 to-slate-900/60",
    text: "text-rose-300",
    badge: "border-rose-400/30 bg-rose-500/15 text-rose-200",
    glow: "shadow-[0_0_45px_-20px_rgba(244,63,94,0.75)]",
    bar: "bg-rose-400",
  },
  blue: {
    label: "Blue Card",
    icon: AlertTriangle,
    border: "border-sky-400/25",
    bg: "bg-gradient-to-br from-sky-500/[0.08] via-slate-900/60 to-slate-900/60",
    text: "text-sky-300",
    badge: "border-sky-400/30 bg-sky-500/15 text-sky-200",
    glow: "shadow-[0_0_45px_-20px_rgba(56,189,248,0.6)]",
    bar: "bg-sky-400",
  },
  green: {
    label: "Green Card",
    icon: Sparkles,
    border: "border-emerald-400/25",
    bg: "bg-gradient-to-br from-emerald-500/[0.08] via-slate-900/60 to-slate-900/60",
    text: "text-emerald-300",
    badge: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
    glow: "shadow-[0_0_45px_-20px_rgba(52,211,153,0.65)]",
    bar: "bg-emerald-400",
  },
};

const EMPTY_FORM = {
  student: "",
  className: "",
  roll: "",
  type: "green",
  category: BEHAVIOR_CATEGORIES[4],
  note: "",
};

export default function TeachersReport({ app }) {
  const { store, update, campus, role, isFaculty, toast, openAuth } = app;
  const [typeFilter, setTypeFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const cards = store.behaviorCards;
  const counts = {
    red: cards.filter((card) => card.type === "red").length,
    blue: cards.filter((card) => card.type === "blue").length,
    green: cards.filter((card) => card.type === "green").length,
  };
  const netPoints = cards.reduce((sum, card) => sum + card.points, 0);
  const unresolvedReds = cards.filter((card) => card.type === "red" && !card.resolved).length;
  const classOptions = [...new Set(cards.map((card) => card.className))].sort();

  const filtered = useMemo(() => {
    return [...cards]
      .filter((card) => typeFilter === "all" || card.type === typeFilter)
      .filter((card) => classFilter === "all" || card.className === classFilter)
      .filter((card) => {
        const haystack = `${card.student} ${card.roll} ${card.note} ${card.category}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [cards, typeFilter, classFilter, search]);

  const handleIssue = (event) => {
    event.preventDefault();
    const student = form.student.trim();
    const className = form.className.trim().toUpperCase();
    const roll = form.roll.trim().toUpperCase();
    const note = form.note.trim();

    if (!student || !className || !roll || !note) {
      toast("Student, class, roll number and observation are required.", "error");
      return;
    }

    const config = CARD_RULES[form.type];
    const card = {
      id: uid("BC"),
      student,
      className,
      roll,
      type: form.type,
      points: config.points,
      category: form.category,
      note,
      issuedBy: role === "principal" ? "Principal" : "Faculty Member",
      date: new Date().toISOString(),
      resolved: false,
    };

    update((draft) => {
      draft.behaviorCards.unshift(card);
      return draft;
    });

    setFormOpen(false);
    setForm(EMPTY_FORM);
    if (form.type === "red") {
      toast("Red card issued (-20 points). Automatically escalated to the Principal.", "success");
    } else if (form.type === "blue") {
      toast("Blue card issued (-5 points). Advisor notified.", "info");
    } else {
      toast("Green card issued (+10 points). Merit added to house points.", "success");
    }
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 04 · Behaviour & Merit"
        title="Teachers Report"
        description={`Automated red, blue and green card system for ${campus.name}. Red cards escalate to the Principal with a -20 point impact.`}
        icon={ClipboardList}
        actions={
          isFaculty ? (
            <button type="button" onClick={() => setFormOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" />
              Issue Behaviour Card
            </button>
          ) : (
            <button type="button" onClick={() => openAuth("teacher")} className="btn-secondary">
              <Lock className="h-4 w-4" />
              Faculty Sign-In
            </button>
          )
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-rose-400/25 bg-rose-500/[0.07] p-4 shadow-[0_0_50px_-22px_rgba(244,63,94,0.8)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-rose-300/80">Red Cards</p>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <p className="metric mt-1.5 text-3xl font-bold text-white">{String(counts.red).padStart(2, "0")}</p>
          <p className="mt-0.5 text-[10px] text-rose-300/70">-20 pts · escalated</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-sky-400/25 bg-sky-500/[0.07] p-4 shadow-[0_0_50px_-22px_rgba(56,189,248,0.7)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300/80">Blue Cards</p>
            <AlertTriangle className="h-4 w-4 text-sky-400" />
          </div>
          <p className="metric mt-1.5 text-3xl font-bold text-white">{String(counts.blue).padStart(2, "0")}</p>
          <p className="mt-0.5 text-[10px] text-sky-300/70">-5 pts · advisory</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-4 shadow-[0_0_50px_-22px_rgba(52,211,153,0.7)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">Green Cards</p>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="metric mt-1.5 text-3xl font-bold text-white">{String(counts.green).padStart(2, "0")}</p>
          <p className="mt-0.5 text-[10px] text-emerald-300/70">+10 pts · merit</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.07] p-4 shadow-[0_0_50px_-22px_rgba(99,102,241,0.8)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300/80">Net Behaviour</p>
            <TrendingUp className="h-4 w-4 text-indigo-300" />
          </div>
          <p className={cx("metric mt-1.5 text-3xl font-bold", netPoints >= 0 ? "text-white" : "text-rose-200")}>
            {netPoints >= 0 ? "+" : ""}
            {netPoints}
          </p>
          <p className="mt-0.5 text-[10px] text-indigo-300/70">{unresolvedReds} unresolved red{unresolvedReds === 1 ? "" : "s"}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          <CategoryChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            All Cards
          </CategoryChip>
          <CategoryChip active={typeFilter === "red"} onClick={() => setTypeFilter("red")}>
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Red
          </CategoryChip>
          <CategoryChip active={typeFilter === "blue"} onClick={() => setTypeFilter("blue")}>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Blue
          </CategoryChip>
          <CategoryChip active={typeFilter === "green"} onClick={() => setTypeFilter("green")}>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Green
          </CategoryChip>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className="select-base w-full text-xs sm:w-40"
            aria-label="Filter by class"
          >
            <option value="all">All classes</option>
            {classOptions.map((item) => (
              <option key={item} value={item}>
                Class {item}
              </option>
            ))}
          </select>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, roll or note…"
              className="input-base pl-9 text-xs"
              aria-label="Search behaviour cards"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No behaviour cards match"
          description="Adjust the card colour, class or search query to review the full behaviour ledger."
          action={
            <button
              type="button"
              onClick={() => {
                setTypeFilter("all");
                setClassFilter("all");
                setSearch("");
              }}
              className="btn-secondary text-xs"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((card) => {
            const config = TYPE_CONFIG[card.type] || TYPE_CONFIG.green;
            const Icon = config.icon;
            return (
              <article
                key={card.id}
                className={cx(
                  "relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition hover:-translate-y-0.5",
                  config.border,
                  config.bg,
                  config.glow
                )}
              >
                <span className={cx("absolute inset-y-0 left-0 w-0.5", config.bar)} />
                <div className="flex items-start gap-3">
                  <div className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white/[0.04] font-mono text-[10px] font-bold", config.border, config.text)}>
                    {initials(card.student)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[13px] font-bold text-white">{card.student}</h3>
                      <span className="font-mono text-[9.5px] text-slate-500">
                        {card.className} · {card.roll}
                      </span>
                      <span className={cx("ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", config.badge)}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-300">{card.note}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[9.5px] text-slate-500">
                      <span className="chip px-2 py-0.5 text-[9px]">{card.category}</span>
                      <span>{card.issuedBy}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="font-mono">{formatDate(card.date, { year: undefined })}</span>
                      {card.type === "red" ? (
                        card.resolved ? (
                          <StatusPill tone="emerald">Resolved</StatusPill>
                        ) : (
                          <StatusPill tone="rose">Principal Escalation</StatusPill>
                        )
                      ) : null}
                    </div>
                  </div>
                  <span className={cx("shrink-0 font-mono text-sm font-bold", card.points > 0 ? "text-emerald-300" : "text-rose-300")}>
                    {card.points > 0 ? "+" : ""}
                    {card.points}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/[0.04] p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
            <AlertOctagon className="h-3.5 w-3.5" /> Red protocol
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            -20 points. Automatically appears in Principal Command for review and resolution.
          </p>
        </div>
        <div className="rounded-xl border border-sky-400/20 bg-sky-500/[0.04] p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
            <AlertTriangle className="h-3.5 w-3.5" /> Blue protocol
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            -5 points. Advisory note retained for the class mentor and pastoral review.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.04] p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <Star className="h-3.5 w-3.5" /> Green protocol
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            +10 points. Merit contributes to house totals and the end-of-term honours list.
          </p>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Issue Behaviour Card"
        subtitle={`Behaviour ledger · ${campus.name}`}
        icon={GraduationCap}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleIssue} className="space-y-4">
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-slate-950/60 p-1">
            {["red", "blue", "green"].map((type) => {
              const config = TYPE_CONFIG[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  className={cx(
                    "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-wide transition",
                    form.type === type ? cx(config.badge, "ring-1 ring-inset ring-white/10") : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {type}
                  <span className="font-mono text-[9px] opacity-70">{CARD_RULES[type].points} pts</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student name" required>
              <input
                value={form.student}
                onChange={(event) => setForm((prev) => ({ ...prev, student: event.target.value }))}
                placeholder="e.g. Ananya Singh"
                className="input-base"
                autoFocus
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Class" required>
                <input
                  value={form.className}
                  onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value.toUpperCase() }))}
                  placeholder="IX-A"
                  className="input-base font-mono"
                />
              </Field>
              <Field label="Roll no." required>
                <input
                  value={form.roll}
                  onChange={(event) => setForm((prev) => ({ ...prev, roll: event.target.value.toUpperCase() }))}
                  placeholder="9A-14"
                  className="input-base font-mono"
                />
              </Field>
            </div>
          </div>

          <Field label="Behaviour category">
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="select-base"
            >
              {BEHAVIOR_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Observation" required hint="Record what was observed, not assumptions about intent.">
            <textarea
              rows={4}
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              placeholder="Describe the specific behaviour and context…"
              className="input-base"
            />
          </Field>

          <div className={cx("flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[10.5px] leading-relaxed", TYPE_CONFIG[form.type].border, "bg-white/[0.02] text-slate-400")}>
            <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
            {CARD_RULES[form.type].description}. This entry will be attributed to{" "}
            {role === "principal" ? "the Principal" : "a faculty member"} and stored in the campus ledger.
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className={form.type === "green" ? "btn-primary" : form.type === "red" ? "btn-danger" : "btn-secondary"}>
              <Plus className="h-4 w-4" />
              Issue {CARD_RULES[form.type].label}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

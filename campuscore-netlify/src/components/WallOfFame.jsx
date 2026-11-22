import { useMemo, useState } from "react";
import {
  Award,
  Crown,
  GraduationCap,
  Lock,
  Medal,
  Plus,
  Search,
  Sparkles,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import {
  CategoryChip,
  EmptyState,
  Field,
  Modal,
  SectionHeading,
} from "./ui";
import { FAME_CATEGORIES } from "../data/cmsData";
import { cx, initials, uid } from "../lib/utils";

const MEDAL_STYLES = {
  gold: {
    border: "border-amber-300/30",
    bg: "bg-gradient-to-br from-amber-400/[0.12] via-slate-900/70 to-slate-900/60",
    glow: "hover:shadow-glow-amber",
    icon: "border-amber-300/40 bg-amber-400/15 text-amber-200",
    label: "Gold Laureate",
    ring: "from-amber-300 to-yellow-500",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  },
  silver: {
    border: "border-slate-300/25",
    bg: "bg-gradient-to-br from-slate-300/[0.09] via-slate-900/70 to-slate-900/60",
    glow: "hover:shadow-[0_0_40px_-14px_rgba(203,213,225,0.35)]",
    icon: "border-slate-300/30 bg-slate-300/10 text-slate-200",
    label: "Silver Laureate",
    ring: "from-slate-200 to-slate-400",
    chip: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  },
  bronze: {
    border: "border-orange-400/25",
    bg: "bg-gradient-to-br from-orange-400/[0.09] via-slate-900/70 to-slate-900/60",
    glow: "hover:shadow-[0_0_40px_-14px_rgba(251,146,60,0.4)]",
    icon: "border-orange-400/30 bg-orange-400/10 text-orange-200",
    label: "Bronze Laureate",
    ring: "from-orange-300 to-amber-600",
    chip: "border-orange-400/25 bg-orange-400/10 text-orange-200",
  },
};

const EMPTY_FORM = {
  name: "",
  className: "",
  category: "ICSE Topper",
  achievement: "",
  score: "",
  medal: "gold",
};

export default function WallOfFame({ app }) {
  const { store, update, campus, isFaculty, toast, openAuth } = app;
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [inductOpen, setInductOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const achievers = useMemo(() => {
    return [...store.achievers]
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => {
        const haystack = `${item.name} ${item.achievement} ${item.className}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      })
      .sort((a, b) => b.applause - a.applause);
  }, [store.achievers, category, search]);

  const topperCount = store.achievers.filter((item) => item.category === "ICSE Topper" || item.category === "ISC Topper").length;
  const olympiadCount = store.achievers.filter((item) => item.category === "Olympiad").length;
  const totalApplause = store.achievers.reduce((sum, item) => sum + item.applause, 0);

  const applaud = (id) => {
    const current = store.achievers.find((item) => item.id === id);
    if (!current) return;
    const willApplaud = !current.applauded;
    update((draft) => {
      const achiever = draft.achievers.find((item) => item.id === id);
      if (achiever) {
        achiever.applauded = !achiever.applauded;
        achiever.applause = Math.max(0, achiever.applause + (achiever.applauded ? 1 : -1));
      }
      return draft;
    });
    toast(willApplaud ? `Applause recorded for ${current.name}.` : "Applause removed.", willApplaud ? "success" : "info");
  };

  const handleInduct = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.className.trim() || !form.achievement.trim()) {
      toast("Name, class and achievement are required.", "error");
      return;
    }
    if (!form.score.trim()) {
      toast("Add the score, medal or result to display on the laureate card.", "error");
      return;
    }

    const achiever = {
      id: uid("FAME"),
      name: form.name.trim(),
      className: form.className.trim().toUpperCase(),
      category: form.category,
      achievement: form.achievement.trim(),
      score: form.score.trim(),
      medal: form.medal,
      applause: 0,
      applauded: false,
      inductedAt: new Date().toISOString(),
    };

    update((draft) => {
      draft.achievers.unshift(achiever);
      return draft;
    });
    setInductOpen(false);
    setForm(EMPTY_FORM);
    toast(`${achiever.name} inducted into the Wall of Fame.`, "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 06 · Laureate Archive"
        title="Wall of Fame"
        description={`ICSE and ISC toppers, olympiad medalists, sports champions and artists from ${campus.name}.`}
        icon={Trophy}
        actions={
          isFaculty ? (
            <button type="button" onClick={() => setInductOpen(true)} className="btn-gold">
              <Plus className="h-4 w-4" />
              Induct Achiever
            </button>
          ) : (
            <button type="button" onClick={() => openAuth("teacher")} className="btn-secondary">
              <Lock className="h-4 w-4" />
              Faculty Sign-In
            </button>
          )
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Laureates</p>
          <p className="metric mt-1 text-2xl font-bold text-white">{String(store.achievers.length).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Board Toppers</p>
          <p className="metric mt-1 text-2xl font-bold text-amber-300">{String(topperCount).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Olympiad Medals</p>
          <p className="metric mt-1 text-2xl font-bold text-cyan-300">{String(olympiadCount).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Total Applause</p>
          <p className="metric mt-1 text-2xl font-bold text-rose-300">{totalApplause}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          <CategoryChip active={category === "All"} onClick={() => setCategory("All")}>
            All Laureates
          </CategoryChip>
          {FAME_CATEGORIES.map((item) => (
            <CategoryChip key={item} active={category === item} onClick={() => setCategory(item)}>
              {item}
            </CategoryChip>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search laureates…"
            className="input-base pl-9"
            aria-label="Search achievers"
          />
        </div>
      </div>

      {achievers.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No laureates in this category"
          description="Try another category or clear the search to see the full honours archive."
          action={
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="btn-secondary text-xs"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {achievers.map((achiever) => {
            const style = MEDAL_STYLES[achiever.medal] || MEDAL_STYLES.gold;
            return (
              <article
                key={achiever.id}
                className={cx(
                  "group relative overflow-hidden rounded-2xl border p-5 shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5",
                  style.border,
                  style.bg,
                  style.glow
                )}
              >
                <div className={cx("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", style.ring)} />
                <div className="flex items-start justify-between gap-3">
                  <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border", style.icon)}>
                    {achiever.medal === "gold" ? <Crown className="h-5 w-5" /> : <Medal className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cx("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", style.chip)}>
                      {achiever.category}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-slate-500">{style.label}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] font-mono text-[9px] font-bold text-slate-200">
                    {initials(achiever.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-[14px] font-bold text-white">{achiever.name}</h3>
                    <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">Class {achiever.className}</p>
                  </div>
                </div>

                <p className="mt-3 min-h-[34px] text-[11.5px] leading-relaxed text-slate-300">{achiever.achievement}</p>

                <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/[0.07] pt-3">
                  <div>
                    <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Result</p>
                    <p className="metric mt-0.5 text-2xl font-bold text-white">{achiever.score}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applaud(achiever.id)}
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition active:scale-95",
                      achiever.applauded
                        ? "border-rose-400/35 bg-rose-500/15 text-rose-200"
                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                    )}
                    aria-pressed={achiever.applauded}
                  >
                    <ThumbsUp className={cx("h-3.5 w-3.5", achiever.applauded && "fill-rose-300/30 text-rose-300")} />
                    <span className="font-mono">{achiever.applause}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-400/[0.07] to-transparent p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          <span className="font-semibold text-amber-200">Honours standard:</span> board topper entries require a
          verified aggregate of 99% or above; olympiad and sports entries require a national or state-level result.
          Faculty can induct new laureates from this panel.
        </p>
      </div>

      <Modal
        open={inductOpen}
        onClose={() => setInductOpen(false)}
        title="Induct a Laureate"
        subtitle={`Wall of Fame · ${campus.name}`}
        icon={Award}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleInduct} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student name" required>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Aarav Verma"
                className="input-base"
                autoFocus
              />
            </Field>
            <Field label="Class & section" required>
              <input
                value={form.className}
                onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value.toUpperCase() }))}
                placeholder="XII-A"
                className="input-base font-mono"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Honour category">
              <select
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className="select-base"
              >
                {FAME_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Medal tier">
              <select
                value={form.medal}
                onChange={(event) => setForm((prev) => ({ ...prev, medal: event.target.value }))}
                className="select-base"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </Field>
          </div>

          <Field label="Achievement" required>
            <textarea
              rows={3}
              value={form.achievement}
              onChange={(event) => setForm((prev) => ({ ...prev, achievement: event.target.value }))}
              placeholder="e.g. ICSE 2026 — 99.4% aggregate, city rank 2"
              className="input-base"
            />
          </Field>

          <Field label="Result / score" required hint="Examples: 99.4%, Gold, National Champion, 1st place.">
            <input
              value={form.score}
              onChange={(event) => setForm((prev) => ({ ...prev, score: event.target.value }))}
              placeholder="99.4%"
              className="input-base font-mono"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setInductOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-gold">
              <GraduationCap className="h-4 w-4" />
              Induct Laureate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

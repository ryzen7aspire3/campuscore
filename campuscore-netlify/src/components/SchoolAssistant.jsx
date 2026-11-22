import { useEffect, useMemo, useState } from "react";
import {
  Atom,
  BookMarked,
  BookOpen,
  BookmarkPlus,
  Bot,
  Brain,
  Check,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  Layers,
  Lightbulb,
  LineChart,
  ListChecks,
  Loader2,
  Search,
  Send,
  ShieldCheck,
  Sigma,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import Markdown from "./Markdown";
import { Modal, SectionHeading, StatusPill } from "./ui";
import {
  copyText,
  cx,
  downloadText,
  formatDateTime,
  timeAgo,
  uid,
} from "../lib/utils";

const SUBJECTS = [
  { label: "General Web Research", icon: Globe2, short: "General" },
  { label: "Computer Science (Java/Python)", icon: Code2, short: "Computer Science" },
  { label: "Commerce, Accounts & Economics", icon: LineChart, short: "Commerce" },
  { label: "Physics, Chemistry & Biology", icon: Atom, short: "Sciences" },
  { label: "Mathematics & Olympiad", icon: Sigma, short: "Mathematics" },
  { label: "English, History & Psychology", icon: BookOpen, short: "Humanities" },
];

const MODES = [
  { label: "Deep Concept Mastery", icon: Brain, hint: "Layered explanation, worked example, edge cases" },
  { label: "CISCE Board Exam Answer", icon: GraduationCap, hint: "Model answer skeleton with marking keywords" },
  { label: "Quick Revision Notes", icon: Zap, hint: "Compact sheet for the final 24 hours" },
  { label: "3-Question Practice Drill", icon: ListChecks, hint: "Three graded questions with an answer key" },
];

const STARTERS = [
  {
    icon: Code2,
    title: "Java inheritance, decoded",
    query:
      "Explain inheritance in Java with a parent-child example, method overriding and one exam-style program I can trace.",
    subject: "Computer Science (Java/Python)",
  },
  {
    icon: Atom,
    title: "Redox balancing clinic",
    query:
      "Teach me how to balance a complex redox equation in acidic medium, step by step, with two worked examples.",
    subject: "Physics, Chemistry & Biology",
  },
  {
    icon: Sigma,
    title: "Quadratic formula derivation",
    query:
      "Derive the quadratic formula from first principles and explain what the discriminant tells us about the roots.",
    subject: "Mathematics & Olympiad",
  },
  {
    icon: LineChart,
    title: "Depreciation & ledgers",
    query:
      "Explain depreciation using the straight-line and diminishing balance methods with a worked ledger example.",
    subject: "Commerce, Accounts & Economics",
  },
  {
    icon: BookOpen,
    title: "Non-Cooperation Movement",
    query: "How did the Non-Cooperation Movement shape Indian politics, and why was it withdrawn?",
    subject: "English, History & Psychology",
  },
  {
    icon: Globe2,
    title: "Sleep, memory & exams",
    query:
      "What does current research say about sleep and memory consolidation, and how should students apply it before exams?",
    subject: "General Web Research",
  },
];

const THINKING_STEPS = [
  "Searching Wikipedia's live index",
  "Verifying article extracts and source URLs",
  "Reasoning with DeepSeek R1",
  "Structuring the ICSE / ISC study guide",
];

const OFFLINE_CORE = {
  "General Web Research":
    "Define the question precisely, separate established consensus from contested claims, and name the evidence behind each claim. A research answer is only as strong as its weakest source.",
  "Computer Science (Java/Python)":
    "Trace state, not syntax. Identify inputs, variables, control flow and output, then dry-run the program line by line. In Java, watch object references and exceptions; in Python, watch mutability and indentation.",
  "Commerce, Accounts & Economics":
    "Apply the dual aspect concept: every debit has a credit. For economics, connect the definition to a diagram and then to a real decision. Show working notes, not just final figures.",
  "Physics, Chemistry & Biology":
    "Draw the system before calculating. Physics uses conservation laws; chemistry uses balanced equations and mole ratios; biology links structure to function. Units and labels are part of the answer.",
  "Mathematics & Olympiad":
    "Write what is given, what must be proved, and the theorem or invariant that bridges them. Verify the result and check domain constraints. Elegance follows correctness, never the reverse.",
  "English, History & Psychology":
    "Make a claim, support it with specific evidence, and explain significance. In history, separate cause, event and consequence. In psychology, define the construct before evaluating the study.",
};

const OFFLINE_MODE = {
  "Deep Concept Mastery":
    "Work through four layers: intuition, formal definition, worked example, and edge case. Finish by explaining the idea aloud in 90 seconds without notes.",
  "CISCE Board Exam Answer":
    "Use the board skeleton: Given/Identify → Principle → Working → Conclusion. Underline the final answer, label diagrams, and keep one idea per line so method marks are visible.",
  "Quick Revision Notes":
    "Compress the topic into five bullets, one table and one diagram. End with a 60-second recall check: definition, example, limitation.",
  "3-Question Practice Drill":
    "Attempt three questions of increasing difficulty. Then mark yourself against the answer key, awarding method marks only where the reasoning is visible.",
};

function buildOfflineGuide(query, subject, mode) {
  const core = OFFLINE_CORE[subject] || OFFLINE_CORE["General Web Research"];
  const modeGuidance = OFFLINE_MODE[mode] || OFFLINE_MODE["Deep Concept Mastery"];
  return `# ${query}

> **Offline study framework.** The live research endpoint was unreachable from this browser, so CampusCore generated a structured framework instead of a cited answer. Deploy the backend or run \`vercel dev\` to attach live Wikipedia sources and DeepSeek R1 reasoning.

## 1. Decode the question

${core}

**Subject lens:** ${subject}  
**Study mode:** ${mode}

## 2. Build the answer in layers

1. **Define the boundary.** Write the exact concept, event or problem in one sentence.
2. **Select the tool.** Name the formula, theorem, framework or source type that applies.
3. **Work it visibly.** Number each step and keep units, labels or citations attached.
4. **Test the edge.** Change one assumption and explain what breaks.

## 3. Exam desk strategy

${modeGuidance}

- ICSE/ISC markers reward visible method, correct terminology and a clean final statement.
- Write the principle before substituting numbers or quoting evidence.
- Reserve two minutes to verify units, signs, dates or source attributions.

## 4. Retrieval checkpoint

Close this panel and write, from memory:

- the definition in your own words;
- one worked example or historical example;
- one limitation or counter-example;
- one question you still cannot answer.

Reopen the guide and compare. The gap you find is your next revision target.

> **Exam edge:** a concise, correctly labelled answer beats a long, unlabelled one. Spend your final minute on presentation, not new content.`;
}

export default function SchoolAssistant({ app }) {
  const { store, update, campus, toast } = app;
  const [subject, setSubject] = useState(SUBJECTS[0].label);
  const [mode, setMode] = useState(MODES[0].label);
  const [query, setQuery] = useState("");
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [vaultView, setVaultView] = useState(null);
  const [vaultFilter, setVaultFilter] = useState("All");

  const savedIds = useMemo(() => new Set(store.vault.map((item) => item.id)), [store.vault]);
  const latestTurn = turns[0] || null;

  useEffect(() => {
    if (!loading) {
      setThinkingStep(0);
      setElapsed(0);
      return undefined;
    }
    const stepTimer = setInterval(() => {
      setThinkingStep((step) => Math.min(step + 1, THINKING_STEPS.length - 1));
    }, 1500);
    const clockTimer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => {
      clearInterval(stepTimer);
      clearInterval(clockTimer);
    };
  }, [loading]);

  const runAssistant = async (queryOverride, subjectOverride, modeOverride) => {
    const activeQuery = String(queryOverride ?? query).trim();
    const activeSubject = subjectOverride || subject;
    const activeMode = modeOverride || mode;
    if (!activeQuery) {
      toast("Write a study question before asking CampusCore.", "error");
      return;
    }
    if (loading) return;

    setQuery(activeQuery);
    setLoading(true);

    try {
      const response = await fetch("/api/school-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          subject: activeSubject,
          mode: activeMode,
          branch: campus.name,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error(data?.error || "The study service returned an unexpected response.");
      }

      const turn = {
        id: uid("STUDY"),
        query: activeQuery,
        subject: activeSubject,
        mode: activeMode,
        reply: data.reply.trim(),
        sources: Array.isArray(data.sources) ? data.sources : [],
        modelUsed: data.modelUsed || "DeepSeek R1",
        at: new Date().toISOString(),
      };

      setTurns((prev) => [turn, ...prev]);
      toast(
        turn.modelUsed.toLowerCase().includes("offline")
          ? "Live model unavailable — a research-backed synthesis was generated instead."
          : `Study guide ready${turn.sources.length ? ` · ${turn.sources.length} verified sources` : ""}.`,
        turn.modelUsed.toLowerCase().includes("offline") ? "info" : "success"
      );
    } catch {
      const fallback = {
        id: uid("STUDY"),
        query: activeQuery,
        subject: activeSubject,
        mode: activeMode,
        reply: buildOfflineGuide(activeQuery, activeSubject, activeMode),
        sources: [],
        modelUsed: "CampusCore Offline Engine",
        at: new Date().toISOString(),
      };
      setTurns((prev) => [fallback, ...prev]);
      toast("The AI endpoint is unreachable — an offline study framework was generated.", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runAssistant();
  };

  const handleCopy = async (turn) => {
    const ok = await copyText(turn.reply);
    if (!ok) {
      toast("Clipboard access was blocked by the browser.", "error");
      return;
    }
    setCopiedId(turn.id);
    setTimeout(() => setCopiedId(null), 1700);
    toast("Study guide copied as Markdown.", "success");
  };

  const handleSave = (turn) => {
    if (savedIds.has(turn.id)) {
      toast("This study guide is already in your campus vault.", "info");
      return;
    }
    update((draft) => {
      draft.vault.unshift({ ...turn, savedAt: new Date().toISOString() });
      return draft;
    });
    toast("Saved to this campus's Study Vault.", "success");
  };

  const handleDelete = (id) => {
    update((draft) => {
      draft.vault = draft.vault.filter((item) => item.id !== id);
      return draft;
    });
    if (vaultView?.id === id) setVaultView(null);
    toast("Study guide removed from the vault.", "info");
  };

  const handleExport = (turn) => {
    const slug =
      turn.query
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) || "study-guide";
    const sourceBlock = turn.sources.length
      ? `\n\n## Sources\n\n${turn.sources
          .map((source, index) => `${index + 1}. [${source.title}](${source.url})`)
          .join("\n")}`
      : "";
    const document = `# ${turn.query}

**Campus:** ${campus.name}  
**Subject lens:** ${turn.subject}  
**Study mode:** ${turn.mode}  
**Engine:** ${turn.modelUsed}  
**Generated:** ${formatDateTime(turn.at)}

---

${turn.reply}${sourceBlock}

---

*Exported from CampusCore — CMS Multi-Campus Executive OS.*
`;
    downloadText(`campuscore-${slug}.md`, document, "text/markdown;charset=utf-8");
    toast("Markdown guide exported.", "success");
  };

  const savedTurns = useMemo(() => {
    if (vaultFilter === "All") return store.vault;
    return store.vault.filter((item) => item.subject === vaultFilter);
  }, [store.vault, vaultFilter]);

  const vaultSubjects = [...new Set(store.vault.map((item) => item.subject))];

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 08 · AI Research Studio"
        title="School Assistant"
        description="DeepSeek R1 reasoning grounded in live Wikipedia research, tuned for ICSE, ISC and International Olympiad preparation."
        icon={Sparkles}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="indigo" pulse>
              <Bot className="h-3 w-3" />
              DeepSeek R1
            </StatusPill>
            <StatusPill tone="cyan">Live web research</StatusPill>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4">
          {/* Studio controls */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glass backdrop-blur-xl sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/15 blur-[80px]" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-indigo-300" />
                  Subject lens
                </p>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">6 lenses</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {SUBJECTS.map((item) => {
                  const Icon = item.icon;
                  const active = subject === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSubject(item.label)}
                      className={cx(
                        "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition",
                        active
                          ? "border-indigo-400/45 bg-indigo-500/15 text-white shadow-glow-indigo"
                          : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
                      )}
                    >
                      <Icon className={cx("h-4 w-4 shrink-0", active ? "text-cyan-300" : "text-slate-500")} />
                      <span className="min-w-0">
                        <span className="block truncate text-[10.5px] font-semibold">{item.short}</span>
                        <span className="block truncate font-mono text-[8px] uppercase tracking-wider text-slate-600">
                          {active ? "Active lens" : "Select"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-300" />
                  Study mode
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                  {MODES.map((item) => {
                    const Icon = item.icon;
                    const active = mode === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setMode(item.label)}
                        className={cx(
                          "rounded-xl border px-2.5 py-2 text-left transition",
                          active
                            ? "border-cyan-400/40 bg-cyan-500/10 text-white shadow-glow-cyan"
                            : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
                        )}
                      >
                        <Icon className={cx("h-3.5 w-3.5", active ? "text-cyan-300" : "text-slate-500")} />
                        <span className="mt-1 block text-[10px] font-semibold leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  {MODES.find((item) => item.label === mode)?.hint}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={1200}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                        event.preventDefault();
                        runAssistant();
                      }
                    }}
                    placeholder="Ask anything — a concept, a board answer, a numerical problem or a research question…"
                    className="input-base resize-none pr-3 text-[13px]"
                  />
                  <span className="pointer-events-none absolute bottom-2.5 right-3 font-mono text-[9px] text-slate-600">
                    {query.length}/1200
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[9.5px] text-slate-500">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    Sources verified before reasoning · Ctrl / ⌘ + Enter to ask
                  </p>
                  <button type="submit" disabled={loading || !query.trim()} className="btn-primary px-4 py-2 text-xs">
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    {loading ? "Researching…" : "Ask CampusCore"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Thinking indicator */}
          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/[0.09] to-slate-900/70 p-5 shadow-glow-indigo backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-white">DeepSeek R1 is reasoning</p>
                    <p className="text-[9.5px] uppercase tracking-[0.14em] text-slate-500">
                      {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")} elapsed
                    </p>
                  </div>
                </div>
                <StatusPill tone="indigo" pulse>
                  Live pipeline
                </StatusPill>
              </div>
              <div className="mt-4 space-y-2">
                {THINKING_STEPS.map((step, index) => {
                  const done = index < thinkingStep;
                  const active = index === thinkingStep;
                  return (
                    <div key={step} className="flex items-center gap-2.5">
                      <span
                        className={cx(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px]",
                          done
                            ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                            : active
                              ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200"
                              : "border-white/10 text-slate-600"
                        )}
                      >
                        {done ? <Check className="h-2.5 w-2.5" /> : active ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : index + 1}
                      </span>
                      <span
                        className={cx(
                          "text-[11px]",
                          done ? "text-slate-500 line-through decoration-slate-700" : active ? "font-semibold text-indigo-200" : "text-slate-600"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-1/3 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent bg-[length:200%_100%]" />
              </div>
            </div>
          ) : null}

          {/* Starter prompts */}
          {turns.length === 0 && !loading ? (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.08] via-slate-900/60 to-cyan-500/[0.05] p-5 backdrop-blur-xl sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[60px]" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                    <Sparkles className="h-3 w-3" />
                    Research-grounded study desk
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">
                    Ask a question. Get a cited, exam-ready study guide.
                  </h3>
                  <p className="mt-1 max-w-xl text-[11.5px] leading-relaxed text-slate-400">
                    CampusCore searches Wikipedia's live index, verifies three article extracts, then asks DeepSeek R1 to
                    build a response through your subject lens and study mode. Every source stays clickable.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="chip"><Search className="h-3 w-3 text-cyan-300" />Live sources</span>
                    <span className="chip"><GraduationCap className="h-3 w-3 text-indigo-300" />ICSE / ISC lens</span>
                    <span className="chip"><BookMarked className="h-3 w-3 text-amber-300" />Per-branch vault</span>
                    <span className="chip"><FileText className="h-3 w-3 text-emerald-300" />Markdown export</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-300" />
                  Try a starter prompt
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STARTERS.map((starter) => {
                    const Icon = starter.icon;
                    return (
                      <button
                        key={starter.title}
                        type="button"
                        onClick={() => {
                          setSubject(starter.subject);
                          setQuery(starter.query);
                          runAssistant(starter.query, starter.subject, mode);
                        }}
                        className="group flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-left transition hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition group-hover:text-indigo-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11.5px] font-semibold text-slate-200">{starter.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[10px] leading-relaxed text-slate-500">{starter.query}</span>
                          <span className="mt-1 block font-mono text-[8px] uppercase tracking-wider text-indigo-400/70">
                            {starter.subject}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* Responses */}
          {turns.map((turn, index) => {
            const saved = savedIds.has(turn.id);
            const offline = turn.modelUsed.toLowerCase().includes("offline");
            return (
              <article
                key={turn.id}
                className={cx(
                  "overflow-hidden rounded-2xl border bg-slate-900/60 shadow-glass backdrop-blur-xl animate-fade-up",
                  index === 0 ? "border-indigo-400/25" : "border-white/10"
                )}
              >
                <div className="border-b border-white/[0.08] bg-white/[0.02] px-5 py-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusPill tone="indigo">{turn.subject}</StatusPill>
                    <StatusPill tone="cyan">{turn.mode}</StatusPill>
                    <span
                      className={cx(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider",
                        offline
                          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                          : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                      )}
                    >
                      <Bot className="h-3 w-3" />
                      {turn.modelUsed}
                    </span>
                    <span className="ml-auto flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">
                      <Clock className="h-3 w-3" />
                      {timeAgo(turn.at)}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[15px] font-bold leading-snug text-white">{turn.query}</h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(turn)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                    >
                      {copiedId === turn.id ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                      {copiedId === turn.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(turn)}
                      className={cx(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition",
                        saved
                          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-amber-400/30 hover:text-amber-200"
                      )}
                    >
                      {saved ? <Check className="h-3 w-3" /> : <BookmarkPlus className="h-3 w-3" />}
                      {saved ? "In vault" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport(turn)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                    >
                      <Download className="h-3 w-3" />
                      .md
                    </button>
                    {index === 0 ? <span className="ml-auto font-mono text-[8.5px] uppercase tracking-wider text-indigo-400/70">Latest</span> : null}
                  </div>
                </div>

                <div className="px-5 py-4">
                  <Markdown content={turn.reply} />
                </div>

                <div className="border-t border-white/[0.07] bg-white/[0.015] px-5 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center gap-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <ExternalLink className="h-3 w-3" />
                      Verified sources
                    </span>
                    {turn.sources.length === 0 ? (
                      <span className="text-[10px] text-slate-600">No live sources attached to this response.</span>
                    ) : (
                      turn.sources.map((source, sourceIndex) => (
                        <a
                          key={`${source.url}-${sourceIndex}`}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={source.title}
                          className="inline-flex max-w-[280px] items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/[0.06] px-2.5 py-1 text-[9.5px] font-medium text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-500/10"
                        >
                          <span className="font-mono text-[8px] text-cyan-400/70">{sourceIndex + 1}</span>
                          <span className="truncate">{source.title}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {latestTurn && !loading ? (
            <p className="pb-1 text-center text-[9.5px] text-slate-600">
              Always verify cited sources before submitting academic work. CampusCore is a study aid, not a citation.
            </p>
          ) : null}
        </div>

        {/* Saved vault sidebar */}
        <aside className="xl:sticky xl:top-32 xl:self-start">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-glass backdrop-blur-xl">
            <div className="border-b border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-amber-300" />
                  <h3 className="font-display text-[13px] font-bold text-white">Saved Study Vault</h3>
                </div>
                <span className="font-mono text-[10px] font-bold text-amber-300">{String(store.vault.length).padStart(2, "0")}</span>
              </div>
              <p className="mt-0.5 text-[9.5px] text-slate-500">{campus.name} · stored on this device</p>
            </div>

            {store.vault.length > 0 ? (
              <div className="flex flex-wrap gap-1 border-b border-white/[0.06] px-3 py-2">
                {["All", ...vaultSubjects.slice(0, 3)].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setVaultFilter(item)}
                    className={cx(
                      "rounded-full border px-2 py-0.5 text-[8.5px] font-semibold transition",
                      vaultFilter === item
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        : "border-white/10 text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {item === "All" ? "All" : item.split(/[(,]/)[0].trim()}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="max-h-[520px] overflow-y-auto p-2.5">
              {savedTurns.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500">
                    <BookMarked className="h-4 w-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Vault is empty</p>
                  <p className="mt-1 text-[9.5px] leading-relaxed text-slate-600">
                    Save any generated study guide and it will appear here for this campus.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {savedTurns.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 transition hover:border-amber-400/25 hover:bg-amber-400/[0.04]"
                    >
                      <button
                        type="button"
                        onClick={() => setVaultView(item)}
                        className="block w-full text-left"
                      >
                        <p className="line-clamp-2 text-[10.5px] font-semibold leading-snug text-slate-200">{item.query}</p>
                        <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-wider text-slate-500">
                          {item.subject.split(/[(,]/)[0].trim()} · {timeAgo(item.savedAt || item.at)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete saved guide"
                        className="absolute right-1.5 top-1.5 rounded-md p-1 text-slate-600 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.07] px-4 py-2.5">
              <p className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.14em] text-slate-600">
                <ShieldCheck className="h-3 w-3" />
                Per-branch localStorage · no cloud sync
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <Brain className="h-3 w-3 text-indigo-300" />
              How answers are built
            </p>
            <ol className="mt-2 space-y-1.5 text-[9.5px] leading-relaxed text-slate-500">
              <li>1. Wikipedia search surfaces three candidate articles.</li>
              <li>2. Each summary is extracted and linked as a source.</li>
              <li>3. DeepSeek R1 reasons over the research and your lens.</li>
              <li>4. If the model is unavailable, a structured guide is synthesised.</li>
            </ol>
          </div>
        </aside>
      </div>

      {/* Vault reader */}
      <Modal
        open={Boolean(vaultView)}
        onClose={() => setVaultView(null)}
        title={vaultView?.query || "Saved study guide"}
        subtitle={vaultView ? `${vaultView.subject} · ${vaultView.mode}` : ""}
        icon={BookMarked}
        maxWidth="max-w-3xl"
        footer={
          vaultView ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">
                Saved {formatDateTime(vaultView.savedAt || vaultView.at)}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleDelete(vaultView.id)} className="btn-danger px-3 py-2 text-xs">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
                <button type="button" onClick={() => handleExport(vaultView)} className="btn-primary px-3 py-2 text-xs">
                  <Download className="h-3.5 w-3.5" />
                  Export Markdown
                </button>
              </div>
            </div>
          ) : null
        }
      >
        {vaultView ? (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <StatusPill tone="indigo">{vaultView.subject}</StatusPill>
              <StatusPill tone="cyan">{vaultView.mode}</StatusPill>
              <StatusPill tone="slate">{vaultView.modelUsed}</StatusPill>
            </div>
            <Markdown content={vaultView.reply} />
            {vaultView.sources?.length ? (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Sources</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {vaultView.sources.map((source, index) => (
                    <a
                      key={`${source.url}-${index}`}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-[280px] items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/[0.06] px-2.5 py-1 text-[9.5px] text-cyan-200 transition hover:bg-cyan-500/10"
                    >
                      <span className="font-mono text-[8px] text-cyan-400/70">{index + 1}</span>
                      <span className="truncate">{source.title}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

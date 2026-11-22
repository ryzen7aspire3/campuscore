import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Heart,
  Landmark,
  Lock,
  Newspaper,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import {
  CategoryChip,
  EmptyState,
  Field,
  Modal,
  SectionHeading,
  StatusPill,
} from "./ui";
import { CHRONICLE_CATEGORIES } from "../data/cmsData";
import { cx, formatDate, timeAgo, uid } from "../lib/utils";

const CATEGORY_TONE = {
  "Campus News": "indigo",
  Academics: "cyan",
  Sports: "emerald",
  Culture: "fuchsia",
  Circular: "gold",
};

const TONE_CHIP = {
  indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  fuchsia: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200",
  gold: "border-amber-300/30 bg-amber-400/10 text-amber-200",
};

const EMPTY_FORM = {
  type: "news",
  category: "Campus News",
  seal: "CISCE",
  title: "",
  author: "",
  excerpt: "",
  body: "",
};

export default function SchoolChronicle({ app }) {
  const { store, update, campus, isFaculty, toast, openAuth } = app;
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [reading, setReading] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const articles = useMemo(() => {
    return [...store.articles]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((article) => category === "All" || article.category === category)
      .filter((article) => {
        const haystack = `${article.title} ${article.excerpt} ${article.author}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      });
  }, [store.articles, category, search]);

  const circularCount = store.articles.filter((article) => article.official).length;
  const bookmarkCount = store.articles.filter((article) => article.bookmarked).length;

  const toggleLike = (id) => {
    const current = store.articles.find((item) => item.id === id);
    if (!current) return;
    const willLike = !current.liked;
    update((draft) => {
      const article = draft.articles.find((item) => item.id === id);
      if (article) {
        article.liked = !article.liked;
        article.likes = Math.max(0, article.likes + (article.liked ? 1 : -1));
      }
      return draft;
    });
    toast(willLike ? "Chronicle appreciation recorded." : "Like removed.", willLike ? "success" : "info");
  };

  const toggleBookmark = (id) => {
    const current = store.articles.find((item) => item.id === id);
    if (!current) return;
    const willBookmark = !current.bookmarked;
    update((draft) => {
      const article = draft.articles.find((item) => item.id === id);
      if (article) article.bookmarked = !article.bookmarked;
      return draft;
    });
    toast(willBookmark ? "Saved to your reading list." : "Removed from your reading list.", "info");
  };

  const handlePublish = (event) => {
    event.preventDefault();
    const isCircular = form.type === "circular";
    if (!form.title.trim() || !form.body.trim()) {
      toast("A title and full article body are required.", "error");
      return;
    }

    const body = form.body.trim();
    const article = {
      id: uid("CHR"),
      title: form.title.trim(),
      category: isCircular ? "Circular" : form.category,
      author: form.author.trim() || (isCircular ? "Office of the Principal" : "Campus Editorial Desk"),
      excerpt: form.excerpt.trim() || `${body.replace(/\s+/g, " ").slice(0, 150)}${body.length > 150 ? "…" : ""}`,
      body,
      official: isCircular,
      seal: isCircular ? form.seal : null,
      likes: 0,
      liked: false,
      bookmarked: false,
      date: new Date().toISOString().slice(0, 10),
    };

    update((draft) => {
      draft.articles.unshift(article);
      return draft;
    });
    setPublishOpen(false);
    setForm(EMPTY_FORM);
    toast(isCircular ? "Official circular published with gold seal." : "Chronicle story published.", "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 02 · Campus Editorial"
        title="School Chronicle"
        description={`Campus journalism, student achievement and gold-sealed CISCE circulars from ${campus.name}.`}
        icon={Newspaper}
        actions={
          isFaculty ? (
            <button type="button" onClick={() => setPublishOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" />
              Publish Story
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
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Published Stories</p>
          <p className="metric mt-1 text-2xl font-bold text-white">{String(store.articles.length).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Official Circulars</p>
          <p className="metric mt-1 text-2xl font-bold text-amber-300">{String(circularCount).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Reading List</p>
          <p className="metric mt-1 text-2xl font-bold text-cyan-300">{String(bookmarkCount).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Appreciations</p>
          <p className="metric mt-1 text-2xl font-bold text-rose-300">
            {store.articles.reduce((sum, article) => sum + article.likes, 0)}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          <CategoryChip active={category === "All"} onClick={() => setCategory("All")}>
            All
          </CategoryChip>
          {CHRONICLE_CATEGORIES.map((item) => (
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
            placeholder="Search the Chronicle…"
            className="input-base pl-9"
            aria-label="Search stories"
          />
        </div>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No stories in this category"
          description="Try a different desk or clear the search field."
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
          {articles.map((article) => {
            const official = article.official;
            const tone = CATEGORY_TONE[article.category] || "indigo";
            return (
              <article
                key={article.id}
                className={cx(
                  "group flex flex-col overflow-hidden rounded-2xl border shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5",
                  official
                    ? "border-amber-300/25 bg-gradient-to-br from-amber-400/[0.07] via-slate-900/70 to-slate-900/60 hover:border-amber-300/40 hover:shadow-glow-amber"
                    : "border-white/10 bg-slate-900/60 hover:border-white/20 hover:shadow-glow-indigo"
                )}
              >
                <div className={cx("h-1 w-full bg-gradient-to-r", official ? "from-amber-300 via-yellow-400 to-amber-500" : "from-indigo-500 via-cyan-400 to-transparent")} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider", TONE_CHIP[tone])}>
                      {official ? <Award className="h-3 w-3" /> : null}
                      {article.category}
                    </span>
                    {official ? (
                      <StatusPill tone="gold">{article.seal === "CISCE" ? "CISCE Seal" : "Principal Seal"}</StatusPill>
                    ) : (
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-600">{timeAgo(article.date)}</span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-[15px] font-bold leading-snug text-white">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[11.5px] leading-relaxed text-slate-400">{article.excerpt}</p>

                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[8px] font-bold text-slate-300">
                      {article.author.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate">{article.author}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-700" />
                    <span className="shrink-0 font-mono">{formatDate(article.date, { year: undefined })}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleLike(article.id)}
                        aria-label={article.liked ? "Remove appreciation" : "Appreciate this story"}
                        className={cx(
                          "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition",
                          article.liked ? "bg-rose-500/15 text-rose-300" : "text-slate-500 hover:bg-white/[0.06] hover:text-rose-300"
                        )}
                      >
                        <Heart className={cx("h-3.5 w-3.5", article.liked && "fill-rose-400 text-rose-400")} />
                        <span className="font-mono">{article.likes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(article.id)}
                        aria-label={article.bookmarked ? "Remove bookmark" : "Bookmark this story"}
                        className={cx(
                          "rounded-lg p-1.5 transition",
                          article.bookmarked ? "bg-amber-400/15 text-amber-300" : "text-slate-500 hover:bg-white/[0.06] hover:text-amber-300"
                        )}
                      >
                        {article.bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReading(article)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10.5px] font-bold text-indigo-300 transition hover:bg-indigo-500/10 hover:text-indigo-200"
                    >
                      Read story
                      <Sparkles className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Reader */}
      <Modal
        open={Boolean(reading)}
        onClose={() => setReading(null)}
        title={reading?.title || "Story"}
        subtitle={reading ? `${reading.author} · ${formatDate(reading.date)}` : ""}
        icon={reading?.official ? Award : Newspaper}
        maxWidth="max-w-3xl"
        footer={
          reading ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleLike(reading.id);
                    setReading((prev) =>
                      prev ? { ...prev, liked: !prev.liked, likes: Math.max(0, prev.likes + (prev.liked ? -1 : 1)) } : prev
                    );
                  }}
                  className={cx(
                    "btn-secondary px-3 py-2 text-xs",
                    reading.liked && "border-rose-400/30 bg-rose-500/10 text-rose-200"
                  )}
                >
                  <Heart className={cx("h-4 w-4", reading.liked && "fill-rose-300 text-rose-300")} />
                  {reading.likes}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleBookmark(reading.id);
                    setReading((prev) => (prev ? { ...prev, bookmarked: !prev.bookmarked } : prev));
                  }}
                  className={cx(
                    "btn-secondary px-3 py-2 text-xs",
                    reading.bookmarked && "border-amber-400/30 bg-amber-400/10 text-amber-200"
                  )}
                >
                  {reading.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {reading.bookmarked ? "Saved" : "Save"}
                </button>
              </div>
              <button type="button" onClick={() => setReading(null)} className="btn-ghost text-xs">
                Close reader
              </button>
            </div>
          ) : null
        }
      >
        {reading ? (
          <div>
            {reading.official ? (
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-amber-300/25 bg-gradient-to-r from-amber-400/10 to-transparent p-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/50 bg-gradient-to-br from-amber-300/20 to-yellow-500/5 shadow-glow-amber">
                  <Award className="h-7 w-7 text-amber-200" />
                  <span className="absolute -bottom-1 rounded-full border border-amber-300/40 bg-slate-950 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-amber-200">
                    {reading.seal}
                  </span>
                </div>
                <div>
                  <p className="eyebrow text-amber-300/80">Official Communication</p>
                  <p className="mt-1 font-display text-sm font-bold text-white">
                    {reading.seal === "CISCE" ? "Council for the Indian School Certificate Examinations" : "Office of the Principal"}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    Gold-sealed circular · Verified for campus distribution
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", TONE_CHIP[CATEGORY_TONE[reading.category] || "indigo"])}>
                {reading.category}
              </span>
              <span className="flex items-center gap-1 text-[10.5px] text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(reading.date)}
              </span>
              <span className="flex items-center gap-1 text-[10.5px] text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                {campus.name}
              </span>
              {reading.official ? <StatusPill tone="gold">CISCE Verified</StatusPill> : <StatusPill tone="emerald">Campus Desk</StatusPill>}
            </div>

            <div className="prose-chronicle text-[13px]">
              {reading.body.split(/\n\n+/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2 text-[10.5px] text-slate-500">
                <BadgeCheck className="h-4 w-4 text-indigo-400" />
                Published by {reading.author}
              </div>
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-600">
                {reading.id}
              </span>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Publish form */}
      <Modal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        title="Publish to the Chronicle"
        subtitle={`Editorial desk · ${campus.name}`}
        icon={Newspaper}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handlePublish} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: "news" }))}
              className={cx(
                "rounded-lg px-3 py-2 text-xs font-semibold transition",
                form.type === "news" ? "bg-indigo-500/20 text-white ring-1 ring-inset ring-indigo-400/30" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Campus Story
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: "circular" }))}
              className={cx(
                "rounded-lg px-3 py-2 text-xs font-semibold transition",
                form.type === "circular" ? "bg-amber-400/15 text-amber-100 ring-1 ring-inset ring-amber-300/30" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Official Circular
            </button>
          </div>

          <Field label="Headline" required>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. Inter-Campus Science Symposium Opens"
              className="input-base"
              autoFocus
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            {form.type === "news" ? (
              <Field label="Editorial desk" required>
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="select-base"
                >
                  {CHRONICLE_CATEGORIES.filter((item) => item !== "Circular").map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="Official seal" required>
                <select
                  value={form.seal}
                  onChange={(event) => setForm((prev) => ({ ...prev, seal: event.target.value }))}
                  className="select-base"
                >
                  <option value="CISCE">CISCE Seal</option>
                  <option value="PRINCIPAL">Principal Seal</option>
                </select>
              </Field>
            )}
            <Field label="Author / office">
              <input
                value={form.author}
                onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                placeholder={form.type === "circular" ? "Office of the Principal" : "Campus Editorial Desk"}
                className="input-base"
              />
            </Field>
          </div>

          <Field label="Standfirst / excerpt" hint="Leave blank to auto-generate from the article body.">
            <input
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="One-sentence summary for the Chronicle card…"
              className="input-base"
            />
          </Field>

          <Field label="Full article" required hint="Separate paragraphs with a blank line.">
            <textarea
              rows={8}
              value={form.body}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
              placeholder="Write the full story or circular text…"
              className="input-base"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setPublishOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className={form.type === "circular" ? "btn-gold" : "btn-primary"}>
              {form.type === "circular" ? <Award className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {form.type === "circular" ? "Seal & Publish" : "Publish Story"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  BookOpen,
  BookMarked,
  Building2,
  CheckCircle2,
  Globe2,
  Hash,
  Library,
  Lock,
  Plus,
  Search,
} from "lucide-react";
import {
  CategoryChip,
  EmptyState,
  Field,
  Modal,
  SectionHeading,
  StatusPill,
} from "./ui";
import { BOOK_SUBJECTS, SUBJECT_SHELF_CODES } from "../data/cmsData";
import { loadAllBranches, loadBranch, saveBranch } from "../lib/storage";
import { cx, formatDate, uid } from "../lib/utils";

const EMPTY_BOOK = {
  title: "",
  author: "",
  subject: "Computer Science",
  copies: "3",
  shelf: "",
};

export default function DigitalLibrary({ app }) {
  const { store, update, campus, isFaculty, toast, openAuth } = app;
  const [allCampuses, setAllCampuses] = useState(false);
  const [subject, setSubject] = useState("All");
  const [search, setSearch] = useState("");
  const [reserveTarget, setReserveTarget] = useState(null);
  const [roll, setRoll] = useState("");
  const [reserved, setReserved] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [bookForm, setBookForm] = useState(EMPTY_BOOK);
  const [refreshKey, setRefreshKey] = useState(0);

  const networkBooks = useMemo(() => {
    if (!allCampuses) return [];
    return loadAllBranches().flatMap((branchStore) => branchStore.books || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCampuses, refreshKey]);

  const books = useMemo(() => {
    const source = allCampuses ? networkBooks : store.books;
    return [...source]
      .filter((book) => subject === "All" || book.subject === subject)
      .filter((book) => {
        const haystack = `${book.title} ${book.author} ${book.shelf} ${book.campusName || ""}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allCampuses, networkBooks, store.books, subject, search]);

  const subjects = useMemo(() => {
    const set = new Set(store.books.map((book) => book.subject));
    if (allCampuses) {
      networkBooks.forEach((book) => set.add(book.subject));
    }
    return BOOK_SUBJECTS.filter((item) => set.has(item));
  }, [store.books, allCampuses, networkBooks]);

  const totalAvailable = books.reduce((sum, book) => sum + book.available, 0);
  const branchReservations = [...(store.reservations || [])].sort((a, b) => b.at.localeCompare(a.at));

  const openReserve = (book) => {
    if (book.available <= 0) {
      toast("All copies of this title are currently checked out.", "error");
      return;
    }
    setReserved(null);
    setRoll("");
    setReserveTarget(book);
  };

  const handleReserve = (event) => {
    event.preventDefault();
    const rollValue = roll.trim().toUpperCase();
    if (!rollValue) {
      toast("A roll number is required to reserve a copy.", "error");
      return;
    }

    const ownerId = reserveTarget.campusId || campus.id;
    const now = new Date().toISOString();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const reservation = {
      id: `RSV-${uid("").slice(1)}`,
      bookId: reserveTarget.id,
      title: reserveTarget.title,
      shelf: reserveTarget.shelf,
      roll: rollValue,
      at: now,
      dueAt: dueDate,
      campusId: ownerId,
      campusName: reserveTarget.campusName || campus.name,
    };

    if (ownerId === campus.id) {
      let success = false;
      update((draft) => {
        const book = draft.books.find((item) => item.id === reserveTarget.id);
        if (book && book.available > 0) {
          book.available -= 1;
          draft.reservations.unshift(reservation);
          success = true;
        }
        return draft;
      });
      if (!success) {
        toast("No copy remains available for reservation.", "error");
        return;
      }
      setRefreshKey((key) => key + 1);
    } else {
      const branch = loadBranch(ownerId);
      const book = branch.books.find((item) => item.id === reserveTarget.id);
      if (!book || book.available <= 0) {
        toast("No copy remains available for reservation.", "error");
        return;
      }
      book.available -= 1;
      branch.reservations = [reservation, ...(branch.reservations || [])];
      saveBranch(ownerId, branch);
      setRefreshKey((key) => key + 1);
    }

    setReserved(reservation);
    setReserveTarget(null);
    setRoll("");
    toast(`Copy reserved at ${reservation.campusName}. Due ${formatDate(dueDate)}.`, "success");
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    const copies = Number(bookForm.copies);
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      toast("Title and author are required.", "error");
      return;
    }
    if (!Number.isFinite(copies) || copies < 1 || copies > 50) {
      toast("Copies must be between 1 and 50.", "error");
      return;
    }

    const prefix = SUBJECT_SHELF_CODES[bookForm.subject] || "GEN";
    const existing = store.books.filter((book) => book.subject === bookForm.subject).length;
    const shelf =
      bookForm.shelf.trim().toUpperCase() || `SHELF-${prefix}-${String(existing + 1).padStart(2, "0")}`;

    const book = {
      id: uid("BK"),
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      subject: bookForm.subject,
      shelf,
      copies,
      available: copies,
      campusId: campus.id,
      campusName: campus.name,
      addedAt: new Date().toISOString(),
    };

    update((draft) => {
      draft.books.unshift(book);
      return draft;
    });
    setAddOpen(false);
    setBookForm(EMPTY_BOOK);
    setRefreshKey((key) => key + 1);
    toast("Book catalogued and available for reservation.", "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 05 · Campus Knowledge Network"
        title="Digital Library"
        description={`Shelf-level catalogue for ${campus.name}. Search the combined holdings of all 18 CMS campuses and reserve instantly with a roll number.`}
        icon={Library}
        actions={
          isFaculty ? (
            <button type="button" onClick={() => setAddOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add Book
            </button>
          ) : (
            <button type="button" onClick={() => openAuth("teacher")} className="btn-secondary">
              <Lock className="h-4 w-4" />
              Faculty Sign-In
            </button>
          )
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAllCampuses((value) => !value);
              setSubject("All");
            }}
            className={cx(
              "inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[11.5px] font-semibold transition",
              allCampuses
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-glow-cyan"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
            )}
          >
            <Globe2 className="h-4 w-4" />
            Search all 18 CMS campuses
            <span
              className={cx(
                "relative h-4 w-7 rounded-full transition",
                allCampuses ? "bg-cyan-400/70" : "bg-white/10"
              )}
            >
              <span
                className={cx(
                  "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                  allCampuses ? "left-3.5" : "left-0.5"
                )}
              />
            </span>
          </button>
          {allCampuses ? <StatusPill tone="cyan">Network catalogue · 18 campuses</StatusPill> : <StatusPill tone="indigo">Branch catalogue</StatusPill>}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author or shelf…"
            className="input-base pl-9"
            aria-label="Search library catalogue"
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Titles in view</p>
          <p className="metric mt-1 text-2xl font-bold text-white">{String(books.length).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Copies available</p>
          <p className="metric mt-1 text-2xl font-bold text-emerald-300">{totalAvailable}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Campus reservations</p>
          <p className="metric mt-1 text-2xl font-bold text-cyan-300">{String(branchReservations.length).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Network scope</p>
          <p className="metric mt-1 text-2xl font-bold text-indigo-300">{allCampuses ? "18" : "01"}</p>
        </div>
      </div>

      <div className="no-scrollbar mb-5 flex items-center gap-1.5 overflow-x-auto pb-1">
        <CategoryChip active={subject === "All"} onClick={() => setSubject("All")}>
          All subjects
        </CategoryChip>
        {subjects.map((item) => (
          <CategoryChip key={item} active={subject === item} onClick={() => setSubject(item)}>
            {item}
          </CategoryChip>
        ))}
      </div>

      {books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No titles match this view"
          description="Try another subject, clear the search, or switch on the 18-campus network catalogue."
          action={
            <button
              type="button"
              onClick={() => {
                setSubject("All");
                setSearch("");
              }}
              className="btn-secondary text-xs"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => {
            const available = book.available > 0;
            return (
              <article
                key={`${book.campusId}-${book.id}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow-indigo"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="chip px-2 py-0.5 text-[9.5px]">{book.subject}</span>
                  <span
                    className={cx(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      available
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-400/30 bg-rose-500/10 text-rose-200"
                    )}
                  >
                    {available ? `${book.available} available` : "All checked out"}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2.5">
                  <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded-md border border-indigo-400/20 bg-gradient-to-b from-indigo-500/20 to-cyan-500/5 text-indigo-200">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-[13px] font-bold leading-snug text-white">{book.title}</h3>
                    <p className="mt-0.5 truncate text-[10.5px] text-slate-400">{book.author}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-slate-400">
                    <Hash className="h-3 w-3 text-slate-600" />
                    {book.shelf}
                  </span>
                  {allCampuses ? (
                    <span className="flex min-w-0 items-center gap-1 text-[9.5px] text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{book.campusName}</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                  <span className="font-mono text-[9.5px] text-slate-500">
                    {book.copies} copies · {book.copies - book.available} out
                  </span>
                  <button
                    type="button"
                    onClick={() => openReserve(book)}
                    disabled={!available}
                    className={cx(
                      "btn px-3 py-1.5 text-[10.5px]",
                      available
                        ? "bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 hover:bg-cyan-500/15 hover:ring-cyan-400/30"
                        : "border border-white/10 text-slate-600"
                    )}
                  >
                    <BookMarked className="h-3.5 w-3.5" />
                    {available ? "Reserve Copy" : "Unavailable"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {branchReservations.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <BookMarked className="h-4 w-4 text-cyan-300" />
              Recent Reservations
            </h3>
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
              {branchReservations.length} total
            </span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {branchReservations.slice(0, 4).map((reservation) => (
              <div key={reservation.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                  <BookMarked className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-slate-200">{reservation.title}</p>
                  <p className="truncate font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    {reservation.roll} · due {formatDate(reservation.dueAt, { year: undefined })}
                  </p>
                </div>
                <StatusPill tone="cyan">{reservation.shelf}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Reserve modal */}
      <Modal
        open={Boolean(reserveTarget) || Boolean(reserved)}
        onClose={() => {
          setReserveTarget(null);
          setReserved(null);
          setRoll("");
        }}
        title={reserved ? "Reservation Confirmed" : "Reserve Library Copy"}
        subtitle={reserved ? reserved.title : reserveTarget ? `${reserveTarget.campusName} · ${reserveTarget.shelf}` : ""}
        icon={reserved ? CheckCircle2 : BookMarked}
        maxWidth="max-w-md"
      >
        {reserved ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 to-slate-950 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
                <BookMarked className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">Copy reserved</p>
              <p className="mt-1.5 font-display text-sm font-bold text-white">{reserved.title}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">{reserved.shelf} · {reserved.campusName}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
                  <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500">Reserved for</p>
                  <p className="font-mono text-[11px] font-bold text-white">{reserved.roll}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
                  <p className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500">Return by</p>
                  <p className="font-mono text-[11px] font-bold text-white">{formatDate(reserved.dueAt)}</p>
                </div>
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-slate-600">{reserved.id}</p>
            </div>
            <p className="text-[10.5px] leading-relaxed text-slate-500">
              Collect the copy from the campus library desk within two school days. The 14-day loan period begins on
              collection.
            </p>
            <button type="button" onClick={() => setReserved(null)} className="btn-primary w-full">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleReserve} className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[12px] font-semibold text-white">{reserveTarget?.title}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {reserveTarget?.author} · {reserveTarget?.available} of {reserveTarget?.copies} available
              </p>
            </div>
            <Field label="Student roll number" required hint="The reservation is held under this roll number for two school days.">
              <input
                value={roll}
                onChange={(event) => setRoll(event.target.value.toUpperCase())}
                placeholder="e.g. 10A-14"
                className="input-base font-mono"
                autoFocus
              />
            </Field>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setReserveTarget(null)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <BookMarked className="h-4 w-4" />
                Reserve Copy
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add book modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Catalogue a New Book"
        subtitle={`Library acquisitions · ${campus.name}`}
        icon={BookOpen}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <Field label="Book title" required>
            <input
              value={bookForm.title}
              onChange={(event) => setBookForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. ICSE Physics — Practical Workbook"
              className="input-base"
              autoFocus
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author" required>
              <input
                value={bookForm.author}
                onChange={(event) => setBookForm((prev) => ({ ...prev, author: event.target.value }))}
                placeholder="Author name"
                className="input-base"
              />
            </Field>
            <Field label="Subject">
              <select
                value={bookForm.subject}
                onChange={(event) => setBookForm((prev) => ({ ...prev, subject: event.target.value }))}
                className="select-base"
              >
                {BOOK_SUBJECTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Copies" required>
              <input
                type="number"
                min="1"
                max="50"
                value={bookForm.copies}
                onChange={(event) => setBookForm((prev) => ({ ...prev, copies: event.target.value }))}
                className="input-base font-mono"
              />
            </Field>
            <Field label="Shelf code" hint="Leave blank to auto-generate from the subject.">
              <input
                value={bookForm.shelf}
                onChange={(event) => setBookForm((prev) => ({ ...prev, shelf: event.target.value.toUpperCase() }))}
                placeholder="SHELF-CS-04"
                className="input-base font-mono"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add to Catalogue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

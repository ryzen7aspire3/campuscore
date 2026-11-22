import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  GraduationCap,
  Lock,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Ticket,
  Users,
  Users2,
} from "lucide-react";
import {
  CategoryChip,
  EmptyState,
  Field,
  Modal,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "./ui";
import { EVENT_CATEGORIES } from "../data/cmsData";
import {
  copyText,
  cx,
  downloadText,
  formatDate,
  initials,
  percent,
  randomCode,
  uid,
} from "../lib/utils";

const CATEGORY_TONES = {
  STEM: "indigo",
  Arts: "fuchsia",
  Sports: "emerald",
  Literary: "amber",
  Service: "cyan",
  Olympiad: "violet",
};

const CATEGORY_BARS = {
  STEM: "from-indigo-500 to-cyan-400",
  Arts: "from-fuchsia-500 to-pink-400",
  Sports: "from-emerald-500 to-teal-300",
  Literary: "from-amber-500 to-yellow-300",
  Service: "from-cyan-500 to-sky-300",
  Olympiad: "from-violet-500 to-purple-300",
};

const CATEGORY_CHIPS = {
  indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
  fuchsia: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200",
  emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  violet: "border-violet-400/30 bg-violet-500/10 text-violet-200",
};

const EMPTY_EVENT = {
  title: "",
  club: "",
  category: "STEM",
  date: "",
  time: "09:00 AM",
  venue: "",
  capacity: "50",
  description: "",
  faculty: "",
};

function PassMatrix({ code }) {
  const cells = Array.from({ length: 48 }, (_, index) => {
    const charCode = code.charCodeAt(index % Math.max(1, code.length));
    return (charCode + index * 7) % 3 !== 0;
  });
  return (
    <div className="grid grid-cols-12 gap-1" aria-hidden="true">
      {cells.map((filled, index) => (
        <span
          key={index}
          className={cx("aspect-square rounded-[2px]", filled ? "bg-slate-900" : "bg-transparent")}
        />
      ))}
    </div>
  );
}

export default function ClubConnect({ app }) {
  const { store, update, campus, isFaculty, toast, openAuth } = app;
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [registerTarget, setRegisterTarget] = useState(null);
  const [form, setForm] = useState({ name: "", className: "", roll: "" });
  const [issuedPass, setIssuedPass] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [copiedPass, setCopiedPass] = useState(false);

  const events = useMemo(() => {
    return [...store.events]
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((event) => category === "All" || event.category === category)
      .filter((event) => {
        const haystack = `${event.title} ${event.club} ${event.venue}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      });
  }, [store.events, category, search]);

  const totalSeats = store.events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRegistered = store.events.reduce((sum, event) => sum + event.registered, 0);
  const seatsLeft = Math.max(0, totalSeats - totalRegistered);

  const openRegister = (event) => {
    if (event.registered >= event.capacity) {
      toast("This event has reached full capacity.", "error");
      return;
    }
    setIssuedPass(null);
    setForm({ name: "", className: "", roll: "" });
    setRegisterTarget(event);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const className = form.className.trim();
    const roll = form.roll.trim();

    if (!name || !className || !roll) {
      toast("Name, class and roll number are required.", "error");
      return;
    }

    const live = store.events.find((item) => item.id === registerTarget.id);
    if (!live) {
      toast("This event is no longer available.", "error");
      setRegisterTarget(null);
      return;
    }
    if (live.registered >= live.capacity) {
      toast("The final seat was taken moments ago. This event is now full.", "error");
      setRegisterTarget(null);
      return;
    }

    const pass = {
      id: `PASS-${randomCode(6)}`,
      eventId: live.id,
      eventTitle: live.title,
      holder: name,
      className,
      roll,
      date: live.date,
      time: live.time,
      venue: live.venue,
      campus: campus.name,
      issuedAt: new Date().toISOString(),
      code: randomCode(12, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"),
    };

    update((draft) => {
      const target = draft.events.find((item) => item.id === live.id);
      if (target && target.registered < target.capacity) {
        target.registered += 1;
        draft.passes.unshift(pass);
      }
      return draft;
    });

    setIssuedPass(pass);
    setForm({ name: "", className: "", roll: "" });
    toast(`Seat confirmed for ${name}. Digital pass generated.`, "success");
  };

  const passText = (pass) =>
    [
      "==============================================",
      "        CAMPUSCORE · DIGITAL EVENT PASS        ",
      "==============================================",
      `Event      : ${pass.eventTitle}`,
      `Campus     : ${pass.campus}`,
      `Date       : ${formatDate(pass.date)} at ${pass.time}`,
      `Venue      : ${pass.venue}`,
      `Holder     : ${pass.holder}`,
      `Class      : ${pass.className}`,
      `Roll No.   : ${pass.roll}`,
      `Pass ID    : ${pass.id}`,
      `Verify Code: ${pass.code}`,
      "----------------------------------------------",
      "This pass is non-transferable. Present it at the",
      "venue entry desk for verification.",
      "CampusCore · City Montessori School · Jai Jagat",
      "==============================================",
    ].join("\n");

  const copyPass = async (pass) => {
    const ok = await copyText(passText(pass));
    setCopiedPass(ok);
    toast(ok ? "Pass details copied to clipboard." : "Clipboard access was blocked by the browser.", ok ? "success" : "error");
    if (ok) setTimeout(() => setCopiedPass(false), 1800);
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();
    const capacity = Number(eventForm.capacity);
    if (!eventForm.title.trim() || !eventForm.club.trim() || !eventForm.date) {
      toast("Title, club and date are required.", "error");
      return;
    }
    if (!Number.isFinite(capacity) || capacity < 1 || capacity > 1000) {
      toast("Capacity must be between 1 and 1000.", "error");
      return;
    }

    const newEvent = {
      id: uid("EVT"),
      title: eventForm.title.trim(),
      club: eventForm.club.trim(),
      category: eventForm.category,
      description:
        eventForm.description.trim() || "Details will be announced by the faculty coordinator.",
      date: eventForm.date,
      time: eventForm.time.trim() || "09:00 AM",
      venue: eventForm.venue.trim() || "Main Auditorium",
      faculty: eventForm.faculty.trim() || "Faculty Coordinator",
      capacity,
      registered: 0,
      createdAt: new Date().toISOString(),
    };

    update((draft) => {
      draft.events.unshift(newEvent);
      return draft;
    });
    setCreateOpen(false);
    setEventForm(EMPTY_EVENT);
    toast("Event published to ClubConnect.", "success");
  };

  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Module 01 · Co-Curricular Command"
        title="ClubConnect"
        description={`Live clubs, inter-campus events and seat capacity for ${campus.name}. Registrations issue a verifiable digital event pass.`}
        icon={Users2}
        actions={
          isFaculty ? (
            <button type="button" onClick={() => setCreateOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create Event
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
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Live Events</p>
          <p className="metric mt-1 text-2xl font-bold text-white">{String(store.events.length).padStart(2, "0")}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Seats Reserved</p>
          <p className="metric mt-1 text-2xl font-bold text-indigo-300">{totalRegistered}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Seats Available</p>
          <p className="metric mt-1 text-2xl font-bold text-cyan-300">{seatsLeft}</p>
        </div>
        <div className="card-pad py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Digital Passes</p>
          <p className="metric mt-1 text-2xl font-bold text-emerald-300">{String(store.passes.length).padStart(2, "0")}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          <CategoryChip active={category === "All"} onClick={() => setCategory("All")}>
            All Events
          </CategoryChip>
          {EVENT_CATEGORIES.map((item) => (
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
            placeholder="Search events, clubs, venues…"
            className="input-base pl-9"
            aria-label="Search events"
          />
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events match this filter"
          description="Try another category or clear your search to see the full campus calendar."
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
          {events.map((event) => {
            const tone = CATEGORY_TONES[event.category] || "indigo";
            const fill = percent(event.registered, event.capacity);
            const full = event.registered >= event.capacity;
            const remaining = Math.max(0, event.capacity - event.registered);

            return (
              <article key={event.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow-indigo">
                <div className={cx("h-1 w-full bg-gradient-to-r", CATEGORY_BARS[event.category] || CATEGORY_BARS.STEM)} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", CATEGORY_CHIPS[tone])}>
                      {event.category}
                    </span>
                    {full ? <StatusPill tone="rose">Full</StatusPill> : <StatusPill tone="emerald" pulse>Open</StatusPill>}
                  </div>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300/80">{event.club}</p>
                  <h3 className="mt-1 font-display text-[15px] font-bold leading-snug text-white">{event.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-slate-400">{event.description}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px]">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                      {formatDate(event.date, { year: undefined })}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {event.time}
                    </span>
                    <span className="col-span-2 flex items-center gap-1.5 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{event.venue}</span>
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="mb-1.5 flex items-end justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Seat capacity</span>
                      <span className="font-mono text-[11px] text-slate-300">
                        <span className={cx("font-bold", full ? "text-rose-300" : "text-white")}>{event.registered}</span>
                        <span className="text-slate-500"> / {event.capacity}</span>
                      </span>
                    </div>
                    <ProgressBar value={fill} tone={fill >= 95 ? "rose" : fill >= 70 ? "amber" : "indigo"} />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                        <Users className="h-3.5 w-3.5" />
                        {full ? "No seats remaining" : `${remaining} seats left`}
                      </span>
                      <button
                        type="button"
                        onClick={() => openRegister(event)}
                        disabled={full}
                        className={cx("btn text-[11px] px-3 py-1.5", full ? "border border-white/10 text-slate-500" : "bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 hover:bg-indigo-500/20 hover:ring-indigo-400/40")}
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        {full ? "Event Full" : "Register Student"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Register / digital pass modal */}
      <Modal
        open={Boolean(registerTarget) || Boolean(issuedPass)}
        onClose={() => {
          setRegisterTarget(null);
          setIssuedPass(null);
          setForm({ name: "", className: "", roll: "" });
          setCopiedPass(false);
        }}
        title={issuedPass ? "Digital Event Pass" : "Register Student"}
        subtitle={issuedPass ? `${issuedPass.eventTitle} · ${campus.name}` : registerTarget ? `${registerTarget.title} · ${registerTarget.venue}` : ""}
        icon={issuedPass ? CheckCircle2 : Ticket}
        maxWidth="max-w-xl"
      >
        {issuedPass ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/15 via-slate-950 to-cyan-500/10 p-5 shadow-glow-indigo">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-300">CampusCore · Event Access</p>
                  <p className="mt-1 font-display text-lg font-extrabold leading-tight text-white">{issuedPass.eventTitle}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{issuedPass.campus}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 font-mono text-[11px] font-bold text-white">
                  {initials(issuedPass.holder)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Pass Holder</p>
                  <p className="truncate text-[12px] font-semibold text-white">{issuedPass.holder}</p>
                </div>
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Class</p>
                  <p className="font-mono text-[12px] font-semibold text-white">{issuedPass.className}</p>
                </div>
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Roll No.</p>
                  <p className="font-mono text-[12px] font-semibold text-white">{issuedPass.roll}</p>
                </div>
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Date</p>
                  <p className="text-[12px] font-semibold text-white">{formatDate(issuedPass.date)}</p>
                </div>
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Time</p>
                  <p className="font-mono text-[12px] font-semibold text-white">{issuedPass.time}</p>
                </div>
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Venue</p>
                  <p className="truncate text-[12px] font-semibold text-white">{issuedPass.venue}</p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-3">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Pass ID</p>
                  <p className="truncate font-mono text-[11px] font-bold text-indigo-200">{issuedPass.id}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">Verify · {issuedPass.code}</p>
                </div>
                <div className="w-28 rounded-lg bg-white p-1.5">
                  <PassMatrix code={issuedPass.code} />
                </div>
              </div>
            </div>

            <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-slate-500">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
              This pass is stored securely in this campus workspace. Present the pass ID at the venue entry desk for
              verification.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => copyPass(issuedPass)} className="btn-secondary flex-1">
                {copiedPass ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                {copiedPass ? "Copied" : "Copy Pass Details"}
              </button>
              <button
                type="button"
                onClick={() => downloadText(`${issuedPass.id}.txt`, passText(issuedPass))}
                className="btn-primary flex-1"
              >
                <Download className="h-4 w-4" />
                Download Pass
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">{registerTarget?.title}</p>
                <p className="text-[10px] text-slate-500">{registerTarget ? `${formatDate(registerTarget.date)} · ${registerTarget.venue}` : ""}</p>
              </div>
              <StatusPill tone="indigo">
                {registerTarget ? `${registerTarget.capacity - registerTarget.registered} seats` : ""}
              </StatusPill>
            </div>

            <Field label="Student full name" required>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Aarav Verma"
                className="input-base"
                autoFocus
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Class & section" required hint="Format: IX-A, X-B, XII-C">
                <input
                  value={form.className}
                  onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value.toUpperCase() }))}
                  placeholder="IX-A"
                  className="input-base font-mono"
                />
              </Field>
              <Field label="Roll number" required>
                <input
                  value={form.roll}
                  onChange={(event) => setForm((prev) => ({ ...prev, roll: event.target.value.toUpperCase() }))}
                  placeholder="9A-14"
                  className="input-base font-mono"
                />
              </Field>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] px-3 py-2.5 text-[10.5px] leading-relaxed text-emerald-200/90">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              One seat will be reserved immediately and a verifiable digital pass will be generated.
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setRegisterTarget(null)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Ticket className="h-4 w-4" />
                Confirm Seat
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Faculty create event modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Campus Event"
        subtitle={`Published to ClubConnect · ${campus.name}`}
        icon={GraduationCap}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Field label="Event title" required>
            <input
              value={eventForm.title}
              onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. Inter-House Robotics Sprint"
              className="input-base"
              autoFocus
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hosting club" required>
              <input
                value={eventForm.club}
                onChange={(event) => setEventForm((prev) => ({ ...prev, club: event.target.value }))}
                placeholder="e.g. Coding Club"
                className="input-base"
              />
            </Field>
            <Field label="Category" required>
              <select
                value={eventForm.category}
                onChange={(event) => setEventForm((prev) => ({ ...prev, category: event.target.value }))}
                className="select-base"
              >
                {EVENT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date" required>
              <input
                type="date"
                value={eventForm.date}
                onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
                className="input-base font-mono text-xs"
              />
            </Field>
            <Field label="Start time">
              <input
                value={eventForm.time}
                onChange={(event) => setEventForm((prev) => ({ ...prev, time: event.target.value }))}
                placeholder="09:30 AM"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Capacity" required>
              <input
                type="number"
                min="1"
                max="1000"
                value={eventForm.capacity}
                onChange={(event) => setEventForm((prev) => ({ ...prev, capacity: event.target.value }))}
                className="input-base font-mono"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Venue">
              <input
                value={eventForm.venue}
                onChange={(event) => setEventForm((prev) => ({ ...prev, venue: event.target.value }))}
                placeholder="Main Auditorium"
                className="input-base"
              />
            </Field>
            <Field label="Faculty coordinator">
              <input
                value={eventForm.faculty}
                onChange={(event) => setEventForm((prev) => ({ ...prev, faculty: event.target.value }))}
                placeholder="Dr. A. Sen"
                className="input-base"
              />
            </Field>
          </div>

          <Field label="Event description">
            <textarea
              rows={3}
              value={eventForm.description}
              onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="What will students do, and what should they bring?"
              className="input-base"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus className="h-4 w-4" />
              Publish Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

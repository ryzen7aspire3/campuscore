import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Inbox,
  Lock,
  X,
} from "lucide-react";
import { cx } from "../lib/utils";

/* ------------------------------------------------------------------
   Modal — accessible, portal-based, scroll-locked
   ------------------------------------------------------------------ */
export function Modal({ open, onClose, title, subtitle, icon: Icon, children, footer, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Dialog"}
        className={cx(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-scale-in sm:rounded-3xl",
          maxWidth
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-indigo-500/10 to-transparent" />
        <div className="relative flex items-start gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
          {Icon ? (
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-200">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold tracking-tight text-white">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="border-t border-white/10 bg-slate-950/60 px-5 py-4 sm:px-6">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------
   Toasts
   ------------------------------------------------------------------ */
const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    ring: "border-emerald-400/30",
    glow: "shadow-[0_0_45px_-18px_rgba(52,211,153,0.7)]",
    iconColor: "text-emerald-300",
    bar: "bg-emerald-400",
  },
  error: {
    icon: AlertTriangle,
    ring: "border-rose-400/30",
    glow: "shadow-[0_0_45px_-18px_rgba(251,113,133,0.7)]",
    iconColor: "text-rose-300",
    bar: "bg-rose-400",
  },
  info: {
    icon: Info,
    ring: "border-cyan-400/30",
    glow: "shadow-[0_0_45px_-18px_rgba(34,211,238,0.65)]",
    iconColor: "text-cyan-300",
    bar: "bg-cyan-400",
  },
};

export function ToastStack({ toasts, onDismiss }) {
  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={cx(
              "pointer-events-auto relative overflow-hidden rounded-2xl border bg-slate-950/95 p-3.5 pr-9 backdrop-blur-xl animate-slide-in",
              style.ring,
              style.glow
            )}
            role="status"
          >
            <div className="flex items-start gap-2.5">
              <Icon className={cx("mt-0.5 h-4 w-4 shrink-0", style.iconColor)} />
              <p className="text-[13px] font-medium leading-snug text-slate-100">{toast.message}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
              className="absolute right-2 top-2 rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
              <div className={cx("h-full w-full origin-left animate-toast-shrink", style.bar)} />
            </div>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------
   Layout primitives
   ------------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, description, icon: Icon, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 text-indigo-200 shadow-glow-indigo">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-slate-400">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-sm font-semibold text-slate-200">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Field({ label, hint, required, children, className }) {
  return (
    <label className={cx("block", className)}>
      <span className="label">
        {label}
        {required ? <span className="ml-1 text-rose-400">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function LockedPanel({ title, description, onUnlock, unlockLabel = "Elevate Access", icon: Icon = Lock, footer }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-glass backdrop-blur-xl sm:p-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[90px]" />
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 shadow-glow-indigo">
        <Icon className="h-7 w-7" />
      </div>
      <p className="eyebrow mb-2">Restricted Clearance</p>
      <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">{description}</p>
      {onUnlock ? (
        <button type="button" onClick={onUnlock} className="btn-primary mx-auto mt-6">
          <Lock className="h-4 w-4" />
          {unlockLabel}
        </button>
      ) : null}
      {footer ? <div className="mt-4 text-[11px] text-slate-500">{footer}</div> : null}
    </div>
  );
}

export function CategoryChip({ children, active, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-200",
        active
          ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100 shadow-glow-indigo"
          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </button>
  );
}

export function StatusPill({ tone = "slate", children, pulse = false }) {
  const tones = {
    slate: "border-white/10 bg-white/5 text-slate-300",
    indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
    emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    rose: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
    gold: "border-amber-300/40 bg-gradient-to-r from-amber-400/20 to-yellow-300/10 text-amber-100",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        tones[tone] || tones.slate
      )}
    >
      {pulse ? <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" /> : null}
      {children}
    </span>
  );
}

export function InlineStat({ label, value, tone = "text-white" }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={cx("metric mt-0.5 text-sm font-bold", tone)}>{value}</p>
    </div>
  );
}

export function ProgressBar({ value, tone = "indigo", className }) {
  const tones = {
    indigo: "from-indigo-500 to-cyan-400",
    emerald: "from-emerald-500 to-teal-300",
    amber: "from-amber-500 to-yellow-300",
    rose: "from-rose-500 to-pink-400",
    cyan: "from-cyan-500 to-sky-400",
  };
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div
        className={cx("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", tones[tone] || tones.indigo)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

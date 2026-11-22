import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bot,
  ClipboardList,
  Library,
  Lock,
  MessageSquareWarning,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users2,
} from "lucide-react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { StatusPill, ToastStack } from "./components/ui";
import ClubConnect from "./components/ClubConnect";
import SchoolChronicle from "./components/SchoolChronicle";
import StudentVoice from "./components/StudentVoice";
import TeachersReport from "./components/TeachersReport";
import DigitalLibrary from "./components/DigitalLibrary";
import WallOfFame from "./components/WallOfFame";
import PrincipalCommand from "./components/PrincipalCommand";
import SchoolAssistant from "./components/SchoolAssistant";
import { CAMPUSES, getCampus } from "./data/cmsData";
import {
  getActiveBranchId,
  loadBranch,
  readSessionRole,
  saveBranch,
  setActiveBranchId,
  writeSessionRole,
} from "./lib/storage";
import { cx } from "./lib/utils";

const MODULES = [
  { id: "clubs", label: "ClubConnect", module: "01", icon: Users2 },
  { id: "chronicle", label: "School Chronicle", module: "02", icon: Newspaper },
  { id: "voice", label: "Student Voice", module: "03", icon: MessageSquareWarning },
  { id: "teachers", label: "Teachers Report", module: "04", icon: ClipboardList },
  { id: "library", label: "Digital Library", module: "05", icon: Library },
  { id: "fame", label: "Wall of Fame", module: "06", icon: Trophy },
  { id: "principal", label: "Principal Command", module: "07", icon: ShieldAlert },
  { id: "assistant", label: "School Assistant", module: "08", icon: Bot },
];

export default function App() {
  const [branchId, setBranchId] = useState(() => getActiveBranchId());
  const [store, setStore] = useState(() => loadBranch(getActiveBranchId()));
  const [role, setRole] = useState(() => readSessionRole());
  const [activeTab, setActiveTab] = useState("clubs");
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState("teacher");
  const [toasts, setToasts] = useState([]);
  const [dismissedDirective, setDismissedDirective] = useState(null);

  const campus = useMemo(() => getCampus(branchId), [branchId]);
  const isFaculty = role === "teacher" || role === "principal";

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current.slice(-3), { id, message, type }]);
      setTimeout(() => {
        setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
      }, 4200);
    },
    []
  );

  const update = useCallback(
    (mutator) => {
      setStore((previous) => {
        const draft = structuredClone(previous);
        const next = mutator(draft) || draft;
        return saveBranch(branchId, next);
      });
    },
    [branchId]
  );

  const switchCampus = useCallback(
    (nextBranchId) => {
      if (nextBranchId === branchId) return;
      setBranchId(nextBranchId);
      setActiveBranchId(nextBranchId);
      setStore(loadBranch(nextBranchId));
      setDismissedDirective(null);
      toast(`Campus context switched to ${getCampus(nextBranchId).name}.`, "info");
    },
    [branchId, toast]
  );

  const changeRole = useCallback(
    (nextRole) => {
      setRole(nextRole);
      writeSessionRole(nextRole);
      if (!nextRole && activeTab === "principal") setActiveTab("clubs");
      if (!nextRole) {
        toast("Clearance locked. Faculty tools are now sealed.", "info");
      }
    },
    [activeTab, toast]
  );

  const openAuth = useCallback((desiredRole = "teacher") => {
    setAuthRole(desiredRole);
    setAuthOpen(true);
  }, []);

  const handleAuthenticated = useCallback(
    (grantedRole) => {
      changeRole(grantedRole);
      if (grantedRole === "principal") setActiveTab("principal");
      if (grantedRole === "counselor") setActiveTab("voice");
    },
    [changeRole]
  );

  const dismissDirective = () => {
    if (store.directive) {
      setDismissedDirective(store.directive.id);
      toast("Broadcast banner collapsed. Open Principal Command to review it.", "info");
    }
  };

  const directive = store.directive && store.directive.id !== dismissedDirective ? store.directive : null;
  const activeClubs = new Set(store.events.map((event) => event.club)).size;

  const app = {
    store,
    update,
    campus,
    role,
    setRole: changeRole,
    isFaculty,
    toast,
    openAuth,
    setTab: setActiveTab,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, branchId]);

  const renderModule = () => {
    switch (activeTab) {
      case "chronicle":
        return <SchoolChronicle app={app} />;
      case "voice":
        return <StudentVoice app={app} />;
      case "teachers":
        return <TeachersReport app={app} />;
      case "library":
        return <DigitalLibrary app={app} />;
      case "fame":
        return <WallOfFame app={app} />;
      case "principal":
        return <PrincipalCommand app={app} />;
      case "assistant":
        return <SchoolAssistant app={app} />;
      case "clubs":
      default:
        return <ClubConnect app={app} />;
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-faint bg-grid opacity-[0.35]"
        style={{ maskImage: "radial-gradient(ellipse at top, black, transparent 78%)" }}
        aria-hidden="true"
      />

      <Navbar
        campus={campus}
        campuses={CAMPUSES}
        onCampusChange={switchCampus}
        role={role}
        onOpenAuth={openAuth}
        onLock={changeRole.bind(null, null)}
        activeClubs={activeClubs}
        directive={directive}
        onDismissDirective={dismissDirective}
      />

      <main className="mx-auto max-w-[1500px] px-4 pb-16 pt-5 sm:px-6">
        {/* Campus executive hero */}
        <section className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">{greeting} · Executive OS</p>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">{today}</span>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {campus.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
                Principal {campus.principal}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="font-mono text-[10px] text-slate-500">Est. {campus.established}</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>{campus.zone}, Lucknow</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="indigo">18-Campus Network</StatusPill>
            <StatusPill tone="cyan">CISCE · ICSE & ISC</StatusPill>
            <StatusPill tone="gold">
              <Sparkles className="h-3 w-3" />
              Session 2026–27
            </StatusPill>
          </div>
        </section>

        {/* Module rail */}
        <nav
          aria-label="CampusCore modules"
          className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/55 p-1.5 shadow-glass backdrop-blur-xl"
        >
          {MODULES.map((module) => {
            const Icon = module.icon;
            const active = activeTab === module.id;
            const locked = module.id === "principal" && role !== "principal";
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveTab(module.id)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                  active
                    ? "bg-gradient-to-b from-indigo-500/25 to-cyan-500/[0.06] text-white ring-1 ring-inset ring-indigo-400/30 shadow-glow-indigo"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                )}
              >
                <span className={cx("font-mono text-[8px] font-bold tracking-wider", active ? "text-cyan-300" : "text-slate-600")}>
                  {module.module}
                </span>
                <Icon className={cx("h-4 w-4 shrink-0", active ? "text-indigo-200" : locked ? "text-slate-600" : "text-slate-500")} />
                <span className="whitespace-nowrap text-[11px] font-semibold">{module.label}</span>
                {locked ? <Lock className="h-3 w-3 text-slate-600" /> : null}
                {active ? <span className="absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" /> : null}
              </button>
            );
          })}
        </nav>

        <div className="mt-6" key={`${branchId}-${activeTab}`}>
          {renderModule()}
        </div>
      </main>

      <footer className="border-t border-white/[0.07] bg-slate-950/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-200">
                CampusCore <span className="font-normal text-slate-500">· City Montessori School</span>
              </p>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-slate-600">
                18 campuses · Lucknow · Jai Jagat
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="emerald" pulse>
              Security secure
            </StatusPill>
            <StatusPill tone="slate">Session 2026–27</StatusPill>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-slate-600">
              Server-verified access · v2.0
            </span>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultRole={authRole}
        campus={campus}
        onAuthenticated={handleAuthenticated}
        toast={toast}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

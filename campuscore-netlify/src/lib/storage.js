import { CAMPUSES, buildBranchData } from "../data/cmsData";

const BRANCH_PREFIX = "cms_branch_";
const ACTIVE_BRANCH_KEY = "cms_active_branch";
const ROLE_KEY = "cms_role";

const hasStorage = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

export function branchStorageKey(branchId) {
  return `${BRANCH_PREFIX}${branchId}`;
}

export function loadBranch(branchId) {
  if (!hasStorage()) return buildBranchData(branchId);
  const key = branchStorageKey(branchId);
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.events)) {
        return parsed;
      }
    }
  } catch {
    /* corrupted payload — reseed below */
  }
  const seeded = buildBranchData(branchId);
  try {
    window.localStorage.setItem(key, JSON.stringify(seeded));
  } catch {
    /* storage full or blocked — keep in-memory copy */
  }
  return seeded;
}

export function saveBranch(branchId, data) {
  const payload = {
    ...data,
    campusId: branchId,
    updatedAt: new Date().toISOString(),
  };
  if (hasStorage()) {
    try {
      window.localStorage.setItem(branchStorageKey(branchId), JSON.stringify(payload));
    } catch {
      /* quota or private-mode failure — UI continues with in-memory state */
    }
  }
  return payload;
}

export function loadAllBranches() {
  return CAMPUSES.map((campus) => loadBranch(campus.id));
}

export function getActiveBranchId() {
  if (!hasStorage()) return CAMPUSES[1].id;
  try {
    const stored = window.localStorage.getItem(ACTIVE_BRANCH_KEY);
    if (stored && CAMPUSES.some((campus) => campus.id === stored)) return stored;
  } catch {
    /* ignore */
  }
  return CAMPUSES[1].id;
}

export function setActiveBranchId(branchId) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(ACTIVE_BRANCH_KEY, branchId);
  } catch {
    /* ignore */
  }
}

export function readSessionRole() {
  try {
    const role = window.sessionStorage.getItem(ROLE_KEY);
    if (role === "teacher" || role === "principal") return role;
    return null;
  } catch {
    return null;
  }
}

export function writeSessionRole(role) {
  try {
    if (role === "teacher" || role === "principal") {
      window.sessionStorage.setItem(ROLE_KEY, role);
    } else {
      window.sessionStorage.removeItem(ROLE_KEY);
    }
  } catch {
    /* ignore */
  }
}

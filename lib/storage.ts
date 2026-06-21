"use client";

const KEY = "oi-luana-state";

export type EntryScenario = "first" | "returning" | "rejected";

type Persisted = {
  visitCount: number;
  rejectedBefore: boolean;
  accepted: boolean;
};

const DEFAULT: Persisted = {
  visitCount: 0,
  rejectedBefore: false,
  accepted: false,
};

function read(): Persisted {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    return { ...DEFAULT };
  }
}

function write(value: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/**
 * Reads stored history, returns the entry scenario, and increments the visit
 * counter. Call once on mount.
 */
export function registerVisit(): {
  scenario: EntryScenario;
  visitCount: number;
  rejectedBefore: boolean;
} {
  const state = read();
  const isFirst = state.visitCount === 0;
  const next: Persisted = { ...state, visitCount: state.visitCount + 1 };
  write(next);

  let scenario: EntryScenario;
  if (isFirst) scenario = "first";
  else if (state.rejectedBefore && !state.accepted) scenario = "rejected";
  else scenario = "returning";

  return {
    scenario,
    visitCount: next.visitCount,
    rejectedBefore: next.rejectedBefore,
  };
}

export function markRejected() {
  write({ ...read(), rejectedBefore: true });
}

export function markAccepted() {
  write({ ...read(), accepted: true });
}

export function getHistory() {
  return read();
}

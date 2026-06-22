"use client";

const KEY = "archetype-state";

type Persisted = {
  visitCount: number;
};

const DEFAULT: Persisted = {
  visitCount: 0,
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
 * Increments the anonymous visit counter and returns the new value. Call once
 * on mount. Client-only to avoid hydration mismatch.
 */
export function registerVisit(): { visitCount: number } {
  const state = read();
  const next: Persisted = { visitCount: state.visitCount + 1 };
  write(next);
  return { visitCount: next.visitCount };
}

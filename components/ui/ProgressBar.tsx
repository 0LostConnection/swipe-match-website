"use client";

import { motion } from "motion/react";

type Props = {
  current: number;
  total: number;
};

/** Discrete swipe progress: a thin track plus an "n/total" count. */
export function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent-primary"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 240, damping: 30 }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-text-muted">
        {current}/{total}
      </span>
    </div>
  );
}

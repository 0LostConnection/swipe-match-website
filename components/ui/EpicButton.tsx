"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

/**
 * A high-emphasis CTA: a rotating conic-gradient border (same `--angle` trick as
 * the reveal card) wraps a dark pill, layered with a pulsing accent glow and a
 * sweeping shimmer so it reads as the "epic" action on the screen.
 */
export function EpicButton({ children, onClick, className = "" }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 480, damping: 20 }}
      className={`group relative isolate inline-flex tap-target select-none ${className}`}
    >
      {/* Pulsing glow halo behind the pill */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-full opacity-70 blur-md"
        style={{
          background:
            "conic-gradient(from var(--angle), var(--accent-primary), var(--accent-secondary), var(--accent-primary))",
          animation: "spin-border 5s linear infinite, badge-pulse 2.4s ease-in-out infinite",
        }}
      />
      {/* Rotating gradient border */}
      <span
        aria-hidden
        className="rounded-full p-[2px]"
        style={{
          background:
            "conic-gradient(from var(--angle), var(--accent-primary), var(--accent-secondary), var(--accent-primary))",
          animation: "spin-border 5s linear infinite",
        }}
      >
        <span className="relative flex items-center gap-2 overflow-hidden rounded-full bg-bg-card px-7 py-3.5 font-body text-base font-semibold tracking-wide text-text-primary">
          {/* Sweeping shimmer */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:200%_100%]"
            style={{ animation: "badge-shimmer 2.8s linear infinite" }}
          />
          <span className="relative">{children}</span>
        </span>
      </span>
    </motion.button>
  );
}

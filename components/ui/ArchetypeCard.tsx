"use client";

import { motion } from "motion/react";
import type { Archetype } from "@/lib/types";

type Props = {
  archetype: Archetype;
};

/**
 * The reveal card: feels like a rare item being unlocked. A rotating conic
 * gradient runs around the border, with the archetype's own gradient washing
 * the interior.
 */
export function ArchetypeCard({ archetype }: Props) {
  const [from, to] = archetype.gradient;

  return (
    <motion.div
      className="relative w-full max-w-[420px]"
      initial={{ opacity: 0, scale: 0.85, rotateX: 12 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      style={{ perspective: 1000 }}
    >
      {/* Animated gradient border */}
      <div
        className="rounded-[24px] p-[2px]"
        style={{
          background: `conic-gradient(from var(--angle), ${from}, ${to}, ${from})`,
          animation: "spin-border 6s linear infinite",
        }}
      >
        <div className="relative overflow-hidden rounded-[22px] bg-bg-card px-7 pb-9 pt-7">
          {/* Interior gradient wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(120% 90% at 50% -10%, ${to} 0%, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <motion.div
              className="relative mb-5"
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.25 }}
            >
              {/* Pulsing aura behind the badge */}
              <div
                aria-hidden
                className="absolute inset-0 -inset-x-3 -inset-y-1 rounded-full blur-lg"
                style={{
                  background: `linear-gradient(90deg, ${from}, ${to})`,
                  animation: "badge-pulse 2.8s ease-in-out infinite",
                }}
              />

              {/* Shimmering gradient ring */}
              <div
                className="relative rounded-full p-[1.5px]"
                style={{
                  background: `linear-gradient(90deg, ${from}, ${to}, ${from}, ${to})`,
                  backgroundSize: "300% 100%",
                  animation: "badge-shimmer 4s linear infinite",
                }}
              >
                <span
                  className="relative block rounded-full px-4 py-1.5 font-mono text-[10px] font-bold tracking-[0.22em]"
                  style={{
                    background: `linear-gradient(135deg, ${from}33, ${to}22)`,
                    color: "var(--text-primary)",
                    textShadow: `0 0 12px ${from}88`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 20px ${from}44`,
                  }}
                >
                  {archetype.badgeLabel}
                </span>
              </div>
            </motion.div>

            <motion.span
              className="mb-4 text-7xl"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            >
              {archetype.icon}
            </motion.span>

            <motion.h1
              className="font-display text-[34px] italic leading-tight text-text-primary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {archetype.title}
            </motion.h1>

            <motion.p
              className="mt-3 max-w-[320px] font-body text-base leading-relaxed text-text-primary/80"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {archetype.subtitle}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

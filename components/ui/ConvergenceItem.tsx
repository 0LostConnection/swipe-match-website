"use client";

import { motion, type Variants } from "motion/react";
import type { Card } from "@/lib/types";

const item: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

type Props = {
  card: Card;
};

export function ConvergenceItem({ card }: Props) {
  return (
    <motion.li variants={item} className="relative">
      <div className="flex items-start gap-4 py-4">
        <span className="mt-0.5 text-3xl">{card.emoji}</span>
        <div className="flex-1">
          <p className="font-body text-base font-semibold text-text-primary">
            {card.label}
          </p>
          <p className="mt-1 font-body text-sm leading-relaxed text-text-muted">
            {card.flavorText}
          </p>
        </div>
      </div>
      {/* Gradient separator */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />
    </motion.li>
  );
}

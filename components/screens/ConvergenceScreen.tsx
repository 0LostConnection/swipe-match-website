"use client";

import { motion, type Variants } from "motion/react";
import { ConvergenceItem } from "@/components/ui/ConvergenceItem";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { LOW_CONVERGENCE_MESSAGE, MIN_CONVERGENCE } from "@/lib/scoring";
import type { Card } from "@/lib/types";

const list: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

type Props = {
  convergence: Card[];
  creatorName: string;
  onRestart: () => void;
};

export function ConvergenceScreen({
  convergence,
  creatorName,
  onRestart,
}: Props) {
  const hasEnough = convergence.length >= MIN_CONVERGENCE;

  return (
    <ScreenShell scroll className="relative justify-start !pb-0">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-36 pt-4">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-text-muted">
            CONVERGÊNCIA
          </p>
          <h2 className="mt-2 font-display text-3xl italic leading-tight text-text-primary">
            Gostos que a gente divide
          </h2>
          <p className="mt-2 font-body text-sm text-text-muted">
            O que você e {creatorName} têm em comum.
          </p>
        </motion.header>

        {hasEnough ? (
          <motion.ul
            className="mt-6"
            variants={list}
            initial="hidden"
            animate="show"
          >
            {convergence.map((card) => (
              <ConvergenceItem key={card.id} card={card} />
            ))}
          </motion.ul>
        ) : (
          <motion.p
            className="mt-8 font-body text-base leading-relaxed text-text-primary/85"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {LOW_CONVERGENCE_MESSAGE}
          </motion.p>
        )}
      </div>

      <motion.footer
        className="absolute inset-x-0 bottom-0 z-20 px-6 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          background:
            "linear-gradient(to top, var(--bg-base) 0%, color-mix(in srgb, var(--bg-base) 92%, transparent) 55%, transparent 100%)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="relative z-10 flex justify-center">
          <PrimaryButton onClick={onRestart}>Refazer</PrimaryButton>
        </div>
      </motion.footer>
    </ScreenShell>
  );
}

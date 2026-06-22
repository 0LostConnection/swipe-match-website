"use client";

import { motion } from "motion/react";
import { ArchetypeCard } from "@/components/ui/ArchetypeCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { getArchetype } from "@/lib/archetypes";
import type { ArchetypeId } from "@/lib/types";

type Props = {
  result: ArchetypeId;
  onContinue: () => void;
};

export function RevealScreen({ result, onContinue }: Props) {
  const archetype = getArchetype(result);

  return (
    <ScreenShell className="items-center justify-center">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <p
          className="font-display text-4xl italic leading-none text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--accent-primary) 0%, #e9d5ff 45%, var(--accent-secondary) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            filter: "drop-shadow(0 0 24px rgba(192, 132, 252, 0.45))",
          }}
        >
          Você é
        </p>
        <div
          aria-hidden
          className="mx-auto mt-3 h-px w-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent-primary), var(--accent-secondary), transparent)",
          }}
        />
      </motion.div>

      <ArchetypeCard archetype={archetype} />

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 22 }}
      >
        <PrimaryButton onClick={onContinue} variant="secondary">
          E tem mais uma coisa
        </PrimaryButton>
      </motion.div>
    </ScreenShell>
  );
}

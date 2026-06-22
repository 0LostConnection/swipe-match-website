"use client";

import { motion } from "motion/react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: Props) {
  return (
    <ScreenShell className="items-center justify-center text-center">
      <motion.span
        className="mb-6 font-mono text-xs tracking-[0.4em] text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        ARCHETYPE
      </motion.span>

      <AnimatedText
        as="h1"
        text="O que os seus instintos dizem sobre você?"
        className="font-display text-4xl italic leading-tight text-text-primary"
        stagger={0.07}
      />

      <motion.p
        className="mt-5 max-w-[300px] font-body text-base leading-relaxed text-text-muted"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        Deixe o dedo decidir. No fim, você descobre quem você é — e mais alguma
        coisa.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 320, damping: 24 }}
        className="mt-12"
      >
        <PrimaryButton onClick={onStart}>Começar</PrimaryButton>
      </motion.div>
    </ScreenShell>
  );
}

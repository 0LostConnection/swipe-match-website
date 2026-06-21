"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { intro } from "@/lib/content";
import type { EntryScenario } from "@/lib/storage";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ScreenFillButton } from "@/components/ui/ScreenFillButton";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  scenario: EntryScenario;
  onStart: () => void;
};

const COPY = {
  first: intro.first,
  returning: intro.returning,
  rejected: intro.rejected,
} as const;

export function IntroScreen({ scenario, onStart }: Props) {
  const copy = COPY[scenario];
  const [flash, setFlash] = useState(false);

  // Scenario B fires a quick emoji "stamp" before the fill transition.
  const handleComplete = () => {
    if (scenario === "returning") {
      setFlash(true);
      setTimeout(onStart, 550);
    } else {
      onStart();
    }
  };

  return (
    <ScreenShell className="items-center justify-center text-center">
      <motion.div
        className="text-6xl"
        animate={{ rotate: [0, 18, -8, 14, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
      >
        {scenario === "rejected" ? intro.emojis.rejected : intro.emojis.welcome}
      </motion.div>

      <AnimatedText
        text={copy.text}
        as="h1"
        className="mt-6 font-display text-2xl font-semibold leading-snug text-ink"
        stagger={0.06}
      />

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 22 }}
      >
        <ScreenFillButton
          label={copy.button}
          variant="pink"
          color="var(--pink)"
          onComplete={handleComplete}
        />
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="text-[7rem]"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-30, 8, 0] }}
              transition={{ duration: 0.5 }}
            >
              {intro.emojis.returningFlash}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}

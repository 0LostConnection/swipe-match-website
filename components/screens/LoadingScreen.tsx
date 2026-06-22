"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/ui/ScreenShell";

const PHRASES = [
  "Analisando suas escolhas...",
  "Consultando os arquivos secretos...",
  "Seu arquétipo está emergindo...",
];

const PHRASE_MS = 1000;

type Props = {
  onDone: () => void;
};

export function LoadingScreen({ onDone }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timers = PHRASES.map((_, i) =>
      setTimeout(() => setIndex(i), i * PHRASE_MS),
    );
    const done = setTimeout(onDone, PHRASES.length * PHRASE_MS);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <ScreenShell className="items-center justify-center text-center">
      <motion.div
        className="mb-10 h-12 w-12 rounded-full border-2 border-border border-t-accent-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      <div className="h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="font-mono text-sm tracking-wide text-text-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {PHRASES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </ScreenShell>
  );
}

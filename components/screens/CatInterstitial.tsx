"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { catInterstitial as catCopy } from "@/lib/content";
import { BobImage } from "@/components/ui/BobImage";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Squish } from "@/components/ui/Squish";

type Props = {
  onDone: () => void;
};

const LOADING_MS = 2600;

export function CatInterstitial({ onDone }: Props) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduce ? 300 : LOADING_MS);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <ScreenShell className="items-center justify-center text-center">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, rotate: [0, -2, 2, 0] }}
        transition={{
          y: { type: "spring", stiffness: 200, damping: 18 },
          rotate: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <BobImage src="/assets/cat.gif" alt={catCopy.imageAlt} size={260} bob={false} priority />
      </motion.div>

      <p className="mt-6 font-display text-xl text-ink-soft">
        {ready ? catCopy.ready : catCopy.thinking}
      </p>

      <div className="mt-5 flex min-h-14 items-center justify-center">
        <AnimatePresence mode="wait">
          {ready ? (
            <motion.div
              key="continue"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Squish variant="pink" onClick={onDone}>
                {catCopy.continue}
              </Squish>
            </motion.div>
          ) : (
            <motion.svg
              key="spinner"
              className="h-10 w-10"
              viewBox="0 0 36 36"
              exit={{ opacity: 0 }}
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(59,42,42,0.12)"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--pink)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="24 200"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { celebration as celebrationCopy } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { BobImage } from "@/components/ui/BobImage";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  onDone: () => void;
};

const DURATION = 4;

export function CelebrationScreen({ onDone }: Props) {
  const reduce = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const wait = (reduce ? 0.6 : DURATION) * 1000;
    const t = setTimeout(() => setLeaving(true), wait);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <ScreenShell className="items-center justify-center text-center overflow-hidden">
      <motion.div
        animate={leaving ? { y: "-120vh", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        onAnimationComplete={() => leaving && onDone()}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <BobImage
            src={ASSETS.dogButterfly}
            alt={celebrationCopy.imageAlt}
            size={280}
            bob={false}
            priority
          />
        </motion.div>

        <motion.h1
          className="mt-8 font-display text-4xl font-bold text-ink"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 16 }}
        >
          {celebrationCopy.title}
        </motion.h1>
        <motion.p
          className="mt-2 font-body text-lg text-ink-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {celebrationCopy.subtitle}
        </motion.p>
      </motion.div>
    </ScreenShell>
  );
}

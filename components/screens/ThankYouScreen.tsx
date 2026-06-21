"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { thankYou } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  onRestart: () => void;
};

export function ThankYouScreen({ onRestart }: Props) {
  const reduce = useReducedMotion();

  return (
    <ScreenShell className="items-center justify-center text-center">
      <motion.div
        className="relative h-56 w-56"
        initial={{ scale: 0, rotate: -20 }}
        animate={
          reduce
            ? { scale: 1, rotate: 0 }
            : { scale: 1, rotate: 0, y: [0, -12, 0] }
        }
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 12 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/assets/emoji-guy-tongue-out-end.png"
          alt={thankYou.imageAlt}
          fill
          unoptimized
          priority
          sizes="224px"
          className="object-contain"
        />
      </motion.div>

      <AnimatedText
        text={thankYou.title}
        as="h1"
        className="mt-6 font-display text-4xl font-bold text-ink"
        stagger={0.08}
      />
      <motion.p
        className="mt-2 font-body text-lg text-ink-soft"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {thankYou.subtitle}
      </motion.p>

      <motion.button
        type="button"
        onClick={onRestart}
        aria-label={thankYou.restartAriaLabel}
        className="tap-target mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-ink sticker sticker-outline"
        whileHover={{ rotate: 180 }}
        whileTap={{ scale: 0.85, rotate: 360 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        ↻
      </motion.button>
    </ScreenShell>
  );
}

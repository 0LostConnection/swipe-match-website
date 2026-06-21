"use client";

import { motion } from "motion/react";
import { availability } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Calendar } from "@/components/ui/Calendar";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Squish } from "@/components/ui/Squish";

type Props = {
  selected: string[];
  onChange: (dates: string[]) => void;
  onNext: () => void;
};

export function DateAvailabilityScreen({ selected, onChange, onNext }: Props) {
  return (
    <ScreenShell className="justify-center">
      <AnimatedText
        text={availability.heading}
        as="h1"
        className="font-display text-2xl font-bold text-ink"
        stagger={0.05}
      />
      <motion.p
        className="mt-2 font-body text-ink-soft"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {availability.hint}
      </motion.p>

      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 24 }}
      >
        <Calendar selected={selected} onChange={onChange} />
      </motion.div>

      <motion.div
        className="pt-6"
        animate={{ opacity: selected.length ? 1 : 0.4 }}
      >
        <Squish
          variant="sky"
          className="w-full"
          disabled={!selected.length}
          onClick={onNext}
        >
          {availability.next}
        </Squish>
      </motion.div>
    </ScreenShell>
  );
}

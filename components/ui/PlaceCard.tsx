"use client";

import { motion } from "motion/react";
import type { Place } from "@/lib/content";

type Props = {
  place: Place;
  index: number;
  selected: boolean;
  onSelect: () => void;
};

const TILTS = ["-1.5deg", "1.2deg", "-0.8deg", "1.6deg"];

export function PlaceCard({ place, index, selected, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="tap-target relative w-full text-left rounded-3xl bg-white sticker sticker-outline px-5 py-4"
      style={{ rotate: TILTS[index % TILTS.length] }}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 24,
        delay: 0.08 * index,
      }}
      whileHover={{ scale: 1.03, rotate: "0deg" }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{place.emoji}</span>
        <div className="flex-1">
          <p className="font-display text-xl font-semibold text-ink">
            {place.name}
          </p>
          <p className="text-sm text-ink-soft">
            {place.time} · {place.address}
          </p>
        </div>
        <motion.span
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
          animate={
            selected
              ? { scale: 1, backgroundColor: "var(--mint)" }
              : { scale: 0.8, backgroundColor: "rgba(0,0,0,0.06)" }
          }
        >
          {selected ? "✓" : ""}
        </motion.span>
      </div>
    </motion.button>
  );
}

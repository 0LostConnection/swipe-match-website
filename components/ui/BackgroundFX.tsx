"use client";

import { motion } from "motion/react";

type Blob = {
  color: string;
  size: number;
  initial: { x: string; y: string };
  drift: { x: number[]; y: number[] };
  duration: number;
};

const BLOBS: Blob[] = [
  {
    color: "rgba(192, 132, 252, 0.22)",
    size: 420,
    initial: { x: "-10%", y: "-12%" },
    drift: { x: [0, 30, 0], y: [0, 24, 0] },
    duration: 18,
  },
  {
    color: "rgba(56, 189, 248, 0.18)",
    size: 360,
    initial: { x: "70%", y: "8%" },
    drift: { x: [0, -28, 0], y: [0, 30, 0] },
    duration: 22,
  },
  {
    color: "rgba(124, 58, 237, 0.16)",
    size: 480,
    initial: { x: "20%", y: "62%" },
    drift: { x: [0, 24, 0], y: [0, -26, 0] },
    duration: 26,
  },
];

/** Slow drifting color blobs over a grain-free dark backdrop. */
export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.initial.x,
            top: blob.initial.y,
            background: blob.color,
          }}
          animate={{ x: blob.drift.x, y: blob.drift.y }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

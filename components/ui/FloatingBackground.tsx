"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  mood?: "happy" | "cool";
  count?: number;
};

type Item = {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  startOpacity: number;
};

const HAPPY = ["💖", "✨", "🩷", "💕", "⭐", "🌸"];
const COOL = ["💧", "☁️", "🌧️", "·"];

/** Decorative emojis drifting upward to give the page atmosphere. */
export function FloatingBackground({ mood = "happy", count = 12 }: Props) {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const set = mood === "happy" ? HAPPY : COOL;
    // Decorative client-only randomness; generated post-mount to stay pure.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        emoji: set[i % set.length],
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        duration: 9 + Math.random() * 10,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        startOpacity: 0.25 + Math.random() * 0.35,
      })),
    );
  }, [count, mood]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="absolute bottom-[-10%]"
          style={{
            left: `${it.left}%`,
            fontSize: it.size,
            opacity: it.startOpacity,
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: "-120vh",
            x: [0, it.drift, 0],
            rotate: [0, 18, -12, 0],
          }}
          transition={{
            duration: it.duration,
            delay: it.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}

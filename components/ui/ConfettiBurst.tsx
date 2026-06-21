"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  /** Toggle to fire/show the burst. */
  active: boolean;
  count?: number;
};

type Piece = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
  size: number;
  duration: number;
};

const PIECES = ["🎉", "💖", "✨", "🌸", "⭐", "🩷", "🎊"];

/** A one-shot emoji confetti burst from the center of the screen. */
export function ConfettiBurst({ active, count = 28 }: Props) {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    // Decorative client-only randomness; generated when the burst fires.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(
      Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random();
        const dist = 120 + Math.random() * 220;
        return {
          id: i,
          emoji: PIECES[i % PIECES.length],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 80,
          rotate: (Math.random() - 0.5) * 540,
          size: 18 + Math.random() * 22,
          duration: 1.1 + Math.random() * 0.9,
        };
      }),
    );
  }, [active, count]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {active && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
        >
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute"
              style={{ fontSize: p.size }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 1,
                rotate: p.rotate,
              }}
              transition={{ duration: p.duration, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

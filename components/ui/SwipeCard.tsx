"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Card, SwipeDirection } from "@/lib/types";

type CategoryMeta = { label: string; icon: string; color: string };

const CATEGORY_META: Record<Card["category"], CategoryMeta> = {
  food: { label: "COMIDA", icon: "🍴", color: "#FB923C" },
  music: { label: "MÚSICA", icon: "🎵", color: "#C084FC" },
  topic: { label: "INTERESSE", icon: "💡", color: "#38BDF8" },
  aesthetic: { label: "CENÁRIO", icon: "🎭", color: "#34D399" },
};

/**
 * The static visual of a card, shared by the interactive top card and the peek
 * card behind it so they look identical. `overlay` lets the top card layer in
 * its MATCH/PASS affordances.
 */
export function CardFace({
  card,
  overlay,
}: {
  card: Card;
  overlay?: React.ReactNode;
}) {
  const meta = CATEGORY_META[card.category];

  return (
    <div
      className="elevated relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border bg-bg-card p-6"
      style={{ borderColor: `${meta.color}55` }}
    >
      {/* Category-colored glow from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background: `radial-gradient(120% 80% at 50% -20%, ${meta.color}33 0%, transparent 65%)`,
        }}
      />
      {/* Category accent stripe along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: meta.color }}
      />

      {overlay}

      {/* Prominent category badge */}
      <div className="relative flex justify-center">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs font-bold tracking-[0.2em]"
          style={{
            color: meta.color,
            borderColor: `${meta.color}80`,
            backgroundColor: `${meta.color}1A`,
          }}
        >
          <span className="text-sm">{meta.icon}</span>
          {meta.label}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        {/* Emoji on a category-colored ring */}
        <span
          className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border text-6xl"
          style={{
            borderColor: `${meta.color}66`,
            boxShadow: `0 0 40px -8px ${meta.color}80`,
            background: `radial-gradient(circle at 50% 40%, ${meta.color}22, transparent 70%)`,
          }}
        >
          {card.emoji}
        </span>
        <p className="px-2 font-body text-xl font-medium leading-snug text-text-primary">
          {card.label}
        </p>
      </div>

      <div aria-hidden className="h-6" />
    </div>
  );
}

const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 600;

export type SwipeCardHandle = {
  swipe: (dir: SwipeDirection) => void;
};

type Props = {
  card: Card;
  onSwipe: (dir: SwipeDirection) => void;
  dragX?: MotionValue<number>;
  onEnterComplete?: () => void;
};

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { card, onSwipe, dragX: dragXProp, onEnterComplete },
  ref,
) {
  const internalX = useMotionValue(0);
  const x = dragXProp ?? internalX;
  const [exiting, setExiting] = useState(false);
  const enteredRef = useRef(false);

  useEffect(() => {
    enteredRef.current = false;
    x.set(0);
  }, [card.id, x]);

  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  const matchOpacity = useTransform(x, [30, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -30], [1, 0]);

  const fling = (dir: SwipeDirection) => {
    if (exiting) return;
    setExiting(true);
    const target = dir === "like" ? 720 : -720;
    animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 34,
      onComplete: () => onSwipe(dir),
    });
  };

  useImperativeHandle(ref, () => ({ swipe: fling }));

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      fling("like");
    } else if (offset < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
      fling("pass");
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag={exiting ? false : "x"}
      dragSnapToOrigin={false}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.94, y: 24, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      onAnimationComplete={() => {
        if (enteredRef.current || exiting) return;
        enteredRef.current = true;
        onEnterComplete?.();
      }}
    >
      <CardFace
        card={card}
        overlay={
          <>
            <motion.span
              style={{ opacity: matchOpacity }}
              className="pointer-events-none absolute left-5 top-14 z-10 rounded-md border-2 border-accent-secondary px-3 py-1 font-mono text-sm font-bold tracking-widest text-accent-secondary"
            >
              MATCH
            </motion.span>
            <motion.span
              style={{ opacity: passOpacity }}
              className="pointer-events-none absolute right-5 top-14 z-10 rounded-md border-2 border-accent-danger px-3 py-1 font-mono text-sm font-bold tracking-widest text-accent-danger"
            >
              PASS
            </motion.span>
          </>
        }
      />
    </motion.div>
  );
});

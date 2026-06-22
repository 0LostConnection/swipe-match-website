"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  CardFace,
  SwipeCard,
  type SwipeCardHandle,
} from "@/components/ui/SwipeCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import type { Card, SwipeDirection } from "@/lib/types";

type Props = {
  deck: Card[];
  currentIndex: number;
  onSwipe: (dir: SwipeDirection) => void;
};

const PEEK_DRAG_RANGE = 140;

export function SwipeDeck({ deck, currentIndex, onSwipe }: Props) {
  const cardRef = useRef<SwipeCardHandle>(null);
  const dragX = useMotionValue(0);
  const [peekAfterIndex, setPeekAfterIndex] = useState<number | null>(null);

  const current = deck[currentIndex];
  const next = deck[currentIndex + 1];
  const peekVisible = peekAfterIndex === currentIndex;

  const peekScale = useTransform(dragX, (v) => {
    const t = Math.min(Math.abs(v) / PEEK_DRAG_RANGE, 1);
    return 0.94 + 0.06 * t;
  });

  const peekY = useTransform(dragX, (v) => {
    const t = Math.min(Math.abs(v) / PEEK_DRAG_RANGE, 1);
    return 24 * (1 - t);
  });

  const peekOpacity = useTransform(dragX, (v) => {
    const t = Math.min(Math.abs(v) / PEEK_DRAG_RANGE, 1);
    return 0.55 + 0.45 * t;
  });

  useEffect(() => {
    dragX.set(0);
  }, [currentIndex, dragX]);

  const trigger = (dir: SwipeDirection) => cardRef.current?.swipe(dir);

  return (
    <ScreenShell scroll className="justify-between">
      <header className="pt-1">
        <ProgressBar current={currentIndex + 1} total={deck.length} />
      </header>

      <div className="relative mx-auto my-6 aspect-3/4 w-full max-w-[360px] flex-1">
        {next && peekVisible ? (
          <motion.div
            key={`peek-${next.id}`}
            className="absolute inset-0 z-0"
            style={{ scale: peekScale, y: peekY, opacity: peekOpacity }}
            aria-hidden
          >
            <CardFace card={next} />
          </motion.div>
        ) : null}

        {current ? (
          <SwipeCard
            ref={cardRef}
            key={current.id}
            card={current}
            dragX={dragX}
            onSwipe={onSwipe}
            onEnterComplete={() => setPeekAfterIndex(currentIndex)}
          />
        ) : null}
      </div>

      <footer className="flex items-center justify-center gap-8 pb-2">
        <SwipeButton
          label="Pass"
          variant="danger"
          onClick={() => trigger("pass")}
        >
          ✕
        </SwipeButton>
        <SwipeButton
          label="Match"
          variant="match"
          onClick={() => trigger("like")}
        >
          ♥
        </SwipeButton>
      </footer>
    </ScreenShell>
  );
}

function SwipeButton({
  children,
  label,
  variant,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  variant: "danger" | "match";
  onClick: () => void;
}) {
  const color =
    variant === "danger"
      ? "border-accent-danger text-accent-danger"
      : "border-accent-secondary text-accent-secondary";
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className={`tap-target flex h-16 w-16 items-center justify-center rounded-full border-2 bg-bg-card text-2xl ${color}`}
    >
      {children}
    </motion.button>
  );
}

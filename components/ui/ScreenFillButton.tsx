"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Squish } from "./Squish";

type Props = {
  label: string;
  onComplete: () => void;
  onIntent?: () => void;
  color?: string; // css color for the expanding circle
  variant?: "pink" | "sky" | "sun" | "mint";
};

/**
 * A button that, on press, expands a colored circle from itself until it fills
 * the screen, then fires `onComplete` to reveal the next screen.
 */
export function ScreenFillButton({
  label,
  onComplete,
  onIntent,
  color = "var(--pink)",
  variant = "pink",
}: Props) {
  const [filling, setFilling] = useState(false);
  const reduce = useReducedMotion();

  const handleClick = () => {
    if (filling) return;
    if (reduce) {
      onComplete();
      return;
    }
    setFilling(true);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <Squish
        variant={variant}
        onClick={handleClick}
        disabled={filling}
        onMouseEnter={onIntent}
        onFocus={onIntent}
      >
        {label}
      </Squish>

      <AnimatePresence>
        {filling && (
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 rounded-full"
            style={{
              backgroundColor: color,
              width: 80,
              height: 80,
              marginLeft: -40,
              marginTop: -40,
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 40, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.84, 0] }}
            onAnimationComplete={onComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

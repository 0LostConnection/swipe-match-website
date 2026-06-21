"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type Variant = "pink" | "sky" | "sun" | "mint" | "ghost" | "cool";

const VARIANTS: Record<Variant, string> = {
  pink: "bg-pink text-ink sticker-outline",
  sky: "bg-sky text-ink sticker-outline",
  sun: "bg-sun text-ink sticker-outline",
  mint: "bg-mint text-ink sticker-outline",
  ghost: "bg-white/70 text-ink border-3 border-ink/20",
  cool: "bg-white text-cool-ink border-3 border-cool-ink/30",
};

type Props = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
};

/**
 * Chunky pressable pill button with a 3D "squish" on tap and a springy wobble
 * on hover.
 */
export function Squish({
  children,
  variant = "pink",
  className = "",
  ...props
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.92, y: 3 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className={`tap-target font-display font-semibold text-lg rounded-full px-7 py-3 sticker select-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent-primary text-bg-base shadow-[0_12px_32px_-12px_rgba(192,132,252,0.7)]",
  secondary:
    "bg-accent-secondary text-bg-base shadow-[0_12px_32px_-12px_rgba(56,189,248,0.7)]",
  ghost: "bg-transparent text-text-muted border border-border hover:text-text-primary",
};

type Props = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
};

export function PrimaryButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 480, damping: 22 }}
      className={`tap-target select-none rounded-full px-8 py-3.5 font-body text-base font-semibold tracking-wide transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

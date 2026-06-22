"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

/** Fade-in-down wrapper aligned with AnimatedText motion tokens. */
export function FadeInDown({
  children,
  delay = 0,
  className = "",
  ...props
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 26,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

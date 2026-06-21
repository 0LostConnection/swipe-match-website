"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.12) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

// Fade-in-down: text drops in from slightly above, mimicking reading top-down.
const word: Variants = {
  hidden: { opacity: 0, y: -14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 420, damping: 28 },
  },
};

type Tag = "p" | "h1" | "h2" | "h3" | "span" | "div";

const MOTION_TAGS = {
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  div: motion.div,
} as const;

type Props = {
  text: string;
  as?: Tag;
  className?: string;
  stagger?: number;
  delay?: number;
  /** Animate per word (default) or as one block. */
  block?: boolean;
};

/**
 * Staggered top-down fade + rise, mimicking reading. Splits into words so the
 * eye is gently led down the screen.
 */
export function AnimatedText({
  text,
  as = "p",
  className,
  stagger = 0.1,
  delay = 0,
  block = false,
}: Props) {
  const MotionTag = MOTION_TAGS[as];
  const words = text.split(" ");

  if (block) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y: -16, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 380, damping: 26, delay }}
      >
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      animate="show"
      style={{ transitionDelay: `${delay}s` }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

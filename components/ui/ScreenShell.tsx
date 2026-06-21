"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * When true, the shell is locked to the viewport height so an inner
   * `flex-1 overflow-y-auto` region can scroll internally (header/footer stay
   * pinned). Defaults to false: the column grows with its content and the page
   * scrolls, which suits the short, vertically-centered screens.
   */
  scroll?: boolean;
};

/**
 * Mobile-first full-height centered column with safe-area padding. Wraps each
 * screen's content and provides the standard enter/exit transition.
 */
export function ScreenShell({ children, className = "", scroll = false }: Props) {
  return (
    <motion.div
      className={`relative z-10 flex w-full justify-center ${
        scroll ? "h-[100svh]" : "min-h-[100svh]"
      }`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div
        className={`flex w-full max-w-md flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] ${
          scroll ? "min-h-0" : ""
        } ${className}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { finalRejection } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { BobImage } from "@/components/ui/BobImage";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Squish } from "@/components/ui/Squish";

export function FinalRejectionScreen() {
  const reduce = useReducedMotion();
  const [showButton, setShowButton] = useState(false);
  const [exited, setExited] = useState(false);

  // Delay the "Sair" button so she has to sit with the screen for a beat.
  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), reduce ? 600 : 3200);
    return () => clearTimeout(t);
  }, [reduce]);

  const handleExit = () => {
    setExited(true);
    // Browsers usually block window.close() for non-script-opened tabs; the
    // goodbye message below is the graceful fallback.
    setTimeout(() => window.close(), 400);
  };

  if (exited) {
    return (
      <ScreenShell className="items-center justify-center text-center">
        <motion.p
          className="font-display text-2xl text-cool-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {finalRejection.exitHint}
        </motion.p>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="items-center justify-center text-center">
      {/* Pug moves/turns away first... */}
      <motion.div
        initial={{ x: 0, rotate: 0, opacity: 1 }}
        animate={{ x: -10, rotate: -8, opacity: 0.85, filter: "grayscale(0.4)" }}
        transition={{ duration: 0.8 }}
      >
        <BobImage
          src={ASSETS.pugSad}
          alt={finalRejection.imageAlt}
          size={200}
          bob={false}
          tilt={-6}
          priority
        />
      </motion.div>

      {/* ...then the text fades in. */}
      <motion.h1
        className="mt-8 font-display text-3xl font-bold text-cool-ink"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {finalRejection.title}
      </motion.h1>
      <motion.p
        className="mt-2 font-body text-lg text-cool-ink/80"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        {finalRejection.subtitle}
      </motion.p>

      <div className="mt-10 h-14">
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [10, 0, 2, 0] }}
              transition={{ duration: 0.6 }}
            >
              <Squish variant="cool" onClick={handleExit}>
                {finalRejection.button}
              </Squish>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ask, secondChance } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Squish } from "@/components/ui/Squish";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  phase: "ask" | "second";
  onYes: () => void;
  onNo: () => void;
  onChangedMind: () => void;
  onSerio: () => void;
};

const FLOAT_PHRASE = ask.highlight;

const layoutSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

function EvasiveNo({ label, onGiveUp }: { label: string; onGiveUp: () => void }) {
  const reduce = useReducedMotion();
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const settled = tries >= 3 || reduce;

  const dodge = () => {
    setTries((t) => t + 1);
    setPos({ x: (Math.random() - 0.5) * 180, y: (Math.random() - 0.5) * 120 });
  };

  return (
    <motion.button
      type="button"
      onHoverStart={() => !settled && dodge()}
      onClick={() => (settled ? onGiveUp() : dodge())}
      animate={{
        x: settled ? 0 : pos.x,
        y: settled ? 0 : pos.y,
        scale: settled ? 1 : Math.max(0.55, 1 - tries * 0.18),
      }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="tap-target rounded-full border-3 border-ink/20 bg-white/70 px-7 py-3 font-display text-lg font-semibold text-ink-soft"
    >
      {label}
    </motion.button>
  );
}

export function MainAskScreen({
  phase,
  onYes,
  onNo,
  onChangedMind,
  onSerio,
}: Props) {
  const reduce = useReducedMotion();
  const second = phase === "second";
  const [pre, post] = ask.lines[0].split(FLOAT_PHRASE);

  return (
    <ScreenShell className="justify-center">
      <motion.div layout className="flex flex-col items-center text-center">
        {/* Greeting: only in the ask phase */}
        <AnimatePresence>
          {!second && (
            <motion.h1
              layout
              key="greeting"
              className="overflow-hidden px-2 pb-3 font-display text-3xl font-bold text-ink -mx-2 -mb-3"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={layoutSpring}
            >
              <AnimatedText as="span" text={ask.greetingAnimated} stagger={0.06} />
              <motion.span
                className="inline-block origin-bottom"
                animate={reduce ? {} : { rotate: [0, 20, -10, 16, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
              >
                👋
              </motion.span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Pug: stays mounted and crossfades happy -> sad (no flash) */}
        <motion.div
          layout
          className="relative my-6 overflow-hidden rounded-[2rem] bg-white sticker sticker-outline"
          style={{ width: 200, height: 200 }}
          animate={
            reduce
              ? { rotate: second ? 3 : -3 }
              : {
                  rotate: second ? [3, 4.5, 3] : [-3, -1.5, -3],
                  y: [0, -8, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0.5 }
              : {
                  rotate: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  layout: layoutSpring,
                }
          }
        >
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: second ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/assets/pug-hat.png"
              alt={ask.imageAlts.happy}
              fill
              unoptimized
              priority
              sizes="200px"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: second ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/assets/pug-sad.png"
              alt={ask.imageAlts.sad}
              fill
              unoptimized
              sizes="200px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Ask text + question: only in the ask phase */}
        <AnimatePresence>
          {!second && (
            <motion.div
              layout
              key="asktext"
              className="overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={layoutSpring}
            >
              <div className="space-y-3">
                <motion.p
                  className="font-body text-lg text-ink"
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {pre}
                  <motion.span
                    className="font-semibold text-pink-deep"
                    animate={reduce ? {} : { y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "inline-block" }}
                  >
                    {FLOAT_PHRASE}
                  </motion.span>
                  {post}
                </motion.p>

                {ask.lines.slice(1).map((line, i) => (
                  <AnimatedText
                    key={line}
                    text={line}
                    className="font-body text-lg text-ink"
                    delay={0.4 + i * 0.3}
                    stagger={0.04}
                  />
                ))}
              </div>

              <AnimatedText
                text={ask.question}
                as="h2"
                className="mt-6 font-display text-2xl font-bold text-ink"
                delay={1}
                stagger={0.05}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons swap between phases */}
        <motion.div layout className="mt-8 flex items-center gap-4" transition={layoutSpring}>
          <AnimatePresence mode="wait" initial={false}>
            {second ? (
              <motion.div
                key="buttons-second"
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Squish variant="ghost" onClick={onSerio}>
                  {secondChance.serio}
                </Squish>
                <Squish variant="mint" onClick={onChangedMind}>
                  {secondChance.changedMind}
                </Squish>
              </motion.div>
            ) : (
              <motion.div
                key="buttons-ask"
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EvasiveNo label={ask.no} onGiveUp={onNo} />
                <Squish variant="pink" onClick={onYes}>
                  {ask.yesButton}
                </Squish>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </ScreenShell>
  );
}

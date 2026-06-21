"use client";

import { motion, useReducedMotion } from "motion/react";
import { interestsCopy } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { preloadIntent } from "@/lib/flow-preload";
import type { Interests } from "@/lib/types";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Squish } from "@/components/ui/Squish";
import { TagPicker } from "@/components/ui/TagPicker";
import Image from "next/image";

type Props = {
  value: Interests;
  onChange: (next: Interests) => void;
  onDone: () => void;
};

export function InterestsScreen({ value, onChange, onDone }: Props) {
  const reduce = useReducedMotion();
  const total =
    value.food.length +
    value.topics.length +
    value.music.length +
    value.custom.length;

  return (
    <ScreenShell scroll>
      <div className="flex shrink-0 items-start gap-3 pt-2">
        <AnimatedText
          text={interestsCopy.heading}
          as="h1"
          className="flex-1 font-display text-2xl font-bold text-ink"
          stagger={0.05}
        />
        <motion.div
          className="relative h-[6rem] w-[6rem] shrink-0"
          animate={
            reduce
              ? { rotate: -3 }
              : {
                  rotate: [-3, -1.5, -3],
                  y: [0, -8, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0.5 }
              : {
                  rotate: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                }
          }
        >
          <Image
            src={ASSETS.emojiGuyInterest}
            alt={interestsCopy.imageAlt}
            fill
            unoptimized
            priority
            sizes="72px"
            className="object-contain"
          />
        </motion.div>
      </div>

      <div className="no-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto px-1 pb-4">
        <TagPicker value={value} onChange={onChange} />
      </div>

      <motion.div className="shrink-0 pt-3" animate={{ opacity: total ? 1 : 0.4 }}>
        <Squish
          variant="mint"
          className="w-full"
          disabled={!total}
          onClick={onDone}
          onMouseEnter={() => preloadIntent("interestsDone")}
          onFocus={() => preloadIntent("interestsDone")}
        >
          {interestsCopy.done}
        </Squish>
      </motion.div>
    </ScreenShell>
  );
}

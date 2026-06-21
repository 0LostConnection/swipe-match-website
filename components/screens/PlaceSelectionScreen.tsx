"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { PLACES, place as placeCopy } from "@/lib/content";
import type { PlaceChoice } from "@/lib/types";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Squish } from "@/components/ui/Squish";
import { SuggestForm } from "@/components/ui/SuggestForm";

type Props = {
  selected?: PlaceChoice;
  onSelect: (choice: PlaceChoice) => void;
  onNext: () => void;
};

export function PlaceSelectionScreen({ selected, onSelect, onNext }: Props) {
  const [suggestOpen, setSuggestOpen] = useState(false);

  return (
    <ScreenShell scroll>
      <AnimatedText
        text={placeCopy.heading}
        as="h1"
        className="shrink-0 pt-2 font-display text-2xl font-bold text-ink"
        stagger={0.05}
      />

      <div className="relative mt-5 min-h-0 flex-1">
        <div className="no-scrollbar h-full space-y-3 overflow-y-auto px-1 pb-12 pt-1">
          {PLACES.map((p, i) => (
            <PlaceCard
              key={p.id}
              place={p}
              index={i}
              selected={
                selected?.kind === "preset" && selected.value === p.name
              }
              onSelect={() => onSelect({ kind: "preset", value: p.name })}
            />
          ))}

          {selected?.kind === "custom" && !suggestOpen && (
            <div className="flex items-center gap-3 rounded-3xl bg-mint/40 sticker-outline px-5 py-4 text-ink">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-soft">{placeCopy.customLabel}</p>
                <p className="font-display text-lg font-semibold break-words">
                  {selected.value}
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => setSuggestOpen(true)}
                whileTap={{ scale: 0.94 }}
                className="tap-target shrink-0 rounded-full border-3 border-ink/20 bg-white/70 px-4 py-2 font-display text-sm font-semibold text-ink-soft"
              >
                {placeCopy.editButton}
              </motion.button>
            </div>
          )}

          <SuggestForm
            open={suggestOpen}
            initialValue={selected?.kind === "custom" ? selected.value : ""}
            onClose={() => setSuggestOpen(false)}
            onSubmit={(value) => {
              onSelect({ kind: "custom", value });
              setSuggestOpen(false);
            }}
          />

          {!suggestOpen && selected?.kind !== "custom" && (
            <motion.button
              type="button"
              onClick={() => setSuggestOpen(true)}
              whileTap={{ scale: 0.96 }}
              className="tap-target w-full rounded-3xl border-3 border-dashed border-ink/25 bg-white/40 px-5 py-4 font-display text-ink-soft"
            >
              ＋ {placeCopy.suggestButton}
            </motion.button>
          )}
        </div>

        {/* "more below" fade hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <motion.div
        className="shrink-0 pt-3"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: selected ? 1 : 0.4, y: 0 }}
      >
        <Squish
          variant="sun"
          className="w-full"
          disabled={!selected}
          onClick={onNext}
        >
          {placeCopy.continue}
        </Squish>
      </motion.div>
    </ScreenShell>
  );
}

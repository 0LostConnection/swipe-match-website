"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { place as placeCopy } from "@/lib/content";
import { Squish } from "./Squish";

type Props = {
  open: boolean;
  initialValue?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

export function SuggestForm({ open, initialValue = "", onSubmit, onClose }: Props) {
  const [value, setValue] = useState(initialValue);

  // Seed the textarea with the existing suggestion each time the form opens so
  // it can be edited (and reset to empty for a brand-new suggestion).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <div className="mt-3 rounded-3xl bg-white sticker sticker-outline p-4">
            <textarea
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeCopy.suggestPlaceholder}
              rows={2}
              className="w-full resize-none rounded-2xl bg-cream/60 px-4 py-3 text-ink outline-none placeholder:text-ink-soft/60 focus:ring-2 focus:ring-pink"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Squish variant="ghost" onClick={onClose}>
                Fechar
              </Squish>
              <Squish variant="mint" onClick={submit}>
                {placeCopy.suggestConfirm}
              </Squish>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

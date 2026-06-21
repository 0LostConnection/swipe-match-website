"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { INTEREST_CATEGORIES, interestsCopy } from "@/lib/content";
import type { Interests } from "@/lib/types";
import { Squish } from "./Squish";

type Props = {
  value: Interests;
  onChange: (next: Interests) => void;
};

const CHIP_COLORS = ["bg-sun", "bg-sky", "bg-mint", "bg-pink", "bg-grape"];

function Chip({
  label,
  active,
  index,
  onClick,
}: {
  label: string;
  active: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={{ scale: 0, rotate: -8 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 480, damping: 20 }}
      className={`tap-target rounded-full px-4 py-2 text-sm font-semibold sticker-outline ${
        active ? `${CHIP_COLORS[index % CHIP_COLORS.length]} text-ink` : "bg-white text-ink-soft"
      }`}
    >
      {label}
    </motion.button>
  );
}

export function TagPicker({ value, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggle = (cat: "food" | "topics", option: string) => {
    const list = value[cat];
    const next = list.includes(option)
      ? list.filter((x) => x !== option)
      : [...list, option];
    onChange({ ...value, [cat]: next });
  };

  const addCustom = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    const exists = value.custom.some((c) => c.toLowerCase() === v.toLowerCase());
    if (!exists) onChange({ ...value, custom: [...value.custom, v] });
    setQuery("");
    setModalOpen(false);
  };

  const removeCustom = (v: string) => {
    onChange({ ...value, custom: value.custom.filter((c) => c !== v) });
  };

  const allOptions = useMemo(
    () =>
      INTEREST_CATEGORIES.flatMap((c) =>
        c.options.map((o) => ({ option: o, cat: c.id })),
      ),
    [],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((o) => o.option.toLowerCase().includes(q));
  }, [query, allOptions]);

  const exactExists =
    query.trim().length > 0 &&
    allOptions.some((o) => o.option.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="w-full space-y-5">
      {INTEREST_CATEGORIES.map((cat) => (
        <div key={cat.id}>
          <p className="mb-2 font-display text-lg font-semibold text-ink">
            {cat.emoji} {cat.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {cat.options.map((option, i) => (
              <Chip
                key={option}
                label={option}
                index={i}
                active={value[cat.id].includes(option)}
                onClick={() => toggle(cat.id, option)}
              />
            ))}
          </div>
        </div>
      ))}

      {value.custom.length > 0 && (
        <div>
          <p className="mb-2 font-display text-lg font-semibold text-ink">
            ⭐ Seus
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {value.custom.map((c, i) => (
                <Chip
                  key={c}
                  label={`${c} ✕`}
                  index={i}
                  active
                  onClick={() => removeCustom(c)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <motion.button
        type="button"
        onClick={() => setModalOpen(true)}
        whileTap={{ scale: 0.9 }}
        className="tap-target flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink sticker-outline"
      >
        <span className="text-xl leading-none">＋</span> Adicionar
      </motion.button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-cream sticker sticker-outline p-5"
              initial={{ y: 24, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={interestsCopy.searchPlaceholder}
                className="w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none placeholder:text-ink-soft/60 focus:ring-2 focus:ring-pink"
              />

              <div className="mt-3 flex max-h-52 flex-wrap gap-2 overflow-y-auto no-scrollbar">
                {matches.map((m, i) => (
                  <Chip
                    key={`${m.cat}-${m.option}`}
                    label={m.option}
                    index={i}
                    active={value[m.cat].includes(m.option)}
                    onClick={() => toggle(m.cat, m.option)}
                  />
                ))}
              </div>

              {query.trim() && !exactExists && (
                <div className="mt-4 rounded-2xl bg-white/70 p-3 text-center">
                  <p className="mb-2 text-sm text-ink-soft">
                    {interestsCopy.emptyResult}
                  </p>
                  <Squish variant="mint" onClick={() => addCustom(query)}>
                    {interestsCopy.addCustom} “{query.trim()}”
                  </Squish>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Squish variant="ghost" onClick={() => setModalOpen(false)}>
                  Pronto
                </Squish>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

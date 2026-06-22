"use client";

import { motion } from "motion/react";
import { useState } from "react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

type Props = {
  selected: string[];
  onChange: (dates: string[]) => void;
};

function iso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function Calendar({ selected, onChange }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const canGoPrev =
    view.year > today.getFullYear() ||
    (view.year === today.getFullYear() && view.month > today.getMonth());

  const shift = (delta: number) => {
    setView((v) => {
      const next = new Date(v.year, v.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const toggle = (day: number) => {
    const value = iso(view.year, view.month, day);
    if (selected.includes(value)) {
      onChange(selected.filter((d) => d !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const isPast = (day: number) => new Date(view.year, view.month, day) < today;

  return (
    <div className="elevated w-full rounded-3xl border border-border bg-bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && shift(-1)}
          disabled={!canGoPrev}
          className="tap-target rounded-full px-3 text-2xl text-text-primary disabled:opacity-25"
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <p className="font-display text-lg italic text-text-primary">
          {MONTHS[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          className="tap-target rounded-full px-3 text-2xl text-text-primary"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center font-mono text-[0.65rem] tracking-widest text-text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const value = iso(view.year, view.month, day);
          const isSelected = selected.includes(value);
          const past = isPast(day);
          return (
            <motion.button
              key={value}
              type="button"
              disabled={past}
              onClick={() => toggle(day)}
              whileTap={{ scale: 0.85 }}
              className="relative flex aspect-square min-w-0 touch-manipulation items-center justify-center rounded-2xl text-sm font-semibold disabled:opacity-25"
              animate={{
                backgroundColor: isSelected
                  ? "var(--accent-primary)"
                  : "rgba(255,255,255,0.04)",
                color: isSelected ? "#0d0d12" : "var(--text-primary)",
                scale: isSelected ? 1.06 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              {day}
              {isSelected && (
                <motion.span
                  className="absolute -right-1 -top-1 text-xs"
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                >
                  ✨
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Calendar } from "@/components/ui/Calendar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  selected: string[];
  onChange: (dates: string[]) => void;
  onConfirm: (dates: string[]) => void;
  onRestart: () => void;
};

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function formatDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")} (${WEEKDAYS[date.getDay()]})`;
}

export function DateScreen({ selected, onChange, onConfirm, onRestart }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected.length) return;
    onConfirm([...selected].sort());
    setConfirmed(true);
  };

  const sorted = [...selected].sort();

  return (
    <ScreenShell scroll className="relative justify-start !pb-0">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-36 pt-4">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-text-muted">
            NOSSO ROLÊ
          </p>
          <h2 className="mt-2 font-display text-3xl italic leading-tight text-text-primary">
            Quando a gente sai?
          </h2>
          <p className="mt-2 font-body text-sm text-text-muted">
            Escolha um ou mais dias disponíveis após o dia 20/07.
          </p>
        </motion.header>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
        >
          <Calendar selected={selected} onChange={onChange} />
        </motion.div>

        <AnimatePresence>
          {confirmed && (
            <motion.div
              className="mt-6 rounded-2xl border border-accent-secondary/40 bg-bg-card p-5"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <p className="font-display text-xl italic text-text-primary">
                Marcado! 💫
              </p>
              <p className="mt-1 font-body text-sm text-text-muted">
                Anotei {sorted.length === 1 ? "o dia" : "os dias"}:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sorted.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-accent-primary/50 bg-accent-primary/10 px-3 py-1 font-mono text-xs text-text-primary"
                  >
                    {formatDate(d)}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-body text-sm text-text-primary/85">
                Te chamo pra acertar os detalhes. 😉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.footer
        className="absolute bottom-0 left-1/2 z-20 w-screen -translate-x-1/2 px-6 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          background:
            "linear-gradient(to top, var(--bg-base) 0%, color-mix(in srgb, var(--bg-base) 92%, transparent) 55%, transparent 100%)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="relative z-10 flex justify-center gap-3">
          {confirmed ? (
            <PrimaryButton variant="ghost" onClick={onRestart}>
              Voltar ao início
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleConfirm}
              disabled={!selected.length}
              className={selected.length ? "" : "opacity-40"}
            >
              Confirmar {selected.length > 1 ? "dias" : "dia"}
            </PrimaryButton>
          )}
        </div>
      </motion.footer>
    </ScreenShell>
  );
}

"use client";

import { AnimatedText } from "@/components/ui/AnimatedText";
import { FadeInDown } from "@/components/ui/FadeInDown";
import { HeadsetIcon } from "@/components/ui/icons/HeadsetIcon";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";

type Props = {
  onProceed: () => void;
};

export function SoundWarningScreen({ onProceed }: Props) {
  return (
    <ScreenShell className="items-center justify-center text-center">
      <FadeInDown delay={0.1}>
        <div className="mb-8 text-accent-primary drop-shadow-[0_0_24px_rgba(192,132,252,0.45)]">
          <HeadsetIcon />
        </div>
      </FadeInDown>

      <AnimatedText
        as="h1"
        text="Ative o som"
        className="font-display text-4xl italic leading-tight text-text-primary"
        stagger={0.08}
        delay={0.3}
      />

      <AnimatedText
        as="p"
        text="Aumente o volume do dispositivo. Para a melhor experiência, use fones de ouvido."
        className="mt-5 max-w-[320px] font-body text-base leading-relaxed text-text-muted"
        block
        delay={0.7}
      />

      <FadeInDown delay={1.1} className="mt-12">
        <PrimaryButton onClick={onProceed}>Prosseguir</PrimaryButton>
      </FadeInDown>
    </ScreenShell>
  );
}

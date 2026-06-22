"use client";

type Props = {
  audible: boolean;
  onToggle: () => void;
};

export function MusicToggle({ audible, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={audible ? "Silenciar música" : "Ativar música"}
      className="tap-target fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-text-primary shadow-lg backdrop-blur-sm transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
    >
      {audible ? <VolumeOnIcon /> : <VolumeOffIcon />}
    </button>
  );
}

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
      <path d="M18 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
      <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
    </svg>
  );
}

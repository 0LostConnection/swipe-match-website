type Props = {
  className?: string;
};

/** Over-ear headphones with centered waveform (svgrepo-style). */
export function HeadsetIcon({ className = "h-28 w-28" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M32 8c-10.5 0-19 8.1-19.8 18.3H8a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h4.2V26.3C12.2 14.2 21.3 4 32 4s19.8 10.2 19.8 22.3V50.3H56a6 6 0 0 0 6-6V32.3a6 6 0 0 0-6-6h-4.2C51 16.1 42.5 8 32 8z" />
      <rect x="6" y="32" width="8" height="18" rx="4" />
      <rect x="50" y="32" width="8" height="18" rx="4" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 36h2.5l2-4 2 8 2-5 2 3 2.5-2"
      />
    </svg>
  );
}

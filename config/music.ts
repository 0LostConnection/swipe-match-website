import type { Screen } from "@/lib/flow";
import type { MusicCue, TrackId } from "@/lib/audio/types";

export const TRACKS: Record<
  TrackId,
  { src: string; loop?: boolean }
> = {
  welcome: { src: "/audio/welcome.mp3", loop: true },
  convergence: { src: "/audio/convergence.mp3", loop: true },
  date: { src: "/audio/date-groovy.mp3", loop: true },
};

export const TRACK_IDS = Object.keys(TRACKS) as TrackId[];

export const DEFAULT_FADE_MS = {
  in: 1200,
  out: 800,
};

/** Per-screen music cues. `swipe`, `loading`, and `convergence` omitted — track carries over. */
export const SCREEN_CUES: Partial<Record<Screen, MusicCue>> = {
  welcome: { track: "welcome", startAt: 0, fadeInMs: 2000 },
  reveal: { track: "convergence", startAt: 0, fadeOutMs: 800, fadeInMs: 1200 },
  date: { track: "date", startAt: 0, fadeOutMs: 800, fadeInMs: 1200 },
};

export function getReducedFadeMs(ms: number): number {
  if (typeof window === "undefined") return ms;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? Math.min(ms, 300)
    : ms;
}

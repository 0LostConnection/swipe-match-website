import type { Card } from "./types";

/** Max cards shown per session so the swipe phase never feels exhausting. */
export const DEFAULT_SESSION_SIZE = 25;

/** Fisher-Yates shuffle on a copy of the input. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffles the full deck and caps it to `max` cards for one session. */
export function buildSession(
  cards: Card[],
  max: number = DEFAULT_SESSION_SIZE,
): Card[] {
  return shuffle(cards).slice(0, Math.min(max, cards.length));
}

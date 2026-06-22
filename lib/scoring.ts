import { ARCHETYPE_IDS } from "./archetypes";
import type { ArchetypeId, ArchetypeScores, Card, CardCategory } from "./types";

/** Shown on the convergence screen when fewer than 2 tastes overlap. */
export const LOW_CONVERGENCE_MESSAGE =
  "Gostos parecidos? Poucos. Mas nós temos exa tamente o que nós não temos — e isso é mais interessante do que parece.";

/** Minimum shared cards required before showing the real convergence list. */
export const MIN_CONVERGENCE = 2;

function emptyScores(): ArchetypeScores {
  return Object.fromEntries(
    ARCHETYPE_IDS.map((id) => [id, 0]),
  ) as ArchetypeScores;
}

/**
 * Sums each liked card's per-archetype scores and returns the winning
 * archetype. Ties break toward the archetype that appeared (score > 0) in the
 * most distinct cards.
 */
export function calculateResult(likedCards: Card[]): ArchetypeId {
  const totals = emptyScores();
  const freq = emptyScores();

  for (const card of likedCards) {
    for (const id of ARCHETYPE_IDS) {
      totals[id] += card.scores[id];
      if (card.scores[id] > 0) freq[id] += 1;
    }
  }

  return ARCHETYPE_IDS.reduce((best, id) => {
    if (totals[id] > totals[best]) return id;
    if (totals[id] === totals[best] && freq[id] > freq[best]) return id;
    return best;
  });
}

// Emotional relevance order: aesthetic/topic cards feel more personal than
// food/music when listed back to the user.
const CONVERGENCE_ORDER: CardCategory[] = [
  "aesthetic",
  "topic",
  "food",
  "music",
];

/**
 * Returns the cards both the user and the creator liked, sorted by emotional
 * relevance. Resolves card objects from the provided deck.
 */
export function calculateConvergence(
  likedIds: Iterable<string>,
  creatorIds: string[],
  allCards: Card[],
): Card[] {
  const creatorSet = new Set(creatorIds);
  const cardMap = new Map(allCards.map((c) => [c.id, c]));

  return [...likedIds]
    .filter((id) => creatorSet.has(id))
    .map((id) => cardMap.get(id))
    .filter((c): c is Card => Boolean(c))
    .sort(
      (a, b) =>
        CONVERGENCE_ORDER.indexOf(a.category) -
        CONVERGENCE_ORDER.indexOf(b.category),
    );
}

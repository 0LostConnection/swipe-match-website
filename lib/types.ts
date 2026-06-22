export type ArchetypeId =
  | "caotica"
  | "conforto"
  | "flaneur"
  | "nomade"
  | "bardo"
  | "coop"
  | "literaria";

export type CardCategory = "food" | "music" | "topic" | "aesthetic";

export type ArchetypeScores = Record<ArchetypeId, number>;

export type Card = {
  id: string;
  label: string;
  category: CardCategory;
  emoji: string;
  scores: ArchetypeScores;
  flavorText: string;
};

export type Archetype = {
  id: ArchetypeId;
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  badgeLabel: string;
};

export type CreatorProfile = {
  name: string;
  likedCardIds: string[];
};

export type SwipeDirection = "like" | "pass";

/**
 * Anonymous analytics record sent to `/api/submit` when a session reaches the
 * convergence screen. No personally identifying data is collected.
 */
export type Submission = {
  archetype: ArchetypeId;
  likedCardIds: string[];
  convergenceIds: string[];
  deckSize: number;
  visitCount: number;
  submittedAt: string; // ISO timestamp
};

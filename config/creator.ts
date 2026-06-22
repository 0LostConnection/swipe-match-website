import type { CreatorProfile } from "@/lib/types";

/**
 * The creator fills this in before deploying. `likedCardIds` are the IDs of the
 * cards the creator would swipe right on — these drive the convergence screen.
 * Valid IDs live in `lib/cards.ts`.
 */
export const CREATOR_PROFILE: CreatorProfile = {
  name: "Geovane",
  likedCardIds: [
    "acai",
    "sushi",
    "vinho",
    "cafe",
    "hamburguer",
    "churrasco",
    "gastronomia",
    "doces",
    "mpb",
    "funk",
    "rock",
    "jazz",
    "lofi",
    "eletronica",
    "sertanejo",
    "games",
    "tech",
    "culinaria",
    "natureza",
    "filosofia",
    "sofa_sexta",
    "setup_gamer",
    "churrasco_amigos",
  ],
};

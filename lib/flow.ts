import { CREATOR_PROFILE } from "@/config/creator";
import { CARDS } from "./cards";
import { buildSession } from "./deck";
import { calculateConvergence, calculateResult } from "./scoring";
import type { ArchetypeId, Card, SwipeDirection } from "./types";

export type Screen =
  | "sound"
  | "welcome"
  | "swipe"
  | "loading"
  | "reveal"
  | "convergence"
  | "date";

export type FlowState = {
  screen: Screen;
  deck: Card[];
  currentIndex: number;
  likedIds: string[];
  result: ArchetypeId | null;
  convergence: Card[];
  availableDates: string[];
};

export type FlowAction =
  | { type: "PROCEED_SOUND" }
  | { type: "START" }
  | { type: "SWIPE"; dir: SwipeDirection }
  | { type: "FINISH_LOADING" }
  | { type: "GO"; screen: Screen }
  | { type: "SET_DATES"; dates: string[] }
  | { type: "RESTART" };

export function initFlow(): FlowState {
  return {
    screen: "sound",
    deck: [],
    currentIndex: 0,
    likedIds: [],
    result: null,
    convergence: [],
    availableDates: [],
  };
}

/** Computes result + convergence from a finished set of liked card IDs. */
function resolveOutcome(
  likedIds: string[],
  deck: Card[],
): { result: ArchetypeId; convergence: Card[] } {
  const likedCards = deck.filter((c) => likedIds.includes(c.id));
  const result = calculateResult(likedCards);
  const convergence = calculateConvergence(
    likedIds,
    CREATOR_PROFILE.likedCardIds,
    CARDS,
  );
  return { result, convergence };
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "PROCEED_SOUND":
      return { ...state, screen: "welcome" };

    case "START": {
      return {
        ...state,
        screen: "swipe",
        deck: buildSession(CARDS),
        currentIndex: 0,
        likedIds: [],
        result: null,
        convergence: [],
      };
    }

    case "SWIPE": {
      const card = state.deck[state.currentIndex];
      if (!card) return state;

      const likedIds =
        action.dir === "like" ? [...state.likedIds, card.id] : state.likedIds;
      const nextIndex = state.currentIndex + 1;
      const isLast = nextIndex >= state.deck.length;

      if (!isLast) {
        return { ...state, likedIds, currentIndex: nextIndex };
      }

      // Deck exhausted: resolve outcome and move to the loading beat.
      const { result, convergence } = resolveOutcome(likedIds, state.deck);
      return {
        ...state,
        likedIds,
        currentIndex: nextIndex,
        result,
        convergence,
        screen: "loading",
      };
    }

    case "FINISH_LOADING":
      return { ...state, screen: "reveal" };

    case "GO":
      return { ...state, screen: action.screen };

    case "SET_DATES":
      return { ...state, availableDates: action.dates };

    case "RESTART":
      return {
        ...initFlow(),
        screen: "welcome",
      };

    default:
      return state;
  }
}

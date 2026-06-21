import { ASSETS } from "./assets";
import type { Screen } from "./flow";
import { preloadImages } from "./preload-assets";
import type { EntryScenario } from "./storage";

const ASK = [ASSETS.pugHat, ASSETS.pugSad] as const;
const ACCEPT = [ASSETS.dogButterfly, ASSETS.emojiGuyInterest, ASSETS.emojiGuyEnd] as const;

/** Images likely needed after the current screen, based on flow branching. */
export function getUpcomingAssets(
  screen: Screen,
  scenario?: EntryScenario,
): readonly string[] {
  switch (screen) {
    case "intro":
      return scenario === "rejected"
        ? [ASSETS.cat, ...ASK]
        : [...ASK, ASSETS.cat, ...ACCEPT];
    case "cat":
      return ASK;
    case "ask":
      return [ASSETS.pugSad, ASSETS.dogButterfly, ASSETS.cat];
    case "secondChance":
      return [ASSETS.cat, ASSETS.pugSad];
    case "celebration":
      return [ASSETS.emojiGuyInterest];
    case "place":
    case "dates":
      return [ASSETS.emojiGuyInterest];
    case "interests":
      return [ASSETS.emojiGuyEnd];
    default:
      return [];
  }
}

/** Preload assets for the paths reachable from the current screen. */
export function preloadFlowAssets(screen: Screen, scenario?: EntryScenario) {
  preloadImages(getUpcomingAssets(screen, scenario));
}

/** Preload on hover / focus when the user shows intent toward a branch. */
export const INTENT_ASSETS = {
  introRejected: [ASSETS.cat],
  introDefault: ASK,
  yes: [ASSETS.dogButterfly],
  no: [ASSETS.pugSad],
  changedMind: [ASSETS.cat],
  serio: [ASSETS.pugSad],
  interestsDone: [ASSETS.emojiGuyEnd],
} as const;

export type IntentKey = keyof typeof INTENT_ASSETS;

export function preloadIntent(key: IntentKey) {
  preloadImages(INTENT_ASSETS[key]);
}

"use client";

import { useEffect } from "react";
import type { Screen } from "@/lib/flow";
import { preloadFlowAssets } from "@/lib/flow-preload";
import type { EntryScenario } from "@/lib/storage";

/**
 * Mirrors Next.js manual route prefetch: warm upcoming screen assets as soon
 * as the current screen mounts, before the user navigates.
 */
export function useFlowAssetPreload(screen: Screen, scenario: EntryScenario) {
  useEffect(() => {
    preloadFlowAssets(screen, scenario);
  }, [screen, scenario]);
}

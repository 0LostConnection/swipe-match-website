"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  flowReducer,
  initFlow,
  isCoolScreen,
  type Screen,
} from "@/lib/flow";
import {
  markAccepted,
  markRejected,
  registerVisit,
  type EntryScenario,
} from "@/lib/storage";
import { submitAnswers } from "@/lib/submit";
import type { Submission } from "@/lib/types";
import { useFlowAssetPreload } from "@/hooks/useFlowAssetPreload";

import { CatInterstitial } from "./screens/CatInterstitial";
import { CelebrationScreen } from "./screens/CelebrationScreen";
import { DateAvailabilityScreen } from "./screens/DateAvailabilityScreen";
import { FinalRejectionScreen } from "./screens/FinalRejectionScreen";
import { InterestsScreen } from "./screens/InterestsScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { MainAskScreen } from "./screens/MainAskScreen";
import { PlaceSelectionScreen } from "./screens/PlaceSelectionScreen";
import { ThankYouScreen } from "./screens/ThankYouScreen";
import { ConfettiBurst } from "./ui/ConfettiBurst";
import { FloatingBackground } from "./ui/FloatingBackground";

type Meta = {
  scenario: EntryScenario;
  visitCount: number;
  rejectedBefore: boolean;
};

export function Experience() {
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    // Read once on mount: localStorage is client-only, so this also prevents a
    // hydration mismatch on the entry scenario.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeta(registerVisit());
  }, []);

  if (!meta) {
    // Avoid hydration mismatch: localStorage is only available on the client.
    return <div className="min-h-[100svh]" />;
  }

  return <ExperienceInner meta={meta} />;
}

function ExperienceInner({ meta }: { meta: Meta }) {
  const [state, dispatch] = useReducer(flowReducer, meta.scenario, initFlow);
  const [confetti, setConfetti] = useState(false);

  useFlowAssetPreload(state.screen, meta.scenario);

  const go = useCallback((screen: Screen) => dispatch({ type: "GO", screen }), []);

  const coolMood = isCoolScreen(state.screen);

  const buildSubmission = useCallback(
    (outcome: Submission["outcome"]): Submission => ({
      outcome,
      place: outcome === "accepted" ? state.data.place : undefined,
      availableDates:
        outcome === "accepted" ? state.data.availableDates : undefined,
      interests: outcome === "accepted" ? state.data.interests : undefined,
      visitCount: meta.visitCount,
      rejectedBefore: meta.rejectedBefore,
      submittedAt: new Date().toISOString(),
    }),
    [state.data, meta.visitCount, meta.rejectedBefore],
  );

  const fireConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1600);
  };

  // --- routing handlers ---------------------------------------------------
  const handleStart = () => go(meta.scenario === "rejected" ? "cat" : "ask");

  const handleYes = () => {
    markAccepted();
    fireConfetti();
    go("celebration");
  };

  const handleNo = () => go("secondChance");

  const handleChangedMind = () => go("cat");

  const handleSerio = () => {
    markRejected();
    void submitAnswers(buildSubmission("rejected"));
    go("finalRejection");
  };

  const handleInterestsDone = () => {
    void submitAnswers(buildSubmission("accepted"));
    go("thankyou");
  };

  const renderScreen = () => {
    switch (state.screen) {
      case "intro":
        return (
          <IntroScreen
            key="intro"
            scenario={meta.scenario}
            onStart={handleStart}
          />
        );
      case "cat":
        return <CatInterstitial key="cat" onDone={() => go("ask")} />;
      // ask + secondChance share one mounted component (stable key) so the
      // happy->sad change is a smart in-place transition, not a screen swap.
      case "ask":
      case "secondChance":
        return (
          <MainAskScreen
            key="askflow"
            phase={state.screen === "secondChance" ? "second" : "ask"}
            onYes={handleYes}
            onNo={handleNo}
            onChangedMind={handleChangedMind}
            onSerio={handleSerio}
          />
        );
      case "celebration":
        return (
          <CelebrationScreen key="celebration" onDone={() => go("place")} />
        );
      case "place":
        return (
          <PlaceSelectionScreen
            key="place"
            selected={state.data.place}
            onSelect={(place) => dispatch({ type: "SET_PLACE", place })}
            onNext={() => go("dates")}
          />
        );
      case "dates":
        return (
          <DateAvailabilityScreen
            key="dates"
            selected={state.data.availableDates}
            onChange={(dates) => dispatch({ type: "SET_DATES", dates })}
            onNext={() => go("interests")}
          />
        );
      case "interests":
        return (
          <InterestsScreen
            key="interests"
            value={state.data.interests}
            onChange={(interests) =>
              dispatch({ type: "SET_INTERESTS", interests })
            }
            onDone={handleInterestsDone}
          />
        );
      case "thankyou":
        return (
          <ThankYouScreen
            key="thankyou"
            onRestart={() => dispatch({ type: "RESTART" })}
          />
        );
      case "finalRejection":
        return <FinalRejectionScreen key="finalRejection" />;
      default:
        return null;
    }
  };

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Cool palette overlay for the rejection branch */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: "var(--cool-bg)" }}
        animate={{ opacity: coolMood ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      <FloatingBackground mood={coolMood ? "cool" : "happy"} />

      <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>

      <ConfettiBurst active={confetti} />
    </main>
  );
}

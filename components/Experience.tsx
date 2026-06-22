"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { SCREEN_CUES } from "@/config/music";
import { CREATOR_PROFILE } from "@/config/creator";
import { AudioProvider, useAudio } from "@/lib/audio/AudioProvider";
import { flowReducer, initFlow, type Screen } from "@/lib/flow";
import { registerVisit } from "@/lib/storage";
import { submitAnswers } from "@/lib/submit";

import { ConvergenceScreen } from "./screens/ConvergenceScreen";
import { DateScreen } from "./screens/DateScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { SoundWarningScreen } from "./screens/SoundWarningScreen";
import { SwipeDeck } from "./screens/SwipeDeck";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { BackgroundFX } from "./ui/BackgroundFX";
import { MusicToggle } from "./ui/MusicToggle";

export function Experience() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // localStorage is client-only; reading here also prevents hydration drift.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitCount(registerVisit().visitCount);
  }, []);

  if (visitCount === null) {
    return <div className="min-h-[100svh]" />;
  }

  return (
    <AudioProvider>
      <ExperienceInner visitCount={visitCount} />
    </AudioProvider>
  );
}

const MUSIC_SCREENS: Screen[] = ["welcome", "reveal", "date"];

function ExperienceInner({ visitCount }: { visitCount: number }) {
  const [state, dispatch] = useReducer(flowReducer, undefined, initFlow);
  const submittedRef = useRef(false);
  const dateSubmittedRef = useRef(false);
  const lastMusicScreenRef = useRef<Screen | null>(null);
  const audio = useAudio();

  useEffect(() => {
    if (!MUSIC_SCREENS.includes(state.screen)) return;
    if (lastMusicScreenRef.current === state.screen) return;

    const cue = SCREEN_CUES[state.screen];
    if (!cue) return;

    lastMusicScreenRef.current = state.screen;

    if (state.screen === "welcome") {
      void audio.playCue(cue);
      return;
    }

    void audio.crossfadeTo(cue);
    // Only react to screen transitions — not mute/toggle state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen]);

  // Fire the anonymous analytics submission once per completed session.
  useEffect(() => {
    if (state.screen !== "convergence" || !state.result) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    void submitAnswers({
      archetype: state.result,
      likedCardIds: state.likedIds,
      convergenceIds: state.convergence.map((c) => c.id),
      deckSize: state.deck.length,
      visitCount,
      submittedAt: new Date().toISOString(),
    });
  }, [state.screen, state.result, state.likedIds, state.convergence, state.deck.length, visitCount]);

  const handleProceedSound = () => {
    void audio.unlock();
    dispatch({ type: "PROCEED_SOUND" });
  };

  // Re-sends the result with the day(s) she picked. Uses the same Submission
  // pipeline as the convergence submit; guarded so re-confirming doesn't dupe.
  const handleConfirmDates = (dates: string[]) => {
    dispatch({ type: "SET_DATES", dates });
    if (dateSubmittedRef.current || !state.result) return;
    dateSubmittedRef.current = true;
    void submitAnswers({
      archetype: state.result,
      likedCardIds: state.likedIds,
      convergenceIds: state.convergence.map((c) => c.id),
      deckSize: state.deck.length,
      visitCount,
      submittedAt: new Date().toISOString(),
      availableDates: dates,
    });
  };

  const handleRestart = () => {
    submittedRef.current = false;
    dateSubmittedRef.current = false;
    lastMusicScreenRef.current = null;
    dispatch({ type: "RESTART" });
  };

  const renderScreen = () => {
    switch (state.screen) {
      case "sound":
        return (
          <SoundWarningScreen key="sound" onProceed={handleProceedSound} />
        );
      case "welcome":
        return (
          <WelcomeScreen key="welcome" onStart={() => dispatch({ type: "START" })} />
        );
      case "swipe":
        return (
          <SwipeDeck
            key="swipe"
            deck={state.deck}
            currentIndex={state.currentIndex}
            onSwipe={(dir) => dispatch({ type: "SWIPE", dir })}
          />
        );
      case "loading":
        return (
          <LoadingScreen
            key="loading"
            onDone={() => dispatch({ type: "FINISH_LOADING" })}
          />
        );
      case "reveal":
        return state.result ? (
          <RevealScreen
            key="reveal"
            result={state.result}
            onContinue={() => dispatch({ type: "GO", screen: "convergence" })}
          />
        ) : null;
      case "convergence":
        return (
          <ConvergenceScreen
            key="convergence"
            convergence={state.convergence}
            creatorName={CREATOR_PROFILE.name}
            onRestart={handleRestart}
            onPickDate={() => dispatch({ type: "GO", screen: "date" })}
          />
        );
      case "date":
        return (
          <DateScreen
            key="date"
            selected={state.availableDates}
            onChange={(dates) => dispatch({ type: "SET_DATES", dates })}
            onConfirm={handleConfirmDates}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  const showMusicToggle = state.screen !== "sound";

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      <BackgroundFX />
      {showMusicToggle && (
        <MusicToggle
          audible={audio.userAudible}
          onToggle={() => audio.setUserAudible(!audio.userAudible)}
        />
      )}
      <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
    </main>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AudioEngine } from "./engine";
import { preloadAll } from "./preload";
import type { CrossfadeOptions, MusicCue, TrackId } from "./types";

type AudioContextValue = {
  unlock: () => Promise<void>;
  playCue: (cue: MusicCue) => Promise<void>;
  crossfadeTo: (cue: MusicCue, options?: CrossfadeOptions) => Promise<void>;
  stop: (fadeOutMs?: number) => Promise<void>;
  setUserAudible: (audible: boolean) => void;
  userAudible: boolean;
  isPlaying: boolean;
  currentTrack: TrackId | null;
  isUnlocked: boolean;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [engine] = useState(() => new AudioEngine());
  const [userAudible, setUserAudibleState] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackId | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    void preloadAll(engine.audioContext, ["welcome"]);
    return () => engine.dispose();
  }, [engine]);

  const syncState = useCallback(() => {
    setIsPlaying(engine.isPlaying());
    setCurrentTrack(engine.getCurrentTrack());
    setIsUnlocked(engine.isUnlocked());
    setUserAudibleState(engine.getUserAudible());
  }, [engine]);

  const unlock = useCallback(async () => {
    await engine.unlock();
    syncState();
  }, [engine, syncState]);

  const playCue = useCallback(
    async (cue: MusicCue) => {
      try {
        await engine.playCue(cue);
      } catch (err) {
        console.warn("[audio] playCue failed", err);
      }
      syncState();
    },
    [engine, syncState],
  );

  const crossfadeTo = useCallback(
    async (cue: MusicCue, options?: CrossfadeOptions) => {
      try {
        await engine.crossfadeTo(cue, options);
      } catch (err) {
        console.warn("[audio] crossfadeTo failed", err);
      }
      syncState();
    },
    [engine, syncState],
  );

  const stop = useCallback(
    async (fadeOutMs?: number) => {
      await engine.stop(fadeOutMs);
      syncState();
    },
    [engine, syncState],
  );

  const setUserAudible = useCallback(
    (audible: boolean) => {
      engine.setUserAudible(audible);
      syncState();
    },
    [engine, syncState],
  );

  const value = useMemo<AudioContextValue>(
    () => ({
      unlock,
      playCue,
      crossfadeTo,
      stop,
      setUserAudible,
      userAudible,
      isPlaying,
      currentTrack,
      isUnlocked,
    }),
    [
      unlock,
      playCue,
      crossfadeTo,
      stop,
      setUserAudible,
      userAudible,
      isPlaying,
      currentTrack,
      isUnlocked,
    ],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return ctx;
}

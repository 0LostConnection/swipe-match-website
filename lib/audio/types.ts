export type TrackId = "welcome" | "convergence" | "date";

export type LoadState = "idle" | "loading" | "ready" | "error";

export type MusicCue = {
  track: TrackId;
  startAt?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
};

export type CrossfadeOptions = {
  fadeOutMs?: number;
  fadeInMs?: number;
};

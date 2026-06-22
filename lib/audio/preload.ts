import { TRACK_IDS, TRACKS } from "@/config/music";
import type { LoadState, TrackId } from "./types";

const buffers = new Map<TrackId, AudioBuffer>();
const states = new Map<TrackId, LoadState>();
const inflight = new Map<TrackId, Promise<AudioBuffer>>();

function setState(id: TrackId, state: LoadState) {
  states.set(id, state);
}

export function getLoadState(id: TrackId): LoadState {
  return states.get(id) ?? "idle";
}

export function getBuffer(id: TrackId): AudioBuffer | null {
  return buffers.get(id) ?? null;
}

export function isAllReady(): boolean {
  return TRACK_IDS.every((id) => states.get(id) === "ready");
}

async function fetchAndDecode(
  id: TrackId,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const { src } = TRACKS[id];
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
  const data = await res.arrayBuffer();
  return ctx.decodeAudioData(data);
}

export async function preloadTrack(
  id: TrackId,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const cached = buffers.get(id);
  if (cached) return cached;

  const pending = inflight.get(id);
  if (pending) return pending;

  setState(id, "loading");

  const task = (async () => {
    try {
      const buffer = await fetchAndDecode(id, ctx);
      buffers.set(id, buffer);
      setState(id, "ready");
      return buffer;
    } catch (err) {
      setState(id, "error");
      console.warn(`[audio] preload failed for ${id}, retrying once`, err);
      try {
        const buffer = await fetchAndDecode(id, ctx);
        buffers.set(id, buffer);
        setState(id, "ready");
        return buffer;
      } catch (retryErr) {
        setState(id, "error");
        throw retryErr;
      }
    } finally {
      inflight.delete(id);
    }
  })();

  inflight.set(id, task);
  return task;
}

/** Loads priority tracks first, then the rest in parallel. */
export async function preloadAll(
  ctx: AudioContext,
  priority: TrackId[] = ["welcome"],
): Promise<void> {
  const rest = TRACK_IDS.filter((id) => !priority.includes(id));

  await Promise.allSettled(priority.map((id) => preloadTrack(id, ctx)));
  await Promise.allSettled(rest.map((id) => preloadTrack(id, ctx)));
}

import { getReducedFadeMs, TRACKS } from "@/config/music";
import { getBuffer, preloadTrack } from "./preload";
import type { CrossfadeOptions, MusicCue, TrackId } from "./types";

type ActivePlayback = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  track: TrackId;
  startedAt: number;
  startOffset: number;
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private userGain: GainNode | null = null;
  private active: ActivePlayback | null = null;
  private unlocked = false;
  private userAudible = true;
  private fadeRaf: number | null = null;

  get audioContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.userGain = this.ctx.createGain();
      this.userGain.connect(this.ctx.destination);
      this.userGain.gain.value = this.userAudible ? 1 : 0;
    }
    return this.ctx;
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  getUserAudible(): boolean {
    return this.userAudible;
  }

  getCurrentTrack(): TrackId | null {
    return this.active?.track ?? null;
  }

  isPlaying(): boolean {
    return this.active !== null;
  }

  getPlaybackTime(): number {
    if (!this.active || !this.ctx) return 0;
    const elapsed = this.ctx.currentTime - this.active.startedAt;
    return this.active.startOffset + Math.max(0, elapsed);
  }

  async unlock(): Promise<void> {
    const ctx = this.audioContext;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    this.unlocked = true;
  }

  setUserAudible(audible: boolean): void {
    this.userAudible = audible;
    if (!this.userGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.userGain.gain.cancelScheduledValues(now);
    this.userGain.gain.setValueAtTime(this.userGain.gain.value, now);
    this.userGain.gain.linearRampToValueAtTime(audible ? 1 : 0, now + 0.15);
  }

  async playCue(cue: MusicCue): Promise<void> {
    await this.ensureUnlocked();
    const buffer = await this.ensureBuffer(cue.track);
    const fadeOutMs = getReducedFadeMs(cue.fadeOutMs ?? 0);
    const fadeInMs = getReducedFadeMs(cue.fadeInMs ?? 1200);

    if (this.active?.track === cue.track) return;

    await this.stopCurrent(fadeOutMs);
    this.startBuffer(buffer, cue.track, cue.startAt ?? 0, fadeInMs);
  }

  async crossfadeTo(
    cue: MusicCue,
    options: CrossfadeOptions = {},
  ): Promise<void> {
    const fadeOutMs = getReducedFadeMs(
      options.fadeOutMs ?? cue.fadeOutMs ?? 800,
    );
    const fadeInMs = getReducedFadeMs(options.fadeInMs ?? cue.fadeInMs ?? 1200);
    await this.playCue({ ...cue, fadeOutMs, fadeInMs });
  }

  async stop(fadeOutMs = 800): Promise<void> {
    await this.stopCurrent(getReducedFadeMs(fadeOutMs));
  }

  private async ensureUnlocked(): Promise<void> {
    if (!this.unlocked) {
      await this.unlock();
    }
  }

  private async ensureBuffer(track: TrackId): Promise<AudioBuffer> {
    const cached = getBuffer(track);
    if (cached) return cached;
    return preloadTrack(track, this.audioContext);
  }

  private async stopCurrent(fadeOutMs: number): Promise<void> {
    if (!this.active || !this.ctx) return;

    const { source, gain } = this.active;
    this.active = null;

    if (fadeOutMs <= 0) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
      source.disconnect();
      gain.disconnect();
      return;
    }

    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fadeOutMs / 1000);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
        source.disconnect();
        gain.disconnect();
        resolve();
      }, fadeOutMs);
    });
  }

  private startBuffer(
    buffer: AudioBuffer,
    track: TrackId,
    startAt: number,
    fadeInMs: number,
  ): void {
    const ctx = this.audioContext;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    source.loop = TRACKS[track].loop ?? false;
    if (source.loop && startAt > 0) {
      source.loopStart = startAt;
    }

    source.connect(gain);
    gain.connect(this.userGain!);

    const now = ctx.currentTime;
    const offset = Math.min(startAt, buffer.duration - 0.01);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + fadeInMs / 1000);

    source.start(now, offset);

    this.active = {
      source,
      gain,
      track,
      startedAt: now,
      startOffset: offset,
    };
  }

  dispose(): void {
    if (this.fadeRaf !== null) cancelAnimationFrame(this.fadeRaf);
    void this.stop(0);
    void this.ctx?.close();
    this.ctx = null;
    this.userGain = null;
  }
}

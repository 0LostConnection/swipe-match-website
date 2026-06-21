"use client";

import type { Submission } from "./types";

/**
 * Posts the collected answers to our internal API route, which forwards them to
 * the configured webhook. Fire-and-forget friendly: never throws.
 */
export async function submitAnswers(payload: Submission): Promise<boolean> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

import { NextResponse } from "next/server";
import { ARCHETYPE_IDS } from "@/lib/archetypes";
import { insertSession, isDbConfigured } from "@/lib/db";
import type { ArchetypeId, Submission } from "@/lib/types";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isValid(body: unknown): body is Submission {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.archetype === "string" &&
    ARCHETYPE_IDS.includes(b.archetype as ArchetypeId) &&
    isStringArray(b.likedCardIds) &&
    isStringArray(b.convergenceIds) &&
    typeof b.deckSize === "number" &&
    typeof b.visitCount === "number" &&
    typeof b.submittedAt === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 422 });
  }

  if (isDbConfigured()) {
    try {
      await insertSession(body);
    } catch (err) {
      console.error("[submit] database insert failed:", err);
      return NextResponse.json({ ok: false, error: "storage failed" }, { status: 500 });
    }
  }

  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[submit] (no WEBHOOK_URL set) payload:", JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const forward = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ ok: forward.ok, forwarded: true });
  } catch (err) {
    console.error("[submit] webhook forward failed:", err);
    return NextResponse.json({ ok: false, error: "forward failed" }, { status: 502 });
  }
}

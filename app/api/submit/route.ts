import { NextResponse } from "next/server";
import type { Submission } from "@/lib/types";

function isValid(body: unknown): body is Submission {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    (b.outcome === "accepted" || b.outcome === "rejected") &&
    typeof b.visitCount === "number" &&
    typeof b.rejectedBefore === "boolean" &&
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

  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    // No webhook configured yet: log it so it's visible during development.
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

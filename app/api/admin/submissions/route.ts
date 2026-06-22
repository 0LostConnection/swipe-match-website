import { NextResponse } from "next/server";
import { isDbConfigured, listSessions } from "@/lib/db";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "database not configured", sessions: [] },
      { status: 503 },
    );
  }

  try {
    const sessions = await listSessions();
    return NextResponse.json({ ok: true, sessions });
  } catch (err) {
    console.error("[admin/submissions] list failed:", err);
    return NextResponse.json({ ok: false, error: "list failed" }, { status: 500 });
  }
}

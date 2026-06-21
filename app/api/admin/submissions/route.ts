import { NextResponse } from "next/server";
import { isDbConfigured, listSubmissions } from "@/lib/db";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "database not configured", submissions: [] },
      { status: 503 },
    );
  }

  try {
    const submissions = await listSubmissions();
    return NextResponse.json({ ok: true, submissions });
  } catch (err) {
    console.error("[admin/submissions] list failed:", err);
    return NextResponse.json({ ok: false, error: "list failed" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ ok: false, error: "invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "admin not configured" },
      { status: 503 },
    );
  }

  const opts = sessionCookieOptions(token);
  const jar = await cookies();
  jar.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });

  return NextResponse.json({ ok: true });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearSessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const opts = clearSessionCookieOptions();
  const jar = await cookies();
  jar.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

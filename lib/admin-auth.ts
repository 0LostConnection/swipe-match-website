import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_SESSION_COOKIE, SESSION_TTL_MS } from "./admin-auth-edge";

export { ADMIN_SESSION_COOKIE };

function getSessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET;
}

function signExpiry(exp: number, secret: string): string {
  return createHmac("sha256", secret).update(String(exp)).digest("hex");
}

export function createSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_TTL_MS;
  return `${exp}.${signExpiry(exp, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = signExpiry(exp, secret);
  if (expected.length !== sig.length) return false;

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function sessionCookieOptions(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

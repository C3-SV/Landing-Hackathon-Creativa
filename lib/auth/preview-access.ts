import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const PREVIEW_ACCESS_COOKIE_NAME = "hc_preview_access";
export const PREVIEW_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const PREVIEW_TOKEN_SECRET =
  process.env.SESSION_SECRET ?? "hackathon-preview-secret";

type PreviewUser = {
  email: string;
};

function createSignature(payload: string) {
  return createHmac("sha256", PREVIEW_TOKEN_SECRET).update(payload).digest("hex");
}

function createPreviewToken(email: string) {
  const payload = Buffer.from(
    JSON.stringify({ email: email.toLowerCase(), ts: Date.now() }),
  ).toString("base64url");
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

function verifyPreviewToken(token: string): PreviewUser | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = createSignature(payload);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  if (
    expectedBuffer.byteLength !== receivedBuffer.byteLength ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
    };
    const email = parsed.email?.toLowerCase();
    if (!email) {
      return null;
    }
    return { email };
  } catch {
    return null;
  }
}

export async function setPreviewAccessCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_ACCESS_COOKIE_NAME, createPreviewToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PREVIEW_ACCESS_MAX_AGE_SECONDS,
  });
}

export async function clearPreviewAccessCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_ACCESS_COOKIE_NAME);
}

export function getPreviewUserFromToken(token?: string): PreviewUser | null {
  if (!token) {
    return null;
  }
  return verifyPreviewToken(token);
}

export async function getPreviewUserFromCookies() {
  const cookieStore = await cookies();
  return getPreviewUserFromToken(cookieStore.get(PREVIEW_ACCESS_COOKIE_NAME)?.value);
}

export function hasPreviewAccessInRequest(request: NextRequest) {
  return Boolean(
    getPreviewUserFromToken(request.cookies.get(PREVIEW_ACCESS_COOKIE_NAME)?.value),
  );
}

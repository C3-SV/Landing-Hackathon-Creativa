import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { hasFirebaseAdminConfig } from "@/lib/constants/env";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "hc_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const DEV_TOKEN_SECRET = process.env.SESSION_SECRET ?? "festival-de-codigo-secret";

type SessionUser = {
  email: string;
  uid: string;
};

function createSignature(payload: string) {
  return createHmac("sha256", DEV_TOKEN_SECRET).update(payload).digest("hex");
}

function createMockToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, ts: Date.now() })).toString(
    "base64url",
  );
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

function verifyMockToken(token: string): string | null {
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
    return parsed.email?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

export async function createAdminSession(input: {
  idToken?: string;
  email: string;
}) {
  const cookieStore = await cookies();

  let sessionValue = "";
  if (input.idToken && hasFirebaseAdminConfig()) {
    const auth = getFirebaseAdminAuth();
    sessionValue = await auth.createSessionCookie(input.idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });
  } else {
    sessionValue = createMockToken(input.email.toLowerCase());
  }

  cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  if (hasFirebaseAdminConfig()) {
    try {
      const auth = getFirebaseAdminAuth();
      const decoded = await auth.verifySessionCookie(token, true);
      if (!decoded.email) {
        return null;
      }

      return {
        uid: decoded.uid,
        email: decoded.email.toLowerCase(),
      };
    } catch {
      return null;
    }
  }

  const email = verifyMockToken(token);
  if (!email) {
    return null;
  }

  return {
    uid: email,
    email,
  };
}

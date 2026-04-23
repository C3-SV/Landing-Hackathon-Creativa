import { NextResponse } from "next/server";
import { APP_ENV } from "@/lib/constants/env";
import { getSessionUser } from "@/lib/auth/session";

export async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false as const, response: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }

  const isAllowed = APP_ENV.adminEmails.includes(user.email.toLowerCase());
  if (!isAllowed) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Sin permisos de admin" }, { status: 403 }),
    };
  }

  return { ok: true as const, user };
}

export function isAllowedAdminEmail(email: string) {
  return APP_ENV.adminEmails.includes(email.toLowerCase());
}

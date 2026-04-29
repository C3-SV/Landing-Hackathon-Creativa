import { NextResponse } from "next/server";
import { clearPreviewAccessCookie } from "@/lib/auth/preview-access";
import { clearAdminSession } from "@/lib/auth/session";

export async function POST() {
  await clearPreviewAccessCookie();
  await clearAdminSession();

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import {
  AdminCredentialError,
  validateAdminCredentials,
} from "@/lib/auth/admin-credentials";
import { setPreviewAccessCookie } from "@/lib/auth/preview-access";
import { createAdminSession } from "@/lib/auth/session";

type SessionBody = {
  email?: string;
  password?: string;
  idToken?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionBody;
    const { email, idToken } = await validateAdminCredentials(body);

    await setPreviewAccessCookie(email);
    await createAdminSession({ email, idToken });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdminCredentialError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(error);
    return NextResponse.json({ error: "No se pudo habilitar el acceso" }, { status: 500 });
  }
}

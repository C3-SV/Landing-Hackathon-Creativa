import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/auth/admin";
import { createAdminSession } from "@/lib/auth/session";
import { APP_ENV } from "@/lib/constants/env";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

type SessionBody = {
  email?: string;
  password?: string;
  idToken?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionBody;
    const email = body.email?.trim().toLowerCase();

    if (!email || !isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { error: "Este correo no está autorizado como admin" },
        { status: 403 },
      );
    }

    if (body.idToken) {
      try {
        const auth = getFirebaseAdminAuth();
        const decoded = await auth.verifyIdToken(body.idToken, true);
        if ((decoded.email ?? "").toLowerCase() !== email) {
          return NextResponse.json(
            { error: "Token no coincide con el correo ingresado" },
            { status: 401 },
          );
        }
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: "No se pudo verificar el token de autenticación" },
          { status: 401 },
        );
      }
    } else if (body.password !== APP_ENV.mockAdminPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas para entorno mock" },
        { status: 401 },
      );
    }

    await createAdminSession({ email, idToken: body.idToken });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo iniciar sesión" },
      { status: 500 },
    );
  }
}

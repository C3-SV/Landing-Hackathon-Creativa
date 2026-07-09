import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/email/team-email";
import { registrationRepository } from "@/lib/repositories";
import type { CodeOfConductAcceptanceInput } from "@/lib/types/domain";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const { token } = await context.params;
    const body = (await request.json().catch(() => ({}))) as Partial<
      CodeOfConductAcceptanceInput & { confirmed: boolean }
    >;
    const acceptedByName = body.acceptedByName?.trim() ?? "";
    const acceptedByEmail = body.acceptedByEmail?.trim().toLowerCase() ?? "";
    const acceptedByRole = body.acceptedByRole;

    if (!acceptedByName || !acceptedByEmail || !acceptedByRole) {
      return NextResponse.json(
        { error: "Completa nombre, correo y rol para confirmar." },
        { status: 400 },
      );
    }

    if (!isValidEmail(acceptedByEmail)) {
      return NextResponse.json({ error: "El correo no tiene un formato válido." }, { status: 400 });
    }

    if (!["Capitan", "Integrante"].includes(acceptedByRole)) {
      return NextResponse.json({ error: "Selecciona un rol válido." }, { status: 400 });
    }

    if (!body.confirmed) {
      return NextResponse.json(
        { error: "Debes confirmar que el equipo leyó y acepta el Código de Conducta." },
        { status: 400 },
      );
    }

    const result = await registrationRepository.acceptCodeOfConductByToken(token, {
      acceptedByName,
      acceptedByEmail,
      acceptedByRole,
    });

    if (result.status === "invalid" || !result.acceptance) {
      return NextResponse.json(
        { error: "Este enlace no es válido. Contactá a la organización." },
        { status: 404 },
      );
    }

    if (result.status === "expired") {
      return NextResponse.json(
        { error: "Este enlace expiró. Contactá a la organización." },
        { status: 410 },
      );
    }

    return NextResponse.json({
      status: result.status,
      acceptance: result.acceptance,
    });
  } catch (error) {
    console.error("Error aceptando Código de Conducta", {
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json(
      { error: "No se pudo confirmar el Código de Conducta." },
      { status: 500 },
    );
  }
}

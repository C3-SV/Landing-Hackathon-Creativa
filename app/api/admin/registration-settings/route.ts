import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";

type RegistrationSettingsBody = {
  registrationsOpen?: unknown;
};

export async function GET() {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const settings = await registrationRepository.getRegistrationSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error cargando configuración de inscripciones", error);
    return NextResponse.json(
      { error: "No se pudo cargar la configuración de inscripciones" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  let body: RegistrationSettingsBody;
  try {
    body = (await request.json()) as RegistrationSettingsBody;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no contiene JSON válido" },
      { status: 400 },
    );
  }

  if (typeof body.registrationsOpen !== "boolean") {
    return NextResponse.json(
      { error: "registrationsOpen debe ser true o false" },
      { status: 400 },
    );
  }

  try {
    const settings = await registrationRepository.updateRegistrationSettings({
      registrationsOpen: body.registrationsOpen,
      updatedBy: auth.user.email,
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error actualizando configuración de inscripciones", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la configuración de inscripciones" },
      { status: 500 },
    );
  }
}

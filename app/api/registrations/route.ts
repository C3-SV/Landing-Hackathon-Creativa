import { NextResponse } from "next/server";
import {
  registrationRepository,
  validateRegistrationBusinessRules,
} from "@/lib/repositories";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no contiene JSON válido" },
      { status: 400 },
    );
  }

  try {
    const validation = await validateRegistrationBusinessRules(body);

    if (!validation.ok) {
      return NextResponse.json(
        {
          error: validation.error,
          issues: "issues" in validation ? validation.issues : undefined,
          details: "details" in validation ? validation.details : undefined,
        },
        { status: validation.status },
      );
    }

    const registration = await registrationRepository.createRegistration(
      validation.payload,
    );

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("Registration creation failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown server error",
    });
    return NextResponse.json(
      { error: "No se pudo completar la inscripción" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  registrationRepository,
  validateRegistrationBusinessRules,
} from "@/lib/repositories";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo completar la inscripción" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";
import { adminUpdateRegistrationSchema } from "@/lib/validation/admin";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const registration = await registrationRepository.getRegistrationById(id);
  if (!registration) {
    return NextResponse.json(
      { error: "Equipo no encontrado" },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({ registration });
}

export async function PATCH(request: Request, context: Context) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const parsed = adminUpdateRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Actualización inválida", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    const updated = await registrationRepository.updateRegistration(id, {
      status: parsed.data.status,
      assignedChallengeId: parsed.data.assignedChallengeId || undefined,
      note: parsed.data.note
        ? {
            authorEmail: auth.user.email,
            message: parsed.data.note,
          }
        : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Equipo no encontrado" },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({ registration: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo actualizar la inscripción" },
      { status: 500 },
    );
  }
}

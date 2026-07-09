import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";
import type { RegistrationUpdateInput } from "@/lib/repositories/types";
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
    const current = await registrationRepository.getRegistrationById(id);

    if (!current) {
      return NextResponse.json(
        { error: "Equipo no encontrado" },
        {
          status: 404,
        },
      );
    }

    if (parsed.data.assignedChallengeId) {
      const challenges = await registrationRepository.getChallenges();
      const challengeExists = challenges.some(
        (challenge) => challenge.id === parsed.data.assignedChallengeId,
      );

      if (!challengeExists) {
        return NextResponse.json(
          { error: "Reto asignado inválido" },
          { status: 400 },
        );
      }
    }

    const update: RegistrationUpdateInput = {};
    if (parsed.data.status) {
      update.status = parsed.data.status;
    }
    if (Object.prototype.hasOwnProperty.call(parsed.data, "assignedChallengeId")) {
      update.assignedChallengeId = parsed.data.assignedChallengeId || null;
    }
    if (parsed.data.note) {
      update.note = {
        authorEmail: auth.user.email,
        message: parsed.data.note,
      };
    }

    const updated = await registrationRepository.updateRegistration(id, update);

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

import { APP_ENV, isFirebaseMode } from "@/lib/constants/env";
import { firebaseRegistrationRepository } from "@/lib/repositories/firebase-repository";
import { mockRegistrationRepository } from "@/lib/repositories/mock-repository";
import type { RegistrationRepository } from "@/lib/repositories/types";
import { teamRegistrationPayloadSchema } from "@/lib/validation/team-registration";
import { normalizeTeamName } from "@/lib/utils";

function getRepository(): RegistrationRepository {
  if (isFirebaseMode()) {
    return firebaseRegistrationRepository;
  }
  return mockRegistrationRepository;
}

export const registrationRepository = getRepository();

export async function validateRegistrationBusinessRules(input: unknown) {
  const parsed = teamRegistrationPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      status: 400,
      error: "Datos de inscripción inválidos",
      issues: parsed.error.issues,
      details: parsed.error.flatten(),
    };
  }

  const payload = parsed.data;
  const editionId = payload.editionId || APP_ENV.currentEditionId;
  const teamNameNormalized = normalizeTeamName(payload.teamName);
  const issues: Array<{
    message: string;
    path: Array<string | number>;
  }> = [];

  // TODO: harden duplicate prevention with a transaction or idempotency key when
  // concurrent submission risk needs stronger guarantees.
  const duplicatedTeam = await registrationRepository.hasTeamNameInEdition(
    teamNameNormalized,
    editionId,
  );
  if (duplicatedTeam) {
    issues.push({
      message: "Ya existe un equipo con este nombre en la edición actual. Usa otro nombre.",
      path: ["teamName"],
    });
  }

  for (const member of payload.members) {
    const exists = await registrationRepository.memberEmailExists(member.email);
    if (exists) {
      issues.push({
        message: `El correo ${member.email} ya está inscrito en otro equipo.`,
        path: [member.role3H, "email"],
      });
    }
  }

  if (issues.length > 0) {
    return {
      ok: false as const,
      status: 409,
      error:
        issues.length === 1
          ? issues[0].message
          : "Revisa los campos marcados. Hay datos ya registrados.",
      issues,
    };
  }

  return {
    ok: true as const,
    payload: {
      ...payload,
      editionId,
    },
  };
}

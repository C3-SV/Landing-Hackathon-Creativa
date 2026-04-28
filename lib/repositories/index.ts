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
      details: parsed.error.flatten(),
    };
  }

  const payload = parsed.data;
  const editionId = payload.editionId || APP_ENV.currentEditionId;
  const teamNameNormalized = normalizeTeamName(payload.teamName);

  const duplicatedTeam = await registrationRepository.hasTeamNameInEdition(
    teamNameNormalized,
    editionId,
  );
  if (duplicatedTeam) {
    return {
      ok: false as const,
      status: 409,
      error:
        "Ya existe un equipo con este nombre en la edición actual. Usa otro nombre.",
    };
  }

  for (const member of payload.members) {
    const exists = await registrationRepository.memberEmailExists(member.email);
    if (exists) {
      return {
        ok: false as const,
        status: 409,
        error: `El correo ${member.email} ya está inscrito en otro equipo.`,
      };
    }
  }

  return {
    ok: true as const,
    payload: {
      ...payload,
      editionId,
    },
  };
}

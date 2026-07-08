import type { Challenge, TeamMember, TeamRegistrationDoc } from "@/lib/types/domain";

export const DEFAULT_BREVO_SENDER_NAME = "Hackathon de Turismo Creativo";
export const DEFAULT_EMAIL_REPLY_TO = "competitivecodingclub.sv@gmail.com";
export const TEAM_EMAIL_FIXED_CC = [
  "competitivecodingclub.sv@gmail.com",
  //"carlosvalladares.sv@gmail.com",
] as const;
export const CHALLENGE_ASSIGNED_SUBJECT =
  "Reto asignado | Hackathon de Turismo Creativo";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function dedupeEmails(emails: readonly string[]) {
  return [...new Set(emails.map(normalizeEmail).filter(Boolean))];
}

export function memberDisplayName(member: TeamMember) {
  return `${member.firstName} ${member.lastName}`.trim();
}

export function findStrictRepresentative(members: readonly TeamMember[]) {
  return members.find((member) => member.isRepresentative) ?? null;
}

export function buildTeamEmailRecipients(registration: TeamRegistrationDoc) {
  const representative = findStrictRepresentative(registration.members);
  if (!representative) {
    throw new Error("No se puede enviar: el equipo no tiene representante definido.");
  }

  const to = normalizeEmail(representative.email);
  const cc = dedupeEmails([
    ...registration.members
      .filter((member) => !member.isRepresentative)
      .map((member) => member.email),
    ...TEAM_EMAIL_FIXED_CC,
  ]).filter((email) => email !== to);

  return { representative, to, cc };
}

export function resolveAssignedChallenge(
  registration: TeamRegistrationDoc,
  challenges: readonly Challenge[],
) {
  const assignedChallengeId = registration.assignedChallengeId?.trim();
  if (!assignedChallengeId) {
    throw new Error(
      "Este equipo todavía no tiene reto asignado. Asigna un reto antes de enviar este correo.",
    );
  }

  const assignedChallenge = challenges.find((challenge) => challenge.id === assignedChallengeId);
  const assignedChallengeName = assignedChallenge?.name?.trim();

  if (!assignedChallengeName) {
    throw new Error(
      "El reto asignado de este equipo no tiene un nombre válido. Revisa la configuración antes de enviar este correo.",
    );
  }

  return {
    id: assignedChallengeId,
    name: assignedChallengeName,
  };
}

import type { RegistrationStatus, Role3H, TeamMember } from "@/lib/types/domain";

export function normalizeTeamName(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function roleLabel(role: Role3H) {
  switch (role) {
    case "hacker":
      return "Hacker";
    case "hipster":
      return "Hipster";
    case "hustler":
      return "Hustler";
    default:
      return role;
  }
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateOnly(value: string) {
  return new Date(value).toLocaleDateString("es-SV", {
    dateStyle: "medium",
  });
}

export function toCsvValue(value: string | number | boolean | undefined) {
  if (value === undefined) {
    return "";
  }

  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getRepresentativeMember(members: readonly TeamMember[]) {
  return members.find((member) => member.isRepresentative) ?? members[0];
}

export function getRepresentativeName(members: readonly TeamMember[]) {
  const member = getRepresentativeMember(members);
  if (!member) {
    return "";
  }
  return `${member.firstName} ${member.lastName}`.trim();
}

export function getRepresentativeEmail(members: readonly TeamMember[]) {
  return getRepresentativeMember(members)?.email ?? "";
}

export function registrationStatusLabel(status: RegistrationStatus) {
  switch (status) {
    case "submitted":
      return "Enviado";
    case "approved":
      return "Aprobado";
    case "waitlist":
      return "Lista de espera";
    case "rejected":
      return "Rechazado";
    case "needs_fix":
      return "Requiere corrección";
    default:
      return status;
  }
}

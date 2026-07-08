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

const MONTHS_ES_SV = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sept",
  "oct",
  "nov",
  "dic",
] as const;

function getDateParts(value: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const month = Number(getPart("month"));
  return {
    day: Number(getPart("day")),
    monthName: MONTHS_ES_SV[Math.max(0, month - 1)] ?? "",
    year: Number(getPart("year")),
    hour: Number(getPart("hour")),
    minute: getPart("minute").padStart(2, "0"),
    dayPeriod: getPart("dayPeriod").toLowerCase() === "am" ? "a. m." : "p. m.",
  };
}

export function formatDateTime(value: string) {
  const parts = getDateParts(value);
  return `${parts.day} ${parts.monthName} ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}

export function formatDateOnly(value: string) {
  const parts = getDateParts(value);
  return `${parts.day} ${parts.monthName} ${parts.year}`;
}

export function toCsvValue(value: string | number | boolean | null | undefined) {
  if (value === undefined || value === null) {
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

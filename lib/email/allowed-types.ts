import type { EmailType, TeamEmailStatus } from "@/lib/types/domain";

export const ALLOWED_HACKATHON_EMAIL_TYPES = [
  "accepted",
  "challenge_assigned",
  "final_instructions",
] as const satisfies readonly EmailType[];

const ALLOWED_HACKATHON_EMAIL_TYPE_SET = new Set<string>(ALLOWED_HACKATHON_EMAIL_TYPES);

const LEGACY_EMAIL_STATUS_KEYS = {
  challenge_assigned: "challengeAssigned",
  final_instructions: "finalInstructions",
} as const;

export function isAllowedHackathonEmailType(emailType: unknown): emailType is EmailType {
  return typeof emailType === "string" && ALLOWED_HACKATHON_EMAIL_TYPE_SET.has(emailType);
}

export function assertAllowedHackathonEmailType(emailType: unknown): asserts emailType is EmailType {
  if (!isAllowedHackathonEmailType(emailType)) {
    throw new Error(`Email type not allowed for HTC flow: ${String(emailType)}`);
  }
}

export function getHackathonEmailStatusEntry(
  emailStatus: TeamEmailStatus | undefined,
  emailType: EmailType,
) {
  const current = emailStatus?.[emailType];
  if (current) {
    return current;
  }

  const legacyKey =
    emailType === "challenge_assigned" || emailType === "final_instructions"
      ? LEGACY_EMAIL_STATUS_KEYS[emailType]
      : null;

  return legacyKey ? emailStatus?.[legacyKey] : undefined;
}

import type { TeamMember, TeamRegistrationDoc } from "@/lib/types/domain";
import { getRepresentativeMember, toCsvValue } from "@/lib/utils";

const MAX_MEMBERS = 4;

function csvBoolean(value: boolean | undefined) {
  return value ? "true" : "false";
}

function csvText(value: string | undefined) {
  return value ?? "";
}

function memberValue(
  member: TeamMember | undefined,
  key: keyof TeamMember,
): string | boolean | undefined {
  if (!member) {
    return "";
  }
  return member[key];
}

function buildHeaders() {
  const headers = [
    "registration_id",
    "edition_id",
    "status",
    "team_name",
    "team_size",
    "institution",
    "team_description",
    "challenge_preference_1",
    "challenge_preference_2",
    "challenge_preference_3",
    "assigned_challenge_id",
    "created_at",
    "updated_at",
    "source",
    "representative_name",
    "representative_email",
    "representative_phone",
    "consent_accept_code_of_conduct",
    "consent_accept_privacy_policy",
    "consent_media",
    "consent_data_sharing",
    "consent_authorization",
  ];

  for (let index = 1; index <= MAX_MEMBERS; index += 1) {
    headers.push(
      `member_${index}_role`,
      `member_${index}_first_name`,
      `member_${index}_last_name`,
      `member_${index}_preferred_name`,
      `member_${index}_email`,
      `member_${index}_phone`,
      `member_${index}_affiliation_type`,
      `member_${index}_institution`,
      `member_${index}_degree_or_major`,
      `member_${index}_linkedin_url`,
      `member_${index}_github_url`,
      `member_${index}_portfolio_url`,
      `member_${index}_about`,
      `member_${index}_is_representative`,
    );
  }

  return headers;
}

function buildRow(item: TeamRegistrationDoc) {
  const representative = getRepresentativeMember(item.members);
  const row: Array<string | number | boolean | undefined> = [
    item.id,
    item.editionId,
    item.status,
    item.teamName,
    item.teamSize,
    item.institution,
    item.teamDescription,
    item.challengePreferences[0],
    item.challengePreferences[1],
    item.challengePreferences[2],
    item.assignedChallengeId,
    item.createdAt,
    item.updatedAt,
    item.source,
    representative ? `${representative.firstName} ${representative.lastName}`.trim() : "",
    representative?.email,
    representative?.phone,
    csvBoolean(item.consents.acceptCodeOfConduct),
    csvBoolean(item.consents.acceptPrivacyPolicy),
    csvBoolean(item.consents.mediaConsent),
    csvBoolean(item.consents.dataSharingConsent),
    csvBoolean(item.consents.authorizationDeclaration),
  ];

  for (let index = 0; index < MAX_MEMBERS; index += 1) {
    const member = item.members[index];
    row.push(
      csvText(memberValue(member, "role3H") as string | undefined),
      csvText(memberValue(member, "firstName") as string | undefined),
      csvText(memberValue(member, "lastName") as string | undefined),
      csvText(memberValue(member, "preferredName") as string | undefined),
      csvText(memberValue(member, "email") as string | undefined),
      csvText(memberValue(member, "phone") as string | undefined),
      csvText(memberValue(member, "affiliationType") as string | undefined),
      csvText(memberValue(member, "institution") as string | undefined),
      csvText(memberValue(member, "degreeOrMajor") as string | undefined),
      csvText(memberValue(member, "linkedinUrl") as string | undefined),
      csvText(memberValue(member, "githubUrl") as string | undefined),
      csvText(memberValue(member, "portfolioUrl") as string | undefined),
      csvText(memberValue(member, "about") as string | undefined),
      csvBoolean(memberValue(member, "isRepresentative") as boolean | undefined),
    );
  }

  return row.map((value) => toCsvValue(value)).join(",");
}

export function buildRegistrationsCsv(registrations: TeamRegistrationDoc[]) {
  const rows = [buildHeaders().join(",")];
  for (const registration of registrations) {
    rows.push(buildRow(registration));
  }
  return rows.join("\n");
}

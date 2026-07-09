import { registrationRepository } from "@/lib/repositories";
import type {
  CodeOfConductAcceptance,
  TeamRegistrationDoc,
} from "@/lib/types/domain";

export async function getOrCreateCodeOfConductAcceptanceForTeam(input: {
  registration: TeamRegistrationDoc;
  challengeId?: string | null;
  challengeName?: string | null;
}): Promise<CodeOfConductAcceptance> {
  return registrationRepository.getOrCreateCodeOfConductAcceptance(input);
}

export async function markCodeOfConductAcceptanceSent(
  teamRegistrationId: string,
  sentAt: string,
) {
  return registrationRepository.markCodeOfConductAcceptanceSent(teamRegistrationId, sentAt);
}

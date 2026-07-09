import type {
  AdminNote,
  Challenge,
  ChallengeOverviewRegistration,
  DashboardStats,
  EmailDeliveryStatus,
  EmailLog,
  EmailLogAttachment,
  EmailType,
  CodeOfConductAcceptance,
  CodeOfConductAcceptanceInput,
  Edition,
  RegistrationListFilters,
  RegistrationListItem,
  RegistrationSettings,
  RegistrationStatus,
  TeamEmailStatusKey,
  TeamRegistrationDoc,
  TeamRegistrationPayload,
} from "@/lib/types/domain";

export type RegistrationUpdateInput = {
  status?: RegistrationStatus;
  assignedChallengeId?: string | null;
  note?: {
    authorEmail: string;
    message: string;
  };
};

export type CreateEmailLogInput = {
  teamRegistrationId: string;
  teamName: string;
  emailType: EmailType;
  subject: string;
  to: string[];
  cc: string[];
  status: EmailDeliveryStatus;
  brevoMessageId?: string | null;
  assignedChallengeId?: string | null;
  assignedChallengeName?: string | null;
  attachments: EmailLogAttachment[];
  sentAt: string;
  sentBy?: string | null;
  errorMessage?: string | null;
};

export type RegistrationRepository = {
  getRegistrationSettings(): Promise<RegistrationSettings>;
  updateRegistrationSettings(
    update: Pick<RegistrationSettings, "registrationsOpen"> & {
      updatedBy?: string | null;
    },
  ): Promise<RegistrationSettings>;
  getChallenges(): Promise<Challenge[]>;
  getCurrentEdition(): Promise<Edition>;
  createRegistration(payload: TeamRegistrationPayload): Promise<TeamRegistrationDoc>;
  getRegistrationById(id: string): Promise<TeamRegistrationDoc | null>;
  listRegistrations(filters?: RegistrationListFilters): Promise<RegistrationListItem[]>;
  listRegistrationsForChallengeOverview(): Promise<ChallengeOverviewRegistration[]>;
  getDashboardStats(): Promise<DashboardStats>;
  updateRegistration(
    id: string,
    update: RegistrationUpdateInput,
  ): Promise<TeamRegistrationDoc | null>;
  updateRegistrationEmailStatus(
    id: string,
    emailType: TeamEmailStatusKey,
    update: {
      status: EmailDeliveryStatus;
      lastSentAt: string;
      lastLogId: string;
    },
  ): Promise<TeamRegistrationDoc | null>;
  createEmailLog(input: CreateEmailLogInput): Promise<EmailLog>;
  listEmailLogsForRegistration(teamRegistrationId: string): Promise<EmailLog[]>;
  getCodeOfConductAcceptanceForRegistration(
    teamRegistrationId: string,
  ): Promise<CodeOfConductAcceptance | null>;
  getCodeOfConductAcceptanceByToken(token: string): Promise<CodeOfConductAcceptance | null>;
  getOrCreateCodeOfConductAcceptance(input: {
    registration: TeamRegistrationDoc;
    challengeId?: string | null;
    challengeName?: string | null;
  }): Promise<CodeOfConductAcceptance>;
  markCodeOfConductAcceptanceSent(
    teamRegistrationId: string,
    sentAt: string,
  ): Promise<CodeOfConductAcceptance | null>;
  markCodeOfConductFinalInstructionsSent(
    teamRegistrationId: string,
    sentAt: string,
  ): Promise<CodeOfConductAcceptance | null>;
  acceptCodeOfConductByToken(
    token: string,
    input: CodeOfConductAcceptanceInput,
  ): Promise<{
    status: "accepted" | "already_accepted" | "invalid" | "expired";
    acceptance: CodeOfConductAcceptance | null;
  }>;
  exportRegistrationsCsv(): Promise<string>;
  hasTeamNameInEdition(
    teamNameNormalized: string,
    editionId: string,
    ignoreId?: string,
  ): Promise<boolean>;
  memberEmailExists(
    memberEmail: string,
    ignoreId?: string,
  ): Promise<boolean>;
};

export type InternalStoredRegistration = TeamRegistrationDoc & {
  adminNotes: AdminNote[];
};

import type {
  AdminNote,
  Challenge,
  DashboardStats,
  Edition,
  RegistrationListFilters,
  RegistrationListItem,
  RegistrationStatus,
  TeamRegistrationDoc,
  TeamRegistrationPayload,
} from "@/lib/types/domain";

export type RegistrationUpdateInput = {
  status?: RegistrationStatus;
  assignedChallengeId?: string;
  note?: {
    authorEmail: string;
    message: string;
  };
};

export type RegistrationRepository = {
  getChallenges(): Promise<Challenge[]>;
  getCurrentEdition(): Promise<Edition>;
  createRegistration(payload: TeamRegistrationPayload): Promise<TeamRegistrationDoc>;
  getRegistrationById(id: string): Promise<TeamRegistrationDoc | null>;
  listRegistrations(filters?: RegistrationListFilters): Promise<RegistrationListItem[]>;
  getDashboardStats(): Promise<DashboardStats>;
  updateRegistration(
    id: string,
    update: RegistrationUpdateInput,
  ): Promise<TeamRegistrationDoc | null>;
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

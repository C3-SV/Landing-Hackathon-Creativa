export const ROLE3H_VALUES = ["hacker", "hipster", "hustler"] as const;

export type Role3H = (typeof ROLE3H_VALUES)[number];
export type TeamSize = 3 | 4;

export const REGISTRATION_STATUS_VALUES = [
  "submitted",
  "approved",
  "waitlist",
  "rejected",
  "needs_fix",
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUS_VALUES)[number];

export type ChallengeStatus = "confirmed" | "proposed";

export type Challenge = {
  id: string;
  name: string;
  description: string;
  hub: string;
  status: ChallengeStatus;
};

export type Edition = {
  id: string;
  name: string;
  isCurrent: boolean;
  startsAt: string;
  endsAt: string;
  location: string;
};

export type TeamMember = {
  role3H: Role3H;
  isRepresentative: boolean;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone: string;
  affiliationType: string;
  institution: string;
  degreeOrMajor: string;
  about: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

export type TeamConsents = {
  acceptCodeOfConduct: boolean;
  acceptPrivacyPolicy: boolean;
  mediaConsent: boolean;
  dataSharingConsent: boolean;
  authorizationDeclaration: boolean;
};

export type TeamRegistrationPayload = {
  editionId: string;
  teamSize: TeamSize;
  teamName: string;
  institution: string;
  teamDescription?: string;
  challengePreferences: readonly [string, string, string];
  source: string;
  members: readonly TeamMember[];
  consents: TeamConsents;
};

export type AdminNote = {
  id: string;
  message: string;
  authorEmail: string;
  createdAt: string;
};

export type TeamRegistrationDoc = TeamRegistrationPayload & {
  id: string;
  teamNameNormalized: string;
  status: RegistrationStatus;
  assignedChallengeId?: string;
  adminNotes: AdminNote[];
  createdAt: string;
  updatedAt: string;
};

export type RegistrationListFilters = {
  query?: string;
  status?: RegistrationStatus;
  institution?: string;
  preferredChallenge?: string;
};

export type RegistrationListItem = {
  id: string;
  status: RegistrationStatus;
  teamSize: TeamSize;
  teamName: string;
  representativeName: string;
  representativeEmail: string;
  institution: string;
  preferredChallenge: string;
  createdAt: string;
};

export type DashboardStats = {
  totalTeams: number;
  totalByStatus: Record<RegistrationStatus, number>;
  totalByTeamSize: Record<TeamSize, number>;
  totalByInstitution: Array<{ institution: string; count: number }>;
  topChallenges: Array<{ challengeId: string; count: number }>;
  registrationsPerDay: Array<{ date: string; count: number }>;
};

export type RepositoryMode = "mock" | "firebase";

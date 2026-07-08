import { randomBytes } from "crypto";
import { CODE_OF_CONDUCT_VERSION } from "@/lib/code-of-conduct/content";
import {
  CURRENT_EDITION_FALLBACK,
  EDITION_SEEDS,
} from "@/lib/constants/event";
import { BRANDING } from "@/lib/constants/branding";
import { buildRegistrationsCsv } from "@/lib/repositories/csv-export";
import { getMockStore } from "@/lib/repositories/mock-store";
import type {
  RegistrationRepository,
  RegistrationUpdateInput,
} from "@/lib/repositories/types";
import type {
  DashboardStats,
  ChallengeOverviewRegistration,
  CodeOfConductAcceptance,
  RegistrationListFilters,
  RegistrationListItem,
  TeamRegistrationDoc,
  TeamRegistrationPayload,
} from "@/lib/types/domain";
import {
  getRepresentativeEmail,
  getRepresentativeName,
  normalizeTeamName,
  toSlug,
} from "@/lib/utils";

function generateSecureToken() {
  return randomBytes(32).toString("hex");
}

function findAcceptanceByToken(token: string) {
  return getMockStore().codeOfConductAcceptances.find((item) => item.token === token) ?? null;
}

function mapToListItem(record: TeamRegistrationDoc): RegistrationListItem {
  return {
    id: record.id,
    status: record.status,
    teamSize: record.teamSize,
    teamName: record.teamName,
    representativeName: getRepresentativeName(record.members),
    representativeEmail: getRepresentativeEmail(record.members),
    institution: record.institution,
    preferredChallenge: record.challengePreferences[0] ?? "",
    assignedChallengeId: record.assignedChallengeId ?? null,
    createdAt: record.createdAt,
  };
}

function mapToChallengeOverviewItem(record: TeamRegistrationDoc): ChallengeOverviewRegistration {
  return {
    id: record.id,
    status: record.status,
    teamSize: record.teamSize,
    teamName: record.teamName,
    representativeName: getRepresentativeName(record.members),
    representativeEmail: getRepresentativeEmail(record.members),
    institution: record.institution,
    challengePreferences: record.challengePreferences,
    assignedChallengeId: record.assignedChallengeId ?? null,
    createdAt: record.createdAt,
  };
}

function applyFilters(
  records: TeamRegistrationDoc[],
  filters: RegistrationListFilters = {},
) {
  return records.filter((record) => {
    if (filters.status && record.status !== filters.status) {
      return false;
    }

    if (
      filters.institution &&
      record.institution.toLowerCase() !== filters.institution.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.preferredChallenge &&
      record.challengePreferences[0] !== filters.preferredChallenge
    ) {
      return false;
    }

    if (filters.query) {
      const term = filters.query.toLowerCase();
      const hasTerm =
        record.teamName.toLowerCase().includes(term) ||
        getRepresentativeName(record.members).toLowerCase().includes(term) ||
        getRepresentativeEmail(record.members).toLowerCase().includes(term);

      if (!hasTerm) {
        return false;
      }
    }

    return true;
  });
}

function buildDashboardStats(records: TeamRegistrationDoc[]): DashboardStats {
  const totalByStatus = {
    submitted: 0,
    approved: 0,
    waitlist: 0,
    rejected: 0,
    needs_fix: 0,
  };
  const totalByTeamSize = {
    3: 0,
    4: 0,
  };

  const institutionMap = new Map<string, number>();
  const challengeMap = new Map<string, number>();
  const dayMap = new Map<string, number>();

  for (const record of records) {
    totalByStatus[record.status] += 1;
    totalByTeamSize[record.teamSize] += 1;

    institutionMap.set(
      record.institution,
      (institutionMap.get(record.institution) ?? 0) + 1,
    );

    const preferred = record.challengePreferences[0];
    challengeMap.set(preferred, (challengeMap.get(preferred) ?? 0) + 1);

    const day = record.createdAt.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  return {
    totalTeams: records.length,
    totalByStatus,
    totalByTeamSize,
    totalByInstitution: [...institutionMap.entries()]
      .map(([institution, count]) => ({ institution, count }))
      .sort((a, b) => b.count - a.count),
    topChallenges: [...challengeMap.entries()]
      .map(([challengeId, count]) => ({ challengeId, count }))
      .sort((a, b) => b.count - a.count),
    registrationsPerDay: [...dayMap.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date < b.date ? -1 : 1)),
  };
}

export const mockRegistrationRepository: RegistrationRepository = {
  async getRegistrationSettings() {
    return getMockStore().registrationSettings;
  },

  async updateRegistrationSettings(update) {
    const store = getMockStore();
    const now = new Date().toISOString();
    store.registrationSettings = {
      ...store.registrationSettings,
      registrationsOpen: update.registrationsOpen,
      updatedAt: now,
      updatedBy: update.updatedBy ?? null,
      closedAt: update.registrationsOpen ? null : now,
      closedBy: update.registrationsOpen ? null : update.updatedBy ?? null,
    };

    return store.registrationSettings;
  },

  async getChallenges() {
    return getMockStore().challenges;
  },

  async getCurrentEdition() {
    return (
      getMockStore().editions.find((edition) => edition.isCurrent) ??
      EDITION_SEEDS[0] ?? {
        id: CURRENT_EDITION_FALLBACK,
        name: BRANDING.editionName,
        isCurrent: true,
        startsAt: "11 de julio",
        endsAt: "12 de julio",
        location: "Key Institute",
      }
    );
  },

  async createRegistration(payload: TeamRegistrationPayload) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const id = `mock_${toSlug(payload.teamName)}_${Date.now().toString().slice(-6)}`;

    const registration: TeamRegistrationDoc = {
      ...payload,
      id,
      status: "submitted",
      teamNameNormalized: normalizeTeamName(payload.teamName),
      createdAt: now,
      updatedAt: now,
      adminNotes: [],
    };

    store.registrations.unshift(registration);
    return registration;
  },

  async getRegistrationById(id: string) {
    return getMockStore().registrations.find((item) => item.id === id) ?? null;
  },

  async listRegistrations(filters = {}) {
    const records = applyFilters(getMockStore().registrations, filters);
    return records.map(mapToListItem);
  },

  async listRegistrationsForChallengeOverview() {
    return getMockStore().registrations.map(mapToChallengeOverviewItem);
  },

  async getDashboardStats() {
    return buildDashboardStats(getMockStore().registrations);
  },

  async updateRegistration(id, update: RegistrationUpdateInput) {
    const store = getMockStore();
    const index = store.registrations.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const current = store.registrations[index];
    const next: TeamRegistrationDoc = {
      ...current,
      status: update.status ?? current.status,
      adminNotes: current.adminNotes,
      updatedAt: new Date().toISOString(),
    };

    if (Object.prototype.hasOwnProperty.call(update, "assignedChallengeId")) {
      if (update.assignedChallengeId === null) {
        delete next.assignedChallengeId;
      } else {
        next.assignedChallengeId = update.assignedChallengeId;
      }
    }

    if (update.note?.message) {
      next.adminNotes = [
        ...next.adminNotes,
        {
          id: `note_${Date.now()}`,
          authorEmail: update.note.authorEmail,
          message: update.note.message,
          createdAt: next.updatedAt,
        },
      ];
    }

    store.registrations[index] = next;
    return next;
  },

  async updateRegistrationEmailStatus(id, emailType, update) {
    const store = getMockStore();
    const index = store.registrations.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const current = store.registrations[index];
    const next: TeamRegistrationDoc = {
      ...current,
      emailStatus: {
        ...current.emailStatus,
        [emailType]: {
          status: update.status,
          lastSentAt: update.lastSentAt,
          lastLogId: update.lastLogId,
        },
      },
      updatedAt: new Date().toISOString(),
    };

    store.registrations[index] = next;
    return next;
  },

  async createEmailLog(input) {
    const now = new Date().toISOString();
    const log = {
      id: `email_log_${Date.now()}`,
      ...input,
      createdAt: now,
    };
    getMockStore().emailLogs.unshift(log);
    return log;
  },

  async listEmailLogsForRegistration(teamRegistrationId) {
    return getMockStore().emailLogs
      .filter((log) => log.teamRegistrationId === teamRegistrationId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async getCodeOfConductAcceptanceForRegistration(teamRegistrationId) {
    return (
      getMockStore().codeOfConductAcceptances.find(
        (item) => item.teamId === teamRegistrationId,
      ) ?? null
    );
  },

  async getCodeOfConductAcceptanceByToken(token) {
    return findAcceptanceByToken(token);
  },

  async getOrCreateCodeOfConductAcceptance({ registration, challengeId, challengeName }) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const index = store.codeOfConductAcceptances.findIndex(
      (item) => item.teamId === registration.id,
    );

    if (index >= 0) {
      const current = store.codeOfConductAcceptances[index];
      if (current.status === "accepted") {
        return current;
      }

      const next: CodeOfConductAcceptance = {
        ...current,
        teamName: registration.teamName,
        challengeId,
        challengeName,
        status: "pending",
        token:
          current.status === "expired" || !current.token
            ? generateSecureToken()
            : current.token,
        codeOfConductVersion: CODE_OF_CONDUCT_VERSION,
        updatedAt: now,
      };
      store.codeOfConductAcceptances[index] = next;
      return next;
    }

    const acceptance: CodeOfConductAcceptance = {
      id: registration.id,
      teamId: registration.id,
      teamName: registration.teamName,
      challengeId,
      challengeName,
      token: generateSecureToken(),
      status: "pending",
      sentAt: null,
      acceptedAt: null,
      acceptedByName: null,
      acceptedByEmail: null,
      acceptedByRole: null,
      codeOfConductVersion: CODE_OF_CONDUCT_VERSION,
      createdAt: now,
      updatedAt: now,
    };

    store.codeOfConductAcceptances.unshift(acceptance);
    return acceptance;
  },

  async markCodeOfConductFinalInstructionsSent(teamRegistrationId, sentAt) {
    const store = getMockStore();
    const index = store.codeOfConductAcceptances.findIndex(
      (item) => item.teamId === teamRegistrationId,
    );

    if (index === -1) {
      return null;
    }

    const next: CodeOfConductAcceptance = {
      ...store.codeOfConductAcceptances[index],
      sentAt,
      updatedAt: new Date().toISOString(),
    };
    store.codeOfConductAcceptances[index] = next;
    return next;
  },

  async acceptCodeOfConductByToken(token, input) {
    const store = getMockStore();
    const index = store.codeOfConductAcceptances.findIndex((item) => item.token === token);
    if (index === -1) {
      return { status: "invalid", acceptance: null };
    }

    const current = store.codeOfConductAcceptances[index];
    if (current.status === "accepted") {
      return { status: "already_accepted", acceptance: current };
    }

    if (current.status === "expired") {
      return { status: "expired", acceptance: current };
    }

    const now = new Date().toISOString();
    const next: CodeOfConductAcceptance = {
      ...current,
      status: "accepted",
      acceptedAt: now,
      acceptedByName: input.acceptedByName,
      acceptedByEmail: input.acceptedByEmail,
      acceptedByRole: input.acceptedByRole,
      updatedAt: now,
    };

    store.codeOfConductAcceptances[index] = next;
    return { status: "accepted", acceptance: next };
  },

  async exportRegistrationsCsv() {
    return buildRegistrationsCsv(getMockStore().registrations);
  },

  async hasTeamNameInEdition(teamNameNormalized, editionId, ignoreId) {
    return getMockStore().registrations.some(
      (item) =>
        item.editionId === editionId &&
        item.teamNameNormalized === teamNameNormalized &&
        item.id !== ignoreId,
    );
  },

  async memberEmailExists(memberEmail, ignoreId) {
    const email = memberEmail.toLowerCase();
    return getMockStore().registrations.some(
      (item) =>
        item.id !== ignoreId &&
        item.members.some((member) => member.email.toLowerCase() === email),
    );
  },
};

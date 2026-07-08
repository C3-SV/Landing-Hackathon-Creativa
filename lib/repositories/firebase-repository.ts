import { FieldValue, type QueryDocumentSnapshot, type Timestamp } from "firebase-admin/firestore";
import { CHALLENGE_SEEDS, EDITION_SEEDS } from "@/lib/constants/event";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { buildRegistrationsCsv } from "@/lib/repositories/csv-export";
import type {
  RegistrationRepository,
  RegistrationUpdateInput,
} from "@/lib/repositories/types";
import type {
  Challenge,
  ChallengeOverviewRegistration,
  DashboardStats,
  Edition,
  RegistrationListFilters,
  RegistrationListItem,
  RegistrationSettings,
  TeamConsents,
  TeamMember,
  TeamRegistrationDoc,
  TeamRegistrationPayload,
} from "@/lib/types/domain";
import {
  getRepresentativeEmail,
  getRepresentativeName,
  normalizeTeamName,
} from "@/lib/utils";

const COLLECTIONS = {
  challenges: "challenges",
  editions: "editions",
  emailLogs: "email_logs",
  registrations: "team_registrations",
  settings: "settings",
} as const;

const ABOUT_FALLBACK = "Perfil pendiente de actualización desde una inscripción anterior.";

const REGISTRATION_SETTINGS_DOC_ID = "registrations";
const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  registrationsOpen: true,
  updatedAt: undefined,
  updatedBy: null,
  closedAt: null,
  closedBy: null,
};

const CONSENTS_FALLBACK: TeamConsents = {
  acceptCodeOfConduct: false,
  acceptPrivacyPolicy: false,
  mediaConsent: false,
  dataSharingConsent: false,
  authorizationDeclaration: false,
};

function normalizeOptionalText(value: string | null | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function prepareRegistrationForFirestore(record: TeamRegistrationDoc): TeamRegistrationDoc {
  return {
    ...record,
    teamDescription: normalizeOptionalText(record.teamDescription),
    members: record.members.map((member) => ({
      ...member,
      preferredName: normalizeOptionalText(member.preferredName),
      linkedinUrl: normalizeOptionalText(member.linkedinUrl),
      githubUrl: normalizeOptionalText(member.githubUrl),
      portfolioUrl: normalizeOptionalText(member.portfolioUrl),
    })),
  };
}

function findUndefinedPath(value: unknown, path: Array<string | number> = []): string | null {
  if (value === undefined) {
    return path.join(".") || "<root>";
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const nestedPath = findUndefinedPath(item, [...path, index]);
      if (nestedPath) {
        return nestedPath;
      }
    }
    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return null;
  }

  for (const [key, item] of Object.entries(value)) {
    const nestedPath = findUndefinedPath(item, [...path, key]);
    if (nestedPath) {
      return nestedPath;
    }
  }

  return null;
}

type StoredRegistration = Partial<Omit<TeamRegistrationDoc, "id">> & {
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
  assignedChallengeId?: string | null;
  responsibleName?: string;
  responsibleEmail?: string;
  responsiblePhone?: string;
};

type StoredEmailLog = {
  teamRegistrationId?: string;
  teamName?: string;
  emailType?: "accepted" | "challenge_assigned";
  subject?: string;
  to?: string[];
  cc?: string[];
  status?: "sent" | "failed" | "dry_run";
  brevoMessageId?: string | null;
  assignedChallengeId?: string | null;
  assignedChallengeName?: string | null;
  attachments?: Array<{ fileName: string; type: string }>;
  sentAt?: string | Timestamp;
  sentBy?: string | null;
  errorMessage?: string | null;
  createdAt?: string | Timestamp;
};

type StoredRegistrationSettings = Partial<RegistrationSettings> & {
  updatedAt?: string | Timestamp;
  closedAt?: string | Timestamp | null;
};

function timestampToIso(value: string | Timestamp | undefined) {
  if (!value) {
    return new Date().toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return value.toDate().toISOString();
}

function normalizeMembers(data: StoredRegistration) {
  const members = ((data.members as TeamMember[] | undefined) ?? []).map((member) => ({
    ...member,
    isRepresentative: Boolean(member.isRepresentative),
    about: member.about ?? ABOUT_FALLBACK,
  }));

  if (members.length === 0) {
    return members;
  }

  const representativeCount = members.filter((member) => member.isRepresentative).length;
  if (representativeCount === 1) {
    return members;
  }

  let representativeIndex = 0;
  if (data.responsibleEmail) {
    const idx = members.findIndex(
      (member) => member.email.toLowerCase() === data.responsibleEmail?.toLowerCase(),
    );
    if (idx >= 0) {
      representativeIndex = idx;
    }
  }

  return members.map((member, index) => ({
    ...member,
    isRepresentative: index === representativeIndex,
  }));
}

function normalizeAdminNotes(data: StoredRegistration) {
  return (data.adminNotes ?? []).map((note) => ({
    ...note,
    createdAt: timestampToIso(note.createdAt as string | Timestamp | undefined),
  }));
}

function toRegistration(docId: string, rawData: StoredRegistration): TeamRegistrationDoc {
  const teamName = rawData.teamName ?? "";
  const members = normalizeMembers(rawData);
  const preferences = rawData.challengePreferences ?? ["", "", ""];

  return {
    id: docId,
    editionId: rawData.editionId ?? "",
    status: rawData.status ?? "submitted",
    teamSize: rawData.teamSize ?? (members.length >= 4 ? 4 : 3),
    teamName,
    teamNameNormalized: rawData.teamNameNormalized ?? normalizeTeamName(teamName),
    institution: rawData.institution ?? "",
    teamDescription: rawData.teamDescription,
    challengePreferences: [preferences[0] ?? "", preferences[1] ?? "", preferences[2] ?? ""],
    source: rawData.source ?? "No especificado",
    members,
    consents: rawData.consents ?? CONSENTS_FALLBACK,
    assignedChallengeId: rawData.assignedChallengeId ?? undefined,
    adminNotes: normalizeAdminNotes(rawData),
    emailStatus: rawData.emailStatus,
    createdAt: timestampToIso(rawData.createdAt),
    updatedAt: timestampToIso(rawData.updatedAt),
  };
}

function toEmailLog(docId: string, rawData: StoredEmailLog) {
  const createdAt = timestampToIso(rawData.createdAt);
  return {
    id: docId,
    teamRegistrationId: rawData.teamRegistrationId ?? "",
    teamName: rawData.teamName ?? "",
    emailType: rawData.emailType ?? "accepted",
    subject: rawData.subject ?? "",
    to: rawData.to ?? [],
    cc: rawData.cc ?? [],
    status: rawData.status ?? "failed",
    brevoMessageId: rawData.brevoMessageId ?? null,
    assignedChallengeId: rawData.assignedChallengeId ?? null,
    assignedChallengeName: rawData.assignedChallengeName ?? null,
    attachments: rawData.attachments ?? [],
    sentAt: timestampToIso(rawData.sentAt) || createdAt,
    sentBy: rawData.sentBy ?? null,
    errorMessage: rawData.errorMessage ?? null,
    createdAt,
  };
}

function toRegistrationSettings(rawData: StoredRegistrationSettings | undefined) {
  if (!rawData) {
    return DEFAULT_REGISTRATION_SETTINGS;
  }

  return {
    registrationsOpen:
      typeof rawData.registrationsOpen === "boolean"
        ? rawData.registrationsOpen
        : DEFAULT_REGISTRATION_SETTINGS.registrationsOpen,
    updatedAt: rawData.updatedAt ? timestampToIso(rawData.updatedAt) : undefined,
    updatedBy: rawData.updatedBy ?? null,
    closedAt: rawData.closedAt ? timestampToIso(rawData.closedAt) : null,
    closedBy: rawData.closedBy ?? null,
  } satisfies RegistrationSettings;
}

function fromDoc(doc: QueryDocumentSnapshot): TeamRegistrationDoc {
  const data = doc.data() as StoredRegistration;
  return toRegistration(doc.id, data);
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

function buildStats(registrations: TeamRegistrationDoc[]): DashboardStats {
  const base: DashboardStats = {
    totalTeams: registrations.length,
    totalByStatus: {
      submitted: 0,
      approved: 0,
      waitlist: 0,
      rejected: 0,
      needs_fix: 0,
    },
    totalByTeamSize: {
      3: 0,
      4: 0,
    },
    totalByInstitution: [],
    topChallenges: [],
    registrationsPerDay: [],
  };

  const institutionMap = new Map<string, number>();
  const challengesMap = new Map<string, number>();
  const dayMap = new Map<string, number>();

  for (const item of registrations) {
    base.totalByStatus[item.status] += 1;
    base.totalByTeamSize[item.teamSize] += 1;
    institutionMap.set(item.institution, (institutionMap.get(item.institution) ?? 0) + 1);
    challengesMap.set(
      item.challengePreferences[0],
      (challengesMap.get(item.challengePreferences[0]) ?? 0) + 1,
    );
    const day = item.createdAt.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  base.totalByInstitution = [...institutionMap.entries()]
    .map(([institution, count]) => ({ institution, count }))
    .sort((a, b) => b.count - a.count);
  base.topChallenges = [...challengesMap.entries()]
    .map(([challengeId, count]) => ({ challengeId, count }))
    .sort((a, b) => b.count - a.count);
  base.registrationsPerDay = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return base;
}

function toListItem(doc: TeamRegistrationDoc): RegistrationListItem {
  return {
    id: doc.id,
    status: doc.status,
    teamSize: doc.teamSize,
    teamName: doc.teamName,
    representativeName: getRepresentativeName(doc.members),
    representativeEmail: getRepresentativeEmail(doc.members),
    institution: doc.institution,
    preferredChallenge: doc.challengePreferences[0] ?? "",
    assignedChallengeId: doc.assignedChallengeId ?? null,
    createdAt: doc.createdAt,
  };
}

function toChallengeOverviewItem(doc: TeamRegistrationDoc): ChallengeOverviewRegistration {
  return {
    id: doc.id,
    status: doc.status,
    teamSize: doc.teamSize,
    teamName: doc.teamName,
    representativeName: getRepresentativeName(doc.members),
    representativeEmail: getRepresentativeEmail(doc.members),
    institution: doc.institution,
    challengePreferences: doc.challengePreferences,
    assignedChallengeId: doc.assignedChallengeId ?? null,
    createdAt: doc.createdAt,
  };
}

export const firebaseRegistrationRepository: RegistrationRepository = {
  async getRegistrationSettings() {
    const db = getFirebaseAdminDb();
    const snap = await db
      .collection(COLLECTIONS.settings)
      .doc(REGISTRATION_SETTINGS_DOC_ID)
      .get();

    return toRegistrationSettings(
      snap.exists ? (snap.data() as StoredRegistrationSettings | undefined) : undefined,
    );
  },

  async updateRegistrationSettings(update) {
    const db = getFirebaseAdminDb();
    const now = new Date().toISOString();
    const record: RegistrationSettings = {
      registrationsOpen: update.registrationsOpen,
      updatedAt: now,
      updatedBy: update.updatedBy ?? null,
      closedAt: update.registrationsOpen ? null : now,
      closedBy: update.registrationsOpen ? null : update.updatedBy ?? null,
    };

    await db
      .collection(COLLECTIONS.settings)
      .doc(REGISTRATION_SETTINGS_DOC_ID)
      .set(record, { merge: true });

    return record;
  },

  async getChallenges() {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection(COLLECTIONS.challenges).get();
    if (snapshot.empty) {
      return CHALLENGE_SEEDS;
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Challenge);
  },

  async getCurrentEdition() {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.editions)
      .where("isCurrent", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return EDITION_SEEDS[0];
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Edition;
  },

  async createRegistration(payload: TeamRegistrationPayload) {
    const db = getFirebaseAdminDb();
    const now = new Date().toISOString();
    const ref = db.collection(COLLECTIONS.registrations).doc();

    const record: TeamRegistrationDoc = {
      ...payload,
      id: ref.id,
      status: "submitted",
      teamNameNormalized: normalizeTeamName(payload.teamName),
      adminNotes: [],
      createdAt: now,
      updatedAt: now,
    };

    const firestoreRecord = prepareRegistrationForFirestore(record);
    const undefinedPath = findUndefinedPath(firestoreRecord);
    if (undefinedPath) {
      throw new Error(`Registration document contains undefined at ${undefinedPath}`);
    }

    await ref.set(firestoreRecord);
    return firestoreRecord;
  },

  async getRegistrationById(id: string) {
    const db = getFirebaseAdminDb();
    const snap = await db.collection(COLLECTIONS.registrations).doc(id).get();
    if (!snap.exists) {
      return null;
    }

    return toRegistration(snap.id, (snap.data() ?? {}) as StoredRegistration);
  },

  async listRegistrations(filters = {}) {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.registrations)
      .orderBy("createdAt", "desc")
      .get();
    const records = snapshot.docs.map(fromDoc);
    return applyFilters(records, filters).map(toListItem);
  },

  async listRegistrationsForChallengeOverview() {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.registrations)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(fromDoc).map(toChallengeOverviewItem);
  },

  async getDashboardStats() {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection(COLLECTIONS.registrations).get();
    const records = snapshot.docs.map(fromDoc);
    return buildStats(records);
  },

  async updateRegistration(id, update: RegistrationUpdateInput) {
    const db = getFirebaseAdminDb();
    const ref = db.collection(COLLECTIONS.registrations).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return null;
    }

    const updatedAt = new Date().toISOString();
    const patch: Record<string, unknown> = {
      updatedAt,
    };

    if (update.status) {
      patch.status = update.status;
    }

    if (Object.prototype.hasOwnProperty.call(update, "assignedChallengeId")) {
      patch.assignedChallengeId =
        update.assignedChallengeId === null
          ? FieldValue.delete()
          : update.assignedChallengeId;
    }

    if (update.note?.message) {
      patch.adminNotes = FieldValue.arrayUnion({
        id: `note_${Date.now()}`,
        authorEmail: update.note.authorEmail,
        message: update.note.message,
        createdAt: updatedAt,
      });
    }

    await ref.update(patch);

    const saved = await ref.get();
    return toRegistration(saved.id, (saved.data() ?? {}) as StoredRegistration);
  },

  async updateRegistrationEmailStatus(id, emailType, update) {
    const db = getFirebaseAdminDb();
    const ref = db.collection(COLLECTIONS.registrations).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return null;
    }

    await ref.update({
      [`emailStatus.${emailType}`]: {
        status: update.status,
        lastSentAt: update.lastSentAt,
        lastLogId: update.lastLogId,
      },
      updatedAt: new Date().toISOString(),
    });

    const saved = await ref.get();
    return toRegistration(saved.id, (saved.data() ?? {}) as StoredRegistration);
  },

  async createEmailLog(input) {
    const db = getFirebaseAdminDb();
    const ref = db.collection(COLLECTIONS.emailLogs).doc();
    const log = {
      id: ref.id,
      ...input,
      createdAt: new Date().toISOString(),
    };

    const undefinedPath = findUndefinedPath(log);
    if (undefinedPath) {
      throw new Error(`Email log contains undefined at ${undefinedPath}`);
    }

    await ref.set(log);
    return log;
  },

  async listEmailLogsForRegistration(teamRegistrationId) {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.emailLogs)
      .where("teamRegistrationId", "==", teamRegistrationId)
      .get();

    return snapshot.docs
      .map((doc) => toEmailLog(doc.id, (doc.data() ?? {}) as StoredEmailLog))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async exportRegistrationsCsv() {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.registrations)
      .orderBy("createdAt", "desc")
      .get();
    const records = snapshot.docs.map(fromDoc);
    return buildRegistrationsCsv(records);
  },

  async hasTeamNameInEdition(teamNameNormalized, editionId, ignoreId) {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.registrations)
      .where("editionId", "==", editionId)
      .where("teamNameNormalized", "==", teamNameNormalized)
      .get();

    return snapshot.docs.some((doc) => doc.id !== ignoreId);
  },

  async memberEmailExists(memberEmail, ignoreId) {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection(COLLECTIONS.registrations).get();
    const emailLower = memberEmail.toLowerCase();

    return snapshot.docs.some((doc) => {
      if (ignoreId && doc.id === ignoreId) {
        return false;
      }
      const data = toRegistration(doc.id, (doc.data() ?? {}) as StoredRegistration);
      return data.members.some((member) => member.email.toLowerCase() === emailLower);
    });
  },
};

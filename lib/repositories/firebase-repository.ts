import type { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { CHALLENGE_SEEDS, EDITION_SEEDS } from "@/lib/constants/event";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import type {
  RegistrationRepository,
  RegistrationUpdateInput,
} from "@/lib/repositories/types";
import type {
  Challenge,
  DashboardStats,
  Edition,
  RegistrationListFilters,
  RegistrationListItem,
  TeamRegistrationDoc,
  TeamRegistrationPayload,
} from "@/lib/types/domain";
import { normalizeTeamName, toCsvValue } from "@/lib/utils";

const COLLECTIONS = {
  challenges: "challenges",
  editions: "editions",
  registrations: "team_registrations",
} as const;

function timestampToIso(value: string | Timestamp | undefined) {
  if (!value) {
    return new Date().toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return value.toDate().toISOString();
}

function fromDoc(doc: QueryDocumentSnapshot): TeamRegistrationDoc {
  const data = doc.data() as Omit<TeamRegistrationDoc, "id"> & {
    createdAt?: string | Timestamp;
    updatedAt?: string | Timestamp;
  };

  return {
    ...data,
    id: doc.id,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
    adminNotes: data.adminNotes ?? [],
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
        record.responsibleName.toLowerCase().includes(term) ||
        record.responsibleEmail.toLowerCase().includes(term);
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
    totalByInstitution: [],
    topChallenges: [],
    registrationsPerDay: [],
  };

  const institutionMap = new Map<string, number>();
  const challengesMap = new Map<string, number>();
  const dayMap = new Map<string, number>();

  for (const item of registrations) {
    base.totalByStatus[item.status] += 1;
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
    teamName: doc.teamName,
    responsibleName: doc.responsibleName,
    responsibleEmail: doc.responsibleEmail,
    institution: doc.institution,
    preferredChallenge: doc.challengePreferences[0] ?? "",
    createdAt: doc.createdAt,
  };
}

export const firebaseRegistrationRepository: RegistrationRepository = {
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

    await ref.set(record);
    return record;
  },

  async getRegistrationById(id: string) {
    const db = getFirebaseAdminDb();
    const snap = await db.collection(COLLECTIONS.registrations).doc(id).get();
    if (!snap.exists) {
      return null;
    }
    const data = snap.data() as Omit<TeamRegistrationDoc, "id">;
    return {
      ...data,
      id: snap.id,
      createdAt: timestampToIso(data.createdAt as string | Timestamp | undefined),
      updatedAt: timestampToIso(data.updatedAt as string | Timestamp | undefined),
      adminNotes: data.adminNotes ?? [],
    };
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

    const current = (snap.data() ?? {}) as TeamRegistrationDoc;
    const updatedAt = new Date().toISOString();
    const nextNotes = [...(current.adminNotes ?? [])];
    if (update.note?.message) {
      nextNotes.push({
        id: `note_${Date.now()}`,
        authorEmail: update.note.authorEmail,
        message: update.note.message,
        createdAt: updatedAt,
      });
    }

    await ref.update({
      status: update.status ?? current.status,
      assignedChallengeId: update.assignedChallengeId ?? current.assignedChallengeId,
      adminNotes: nextNotes,
      updatedAt,
    });

    const saved = await ref.get();
    const data = saved.data() as Omit<TeamRegistrationDoc, "id">;
    return {
      ...data,
      id: saved.id,
      createdAt: timestampToIso(data.createdAt as string | Timestamp | undefined),
      updatedAt: timestampToIso(data.updatedAt as string | Timestamp | undefined),
      adminNotes: data.adminNotes ?? [],
    };
  },

  async exportRegistrationsCsv() {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection(COLLECTIONS.registrations).get();
    const records = snapshot.docs.map(fromDoc);
    const rows = [
      [
        "id",
        "status",
        "teamName",
        "institution",
        "responsibleName",
        "responsibleEmail",
        "preferredChallenge",
        "createdAt",
      ].join(","),
    ];

    for (const item of records) {
      rows.push(
        [
          toCsvValue(item.id),
          toCsvValue(item.status),
          toCsvValue(item.teamName),
          toCsvValue(item.institution),
          toCsvValue(item.responsibleName),
          toCsvValue(item.responsibleEmail),
          toCsvValue(item.challengePreferences[0]),
          toCsvValue(item.createdAt),
        ].join(","),
      );
    }

    return rows.join("\n");
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

  async memberEmailExistsInEdition(memberEmail, editionId, ignoreId) {
    const db = getFirebaseAdminDb();
    const snapshot = await db
      .collection(COLLECTIONS.registrations)
      .where("editionId", "==", editionId)
      .get();
    const emailLower = memberEmail.toLowerCase();

    return snapshot.docs.some((doc) => {
      if (ignoreId && doc.id === ignoreId) {
        return false;
      }
      const data = doc.data() as TeamRegistrationDoc;
      return data.members.some((member) => member.email.toLowerCase() === emailLower);
    });
  },
};

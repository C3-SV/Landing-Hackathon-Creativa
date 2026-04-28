import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const requiredEnv = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

function sanitizeEnv(value) {
  const trimmed = (value ?? "").trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: sanitizeEnv(process.env.FIREBASE_PROJECT_ID),
      clientEmail: sanitizeEnv(process.env.FIREBASE_CLIENT_EMAIL),
      privateKey: sanitizeEnv(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const snapshot = await db.collection("team_registrations").get();

let migrated = 0;
let skipped = 0;

for (const doc of snapshot.docs) {
  const data = doc.data();
  const rawMembers = Array.isArray(data.members) ? data.members : [];

  if (rawMembers.length === 0) {
    skipped += 1;
    continue;
  }

  const members = rawMembers.map((member) => ({
    ...member,
    about:
      typeof member.about === "string" && member.about.trim().length > 0
        ? member.about
        : "Perfil pendiente de actualizacion desde una inscripcion anterior.",
    isRepresentative: Boolean(member.isRepresentative),
  }));

  const currentRepresentatives = members.filter((member) => member.isRepresentative);
  let representativeIndex = members.findIndex((member) => member.isRepresentative);

  if (currentRepresentatives.length !== 1) {
    representativeIndex = 0;
    if (typeof data.responsibleEmail === "string" && data.responsibleEmail.trim()) {
      const found = members.findIndex(
        (member) =>
          typeof member.email === "string" &&
          member.email.toLowerCase() === data.responsibleEmail.toLowerCase(),
      );
      if (found >= 0) {
        representativeIndex = found;
      }
    }
  }

  const normalizedMembers = members.map((member, index) => ({
    ...member,
    isRepresentative: index === representativeIndex,
  }));

  const normalizedTeamSize = normalizedMembers.length >= 4 ? 4 : 3;

  await doc.ref.update({
    members: normalizedMembers,
    teamSize: normalizedTeamSize,
    source:
      typeof data.source === "string" && data.source.trim().length > 0
        ? data.source
        : "No especificado",
    updatedAt: new Date().toISOString(),
    responsibleName: FieldValue.delete(),
    responsibleEmail: FieldValue.delete(),
    responsiblePhone: FieldValue.delete(),
  });

  migrated += 1;
}

console.log(`Migration complete. Updated ${migrated} docs. Skipped ${skipped} docs.`);

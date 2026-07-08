import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const root = process.cwd();
const envPath = path.join(root, ".env");

function loadDotEnv() {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    if (process.env[key]) {
      continue;
    }

    let value = valueParts.join("=").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function requiredEnv(key) {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

function normalizeTeamName(value) {
  return value.trim().toLocaleLowerCase();
}

function member(role3H, firstName, lastName, email, isRepresentative = false) {
  return {
    role3H,
    isRepresentative,
    firstName,
    lastName,
    preferredName: "MOCK",
    email,
    phone: "+503 7000 0000",
    affiliationType: "MOCK MOCK MOCK - prueba interna",
    institution: "MOCK MOCK MOCK - NO REAL",
    degreeOrMajor: "MOCK MOCK MOCK - Testing de flujo Accepted",
    about:
      "MOCK MOCK MOCK. Este integrante no representa a una persona real y existe solo para probar el flujo de correo Accepted con datos validos.",
    linkedinUrl: "https://example.com/mock-linkedin",
    githubUrl: role3H === "hacker" ? "https://example.com/mock-github" : null,
    portfolioUrl: "https://example.com/mock-portfolio",
  };
}

loadDotEnv();

const projectId = requiredEnv("FIREBASE_PROJECT_ID");
const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
const editionId = process.env.CURRENT_EDITION_ID ?? "hackathon-de-turismo-creativo-i-2026";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();
const id = "mock_mock_mock_accepted_email_test";
const now = new Date().toISOString();
const teamName = "Equipo MOCK";

const registration = {
  id,
  editionId,
  status: "approved",
  teamSize: 4,
  teamName,
  teamNameNormalized: normalizeTeamName(teamName),
  institution: "MOCK MOCK MOCK - NO REAL",
  teamDescription:
    "MOCK MOCK MOCK. Equipo de prueba creado para validar el flujo de correo Accepted desde admin. No corresponde a participantes reales.",
  challengePreferences: ["touristsv", "creator-kit", "ar-cultura"],
  assignedChallengeId: null,
  source: "MOCK MOCK MOCK - script interno",
  members: [
    member(
      "hacker",
      "Chris",
      "Marroquin",
      "chris.marroquin2309@gmail.com",
      true,
    ),
    member("hipster", "Luis", "Hernandez", "marroquin.chris2309@gmail.com"),
    member("hustler", "Sofia", "Lopez", "mock.accepted.sofia@example.com"),
    member("hacker", "Carlos", "Rivera", "mock.accepted.carlos@example.com"),
  ],
  consents: {
    acceptCodeOfConduct: true,
    acceptPrivacyPolicy: true,
    mediaConsent: true,
    dataSharingConsent: true,
    authorizationDeclaration: true,
  },
  adminNotes: [
    {
      id: `note_mock_${Date.now()}`,
      authorEmail: "script@mock.local",
      message:
        "MOCK MOCK MOCK - registro no real creado para probar el flujo Accepted desde admin.",
      createdAt: now,
    },
  ],
  emailStatus: {
    accepted: {
      status: "not_sent",
    },
  },
  createdAt: now,
  updatedAt: now,
};

await db.collection("team_registrations").doc(id).set(registration);

console.log(JSON.stringify({ ok: true, id, teamName }, null, 2));

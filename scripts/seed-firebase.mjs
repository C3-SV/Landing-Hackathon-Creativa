import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const requiredEnv = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const challenges = [
  {
    id: "touristsv",
    name: "TouristSV",
    description: "Asistente inteligente para experiencia del turista.",
    hub: "AI Experience",
    status: "confirmed",
  },
  {
    id: "creator-kit",
    name: "Creator Kit",
    description: "Contenido y marketing para PYMES turísticas.",
    hub: "Creative Growth",
    status: "confirmed",
  },
  {
    id: "ar-cultura",
    name: "AR Cultura",
    description: "Educación cultural inmersiva para turismo.",
    hub: "Immersive Tech",
    status: "confirmed",
  },
  {
    id: "ecotrack",
    name: "EcoTrack",
    description: "Turismo ecológico y sostenible.",
    hub: "Sustainability",
    status: "confirmed",
  },
  {
    id: "datapulse",
    name: "DataPulse",
    description: "Recopilación de información para decisiones turísticas.",
    hub: "Intelligence",
    status: "proposed",
  },
  {
    id: "twinmap",
    name: "TwinMap",
    description: "Digital Twins aplicados a turismo.",
    hub: "Spatial Tech",
    status: "proposed",
  },
];

const editionId = process.env.CURRENT_EDITION_ID ?? "hackathon-creativa-2026";
const edition = {
  name: "Hackathon Creativa 2026",
  isCurrent: true,
  startsAt: "2026-06-20",
  endsAt: "2026-06-21",
  location: "Key Institute, San Salvador, SV",
};

await Promise.all(
  challenges.map((challenge) =>
    db.collection("challenges").doc(challenge.id).set(challenge, { merge: true }),
  ),
);

await db.collection("editions").doc(editionId).set(edition, { merge: true });

console.log("Firebase seed completed.");

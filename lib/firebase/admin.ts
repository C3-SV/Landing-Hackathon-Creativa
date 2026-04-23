import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { APP_ENV, hasFirebaseAdminConfig } from "@/lib/constants/env";

function ensureAdminApp() {
  if (!hasFirebaseAdminConfig()) {
    throw new Error(
      "Firebase Admin no configurado. Define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.",
    );
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: APP_ENV.firebaseAdmin.projectId,
        clientEmail: APP_ENV.firebaseAdmin.clientEmail,
        privateKey: APP_ENV.firebaseAdmin.privateKey,
      }),
    });
  }
}

export function getFirebaseAdminAuth() {
  ensureAdminApp();
  return getAuth();
}

export function getFirebaseAdminDb() {
  ensureAdminApp();
  return getFirestore();
}

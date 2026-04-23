"use client";

import { initializeApp, type FirebaseApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  FIREBASE_CLIENT_ENV,
  hasFirebaseClientConfig,
} from "@/lib/constants/public-env";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export function getFirebaseClientApp() {
  if (!hasFirebaseClientConfig()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = getApps().length
      ? getApp()
      : initializeApp({
          apiKey: FIREBASE_CLIENT_ENV.apiKey,
          authDomain: FIREBASE_CLIENT_ENV.authDomain,
          projectId: FIREBASE_CLIENT_ENV.projectId,
          appId: FIREBASE_CLIENT_ENV.appId,
        });
  }

  return firebaseApp;
}

export function getFirebaseClientAuth() {
  const app = getFirebaseClientApp();
  if (!app) {
    return null;
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(app);
  }

  return firebaseAuth;
}

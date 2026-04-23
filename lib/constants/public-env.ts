export const FIREBASE_CLIENT_ENV = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
} as const;

export function hasFirebaseClientConfig() {
  return Boolean(
    FIREBASE_CLIENT_ENV.apiKey &&
      FIREBASE_CLIENT_ENV.authDomain &&
      FIREBASE_CLIENT_ENV.projectId &&
      FIREBASE_CLIENT_ENV.appId,
  );
}

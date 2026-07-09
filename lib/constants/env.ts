import { CURRENT_EDITION_FALLBACK } from "@/lib/constants/event";
import {
  DEFAULT_BREVO_SENDER_NAME,
  DEFAULT_EMAIL_REPLY_TO,
} from "@/lib/email/team-email";
import type { RepositoryMode } from "@/lib/types/domain";

function readBooleanEnv(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function readStringEnv(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function resolveEnvReference(value: string | undefined) {
  const trimmed = readStringEnv(value);
  if (!trimmed) {
    return undefined;
  }

  const reference = trimmed.match(/^\$\{?([A-Z0-9_]+)\}?$/i)?.[1];
  if (!reference) {
    return trimmed;
  }

  return readStringEnv(process.env[reference]);
}

const brevoSenderEmail =
  resolveEnvReference(process.env.BREVO_SENDER_EMAIL) ??
  resolveEnvReference(process.env.EMAIL_FROM) ??
  "";

export const APP_ENV = {
  dataMode: (process.env.DATA_MODE ?? "mock") as RepositoryMode,
  currentEditionId: process.env.CURRENT_EDITION_ID ?? CURRENT_EDITION_FALLBACK,
  siteLockEnabled: readBooleanEnv(process.env.SITE_LOCK_ENABLED, false),
  adminEmails: (process.env.ADMIN_EMAILS ?? "admin@hackathonc3.dev")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
  emailNotificationsEnabled: readBooleanEnv(process.env.EMAIL_NOTIFICATIONS_ENABLED, false),
  email: {
    from: brevoSenderEmail,
    senderEmail: brevoSenderEmail,
    senderName:
      resolveEnvReference(process.env.BREVO_SENDER_NAME) ?? DEFAULT_BREVO_SENDER_NAME,
    replyTo:
      resolveEnvReference(process.env.BREVO_REPLY_TO_EMAIL) ??
      resolveEnvReference(process.env.EMAIL_REPLY_TO) ??
      DEFAULT_EMAIL_REPLY_TO,
    brevoApiKey: resolveEnvReference(process.env.BREVO_API_KEY) ?? "",
  },
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
  },
  mockAdminPassword: process.env.MOCK_ADMIN_PASSWORD ?? "hackathon-admin",
} as const;

export function isFirebaseMode() {
  return APP_ENV.dataMode === "firebase";
}

export function hasFirebaseAdminConfig() {
  return Boolean(
    APP_ENV.firebaseAdmin.projectId &&
      APP_ENV.firebaseAdmin.clientEmail &&
      APP_ENV.firebaseAdmin.privateKey,
  );
}

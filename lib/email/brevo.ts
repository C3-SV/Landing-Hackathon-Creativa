import { APP_ENV } from "@/lib/constants/env";
import { assertAllowedHackathonEmailType } from "@/lib/email/allowed-types";
import {
  DEFAULT_BREVO_SENDER_NAME,
  isValidEmail,
  parseReplyToEmails,
} from "@/lib/email/team-email";
import type { EmailType } from "@/lib/types/domain";

export type BrevoAttachment = {
  name: string;
  content: string;
};

export type BrevoEmailPayload = {
  emailType: EmailType;
  to: string[];
  cc: string[];
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  attachments?: BrevoAttachment[];
};

export type BrevoSendResult = {
  messageId?: string | null;
};

export async function sendBrevoEmail(payload: BrevoEmailPayload): Promise<BrevoSendResult> {
  assertAllowedHackathonEmailType(payload.emailType);

  if (!APP_ENV.email.brevoApiKey) {
    throw new Error("Falta BREVO_API_KEY para enviar correos.");
  }

  const replyToEmails = parseReplyToEmails(payload.replyTo);
  const primaryReplyTo = replyToEmails[0];
  const sender = {
    name: APP_ENV.email.senderName || DEFAULT_BREVO_SENDER_NAME,
    email: APP_ENV.email.senderEmail.trim().toLowerCase(),
  };

  console.log("Brevo sender email:", sender.email);

  if (!isValidEmail(sender.email)) {
    throw new Error(
      `BREVO_SENDER_EMAIL debe ser un correo válido y verificado en Brevo. Valor actual: ${
        sender.email || "(vacío)"
      }`,
    );
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": APP_ENV.email.brevoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
      to: payload.to.map((email) => ({ email })),
      cc: payload.cc.map((email) => ({ email })),
      ...(primaryReplyTo
        ? {
            replyTo: {
              email: primaryReplyTo,
            },
          }
        : {}),
      subject: payload.subject,
      textContent: payload.text,
      htmlContent: payload.html,
      ...(payload.attachments?.length ? { attachment: payload.attachments } : {}),
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Brevo rechazó el envío (${response.status}): ${body}`);
  }

  if (!body) {
    return { messageId: null };
  }

  try {
    const parsed = JSON.parse(body) as { messageId?: string };
    return { messageId: parsed.messageId ?? null };
  } catch {
    return { messageId: null };
  }
}

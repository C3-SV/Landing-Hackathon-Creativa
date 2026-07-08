import { APP_ENV } from "@/lib/constants/env";
import { DEFAULT_BREVO_SENDER_NAME } from "@/lib/email/team-email";

export type BrevoAttachment = {
  name: string;
  content: string;
};

export type BrevoEmailPayload = {
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
  if (!APP_ENV.email.brevoApiKey || !APP_ENV.email.senderEmail) {
    throw new Error("Faltan BREVO_API_KEY o BREVO_SENDER_EMAIL para enviar correos.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": APP_ENV.email.brevoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: APP_ENV.email.senderName || DEFAULT_BREVO_SENDER_NAME,
        email: APP_ENV.email.senderEmail,
      },
      to: payload.to.map((email) => ({ email })),
      cc: payload.cc.map((email) => ({ email })),
      replyTo: {
        email: payload.replyTo,
      },
      subject: payload.subject,
      textContent: payload.text,
      htmlContent: payload.html,
      ...(payload.attachments?.length ? { attachment: payload.attachments } : {}),
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Brevo rechazo el envio (${response.status}): ${body}`);
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

import { APP_ENV } from "@/lib/constants/env";
import { parseReplyToEmails } from "@/lib/email/team-email";
import type { RegistrationStatus, TeamRegistrationDoc } from "@/lib/types/domain";
import {
  getRepresentativeEmail,
  getRepresentativeName,
  registrationStatusLabel,
} from "@/lib/utils";

type StatusNotificationInput = {
  registration: TeamRegistrationDoc;
  previousStatus: RegistrationStatus;
  actorEmail: string;
};

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function statusMessage(status: RegistrationStatus) {
  switch (status) {
    case "approved":
      return "Tu equipo fue aprobado para participar en el Hackathon de Turismo Creativo Vol. 1.";
    case "waitlist":
      return "Tu equipo fue movido a lista de espera. Te contactaremos si se libera cupo.";
    case "rejected":
      return "Gracias por aplicar. En esta ocasión tu equipo no fue seleccionado.";
    case "needs_fix":
      return "Necesitamos que revises o completes información de tu inscripción.";
    case "submitted":
    default:
      return "Tu inscripción quedó marcada como enviada.";
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStatusEmail(input: StatusNotificationInput): EmailPayload | null {
  const to = getRepresentativeEmail(input.registration.members);
  if (!to) {
    return null;
  }

  const representativeName = getRepresentativeName(input.registration.members) || "equipo";
  const statusLabel = registrationStatusLabel(input.registration.status);
  const message = statusMessage(input.registration.status);
  const assignedChallenge = input.registration.assignedChallengeId
    ? `Reto asignado: ${input.registration.assignedChallengeId}`
    : "Reto asignado: pendiente";

  return {
    to,
    subject: `Actualización de estado: ${input.registration.teamName}`,
    text: [
      `Hola ${representativeName},`,
      "",
      message,
      "",
      `Estado actual: ${statusLabel}`,
      assignedChallenge,
      "",
      "Equipo organizador C3",
    ].join("\n"),
    html: [
      `<p>Hola ${escapeHtml(representativeName)},</p>`,
      `<p>${escapeHtml(message)}</p>`,
      `<p><strong>Estado actual:</strong> ${escapeHtml(statusLabel)}<br />`,
      `<strong>${escapeHtml(assignedChallenge)}</strong></p>`,
      "<p>Equipo organizador C3</p>",
    ].join(""),
  };
}

async function sendEmail(payload: EmailPayload) {
  if (!APP_ENV.emailNotificationsEnabled) {
    return { sent: false, reason: "disabled" as const };
  }

  if (!APP_ENV.email.brevoApiKey || !APP_ENV.email.from) {
    console.warn(
      "EMAIL_NOTIFICATIONS_ENABLED=true pero faltan BREVO_API_KEY o EMAIL_FROM.",
    );
    return { sent: false, reason: "missing_config" as const };
  }

  const replyToEmails = parseReplyToEmails(APP_ENV.email.replyTo);
  const primaryReplyTo = replyToEmails[0];

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": APP_ENV.email.brevoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: APP_ENV.email.from,
      },
      to: [
        {
          email: payload.to,
        },
      ],
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
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`No se pudo enviar email (${response.status}): ${body}`);
  }

  return { sent: true as const };
}

export async function notifyRegistrationStatusChange(input: StatusNotificationInput) {
  if (input.previousStatus === input.registration.status) {
    return { sent: false, reason: "status_unchanged" as const };
  }

  const payload = buildStatusEmail(input);
  if (!payload) {
    return { sent: false, reason: "missing_recipient" as const };
  }

  try {
    return await sendEmail(payload);
  } catch (error) {
    console.error("Error enviando notificación de estado", {
      registrationId: input.registration.id,
      actorEmail: input.actorEmail,
      error,
    });
    return { sent: false, reason: "send_failed" as const };
  }
}

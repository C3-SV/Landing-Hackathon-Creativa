import { APP_ENV } from "@/lib/constants/env";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
  buildTeamEmailRecipients,
  CHALLENGE_ASSIGNED_SUBJECT,
  escapeHtml,
  isValidEmail,
  memberDisplayName,
  resolveAssignedChallenge,
} from "@/lib/email/team-email";
import { registrationRepository } from "@/lib/repositories";
import type { Challenge, EmailDeliveryStatus, TeamRegistrationDoc } from "@/lib/types/domain";

type ChallengeAssignedEmailResult = {
  registration: TeamRegistrationDoc;
  status: EmailDeliveryStatus;
  logId: string;
  messageId?: string | null;
  errorMessage?: string | null;
};

function buildBody(teamName: string, assignedChallengeName: string) {
  const text = [
    `Hola, equipo ${teamName}.`,
    "",
    "Ya tenemos listo el reto asignado para su participacion en la Hackathon de Turismo Creativo Vol. 1.",
    "",
    "Su reto asignado es:",
    assignedChallengeName,
    "",
    "Por ahora, les pedimos estar atentos a las proximas indicaciones del evento. Muy pronto recibiran mas detalles sobre dinamica, horarios y siguientes pasos.",
    "",
    "Cualquier consulta pueden responder a este correo.",
    "",
    "C3 + Poliedrica",
  ].join("\n");

  const html = [
    `<p>Hola, equipo ${escapeHtml(teamName)}.</p>`,
    "<p>Ya tenemos listo el reto asignado para su participacion en la Hackathon de Turismo Creativo Vol. 1.</p>",
    "<p>Su reto asignado es:</p>",
    `<p><strong>${escapeHtml(assignedChallengeName)}</strong></p>`,
    "<p>Por ahora, les pedimos estar atentos a las proximas indicaciones del evento. Muy pronto recibiran mas detalles sobre dinamica, horarios y siguientes pasos.</p>",
    "<p>Cualquier consulta pueden responder a este correo.</p>",
    "<p>C3 + Poliedrica</p>",
  ].join("");

  return { text, html };
}

export function validateChallengeAssignedEmailRegistration(
  registration: TeamRegistrationDoc,
  challenges: readonly Challenge[],
) {
  if (!registration.teamName.trim()) {
    throw new Error("No se puede enviar: el equipo no tiene nombre.");
  }

  if (!registration.members.length) {
    throw new Error("No se puede enviar: el equipo no tiene integrantes.");
  }

  const { representative, to } = buildTeamEmailRecipients(registration);
  if (!isValidEmail(to)) {
    throw new Error("No se puede enviar: el representante no tiene un correo valido.");
  }

  for (const member of registration.members) {
    if (!isValidEmail(member.email)) {
      throw new Error(
        `No se puede enviar: ${memberDisplayName(member) || "un integrante"} no tiene correo valido.`,
      );
    }
  }

  const assignedChallenge = resolveAssignedChallenge(registration, challenges);

  return { representative, assignedChallenge };
}

export async function sendChallengeAssignedEmailForRegistration(input: {
  registration: TeamRegistrationDoc;
  sentBy: string;
  confirmResend?: boolean;
}): Promise<ChallengeAssignedEmailResult> {
  const { registration, sentBy } = input;

  if (
    registration.emailStatus?.challengeAssigned?.status === "sent" &&
    !input.confirmResend
  ) {
    throw new Error(
      "Este correo de reto asignado ya fue enviado. Confirma el reenvio para continuar.",
    );
  }

  const challenges = await registrationRepository.getChallenges();
  const { assignedChallenge } = validateChallengeAssignedEmailRegistration(
    registration,
    challenges,
  );
  const { to, cc } = buildTeamEmailRecipients(registration);
  const body = buildBody(registration.teamName, assignedChallenge.name);
  const now = new Date().toISOString();
  const logBase = {
    teamRegistrationId: registration.id,
    teamName: registration.teamName,
    emailType: "challenge_assigned" as const,
    subject: CHALLENGE_ASSIGNED_SUBJECT,
    to: [to],
    cc,
    assignedChallengeId: assignedChallenge.id,
    assignedChallengeName: assignedChallenge.name,
    attachments: [],
    sentAt: now,
    sentBy,
  };

  let status: EmailDeliveryStatus = "dry_run";
  let brevoMessageId: string | null = null;
  let errorMessage: string | null = null;

  if (APP_ENV.emailNotificationsEnabled) {
    try {
      const result = await sendBrevoEmail({
        to: [to],
        cc,
        subject: CHALLENGE_ASSIGNED_SUBJECT,
        text: body.text,
        html: body.html,
        replyTo: APP_ENV.email.replyTo,
      });
      status = "sent";
      brevoMessageId = result.messageId ?? null;
    } catch (error) {
      status = "failed";
      errorMessage = error instanceof Error ? error.message : "Brevo no pudo enviar el correo.";
    }
  }

  const log = await registrationRepository.createEmailLog({
    ...logBase,
    status,
    brevoMessageId,
    errorMessage,
  });

  const updated = await registrationRepository.updateRegistrationEmailStatus(
    registration.id,
    "challengeAssigned",
    {
      status,
      lastSentAt: now,
      lastLogId: log.id,
    },
  );

  return {
    registration: updated ?? registration,
    status,
    logId: log.id,
    messageId: brevoMessageId,
    errorMessage,
  };
}

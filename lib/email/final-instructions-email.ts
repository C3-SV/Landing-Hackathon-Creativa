import { CODE_OF_CONDUCT_EMAIL_CONFIG } from "@/lib/code-of-conduct/config";
import { APP_ENV } from "@/lib/constants/env";
import { getHackathonEmailStatusEntry } from "@/lib/email/allowed-types";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
  buildTeamEmailRecipients,
  escapeHtml,
  isValidEmail,
  memberDisplayName,
  resolveAssignedChallenge,
} from "@/lib/email/team-email";
import { registrationRepository } from "@/lib/repositories";
import type {
  CodeOfConductAcceptance,
  EmailDeliveryStatus,
  TeamRegistrationDoc,
} from "@/lib/types/domain";

export const FINAL_INSTRUCTIONS_SUBJECT = "Indicaciones finales - HTC Vol. 1";

type FinalInstructionsEmailResult = {
  registration: TeamRegistrationDoc;
  acceptance: CodeOfConductAcceptance | null;
  status: EmailDeliveryStatus;
  logId: string;
  messageId?: string | null;
  errorMessage?: string | null;
};

function buildFinalInstructionsBody(teamName: string) {
  const {
    whatsappGroupLink,
    keyRegulationsUrl,
    keyRegulationsText,
    welcomeMessage,
    eventLogisticsText,
  } = CODE_OF_CONDUCT_EMAIL_CONFIG;

  const regulationsValue = keyRegulationsUrl || keyRegulationsText;

  const text = [
    `Hola, equipo ${teamName}.`,
    "",
    "Les compartimos las indicaciones finales para HTC Vol. 1.",
    "",
    "Información importante:",
    `- Reglamento Key: ${regulationsValue}`,
    `- Grupo de WhatsApp: ${whatsappGroupLink}`,
    `- Bienvenida / indicaciones generales: ${welcomeMessage}`,
    `- Horarios / llegada / logística: ${eventLogisticsText}`,
    "",
    "Nos vemos en HTC Vol. 1.",
    "",
    "Equipo C3 / HTC",
  ].join("\n");

  const html = [
    `<p>Hola, equipo ${escapeHtml(teamName)}.</p>`,
    "<p>Les compartimos las indicaciones finales para HTC Vol. 1.</p>",
    "<p><strong>Información importante:</strong></p>",
    "<ul>",
    `<li>Reglamento Key: ${escapeHtml(regulationsValue)}</li>`,
    `<li>Grupo de WhatsApp: ${escapeHtml(whatsappGroupLink)}</li>`,
    `<li>Bienvenida / indicaciones generales: ${escapeHtml(welcomeMessage)}</li>`,
    `<li>Horarios / llegada / logística: ${escapeHtml(eventLogisticsText)}</li>`,
    "</ul>",
    "<p>Nos vemos en HTC Vol. 1.</p>",
    "<p>Equipo C3 / HTC</p>",
  ].join("");

  return { text, html };
}

export async function validateFinalInstructionsEmailRegistration(
  registration: TeamRegistrationDoc,
) {
  if (!registration.teamName.trim()) {
    throw new Error("No se puede enviar: el equipo no tiene nombre.");
  }

  if (registration.status !== "approved") {
    throw new Error(
      "No se puede enviar indicaciones finales: primero marca el equipo como aprobado.",
    );
  }

  if (!registration.members.length) {
    throw new Error("No se puede enviar: el equipo no tiene integrantes.");
  }

  const { representative, to } = buildTeamEmailRecipients(registration);
  if (!isValidEmail(to)) {
    throw new Error("No se puede enviar: el representante no tiene un correo válido.");
  }

  for (const member of registration.members) {
    if (!isValidEmail(member.email)) {
      throw new Error(
        `No se puede enviar: ${memberDisplayName(member) || "un integrante"} no tiene correo válido.`,
      );
    }
  }

  const challenges = await registrationRepository.getChallenges();
  const assignedChallenge = resolveAssignedChallenge(registration, challenges);

  return { representative, assignedChallenge };
}

export async function sendFinalInstructionsEmailForRegistration(input: {
  registration: TeamRegistrationDoc;
  sentBy: string;
  confirmResend?: boolean;
}): Promise<FinalInstructionsEmailResult> {
  const { registration, sentBy } = input;

  if (
    getHackathonEmailStatusEntry(registration.emailStatus, "final_instructions")?.status ===
      "sent" &&
    !input.confirmResend
  ) {
    throw new Error(
      "Este correo de indicaciones finales ya fue enviado. Confirma el reenvío para continuar.",
    );
  }

  const { assignedChallenge } = await validateFinalInstructionsEmailRegistration(registration);
  const { to, cc } = buildTeamEmailRecipients(registration);
  const body = buildFinalInstructionsBody(registration.teamName);
  const now = new Date().toISOString();
  const logBase = {
    teamRegistrationId: registration.id,
    teamName: registration.teamName,
    emailType: "final_instructions" as const,
    subject: FINAL_INSTRUCTIONS_SUBJECT,
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
        emailType: "final_instructions",
        to: [to],
        cc,
        subject: FINAL_INSTRUCTIONS_SUBJECT,
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
    "final_instructions",
    {
      status,
      lastSentAt: now,
      lastLogId: log.id,
    },
  );

  const acceptance =
    await registrationRepository.getCodeOfConductAcceptanceForRegistration(registration.id);

  return {
    registration: updated ?? registration,
    acceptance,
    status,
    logId: log.id,
    messageId: brevoMessageId,
    errorMessage,
  };
}

export function getFinalInstructionsEmailClientSummary(
  registration: TeamRegistrationDoc,
  acceptance: CodeOfConductAcceptance | null,
) {
  return {
    subject: FINAL_INSTRUCTIONS_SUBJECT,
    codeOfConductStatus: acceptance?.status ?? "pending",
    codeOfConductSentAt: acceptance?.sentAt ?? null,
    codeOfConductAcceptedAt: acceptance?.acceptedAt ?? null,
    codeOfConductAcceptedBy: acceptance?.acceptedByName ?? null,
    notificationsEnabled: APP_ENV.emailNotificationsEnabled,
  };
}

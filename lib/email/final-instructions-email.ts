import { CODE_OF_CONDUCT_EMAIL_CONFIG, buildCodeOfConductAcceptUrl } from "@/lib/code-of-conduct/config";
import { APP_ENV } from "@/lib/constants/env";
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
  acceptance: CodeOfConductAcceptance;
  status: EmailDeliveryStatus;
  logId: string;
  messageId?: string | null;
  errorMessage?: string | null;
};

function buildFinalInstructionsBody(input: {
  teamName: string;
  codeOfConductAcceptUrl: string;
}) {
  const {
    publicCodeOfConductUrl,
    whatsappGroupLink,
    keyRegulationsUrl,
    keyRegulationsText,
    welcomeMessage,
    eventLogisticsText,
  } = CODE_OF_CONDUCT_EMAIL_CONFIG;

  const text = [
    `Hola, equipo ${input.teamName}.`,
    "",
    "¡Bienvenidos oficialmente a la Hackathon de Turismo Creativo Vol. 1!",
    "",
    "Antes del evento, necesitamos que el capitán o un representante del equipo lea y confirme el Código de Conducta en nombre del equipo.",
    "",
    "Confirmar Código de Conducta:",
    input.codeOfConductAcceptUrl,
    "",
    "Información importante:",
    `- Código de Conducta: ${publicCodeOfConductUrl}`,
    `- Reglamento Key: ${keyRegulationsUrl || keyRegulationsText}`,
    `- Grupo de WhatsApp: ${whatsappGroupLink}`,
    `- Bienvenida / indicaciones generales: ${welcomeMessage}`,
    `- Horarios / llegada / logística: ${eventLogisticsText}`,
    "",
    "Esta confirmación es obligatoria para participar y nos ayuda a garantizar una experiencia segura, respetuosa y colaborativa para todos.",
    "",
    "Nos vemos en HTC Vol. 1.",
    "",
    "Equipo C3 / HTC",
  ].join("\n");

  const html = [
    `<p>Hola, equipo ${escapeHtml(input.teamName)}.</p>`,
    "<p><strong>¡Bienvenidos oficialmente a la Hackathon de Turismo Creativo Vol. 1!</strong></p>",
    "<p>Antes del evento, necesitamos que el capitán o un representante del equipo lea y confirme el Código de Conducta en nombre del equipo.</p>",
    `<p><a href="${escapeHtml(input.codeOfConductAcceptUrl)}" style="display:inline-block;background:#ffa726;color:#0a1f3d;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none;">Confirmar Código de Conducta</a></p>`,
    "<p><strong>Información importante:</strong></p>",
    "<ul>",
    `<li>Código de Conducta: <a href="${escapeHtml(publicCodeOfConductUrl)}">${escapeHtml(publicCodeOfConductUrl)}</a></li>`,
    `<li>Reglamento Key: ${escapeHtml(keyRegulationsUrl || keyRegulationsText)}</li>`,
    `<li>Grupo de WhatsApp: ${escapeHtml(whatsappGroupLink)}</li>`,
    `<li>Bienvenida / indicaciones generales: ${escapeHtml(welcomeMessage)}</li>`,
    `<li>Horarios / llegada / logística: ${escapeHtml(eventLogisticsText)}</li>`,
    "</ul>",
    "<p>Esta confirmación es obligatoria para participar y nos ayuda a garantizar una experiencia segura, respetuosa y colaborativa para todos.</p>",
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
    registration.emailStatus?.finalInstructions?.status === "sent" &&
    !input.confirmResend
  ) {
    throw new Error(
      "Este correo de indicaciones finales ya fue enviado. Confirma el reenvío para continuar.",
    );
  }

  const { assignedChallenge } = await validateFinalInstructionsEmailRegistration(registration);
  const acceptance = await registrationRepository.getOrCreateCodeOfConductAcceptance({
    registration,
    challengeId: assignedChallenge.id,
    challengeName: assignedChallenge.name,
  });
  const { to, cc } = buildTeamEmailRecipients(registration);
  const codeOfConductAcceptUrl = buildCodeOfConductAcceptUrl(acceptance.token);
  const body = buildFinalInstructionsBody({
    teamName: registration.teamName,
    codeOfConductAcceptUrl,
  });
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
    "finalInstructions",
    {
      status,
      lastSentAt: now,
      lastLogId: log.id,
    },
  );

  const updatedAcceptance =
    status === "failed"
      ? acceptance
      : await registrationRepository.markCodeOfConductFinalInstructionsSent(
          registration.id,
          now,
        );

  return {
    registration: updated ?? registration,
    acceptance: updatedAcceptance ?? acceptance,
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

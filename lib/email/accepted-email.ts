import { APP_ENV } from "@/lib/constants/env";
import {
  assertAcceptedTemplatesExist,
  generateAcceptedEmailAttachments,
} from "@/lib/email/accepted-image-generator";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { registrationRepository } from "@/lib/repositories";
import type {
  EmailDeliveryStatus,
  Role3H,
  TeamMember,
  TeamRegistrationDoc,
} from "@/lib/types/domain";

const ACCEPTED_SUBJECT = "Team Accepted | Hackathon de Turismo Creativo Vol. 1";
const FIXED_CC = [
  "competitivecodingclub.sv@gmail.com",
  //"carlosvalladares.sv@gmail.com", 
  // KAKO, QUEDA COMENTADO HASTA TERMINAR EL TESTING DE ENVIO DE CORREOS, PARA NO LLENARLE EL BUZON A KAKO
] as const;
const REPLY_TO = "competitivecodingclub.sv@gmail.com";

type AcceptedEmailResult = {
  registration: TeamRegistrationDoc;
  status: EmailDeliveryStatus;
  logId: string;
  messageId?: string | null;
  errorMessage?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function dedupeEmails(emails: readonly string[]) {
  return [...new Set(emails.map(normalizeEmail).filter(Boolean))];
}

function memberDisplayName(member: TeamMember) {
  return `${member.firstName} ${member.lastName}`.trim();
}

function findStrictRepresentative(members: readonly TeamMember[]) {
  return members.find((member) => member.isRepresentative) ?? null;
}

function buildBody(teamName: string) {
  const text = [
    `Hola, equipo ${teamName}.`,
    "",
    "¡Felicidades! Su equipo ha sido aceptado para participar en la Hackathon de Turismo Creativo Vol. 1.",
    "",
    "Adjuntamos sus piezas de aceptación del equipo y de cada integrante. Muy pronto recibirán más información sobre los próximos pasos del evento.",
    "",
    "Por favor, cualquier consulta pueden responder a este correo.",
    "",
    "Nos vemos pronto.",
    "",
    "C3 + Poliédrica",
  ].join("\n");

  const html = [
    `<p>Hola, equipo ${escapeHtml(teamName)}.</p>`,
    "<p>¡Felicidades! Su equipo ha sido aceptado para participar en la Hackathon de Turismo Creativo Vol. 1.</p>",
    "<p>Adjuntamos sus piezas de aceptación del equipo y de cada integrante. Muy pronto recibirán más información sobre los próximos pasos del evento.</p>",
    "<p>Por favor, cualquier consulta pueden responder a este correo.</p>",
    "<p>Nos vemos pronto.</p>",
    "<p>C3 + Poliédrica</p>",
  ].join("");

  return { text, html };
}

export function buildAcceptedRecipients(registration: TeamRegistrationDoc) {
  const representative = findStrictRepresentative(registration.members);
  if (!representative) {
    throw new Error("No se puede enviar: el equipo no tiene representante definido.");
  }

  const to = normalizeEmail(representative.email);
  const cc = dedupeEmails([
    ...registration.members
      .filter((member) => !member.isRepresentative)
      .map((member) => member.email),
    ...FIXED_CC,
  ]).filter((email) => email !== to);

  return { representative, to, cc };
}

export async function validateAcceptedEmailRegistration(registration: TeamRegistrationDoc) {
  if (!registration.teamName.trim()) {
    throw new Error("No se puede enviar: el equipo no tiene nombre.");
  }

  if (registration.status !== "approved") {
    throw new Error("No se puede enviar Accepted: primero marca el equipo como aprobado.");
  }

  if (!registration.members.length) {
    throw new Error("No se puede enviar: el equipo no tiene integrantes.");
  }

  if (registration.members.length < 3) {
    throw new Error("No se puede enviar: el equipo debe tener al menos 3 integrantes.");
  }

  const { representative, to } = buildAcceptedRecipients(registration);
  if (!isValidEmail(to)) {
    throw new Error("No se puede enviar: el representante no tiene un correo válido.");
  }

  for (const member of registration.members) {
    if (!member.role3H) {
      throw new Error(`No se puede enviar: ${memberDisplayName(member) || "un integrante"} no tiene rol 3H.`);
    }
    if (!isValidEmail(member.email)) {
      throw new Error(`No se puede enviar: ${memberDisplayName(member) || "un integrante"} no tiene correo válido.`);
    }
  }

  await assertAcceptedTemplatesExist(registration.members.map((member) => member.role3H as Role3H));

  return { representative };
}

export async function sendAcceptedEmailForRegistration(input: {
  registration: TeamRegistrationDoc;
  sentBy: string;
  confirmResend?: boolean;
}): Promise<AcceptedEmailResult> {
  const { registration, sentBy } = input;

  if (registration.emailStatus?.accepted?.status === "sent" && !input.confirmResend) {
    throw new Error("Este correo Accepted ya fue enviado. Confirma el reenvío para continuar.");
  }

  await validateAcceptedEmailRegistration(registration);

  const { to, cc } = buildAcceptedRecipients(registration);
  const attachments = await generateAcceptedEmailAttachments(registration);
  const body = buildBody(registration.teamName);
  const now = new Date().toISOString();
  const logBase = {
    teamRegistrationId: registration.id,
    teamName: registration.teamName,
    emailType: "accepted" as const,
    subject: ACCEPTED_SUBJECT,
    to: [to],
    cc,
    attachments: attachments.map((attachment) => ({
      fileName: attachment.fileName,
      type: attachment.type,
    })),
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
        subject: ACCEPTED_SUBJECT,
        text: body.text,
        html: body.html,
        replyTo: REPLY_TO,
        attachments: attachments.map((attachment) => ({
          name: attachment.fileName,
          content: attachment.buffer.toString("base64"),
        })),
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
    "accepted",
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

export function getAcceptedEmailClientSummary(registration: TeamRegistrationDoc) {
  const base = {
    subject: ACCEPTED_SUBJECT,
    representativeName: "Sin representante",
    to: "",
    cc: [] as string[],
    attachmentCount: 1 + registration.members.length,
    notificationsEnabled: APP_ENV.emailNotificationsEnabled,
    error: null as string | null,
  };

  try {
    const { representative, to, cc } = buildAcceptedRecipients(registration);

    return {
      ...base,
      representativeName: memberDisplayName(representative),
      to,
      cc,
    };
  } catch (error) {
    return {
      ...base,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo preparar el resumen de destinatarios.",
    };
  }
}

import { readFile } from "fs/promises";
import path from "path";
import { APP_ENV } from "@/lib/constants/env";
import { getHackathonEmailStatusEntry } from "@/lib/email/allowed-types";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
  buildChallengeAndFinalEmailCc,
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

export const FINAL_INSTRUCTIONS_SUBJECT = "Indicaciones finales – HTC Vol. 1";
const KEY_INSTITUTE_RULES_ATTACHMENT = {
  fileName: "NORMAS DE CONDUCTA - KEY INSTITUTE.pdf",
  type: "application/pdf",
  path: path.join(
    process.cwd(),
    "public",
    "email-templates",
    "final-instructions",
    "normas-de-conducta-key-institute.pdf",
  ),
};

type FinalInstructionsEmailResult = {
  registration: TeamRegistrationDoc;
  acceptance: CodeOfConductAcceptance | null;
  status: EmailDeliveryStatus;
  logId: string;
  messageId?: string | null;
  errorMessage?: string | null;
};

async function getFinalInstructionsAttachments() {
  const buffer = await readFile(KEY_INSTITUTE_RULES_ATTACHMENT.path);

  return [
    {
      fileName: KEY_INSTITUTE_RULES_ATTACHMENT.fileName,
      type: KEY_INSTITUTE_RULES_ATTACHMENT.type,
      buffer,
    },
  ];
}

function buildFinalInstructionsBody(teamName: string) {
  const whatsappGroupLink = "https://chat.whatsapp.com/J8MxpKcISuAGKJErsCg107";
  const agendaUrl = "hackathon.c3.com.sv";

  const text = [
    "Indicaciones finales – HTC Vol. 1",
    "",
    `Hola, equipo ${teamName}:`,
    "",
    "Les compartimos las indicaciones finales para HTC Vol. 1",
    "",
    "Nos alegra mucho contar con ustedes en esta primera edición. Esta hackathon nace con el espíritu de construir juntos: turismo, código, cultura, creatividad y colaboración en un mismo espacio. Queremos que vivan una experiencia intensa, práctica y retadora, donde cada equipo pueda aportar desde sus habilidades y crear soluciones con impacto real.",
    "",
    "Información importante",
    "",
    "1. Reglamento de Key Institute",
    "",
    "Adjuntamos el reglamento de uso de las instalaciones de Key Institute:",
    "",
    "Les pedimos leerlo antes del evento para garantizar una buena convivencia durante toda la experiencia.",
    "",
    "2. Grupo de WhatsApp",
    "",
    "Este será el canal principal para avisos rápidos, recordatorios y comunicación durante la hackathon:",
    "",
    whatsappGroupLink,
    "",
    "Les pedimos que todos los integrantes del equipo se unan al grupo.",
    "",
    "3. Horarios, llegada y logística",
    "",
    "La agenda completa está disponible en el sitio web:",
    agendaUrl,
    "",
    "El evento inicia el sábado a las 7:30 a. m. con el registro y check-in. Les recomendamos llegar con tiempo para completar el ingreso, ubicarse con su equipo y estar listos para el inicio oficial de la experiencia.",
    "",
    "Recomendaciones finales",
    "",
    "- Llevar laptops, cargadores y cualquier periférico que necesiten.",
    "- Llevar snacks ligeros de su preferencia, termo y botellas de agua.",
    "- Llevar documentos personales o identificación.",
    "- Si desean descansar durante la noche, pueden llevar sleeping bag o artículos personales básicos.",
    "- Procuren llevar ropa cómoda para una jornada larga de trabajo.",
    "- Revisen bien la agenda y coordinan previamente con su equipo.",
    "- Pueden llegar con ideas, investigación o referencias, pero no con código o proyectos ya desarrollados previamente.",
    "- El uso de herramientas de inteligencia artificial está permitido.",
    "- Mantengan siempre una actitud colaborativa, respetuosa y abierta a aprender.",
    "",
    "Nota importante sobre alimentación: Por favor, si alguno de los miembros de su equipo no come carnes rojas (res) o no consume carnes, avísenos a la brevedad posible para poder gestionar las alternativas.",
    "",
    "Nos emociona mucho conocerlos, ver sus ideas en acción y acompañarlos durante esta experiencia.",
    "",
    "Nos vemos en el HTC Vol. 1.",
    "",
    "La colaboración multiplica los resultados.",
    "",
    "Saludos,",
    "Comité Organizador de la Hackathon",
    "C3 + Poliédrica",
  ].join("\n");

  const html = [
    "<h1>Indicaciones finales – HTC Vol. 1</h1>",
    `<p>Hola, equipo ${escapeHtml(teamName)}:</p>`,
    "<p>Les compartimos las indicaciones finales para HTC Vol. 1</p>",
    "<p>Nos alegra mucho contar con ustedes en esta primera edición. Esta hackathon nace con el espíritu de construir juntos: turismo, código, cultura, creatividad y colaboración en un mismo espacio. Queremos que vivan una experiencia intensa, práctica y retadora, donde cada equipo pueda aportar desde sus habilidades y crear soluciones con impacto real.</p>",
    "<h2>Información importante</h2>",
    "<h3>1. Reglamento de Key Institute</h3>",
    "<p>Adjuntamos el reglamento de uso de las instalaciones de Key Institute:</p>",
    "<p>Les pedimos leerlo antes del evento para garantizar una buena convivencia durante toda la experiencia.</p>",
    "<h3>2. Grupo de WhatsApp</h3>",
    "<p>Este será el canal principal para avisos rápidos, recordatorios y comunicación durante la hackathon:</p>",
    `<p><a href="${escapeHtml(whatsappGroupLink)}">${escapeHtml(whatsappGroupLink)}</a></p>`,
    "<p>Les pedimos que todos los integrantes del equipo se unan al grupo.</p>",
    "<h3>3. Horarios, llegada y logística</h3>",
    "<p>La agenda completa está disponible en el sitio web:<br />",
    `<a href="https://${escapeHtml(agendaUrl)}">${escapeHtml(agendaUrl)}</a></p>`,
    "<p>El evento inicia el sábado a las 7:30 a. m. con el registro y check-in. Les recomendamos llegar con tiempo para completar el ingreso, ubicarse con su equipo y estar listos para el inicio oficial de la experiencia.</p>",
    "<h2>Recomendaciones finales</h2>",
    "<ul>",
    "<li>Llevar laptops, cargadores y cualquier periférico que necesiten.</li>",
    "<li>Llevar snacks ligeros de su preferencia, termo y botellas de agua.</li>",
    "<li>Llevar documentos personales o identificación.</li>",
    "<li>Si desean descansar durante la noche, pueden llevar sleeping bag o artículos personales básicos.</li>",
    "<li>Procuren llevar ropa cómoda para una jornada larga de trabajo.</li>",
    "<li>Revisen bien la agenda y coordinan previamente con su equipo.</li>",
    "<li>Pueden llegar con ideas, investigación o referencias, pero no con código o proyectos ya desarrollados previamente.</li>",
    "<li>El uso de herramientas de inteligencia artificial está permitido.</li>",
    "<li>Mantengan siempre una actitud colaborativa, respetuosa y abierta a aprender.</li>",
    "</ul>",
    "<p><strong>Nota importante sobre alimentación:</strong> Por favor, si alguno de los miembros de su equipo no come carnes rojas (res) o no consume carnes, avísenos a la brevedad posible para poder gestionar las alternativas.</p>",
    "<p>Nos emociona mucho conocerlos, ver sus ideas en acción y acompañarlos durante esta experiencia.</p>",
    "<p>Nos vemos en el HTC Vol. 1.</p>",
    "<p>La colaboración multiplica los resultados.</p>",
    "<p>Saludos,<br />Comité Organizador de la Hackathon<br />C3 + Poliédrica</p>",
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
  const { to, cc: teamCc } = buildTeamEmailRecipients(registration);
  const cc = buildChallengeAndFinalEmailCc(teamCc);
  const body = buildFinalInstructionsBody(registration.teamName);
  const attachments = await getFinalInstructionsAttachments();
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
        emailType: "final_instructions",
        to: [to],
        cc,
        subject: FINAL_INSTRUCTIONS_SUBJECT,
        text: body.text,
        html: body.html,
        replyTo: APP_ENV.email.replyTo,
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

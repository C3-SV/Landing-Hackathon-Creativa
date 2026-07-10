import { APP_ENV } from "@/lib/constants/env";
import { getHackathonEmailStatusEntry } from "@/lib/email/allowed-types";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
  buildChallengeAndFinalEmailCc,
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
  const siteUrl = "hackathon.c3.com.sv";

  const text = [
    `Hola, equipo ${teamName}:`,
    "",
    "Nos alegra mucho compartirles que ya tenemos listo el reto asignado para su participación en la Hackathon de Turismo Creativo Vol. 1.",
    "",
    "Su reto asignado es:",
    "",
    assignedChallengeName,
    "",
    "Este reto forma parte de los desafíos reales que estaremos trabajando durante la hackathon, vinculados al turismo creativo, la cultura, la tecnología y el desarrollo de soluciones con impacto para El Salvador.",
    "",
    "Al inicio de la hackathon también les brindaremos más detalles finales sobre el reto: su contexto, criterios, enfoque esperado y consideraciones importantes para que puedan arrancar con claridad.",
    "",
    "Les invitamos a llegar con mucha energía, disposición para colaborar y ganas de construir. Esta experiencia está pensada para que cada equipo combine sus habilidades, ideas y enfoques para proponer una solución sólida, creativa y aplicable.",
    "",
    "Además, ya pueden conocer más sobre los premios de la hackathon en el sitio web:",
    "",
    siteUrl,
    "",
    "Los premios están construidos alrededor de la lógica ABC: Asesoría y mentoría 1:1, Business connections y Colaboración HTC Ecosystem. Con esto, buscamos que esta experiencia les abra puertas, conexiones y acompañamiento para seguir desarrollando sus ideas más allá del evento.",
    "",
    "Por ahora, les pedimos estar atentos a las próximas indicaciones del evento y a nuestras redes sociales. Muy pronto recibirán más detalles sobre dinámica, horarios y siguientes pasos.",
    "",
    "Cualquier consulta pueden responder a este correo.",
    "",
    "Nos vemos pronto en HTC Vol. 1.",
    "",
    "Saludos,",
    "C3 + Poliédrica",
  ].join("\n");

  const html = [
    `<p>Hola, equipo ${escapeHtml(teamName)}:</p>`,
    "<p>Nos alegra mucho compartirles que ya tenemos listo el reto asignado para su participación en la Hackathon de Turismo Creativo Vol. 1.</p>",
    "<p>Su reto asignado es:</p>",
    `<p><strong>${escapeHtml(assignedChallengeName)}</strong></p>`,
    "<p>Este reto forma parte de los desafíos reales que estaremos trabajando durante la hackathon, vinculados al turismo creativo, la cultura, la tecnología y el desarrollo de soluciones con impacto para El Salvador.</p>",
    "<p>Al inicio de la hackathon también les brindaremos más detalles finales sobre el reto: su contexto, criterios, enfoque esperado y consideraciones importantes para que puedan arrancar con claridad.</p>",
    "<p>Les invitamos a llegar con mucha energía, disposición para colaborar y ganas de construir. Esta experiencia está pensada para que cada equipo combine sus habilidades, ideas y enfoques para proponer una solución sólida, creativa y aplicable.</p>",
    "<p>Además, ya pueden conocer más sobre los premios de la hackathon en el sitio web:</p>",
    `<p><a href="https://${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a></p>`,
    "<p>Los premios están construidos alrededor de la lógica ABC: Asesoría y mentoría 1:1, Business connections y Colaboración HTC Ecosystem. Con esto, buscamos que esta experiencia les abra puertas, conexiones y acompañamiento para seguir desarrollando sus ideas más allá del evento.</p>",
    "<p>Por ahora, les pedimos estar atentos a las próximas indicaciones del evento y a nuestras redes sociales. Muy pronto recibirán más detalles sobre dinámica, horarios y siguientes pasos.</p>",
    "<p>Cualquier consulta pueden responder a este correo.</p>",
    "<p>Nos vemos pronto en HTC Vol. 1.</p>",
    "<p>Saludos,<br />C3 + Poliédrica</p>",
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
    throw new Error("No se puede enviar: el representante no tiene un correo válido.");
  }

  for (const member of registration.members) {
    if (!isValidEmail(member.email)) {
      throw new Error(
        `No se puede enviar: ${memberDisplayName(member) || "un integrante"} no tiene correo válido.`,
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
    getHackathonEmailStatusEntry(registration.emailStatus, "challenge_assigned")?.status ===
      "sent" &&
    !input.confirmResend
  ) {
    throw new Error(
      "Este correo de reto asignado ya fue enviado. Confirma el reenvío para continuar.",
    );
  }

  const challenges = await registrationRepository.getChallenges();
  const { assignedChallenge } = validateChallengeAssignedEmailRegistration(
    registration,
    challenges,
  );
  const { to, cc: teamCc } = buildTeamEmailRecipients(registration);
  const cc = buildChallengeAndFinalEmailCc(teamCc);
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
        emailType: "challenge_assigned",
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
    "challenge_assigned",
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

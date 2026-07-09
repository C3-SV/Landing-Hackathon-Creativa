"use client";

import { useState } from "react";
import {
  buildTeamEmailRecipients,
  CHALLENGE_ASSIGNED_SUBJECT,
  memberDisplayName,
  resolveAssignedChallenge,
} from "@/lib/email/team-email";
import { parseJsonResponse } from "@/lib/http";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";
import type {
  Challenge,
  CodeOfConductAcceptance,
  EmailLog,
  RegistrationStatus,
  TeamConsents,
  TeamRegistrationDoc,
} from "@/lib/types/domain";
import {
  AlertState,
  Badge,
  Button,
  Card,
  DataLabel,
  Label,
  Select,
  Textarea,
} from "@/lib/ui";
import {
  formatDateTime,
  getRepresentativeMember,
  registrationStatusLabel,
  roleLabel,
} from "@/lib/utils";

type RegistrationDetailProps = {
  registration: TeamRegistrationDoc;
  challenges: Challenge[];
  emailLogs: EmailLog[];
  codeOfConductAcceptance: CodeOfConductAcceptance | null;
  acceptedEmailSummary: {
    subject: string;
    representativeName: string;
    to: string;
    cc: string[];
    attachmentCount: number;
    notificationsEnabled: boolean;
    error: string | null;
  };
  finalInstructionsEmailSummary: {
    subject: string;
    codeOfConductStatus: string;
    codeOfConductSentAt: string | null;
    codeOfConductAcceptedAt: string | null;
    codeOfConductAcceptedBy: string | null;
    notificationsEnabled: boolean;
  };
  emailNotificationsEnabled: boolean;
};

type ConsentColumn = {
  key: keyof TeamConsents;
  label: string;
};

const CONSENT_COLUMNS: ConsentColumn[] = [
  { key: "acceptCodeOfConduct", label: "Conducta" },
  { key: "acceptPrivacyPolicy", label: "Privacidad" },
  { key: "mediaConsent", label: "Media" },
  { key: "dataSharingConsent", label: "Compartir datos" },
  { key: "authorizationDeclaration", label: "Autorización" },
];

function emailStatusLabel(status: string | undefined) {
  switch (status) {
    case "sent":
      return "Enviado";
    case "failed":
      return "Falló";
    case "dry_run":
      return "Simulación";
    case "not_sent":
    default:
      return "No enviado";
  }
}

function emailTypeLabel(emailType: EmailLog["emailType"]) {
  if (emailType === "challenge_assigned") {
    return "Reto asignado";
  }

  if (emailType === "final_instructions") {
    return "Indicaciones finales";
  }

  return "Team Accepted + Código de Conducta";
}

function emailStatusClassName(status: string | undefined) {
  switch (status) {
    case "sent":
      return "border-status-approved/50 bg-status-approved/20 text-status-approved";
    case "failed":
      return "border-status-rejected/50 bg-status-rejected/20 text-status-rejected";
    case "dry_run":
      return "border-brand-orange-soft/50 bg-brand-orange-soft/20 text-brand-orange-soft";
    default:
      return "border-brand-electric/30 bg-brand-surface text-brand-muted";
  }
}

function codeOfConductStatusLabel(acceptance: CodeOfConductAcceptance | null) {
  if (acceptance?.status === "accepted") {
    return "Aceptado";
  }

  if (acceptance?.sentAt) {
    return "Enviado";
  }

  return "Pendiente";
}

function ConsentMark({ value }: { value: boolean }) {
  if (value) {
    return <span className="font-mono text-lg text-brand-electric">✓</span>;
  }

  return <span className="font-mono text-base text-brand-muted">—</span>;
}

function buildChallengeAssignedEmailSummary(
  registration: TeamRegistrationDoc,
  challenges: readonly Challenge[],
  notificationsEnabled: boolean,
) {
  const assignedChallengeFallback = registration.assignedChallengeId
    ? challenges.find((challenge) => challenge.id === registration.assignedChallengeId)?.name ??
      registration.assignedChallengeId
    : "Sin asignar";
  const base = {
    subject: CHALLENGE_ASSIGNED_SUBJECT,
    representativeName: "Sin representante",
    to: "",
    cc: [] as string[],
    assignedChallengeName: assignedChallengeFallback,
    notificationsEnabled,
    error: null as string | null,
  };

  try {
    const { representative, to, cc } = buildTeamEmailRecipients(registration);
    const assignedChallenge = resolveAssignedChallenge(registration, challenges);

    return {
      ...base,
      representativeName: memberDisplayName(representative),
      to,
      cc,
      assignedChallengeName: assignedChallenge.name,
    };
  } catch (error) {
    return {
      ...base,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo preparar el resumen del correo de reto asignado.",
    };
  }
}

function buildFinalInstructionsReadiness(
  registration: TeamRegistrationDoc,
  challenges: readonly Challenge[],
) {
  const assignedChallengeFallback = registration.assignedChallengeId
    ? challenges.find((challenge) => challenge.id === registration.assignedChallengeId)?.name ??
      registration.assignedChallengeId
    : "Sin asignar";

  if (registration.status !== "approved") {
    return {
      assignedChallengeName: assignedChallengeFallback,
      error:
        "No se puede enviar indicaciones finales: primero marca el equipo como aprobado y guarda los cambios.",
    };
  }

  try {
    const assignedChallenge = resolveAssignedChallenge(registration, challenges);
    buildTeamEmailRecipients(registration);

    return {
      assignedChallengeName: assignedChallenge.name,
      error: null,
    };
  } catch (error) {
    return {
      assignedChallengeName: assignedChallengeFallback,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo preparar el correo de indicaciones finales.",
    };
  }
}

export function RegistrationDetail({
  registration,
  challenges,
  emailLogs: initialEmailLogs,
  codeOfConductAcceptance: initialCodeOfConductAcceptance,
  acceptedEmailSummary,
  finalInstructionsEmailSummary,
  emailNotificationsEnabled,
}: RegistrationDetailProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));
  const [current, setCurrent] = useState(registration);
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [assignedChallengeId, setAssignedChallengeId] = useState(
    registration.assignedChallengeId ?? "",
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailLogs, setEmailLogs] = useState(initialEmailLogs);
  const [codeOfConductAcceptance, setCodeOfConductAcceptance] = useState(
    initialCodeOfConductAcceptance,
  );
  const [confirmAcceptedOpen, setConfirmAcceptedOpen] = useState(false);
  const [confirmChallengeAssignedOpen, setConfirmChallengeAssignedOpen] = useState(false);
  const [confirmFinalInstructionsOpen, setConfirmFinalInstructionsOpen] = useState(false);
  const [sendingAccepted, setSendingAccepted] = useState(false);
  const [sendingChallengeAssigned, setSendingChallengeAssigned] = useState(false);
  const [sendingFinalInstructions, setSendingFinalInstructions] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const representative = getRepresentativeMember(current.members);
  const acceptedStatus = current.emailStatus?.accepted?.status ?? "not_sent";
  const acceptedLastSentAt = current.emailStatus?.accepted?.lastSentAt;
  const challengeAssignedStatus =
    current.emailStatus?.challengeAssigned?.status ?? "not_sent";
  const challengeAssignedLastSentAt =
    current.emailStatus?.challengeAssigned?.lastSentAt;
  const finalInstructionsStatus =
    current.emailStatus?.finalInstructions?.status ?? "not_sent";
  const finalInstructionsLastSentAt =
    current.emailStatus?.finalInstructions?.lastSentAt;
  const codeOfConductDisplayStatus = codeOfConductStatusLabel(codeOfConductAcceptance);
  const challengeAssignedEmailSummary = buildChallengeAssignedEmailSummary(
    current,
    challenges,
    emailNotificationsEnabled,
  );
  const finalInstructionsReadiness = buildFinalInstructionsReadiness(
    current,
    challenges,
  );

  async function saveChanges() {
    setSaving(true);
    setFeedback(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/registrations/${registration.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          assignedChallengeId,
          note: note.trim() || undefined,
        }),
      });
      const payload = await parseJsonResponse<{ registration: TeamRegistrationDoc }>(
        response,
      );
      setCurrent(payload.registration);
      setStatus(payload.registration.status);
      setAssignedChallengeId(payload.registration.assignedChallengeId ?? "");
      setFeedback("Cambios guardados correctamente.");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function sendAcceptedEmail() {
    setSendingAccepted(true);
    setFeedback(null);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/registrations/${registration.id}/send-accepted-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confirmResend: acceptedStatus === "sent",
          }),
        },
      );
      const payload = await parseJsonResponse<{
        registration: TeamRegistrationDoc;
        emailLogs: EmailLog[];
        status: "sent" | "failed" | "dry_run";
        errorMessage?: string | null;
      }>(response);
      setCurrent(payload.registration);
      setEmailLogs(payload.emailLogs);
      if (payload.status === "failed") {
        setError(payload.errorMessage ?? "Brevo no pudo enviar el correo de aceptación.");
      } else {
        setFeedback(
          payload.status === "dry_run"
            ? "Correo de aceptación simulado. EMAIL_NOTIFICATIONS_ENABLED está apagado."
            : "Correo de aceptación enviado correctamente.",
        );
        setConfirmAcceptedOpen(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el correo de aceptación",
      );
    } finally {
      setSendingAccepted(false);
    }
  }

  async function sendChallengeAssignedEmail() {
    setSendingChallengeAssigned(true);
    setFeedback(null);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/registrations/${registration.id}/send-challenge-assigned-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confirmResend: challengeAssignedStatus === "sent",
          }),
        },
      );
      const payload = await parseJsonResponse<{
        registration: TeamRegistrationDoc;
        emailLogs: EmailLog[];
        status: "sent" | "failed" | "dry_run";
        errorMessage?: string | null;
      }>(response);
      setCurrent(payload.registration);
      setEmailLogs(payload.emailLogs);
      if (payload.status === "failed") {
        setError(payload.errorMessage ?? "Brevo no pudo enviar el correo de reto asignado.");
      } else {
        setFeedback(
          payload.status === "dry_run"
            ? "Correo de reto asignado simulado. EMAIL_NOTIFICATIONS_ENABLED está apagado."
            : "Correo de reto asignado enviado correctamente.",
        );
        setConfirmChallengeAssignedOpen(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el correo de reto asignado",
      );
    } finally {
      setSendingChallengeAssigned(false);
    }
  }

  async function sendFinalInstructionsEmail() {
    if (finalInstructionsReadiness.error) {
      setFeedback(null);
      setError(finalInstructionsReadiness.error);
      return;
    }

    setSendingFinalInstructions(true);
    setFeedback(null);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/registrations/${registration.id}/send-final-instructions-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confirmResend: finalInstructionsStatus === "sent",
          }),
        },
      );
      const payload = await parseJsonResponse<{
        registration: TeamRegistrationDoc;
        acceptance: CodeOfConductAcceptance;
        emailLogs: EmailLog[];
        status: "sent" | "failed" | "dry_run";
        errorMessage?: string | null;
      }>(response);
      setCurrent(payload.registration);
      setCodeOfConductAcceptance(payload.acceptance);
      setEmailLogs(payload.emailLogs);
      if (payload.status === "failed") {
        setError(
          payload.errorMessage ?? "Brevo no pudo enviar el correo de indicaciones finales.",
        );
      } else {
        setFeedback(
          payload.status === "dry_run"
            ? "Correo de indicaciones finales simulado. EMAIL_NOTIFICATIONS_ENABLED está apagado."
            : "Correo de indicaciones finales enviado correctamente.",
        );
        setConfirmFinalInstructionsOpen(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el correo de indicaciones finales",
      );
    } finally {
      setSendingFinalInstructions(false);
    }
  }

  return (
    <div className="space-y-4">
      {feedback ? <AlertState title="Actualización" description={feedback} /> : null}
      {error ? <AlertState title="Error" description={error} variant="error" /> : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-base uppercase text-brand-white sm:text-lg">
            {current.teamName}
          </h1>
          <Badge variant={current.status}>{registrationStatusLabel(current.status)}</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              Resumen del equipo
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <DataLabel label="Institución" value={current.institution} />
              <DataLabel label="Tamaño" value={`${current.teamSize} integrantes`} />
              <DataLabel label="Canal" value={current.source || "-"} />
              <DataLabel label="Inscripción" value={formatDateTime(current.createdAt)} />
              <DataLabel label="Última actualización" value={formatDateTime(current.updatedAt)} />
              <DataLabel
                label="Reto asignado"
                value={
                  current.assignedChallengeId
                    ? challengeMap.get(current.assignedChallengeId) ?? current.assignedChallengeId
                    : "Sin asignar"
                }
              />
              <DataLabel
                label="Representante"
                value={
                  representative
                    ? `${representative.firstName} ${representative.lastName}`
                    : "Sin definir"
                }
              />
              <DataLabel label="Correo representante" value={representative?.email ?? "-"} />
              <DataLabel label="Teléfono representante" value={representative?.phone ?? "-"} />
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">
                Descripción del equipo
              </p>
              <p className="mt-1 text-sm text-brand-white/90">{current.teamDescription || "-"}</p>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-brand-electric/25 bg-brand-bg/35 p-3">
            <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              Preferencias de retos
            </h2>
            <ul className="grid gap-2 text-sm text-brand-muted">
              {current.challengePreferences.map((challengeId, index) => {
                const challengeName = challengeMap.get(challengeId) ?? challengeId;
                return (
                  <li key={`${challengeId}-${index}`} className="flex gap-2">
                    <span className="font-mono text-brand-orange-soft">#{index + 1}</span>
                    <span>{challengeName}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </Card>

      <Card className="grid gap-4 lg:grid-cols-3">
        <h2 className="lg:col-span-3 font-mono text-xs uppercase tracking-wide text-brand-electric">
          Acciones admin
        </h2>
        <div>
          <Label htmlFor="status">Cambiar estado</Label>
          <Select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as RegistrationStatus)}
          >
            {REGISTRATION_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {registrationStatusLabel(value)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="assignedChallenge">Asignar reto final (opcional)</Label>
          <Select
            id="assignedChallenge"
            value={assignedChallengeId}
            onChange={(event) => setAssignedChallengeId(event.target.value)}
          >
            <option value="">Sin asignar</option>
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="lg:col-span-3">
          <Label htmlFor="internalNote">Nota interna</Label>
          <Textarea
            id="internalNote"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Agregar comentario para el equipo organizador..."
          />
        </div>
        <div className="lg:col-span-3">
          <Button type="button" onClick={saveChanges} disabled={saving}>
            {saving ? "Guardando..." : "Guardar acciones admin"}
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Flujo de correos
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              step: "1",
              label: "Team Accepted + Código de Conducta",
              status: acceptedStatus,
              date: acceptedLastSentAt,
            },
            {
              step: "2",
              label: "Reto asignado",
              status: challengeAssignedStatus,
              date: challengeAssignedLastSentAt,
            },
            {
              step: "3",
              label: "Indicaciones finales",
              status: finalInstructionsStatus,
              date: finalInstructionsLastSentAt,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-brand-electric/20 bg-brand-bg/35 p-3"
            >
              <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                Paso {item.step}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-white">{item.label}</p>
              <span
                className={`mt-3 inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${emailStatusClassName(
                  item.status,
                )}`}
              >
                {emailStatusLabel(item.status)}
              </span>
              {item.date ? (
                <p className="mt-2 text-xs text-brand-muted">{formatDateTime(item.date)}</p>
              ) : null}
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-brand-orange-soft/25 bg-brand-bg/35 p-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
            Código de conducta
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${
                codeOfConductAcceptance?.status === "accepted"
                  ? "border-status-approved/50 bg-status-approved/20 text-status-approved"
                  : codeOfConductAcceptance?.sentAt
                    ? "border-brand-orange-soft/50 bg-brand-orange-soft/20 text-brand-orange-soft"
                    : "border-brand-electric/30 bg-brand-surface text-brand-muted"
              }`}
            >
              {codeOfConductDisplayStatus}
            </span>
            {codeOfConductAcceptance?.acceptedAt ? (
              <span className="text-xs text-brand-muted">
                {formatDateTime(codeOfConductAcceptance.acceptedAt)}
              </span>
            ) : null}
            {codeOfConductAcceptance?.acceptedByName ? (
              <span className="text-xs text-brand-muted">
                Confirmó: {codeOfConductAcceptance.acceptedByName}
              </span>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              Correo de reto asignado
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide ${emailStatusClassName(
                  challengeAssignedStatus,
                )}`}
              >
                {emailStatusLabel(challengeAssignedStatus)}
              </span>
              {challengeAssignedLastSentAt ? (
                <span className="text-sm text-brand-muted">
                  Último intento: {formatDateTime(challengeAssignedLastSentAt)}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant={challengeAssignedStatus === "sent" ? "secondary" : "primary"}
            onClick={() => setConfirmChallengeAssignedOpen(true)}
            disabled={sendingChallengeAssigned || Boolean(challengeAssignedEmailSummary.error)}
          >
            {challengeAssignedStatus === "sent"
              ? "Reenviar correo de reto asignado"
              : "Enviar correo de reto asignado"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DataLabel
            label="Reto asignado actual"
            value={challengeAssignedEmailSummary.assignedChallengeName}
          />
          <DataLabel label="Asunto" value={challengeAssignedEmailSummary.subject} />
        </div>

        {challengeAssignedEmailSummary.error ? (
          <AlertState
            title="Envío bloqueado"
            description={challengeAssignedEmailSummary.error}
            variant="error"
          />
        ) : null}

        {challengeAssignedStatus === "sent" ? (
          <AlertState
            title="Reenvío"
            description="Este correo ya fue enviado. Si lo reenvías, se guardará un nuevo log."
            variant="warning"
          />
        ) : null}

        {!emailNotificationsEnabled ? (
          <AlertState
            title="Envío real desactivado"
            description="EMAIL_NOTIFICATIONS_ENABLED no está en true. Se guardará un log dry_run sin llamar a Brevo."
            variant="warning"
          />
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              Correo de indicaciones finales
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide ${emailStatusClassName(
                  finalInstructionsStatus,
                )}`}
              >
                {emailStatusLabel(finalInstructionsStatus)}
              </span>
              {finalInstructionsLastSentAt ? (
                <span className="text-sm text-brand-muted">
                  Último intento: {formatDateTime(finalInstructionsLastSentAt)}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant={finalInstructionsStatus === "sent" ? "secondary" : "primary"}
            onClick={() => setConfirmFinalInstructionsOpen(true)}
            disabled={sendingFinalInstructions || Boolean(finalInstructionsReadiness.error)}
          >
            {finalInstructionsStatus === "sent"
              ? "Reenviar indicaciones finales"
              : "Enviar indicaciones finales"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DataLabel label="Asunto" value={finalInstructionsEmailSummary.subject} />
          <DataLabel
            label="Reto asignado"
            value={finalInstructionsReadiness.assignedChallengeName}
          />
        </div>

        {finalInstructionsReadiness.error ? (
          <AlertState
            title="Envío bloqueado"
            description={finalInstructionsReadiness.error}
            variant="error"
          />
        ) : null}

        {finalInstructionsStatus === "sent" ? (
          <AlertState
            title="Reenvío"
            description="Este correo ya fue enviado. Si lo reenvías, se guardará un nuevo log sin tocar el estado del Código de Conducta."
            variant="warning"
          />
        ) : null}

        {!emailNotificationsEnabled ? (
          <AlertState
            title="Envío real desactivado"
            description="EMAIL_NOTIFICATIONS_ENABLED no está en true. Se guardará un log dry_run sin llamar a Brevo."
            variant="warning"
          />
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              Correo de aceptación + Código de Conducta
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide ${emailStatusClassName(
                  acceptedStatus,
                )}`}
              >
                {emailStatusLabel(acceptedStatus)}
              </span>
              {acceptedLastSentAt ? (
                <span className="text-sm text-brand-muted">
                  Último intento: {formatDateTime(acceptedLastSentAt)}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant={acceptedStatus === "sent" ? "secondary" : "primary"}
            onClick={() => setConfirmAcceptedOpen(true)}
            disabled={sendingAccepted || Boolean(acceptedEmailSummary.error)}
          >
            {acceptedStatus === "sent"
              ? "Reenviar correo de aceptación"
              : "Enviar correo de aceptación"}
          </Button>
        </div>

        {acceptedEmailSummary.error ? (
          <AlertState
            title="Falta configuración"
            description={acceptedEmailSummary.error}
            variant="error"
          />
        ) : null}

        {acceptedStatus === "sent" ? (
          <AlertState
            title="Reenvío"
            description="Este correo ya fue enviado. Si lo reenvías, se guardará un nuevo log."
            variant="warning"
          />
        ) : null}

        {!emailNotificationsEnabled ? (
          <AlertState
            title="Envío real desactivado"
            description="EMAIL_NOTIFICATIONS_ENABLED no está en true. El flujo generará adjuntos y guardará un log dry_run sin llamar a Brevo."
            variant="warning"
          />
        ) : null}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Integrantes
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {current.members.map((member, index) => (
            <div
              key={`${member.role3H}-${member.email}-${index}`}
              className="rounded-xl border border-brand-electric/20 bg-brand-bg/45 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
                  {roleLabel(member.role3H)}
                </p>
                {member.isRepresentative ? <Badge variant="approved">Representante</Badge> : null}
              </div>
              <p className="mt-1 text-brand-white">
                {member.firstName} {member.lastName}
              </p>
              {member.preferredName ? (
                <p className="text-sm text-brand-muted">Prefiere: {member.preferredName}</p>
              ) : null}
              <p className="text-sm text-brand-muted">{member.email}</p>
              <p className="text-sm text-brand-muted">{member.phone}</p>
              <div className="mt-3 grid gap-1 text-xs text-brand-muted">
                <p>
                  <span className="font-mono uppercase tracking-wide text-brand-electric">
                    Afiliación:
                  </span>{" "}
                  {member.affiliationType}
                </p>
                <p>
                  <span className="font-mono uppercase tracking-wide text-brand-electric">
                    Institución:
                  </span>{" "}
                  {member.institution}
                </p>
                <p>
                  <span className="font-mono uppercase tracking-wide text-brand-electric">
                    Área:
                  </span>{" "}
                  {member.degreeOrMajor}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono uppercase text-brand-electric hover:text-brand-white"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {member.githubUrl ? (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono uppercase text-brand-electric hover:text-brand-white"
                  >
                    GitHub
                  </a>
                ) : null}
                {member.portfolioUrl ? (
                  <a
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono uppercase text-brand-electric hover:text-brand-white"
                  >
                    Portfolio
                  </a>
                ) : null}
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-brand-electric">
                Cuéntanos de ti
              </p>
              <p className="mt-1 text-sm text-brand-white/90">{member.about}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Historial de correos
        </h2>
        {emailLogs.length === 0 ? (
          <p className="text-sm text-brand-muted">Sin correos registrados todavía.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-brand-electric/20 bg-brand-bg/35">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-electric/20 bg-brand-bg/55 font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">To</th>
                  <th className="px-3 py-2 font-medium">CC</th>
                  <th className="px-3 py-2 font-medium">Asunto</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map((log) => (
                  <tr key={log.id} className="border-b border-brand-electric/10 last:border-b-0">
                    <td className="px-3 py-2 font-mono uppercase text-brand-electric">
                      {emailTypeLabel(log.emailType)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${emailStatusClassName(
                          log.status,
                        )}`}
                      >
                        {emailStatusLabel(log.status)}
                      </span>
                      {log.errorMessage ? (
                        <p className="mt-1 max-w-sm text-xs text-brand-action">
                          {log.errorMessage}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-brand-muted">{formatDateTime(log.sentAt)}</td>
                    <td className="px-3 py-2 text-brand-white">{log.to[0] ?? "-"}</td>
                    <td className="px-3 py-2 text-brand-muted">{log.cc.length}</td>
                    <td className="px-3 py-2 text-brand-muted">{log.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Consentimientos
        </h2>
        <div className="overflow-x-auto rounded-xl border border-brand-electric/20 bg-brand-bg/35">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="border-b border-brand-electric/20 bg-brand-bg/55 font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                {CONSENT_COLUMNS.map((column) => (
                  <th key={column.key} className="px-3 py-2 text-center font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {CONSENT_COLUMNS.map((column) => (
                  <td key={column.key} className="px-3 py-3 text-center">
                    <ConsentMark value={Boolean(current.consents[column.key])} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Notas internas
        </h2>
        {current.adminNotes.length === 0 ? (
          <p className="text-sm text-brand-muted">Sin notas todavía.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {current.adminNotes.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-brand-electric/20 bg-brand-bg/45 p-3"
              >
                <p className="text-brand-white">{item.message}</p>
                <p className="mt-1 text-xs text-brand-muted">
                  {item.authorEmail} · {formatDateTime(item.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {confirmAcceptedOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/85 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="accepted-email-confirm-title"
            className="w-full max-w-2xl rounded-2xl border border-brand-electric/35 bg-brand-surface p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="accepted-email-confirm-title"
                  className="font-display text-base uppercase text-brand-white"
                >
                  Confirmar Team Accepted + Código de Conducta
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Se enviará un solo correo al representante del equipo.
                </p>
              </div>
              <button
                type="button"
                className="font-mono text-xs uppercase text-brand-muted hover:text-brand-white"
                onClick={() => setConfirmAcceptedOpen(false)}
                disabled={sendingAccepted}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DataLabel label="Equipo" value={current.teamName} />
              <DataLabel
                label="Representante"
                value={`${acceptedEmailSummary.representativeName} · ${acceptedEmailSummary.to}`}
              />
              <DataLabel label="Asunto" value={acceptedEmailSummary.subject} />
              <DataLabel label="Adjuntos" value={`${acceptedEmailSummary.attachmentCount} JPG`} />
              <DataLabel
                className="sm:col-span-2"
                label="CC"
                value={
                  acceptedEmailSummary.cc.length
                    ? acceptedEmailSummary.cc.join(", ")
                    : "Sin copias"
                }
              />
            </div>

            {acceptedStatus === "sent" ? (
              <div className="mt-4">
                <AlertState
                  title="Advertencia"
                  description="Este equipo ya tiene un correo de aceptación enviado. Confirmar creará un nuevo envío/log para el correo 1."
                  variant="warning"
                />
              </div>
            ) : null}

            {!emailNotificationsEnabled ? (
              <div className="mt-4">
                <AlertState
                  title="Simulación"
                  description="EMAIL_NOTIFICATIONS_ENABLED está apagado. No se enviará correo real por Brevo."
                  variant="warning"
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmAcceptedOpen(false)}
                disabled={sendingAccepted}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={sendAcceptedEmail} disabled={sendingAccepted}>
                {sendingAccepted ? "Enviando..." : "Confirmar envío"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmChallengeAssignedOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/85 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="challenge-email-confirm-title"
            className="w-full max-w-2xl rounded-2xl border border-brand-electric/35 bg-brand-surface p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="challenge-email-confirm-title"
                  className="font-display text-base uppercase text-brand-white"
                >
                  Confirmar correo de reto asignado
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Se enviará un solo correo al representante del equipo.
                </p>
              </div>
              <button
                type="button"
                className="font-mono text-xs uppercase text-brand-muted hover:text-brand-white"
                onClick={() => setConfirmChallengeAssignedOpen(false)}
                disabled={sendingChallengeAssigned}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DataLabel label="Equipo" value={current.teamName} />
              <DataLabel
                label="Reto asignado"
                value={challengeAssignedEmailSummary.assignedChallengeName}
              />
              <DataLabel
                label="Representante"
                value={`${challengeAssignedEmailSummary.representativeName} · ${challengeAssignedEmailSummary.to}`}
              />
              <DataLabel label="Asunto" value={challengeAssignedEmailSummary.subject} />
              <DataLabel
                className="sm:col-span-2"
                label="CC"
                value={
                  challengeAssignedEmailSummary.cc.length
                    ? challengeAssignedEmailSummary.cc.join(", ")
                    : "Sin copias"
                }
              />
            </div>

            {challengeAssignedStatus === "sent" ? (
              <div className="mt-4">
                <AlertState
                  title="Advertencia"
                  description="Este equipo ya tiene un correo de reto asignado enviado. Confirmar creará un nuevo envío/log."
                  variant="warning"
                />
              </div>
            ) : null}

            {!emailNotificationsEnabled ? (
              <div className="mt-4">
                <AlertState
                  title="Simulación"
                  description="EMAIL_NOTIFICATIONS_ENABLED está apagado. No se enviará correo real por Brevo."
                  variant="warning"
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmChallengeAssignedOpen(false)}
                disabled={sendingChallengeAssigned}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={sendChallengeAssignedEmail}
                disabled={sendingChallengeAssigned}
              >
                {sendingChallengeAssigned ? "Enviando..." : "Confirmar envío"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmFinalInstructionsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/85 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="final-instructions-confirm-title"
            className="w-full max-w-2xl rounded-2xl border border-brand-electric/35 bg-brand-surface p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="final-instructions-confirm-title"
                  className="font-display text-base uppercase text-brand-white"
                >
                  Confirmar indicaciones finales
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Se enviará el correo 3 con bienvenida, reglamento, WhatsApp y logística.
                </p>
              </div>
              <button
                type="button"
                className="font-mono text-xs uppercase text-brand-muted hover:text-brand-white"
                onClick={() => setConfirmFinalInstructionsOpen(false)}
                disabled={sendingFinalInstructions}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DataLabel label="Equipo" value={current.teamName} />
              <DataLabel label="Asunto" value={finalInstructionsEmailSummary.subject} />
              <DataLabel
                label="Reto asignado"
                value={finalInstructionsReadiness.assignedChallengeName}
              />
            </div>

            {finalInstructionsReadiness.error ? (
              <div className="mt-4">
                <AlertState
                  title="Envío bloqueado"
                  description={finalInstructionsReadiness.error}
                  variant="error"
                />
              </div>
            ) : null}

            {finalInstructionsStatus === "sent" ? (
              <div className="mt-4">
                <AlertState
                  title="Advertencia"
                  description="Este equipo ya tiene indicaciones finales enviadas. Confirmar creará un nuevo envío/log."
                  variant="warning"
                />
              </div>
            ) : null}

            {!emailNotificationsEnabled ? (
              <div className="mt-4">
                <AlertState
                  title="Simulación"
                  description="EMAIL_NOTIFICATIONS_ENABLED está apagado. No se enviará correo real por Brevo."
                  variant="warning"
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmFinalInstructionsOpen(false)}
                disabled={sendingFinalInstructions}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={sendFinalInstructionsEmail}
                disabled={sendingFinalInstructions || Boolean(finalInstructionsReadiness.error)}
              >
                {sendingFinalInstructions ? "Enviando..." : "Confirmar envío"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

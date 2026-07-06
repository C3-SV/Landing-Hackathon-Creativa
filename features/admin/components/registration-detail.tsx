"use client";

import { useState } from "react";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";
import type {
  Challenge,
  RegistrationStatus,
  TeamConsents,
  TeamRegistrationDoc,
} from "@/lib/types/domain";
import { parseJsonResponse } from "@/lib/http";
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

function ConsentMark({ value }: { value: boolean }) {
  if (value) {
    return <span className="font-mono text-lg text-brand-electric">✓</span>;
  }

  return <span className="font-mono text-base text-brand-muted">—</span>;
}

export function RegistrationDetail({
  registration,
  challenges,
}: RegistrationDetailProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));
  const [current, setCurrent] = useState(registration);
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [assignedChallengeId, setAssignedChallengeId] = useState(
    registration.assignedChallengeId ?? "",
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const representative = getRepresentativeMember(current.members);

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
                  <span className="font-mono uppercase tracking-wide text-brand-electric">Afiliación:</span>{" "}
                  {member.affiliationType}
                </p>
                <p>
                  <span className="font-mono uppercase tracking-wide text-brand-electric">Institución:</span>{" "}
                  {member.institution}
                </p>
                <p>
                  <span className="font-mono uppercase tracking-wide text-brand-electric">Área:</span>{" "}
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
    </div>
  );
}

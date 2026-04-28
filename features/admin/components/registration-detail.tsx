"use client";

import { useState } from "react";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";
import type {
  Challenge,
  RegistrationStatus,
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
import { formatDateTime, getRepresentativeMember, roleLabel } from "@/lib/utils";

type RegistrationDetailProps = {
  registration: TeamRegistrationDoc;
  challenges: Challenge[];
};

export function RegistrationDetail({
  registration,
  challenges,
}: RegistrationDetailProps) {
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
          assignedChallengeId: assignedChallengeId || undefined,
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

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-base uppercase text-brand-white sm:text-lg">
            {current.teamName}
          </h1>
          <Badge variant={current.status}>{current.status}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DataLabel label="Institución" value={current.institution} />
          <DataLabel label="Tamaño equipo" value={`${current.teamSize} integrantes`} />
          <DataLabel label="Canal" value={current.source || "-"} />
          <DataLabel label="Enviado" value={formatDateTime(current.createdAt)} />
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
      </Card>

      <Card className="grid gap-4 lg:grid-cols-3">
        <div>
          <Label htmlFor="status">Cambiar estado</Label>
          <Select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as RegistrationStatus)}
          >
            {REGISTRATION_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
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
          Preferencias de reto
        </h2>
        <ul className="grid gap-2 text-sm text-brand-muted">
          {current.challengePreferences.map((challengeId, index) => {
            const challengeName =
              challenges.find((challenge) => challenge.id === challengeId)?.name ??
              challengeId;
            return (
              <li key={`${challengeId}-${index}`} className="flex gap-2">
                <span className="font-mono text-brand-orange-soft">#{index + 1}</span>
                <span>{challengeName}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Integrantes 3H
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
              <p className="text-sm text-brand-muted">{member.email}</p>
              <p className="text-sm text-brand-muted">{member.phone}</p>
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
        <div className="grid gap-2 text-sm text-brand-muted">
          <DataLabel
            label="Código de conducta"
            value={current.consents.acceptCodeOfConduct ? "Sí" : "No"}
          />
          <DataLabel
            label="Privacidad"
            value={current.consents.acceptPrivacyPolicy ? "Sí" : "No"}
          />
          <DataLabel
            label="Consentimiento de media"
            value={current.consents.mediaConsent ? "Sí" : "No"}
          />
          <DataLabel
            label="Compartir datos"
            value={current.consents.dataSharingConsent ? "Sí" : "No"}
          />
          <DataLabel
            label="Declaración autorización"
            value={current.consents.authorizationDeclaration ? "Sí" : "No"}
          />
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


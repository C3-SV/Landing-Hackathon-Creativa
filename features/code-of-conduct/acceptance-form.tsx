"use client";

import { useState } from "react";
import Link from "next/link";
import { codeOfConductSections } from "@/lib/code-of-conduct/content";
import { parseJsonResponse } from "@/lib/http";
import type { CodeOfConductAcceptance } from "@/lib/types/domain";
import { AlertState, Button, Card, Checkbox, FieldError, Input, Label, Select } from "@/lib/ui";
import { formatDateTime } from "@/lib/utils";

type AcceptanceFormProps = {
  token: string;
  acceptance: CodeOfConductAcceptance;
};

type FormErrors = Partial<Record<"name" | "email" | "role" | "confirmed", string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function AcceptedState({ acceptance }: { acceptance: CodeOfConductAcceptance }) {
  return (
    <Card className="space-y-4">
      <AlertState
        title="Código de Conducta confirmado"
        description="Este equipo ya confirmó el Código de Conducta."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">Equipo</p>
          <p className="mt-1 text-brand-white">{acceptance.teamName}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">
            Fecha de aceptación
          </p>
          <p className="mt-1 text-brand-white">
            {acceptance.acceptedAt ? formatDateTime(acceptance.acceptedAt) : "-"}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">
            Confirmó
          </p>
          <p className="mt-1 text-brand-white">{acceptance.acceptedByName ?? "-"}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">Rol</p>
          <p className="mt-1 text-brand-white">{acceptance.acceptedByRole ?? "-"}</p>
        </div>
      </div>
    </Card>
  );
}

export function CodeOfConductAcceptanceForm({
  token,
  acceptance: initialAcceptance,
}: AcceptanceFormProps) {
  const [acceptance, setAcceptance] = useState(initialAcceptance);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [systemError, setSystemError] = useState<string | null>(null);

  if (acceptance.status === "accepted") {
    return <AcceptedState acceptance={acceptance} />;
  }

  function validate() {
    const nextErrors: FormErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Escribe el nombre de quien confirma.";
    }
    if (!email.trim()) {
      nextErrors.email = "Escribe un correo.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Escribe un correo válido.";
    }
    if (!role) {
      nextErrors.role = "Selecciona el rol dentro del equipo.";
    }
    if (!confirmed) {
      nextErrors.confirmed = "Debes confirmar que el equipo leyó y acepta el código.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitAcceptance() {
    setSystemError(null);
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/code-of-conduct/accept/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptedByName: name.trim(),
          acceptedByEmail: email.trim(),
          acceptedByRole: role,
          confirmed,
        }),
      });
      const payload = await parseJsonResponse<{
        acceptance: CodeOfConductAcceptance;
        status: "accepted" | "already_accepted";
      }>(response);
      setAcceptance(payload.acceptance);
    } catch (error) {
      setSystemError(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar el Código de Conducta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <Card className="space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            Equipo
          </p>
          <h2 className="mt-2 font-display text-base uppercase leading-7 text-brand-white sm:text-lg">
            {acceptance.teamName}
          </h2>
          {acceptance.challengeName ? (
            <p className="mt-2 text-sm text-brand-muted">
              Reto asignado: {acceptance.challengeName}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-brand-electric/25 bg-brand-bg/45 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
            Resumen del Código de Conducta
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-brand-muted sm:grid-cols-2">
            {codeOfConductSections.map((section) => (
              <li key={section.title} className="flex gap-2">
                <span className="text-brand-electric">#</span>
                <span>{section.title}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/codigo-de-conducta"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-brand-electric hover:text-brand-white"
          >
            Leer Código de Conducta completo
          </Link>
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="font-display text-base uppercase leading-7 text-brand-white">
            Confirmar aceptación
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            El capitán o un representante puede confirmar en nombre del equipo.
          </p>
        </div>

        {systemError ? (
          <AlertState title="Error" description={systemError} variant="error" />
        ) : null}

        <div>
          <Label htmlFor="acceptedByName">Nombre de quien confirma</Label>
          <Input
            id="acceptedByName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label htmlFor="acceptedByEmail">Correo de quien confirma</Label>
          <Input
            id="acceptedByEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <Label htmlFor="acceptedByRole">Rol dentro del equipo</Label>
          <Select
            id="acceptedByRole"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Seleccionar rol</option>
            <option value="Capitan">Capitán</option>
            <option value="Integrante">Integrante</option>
          </Select>
          <FieldError message={errors.role} />
        </div>

        <div>
          <Checkbox
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            label="Confirmo que mi equipo leyó y acepta el Código de Conducta de HTC Vol. 1."
          />
          <FieldError message={errors.confirmed} />
        </div>

        <Button type="button" onClick={submitAcceptance} disabled={submitting}>
          {submitting ? "Confirmando..." : "Confirmar aceptación"}
        </Button>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegistrationSettings } from "@/lib/types/domain";
import { parseJsonResponse } from "@/lib/http";
import { AlertState, Button, Card } from "@/lib/ui";
import { cn } from "@/lib/ui/cn";

type RegistrationSettingsSwitchProps = {
  initialSettings: RegistrationSettings;
};

export function RegistrationSettingsSwitch({
  initialSettings,
}: RegistrationSettingsSwitchProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrationsOpen = settings.registrationsOpen;
  const nextOpen = !registrationsOpen;

  async function toggleRegistrations() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/registration-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationsOpen: nextOpen }),
      });
      const payload = await parseJsonResponse<{ settings: RegistrationSettings }>(response);
      setSettings(payload.settings);
      router.refresh();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "No se pudo actualizar el estado de inscripciones.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="space-y-4 border-brand-orange/30 bg-brand-surface/88">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand-electric">
            Control de inscripciones
          </p>
          <h2 className="font-display text-sm uppercase leading-relaxed text-brand-white">
            {registrationsOpen ? "Inscripciones abiertas" : "Inscripciones cerradas"}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-brand-muted">
            {registrationsOpen
              ? "El formulario público está aceptando equipos nuevos."
              : "El formulario público muestra la pantalla de cierre y el API rechaza nuevos envíos."}
          </p>
          {settings.updatedBy ? (
            <p className="font-mono text-xs text-brand-muted">
              Último cambio por {settings.updatedBy}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant={registrationsOpen ? "danger" : "primary"}
          onClick={toggleRegistrations}
          disabled={pending}
          aria-pressed={!registrationsOpen}
          className="min-w-56"
        >
          {pending
            ? "Actualizando..."
            : registrationsOpen
              ? "Cerrar inscripciones"
              : "Abrir inscripciones"}
        </Button>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={registrationsOpen}
        aria-label="Estado de inscripciones"
        onClick={toggleRegistrations}
        disabled={pending}
        className={cn(
          "relative h-8 w-16 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60",
          registrationsOpen
            ? "border-brand-electric bg-brand-electric/30"
            : "border-brand-action bg-brand-action/35",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-brand-white transition",
            registrationsOpen ? "left-9" : "left-1",
          )}
        />
      </button>

      {error ? <AlertState variant="error" title="Error" description={error} /> : null}
    </Card>
  );
}

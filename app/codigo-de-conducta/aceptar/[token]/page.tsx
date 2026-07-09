import type { Metadata } from "next";
import { CodeOfConductDocument } from "@/features/code-of-conduct/code-of-conduct-document";
import { CodeOfConductAcceptanceForm } from "@/features/code-of-conduct/acceptance-form";
import { codeOfConductSummary } from "@/lib/code-of-conduct/content";
import { BRANDING } from "@/lib/constants/branding";
import { registrationRepository } from "@/lib/repositories";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { AlertState, Badge, Card } from "@/lib/ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  path: "/codigo-de-conducta/aceptar",
  title: "Aceptar Código de Conducta | HTC Vol. 1",
  description: codeOfConductSummary,
  indexable: false,
});

type PageProps = {
  params: Promise<{ token: string }>;
};

function StatusPill({ status }: { status: string }) {
  const className =
    status === "accepted"
      ? "border-status-approved/50 bg-status-approved/20 text-status-approved"
      : status === "pending"
        ? "border-brand-orange-soft/50 bg-brand-orange-soft/20 text-brand-orange-soft"
        : status === "expired"
          ? "border-brand-action/60 bg-brand-action/20 text-brand-white"
          : "border-brand-electric/30 bg-brand-surface text-brand-muted";

  const label =
    status === "accepted"
      ? "Aceptado"
      : status === "pending"
        ? "Pendiente"
        : status === "expired"
          ? "Expirado"
          : "Error";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

function InvalidTokenState() {
  return (
    <Card className="mx-auto w-full max-w-[920px] space-y-4">
      <AlertState
        title="Enlace no válido"
        description="Este enlace no es válido. Contactá a la organización."
        variant="error"
      />
    </Card>
  );
}

function ExpiredTokenState() {
  return (
    <Card className="mx-auto w-full max-w-[920px] space-y-4">
      <AlertState
        title="Enlace expirado"
        description="Este enlace expiró. Contactá a la organización para recibir uno nuevo."
        variant="warning"
      />
    </Card>
  );
}

function SystemErrorState() {
  return (
    <Card className="mx-auto w-full max-w-[920px]">
      <AlertState
        title="Error de sistema"
        description="No pudimos cargar la aceptación en este momento. Intentá de nuevo o contactá a la organización."
        variant="error"
      />
    </Card>
  );
}

export default async function AcceptCodeOfConductPage({ params }: PageProps) {
  const { token } = await params;
  let acceptance = null;
  let hasSystemError = false;

  try {
    acceptance = await registrationRepository.getCodeOfConductAcceptanceByToken(token);
  } catch (error) {
    hasSystemError = true;
    console.error("Error cargando aceptación de Código de Conducta", {
      error: error instanceof Error ? error.message : error,
    });
  }

  const pageStatus = hasSystemError
    ? "error"
    : acceptance?.status ?? (acceptance === null ? "invalid" : "pending");

  return (
    <main className="flex-1 overflow-x-hidden bg-brand-bg pb-16 pt-8">
      <section className="container-shell">
        <div className="mx-auto w-full max-w-[920px]">
          <div className="pixel-divider mb-8" />

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge>HTC VOL. 1</Badge>
              <Badge className="border-brand-orange-soft/50 bg-brand-orange-soft/15 text-brand-orange-soft">
                Aceptación por equipo
              </Badge>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-electric">
                {BRANDING.eventName}
              </p>
              <h1 className="max-w-3xl font-display text-2xl uppercase leading-[1.45] text-brand-white sm:text-3xl lg:text-4xl">
                Código de Conducta
              </h1>
              <p className="max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
                Confirmación obligatoria para participar en HTC Vol. 1.
              </p>
            </div>
          </div>

          <Card className="mt-8 space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
                  Equipo
                </p>
                <h2 className="mt-2 font-display text-base uppercase leading-7 text-brand-white sm:text-lg">
                  {acceptance?.teamName ?? "Enlace de equipo"}
                </h2>
                {acceptance?.challengeName ? (
                  <p className="mt-2 text-sm text-brand-muted">
                    Reto asignado: {acceptance.challengeName}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 text-right">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                  Estado del token
                </p>
                <StatusPill status={pageStatus} />
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <CodeOfConductDocument />
          </div>

          {hasSystemError ? <SystemErrorState /> : null}
          {!hasSystemError && !acceptance ? <InvalidTokenState /> : null}
          {!hasSystemError && acceptance?.status === "expired" ? <ExpiredTokenState /> : null}
          {!hasSystemError && acceptance && acceptance.status !== "expired" ? (
            <div className="mt-8">
              <CodeOfConductAcceptanceForm token={token} acceptance={acceptance} />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

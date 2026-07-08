import type { Metadata } from "next";
import Link from "next/link";
import { CodeOfConductAcceptanceForm } from "@/features/code-of-conduct/acceptance-form";
import { codeOfConductSummary } from "@/lib/code-of-conduct/content";
import { BRANDING } from "@/lib/constants/branding";
import { registrationRepository } from "@/lib/repositories";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { AlertState, Badge, ButtonLink, Card } from "@/lib/ui";

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

function InvalidTokenState() {
  return (
    <Card className="mx-auto max-w-2xl space-y-4 text-center">
      <AlertState
        title="Enlace no válido"
        description="Este enlace no es válido. Contactá a la organización."
        variant="error"
      />
      <ButtonLink href="/codigo-de-conducta" variant="secondary">
        Leer Código de Conducta
      </ButtonLink>
    </Card>
  );
}

function ExpiredTokenState() {
  return (
    <Card className="mx-auto max-w-2xl space-y-4 text-center">
      <AlertState
        title="Enlace expirado"
        description="Este enlace expiró. Contactá a la organización para recibir uno nuevo."
        variant="warning"
      />
      <ButtonLink href="/codigo-de-conducta" variant="secondary">
        Leer Código de Conducta
      </ButtonLink>
    </Card>
  );
}

function SystemErrorState() {
  return (
    <Card className="mx-auto max-w-2xl">
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

  return (
    <main className="flex-1 overflow-x-hidden bg-brand-bg pb-16 pt-8">
      <section className="container-shell">
        <div className="pixel-divider mb-8" />
        <div className="mb-8 space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge>HTC VOL. 1</Badge>
            <Badge className="border-brand-orange-soft/50 bg-brand-orange-soft/15 text-brand-orange-soft">
              Aceptación por equipo
            </Badge>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-electric">
              {BRANDING.eventName}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-xl uppercase leading-[1.5] text-brand-white sm:text-3xl">
              Código de Conducta
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted">
              Confirmación obligatoria para participar en HTC Vol. 1.
            </p>
          </div>
        </div>

        {hasSystemError ? <SystemErrorState /> : null}
        {!hasSystemError && !acceptance ? <InvalidTokenState /> : null}
        {!hasSystemError && acceptance?.status === "expired" ? <ExpiredTokenState /> : null}
        {!hasSystemError && acceptance && acceptance.status !== "expired" ? (
          <CodeOfConductAcceptanceForm token={token} acceptance={acceptance} />
        ) : null}

        <div className="mt-8 border-t border-brand-electric/25 pt-6">
          <Link
            href="/codigo-de-conducta"
            className="font-mono text-xs uppercase tracking-wide text-brand-muted hover:text-brand-white"
          >
            Ver Código de Conducta completo
          </Link>
        </div>
      </section>
    </main>
  );
}

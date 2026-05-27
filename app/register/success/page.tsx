import type { Metadata } from "next";
import { BRANDING } from "@/lib/constants/branding";
import { ButtonLink, Card } from "@/lib/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/register/success",
  title: "Inscripcion enviada | Hackathon de Turismo Creativo I",
  description:
    "Confirmacion de envio de inscripcion para el Hackathon de Turismo Creativo I.",
  indexable: false,
});

type SuccessPageProps = {
  searchParams: Promise<{ teamName?: string }>;
};

export default async function RegisterSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const teamName = params.teamName ?? "Tu equipo";

  return (
    <main className="relative left-1/2 right-1/2 flex w-screen -translate-x-1/2 flex-1 overflow-hidden bg-brand-bg py-14 sm:py-18">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <Card className="relative mx-auto max-w-3xl space-y-5 overflow-hidden border-brand-electric/45 bg-brand-surface/90 p-6 text-center shadow-[0_0_0_1px_rgba(26,130,255,0.16)] sm:p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-brand-white/75"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-brand-white/75"
          />
          <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft">
            {"{} INSCRIPCIÓN ENVIADA"}
          </p>
          <h1 className="font-display text-[1rem] uppercase leading-relaxed text-brand-white [text-shadow:3px_3px_0_var(--brand-electric)] sm:text-[1.45rem]">
            {teamName}
          </h1>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
            {BRANDING.eventName} · {BRANDING.thematicLine}
          </p>
          <p className="font-mono text-sm leading-relaxed text-brand-muted sm:text-base">
            Recibimos la postulación de tu equipo. Revisaremos la información y les contactaremos con
            los siguientes pasos.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/" className="w-full sm:w-auto">
              Volver a inicio
            </ButtonLink>
            <ButtonLink href="/register" variant="secondary" className="w-full sm:w-auto">
              Registrar otro equipo
            </ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}

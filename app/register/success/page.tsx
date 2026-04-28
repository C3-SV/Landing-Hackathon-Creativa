import { BRANDING } from "@/lib/constants/branding";
import { ButtonLink, Card } from "@/lib/ui";

type SuccessPageProps = {
  searchParams: Promise<{ teamName?: string }>;
};

export default async function RegisterSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const teamName = params.teamName ?? "Tu equipo";

  return (
    <main className="flex-1 py-14">
      <div className="container-shell">
        <Card className="mx-auto max-w-2xl space-y-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            {BRANDING.conceptUpper}
          </p>
          <h1 className="font-display text-lg uppercase leading-relaxed text-brand-white sm:text-2xl">
            {teamName}
          </h1>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
            {BRANDING.eventName} · {BRANDING.eventSubtitle}
          </p>
          <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
            Recibimos la postulación de tu equipo. Revisaremos la información y les contactaremos con los siguientes pasos.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Volver a inicio</ButtonLink>
            <ButtonLink href="/register" variant="secondary">
              Registrar otro equipo
            </ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}

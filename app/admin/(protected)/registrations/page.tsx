import { BRANDING } from "@/lib/constants/branding";
import { RegistrationsTable } from "@/features/admin/components";
import { registrationRepository } from "@/lib/repositories";
import { Card } from "@/lib/ui";

export default async function RegistrationsPage() {
  const [rows, challenges] = await Promise.all([
    registrationRepository.listRegistrations(),
    registrationRepository.getChallenges(),
  ]);

  return (
    <section className="space-y-4">
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
          {BRANDING.conceptUpper}
        </p>
        <h1 className="mt-2 font-display text-base uppercase leading-relaxed text-brand-white sm:text-lg">
          {BRANDING.eventName}
        </h1>
        <p className="mt-2 text-sm text-brand-muted">{BRANDING.eventSubtitle}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
          Panel principal de inscripciones por equipo
        </p>
      </Card>
      <RegistrationsTable initialRows={rows} challenges={challenges} />
    </section>
  );
}

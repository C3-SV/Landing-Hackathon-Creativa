import { BRANDING } from "@/lib/constants/branding";
import { ChallengesOverview } from "@/features/admin/components";
import { registrationRepository } from "@/lib/repositories";
import { Card } from "@/lib/ui";

export default async function AdminChallengesPage() {
  const [challenges, registrations] = await Promise.all([
    registrationRepository.getChallenges(),
    registrationRepository.listRegistrationsForChallengeOverview(),
  ]);

  return (
    <section className="space-y-4">
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
          {BRANDING.conceptUpper}
        </p>
        <h1 className="mt-2 font-display text-base uppercase leading-relaxed text-brand-white sm:text-lg">
          Retos
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Vista operativa de equipos asignados y equipos interesados por preferencia.
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
          Esta vista es solo lectura y no envia correos
        </p>
      </Card>

      <ChallengesOverview challenges={challenges} registrations={registrations} />
    </section>
  );
}

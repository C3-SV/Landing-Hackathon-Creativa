import Link from "next/link";
import { BRANDING } from "@/lib/constants/branding";
import { DashboardStatsGrid } from "@/features/admin/components";
import { registrationRepository } from "@/lib/repositories";
import { ButtonLink, Card, EmptyState } from "@/lib/ui";

export default async function AdminDashboardPage() {
  const [stats, challenges] = await Promise.all([
    registrationRepository.getDashboardStats(),
    registrationRepository.getChallenges(),
  ]);

  return (
    <section className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            {BRANDING.conceptUpper}
          </p>
          <h1 className="mt-2 font-display text-base uppercase leading-relaxed text-brand-white sm:text-lg">
            {BRANDING.eventName}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">{BRANDING.eventSubtitle}</p>
        </div>
        <ButtonLink href="/admin/registrations" variant="secondary">
          Ver tabla completa
        </ButtonLink>
      </Card>

      {stats.totalTeams === 0 ? (
        <EmptyState
          title="Sin equipos registrados todavía"
          description="Cuando entren inscripciones aparecerán aquí para seguimiento operativo."
          action={
            <Link href="/register" className="font-mono text-xs uppercase text-brand-electric">
              Abrir formulario público
            </Link>
          }
        />
      ) : (
        <DashboardStatsGrid stats={stats} challenges={challenges} />
      )}
    </section>
  );
}

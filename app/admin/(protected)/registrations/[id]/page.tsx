import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANDING } from "@/lib/constants/branding";
import { APP_ENV } from "@/lib/constants/env";
import { RegistrationDetail } from "@/features/admin/components";
import { getAcceptedEmailClientSummary } from "@/lib/email/accepted-email";
import { getFinalInstructionsEmailClientSummary } from "@/lib/email/final-instructions-email";
import { registrationRepository } from "@/lib/repositories";
import { ButtonLink, Card } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [registration, challenges, emailLogs, codeOfConductAcceptance] = await Promise.all([
    registrationRepository.getRegistrationById(id),
    registrationRepository.getChallenges(),
    registrationRepository.listEmailLogsForRegistration(id),
    registrationRepository.getCodeOfConductAcceptanceForRegistration(id),
  ]);

  if (!registration) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            {BRANDING.conceptUpper}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
            {BRANDING.eventName} · Detalle de equipo
          </p>
          <Link
            href="/admin/registrations"
            className="mt-2 inline-block font-mono text-xs uppercase text-brand-muted hover:text-brand-white"
          >
            ← Volver al listado
          </Link>
        </div>
        <ButtonLink href="/admin/registrations" variant="secondary">
          Lista de equipos
        </ButtonLink>
      </Card>
      <RegistrationDetail
        registration={registration}
        challenges={challenges}
        emailLogs={emailLogs}
        codeOfConductAcceptance={codeOfConductAcceptance}
        acceptedEmailSummary={getAcceptedEmailClientSummary(registration)}
        finalInstructionsEmailSummary={getFinalInstructionsEmailClientSummary(
          registration,
          codeOfConductAcceptance,
        )}
        emailNotificationsEnabled={APP_ENV.emailNotificationsEnabled}
      />
    </section>
  );
}

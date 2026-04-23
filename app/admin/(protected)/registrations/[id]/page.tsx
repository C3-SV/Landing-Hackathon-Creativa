import Link from "next/link";
import { notFound } from "next/navigation";
import { RegistrationDetail } from "@/features/admin/components";
import { registrationRepository } from "@/lib/repositories";
import { ButtonLink, Card } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [registration, challenges] = await Promise.all([
    registrationRepository.getRegistrationById(id),
    registrationRepository.getChallenges(),
  ]);

  if (!registration) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            Detalle equipo
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
      <RegistrationDetail registration={registration} challenges={challenges} />
    </section>
  );
}

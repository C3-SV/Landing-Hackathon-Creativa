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
          Panel de equipos
        </p>
        <h1 className="mt-2 font-display text-base uppercase leading-relaxed text-brand-white sm:text-lg">
          Tabla principal de inscripciones
        </h1>
      </Card>
      <RegistrationsTable initialRows={rows} challenges={challenges} />
    </section>
  );
}

import { BRANDING } from "@/lib/constants/branding";
import { Card, SectionHeading } from "@/lib/ui";

export function OrganizersSection() {
  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Organizan"
        title={BRANDING.organizers}
        description="Equipo organizador enfocado en activar comunidad, ejecución técnica y contexto país."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex min-h-28 items-center justify-center border-brand-orange/35">
          <p className="font-display text-sm uppercase text-brand-white">Poliédrica</p>
        </Card>
        <Card className="flex min-h-28 items-center justify-center border-brand-electric/35">
          <p className="font-display text-sm uppercase text-brand-white">C3</p>
        </Card>
      </div>
    </section>
  );
}

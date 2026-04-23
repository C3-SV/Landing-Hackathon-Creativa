import { Card, SectionHeading } from "@/lib/ui";

export function SponsorsSection() {
  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Sponsors / aliados"
        title="Aliados por anunciar"
        description="La convocatoria de aliados está abierta. Este espacio se actualizará con logos y categorías."
      />
      <Card className="border-dashed border-brand-electric/45 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-electric">
          Espacio reservado para aliados
        </p>
      </Card>
    </section>
  );
}

import { BRANDING } from "@/lib/constants/branding";
import { Card, SectionHeading } from "@/lib/ui";

export function SponsorsSection() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-6">
        <SectionHeading
          eyebrow="Sponsors / aliados"
          title="Aliados por anunciar"
          description={`Convocatoria abierta para ${BRANDING.eventName}. Este espacio se actualizará con logos y categorías.`}
        />
        <Card className="border-dashed border-brand-electric/45 bg-brand-surface/85 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-brand-electric">
            Espacio reservado para aliados
          </p>
        </Card>
      </div>
    </section>
  );
}

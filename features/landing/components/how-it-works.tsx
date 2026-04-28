import { HOW_IT_WORKS } from "@/lib/constants/event";
import { Card, SectionHeading } from "@/lib/ui";

export function HowItWorksSection() {
  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Formato de ejecución en 4 movimientos"
        description="Inscripción por equipos, selección de retos, sprint con mentoría y demo final. Todo suma cuando construimos juntos."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((item, index) => (
          <Card key={item} className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
              Paso {index + 1}
            </p>
            <p className="text-sm text-brand-white">{item}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

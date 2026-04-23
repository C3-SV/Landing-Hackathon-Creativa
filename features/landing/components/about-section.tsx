import { LANDING_BULLETS } from "@/lib/constants/event";
import { Card, SectionHeading } from "@/lib/ui";

export function AboutSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <Card>
        <SectionHeading
          eyebrow="Qué es"
          title="Hackathon Creativa"
          description="Una experiencia de construcción enfocada en turismo, economía creativa y tecnología. Menos show, más ejecución."
        />
      </Card>
      <Card className="space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
          Enfoque del evento
        </h3>
        <ul className="grid gap-3">
          {LANDING_BULLETS.map((bullet) => (
            <li
              key={bullet}
              className="rounded-xl border border-brand-electric/20 bg-brand-bg/55 px-3 py-2 text-sm text-brand-white"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

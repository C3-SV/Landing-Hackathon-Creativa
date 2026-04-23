import type { Challenge } from "@/lib/types/domain";
import { Badge, Card, SectionHeading } from "@/lib/ui";

type ChallengeGridProps = {
  challenges: Challenge[];
};

export function ChallengeGrid({ challenges }: ChallengeGridProps) {
  return (
    <section id="retos" className="space-y-6">
      <SectionHeading
        eyebrow="Retos"
        title="6 retos para turismo con ejecución real"
        description="Selecciona tus 3 preferencias al registrar tu equipo. Algunos retos ya están confirmados y otros siguen en etapa propuesta."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-sm uppercase leading-relaxed text-brand-white">
                {challenge.name}
              </h3>
              <Badge variant={challenge.status === "confirmed" ? "confirmed" : "proposed"}>
                {challenge.status === "confirmed" ? "Confirmado" : "Propuesto"}
              </Badge>
            </div>
            <p className="text-sm text-brand-muted">{challenge.description}</p>
            <p className="mt-auto font-mono text-xs uppercase tracking-wide text-brand-electric">
              Hub: {challenge.hub}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

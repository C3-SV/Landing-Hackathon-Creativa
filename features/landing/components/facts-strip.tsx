import { LANDING_QUICK_FACTS } from "@/lib/constants/event";
import { Card, DataLabel } from "@/lib/ui";

export function FactsStrip() {
  return (
    <section>
      <Card className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {LANDING_QUICK_FACTS.map((fact) => (
          <DataLabel key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </Card>
    </section>
  );
}

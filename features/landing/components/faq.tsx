import { FAQ_ITEMS } from "@/lib/constants/event";
import { SectionHeading } from "@/lib/ui";

export function FaqSection() {
  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        description="Información base para preparar tu equipo antes de aplicar."
      />
      <div className="grid gap-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-brand-electric/25 bg-brand-surface/60 p-4"
          >
            <summary className="cursor-pointer list-none font-mono text-sm uppercase tracking-wide text-brand-white">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

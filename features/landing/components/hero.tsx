import { ButtonLink } from "@/lib/ui";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-electric/35 bg-brand-surface/70 px-6 py-12 shadow-[0_30px_60px_rgba(2,8,20,0.45)] sm:px-10 lg:py-14">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-electric/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
            Cultura + código
          </p>
          <h1 className="font-display text-2xl uppercase leading-[1.45] text-brand-white sm:text-4xl">
            Hackathon Creativa
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
            Cultura + código para construir soluciones reales en turismo.
          </p>
          <p className="font-mono text-sm uppercase tracking-wider text-brand-orange-soft">
            20-21 JUN · Key Institute · San Salvador, SV
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register">Inscribirme</ButtonLink>
            <ButtonLink href="/#retos" variant="secondary">
              Ver retos
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl border border-brand-electric/35 bg-brand-bg/65 p-5 font-mono">
          <p className="text-xs uppercase tracking-wide text-brand-muted">Modo de juego</p>
          <p className="text-sm uppercase text-brand-electric">Build-first hackathon</p>
          <p className="text-sm text-brand-white">Menos pitch. Más construcción. Más colaboración.</p>
          <div className="pixel-divider mt-1" />
          <p className="text-xs uppercase tracking-wide text-brand-muted">
            Equipos 3H · Mentoría · Demo funcional
          </p>
        </div>
      </div>
    </section>
  );
}

export function EventSpiritSection() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-brand-orange/85 sm:h-60 sm:w-60" />
        <div className="absolute -bottom-40 -left-44 h-72 w-72 rounded-full bg-brand-action/80 sm:-bottom-52 sm:-left-56 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-16 bottom-16 hidden h-40 w-40 rounded-full bg-brand-orange/65 md:block" />
        <div className="absolute bottom-8 left-8 hidden h-20 w-20 rounded-full bg-brand-orange-soft/80 md:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-[min(1100px,calc(100%-2rem))] flex-col items-center text-center">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 03 / ESPÍRITU"}
        </p>

        <h2 className="mt-7 font-display text-[2rem] uppercase leading-[1.18] tracking-[0.05em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.8rem] lg:text-[4.6rem]">
          TODO SUMA
        </h2>

        <p className="mt-8 max-w-[900px] text-base leading-relaxed text-brand-white/90 sm:text-lg">
          En Festival de Código, cada perfil aporta algo distinto: una idea, una habilidad, una
          forma de entender el problema o una manera de construir la solución.
        </p>

        <div className="mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-brand-electric/65 bg-brand-surface/25 px-5 py-3 font-mono text-sm uppercase tracking-[0.12em] sm:px-8 sm:text-base">
          <span className="text-brand-orange-soft">+ TURISMO</span>
          <span className="text-brand-white">+ TECNOLOGÍA</span>
          <span className="text-brand-white">+ CULTURA</span>
        </div>

        <p className="mt-8 max-w-[640px] font-mono text-sm leading-relaxed text-brand-muted sm:text-base">
          Distintas ideas, habilidades y perspectivas se unen para construir soluciones más
          completas.
        </p>
      </div>
    </section>
  );
}


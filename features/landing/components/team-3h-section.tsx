const TEAM_3H_CARDS = [
  {
    label: "H 01",
    title: "Hacker",
    description:
      "Perfil t\u00E9cnico que desarrolla, prototipa e implementa la soluci\u00F3n. Convierte ideas en algo funcional y demostrable.",
  },
  {
    label: "H 02",
    title: "Hipster",
    description:
      "Perfil creativo y de experiencia. Dise\u00F1a la interfaz, la interacci\u00F3n y la forma en que la soluci\u00F3n se entiende y se vive.",
  },
  {
    label: "H 03",
    title: "Hustler",
    description:
      "Perfil estrat\u00E9gico y de negocio. Conecta la soluci\u00F3n con el problema, el usuario, la propuesta de valor y su viabilidad.",
  },
] as const;

export function Team3HSection() {
  return (
    <section
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
      aria-labelledby="team-3h-title"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div className="space-y-6 lg:space-y-8">
          <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
            {"{} 05 / EQUIPOS"}
          </p>
          <h2
            id="team-3h-title"
            className="max-w-[12ch] font-display text-[1.8rem] uppercase leading-[1.16] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:max-w-none sm:text-[2.6rem] lg:text-[4rem]"
          >
            EQUIPOS 3H
          </h2>

          <p className="max-w-[980px] font-mono text-sm leading-relaxed text-brand-muted sm:text-base lg:text-lg">
            En la Hackathon de Turismo Creativo, los equipos se construyen desde la multidisciplinariedad.
            El formato 3H une tres perspectivas complementarias para potenciar mejores ideas, mejores
            prototipos y mejores soluciones.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {TEAM_3H_CARDS.map((card) => (
            <article
              key={card.label}
              className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-[1.9rem] border border-brand-electric/55 bg-brand-surface/90 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/80 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.32),0_16px_32px_rgba(8,20,45,0.4)] sm:min-h-[265px] sm:p-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-brand-white/70 transition-colors duration-200 group-hover:border-brand-orange/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-brand-white/70 transition-colors duration-200 group-hover:border-brand-electric/90"
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-orange-soft">
                  {card.label}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-14 bg-brand-orange/70 transition-all duration-200 group-hover:w-20 group-hover:bg-brand-orange"
                />
              </div>

              <h3 className="mt-4 font-mono text-xl font-semibold leading-tight text-brand-orange sm:text-[1.35rem]">
                {card.title}
              </h3>

              <p className="mt-4 font-mono text-sm leading-relaxed text-brand-white/86 sm:text-base">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <p className="max-w-3xl rounded-full border border-brand-electric/45 bg-brand-surface/35 px-5 py-3 text-center font-mono text-sm leading-relaxed text-brand-white/88 shadow-[0_0_0_1px_rgba(26,130,255,0.12)] sm:px-6 sm:py-4 sm:text-base">
            Cuando distintas habilidades se unen,{" "}
            <span className="text-brand-orange">todo suma</span>
          </p>
        </div>
      </div>
    </section>
  );
}

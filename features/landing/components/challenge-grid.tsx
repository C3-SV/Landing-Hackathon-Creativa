const CHALLENGES = [
  {
    number: "01",
    category: "[TOURISTSV]",
    title: "Asistente inteligente para mejorar la experiencia del turista.",
    description:
      "Un reto para diseñar una experiencia conversacional o guiada que ayude al visitante a encontrar contexto, decisiones y rutas útiles.",
    tag: "AI EXPERIENCE",
  },
  {
    number: "02",
    category: "[CREATOR KIT]",
    title: "Herramienta inteligente de marketing turístico para micro emprendedores.",
    description:
      "Una oportunidad para crear soluciones digitales que ayuden a pequeños negocios turísticos a generar contenido atractivo para promocionar sus servicios y conectar con más visitantes.",
    tag: "SMART MARKETING",
  },
  {
    number: "03",
    category: "[AR-CULTURA]",
    title: "Experiencias culturales inmersivas con realidad aumentada.",
    description:
      "Un reto para diseñar experiencias interactivas que permitan a los turistas descubrir historia, patrimonio y cultura salvadoreña de forma visual, inmersiva y accesible.",
    tag: "INTERACTIVE/AR EXPERIENCE",
  },
  {
    number: "04",
    category: "[ECOTRACK]",
    title: "Turismo ecológico y sostenible.",
    description:
      "Una iniciativa para construir herramientas digitales que promuevan prácticas sostenibles, reduzcan el impacto ambiental y mejoren la conservación de espacios turísticos y naturales.",
    tag: "GREEN TOURISM",
  },
  {
    number: "05",
    category: "[DATAPULSE]",
    title: "Capa compartida de datos turísticos.",
    description:
      "Un reto orientado a crear una infraestructura de datos turísticos confiable y reutilizable que permita conectar información de lugares, eventos, negocios y experiencias para otros proyectos y plataformas.",
    tag: "DATA PLATFORM",
  },
  {
    number: "06",
    category: "[TWINMAP]",
    title: "Digital Twin Turístico: territorio, datos y experiencia.",
    description:
      "Una oportunidad para visualizar y comprender destinos turísticos mediante mapas, capas de información y experiencias digitales que integren territorio, movilidad, negocios, sostenibilidad y comportamiento de visitantes.",
    tag: "DIGITAL TWIN",
  },
] as const;

export function ChallengeGrid() {
  return (
    <section
      id="retos"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-brand-bg py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-7">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 03 / RETOS"}
        </p>

        <h2 className="font-display text-[1.65rem] uppercase leading-[1.2] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.45rem] lg:text-[3.5rem]">
          <span className="block">6 RETOS PARA TURISMO CON</span>
          <span className="mt-2 block">EJECUCIÓN REAL</span>
        </h2>

        <p className="max-w-[900px] font-mono text-sm leading-relaxed text-brand-white/88 sm:text-base">
          Selecciona tus 3 preferencias al registrar tu equipo. Cada reto plantea una oportunidad
          para construir soluciones desde turismo, código y cultura.
        </p>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {CHALLENGES.map((challenge) => (
            <article
              key={challenge.number}
              className="group flex min-h-[270px] flex-col rounded-3xl border border-brand-electric/45 bg-brand-surface/85 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.15)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/75 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.34),0_14px_28px_rgba(8,20,45,0.45)] sm:min-h-[285px] sm:p-6"
            >
              <div className="grid grid-cols-[auto_1px_1fr] items-start gap-4">
                <p className="font-mono text-[2.45rem] font-semibold leading-none text-brand-orange sm:text-[2.7rem]">
                  {challenge.number}
                </p>
                <span className="h-full min-h-16 w-px bg-brand-orange/80" />
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-orange-soft">
                    {challenge.category}
                  </p>
                  <h3 className="font-mono text-lg font-semibold leading-snug text-brand-orange">
                    {challenge.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 font-mono text-sm leading-relaxed text-brand-white/86">
                {challenge.description}
              </p>
              <p className="mt-auto self-end rounded-full border border-brand-orange/85 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-brand-orange-soft">
                {challenge.tag}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

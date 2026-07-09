import { Card, cn } from "@/lib/ui";

const PRIZE_HIGHLIGHTS = [
  "6 equipos ganadores",
  "1 por reto",
  "+USD 5,000 valorado",
] as const;

const PRIZE_TIERS = [
  {
    label: "A 01",
    letter: "A",
    title: "Asesoría y Mentoría 1:1",
    description:
      "Mentoría especializada con Poliédrica y acompañamiento peer-to-peer de C3 para aterrizar la idea, fortalecer producto, validar el modelo y definir próximos pasos. Un paquete de acompañamiento valorado en más de USD 5,000.",
  },
  {
    label: "B 02",
    letter: "B",
    title: "Business Connections",
    description:
      "Visibilidad y conexión con aliados, mentores, jurados y actores del ecosistema de innovación, emprendimiento y oportunidades para abrir conversaciones reales alrededor de los mejores proyectos.",
  },
  {
    label: "C 03",
    letter: "C",
    title: "Colaboración HTC Ecosystem",
    description:
      "Pase directo, garantizado y destacado a la Hackathon de Turismo Creativo Vol. 2, para continuar construyendo con más claridad, mentoría previa y una posición destacada dentro del ecosistema HTC.",
  },
] as const;

export function PremiosABCSection() {
  return (
    <section
      aria-labelledby="premios-abc-title"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-16 h-24 w-24 rounded-full bg-brand-orange/20 blur-3xl sm:h-32 sm:w-32" />
        <div className="absolute right-[8%] top-24 h-40 w-40 rounded-full bg-brand-electric/18 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-brand-orange-soft/12 blur-3xl" />
      </div>

      <div className="relative mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div className="space-y-6 lg:space-y-8">
          <p className="inline-flex items-center rounded-full border border-brand-orange bg-brand-orange/8 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft shadow-[0_0_0_1px_rgba(255,167,38,0.14)] sm:px-5">
            {"{} 06 / PREMIOS"}
          </p>

          <div className="space-y-3">
            <h2
              id="premios-abc-title"
              className="font-display text-[1.8rem] uppercase leading-[1.16] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.6rem] lg:text-[4rem]"
            >
              PREMIOS ABC
            </h2>
          </div>

          <p className="max-w-[980px] font-mono text-sm leading-relaxed text-brand-muted sm:text-base lg:text-lg">
            En HTC Vol. 1,{" "}
            <span className="rounded-full bg-brand-orange/12 px-2 py-1 text-brand-orange-soft">
              Todo suma
            </span>
            : ideas, talento, mentoría, conexiones y colaboración. Esta primera edición piloto
            reconocerá a{" "}
            <span className="font-semibold text-brand-white">seis equipos ganadores</span>,{" "}
            <span className="font-semibold text-brand-orange-soft">uno por reto</span>, con una
            ruta diseñada para que sus soluciones sigan creciendo después del fin de semana.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:mt-10 xl:grid-cols-3">
          {PRIZE_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="rounded-full border border-brand-electric/50 bg-brand-surface/75 px-4 py-3 text-center font-mono text-sm uppercase tracking-[0.12em] text-brand-white/92 shadow-[0_0_0_1px_rgba(26,130,255,0.12)] sm:px-5 sm:text-[0.95rem]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:mt-12 xl:grid-cols-3 xl:gap-6">
          {PRIZE_TIERS.map((tier) => (
            <Card
              key={tier.label}
              className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-[1.9rem] border-brand-electric/55 bg-brand-surface/90 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.18),0_18px_34px_rgba(8,20,45,0.42)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/80 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.32),0_18px_36px_rgba(8,20,45,0.45)] sm:min-h-[310px] sm:p-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-brand-white/70 transition-colors duration-200 group-hover:border-brand-orange/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-brand-white/70 transition-colors duration-200 group-hover:border-brand-electric/90"
              />

              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-5 top-7 font-display text-[3.8rem] leading-none text-brand-electric/12 transition duration-200 sm:text-[4.6rem]",
                  tier.letter === "B" && "text-brand-orange/10",
                )}
              >
                {tier.letter}
              </span>

              <div className="relative max-w-[80%]">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-orange-soft">
                  {tier.label}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-14 bg-brand-orange/70 transition-all duration-200 group-hover:w-20 group-hover:bg-brand-orange"
                />
              </div>

              <h3 className="relative mt-5 max-w-[15ch] font-mono text-xl font-semibold leading-tight text-brand-orange sm:text-[1.35rem]">
                {tier.title}
              </h3>

              <p className="relative mt-4 font-mono text-sm leading-relaxed text-brand-white/86 sm:text-base">
                {tier.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center xl:mt-12">
          <p className="max-w-4xl rounded-full border border-brand-electric/45 bg-brand-surface/35 px-5 py-3 text-center font-mono text-sm leading-relaxed text-brand-white/88 shadow-[0_0_0_1px_rgba(26,130,255,0.12)] sm:px-6 sm:py-4 sm:text-base">
            Una ruta de crecimiento:{" "}
            <span className="text-brand-orange">asesoría</span>,{" "}
            <span className="text-brand-orange-soft">conexiones</span> y colaboración.
          </p>
        </div>
      </div>
    </section>
  );
}

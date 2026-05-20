import { HOW_IT_WORKS } from "@/lib/constants/event";

export function HowItWorksSection() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"C\u00D3MO FUNCIONA"}
        </p>

        <h2 className="mt-7 font-display text-[1.55rem] uppercase leading-[1.2] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.2rem] lg:text-[3.35rem]">
          {"FORMATO DE EJECUCI\u00D3N EN 4 MOVIMIENTOS"}
        </h2>

        <p className="mt-8 max-w-[900px] text-base leading-relaxed text-brand-muted sm:text-lg">
          {
            "Inscripci\u00F3n por equipos, selecci\u00F3n de retos, sprint con mentor\u00EDa y demo final. Todo suma cuando construimos juntos."
          }
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {HOW_IT_WORKS.map((item, index) => (
            <article
              key={item}
              className="group relative flex min-h-[200px] flex-col rounded-3xl border border-brand-electric/55 bg-brand-surface/90 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/75 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.28),0_14px_28px_rgba(8,20,45,0.38)] sm:min-h-[215px] sm:p-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand-white/75"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-brand-white/75"
              />

              <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-orange-soft">
                PASO {index + 1}
              </p>

              <div className="mt-3 h-px w-14 bg-brand-orange/80" aria-hidden="true" />

              <p className="mt-5 font-mono text-sm leading-relaxed text-brand-white sm:text-base">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
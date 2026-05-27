import Image from "next/image";

type OrganizerCard = {
  name: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName?: string;
};

const ORGANIZERS: OrganizerCard[] = [
  {
    name: "C3 / Competitive Coding Club",
    logoSrc: "/images/logo-c3-blanco.png",
    logoAlt: "Logo de C3",
    logoClassName: "max-h-[220px]",
  },
  {
    name: "Poliédrica",
    logoSrc: "/images/logo-poliedrica-original.png",
    logoAlt: "Logo de Poliédrica",
    logoClassName: "max-h-[190px]",
  },
];

export function OrganizersSection() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 06 / ORGANIZADORES"}
        </p>

        <h2 className="mt-7 font-display text-[1.9rem] uppercase leading-[1.22] tracking-[0.05em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.6rem] lg:text-[3.9rem]">
          ORGANIZADORES
        </h2>

        <p className="mt-8 max-w-[980px] text-base leading-relaxed text-brand-white/92 sm:text-lg">
          El Hackathon de Turismo Creativo I es organizado por C3 y Poliédrica, uniendo creatividad,
          comunidad, tecnología y ejecución para activar un espacio donde el talento pueda construir
          soluciones sobre retos reales del país.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:gap-6">
          {ORGANIZERS.map((organizer) => (
            <article
              key={organizer.name}
              className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-brand-electric/55 bg-brand-surface/90 p-6 shadow-[0_0_0_1px_rgba(26,130,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/75 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.3),0_14px_28px_rgba(8,20,45,0.38)] sm:min-h-[360px] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-brand-white/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-brand-white/80"
              />

              <div className="flex flex-1 items-center justify-center px-2 sm:px-4">
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-brand-electric/35 bg-brand-bg/40 p-4">
                  <Image
                    src={organizer.logoSrc}
                    alt={organizer.logoAlt}
                    width={620}
                    height={300}
                    className={`h-auto w-full object-contain ${organizer.logoClassName ?? "max-h-[200px]"}`}
                  />
                </div>
              </div>

              <p className="mt-8 text-center font-mono text-lg font-semibold text-brand-white sm:text-xl">
                {organizer.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

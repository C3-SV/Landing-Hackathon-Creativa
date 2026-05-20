type OrganizerCard = {
  name: string;
  Logo: () => JSX.Element;
  logoAlt: string;
};

const ORGANIZERS: OrganizerCard[] = [
  {
    name: "C3 | Competitive Coding",
    Logo: C3PlaceholderLogo,
    logoAlt: "Logo de C3",
  },
  {
    name: "Poli�drica",
    Logo: PoliedricaPlaceholderLogo,
    logoAlt: "Logo de Poli�drica",
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
          El Festival de C�digo es organizado por Poli�drica y C3, uniendo creatividad, comunidad,
          tecnolog�a y ejecuci�n para activar un espacio donde el talento pueda construir soluciones
          sobre retos reales del pa�s.
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
                <div className="w-full max-w-[360px]" role="img" aria-label={organizer.logoAlt}>
                  <organizer.Logo />
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

function C3PlaceholderLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 540 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full text-brand-white"
    >
      <rect x="1" y="1" width="538" height="208" rx="26" stroke="currentColor" strokeOpacity="0.75" />
      <path d="M110 104a58 58 0 1 1 0-1" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <path d="M257 58h92M257 104h78M257 150h92" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <path d="M396 74c18-16 49-16 67 0 12 10 12 31 0 41-18 16-49 16-67 0M396 133c18 16 49 16 67 0" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}

function PoliedricaPlaceholderLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 540 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full text-brand-white"
    >
      <rect x="1" y="1" width="538" height="208" rx="26" stroke="currentColor" strokeOpacity="0.75" />
      <g stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="88,106 134,72 180,106 134,140" />
        <polygon points="180,106 226,72 272,106 226,140" />
        <polygon points="272,106 318,72 364,106 318,140" />
        <line x1="134" y1="140" x2="226" y2="140" />
        <line x1="226" y1="140" x2="318" y2="140" />
      </g>
      <text
        x="416"
        y="123"
        fill="currentColor"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="28"
        fontWeight="700"
        letterSpacing="2"
        textAnchor="middle"
      >
        POLI�DRICA
      </text>
    </svg>
  );
}

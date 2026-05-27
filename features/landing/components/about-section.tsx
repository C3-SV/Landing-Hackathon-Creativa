import type { ReactElement, SVGProps } from "react";

type AboutItem = {
  title: string;
  description: string;
  Icon: ({ className }: { className?: string }) => ReactElement;
};

const ABOUT_ITEMS: AboutItem[] = [
  {
    title: "[ Build-first",
    description: "Ideas que se convierten en prototipos reales durante el evento",
    Icon: RocketIcon,
  },
  {
    title: "[ Competencia y colaboración real",
    description: "La competencia impulsa, pero la colaboración multiplica.",
    Icon: HandshakeIcon,
  },
  {
    title: "[ Equipos híbridos",
    description: "Perfiles distintos trabajando juntos para crear soluciones más completas",
    Icon: UsersIcon,
  },
  {
    title: "[ Mentoría práctica",
    description: "Guía directa para mejorar la idea, el prototipo y la presentación final",
    Icon: MessageCircleIcon,
  },
];

export function AboutSection() {
  return (
    <section
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-hackathon-title"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-6 lg:space-y-8">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 01 / SOBRE EL HACKATHON"}
        </p>

        <h2
          id="about-hackathon-title"
          className="font-display text-[1.8rem] uppercase leading-[1.2] tracking-[0.04em] text-brand-white [text-shadow:3px_3px_0_var(--brand-electric)] sm:text-[2.3rem] lg:text-[3.25rem]"
        >
          ¿QUÉ ES?
        </h2>

        <p className="max-w-[78ch] text-base leading-relaxed text-brand-white/88 sm:text-lg">
          El Hackathon de Turismo Creativo I es un evento intensivo donde equipos multidisciplinarios
          trabajan durante dos días para diseñar, prototipar y presentar soluciones aplicables a retos
          reales del país. La experiencia une turismo, código y cultura para transformar ideas en
          propuestas demostrables, combinando creatividad, tecnología, contexto local y ejecución
          práctica. Más que una competencia tradicional, es un espacio de colaboración donde distintos
          perfiles construyen juntos soluciones con potencial de impacto.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ABOUT_ITEMS.map(({ title, description, Icon }) => (
            <article
              key={title}
              className="group relative flex min-h-56 flex-col gap-4 overflow-hidden rounded-3xl border border-brand-electric/45 bg-brand-surface/80 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.15)] transition duration-200 hover:border-brand-orange/70 hover:shadow-[0_0_0_1px_rgba(255,107,0,0.35),0_14px_28px_rgba(8,20,45,0.45)]"
            >
              <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-brand-electric/35 transition group-hover:border-brand-orange/60" />
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-orange/80 text-brand-orange">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-mono text-base font-semibold leading-snug text-brand-orange">
                {title}
              </h3>
              <p className="font-mono text-sm leading-relaxed text-brand-white/85">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 4a7 7 0 0 1 6 6l-6.5 6.5-5-5Z" />
      <path d="m9 14-3 3m2-6-4 1 3-3m7 7 1 4 3-3-4-1" />
      <circle cx="14.5" cy="9.5" r="1.25" />
    </svg>
  );
}

function HandshakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 3-3 4 4 2-2a2.8 2.8 0 0 1 4 0L21 13" />
      <path d="m8 12 2 2m2-2 2 2m2-2 2 2" />
      <path d="m6 6-3 3m18 4 1 1-3 3-2-2" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M2.5 18a5.5 5.5 0 0 1 11 0" />
      <path d="M13 18a4.5 4.5 0 0 1 8 0" />
    </svg>
  );
}

function MessageCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 18.5 3.5 21V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v6.5a4 4 0 0 1-4 4h-9z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

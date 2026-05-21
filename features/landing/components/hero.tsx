import Image from "next/image";

import { ButtonLink } from "@/lib/ui";

export function LandingHero() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg pb-12 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-16">
      <div className="relative z-10 mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="grid gap-6 lg:min-h-[720px] lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="space-y-6 py-2 sm:space-y-8 lg:max-w-[42rem] lg:self-center lg:py-6">
            <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
              &gt;_ HACKATHON DE TURISMO CREATIVO
            </p>
            <h1 className="font-display text-[2rem] uppercase leading-[1.2] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.8rem] lg:text-[4.8rem] lg:leading-[1.15]">
              <span className="block">HACKATHON DE</span>
              <span className="mt-2 block">TURISMO CREATIVO I</span>
            </h1>
            <p className="max-w-[35ch] text-lg leading-relaxed text-brand-white/90">
              Un fin de semana para construir soluciones reales donde el turismo, el código y la
              cultura se encuentran.
            </p>
            <p className="font-mono text-xl text-brand-orange-soft">
              ✧ Fechas por anunciar · Key Institute · San Salvador
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href="/register"
                className="w-full bg-brand-orange-soft px-6 py-3 font-mono text-xl text-[#081326] shadow-[0_8px_0_0_var(--brand-action)] hover:-translate-y-0.5 hover:bg-brand-orange sm:w-auto"
                leadingIcon={<UserPlusIcon className="mr-2 h-6 w-6" />}
              >
                Inscribirme
              </ButtonLink>
              <ButtonLink
                href="/#retos"
                variant="secondary"
                className="w-full border-brand-orange bg-transparent px-6 py-3 font-mono text-xl text-brand-orange hover:bg-brand-orange/10 sm:w-auto"
                leadingIcon={<TargetIcon className="mr-2 h-6 w-6" />}
              >
                Ver retos
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-brand-electric bg-[linear-gradient(180deg,rgba(7,34,77,0.92),rgba(10,31,61,1))] p-3 shadow-[0_0_0_1px_rgba(26,130,255,0.25),0_24px_56px_rgba(7,18,43,0.55)] sm:p-4 lg:min-h-[660px] lg:p-5">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-brand-electric/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-brand-electric/20 blur-3xl" />
            <span className="absolute left-5 top-5 h-5 w-5 border-l border-t border-brand-electric/60" />
            <span className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-brand-electric/60" />
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[1.4rem] border border-brand-electric/45">
              <Image
                src="/images/hero-festival-pc.png"
                alt="Ilustración principal del Hackathon de Turismo Creativo I"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M20 8v6" />
      <path d="M17 11h6" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

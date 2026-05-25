import Image from "next/image";

import { ButtonLink } from "@/lib/ui";

export function LandingHero() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg pb-8 pt-8 sm:pb-10 sm:pt-10 lg:pb-12 lg:pt-12">
      <div className="relative z-10 mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1.1fr] lg:items-center lg:gap-10">
          <div className="space-y-6 py-1 sm:space-y-7 lg:max-w-[44rem] lg:py-2">
            <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
              &gt;_ HACKATHON DE TURISMO CREATIVO
            </p>
            <h1 className="max-w-[16ch] font-display text-[1.85rem] uppercase leading-[1.15] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.45rem] lg:text-[3.35rem] lg:leading-[1.1]">
              <span className="block">HACKATHON DE</span>
              <span className="mt-2 block">TURISMO CREATIVO I</span>
            </h1>
            <p className="max-w-[35ch] text-lg leading-relaxed text-brand-white/90">
              Un fin de semana para construir soluciones reales donde el turismo, el código y la
              cultura se encuentran.
            </p>
            <p className="font-mono text-xl text-brand-orange-soft">
              ✧ 11 y 12 de julio · Key Institute · San Salvador
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

          <div className="w-full lg:justify-self-end">
            <div className="relative aspect-video w-full overflow-hidden rounded-[1.25rem] bg-transparent lg:w-[min(100%,560px)]">
              <Image
                src="/images/hero-festival-pc-transparent.png"
                alt="Ilustración principal del Hackathon de Turismo Creativo I"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 72vw, 44vw"
                className="object-contain object-center"
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

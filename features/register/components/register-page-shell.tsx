import { BRANDING } from "@/lib/constants/branding";
import { ButtonLink, Card } from "@/lib/ui";

export function RegisterPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative left-1/2 right-1/2 flex w-screen -translate-x-1/2 flex-1 overflow-hidden bg-brand-bg py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-6">
        <Card className="relative overflow-hidden border-brand-electric/45 bg-brand-surface/88 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.16)] sm:p-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-brand-white/75"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-brand-white/75"
          />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft">
                {"{} INSCRIPCIÓN"}
              </p>
              <h1 className="mt-4 font-display text-[1.2rem] uppercase leading-[1.45] text-brand-white [text-shadow:3px_3px_0_var(--brand-electric)] sm:text-[1.55rem] lg:text-[2rem]">
                INSCRIBE TU EQUIPO
              </h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
                {BRANDING.eventName} · {BRANDING.thematicLine}
              </p>
              <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-brand-muted">
                Completa la información de tu equipo, integrantes y preferencias de retos para
                participar en Hackathon de Turismo Creativo I.
              </p>
            </div>
            <ButtonLink href="/" variant="secondary" className="w-full sm:w-auto">
              Volver a inicio
            </ButtonLink>
          </div>
        </Card>
        {children}
      </div>
    </main>
  );
}

import { BRANDING } from "@/lib/constants/branding";
import { ButtonLink, Card } from "@/lib/ui";

export function RegistrationClosedScreen() {
  return (
    <main className="relative left-1/2 right-1/2 flex w-screen -translate-x-1/2 flex-1 overflow-hidden bg-brand-bg py-14 sm:py-18 lg:py-24">
      <div className="mx-auto w-[min(980px,calc(100%-2rem))]">
        <Card className="relative overflow-hidden border-brand-orange/55 bg-brand-surface/92 p-6 text-center shadow-[0_0_0_1px_rgba(255,107,0,0.18),0_18px_42px_rgba(8,20,45,0.55)] sm:p-8 lg:p-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 h-7 w-7 border-r-2 border-t-2 border-brand-orange-soft/80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 left-5 h-7 w-7 border-b-2 border-l-2 border-brand-orange-soft/80"
          />

          <p className="mx-auto inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft">
            {BRANDING.thematicLine}
          </p>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-[1.05rem] uppercase leading-[1.6] text-brand-white [text-shadow:3px_3px_0_var(--brand-electric)] sm:text-[1.45rem] lg:text-[1.8rem]">
            Las inscripciones para la Hackathon de Turismo Creativo Vol. 1 han cerrado
          </h1>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 font-mono text-sm leading-relaxed text-brand-muted sm:text-base">
            <p>
              Si te inscribiste, nos pondremos en contacto en las próximas horas.
            </p>
            <p>
              Si no pudiste en esta oportunidad, te esperamos en el Vol. 2 de la
              Hackathon.
            </p>
            <p className="text-brand-white">
              Pendiente en nuestras redes:{" "}
              <span className="text-brand-orange-soft">@c3.elsalvador</span> y{" "}
              <span className="text-brand-orange-soft">@poliedrica_sv</span>
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/" variant="secondary">
              Volver al inicio
            </ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}

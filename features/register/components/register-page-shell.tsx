import { ButtonLink, Card } from "@/lib/ui";

export function RegisterPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 py-8 sm:py-10">
      <div className="container-shell space-y-5">
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
                Registro por equipos 3H
              </p>
              <h1 className="mt-2 font-display text-lg uppercase leading-relaxed sm:text-2xl">
                Inscripción Hackathon Creativa
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-brand-muted">
                Un representante registra al equipo completo: Hacker, Hipster y Hustler.
              </p>
            </div>
            <ButtonLink href="/" variant="secondary">
              Volver a landing
            </ButtonLink>
          </div>
        </Card>
        {children}
      </div>
    </main>
  );
}

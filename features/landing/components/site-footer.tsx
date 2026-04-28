import { BRANDING } from "@/lib/constants/branding";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-electric/30 bg-brand-bg/70 py-8">
      <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xs uppercase text-brand-white">{BRANDING.eventName}</p>
          <p className="mt-2 text-sm text-brand-muted">{BRANDING.eventSubtitle}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
            {BRANDING.thematicLine}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Contacto
          </p>
          <p className="mt-2 text-sm text-brand-muted">hola@festivaldecodigo.dev</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Legal
          </p>
          <ul className="mt-2 space-y-1 text-sm text-brand-muted">
            <li>Política de privacidad (placeholder)</li>
            <li>Código de conducta (placeholder)</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Organización
          </p>
          <p className="mt-2 text-sm text-brand-muted">{BRANDING.organizers}</p>
          <p className="mt-1 text-sm text-brand-muted">{BRANDING.dateVenue}</p>
        </div>
      </div>
    </footer>
  );
}

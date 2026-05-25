export function SiteFooter() {
  return (
    <footer className="border-t border-brand-electric/25 bg-brand-bg py-12 sm:py-14">
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div className="space-y-3">
          <p className="font-display text-[0.65rem] uppercase leading-[1.8] text-brand-white sm:text-xs">
            {"HACKATHON DE TURISMO CREATIVO I"}
          </p>
          <p className="font-mono text-sm leading-relaxed text-brand-muted">
            Hackathon de Turismo Creativo
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-orange">
            {"+TURISMO +C\u00D3DIGO +CULTURA"}
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-electric">CONTACTO</p>
          <a
            href="mailto:competitivecodingclub.sv@gmail.com"
            className="block break-words font-mono text-sm leading-relaxed text-brand-white transition-colors hover:text-brand-orange"
          >
            competitivecodingclub.sv@gmail.com
          </a>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-electric">{"ORGANIZACI\u00D3N"}</p>
          <p className="font-mono text-sm leading-relaxed text-brand-white">{"Poli\u00E9drica + C3"}</p>
          <p className="font-mono text-sm leading-relaxed text-brand-muted">{"11 y 12 de julio \u00B7 Key Institute"}</p>
        </div>
      </div>
    </footer>
  );
}

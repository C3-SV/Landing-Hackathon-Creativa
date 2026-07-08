import type { Metadata } from "next";
import Link from "next/link";
import { codeOfConductSections, codeOfConductSummary } from "@/lib/code-of-conduct/content";
import { BRANDING } from "@/lib/constants/branding";
import { buildPageMetadata, getWebPageJsonLd } from "@/lib/seo/metadata";
import { Badge, Card } from "@/lib/ui";

export const metadata: Metadata = buildPageMetadata({
  path: "/codigo-de-conducta",
  title: "Código de Conducta | Hackathon de Turismo Creativo Vol. 1",
  description: codeOfConductSummary,
});

export default function CodeOfConductPage() {
  const webPageJsonLd = getWebPageJsonLd({
    path: "/codigo-de-conducta",
    description: codeOfConductSummary,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <main className="flex-1 overflow-x-hidden bg-brand-bg pb-16 pt-8">
        <section className="container-shell">
          <div className="pixel-divider mb-8" />

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge>HTC VOL. 1</Badge>
                <Badge className="border-brand-orange-soft/50 bg-brand-orange-soft/15 text-brand-orange-soft">
                  Código de Conducta
                </Badge>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-electric">
                  {BRANDING.thematicLine}
                </p>
                <h1 className="mt-4 max-w-3xl font-display text-2xl uppercase leading-[1.45] text-brand-white sm:text-3xl lg:text-4xl">
                  Código de Conducta
                </h1>
                <p className="mt-4 text-lg font-semibold text-brand-orange-soft">
                  Hackathon de Turismo Creativo Vol. 1
                </p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
                  {codeOfConductSummary}
                </p>
              </div>
            </div>

            <Card className="relative overflow-hidden p-5 sm:p-6">
              <div className="absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand-orange-soft" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
                Lectura obligatoria
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-white/90">
                Este documento aplica para participantes, mentores, jurados,
                organizadores, voluntarios y aliados. Es el marco base de
                convivencia, colaboración y espíritu de HTC Vol. 1.
              </p>
            </Card>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {codeOfConductSections.map((section, index) => (
              <Card key={section.title} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="min-w-12 font-display text-sm text-brand-orange-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-sm uppercase leading-7 text-brand-white sm:text-base">
                      {section.title}
                    </h2>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-brand-muted">
                      {section.content.map((paragraph) => (
                        <p
                          key={paragraph}
                          className={
                            paragraph.startsWith("- ")
                              ? "pl-4 text-brand-white/85 before:mr-2 before:text-brand-orange-soft before:content-['•']"
                              : undefined
                          }
                        >
                          {paragraph.startsWith("- ") ? paragraph.slice(2) : paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-brand-electric/25 pt-6">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wide text-brand-muted hover:text-brand-white"
            >
              Volver al sitio
            </Link>
            <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
              {BRANDING.organizers}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CodeOfConductDocument } from "@/features/code-of-conduct/code-of-conduct-document";
import { codeOfConductSummary } from "@/lib/code-of-conduct/content";
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
          <div className="mx-auto w-full max-w-[920px]">
            <div className="pixel-divider mb-8" />

            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge>HTC VOL. 1</Badge>
                <Badge className="border-brand-orange-soft/50 bg-brand-orange-soft/15 text-brand-orange-soft">
                  Código de Conducta
                </Badge>
              </div>
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-electric">
                  {BRANDING.thematicLine}
                </p>
                <h1 className="max-w-3xl font-display text-2xl uppercase leading-[1.45] text-brand-white sm:text-3xl lg:text-4xl">
                  Código de Conducta
                </h1>
                <p className="text-lg font-semibold text-brand-orange-soft">
                  Hackathon de Turismo Creativo Vol. 1
                </p>
                <p className="max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
                  {codeOfConductSummary}
                </p>
              </div>
            </div>

            <Card className="relative mt-8 overflow-hidden p-5 sm:p-6">
              <div className="absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand-orange-soft" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
                Lectura obligatoria
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-white/90 sm:text-[15px]">
                Este documento aplica para participantes, mentores, jurados,
                organizadores, voluntarios y aliados. Es el marco base de
                convivencia, colaboración y espíritu de HTC Vol. 1.
              </p>
            </Card>

            <div className="mt-8">
              <CodeOfConductDocument />
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
          </div>
        </section>
      </main>
    </>
  );
}

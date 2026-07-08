import Image from "next/image";
import { BRANDING } from "@/lib/constants/branding";
import { Card, cn } from "@/lib/ui";

type Sponsor = {
  name: string;
  level: string;
  href: string;
  logoSrc: string;
  logoAlt: string;
  linkLabel: string;
  width: number;
  height: number;
  featured?: boolean;
  unoptimized?: boolean;
};

const SPONSORS: Sponsor[] = [
  {
    name: "Key Institute",
    level: "Ultra Legend Partner",
    href: "https://www.keyinstitute.com/",
    logoSrc: "/images/sponsors/key-institute.png",
    logoAlt: "Key Institute — Ultra Legend Partner",
    linkLabel: "Abrir sitio oficial de Key Institute en una nueva pestaña",
    width: 2564,
    height: 432,
    featured: true,
  },
  {
    name: "SVNet",
    level: "Legend Partner",
    href: "https://svnet.sv/",
    logoSrc: "/images/sponsors/svnet.svg",
    logoAlt: "SVNet — Legend Partner",
    linkLabel: "Abrir sitio oficial de SVNet en una nueva pestaña",
    width: 1627,
    height: 520,
    unoptimized: true,
  },
];

export function SponsorsSection() {
  return (
    <section
      id="sponsors"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-6">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 07 / SPONSORS / ALIADOS"}
        </p>

        <h2 className="mt-7 font-display text-[1.9rem] uppercase leading-[1.22] tracking-[0.05em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.6rem] lg:text-[3.9rem]">
          PATROCINADORES Y ALIADOS
        </h2>

        <p className="max-w-[980px] text-base leading-relaxed text-brand-white/92 sm:text-lg">
          {`Key Institute y SVNet se suman a ${BRANDING.eventName} con presencia destacada dentro del ecosistema que impulsa turismo, código y cultura.`}
        </p>

        <div className="space-y-5 lg:space-y-6">
          {SPONSORS.map((sponsor) => (
            <Card
              key={sponsor.name}
              className={cn(
                "group relative overflow-hidden rounded-[1.8rem] p-6 sm:p-8",
                sponsor.featured
                  ? "border-brand-orange/70 bg-brand-surface shadow-[0_0_0_1px_rgba(255,167,38,0.2),0_22px_46px_rgba(10,31,61,0.58)] lg:p-10"
                  : "border-brand-electric/45 bg-brand-surface/85 shadow-[0_0_0_1px_rgba(26,130,255,0.12),0_18px_38px_rgba(10,31,61,0.52)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2",
                  sponsor.featured ? "border-brand-orange-soft/85" : "border-brand-white/80",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2",
                  sponsor.featured ? "border-brand-orange-soft/85" : "border-brand-white/80",
                )}
              />

              <div
                className={cn(
                  "grid gap-6 lg:items-center",
                  sponsor.featured
                    ? "lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8"
                    : "lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]",
                )}
              >
                <div className="space-y-3 lg:space-y-4">
                  <p
                    className={cn(
                      "inline-flex items-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em]",
                      sponsor.featured
                        ? "border-brand-orange bg-brand-orange/10 text-brand-orange-soft"
                        : "border-brand-electric/65 bg-brand-electric/10 text-brand-white",
                    )}
                  >
                    {sponsor.level}
                  </p>

                  <h3
                    className={cn(
                      "font-mono text-xl font-semibold uppercase text-brand-white sm:text-2xl",
                      sponsor.featured && "sm:text-[1.75rem]",
                    )}
                  >
                    {sponsor.name}
                  </h3>
                </div>

                <a
                  href={sponsor.href}
                  target="_blank"
                  rel="sponsored noopener"
                  aria-label={sponsor.linkLabel}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border p-4 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface sm:p-6",
                    sponsor.featured
                      ? "min-h-[200px] border-brand-orange/35 bg-white shadow-[inset_0_0_0_1px_rgba(255,167,38,0.12)] hover:border-brand-orange/55 hover:shadow-[inset_0_0_0_1px_rgba(255,167,38,0.18),0_16px_30px_rgba(8,20,45,0.2)] sm:min-h-[240px] lg:min-h-[280px]"
                      : "min-h-[180px] border-brand-electric/30 bg-white/95 shadow-[inset_0_0_0_1px_rgba(26,130,255,0.08)] hover:border-brand-electric/55 hover:shadow-[inset_0_0_0_1px_rgba(26,130,255,0.14),0_16px_30px_rgba(8,20,45,0.18)] sm:min-h-[220px]",
                  )}
                >
                  <Image
                    src={sponsor.logoSrc}
                    alt={sponsor.logoAlt}
                    width={sponsor.width}
                    height={sponsor.height}
                    unoptimized={sponsor.unoptimized}
                    sizes="(min-width: 1024px) 58rem, 100vw"
                    className={cn(
                      "h-auto w-full object-contain",
                      sponsor.featured
                        ? "max-h-[124px] sm:max-h-[156px] lg:max-h-[180px]"
                        : "max-h-[108px] sm:max-h-[136px] lg:max-h-[150px]",
                    )}
                  />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

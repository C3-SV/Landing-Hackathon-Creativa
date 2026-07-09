import Image from "next/image";
import { BRANDING } from "@/lib/constants/branding";
import { Card, cn } from "@/lib/ui";

type Sponsor = {
  name: string;
  level: string;
  href?: string;
  logoSrc: string;
  logoAlt: string;
  linkLabel?: string;
  width: number;
  height: number;
  logoClassName: string;
  featured?: boolean;
  unoptimized?: boolean;
};

const LOGO_FRAME_CLASS =
  "relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border bg-white p-4 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface sm:min-h-[240px] sm:p-6 lg:min-h-[280px]";

const SPONSORS: Sponsor[] = [
  {
    name: "Key Institute",
    level: "ULTRA LEGEND PARTNER",
    href: "https://www.keyinstitute.com/",
    logoSrc: "/images/sponsors/key-institute.png",
    logoAlt: "Key Institute - Ultra Legend Partner",
    linkLabel: "Abrir sitio oficial de Key Institute en una nueva pestaña",
    width: 2564,
    height: 432,
    logoClassName: "max-h-[124px] max-w-[100%] sm:max-h-[156px] lg:max-h-[180px]",
    featured: true,
  },
  {
    name: "SVNet",
    level: "LEGEND PARTNER",
    href: "https://svnet.sv/",
    logoSrc: "/images/sponsors/svnet.svg",
    logoAlt: "SVNet - Legend Partner",
    linkLabel: "Abrir sitio oficial de SVNet en una nueva pestaña",
    width: 1627,
    height: 520,
    logoClassName: "max-h-[118px] max-w-[85%] sm:max-h-[146px] lg:max-h-[168px]",
    unoptimized: true,
  },
  {
    name: "Host Comunicaciones",
    level: "EPIC BUILDER",
    logoSrc: "/images/sponsors/host-comunicaciones.png",
    logoAlt: "Host Comunicaciones - Epic Builder",
    width: 2337,
    height: 818,
    logoClassName: "max-h-[88px] max-w-[65%] sm:max-h-[108px] lg:max-h-[126px]",
  },
];

function SponsorLogoFrame({ sponsor }: { sponsor: Sponsor }) {
  const commonClassName = cn(
    LOGO_FRAME_CLASS,
    sponsor.href
      ? sponsor.featured
        ? "cursor-pointer border-brand-orange/35 shadow-[inset_0_0_0_1px_rgba(255,167,38,0.12)] hover:border-brand-orange/55 hover:shadow-[inset_0_0_0_1px_rgba(255,167,38,0.18),0_16px_30px_rgba(8,20,45,0.2)]"
        : "cursor-pointer border-brand-electric/30 shadow-[inset_0_0_0_1px_rgba(26,130,255,0.08)] hover:border-brand-electric/55 hover:shadow-[inset_0_0_0_1px_rgba(26,130,255,0.14),0_16px_30px_rgba(8,20,45,0.18)]"
      : sponsor.featured
        ? "cursor-default border-brand-orange/35 shadow-[inset_0_0_0_1px_rgba(255,167,38,0.12)]"
        : "cursor-default border-brand-electric/30 shadow-[inset_0_0_0_1px_rgba(26,130,255,0.08)]",
  );

  const image = (
    <Image
      src={sponsor.logoSrc}
      alt={sponsor.logoAlt}
      width={sponsor.width}
      height={sponsor.height}
      unoptimized={sponsor.unoptimized}
      sizes="(min-width: 1024px) 58rem, 100vw"
      className={cn("h-auto w-auto max-w-full object-contain", sponsor.logoClassName)}
    />
  );

  if (!sponsor.href) {
    return <div className={commonClassName}>{image}</div>;
  }

  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="sponsored noopener"
      aria-label={sponsor.linkLabel}
      className={commonClassName}
    >
      {image}
    </a>
  );
}

export function SponsorsSection() {
  return (
    <section
      id="sponsors"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] space-y-6">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 08 / SPONSORS / ALIADOS"}
        </p>

        <h2 className="mt-7 font-display text-[1.9rem] uppercase leading-[1.22] tracking-[0.05em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.6rem] lg:text-[3.9rem]">
          PATROCINADORES Y ALIADOS
        </h2>

        <p className="max-w-[980px] text-base leading-relaxed text-brand-white/92 sm:text-lg">
          {`Key Institute, SVNet y Host Comunicaciones se suman a ${BRANDING.eventName} con presencia destacada dentro del ecosistema que impulsa turismo, código y cultura.`}
        </p>

        <div className="space-y-5 lg:space-y-6">
          {SPONSORS.map((sponsor) => (
            <Card
              key={sponsor.name}
              className={cn(
                "group relative overflow-hidden rounded-[1.8rem] p-6 sm:p-8 lg:p-10",
                sponsor.featured
                  ? "border-brand-orange/70 bg-brand-surface shadow-[0_0_0_1px_rgba(255,167,38,0.2),0_22px_46px_rgba(10,31,61,0.58)]"
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

              <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-center lg:gap-8">
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

                <SponsorLogoFrame sponsor={sponsor} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

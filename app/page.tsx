import type { Metadata } from "next";
import {
  AboutSection,
  ChallengeGrid,
  EventSpiritSection,
  FaqSection,
  HowItWorksSection,
  LandingHero,
  OrganizersSection,
  SiteFooter,
  SponsorsSection,
} from "@/features/landing/components";
import { FAQ_ITEMS } from "@/lib/constants/event";
import { SITE_URL, buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  title: "Hackathon de Turismo Creativo I | C3",
  description:
    "Sitio oficial del Hackathon de Turismo Creativo I. Conoce los retos, formato, organizadores, preguntas frecuentes e inscripcion.",
});

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="flex-1 overflow-x-hidden bg-brand-bg pb-14 pt-8 sm:pt-10">
        <LandingHero />
        <AboutSection />
        <EventSpiritSection />
        <ChallengeGrid />
        <HowItWorksSection />
        <OrganizersSection />
        <SponsorsSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

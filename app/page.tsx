import type { Metadata } from "next";
import {
  AboutSection,
  ChallengeGrid,
  EventSpiritSection,
  FaqSection,
  HowItWorksSection,
  LandingHero,
  OrganizersSection,
  PremiosABCSection,
  SiteFooter,
  SponsorsSection,
  Team3HSection,
} from "@/features/landing/components";
import { FAQ_ITEMS } from "@/lib/constants/event";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  OG_LOCALE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_ROOT_URL,
  getWebPageJsonLd,
} from "@/lib/seo/metadata";

export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
  title: "Hackathon de Turismo Creativo Vol. 1 | C3 + Poliédrica",
  description:
    "Hackathon de Turismo Creativo Vol. 1 une turismo, código y cultura para crear prototipos y soluciones colaborativas a retos reales. Una iniciativa organizada por C3 y Poliédrica.",
  keywords: [
    "Hackathon de Turismo Creativo Vol. 1",
    "hackathon turismo El Salvador",
    "hackathon El Salvador",
    "hackathon tecnología El Salvador",
    "turismo creativo",
    "código y cultura",
    "C3",
    "Competitive Coding Club",
    "Poliédrica",
    "prototipos",
    "retos reales",
    "innovación turística",
    "builders El Salvador",
    "talento técnico joven",
  ],
  alternates: {
    canonical: SITE_ROOT_URL,
  },
  openGraph: {
    title: "Hackathon de Turismo Creativo Vol. 1 | + Turismo + Código + Cultura",
    description:
      "Una experiencia de creación colaborativa donde turismo, código y cultura se unen para construir prototipos y soluciones a retos reales. Organizado por C3 y Poliédrica.",
    url: SITE_ROOT_URL,
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon de Turismo Creativo Vol. 1",
    description:
      "+ Turismo + Código + Cultura. Todo Suma. Un hackathon organizado por C3 y Poliédrica para crear soluciones desde tecnología, turismo y cultura.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
};

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
        item: SITE_ROOT_URL,
      },
    ],
  };

  const webPageJsonLd = getWebPageJsonLd({
    path: "/",
    description: DEFAULT_DESCRIPTION,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
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
        <Team3HSection />
        <PremiosABCSection />
        <OrganizersSection />
        <SponsorsSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

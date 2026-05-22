import type { Metadata } from "next";

export const SITE_URL = "https://hackathon.c3.com.sv";
export const SITE_ORIGIN = new URL(SITE_URL);

export const SITE_NAME = "Hackathon de Turismo Creativo I";
export const SITE_SUBTITLE = "Hackathon de Turismo Creativo";
export const DEFAULT_TITLE = `${SITE_NAME} | C3`;
export const DEFAULT_DESCRIPTION =
  "Sitio oficial del Hackathon de Turismo Creativo I. Un fin de semana para construir soluciones reales donde el turismo, el codigo y la cultura se encuentran.";
export const DEFAULT_OG_IMAGE = "/images/hero-festival-pc.png";
export const DEFAULT_OG_IMAGE_ALT =
  "Ilustracion principal del Hackathon de Turismo Creativo I";

export const OG_LOCALE = "es_SV";
export const CONTENT_LANGUAGE = "es-SV";

type BuildPageMetadataInput = {
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
  indexable?: boolean;
};

export function buildPageMetadata({
  path = "/",
  title,
  description,
  type = "website",
  indexable = true,
}: BuildPageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_ORIGIN).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1280,
          height: 976,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_SUBTITLE,
    url: SITE_URL,
    inLanguage: CONTENT_LANGUAGE,
    publisher: {
      "@type": "Organization",
      name: "C3 | Competitive Coding Club",
      url: "https://c3.com.sv",
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "C3 | Competitive Coding Club",
    url: "https://c3.com.sv",
    email: "competitivecodingclub.sv@gmail.com",
    sameAs: ["https://www.c3.com.sv/", "https://copa.c3.com.sv/"],
  };
}

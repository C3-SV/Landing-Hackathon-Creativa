import type { Metadata } from "next";

export const SITE_URL = "https://hackathon.c3.com.sv";
export const SITE_ORIGIN = new URL(SITE_URL);
export const SITE_ROOT_URL = new URL("/", SITE_ORIGIN).toString();

export const SITE_NAME = "Hackathon de Turismo Creativo I";
export const SITE_SUBTITLE = "+ Turismo + Código + Cultura";
export const DEFAULT_TITLE = `${SITE_NAME} | C3 + Poliédrica`;
export const DEFAULT_DESCRIPTION =
  "Hackathon de Turismo Creativo I une turismo, código y cultura para crear prototipos y soluciones colaborativas a retos reales. Una iniciativa organizada por C3 y Poliédrica.";
export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const DEFAULT_OG_IMAGE_ALT =
  "Hackathon de Turismo Creativo I, + Turismo + Código + Cultura, organizado por C3 y Poliédrica";

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
          width: 1200,
          height: 630,
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
    "@id": `${SITE_ROOT_URL}#website`,
    name: SITE_NAME,
    alternateName: SITE_SUBTITLE,
    url: SITE_ROOT_URL,
    inLanguage: CONTENT_LANGUAGE,
    description: DEFAULT_DESCRIPTION,
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ROOT_URL}#c3`,
        name: "C3 / Competitive Coding Club",
        url: "https://c3.com.sv",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_ROOT_URL}#poliedrica`,
        name: "Poliédrica",
        url: "https://poliedrica.sv",
      },
    ],
  };
}

export function getWebPageJsonLd({
  path = "/",
  description = DEFAULT_DESCRIPTION,
}: {
  path?: string;
  description?: string;
}) {
  const url = new URL(path, SITE_ORIGIN).toString();

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: SITE_NAME,
    description,
    inLanguage: CONTENT_LANGUAGE,
    isPartOf: {
      "@id": `${SITE_ROOT_URL}#website`,
    },
    about: [
      {
        "@id": `${SITE_ROOT_URL}#c3`,
      },
      {
        "@id": `${SITE_ROOT_URL}#poliedrica`,
      },
    ],
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: new URL(DEFAULT_OG_IMAGE, SITE_ORIGIN).toString(),
      caption: DEFAULT_OG_IMAGE_ALT,
    },
  };
}

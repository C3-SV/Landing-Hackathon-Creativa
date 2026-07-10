import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Press_Start_2P, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PreviewAccessControls } from "@/features/site-access/components/preview-access-controls";
import { getPreviewUserFromCookies } from "@/lib/auth/preview-access";
import { APP_ENV } from "@/lib/constants/env";
import {
  CONTENT_LANGUAGE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  OG_LOCALE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_ROOT_URL,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/seo/metadata";
import "./globals.css";

const fontBody = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const fontDisplay = Press_Start_2P({
  variable: "--font-pressstart",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
  applicationName: SITE_NAME,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_ROOT_URL,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  other: {
    "content-language": CONTENT_LANGUAGE,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081326",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const previewUser =
    APP_ENV.siteLockEnabled ? await getPreviewUserFromCookies() : null;
  const websiteJsonLd = getWebsiteJsonLd();
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html
      lang="es-SV"
      className={`${fontBody.variable} ${fontMono.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {previewUser ? <PreviewAccessControls userEmail={previewUser.email} /> : null}
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
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

const fontVariables = {
  "--font-sora":
    '"Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  "--font-jetbrains":
    '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  "--font-pressstart":
    '"Arial Black", "Segoe UI Black", Impact, system-ui, sans-serif',
} as CSSProperties;

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
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
      style={fontVariables}
      className="h-full antialiased"
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

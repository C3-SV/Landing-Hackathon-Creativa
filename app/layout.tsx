import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P, Sora } from "next/font/google";
import { PreviewAccessControls } from "@/features/site-access/components/preview-access-controls";
import { getPreviewUserFromCookies } from "@/lib/auth/preview-access";
import { BRANDING } from "@/lib/constants/branding";
import { APP_ENV } from "@/lib/constants/env";
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
  title: `${BRANDING.eventName} · ${BRANDING.eventSubtitle}`,
  description: `${BRANDING.concept}. ${BRANDING.eventSubtitle}. ${BRANDING.thematicLine}.`,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const previewUser =
    APP_ENV.siteLockEnabled ? await getPreviewUserFromCookies() : null;

  return (
    <html
      lang="es"
      className={`${fontBody.variable} ${fontMono.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-white">
        {previewUser ? <PreviewAccessControls userEmail={previewUser.email} /> : null}
        {children}
      </body>
    </html>
  );
}

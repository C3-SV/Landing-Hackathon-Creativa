import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P, Sora } from "next/font/google";
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
  title: "Hackathon Creativa",
  description:
    "Cultura + código para construir soluciones reales en turismo, economía creativa y tecnología.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fontBody.variable} ${fontMono.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-white">
        {children}
      </body>
    </html>
  );
}

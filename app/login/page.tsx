import { Suspense } from "react";
import type { Metadata } from "next";
import { PreviewLoginForm } from "@/features/site-access/components/preview-login-form";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/login",
  title: "Acceso | Hackathon de Turismo Creativo Vol. 1",
  description: "Acceso restringido del sitio.",
  indexable: false,
});

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <PreviewLoginForm />
      </Suspense>
    </main>
  );
}

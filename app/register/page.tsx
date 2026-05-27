import type { Metadata } from "next";
import { RegisterPageShell, TeamRegistrationForm } from "@/features/register/components";
import { registrationRepository } from "@/lib/repositories";
import { SITE_ORIGIN, SITE_ROOT_URL, buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  path: "/register",
  title: "Inscripcion | Hackathon de Turismo Creativo I",
  description:
    "Inscribe tu equipo en el Hackathon de Turismo Creativo I y selecciona tus tres retos de preferencia para participar.",
});

export default async function RegisterPage() {
  const [edition, challenges] = await Promise.all([
    registrationRepository.getCurrentEdition(),
    registrationRepository.getChallenges(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: SITE_ROOT_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Inscripcion",
                item: new URL("/register", SITE_ORIGIN).toString(),
              },
            ],
          }),
        }}
      />
      <RegisterPageShell>
        <TeamRegistrationForm editionId={edition.id} challenges={challenges} />
      </RegisterPageShell>
    </>
  );
}

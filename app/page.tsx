import {
  AboutSection,
  ChallengeGrid,
  FactsStrip,
  FaqSection,
  HowItWorksSection,
  LandingHero,
  OrganizersSection,
  SiteFooter,
  SponsorsSection,
} from "@/features/landing/components";
import { registrationRepository } from "@/lib/repositories";

export default async function HomePage() {
  const challenges = await registrationRepository.getChallenges();

  return (
    <>
      <main className="flex-1 pb-14 pt-8 sm:pt-10">
        <div className="container-shell space-y-10 sm:space-y-14">
          <LandingHero />
          <AboutSection />
          <HowItWorksSection />
          <ChallengeGrid challenges={challenges} />
          <FactsStrip />
          <OrganizersSection />
          <SponsorsSection />
          <FaqSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

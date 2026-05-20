import {
  AboutSection,
  ChallengeGrid,
  EventSpiritSection,
  FaqSection,
  HowItWorksSection,
  LandingHero,
  OrganizersSection,
  SiteFooter,
  SponsorsSection,
} from "@/features/landing/components";

export default function HomePage() {
  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-brand-bg pb-14 pt-8 sm:pt-10">
        <LandingHero />
        <AboutSection />
        <EventSpiritSection />
        <ChallengeGrid />
        <HowItWorksSection />
        <OrganizersSection />
        <SponsorsSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

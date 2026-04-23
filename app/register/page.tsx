import { RegisterPageShell, TeamRegistrationForm } from "@/features/register/components";
import { registrationRepository } from "@/lib/repositories";

export default async function RegisterPage() {
  const [edition, challenges] = await Promise.all([
    registrationRepository.getCurrentEdition(),
    registrationRepository.getChallenges(),
  ]);

  return (
    <RegisterPageShell>
      <TeamRegistrationForm editionId={edition.id} challenges={challenges} />
    </RegisterPageShell>
  );
}

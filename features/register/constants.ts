import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";

export type RegisterSectionId =
  | "general"
  | "team"
  | "hacker"
  | "hipster"
  | "hustler"
  | "confirm";

export const REGISTER_SECTIONS: Array<{
  id: RegisterSectionId;
  title: string;
  subtitle: string;
}> = [
  {
    id: "general",
    title: "Datos generales",
    subtitle: "Persona responsable y canal de origen",
  },
  {
    id: "team",
    title: "Equipo",
    subtitle: "Identidad del equipo y retos top 3",
  },
  {
    id: "hacker",
    title: "Hacker",
    subtitle: "Perfil técnico principal",
  },
  {
    id: "hipster",
    title: "Hipster",
    subtitle: "Perfil de diseño / experiencia",
  },
  {
    id: "hustler",
    title: "Hustler",
    subtitle: "Perfil de negocio / validación",
  },
  {
    id: "confirm",
    title: "Confirmación",
    subtitle: "Resumen, validaciones y consentimientos",
  },
];

function createMemberBase() {
  return {
    firstName: "",
    lastName: "",
    preferredName: "",
    email: "",
    phone: "",
    affiliationType: "",
    institution: "",
    degreeOrMajor: "",
    skillLevel: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    dietaryRestrictions: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  };
}

export function buildDefaultRegistrationValues(
  editionId: string,
): TeamRegistrationFormValues {
  return {
    editionId,
    teamName: "",
    institution: "",
    teamDescription: "",
    challengePreferences: ["", "", ""],
    responsibleName: "",
    responsibleEmail: "",
    responsiblePhone: "",
    source: "",
    hacker: { role3H: "hacker", ...createMemberBase() },
    hipster: { role3H: "hipster", ...createMemberBase() },
    hustler: { role3H: "hustler", ...createMemberBase() },
    consents: {
      acceptCodeOfConduct: false,
      acceptPrivacyPolicy: false,
      mediaConsent: false,
      dataSharingConsent: false,
      authorizationDeclaration: false,
    },
  };
}

import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";

export type RegisterSectionId =
  | "general"
  | "team"
  | "hacker"
  | "hipster"
  | "hustler"
  | "extra"
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
    subtitle: "Identidad del equipo, tamaño y retos top 3",
  },
  {
    id: "hacker",
    title: "Hacker",
    subtitle: "Perfil técnico principal",
  },
  {
    id: "hipster",
    title: "Hipster",
    subtitle: "Perfil de diseño y experiencia",
  },
  {
    id: "hustler",
    title: "Hustler",
    subtitle: "Perfil de negocio y validación",
  },
  {
    id: "extra",
    title: "Integrante extra",
    subtitle: "Opcional si el equipo es de 4 integrantes",
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
    about: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  };
}

export function createExtraMemberDefault() {
  return {
    role3H: "hacker" as const,
    ...createMemberBase(),
  };
}

export function buildDefaultRegistrationValues(
  editionId: string,
): TeamRegistrationFormValues {
  return {
    editionId,
    teamSize: 3,
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
    extraMember: undefined,
    consents: {
      acceptCodeOfConduct: false,
      acceptPrivacyPolicy: false,
      mediaConsent: false,
      dataSharingConsent: false,
      authorizationDeclaration: false,
    },
  };
}

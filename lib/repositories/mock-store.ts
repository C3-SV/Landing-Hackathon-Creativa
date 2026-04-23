import {
  CHALLENGE_SEEDS,
  EDITION_SEEDS,
  CURRENT_EDITION_FALLBACK,
} from "@/lib/constants/event";
import { normalizeTeamName, toSlug } from "@/lib/utils";
import type {
  Challenge,
  Edition,
  RegistrationStatus,
  TeamRegistrationDoc,
} from "@/lib/types/domain";

type MockStore = {
  challenges: Challenge[];
  editions: Edition[];
  registrations: TeamRegistrationDoc[];
};

declare global {
  var __HC_MOCK_STORE__: MockStore | undefined;
}

const sampleStatuses: RegistrationStatus[] = [
  "submitted",
  "approved",
  "waitlist",
  "needs_fix",
];

function createSeedRegistrations() {
  const now = Date.now();

  const baseTeams = [
    {
      teamName: "Pixel Atlas",
      institution: "Universidad de El Salvador",
      responsibleName: "Camila Rivas",
      responsibleEmail: "camila.rivas@example.com",
      challengePreferences: ["touristsv", "datapulse", "twinmap"] as [
        string,
        string,
        string,
      ],
    },
    {
      teamName: "Ruta 503",
      institution: "Universidad Don Bosco",
      responsibleName: "Javier Mejia",
      responsibleEmail: "javier.mejia@example.com",
      challengePreferences: ["creator-kit", "ecotrack", "ar-cultura"] as [
        string,
        string,
        string,
      ],
    },
    {
      teamName: "Cultura Runtime",
      institution: "ITCA-FEPADE",
      responsibleName: "Andrea Cruz",
      responsibleEmail: "andrea.cruz@example.com",
      challengePreferences: ["ar-cultura", "touristsv", "creator-kit"] as [
        string,
        string,
        string,
      ],
    },
    {
      teamName: "Twin Explorers",
      institution: "Universidad Tecnológica",
      responsibleName: "Mario Arévalo",
      responsibleEmail: "mario.arevalo@example.com",
      challengePreferences: ["twinmap", "datapulse", "ecotrack"] as [
        string,
        string,
        string,
      ],
    },
  ];

  return baseTeams.map((seed, index) => {
    const date = new Date(now - (index + 1) * 1000 * 60 * 60 * 24).toISOString();
    const id = `mock_${toSlug(seed.teamName)}`;
    return {
      id,
      editionId: CURRENT_EDITION_FALLBACK,
      teamName: seed.teamName,
      teamNameNormalized: normalizeTeamName(seed.teamName),
      institution: seed.institution,
      teamDescription:
        "Equipo orientado a construir MVP funcional en turismo con enfoque local.",
      challengePreferences: seed.challengePreferences,
      responsibleName: seed.responsibleName,
      responsibleEmail: seed.responsibleEmail,
      responsiblePhone: "+503 7000 0000",
      source: "Comunidad tech",
      members: [
        {
          role3H: "hacker",
          firstName: "Luis",
          lastName: "Perez",
          preferredName: "Lucho",
          email: `hacker.${index}@example.com`,
          phone: "+503 7000 1000",
          affiliationType: "Estudiante",
          institution: seed.institution,
          degreeOrMajor: "Ingeniería en Sistemas",
          skillLevel: "Intermedio",
          linkedinUrl: "https://linkedin.com/in/hacker",
          githubUrl: "https://github.com/hacker",
          portfolioUrl: undefined,
          dietaryRestrictions: undefined,
          allergies: undefined,
          emergencyContactName: "Contacto Hacker",
          emergencyContactPhone: "+503 7000 9100",
        },
        {
          role3H: "hipster",
          firstName: "Sofia",
          lastName: "Lopez",
          preferredName: undefined,
          email: `hipster.${index}@example.com`,
          phone: "+503 7000 2000",
          affiliationType: "Profesional",
          institution: seed.institution,
          degreeOrMajor: "Diseño Digital",
          skillLevel: "Avanzado",
          linkedinUrl: "https://linkedin.com/in/hipster",
          githubUrl: undefined,
          portfolioUrl: "https://portfolio.example.com",
          dietaryRestrictions: "Vegetariano",
          allergies: undefined,
          emergencyContactName: "Contacto Hipster",
          emergencyContactPhone: "+503 7000 9200",
        },
        {
          role3H: "hustler",
          firstName: "Diego",
          lastName: "Martinez",
          preferredName: undefined,
          email: seed.responsibleEmail,
          phone: "+503 7000 3000",
          affiliationType: "Emprendedor",
          institution: seed.institution,
          degreeOrMajor: "Marketing",
          skillLevel: "Intermedio",
          linkedinUrl: "https://linkedin.com/in/hustler",
          githubUrl: undefined,
          portfolioUrl: undefined,
          dietaryRestrictions: undefined,
          allergies: "Ninguna",
          emergencyContactName: "Contacto Hustler",
          emergencyContactPhone: "+503 7000 9300",
        },
      ],
      consents: {
        acceptCodeOfConduct: true,
        acceptPrivacyPolicy: true,
        mediaConsent: true,
        dataSharingConsent: index % 2 === 0,
        authorizationDeclaration: true,
      },
      status: sampleStatuses[index] ?? "submitted",
      assignedChallengeId: index % 2 === 0 ? seed.challengePreferences[0] : undefined,
      adminNotes:
        index % 2 === 0
          ? [
              {
                id: `note_${index}`,
                authorEmail: "admin@hackathoncreativa.dev",
                message: "Equipo con buena cohesión y propuesta clara.",
                createdAt: date,
              },
            ]
          : [],
      createdAt: date,
      updatedAt: date,
    } satisfies TeamRegistrationDoc;
  });
}

export function getMockStore() {
  if (!globalThis.__HC_MOCK_STORE__) {
    globalThis.__HC_MOCK_STORE__ = {
      challenges: [...CHALLENGE_SEEDS],
      editions: [...EDITION_SEEDS],
      registrations: createSeedRegistrations(),
    };
  }

  return globalThis.__HC_MOCK_STORE__;
}

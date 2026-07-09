import {
  CHALLENGE_SEEDS,
  EDITION_SEEDS,
  CURRENT_EDITION_FALLBACK,
} from "@/lib/constants/event";
import { normalizeTeamName, toSlug } from "@/lib/utils";
import type {
  Challenge,
  CodeOfConductAcceptance,
  EmailLog,
  Edition,
  RegistrationSettings,
  RegistrationStatus,
  TeamRegistrationDoc,
  TeamMember,
} from "@/lib/types/domain";

type MockStore = {
  challenges: Challenge[];
  editions: Edition[];
  registrations: TeamRegistrationDoc[];
  emailLogs: EmailLog[];
  codeOfConductAcceptances: CodeOfConductAcceptance[];
  registrationSettings: RegistrationSettings;
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

function longAbout(role: string, focus: string) {
  return `Soy un perfil ${role} con motivación fuerte por crear soluciones reales para turismo. Me interesa trabajar con equipos multidisciplinarios, validar rápido ideas en contexto local y construir prototipos funcionales que la gente pueda usar de verdad. Aporto enfoque práctico, disciplina de ejecución, comunicación clara y capacidad para colaborar durante todo el sprint con criterio técnico y humano. Mi objetivo es que el producto final tenga impacto tangible y continuidad después de la hackathon, con aprendizaje compartido para todo el equipo. ${focus}`;
}

function createMember(
  role3H: TeamMember["role3H"],
  index: number,
  institution: string,
  email: string,
  isRepresentative = false,
) {
  const prefix = role3H;
  return {
    role3H,
    isRepresentative,
    firstName:
      role3H === "hacker" ? "Luis" : role3H === "hipster" ? "Sofia" : "Diego",
    lastName: "Demo",
    preferredName: "",
    email,
    phone: `+503 7000 ${1000 + index}`,
    affiliationType: role3H === "hustler" ? "Emprendedor" : "Estudiante",
    institution,
    degreeOrMajor:
      role3H === "hacker"
        ? "Ingeniería en Sistemas"
        : role3H === "hipster"
          ? "Diseño Digital"
          : "Marketing",
    about: longAbout(prefix, `Además, disfruto resolver retos en equipo con enfoque ${prefix}.`),
    linkedinUrl: `https://linkedin.com/in/${prefix}-${index}`,
    githubUrl: role3H === "hacker" ? `https://github.com/${prefix}-${index}` : undefined,
    portfolioUrl:
      role3H !== "hustler" ? `https://portfolio.example.com/${prefix}-${index}` : undefined,
  } satisfies TeamMember;
}

function createSeedRegistrations() {
  const now = Date.now();
  const baseTeams = [
    {
      teamName: "Pixel Atlas",
      institution: "Universidad de El Salvador",
      teamSize: 3 as const,
      source: "Comunidad tech",
      challengePreferences: ["touristsv", "datapulse", "twinmap"] as const,
      extraRole: undefined,
    },
    {
      teamName: "Ruta 503",
      institution: "Universidad Don Bosco",
      teamSize: 4 as const,
      source: "Instagram",
      challengePreferences: ["creator-kit", "ecotrack", "ar-cultura"] as const,
      extraRole: "hacker" as const,
    },
    {
      teamName: "Cultura Runtime",
      institution: "ITCA-FEPADE",
      teamSize: 3 as const,
      source: "Universidad",
      challengePreferences: ["ar-cultura", "touristsv", "creator-kit"] as const,
      extraRole: undefined,
    },
    {
      teamName: "Twin Explorers",
      institution: "Universidad Tecnológica",
      teamSize: 4 as const,
      source: "Comunidad tech",
      challengePreferences: ["twinmap", "datapulse", "ecotrack"] as const,
      extraRole: "hipster" as const,
    },
  ];

  return baseTeams.map((seed, index) => {
    const date = new Date(now - (index + 1) * 1000 * 60 * 60 * 24).toISOString();
    const id = `mock_${toSlug(seed.teamName)}`;

    const members: TeamMember[] = [
      createMember("hacker", index * 10 + 1, seed.institution, `hacker.${index}@example.com`, true),
      createMember("hipster", index * 10 + 2, seed.institution, `hipster.${index}@example.com`),
      createMember("hustler", index * 10 + 3, seed.institution, `hustler.${index}@example.com`),
    ];

    if (seed.teamSize === 4 && seed.extraRole) {
      members.push(
        createMember(
          seed.extraRole,
          index * 10 + 4,
          seed.institution,
          `extra.${seed.extraRole}.${index}@example.com`,
        ),
      );
    }

    return {
      id,
      editionId: CURRENT_EDITION_FALLBACK,
      teamSize: seed.teamSize,
      teamName: seed.teamName,
      teamNameNormalized: normalizeTeamName(seed.teamName),
      institution: seed.institution,
      teamDescription:
        "Equipo orientado a construir MVP funcional en turismo con enfoque local.",
      challengePreferences: seed.challengePreferences,
      source: seed.source,
      members,
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
                authorEmail: "admin@hackathonc3.dev",
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
      emailLogs: [],
      codeOfConductAcceptances: [],
      registrationSettings: {
        registrationsOpen: true,
        updatedAt: new Date().toISOString(),
        updatedBy: null,
        closedAt: null,
        closedBy: null,
      },
    };
  }

  return globalThis.__HC_MOCK_STORE__;
}

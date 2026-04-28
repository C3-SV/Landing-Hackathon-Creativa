import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const requiredEnv = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

function sanitizeEnv(value) {
  const trimmed = (value ?? "").trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: sanitizeEnv(process.env.FIREBASE_PROJECT_ID),
      clientEmail: sanitizeEnv(process.env.FIREBASE_CLIENT_EMAIL),
      privateKey: sanitizeEnv(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const challenges = [
  {
    id: "touristsv",
    name: "TouristSV",
    description: "Asistente inteligente para experiencia del turista.",
    hub: "AI Experience",
    status: "confirmed",
  },
  {
    id: "creator-kit",
    name: "Creator Kit",
    description: "Contenido y marketing para PYMES turisticas.",
    hub: "Creative Growth",
    status: "confirmed",
  },
  {
    id: "ar-cultura",
    name: "AR Cultura",
    description: "Educacion cultural inmersiva para turismo.",
    hub: "Immersive Tech",
    status: "confirmed",
  },
  {
    id: "ecotrack",
    name: "EcoTrack",
    description: "Turismo ecologico y sostenible.",
    hub: "Sustainability",
    status: "confirmed",
  },
  {
    id: "datapulse",
    name: "DataPulse",
    description: "Recopilacion de informacion para decisiones turisticas.",
    hub: "Intelligence",
    status: "proposed",
  },
  {
    id: "twinmap",
    name: "TwinMap",
    description: "Digital Twins aplicados a turismo.",
    hub: "Spatial Tech",
    status: "proposed",
  },
];

const editionId = process.env.CURRENT_EDITION_ID ?? "festival-de-codigo-i-2026";
const edition = {
  name: "Festival de Código - I 2026",
  isCurrent: true,
  startsAt: "2026-06-20",
  endsAt: "2026-06-21",
  location: "Key Institute",
};

const now = new Date().toISOString();

const registrations = [
  {
    id: "seed_team_codigo_cultura",
    editionId,
    status: "submitted",
    teamSize: 3,
    teamName: "Codigo Cultura",
    teamNameNormalized: "codigo cultura",
    institution: "Universidad de El Salvador",
    teamDescription:
      "Equipo enfocado en prototipos practicos para mejorar la experiencia cultural y turistica con herramientas digitales accesibles.",
    challengePreferences: ["touristsv", "ar-cultura", "creator-kit"],
    source: "Instagram",
    members: [
      {
        role3H: "hacker",
        isRepresentative: true,
        firstName: "Daniela",
        lastName: "Rivas",
        preferredName: "Dani",
        email: "daniela.rivas@example.com",
        phone: "+50370000001",
        affiliationType: "estudiante",
        institution: "Universidad de El Salvador",
        degreeOrMajor: "Ingenieria en Sistemas",
        about:
          "Soy una persona curiosa y orientada a resolver problemas con tecnologia util. Me interesa construir experiencias digitales que conecten cultura y turismo de forma clara. En el equipo aporto organizacion tecnica, desarrollo frontend y backend, y foco en entregar demos funcionales. Quiero participar para aprender de mentorias, colaborar con perfiles distintos y convertir ideas en prototipos reales.",
        linkedinUrl: "https://linkedin.com/in/daniela-rivas",
        githubUrl: "https://github.com/daniela-rivas",
      },
      {
        role3H: "hipster",
        isRepresentative: false,
        firstName: "Maria",
        lastName: "Linares",
        preferredName: "Mare",
        email: "maria.linares@example.com",
        phone: "+50370000002",
        affiliationType: "estudiante",
        institution: "Universidad de El Salvador",
        degreeOrMajor: "Diseno Grafico",
        about:
          "Me describo como disenadora enfocada en experiencias intuitivas con identidad local. Me interesa traducir ideas complejas en interfaces simples, utiles y visualmente coherentes con el contexto cultural. En el equipo aporto investigacion de usuarios, diseno de interaccion y narrativa visual para validar propuestas rapidamente. Quiero participar para co-crear soluciones reales que fortalezcan turismo y economia creativa.",
        linkedinUrl: "https://linkedin.com/in/maria-linares",
        portfolioUrl: "https://portfolio.example.com/maria-linares",
      },
      {
        role3H: "hustler",
        isRepresentative: false,
        firstName: "Carlos",
        lastName: "Mejia",
        email: "carlos.mejia@example.com",
        phone: "+50370000003",
        affiliationType: "profesional",
        institution: "Universidad de El Salvador",
        degreeOrMajor: "Administracion de Empresas",
        about:
          "Soy una persona orientada a ejecucion, alianzas y validacion de impacto. Me interesa conectar soluciones tecnologicas con necesidades reales del sector turistico para que puedan implementarse. En el equipo aporto definicion de propuesta de valor, estructura de pitch de demo y coordinacion con actores clave. Quiero participar para impulsar proyectos viables que generen resultados medibles despues del evento.",
        linkedinUrl: "https://linkedin.com/in/carlos-mejia",
      },
    ],
    consents: {
      acceptCodeOfConduct: true,
      acceptPrivacyPolicy: true,
      mediaConsent: true,
      dataSharingConsent: true,
      authorizationDeclaration: true,
    },
    adminNotes: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "seed_team_turismo_byte",
    editionId,
    status: "approved",
    teamSize: 4,
    teamName: "Turismo Byte",
    teamNameNormalized: "turismo byte",
    institution: "Universidad Don Bosco",
    teamDescription:
      "Equipo multidisciplinario con enfoque build-first para crear herramientas que ayuden a pequenos negocios turisticos a tomar mejores decisiones.",
    challengePreferences: ["datapulse", "ecotrack", "touristsv"],
    source: "Comunidad tech",
    members: [
      {
        role3H: "hacker",
        isRepresentative: true,
        firstName: "Andrea",
        lastName: "Molina",
        email: "andrea.molina@example.com",
        phone: "+50370000011",
        affiliationType: "estudiante",
        institution: "Universidad Don Bosco",
        degreeOrMajor: "Ingenieria en Computacion",
        about:
          "Soy desarrolladora enfocada en datos y productos funcionales. Me interesa construir herramientas que simplifiquen decisiones para equipos con pocos recursos tecnicos. En el equipo aporto arquitectura del prototipo, integracion de datos y desarrollo de APIs para iterar rapido durante la hackathon. Quiero participar para validar ideas con mentoria y convertirlas en soluciones utiles para turismo local.",
        linkedinUrl: "https://linkedin.com/in/andrea-molina",
        githubUrl: "https://github.com/andreamolina",
      },
      {
        role3H: "hipster",
        isRepresentative: false,
        firstName: "Sofia",
        lastName: "Guardado",
        email: "sofia.guardado@example.com",
        phone: "+50370000012",
        affiliationType: "estudiante",
        institution: "Universidad Don Bosco",
        degreeOrMajor: "Diseno Estrategico",
        about:
          "Me interesa disenar productos digitales con enfoque humano y resultados concretos. Me describo como persona colaborativa, detallista y orientada a pruebas rapidas con usuarios. En el equipo aporto diseno de flujos, lenguaje visual y priorizacion de experiencia para que cada decision de producto sea clara. Quiero participar para unir creatividad y tecnologia en propuestas aplicables al turismo.",
        portfolioUrl: "https://portfolio.example.com/sofia-guardado",
      },
      {
        role3H: "hustler",
        isRepresentative: false,
        firstName: "Luis",
        lastName: "Caceres",
        email: "luis.caceres@example.com",
        phone: "+50370000013",
        affiliationType: "profesional",
        institution: "Universidad Don Bosco",
        degreeOrMajor: "Marketing Digital",
        about:
          "Soy profesional de negocio con foco en crecimiento y ejecucion. Me interesa traducir objetivos de impacto en metricas accionables para que el equipo tome decisiones durante la construccion del prototipo. Aporto estrategia de adopcion, narrativa de valor y conexion con necesidades de clientes reales. Quiero participar para impulsar soluciones sostenibles que generen adopcion en turismo.",
        linkedinUrl: "https://linkedin.com/in/luis-caceres",
      },
      {
        role3H: "hacker",
        isRepresentative: false,
        firstName: "Javier",
        lastName: "Abarca",
        email: "javier.abarca@example.com",
        phone: "+50370000014",
        affiliationType: "estudiante",
        institution: "Universidad Don Bosco",
        degreeOrMajor: "Ingenieria de Software",
        about:
          "Me considero un builder practico que disfruta convertir hipotesis en funcionalidades medibles. Me interesa optimizar rendimiento y calidad tecnica sin frenar la velocidad del equipo. Aporto implementacion full stack, pruebas rapidas y soporte en integracion para mantener estabilidad del demo final. Quiero participar para trabajar con perfiles diversos y crear soluciones de turismo con potencial de continuidad.",
        githubUrl: "https://github.com/jabarca",
      },
    ],
    consents: {
      acceptCodeOfConduct: true,
      acceptPrivacyPolicy: true,
      mediaConsent: true,
      dataSharingConsent: false,
      authorizationDeclaration: true,
    },
    adminNotes: [
      {
        id: "note_seed_001",
        message: "Equipo con propuesta solida para fase de mentoria tecnica.",
        authorEmail: "admin@festivaldecodigo.dev",
        createdAt: now,
      },
    ],
    assignedChallengeId: "datapulse",
    createdAt: now,
    updatedAt: now,
  },
];

await Promise.all(
  challenges.map((challenge) =>
    db.collection("challenges").doc(challenge.id).set(challenge, { merge: true }),
  ),
);

await db.collection("editions").doc(editionId).set(edition, { merge: true });

await Promise.all(
  registrations.map((registration) =>
    db.collection("team_registrations").doc(registration.id).set(registration, { merge: true }),
  ),
);

console.log(
  `Firebase seed completed. Added ${registrations.length} team registrations in edition ${editionId}.`,
);

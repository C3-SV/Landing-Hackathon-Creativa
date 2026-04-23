import type { Challenge, Edition } from "@/lib/types/domain";

export const CURRENT_EDITION_FALLBACK = "hackathon-creativa-2026";

export const LANDING_QUICK_FACTS = [
  { label: "FECHA", value: "20-21 JUN 2026" },
  { label: "SEDE", value: "Key Institute · San Salvador, SV" },
  { label: "MODALIDAD", value: "Build-first presencial" },
  { label: "EQUIPOS", value: "3 personas · Hacker/Hipster/Hustler" },
  { label: "ENFOQUE", value: "Turismo · Economía creativa · Tecnología" },
] as const;

export const LANDING_BULLETS = [
  "Build-first",
  "Coopetencia y colaboración real",
  "Equipos híbridos",
  "Mentoría práctica",
] as const;

export const HOW_IT_WORKS = [
  "Inscribes a tu equipo completo de 3H.",
  "Eligen top 3 de retos desde el catálogo.",
  "Construyen prototipo funcional con mentoría.",
  "Presentan demo final con enfoque país.",
] as const;

export const FAQ_ITEMS = [
  {
    question: "¿Quién puede participar?",
    answer:
      "Personas de perfiles técnicos, creativos y de negocio interesadas en construir soluciones para turismo y economía creativa.",
  },
  {
    question: "¿La inscripción es por equipos?",
    answer:
      "Sí. Solo se aceptan equipos de 3 integrantes: Hacker, Hipster y Hustler.",
  },
  {
    question: "¿Cuánto dura la hackathon?",
    answer:
      "La experiencia se desarrolla durante dos días intensivos de construcción y demo.",
  },
  {
    question: "¿Qué debo llevar?",
    answer:
      "Laptop, cargador, documentos de identificación y ganas de construir en serio.",
  },
  {
    question: "¿Habrá mentorías?",
    answer:
      "Sí. Tendrás acompañamiento técnico y de producto durante la jornada.",
  },
  {
    question: "¿Cómo se evalúa?",
    answer:
      "Se evalúa ejecución, valor real para turismo, funcionalidad y claridad de la propuesta.",
  },
  {
    question: "¿Podemos elegir reto?",
    answer:
      "Sí. En el registro seleccionas 3 preferencias y la organización asigna según cupos y balance.",
  },
  {
    question: "¿Qué pasa después?",
    answer:
      "Recibirás seguimiento del estado de tu inscripción y próximos pasos por correo.",
  },
] as const;

export const CHALLENGE_SEEDS: Challenge[] = [
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
    description: "Contenido y marketing para PYMES turísticas.",
    hub: "Creative Growth",
    status: "confirmed",
  },
  {
    id: "ar-cultura",
    name: "AR Cultura",
    description: "Educación cultural inmersiva para turismo.",
    hub: "Immersive Tech",
    status: "confirmed",
  },
  {
    id: "ecotrack",
    name: "EcoTrack",
    description: "Turismo ecológico y sostenible.",
    hub: "Sustainability",
    status: "confirmed",
  },
  {
    id: "datapulse",
    name: "DataPulse",
    description:
      "Recopilación de información para decisiones turísticas. Placeholder/propuesto.",
    hub: "Intelligence",
    status: "proposed",
  },
  {
    id: "twinmap",
    name: "TwinMap",
    description: "Digital Twins aplicados a turismo. Placeholder/propuesto.",
    hub: "Spatial Tech",
    status: "proposed",
  },
];

export const EDITION_SEEDS: Edition[] = [
  {
    id: CURRENT_EDITION_FALLBACK,
    name: "Hackathon Creativa 2026",
    isCurrent: true,
    startsAt: "2026-06-20",
    endsAt: "2026-06-21",
    location: "Key Institute, San Salvador, SV",
  },
];

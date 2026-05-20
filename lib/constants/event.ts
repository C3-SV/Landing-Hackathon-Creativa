import { BRANDING } from "@/lib/constants/branding";
import type { Challenge, Edition } from "@/lib/types/domain";

export const CURRENT_EDITION_FALLBACK = BRANDING.editionFallbackId;

export const LANDING_QUICK_FACTS = [
  { label: "EVENTO", value: BRANDING.eventName },
  { label: "FECHA", value: "20 - 21 Junio" },
  { label: "SEDE", value: "Key Institute" },
  { label: "LÍNEA", value: BRANDING.thematicLine },
  { label: "ORGANIZAN", value: BRANDING.organizers },
] as const;

export const LANDING_BULLETS = [
  "Build-first",
  "Coopetencia y colaboración real",
  "Equipos híbridos",
  "Mentoría práctica",
] as const;

export const HOW_IT_WORKS = [
  "Inscribes a tu equipo completo de 3H.",
  "Eligen top 3 retos desde el catálogo.",
  "Construyen prototipo funcional con mentoría.",
  "Presentan demo final con enfoque país.",
] as const;

export const FAQ_ITEMS = [
  {
    question: "¿QUIÉN PUEDE PARTICIPAR?",
    answer:
      "Personas interesadas en turismo, tecnología, cultura, diseño, negocios, marketing, datos o creación de soluciones. No necesitas tener un perfil exclusivamente técnico.",
  },
  {
    question: "¿LA INSCRIPCIÓN ES POR EQUIPOS?",
    answer:
      "Sí. La inscripción se realiza por equipos. Cada equipo debe seleccionar sus 3 retos de preferencia durante el registro.",
  },
  {
    question: "¿CUÁNTO DURA EL FESTIVAL-HACKATHON?",
    answer:
      "El Festival de Código se desarrollará durante dos días, del 20 al 21 de junio, en Key Institute, San Salvador.",
  },
  {
    question: "¿NECESITO SABER PROGRAMAR?",
    answer:
      "No necesariamente. El evento está pensado para equipos multidisciplinarios. Puedes aportar desde diseño, investigación, negocio, turismo, contenido, datos, estrategia o tecnología.",
  },
  {
    question: "¿QUÉ SE DEBE ENTREGAR AL FINAL?",
    answer:
      "Cada equipo deberá presentar una propuesta demostrable: puede ser un prototipo, mockup funcional, demo, flujo de solución, presentación o una combinación de estos elementos.",
  },
  {
    question: "¿LOS RETOS SON REALES?",
    answer:
      "Sí. Cada reto plantea una oportunidad vinculada a turismo, cultura, tecnología y ejecución práctica en el contexto del país.",
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
    name: BRANDING.editionName,
    isCurrent: true,
    startsAt: "2026-06-20",
    endsAt: "2026-06-21",
    location: "Key Institute",
  },
];

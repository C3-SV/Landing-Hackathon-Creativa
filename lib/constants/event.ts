import { BRANDING } from "@/lib/constants/branding";
import type { Challenge, Edition } from "@/lib/types/domain";

export const CURRENT_EDITION_FALLBACK = BRANDING.editionFallbackId;

export const LANDING_QUICK_FACTS = [
  { label: "EVENTO", value: BRANDING.eventName },
  { label: "FECHA", value: "11 y 12 de julio" },
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
      "La competencia está dirigida a estudiantes universitarios y personas recién graduadas, con hasta 2 años de haber egresado. Pueden participar personas interesadas en turismo, tecnología, cultura, diseño, negocios, marketing, datos o creación de soluciones, y no necesitan un perfil exclusivamente técnico.",
  },
  {
    question: "¿LA INSCRIPCIÓN ES POR EQUIPOS?",
    answer:
      "Sí. La inscripción se realiza por equipos. Cada equipo debe seleccionar sus 3 retos de preferencia durante el registro.",
  },
  {
    question: "¿CUÁNTO DURA EL HACKATHON?",
    answer:
      "El Hackathon de Turismo Creativo I se desarrollará durante dos días, el 11 y 12 de julio, en Key Institute, San Salvador.",
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
  }
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
    name: "MarketPulse",
    description:
      "Herramienta inteligente de marketing turístico para micro emprendedores.",
    hub: "Smart Marketing",
    status: "confirmed",
  },
  {
    id: "ar-cultura",
    name: "CulturaXR",
    description: "Experiencias culturales inmersivas con realidad aumentada.",
    hub: "Interactive/AR Experience",
    status: "confirmed",
  },
  {
    id: "ecotrack",
    name: "ECOTRACK",
    description: "Turismo ecológico y sostenible.",
    hub: "Green Tourism",
    status: "confirmed",
  },
  {
    id: "datapulse",
    name: "DataTour",
    description: "Capa compartida de datos turísticos.",
    hub: "Data Platform",
    status: "confirmed",
  },
  {
    id: "twinmap",
    name: "TwinScape",
    description: "Digital Twin Turístico: territorio, datos y experiencia.",
    hub: "Digital Twin",
    status: "confirmed",
  },
];

export const EDITION_SEEDS: Edition[] = [
  {
    id: CURRENT_EDITION_FALLBACK,
    name: BRANDING.editionName,
    isCurrent: true,
    startsAt: "11 de julio",
    endsAt: "12 de julio",
    location: "Key Institute",
  },
];

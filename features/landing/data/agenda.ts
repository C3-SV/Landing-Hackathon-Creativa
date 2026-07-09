export type AgendaDay = "saturday" | "sunday";

export type AgendaCategory =
  | "registro"
  | "speaker"
  | "build"
  | "mentoría"
  | "comida"
  | "demo"
  | "cierre"
  | "otro";

export type AgendaItem = {
  time: string;
  activity: string;
  category?: AgendaCategory;
};

export const agendaTabs: Array<{ id: AgendaDay; label: string; fullLabel: string }> = [
  {
    id: "saturday",
    label: "Sábado 11",
    fullLabel: "Sábado 11 de Julio",
  },
  {
    id: "sunday",
    label: "Domingo 12",
    fullLabel: "Domingo 12 de Julio",
  },
];

export const agendaCategoryLabels: Record<AgendaCategory, string> = {
  registro: "REGISTRO",
  speaker: "SPEAKER",
  build: "BUILD",
  mentoría: "MENTORÍA",
  comida: "COMIDA",
  demo: "DEMO",
  cierre: "CIERRE",
  otro: "AGENDA",
};

export const agenda: Record<AgendaDay, AgendaItem[]> = {
  saturday: [
    {
      time: "7:30 – 8:30 am",
      activity: "Registro y Check-in",
      category: "registro",
    },
    {
      time: "8:30 – 8:35 am",
      activity: "Kickoff Oficial",
      category: "otro",
    },
    {
      time: "8:35 – 8:50 am",
      activity:
        "Palabras de Inauguración: Christopher Marroquín y Carlos Valladares, Co-organizadores; Francisco Sifontes, Rector de Key Institute; Lito Ibarra, Fundador SVNet y Padre del Internet",
      category: "speaker",
    },
    {
      time: "8:50 – 9:10 am",
      activity:
        "Speaker Internacional: Beno Juárez, Arq. - Simbiocretion Founder. 15 mins online + 5 mins Q&A",
      category: "speaker",
    },
    {
      time: "9:10 – 9:30 am",
      activity:
        "Speaker Nacional: Francisco Sifontes, Msc. Ing. - Rector Key Institute. 15 mins presencial + 5 mins Q&A",
      category: "speaker",
    },
    {
      time: "9:30 – 9:45 am",
      activity: "Presentación de Retos y Distribución de Hubs",
      category: "otro",
    },
    {
      time: "9:45 – 10:00 am",
      activity: "Traslado a Hubs de Innovación (3 diferentes Labs) + mini bio break",
      category: "otro",
    },
    {
      time: "10:00 – 12:30 pm",
      activity: "Build Block #1 + Microtaller: Plan de Construcción",
      category: "build",
    },
    {
      time: "12:30 – 1:30 pm",
      activity: "Almuerzo + Networking",
      category: "comida",
    },
    {
      time: "1:30 – 2:00 pm",
      activity: "Collab Rally",
      category: "otro",
    },
    {
      time: "2:00 – 4:00 pm",
      activity: "Build Block #2",
      category: "build",
    },
    {
      time: "4:00 – 5:30 pm",
      activity: "Mentor Round A (Insights by Discoverers Mentors)",
      category: "mentoría",
    },
    {
      time: "4:30 – 6:30 pm",
      activity: "Build Block #3",
      category: "build",
    },
    {
      time: "6:30 – 7:30 pm",
      activity: "Cena + Receso",
      category: "comida",
    },
    {
      time: "7:30 – 8:00 pm",
      activity: "Show & Share",
      category: "demo",
    },
    {
      time: "8:00 – 9:30 pm",
      activity: "Quiet Build",
      category: "build",
    },
    {
      time: "9:30 – 10:30 pm",
      activity: "Concierto",
      category: "otro",
    },
    {
      time: "11:00 pm en adelante",
      activity: "Construcción nocturna / Descanso opcional e iterativo",
      category: "build",
    },
  ],
  sunday: [
    {
      time: "6:30 – 7:30 am",
      activity: "Preparación Personal",
      category: "otro",
    },
    {
      time: "7:30 – 8:30 am",
      activity: "Desayuno",
      category: "comida",
    },
    {
      time: "8:30 – 10:00 am",
      activity: "Build Block #4 + Mentor Round B (Blocks by Builders Mentors)",
      category: "mentoría",
    },
    {
      time: "10:00 – 12:00 pm",
      activity: "Build Block #5 + Mentor Round C (Pitches by Sellers Mentors)",
      category: "mentoría",
    },
    {
      time: "12:00 – 1:00 pm",
      activity: "Almuerzo + Actividad de Demo Show",
      category: "comida",
    },
    {
      time: "1:00 – 3:00 pm",
      activity: "Sprint final: Entrega de Proyectos",
      category: "build",
    },
    {
      time: "3:00 – 3:15 pm",
      activity: "Receso Técnico",
      category: "otro",
    },
    {
      time: "3:30 – 5:00 pm",
      activity: "Demos Finales por Hubs de Innovación (3 diferentes Labs) a Panel de Jurados",
      category: "demo",
    },
    {
      time: "5:00 – 5:30 pm",
      activity: "Premiación y Clausura",
      category: "cierre",
    },
  ],
};

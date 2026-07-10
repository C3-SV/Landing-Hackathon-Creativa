export type AgendaDay = "saturday" | "sunday";

export type AgendaItem = {
  time: string;
  activity: string;
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

export const agenda: Record<AgendaDay, AgendaItem[]> = {
  saturday: [
    {
      time: "7:30 - 8:30 AM",
      activity: "Registro y Check-in",
    },
    {
      time: "8:30 - 8:35 AM",
      activity: "Kick-Off Oficial",
    },
    {
      time: "8:35 - 8:50 AM",
      activity: "Palabras de Inauguración",
    },
    {
      time: "8:50 - 9:10 AM",
      activity: "Speaker Internacional: Beno Juárez",
    },
    {
      time: "9:10 - 9:30 AM",
      activity: "Speaker Nacional: Francisco Sifontes",
    },
    {
      time: "9:30 - 9:45 AM",
      activity: "Presentación de Retos y Distribución de Hubs",
    },
    {
      time: "9:45 - 10:00 AM",
      activity: "Traslado a Hubs de Innovación (3 diferentes labs)",
    },
    {
      time: "10:00 – 12:30 pm",
      activity: "Build Block #1 + Microtaller: Plan de Construcción",
    },
    {
      time: "12:30 - 1:30 PM",
      activity: "Almuerzo + Networking",
    },
    {
      time: "1:30 - 2:00 PM",
      activity: "Collab Rally",
    },
    {
      time: "2:00 - 4:00 PM",
      activity: "Build Block #2",
    },
    {
      time: "4:00 - 5:30 PM",
      activity: "Mentor Round A (Insights by Discoverers Mentors)",
    },
    {
      time: "4:30 - 6:30 PM",
      activity: "Build Block #3",
    },
    {
      time: "6:30 - 7:30 PM",
      activity: "Cena + Receso",
    },
    {
      time: "7:30 - 8:00 PM",
      activity: "Show & Share",
    },
    {
      time: "8:00 - 9:30 PM",
      activity: "Quiet Build",
    },
    {
      time: "9:30 - 10:30 PM",
      activity: "Concierto",
    },
    {
      time: "11:00...",
      activity: "Construcción nocturna / Descanso (opcional e iterativo)",
    },
  ],
  sunday: [
    {
      time: "6:30 - 7:30 AM",
      activity: "Preparación Personal",
    },
    {
      time: "7:30 - 8:30 AM",
      activity: "Desayuno",
    },
    {
      time: "8:30 - 10:00 AM",
      activity: "Build Block #4 + Mentor Round B",
    },
    {
      time: "10:00 - 12:00 PM",
      activity: "Build Block #5 + Mentor Round C",
    },
    {
      time: "12:00 - 1:00 PM",
      activity: "Almuerzo + Actividad de Demo Show",
    },
    {
      time: "1:00 - 3:00 PM",
      activity: "Sprint final: Entrega de Proyectos",
    },
    {
      time: "3:00 - 3:15 PM",
      activity: "Receso Técnico",
    },
    {
      time: "3:30 - 5:00 PM",
      activity: "Demos Show por Hubs de Innovación",
    },
    {
      time: "5:00 - 5:30 PM",
      activity: "Premiación y Clausura",
    },
  ],
};

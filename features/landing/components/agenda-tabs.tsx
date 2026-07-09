import { type AgendaDay, agendaTabs } from "@/features/landing/data/agenda";
import { cn } from "@/lib/ui";

type AgendaTabsProps = {
  activeDay: AgendaDay;
  onChange: (day: AgendaDay) => void;
  panelId: string;
};

export function AgendaTabs({ activeDay, onChange, panelId }: AgendaTabsProps) {
  return (
    <div className="flex flex-wrap gap-3" aria-label="Seleccionar día de agenda">
      {agendaTabs.map((tab) => {
        const isActive = tab.id === activeDay;

        return (
          <button
            key={tab.id}
            id={`agenda-tab-${tab.id}`}
            type="button"
            aria-pressed={isActive}
            aria-controls={panelId}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex min-w-[9.5rem] items-center justify-center rounded-2xl border px-4 py-3 font-mono text-sm font-semibold tracking-[0.08em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg sm:px-5 sm:text-[0.95rem]",
              isActive
                ? "border-brand-orange-soft bg-brand-orange-soft text-brand-bg shadow-[0_10px_22px_rgba(255,107,0,0.22)]"
                : "border-brand-electric/45 bg-brand-surface/70 text-brand-white/84 hover:border-brand-electric/80 hover:bg-brand-surface hover:text-brand-white",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

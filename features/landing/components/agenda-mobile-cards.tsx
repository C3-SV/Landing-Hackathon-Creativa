import type { AgendaItem } from "@/features/landing/data/agenda";

type AgendaMobileCardsProps = {
  items: AgendaItem[];
};

export function AgendaMobileCards({ items }: AgendaMobileCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {items.map((item, index) => (
        <article
          key={`${item.time}-${index}`}
          className="relative overflow-hidden rounded-[1.5rem] border border-brand-electric/45 bg-brand-surface/88 p-4 shadow-[0_0_0_1px_rgba(26,130,255,0.14)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand-orange/70"
          />

          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="inline-flex rounded-full bg-brand-electric/10 px-3 py-1 font-mono text-sm font-semibold text-brand-white">
              {item.time}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-brand-white/90">{item.activity}</p>
        </article>
      ))}
    </div>
  );
}

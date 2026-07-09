import type { AgendaItem } from "@/features/landing/data/agenda";

type AgendaTableProps = {
  items: AgendaItem[];
};

export function AgendaTable({ items }: AgendaTableProps) {
  return (
    <div className="hidden md:block">
      <div className="overflow-hidden rounded-[1.75rem] border border-brand-electric/45 bg-brand-bg/28 shadow-[0_0_0_1px_rgba(26,130,255,0.12)]">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-[220px]" />
            <col />
          </colgroup>
          <thead>
            <tr className="bg-brand-surface/85">
              <th className="border-b border-brand-electric/35 px-6 py-4 text-left font-mono text-xs uppercase tracking-[0.22em] text-brand-electric sm:px-7">
                Hora
              </th>
              <th className="border-b border-brand-electric/35 px-6 py-4 text-left font-mono text-xs uppercase tracking-[0.22em] text-brand-electric sm:px-7">
                Actividad
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.time}-${index}`} className="align-top">
                <td
                  className={`px-6 py-5 font-mono text-sm font-semibold leading-relaxed text-brand-white/92 sm:px-7 ${
                    index < items.length - 1 ? "border-b border-brand-electric/18" : ""
                  }`}
                >
                  <span className="inline-block rounded-full bg-brand-electric/10 px-3 py-1 text-brand-white">
                    {item.time}
                  </span>
                </td>
                <td
                  className={`px-6 py-5 sm:px-7 ${
                    index < items.length - 1 ? "border-b border-brand-electric/18" : ""
                  }`}
                >
                  <p className="text-[0.98rem] leading-7 text-brand-white/90">{item.activity}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

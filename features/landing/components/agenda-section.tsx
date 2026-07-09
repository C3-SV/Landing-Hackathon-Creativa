"use client";

import { useId, useState } from "react";

import { AgendaMobileCards } from "@/features/landing/components/agenda-mobile-cards";
import { AgendaTable } from "@/features/landing/components/agenda-table";
import { AgendaTabs } from "@/features/landing/components/agenda-tabs";
import { agenda, agendaTabs, type AgendaDay } from "@/features/landing/data/agenda";

export function AgendaSection() {
  const [activeDay, setActiveDay] = useState<AgendaDay>("saturday");
  const panelId = useId();
  const activeItems = agenda[activeDay];
  const activeTab = agendaTabs.find((tab) => tab.id === activeDay) ?? agendaTabs[0];

  return (
    <section
      aria-labelledby="agenda-title"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[4.5rem] h-24 w-24 rounded-full bg-brand-electric/18 blur-3xl sm:h-32 sm:w-32" />
        <div className="absolute right-[10%] top-24 h-28 w-28 rounded-full bg-brand-orange/16 blur-3xl sm:h-40 sm:w-40" />
        <div className="absolute bottom-10 left-1/2 h-24 w-52 -translate-x-1/2 rounded-full bg-brand-electric/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-[min(1180px,calc(100%-2rem))]">
        <p className="inline-flex items-center rounded-full border border-brand-orange bg-brand-orange/8 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft shadow-[0_0_0_1px_rgba(255,167,38,0.14)] sm:px-5">
          {"{} 09 / AGENDA"}
        </p>

        <div className="mt-7 space-y-8 lg:space-y-10">
          <div className="max-w-[760px] space-y-4">
            <h2
              id="agenda-title"
              className="font-display text-[1.75rem] uppercase leading-[1.16] tracking-[0.04em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.5rem] lg:text-[3.85rem]"
            >
              Agenda
            </h2>

            <p className="max-w-[640px] text-base leading-relaxed text-brand-white/90 sm:text-lg">
              Dos días para construir, colaborar y demostrar.
            </p>
          </div>

          <div className="rounded-[2rem] border border-brand-electric/50 bg-[linear-gradient(180deg,rgba(13,45,94,0.94),rgba(10,31,61,0.9))] p-4 shadow-[0_0_0_1px_rgba(26,130,255,0.16),0_24px_44px_rgba(8,20,45,0.42)] sm:p-6 lg:p-8">
            <AgendaTabs activeDay={activeDay} onChange={setActiveDay} panelId={panelId} />

            <div
              id={panelId}
              className="mt-6 space-y-5 transition duration-200 motion-reduce:transition-none sm:mt-8"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-muted sm:text-sm">
                {activeTab.fullLabel}
              </p>

              <AgendaTable items={activeItems} />
              <AgendaMobileCards items={activeItems} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

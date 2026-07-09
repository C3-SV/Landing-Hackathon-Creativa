"use client";

import { useState } from "react";

import { FAQ_ITEMS } from "@/lib/constants/event";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <p className="inline-flex items-center rounded-full border border-brand-orange px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange-soft sm:px-5">
          {"{} 09 / FAQ"}
        </p>

        <h2 className="mt-7 font-display text-[1.7rem] uppercase leading-[1.2] tracking-[0.05em] text-brand-white [text-shadow:4px_4px_0_var(--brand-electric)] sm:text-[2.5rem] lg:text-[3.8rem]">
          PREGUNTAS FRECUENTES
        </h2>

        <p className="mt-8 max-w-[980px] text-base leading-relaxed text-brand-white/92 sm:text-lg">
          Una guía rápida para resolver dudas comunes antes de formar equipo e inscribirse.
        </p>

        <div className="mt-10 space-y-4 lg:mt-12">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;

            return (
              <article
                key={item.question}
                className={`group relative overflow-hidden rounded-3xl border bg-brand-surface/90 px-4 py-4 shadow-[0_0_0_1px_rgba(26,130,255,0.15)] transition duration-200 hover:bg-brand-surface sm:px-6 sm:py-5 ${
                  isOpen
                    ? "border-brand-orange/65 shadow-[0_0_0_1px_rgba(255,107,0,0.28)]"
                    : "border-brand-electric/50 hover:border-brand-electric/80"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-brand-white/70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-brand-white/70"
                />

                <button
                  type="button"
                  className="flex w-full items-start gap-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                >
                  <span className="flex-1 pr-2 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-brand-white sm:text-base">
                    {item.question}
                  </span>
                  <ChevronIcon isOpen={isOpen} />
                </button>

                <div
                  id={panelId}
                  className={`grid overflow-hidden transition-all duration-300 motion-reduce:transition-none ${
                    isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="min-h-0 overflow-hidden pr-8 text-sm leading-relaxed text-brand-muted sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 h-5 w-5 shrink-0 text-brand-orange-soft transition-transform duration-300 motion-reduce:transition-none ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

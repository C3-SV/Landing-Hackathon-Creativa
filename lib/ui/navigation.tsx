import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type SidebarItemProps = {
  title: string;
  subtitle?: string;
  active?: boolean;
  complete?: boolean;
  hasError?: boolean;
  onClick?: () => void;
};

export function SidebarItem({
  title,
  subtitle,
  active,
  complete,
  hasError,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border px-3.5 py-3.5 text-left transition duration-200",
        hasError
          ? "border-brand-action/70 bg-brand-surface shadow-[0_0_0_1px_rgba(255,84,84,0.2)]"
          : active
          ? "border-brand-orange/80 bg-brand-surface shadow-[0_0_0_1px_rgba(255,107,0,0.2)]"
          : complete
            ? "border-brand-orange/60 bg-brand-surface/90 shadow-[0_0_0_1px_rgba(255,107,0,0.12)]"
            : "border-brand-electric/35 bg-brand-surface/70 hover:border-brand-electric/70 hover:bg-brand-surface/90",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-white/70"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-brand-white">
          {title}
        </span>
        <span
          className={cn(
            "inline-flex h-2.5 w-2.5 rounded-full",
            hasError
              ? "bg-brand-action"
              : complete
                ? "bg-status-approved"
                : "bg-brand-muted/70",
          )}
        />
      </div>
      {subtitle ? <p className="mt-2 font-mono text-xs leading-relaxed text-brand-muted/90">{subtitle}</p> : null}
    </button>
  );
}

export function SectionWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-electric/45 bg-brand-surface/88 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.15)] sm:p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand-white/75"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-brand-white/75"
      />
      <h3 className="font-display text-[0.8rem] uppercase leading-relaxed text-brand-white sm:text-base">{title}</h3>
      {subtitle ? <p className="mt-2 font-mono text-sm leading-relaxed text-brand-muted">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

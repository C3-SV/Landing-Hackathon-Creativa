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
        "w-full rounded-xl border px-3 py-3 text-left transition",
        active
          ? "border-brand-electric bg-brand-electric/12"
          : "border-brand-electric/25 bg-brand-surface/40 hover:bg-brand-surface/70",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-brand-muted">
          {title}
        </span>
        <span
          className={cn(
            "inline-flex h-2.5 w-2.5 rounded-full",
            complete
              ? "bg-status-approved"
              : hasError
                ? "bg-status-rejected"
                : "bg-brand-muted/70",
          )}
        />
      </div>
      {subtitle ? <p className="mt-2 text-xs text-brand-muted/85">{subtitle}</p> : null}
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
    <section className="rounded-2xl border border-brand-electric/25 bg-brand-surface/75 p-5">
      <h3 className="font-display text-base uppercase text-brand-white sm:text-lg">{title}</h3>
      {subtitle ? <p className="mt-2 text-sm text-brand-muted">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

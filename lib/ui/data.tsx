import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { Card } from "@/lib/ui/card";

export function DataLabel({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="text-sm text-brand-white">{value}</p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card className="space-y-2 p-4">
      <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="text-2xl font-bold text-brand-white">{value}</p>
      {hint ? <p className="text-xs text-brand-muted">{hint}</p> : null}
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed border-brand-electric/40 text-center">
      <h3 className="font-display text-base uppercase text-brand-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}

export function AlertState({
  title,
  description,
  variant = "info",
}: {
  title: string;
  description: string;
  variant?: "info" | "warning" | "error";
}) {
  const variants = {
    info: "border-brand-electric/55 bg-brand-bg/70 text-brand-white",
    warning: "border-brand-orange-soft/55 bg-brand-bg/70 text-brand-orange-soft",
    error: "border-brand-action/70 bg-brand-bg/70 text-brand-white",
  } as const;

  return (
    <div role="alert" className={cn("rounded-2xl border p-3.5", variants[variant])}>
      <p className="font-mono text-xs uppercase tracking-[0.1em]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-brand-muted">{description}</p>
    </div>
  );
}

import { cn } from "@/lib/ui/cn";

type BadgeVariant =
  | "default"
  | "confirmed"
  | "proposed"
  | "submitted"
  | "approved"
  | "waitlist"
  | "rejected"
  | "needs_fix";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: "bg-brand-surface text-brand-muted border border-brand-electric/30",
  confirmed: "bg-brand-electric/20 text-brand-electric border border-brand-electric/40",
  proposed: "bg-brand-orange-soft/20 text-brand-orange-soft border border-brand-orange-soft/40",
  submitted: "bg-status-submitted/20 text-status-submitted border border-status-submitted/50",
  approved: "bg-status-approved/20 text-status-approved border border-status-approved/50",
  waitlist: "bg-status-waitlist/20 text-status-waitlist border border-status-waitlist/50",
  rejected: "bg-status-rejected/20 text-status-rejected border border-status-rejected/50",
  needs_fix: "bg-status-needs-fix/20 text-status-needs-fix border border-status-needs-fix/50",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide",
        badgeVariantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

import { agendaCategoryLabels, type AgendaCategory } from "@/features/landing/data/agenda";
import { Badge, cn } from "@/lib/ui";

const badgeStyles: Record<AgendaCategory, string> = {
  registro: "border-brand-electric/40 bg-brand-electric/12 text-brand-electric",
  speaker: "border-brand-orange/35 bg-brand-orange/12 text-brand-orange-soft",
  build: "border-brand-orange-soft/40 bg-brand-orange-soft/12 text-brand-orange-soft",
  mentoría: "border-brand-electric/35 bg-brand-electric/10 text-brand-white",
  comida: "border-brand-white/15 bg-brand-white/8 text-brand-white/88",
  demo: "border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
  cierre: "border-brand-orange-soft/45 bg-brand-orange-soft/16 text-brand-orange-soft",
  otro: "border-brand-electric/25 bg-brand-surface/70 text-brand-white/76",
};

type AgendaCategoryBadgeProps = {
  category?: AgendaCategory;
  className?: string;
};

export function AgendaCategoryBadge({ category, className }: AgendaCategoryBadgeProps) {
  if (!category) {
    return null;
  }

  return (
    <Badge
      variant="default"
      className={cn("px-2.5 py-1 text-[0.68rem] tracking-[0.14em]", badgeStyles[category], className)}
    >
      {agendaCategoryLabels[category]}
    </Badge>
  );
}

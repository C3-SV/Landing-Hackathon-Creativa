import { cn } from "@/lib/ui/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-lg uppercase leading-tight text-brand-white sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-brand-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

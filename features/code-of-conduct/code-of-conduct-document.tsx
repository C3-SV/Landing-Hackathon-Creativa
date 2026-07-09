import { codeOfConductSections } from "@/lib/code-of-conduct/content";
import { Card } from "@/lib/ui";
import { cn } from "@/lib/ui/cn";

export function CodeOfConductDocument({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[920px] space-y-4", className)}>
      {codeOfConductSections.map((section, index) => (
        <Card key={section.title} className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="min-w-12 font-display text-sm text-brand-orange-soft">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-sm uppercase leading-7 text-brand-white sm:text-base">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-brand-muted sm:text-[15px]">
                {section.content.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={
                      paragraph.startsWith("- ")
                        ? "pl-4 text-brand-white/85 before:mr-2 before:text-brand-orange-soft before:content-['•']"
                        : undefined
                    }
                  >
                    {paragraph.startsWith("- ") ? paragraph.slice(2) : paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

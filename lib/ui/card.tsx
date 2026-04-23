import type { HTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-electric/25 bg-brand-surface/80 p-5 shadow-[0_0_0_1px_rgba(26,130,255,0.08),0_16px_32px_rgba(10,31,61,0.5)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

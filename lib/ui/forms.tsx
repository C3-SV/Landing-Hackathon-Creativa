import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/ui/cn";

const fieldBase =
  "w-full rounded-xl border border-brand-electric/35 bg-brand-bg/55 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-mono text-xs uppercase tracking-wide text-brand-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-28", className)} {...props} />;
}

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function Checkbox({
  className,
  label,
  description,
  ...props
}: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-electric/25 bg-brand-bg/40 p-3">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-brand-electric/50 bg-brand-bg text-brand-orange focus-visible:ring-brand-electric",
          className,
        )}
        {...props}
      />
      <span>
        <span className="block text-sm font-medium text-brand-white">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-brand-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-status-rejected">{message}</p>;
}
